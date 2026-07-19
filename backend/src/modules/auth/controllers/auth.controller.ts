import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

const cookieOptions = {
  httpOnly: true,
  secure: true, // Secure cookie as per API spec
  sameSite: "strict" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: "Registration successful. Please verify your email."
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, accessToken, refreshToken } = await authService.login(req.body);

      res
        .cookie("refreshToken", refreshToken, cookieOptions)
        .status(200)
        .json({
          success: true,
          message: "Login successful",
          data: {
            accessToken,
            user: {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role
            }
          }
        });
    } catch (error) {
      next(error);
    }
  }

  async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      const { user, accessToken, refreshToken } = await authService.googleLogin(token);

      res
        .cookie("refreshToken", refreshToken, cookieOptions)
        .status(200)
        .json({
          success: true,
          message: "Login successful",
          data: {
            accessToken,
            user: {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role
            }
          }
        });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      await authService.verifyEmail(token);

      res.status(200).json({
        success: true,
        message: "Email verified successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async resendVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      await authService.resendVerification(email);

      res.status(200).json({
        success: true,
        message: "Verification email sent successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies.refreshToken;
      const { accessToken, refreshToken: newRefreshToken } = await authService.refreshTokens(
        token
      );

      res
        .cookie("refreshToken", newRefreshToken, cookieOptions)
        .status(200)
        .json({
          success: true,
          data: {
            accessToken
          }
        });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies.refreshToken;
      await authService.logout(token);

      res
        .clearCookie("refreshToken", {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/"
        })
        .status(200)
        .json({
          success: true,
          message: "Logged out successfully."
        });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
          error: {
            code: "UNAUTHORIZED"
          }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: req.user.userId,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
