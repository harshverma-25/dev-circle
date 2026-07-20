import { Router } from "express";
import { InterviewController } from "../controllers/interview.controller.js";
import { protect } from "../../../shared/middleware/auth.middleware.js";
import { validate } from "../../../shared/middleware/validate.middleware.js";
import { scheduleInterviewSchema, rescheduleInterviewSchema } from "../validators/interview.validator.js";

const router = Router();
const controller = new InterviewController();

// All interview endpoints require authentication
router.use(protect);

// ─── GET Routes (Order matters to prevent clashing with /:id) ─────────────────
router.get("/candidate/me", (req, res, next) =>
  controller.getCandidateInterviews(req, res, next)
);

router.get("/recruiter/me", (req, res, next) =>
  controller.getRecruiterInterviews(req, res, next)
);

router.get("/:id", (req, res, next) =>
  controller.getInterviewDetails(req, res, next)
);

// ─── Scheduling & Status Routes ─────────────────────────────────────────────
router.post("/", validate(scheduleInterviewSchema), (req, res, next) =>
  controller.scheduleInterview(req, res, next)
);

router.patch("/:id", validate(rescheduleInterviewSchema), (req, res, next) =>
  controller.rescheduleInterview(req, res, next)
);

router.patch("/:id/cancel", (req, res, next) =>
  controller.cancelInterview(req, res, next)
);

router.patch("/:id/complete", (req, res, next) =>
  controller.completeInterview(req, res, next)
);

export default router;
export { router as interviewRoutes };
