import dotenv from "dotenv";
dotenv.config(); // Must run before any other module imports to load process.env

import { connectDB } from "./infrastructure/database/mongoose.js";
import { app } from "./app.js";
import { Logger } from "./infrastructure/logger/logger.js";

// Validate required environment variables for Auth
const requiredEnvVars = ["MONGO_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  Logger.error("❌ Missing required environment variables:");
  missingVars.forEach((varName) => Logger.error(`   - ${varName}`));
  Logger.error("Please check your .env file and restart the server.\n");
  process.exit(1);
}

// Warn if using weak secrets in development
if ((process.env.JWT_ACCESS_SECRET?.length || 0) < 32) {
  Logger.warn(
    "⚠️ WARNING: JWT_ACCESS_SECRET is too short. Use a strong random string (32+ chars) in production."
  );
}

if ((process.env.JWT_REFRESH_SECRET?.length || 0) < 32) {
  Logger.warn(
    "⚠️ WARNING: JWT_REFRESH_SECRET is too short. Use a strong random string (32+ chars) in production."
  );
}

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    Logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
});
