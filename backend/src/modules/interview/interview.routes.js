import express from "express";
import { body } from "express-validator";
import {
  createInterviewController,
  getInterviewsController,
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

router.post("/create", protect, createInterviewRules, validate, createInterviewController);
router.get("/list", getInterviewsController);
router.post("/apply/:id", protect, applyToInterviewController);
router.post("/start/:id", protect, startInterviewController);
router.get("/join/:id", protect, joinInterviewController);
router.post("/leave/:id", protect, leaveInterviewController);
router.post("/kick/:id/:userId", protect, kickParticipantController);
router.get("/participants/:id", protect, getParticipantsController);
router.post("/heartbeat/:id", protect, heartbeatController);

export default router;