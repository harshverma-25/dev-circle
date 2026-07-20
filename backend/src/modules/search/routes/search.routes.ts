import { Router } from "express";
import { SearchController } from "../controllers/search.controller.js";
import { protect } from "../../../shared/middleware/auth.middleware.js";

const router = Router();
const controller = new SearchController();

// Protect all search routes
router.use(protect);

router.get("/jobs", (req, res, next) => controller.searchJobs(req, res, next));
router.get("/developers", (req, res, next) => controller.searchDevelopers(req, res, next));
router.get("/companies", (req, res, next) => controller.searchCompanies(req, res, next));
router.get("/suggestions", (req, res, next) => controller.getSuggestions(req, res, next));

export default router;
export { router as searchRoutes };
