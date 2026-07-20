import { Router } from "express";
import { CompanyController } from "../controllers/company.controller.js";
import { protect } from "../../../shared/middleware/auth.middleware.js";
import { validate } from "../../../shared/middleware/validate.middleware.js";
import {
  uploadCompanyLogoMiddleware,
  uploadCompanyBannerMiddleware
} from "../../../shared/middleware/upload.middleware.js";
import {
  createCompanySchema,
  updateCompanySchema,
  inviteRecruiterSchema,
  updateMemberRoleSchema
} from "../validators/company.validator.js";

const router = Router();
const controller = new CompanyController();

// ─── Protected Routes ────────────────────────────────────────────────────────
// Check authenticated endpoints first
router.get("/me", protect, (req, res, next) =>
  controller.getMyCompanies(req, res, next)
);

router.post("/", protect, validate(createCompanySchema), (req, res, next) =>
  controller.createCompany(req, res, next)
);

router.put(
  "/:companyId",
  protect,
  validate(updateCompanySchema),
  (req, res, next) => controller.updateProfile(req, res, next)
);

router.post(
  "/:companyId/logo",
  protect,
  uploadCompanyLogoMiddleware,
  (req, res, next) => controller.uploadLogo(req, res, next)
);

router.delete("/:companyId/logo", protect, (req, res, next) =>
  controller.deleteLogo(req, res, next)
);

router.post(
  "/:companyId/banner",
  protect,
  uploadCompanyBannerMiddleware,
  (req, res, next) => controller.uploadBanner(req, res, next)
);

router.delete("/:companyId/banner", protect, (req, res, next) =>
  controller.deleteBanner(req, res, next)
);

router.get("/:companyId/members", protect, (req, res, next) =>
  controller.getMembers(req, res, next)
);

router.post(
  "/:companyId/members",
  protect,
  validate(inviteRecruiterSchema),
  (req, res, next) => controller.inviteRecruiter(req, res, next)
);

router.patch(
  "/:companyId/members/:memberId/role",
  protect,
  validate(updateMemberRoleSchema),
  (req, res, next) => controller.updateMemberRole(req, res, next)
);

router.delete("/:companyId/members/:memberId", protect, (req, res, next) =>
  controller.removeMember(req, res, next)
);

// ─── Public Routes ───────────────────────────────────────────────────────────
// GET /:slug is public and placed last to prevent clashing with GET /me
router.get("/:slug", (req, res, next) =>
  controller.getPublicProfile(req, res, next)
);

export default router;
export { router as companyRoutes };
