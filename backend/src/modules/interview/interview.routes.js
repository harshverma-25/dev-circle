import express from "express";
import { createInterviewController,getInterviewsController, applyToInterviewController, startInterviewController, joinInterviewController } from "./interview.controller.js";
import { protect } from "../../middleware/auth.middleware.js";



const router = express.Router();

router.post("/create", protect, createInterviewController);
router.get("/list", getInterviewsController);
router.post("/apply/:id", protect, applyToInterviewController);
router.post("/start/:id", protect, startInterviewController);
router.get("/join/:id", protect, joinInterviewController);
router.post("/leave/:id", protect, leaveInterviewController);
router.post("/kick/:id/:userId", protect, kickParticipantController);
router.get("/participants/:id", protect, getParticipantsController);
router.post("/heartbeat/:id", protect, heartbeatController);

export default router;