import dotenv from "dotenv";
dotenv.config(); // ← must run before anything else reads process.env

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