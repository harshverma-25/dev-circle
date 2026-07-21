import dotenv from "dotenv";
dotenv.config(); // Must be the very first thing — loads process.env before any other module

// Central config module validates all required env vars and exports typed constants.
// If any required var is missing, the import below will throw and terminate startup.
import { env } from "./config/env.js";

import { connectDB } from "./infrastructure/database/mongoose.js";
import { app } from "./app.js";
import { Logger } from "./infrastructure/logger/logger.js";
import { initNotificationListeners } from "./modules/notifications/services/notification.service.js";
import { registerMongooseHooks } from "./modules/notifications/hooks/mongoose.hooks.js";

connectDB().then(() => {
  initNotificationListeners();
  registerMongooseHooks();

  app.listen(env.PORT, () => {
    Logger.info(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
});
