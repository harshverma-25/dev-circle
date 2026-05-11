import jwt from "jsonwebtoken";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  googleLogin
} from "./auth.service.js";

export const googleAuth = async (req, res, next) => {
  try {
    const { token } = req.body;
    const result = await googleLogin(token);

    res
      .cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 365 * 24 * 60 * 60 * 1000 // 365 days
      })
      .status(200)
      .json({
        success: true,
        accessToken: result.accessToken,
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          avatar: result.user.avatar
        }
      });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);

    res
      .cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 365 * 24 * 60 * 60 * 1000 // 365 days
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
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 365 * 24 * 60 * 60 * 1000 // 365 days
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

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    if (!token) {
      return res.status(200).json({ message: "Already logged out" });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET
      );
      await logoutUser(decoded.userId);
    } catch (e) {
      // Ignore verification error on logout
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

