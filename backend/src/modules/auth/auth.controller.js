import { registerUser } from "./auth.service.js";
import { loginUser } from "./auth.service.js";
import { refreshAccessToken } from "./auth.service.js";

export const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);

    res
      .cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false
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
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    res
      .cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
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
    res.status(400).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    const accessToken = await refreshAccessToken(token);

    res.status(200).json({
      success: true,
      accessToken
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

