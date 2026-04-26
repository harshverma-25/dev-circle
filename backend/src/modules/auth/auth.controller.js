import jwt from "jsonwebtoken";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser
} from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);

    res
      .cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      .status(201)
      .json({
        success: true,
        accessToken: result.accessToken,
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
         
        }
      });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);

    res
      .cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      .status(200)
      .json({
        success: true,
        accessToken: result.accessToken,
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email
        }
      });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    const accessToken = await refreshAccessToken(token);

    res.status(200).json({
      success: true,
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(200).json({ message: "Already logged out" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    await logoutUser(decoded.userId);

    res
      .clearCookie("refreshToken")
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

