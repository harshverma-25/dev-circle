import express from "express";
import { body, param } from "express-validator";
import {
  createInterviewController,
  getInterviewsController,
  getInterviewByIdController,
  applyToInterviewController,
  getApplicationsController,
  getMyApplicationController,
  updateApplicationStatusController,
  startInterviewController,
  joinInterviewController,
  leaveInterviewController,
  kickParticipantController,
  getParticipantsController,
  heartbeatController,
} from "./interview.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

const router = express.Router();

// ─── Validation Rules ─────────────────────────────────────────────────────────

const createInterviewRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("scheduledAt").isISO8601().withMessage("Valid scheduledAt date is required"),
  body("duration")
    .isInt({ min: 5, max: 240 })
    .withMessage("Duration must be between 5 and 240 minutes"),
  body("maxParticipants")
    .optional()
    .isInt({ min: 2, max: 20 })
    .withMessage("maxParticipants must be between 2 and 20"),
];

const applyRules = [
  body("resumeUrl").trim().notEmpty().withMessage("Resume URL is required"),
  body("resumeType")
    .optional()
    .isIn(["link", "file"])
    .withMessage("resumeType must be 'link' or 'file'"),
];

const statusRules = [
  body("status")
    .isIn(["accepted", "rejected"])
    .withMessage("status must be 'accepted' or 'rejected'"),
];

const idParam       = [param("id").isMongoId().withMessage("Invalid interview ID")];
const userIdParam   = [param("userId").isMongoId().withMessage("Invalid user ID")];
const appIdParam    = [param("applicationId").isMongoId().withMessage("Invalid application ID")];

// ─── Routes ───────────────────────────────────────────────────────────────────
//
// ⚠️  ORDER MATTERS — specific paths MUST come before /:id wildcard routes.
//

// Create interview
router.post("/create", protect, createInterviewRules, validate, createInterviewController);

// List all interviews (public)
router.get("/list", getInterviewsController);

// Start interview (host only)
router.post("/start/:id", protect, idParam, validate, startInterviewController);

// Join interview (get LiveKit token)
router.get("/join/:id", protect, idParam, validate, joinInterviewController);

// Leave interview
router.post("/leave/:id", protect, idParam, validate, leaveInterviewController);

// Heartbeat
router.post("/heartbeat/:id", protect, idParam, validate, heartbeatController);

// Apply to interview  (candidate submits resume)
router.post("/apply/:id", protect, idParam, applyRules, validate, applyToInterviewController);

// Get all applications for an interview (host only)
router.get("/applications/:id", protect, idParam, validate, getApplicationsController);

// Get my application for an interview (candidate)
router.get("/my-application/:id", protect, idParam, validate, getMyApplicationController);

// Update application status — accept / reject (host only)
router.patch(
  "/applications/:applicationId/status",
  protect,
  appIdParam,
  statusRules,
  validate,
  updateApplicationStatusController
);

// Get active participants in a room
router.get("/participants/:id", protect, idParam, validate, getParticipantsController);

// Kick a participant (host only)
router.post("/kick/:id/:userId", protect, idParam, userIdParam, validate, kickParticipantController);

// ⚠️  KEEP THIS LAST — wildcard /:id must not shadow the routes above
router.get("/:id", idParam, validate, getInterviewByIdController);

export default router;
