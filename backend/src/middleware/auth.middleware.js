import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Not authorized", 401));
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Confirm user still exists in DB (catches deleted/banned accounts)
    const user = await User.findById(decoded.userId).select("-password -refreshToken");

    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    // Attach a consistent shape: { userId, name, email }
    req.user = {
      userId: user._id.toString(),
      name: user.name,
      email: user.email
    };

    next();
  } catch (error) {
    next(error);
  }
};