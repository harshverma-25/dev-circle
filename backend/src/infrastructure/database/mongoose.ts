import mongoose from "mongoose";
import { env } from "../../config/env.js";
import { Logger } from "../logger/logger.js";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    Logger.info("✅ MongoDB Connected");
  } catch (error) {
    Logger.error("❌ MongoDB Connection Error", error);
    process.exit(1);
  }
};
