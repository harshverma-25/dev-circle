import { Router } from "express";
import multer from "multer";
import { AIController } from "../controllers/ai.controller.js";
import { protect } from "../../../shared/middleware/auth.middleware.js";
import { validate } from "../../../shared/middleware/validate.middleware.js";
import {
  skillGapSchema,
  candidateRankingSchema,
  interviewQuestionsSchema,
  jobDescriptionGenSchema,
  careerCoachSchema
} from "../validators/ai.validator.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const router = Router();
const controller = new AIController();

// Global protection for AI routes
router.use(protect);

router.post("/resume-analysis", upload.single("resume"), (req, res, next) =>
  controller.analyzeResume(req, res, next)
);

router.post("/ats-score", upload.single("resume"), (req, res, next) =>
  controller.getATSScore(req, res, next)
);

router.post("/resume-summary", upload.single("resume"), (req, res, next) =>
  controller.getResumeSummary(req, res, next)
);

router.post("/skill-gap", upload.single("resume"), validate(skillGapSchema), (req, res, next) =>
  controller.getSkillGap(req, res, next)
);

router.post("/candidate-ranking", validate(candidateRankingSchema), (req, res, next) =>
  controller.rankCandidates(req, res, next)
);

router.post("/interview-questions", validate(interviewQuestionsSchema), (req, res, next) =>
  controller.generateInterviewQuestions(req, res, next)
);

router.post("/job-description", validate(jobDescriptionGenSchema), (req, res, next) =>
  controller.generateJobDescription(req, res, next)
);

router.post("/career-coach", upload.single("resume"), validate(careerCoachSchema), (req, res, next) =>
  controller.careerCoach(req, res, next)
);

export default router;
export { router as aiRoutes };
