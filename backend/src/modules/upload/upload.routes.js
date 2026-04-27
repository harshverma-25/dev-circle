import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { uploadResume } from "../../middleware/upload.middleware.js";
import { uploadResumeController } from "./upload.controller.js";

const router = express.Router();

/**
 * POST /api/upload/resume
 * Accepts a single file field named "resume"
 * Returns { url, publicId }
 */
router.post(
  "/resume",
  protect,
  (req, res, next) => {
    // Wrap multer so we can return a clean JSON error instead of crashing
    uploadResume(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  uploadResumeController
);

export default router;
