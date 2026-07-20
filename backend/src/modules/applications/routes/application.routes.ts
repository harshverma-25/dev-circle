import { Router } from "express";
import { ApplicationController } from "../controllers/application.controller.js";
import { protect } from "../../../shared/middleware/auth.middleware.js";
import { validate } from "../../../shared/middleware/validate.middleware.js";
import { applySchema, updateStatusSchema } from "../validators/application.validator.js";

const router = Router();
const controller = new ApplicationController();

// Apply auth middleware globally to all application routes
router.use(protect);

router.post("/", validate(applySchema), (req, res, next) =>
  controller.apply(req, res, next)
);

router.get("/me", (req, res, next) =>
  controller.getMyApplications(req, res, next)
);

router.get("/job/:jobId", (req, res, next) =>
  controller.getJobApplications(req, res, next)
);

router.get("/:applicationId", (req, res, next) =>
  controller.getApplicationDetails(req, res, next)
);

router.patch("/:applicationId/status", validate(updateStatusSchema), (req, res, next) =>
  controller.updateStatus(req, res, next)
);

router.delete("/:applicationId", (req, res, next) =>
  controller.withdrawApplication(req, res, next)
);

export default router;
export { router as applicationRoutes };
