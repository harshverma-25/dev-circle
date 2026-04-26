import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../utils/AppError.js";
import {
  generateAccessToken,
  generateRefreshToken
} from "../../utils/generateToken.js";

export const registerUser = async (data) => {
    const { name, email, password } = data;

  // check existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    
  });

  // generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
    await user.save();

  return { user, accessToken, refreshToken };
};

export const loginUser = async (data) => {
  const { email, password } = data;

  // check user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  // generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  user.refreshToken = refreshToken;
    await user.save();

  return { user, accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("No refresh token", 401);
  }

  let decoded;

  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  // check in DB
  const user = await User.findById(decoded.userId);

  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError("Token not valid", 401);
  }

  // generate new access token
  const accessToken = generateAccessToken(user);

  return accessToken;
};

export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    refreshToken: null
  });
};