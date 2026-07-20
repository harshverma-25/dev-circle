import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.util.js";
import { UserRepository } from "../../modules/users/repositories/user.repository.js";
import { BannedUser } from "../../modules/admin/models/banned-user.model.js";
import { AuthenticationError, CustomError } from "../errors/custom.error.js";

const userRepo = new UserRepository();

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError("Authentication token is required", "UNAUTHORIZED");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    const user = await userRepo.findById(decoded.userId);
    if (!user) {
      throw new AuthenticationError("User session no longer exists", "UNAUTHORIZED");
    }

    // Check if the user is banned
    const isBanned = await BannedUser.exists({ userId: user._id });
    if (isBanned) {
      throw new AuthenticationError("Your account has been banned by the administrator", "BANNED");
    }

    if (!user.isVerified) {
      throw new CustomError("Email verification is required", 403, "EMAIL_NOT_VERIFIED");
    }

    // Attach user details to request object
    req.user = {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    next(error);
  }
};
