import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { protect } from "../../../shared/middleware/auth.middleware.js";
import { AuthorizationError } from "../../../shared/errors/custom.error.js";

const router = Router();
const controller = new AdminController();

// Protect all routes under admin module, restricting to authenticated administrators only
router.use(protect);
router.use((req, res, next) => {
  if (req.user!.role !== "admin") {
    return next(new AuthorizationError("Only administrators are authorized to access this resource"));
  }
  next();
});

// Stats dashboard
router.get("/dashboard", (req, res, next) => controller.getDashboardStats(req, res, next));

// Users management
router.get("/users", (req, res, next) => controller.getUsers(req, res, next));
router.patch("/users/:id/ban", (req, res, next) => controller.banUser(req, res, next));
router.patch("/users/:id/activate", (req, res, next) => controller.activateUser(req, res, next));
router.delete("/users/:id", (req, res, next) => controller.deleteUser(req, res, next));

// Companies moderation
router.get("/companies", (req, res, next) => controller.getCompanies(req, res, next));
router.patch("/companies/:id/verify", (req, res, next) => controller.verifyCompany(req, res, next));
router.patch("/companies/:id/reject", (req, res, next) => controller.rejectCompany(req, res, next));
router.delete("/companies/:id", (req, res, next) => controller.deleteCompany(req, res, next));

// Jobs moderation
router.get("/jobs", (req, res, next) => controller.getJobs(req, res, next));
router.patch("/jobs/:id/close", (req, res, next) => controller.closeJob(req, res, next));
router.delete("/jobs/:id", (req, res, next) => controller.deleteJob(req, res, next));

export default router;
export { router as adminRoutes };
