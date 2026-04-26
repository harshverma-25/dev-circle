import express from "express";
import { body, param } from "express-validator";
import {
  createInterviewController,
  getInterviewsController,
  getInterviewByIdController,
  applyToInterviewController,
  startInterviewController,
  joinInterviewController,
  leaveInterviewController,
  kickParticipantController,
  getParticipantsController,
  heartbeatController
} from "./interview.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

const router = express.Router();

const createInterviewRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("scheduledAt").isISO8601().withMessage("Valid scheduledAt date is required"),
  body("duration")
    .isInt({ min: 5, max: 240 })
    .withMessage("Duration must be between 5 and 240 minutes"),
  body("maxParticipants")
    .optional()
    .isInt({ min: 2, max: 20 })
    .withMessage("maxParticipants must be between 2 and 20")
];

// Reusable validation for interview ID parameter
const interviewIdValidation = [
  param("id").isMongoId().withMessage("Invalid interview ID")
];

// Validation for user ID parameter (used in kick route)
const userIdValidation = [
  param("userId").isMongoId().withMessage("Invalid user ID")
];

router.post("/create", protect, createInterviewRules, validate, createInterviewController);
router.get("/list", getInterviewsController);
router.get("/:id", interviewIdValidation, validate, getInterviewByIdController);
router.post("/apply/:id", protect, interviewIdValidation, validate, applyToInterviewController);
router.post("/start/:id", protect, interviewIdValidation, validate, startInterviewController);
router.get("/join/:id", protect, interviewIdValidation, validate, joinInterviewController);
router.post("/leave/:id", protect, interviewIdValidation, validate, leaveInterviewController);
router.post("/kick/:id/:userId", protect, interviewIdValidation, userIdValidation, validate, kickParticipantController);
router.get("/participants/:id", protect, interviewIdValidation, validate, getParticipantsController);
router.post("/heartbeat/:id", protect, interviewIdValidation, validate, heartbeatController);

export default router;
