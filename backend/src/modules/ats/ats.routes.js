import express from "express";
import multer from "multer";
import { analyzeResume } from "./ats.controller.js";
import { protect } from "../../middleware/auth.middleware.js"; // Assuming standard auth middleware

const router = express.Router();

// Configure multer for memory storage to parse PDF directly from buffer
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF format is allowed!"), false);
        }
    }
});

// Protect route to ensure user is logged in
router.post("/analyze", protect, upload.single("resume"), analyzeResume);

export default router;
