import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { protect } from "../../../shared/middleware/auth.middleware.js";
import { validate } from "../../../shared/middleware/validate.middleware.js";
import {
  uploadResumeMiddleware,
  uploadAvatarMiddleware
} from "../../../shared/middleware/upload.middleware.js";
import {
  updateProfileSchema,
  updateSkillsSchema,
  updateEducationSchema,
  updateExperienceSchema,
  updateSocialLinksSchema
} from "../validators/user.validator.js";

const router = Router();
const controller = new UserController();

// All routes here (except public developer profiles) require authentication
router.get("/me", protect, (req, res, next) =>
  controller.getProfile(req, res, next)
);

router.patch("/me", protect, validate(updateProfileSchema), (req, res, next) =>
  controller.updateProfile(req, res, next)
);

router.patch("/me/skills", protect, validate(updateSkillsSchema), (req, res, next) =>
  controller.updateSkills(req, res, next)
);

router.patch("/me/education", protect, validate(updateEducationSchema), (req, res, next) =>
  controller.updateEducation(req, res, next)
);

router.patch("/me/experience", protect, validate(updateExperienceSchema), (req, res, next) =>
  controller.updateExperience(req, res, next)
);

router.patch("/me/social-links", protect, validate(updateSocialLinksSchema), (req, res, next) =>
  controller.updateSocialLinks(req, res, next)
);

router.post("/me/resume", protect, uploadResumeMiddleware, (req, res, next) =>
  controller.uploadResume(req, res, next)
);

router.delete("/me/resume", protect, (req, res, next) =>
  controller.deleteResume(req, res, next)
);

router.post("/me/profile-picture", protect, uploadAvatarMiddleware, (req, res, next) =>
  controller.uploadProfilePicture(req, res, next)
);

router.delete("/me/profile-picture", protect, (req, res, next) =>
  controller.deleteProfilePicture(req, res, next)
);

// Public profile - NO authentication required
router.get("/dev/:username", (req, res, next) =>
  controller.getPublicProfile(req, res, next)
);

export default router;
export { router as userRoutes };
