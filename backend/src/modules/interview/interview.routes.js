import express from "express";
import { createInterviewController,getInterviewsController, applyToInterviewController, startInterviewController } from "./interview.controller.js";
import { protect } from "../../middleware/auth.middleware.js";




const router = express.Router();

router.post("/create", protect, createInterviewController);
router.get("/list", getInterviewsController);
router.post("/apply/:id", protect, applyToInterviewController);
router.post("/start/:id", protect, startInterviewController);

export default router;