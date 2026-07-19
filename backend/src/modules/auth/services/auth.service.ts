import crypto from "crypto";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { UserRepository } from "../../users/repositories/user.repository.js";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository.js";
import { EmailVerificationRepository } from "../repositories/email-verification.repository.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../../../shared/utils/jwt.util.js";
import {
  ConflictError,
  AuthenticationError,
  CustomError,
  NotFoundError
} from "../../../shared/errors/custom.error.js";
import { sendVerificationEmail } from "../../../infrastructure/email/email.service.js";
import { IUserDocument } from "../../users/types/user.types.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
  private userRepo = new UserRepository();
  private tokenRepo = new RefreshTokenRepository();
  private verificationRepo = new EmailVerificationRepository();

  async register(data: any): Promise<void> {
    const { name, email, password, role } = data;

    // Check if user already exists
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new ConflictError("Email already registered", "EMAIL_ALREADY_EXISTS");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create unverified user account
    const user = await this.userRepo.create({
      name,
      email,
      password: hashedPassword,
      role,
      provider: "local",
      isVerified: false
    });

    // Create verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Expires in 24 hours

    await this.verificationRepo.create(user._id, token, expiresAt);

    // Trigger verification email sending
    await sendVerificationEmail(email, name, token);
  }

  async login(data: any): Promise<{ user: IUserDocument; accessToken: string; refreshToken: string }> {
    const { email, password } = data;

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AuthenticationError("Incorrect email or password", "INVALID_CREDENTIALS");
    }

    if (user.provider === "google") {
      throw new AuthenticationError(
        "This account uses Google Login. Please sign in with Google.",
        "INVALID_CREDENTIALS"
      );
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      throw new AuthenticationError("Incorrect email or password", "INVALID_CREDENTIALS");
    }

    // Check email verification status
    if (!user.isVerified) {
      throw new CustomError("Email is not verified.", 403, "EMAIL_NOT_VERIFIED");
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Save refresh token to DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days
    await this.tokenRepo.create(user._id, refreshToken, expiresAt);

    return { user, accessToken, refreshToken };
  }

  async googleLogin(idToken: string): Promise<{ user: IUserDocument; accessToken: string; refreshToken: string }> {
    if (!idToken) {
      throw new CustomError("Google token is required", 400, "VALIDATION_ERROR");
    }

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email || !payload.name) {
        throw new AuthenticationError("Google authentication failed", "UNAUTHORIZED");
      }

      const { email, name, sub: googleId, picture } = payload;

      let user = await this.userRepo.findByEmail(email);

      if (!user) {
        // Register Google user automatically with verified email status
        user = await this.userRepo.create({
          name,
          email,
          googleId,
          avatar: picture,
          provider: "google",
          isVerified: true,
          role: "student" // Default to student
        });
      } else {
        // Update user details if not set
        let updated = false;
        if (!user.googleId) {
          user.googleId = googleId;
          updated = true;
        }
        if (!user.avatar && picture) {
          user.avatar = picture;
          updated = true;
        }
        if (user.provider !== "google") {
          user.provider = "google";
          updated = true;
        }
        if (!user.isVerified) {
          user.isVerified = true;
          updated = true;
        }
        if (updated) {
          await this.userRepo.update(user._id, {
            googleId: user.googleId,
            avatar: user.avatar,
            provider: user.provider,
            isVerified: user.isVerified
          });
        }
      }

      // Generate session tokens
      const accessToken = generateAccessToken(user._id.toString());
      const refreshToken = generateRefreshToken(user._id.toString());

      // Save refresh token to DB
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days
      await this.tokenRepo.create(user._id, refreshToken, expiresAt);

      return { user, accessToken, refreshToken };
    } catch (error: any) {
      throw new AuthenticationError(
        "Google authentication failed: " + (error.message || ""),
        "UNAUTHORIZED"
      );
    }
  }

  async verifyEmail(token: string): Promise<void> {
    const verificationRecord = await this.verificationRepo.findByToken(token);
    if (!verificationRecord) {
      throw new CustomError("Invalid verification token.", 400, "INVALID_TOKEN");
    }

    if (verificationRecord.expiresAt < new Date()) {
      await this.verificationRepo.deleteByToken(token);
      throw new CustomError("Verification token has expired.", 400, "TOKEN_EXPIRED");
    }

    // Mark user as verified
    await this.userRepo.update(verificationRecord.userId, { isVerified: true });

    // Remove verification token
    await this.verificationRepo.deleteByToken(token);
  }

  async resendVerification(email: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundError("No account registered with this email address.");
    }

    if (user.isVerified) {
      throw new ConflictError("This email address has already been verified.");
    }

    // Remove any existing verification tokens
    await this.verificationRepo.deleteByUserId(user._id);

    // Create new token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Expires in 24 hours

    await this.verificationRepo.create(user._id, token, expiresAt);

    // Send email
    await sendVerificationEmail(email, user.name, token);
  }

  async refreshTokens(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    if (!token) {
      throw new AuthenticationError("Refresh token is required", "INVALID_REFRESH_TOKEN");
    }

    let decodedPayload;
    try {
      decodedPayload = verifyRefreshToken(token);
    } catch {
      throw new CustomError("Refresh token has expired or is invalid", 401, "SESSION_EXPIRED");
    }

    const tokenDoc = await this.tokenRepo.findByToken(token);
    if (!tokenDoc) {
      throw new AuthenticationError("Invalid refresh token", "INVALID_REFRESH_TOKEN");
    }

    if (tokenDoc.expiresAt < new Date()) {
      await this.tokenRepo.deleteByToken(token);
      throw new CustomError("Session has expired. Please log in again.", 401, "SESSION_EXPIRED");
    }

    // Perform Token Rotation
    await this.tokenRepo.deleteByToken(token);

    const newAccessToken = generateAccessToken(decodedPayload.userId);
    const newRefreshToken = generateRefreshToken(decodedPayload.userId);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.tokenRepo.create(decodedPayload.userId, newRefreshToken, expiresAt);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(token: string): Promise<void> {
    if (token) {
      await this.tokenRepo.deleteByToken(token);
    }
  }
}
