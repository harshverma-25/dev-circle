import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken
} from "../../utils/generateToken.js";

export const registerUser = async (data) => {
    const { name, email, password } = data;

  // check existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
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

  return { user, accessToken, refreshToken };
};

export const loginUser = async (data) => {
  const { email, password } = data;

  // check user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};