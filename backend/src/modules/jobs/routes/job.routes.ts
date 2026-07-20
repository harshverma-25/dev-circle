import { Router } from "express";
import { JobController } from "../controllers/job.controller.js";
import { protect } from "../../../shared/middleware/auth.middleware.js";
import { validate } from "../../../shared/middleware/validate.middleware.js";
import {
  createJobSchema,
  updateJobSchema,
  searchJobsSchema
} from "../validators/job.validator.js";

const router = Router();
const controller = new JobController();

// ─── GET Routes (Order of registration matters) ─────────────────────────────
router.get("/", validate(searchJobsSchema), (req, res, next) =>
  controller.searchJobs(req, res, next)
);

router.get("/me", protect, (req, res, next) =>
  controller.getMyJobs(req, res, next)
);

router.get("/company/:companyId", (req, res, next) =>
  controller.getCompanyJobs(req, res, next)
);

router.get("/:slug", (req, res, next) =>
  controller.getPublicJob(req, res, next)
);

// ─── Writing & Modifying Routes ─────────────────────────────────────────────
router.post("/", protect, validate(createJobSchema), (req, res, next) =>
  controller.createJob(req, res, next)
);

router.put("/:jobId", protect, validate(updateJobSchema), (req, res, next) =>
  controller.updateJob(req, res, next)
);

router.delete("/:jobId", protect, (req, res, next) =>
  controller.deleteJob(req, res, next)
);

// ─── Status Modification Routes ──────────────────────────────────────────────
router.patch("/:jobId/publish", protect, (req, res, next) =>
  controller.publishJob(req, res, next)
);

router.patch("/:jobId/close", protect, (req, res, next) =>
  controller.closeJob(req, res, next)
);

router.patch("/:jobId/archive", protect, (req, res, next) =>
  controller.archiveJob(req, res, next)
);

export default router;
export { router as jobRoutes };
