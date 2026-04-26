import dotenv from "dotenv";
dotenv.config(); // ← must run before anything else reads process.env

// Validate required environment variables
const requiredEnvVars = [
  "MONGO_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "LIVEKIT_API_KEY",
  "LIVEKIT_API_SECRET",
  "LIVEKIT_URL"
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  console.error("\nPlease check your .env file and restart the server.");
  process.exit(1);
}

// Warn if using weak JWT secrets in development
if (process.env.JWT_ACCESS_SECRET?.length < 32) {
  console.warn("⚠️  WARNING: JWT_ACCESS_SECRET is too short. Use a strong random string (32+ chars) in production.");
}

if (process.env.JWT_REFRESH_SECRET?.length < 32) {
  console.warn("⚠️  WARNING: JWT_REFRESH_SECRET is too short. Use a strong random string (32+ chars) in production.");
}

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  // Start cron jobs only after DB is ready (fixes A-6 / M-10)
  import("./utils/cronJobs.js");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});