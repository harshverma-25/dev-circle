import express from "express";
import { createInterviewController,getInterviewsController } from "./interview.controller.js";
import { protect } from "../../middleware/auth.middleware.js";


const router = express.Router();

router.post("/create", protect, createInterviewController);
router.get("/list", getInterviewsController);

export default router;