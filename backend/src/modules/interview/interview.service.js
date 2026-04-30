import Interview from "../../models/interview.model.js";
import Application from "../../models/application.model.js";
import Participant from "../../models/participant.model.js";
import { AppError } from "../../utils/AppError.js";
import User from "../../models/user.model.js";
import { generateLiveKitToken } from "../../services/livekit.service.js";


// ─── LIFECYCLE SYNC (Lazy Cleanup) ──────────────────────────────────────────
// NOTE: This logic replaces cron jobs for reliability on sleeping servers.

const checkAndApplyInterviewState = async (interview) => {
  if (!interview || !interview.scheduledAt || typeof interview.duration !== "number") return interview;

  const now = new Date();
  const scheduledTime = new Date(interview.scheduledAt).getTime();
  const durationMs = interview.duration * 60 * 1000;
  const sixHoursMs = 6 * 60 * 60 * 1000;

  // 1. ATOMIC UPDATE: If scheduled and 6+ hours past scheduledAt -> cancelled
  if (interview.status === "scheduled" && now.getTime() > (scheduledTime + sixHoursMs)) {
    const updated = await Interview.findOneAndUpdate(
      { _id: interview._id, status: "scheduled" },
      { $set: { status: "cancelled" } },
      { new: true }
    ).populate("createdBy", "name email");
    return updated || interview;
  }

  // 2. ATOMIC UPDATE: If live and past duration -> ended
  if (interview.status === "live" && now.getTime() > (scheduledTime + durationMs)) {
    const updated = await Interview.findOneAndUpdate(
      { _id: interview._id, status: "live" },
      { $set: { status: "ended", endedAt: now } },
      { new: true }
    ).populate("createdBy", "name email");
    return updated || interview;
  }

  return interview;
};


// ─── Create Interview ────────────────────────────────────────────────────────

export const createInterview = async (data, userId) => {
  const { title, scheduledAt, duration, maxParticipants } = data;

  const interview = await Interview.create({
    title,
    scheduledAt,
    duration,
    maxParticipants,
    createdBy: userId
  });

  return interview;
};


// ─── Get All Interviews ──────────────────────────────────────────────────────

export const getInterviews = async () => {
  const interviews = await Interview.find()
    .sort({ createdAt: -1 })
    .populate("createdBy", "name email");

  const now = new Date();

  // Optimized: Only trigger sync if state objectively needs changing
  const syncedInterviews = await Promise.all(interviews.map(async (i) => {
    const sTime = new Date(i.scheduledAt).getTime();
    const dMs = (i.duration || 0) * 60 * 1000;
    const expiryMs = 6 * 60 * 60 * 1000;

    const needsCancel = i.status === "scheduled" && now.getTime() > (sTime + expiryMs);
    const needsEnd = i.status === "live" && now.getTime() > (sTime + dMs);

    if (needsCancel || needsEnd) {
      return await checkAndApplyInterviewState(i);
    }
    return i;
  }));

  return syncedInterviews;
};


// ─── Get Single Interview ────────────────────────────────────────────────────

export const getInterviewById = async (interviewId) => {
  let interview = await Interview.findById(interviewId)
    .populate("createdBy", "name email");

  if (!interview) throw new AppError("Interview not found", 404);

  interview = await checkAndApplyInterviewState(interview);

  return interview;
};


// ─── Apply to Interview ──────────────────────────────────────────────────────

export const applyToInterview = async (interviewId, userId, resumeData) => {
  const { resumeUrl, resumeType = "link", cloudinaryPublicId = null } = resumeData;

  const interview = await Interview.findById(interviewId);
  if (!interview) throw new AppError("Interview not found", 404);

  if (interview.status !== "scheduled") {
    throw new AppError(`Cannot apply. Interview is currently ${interview.status}`, 409);
  }

  // Prevent double applying
  const existing = await Application.findOne({ interviewId, userId });
  if (existing) throw new AppError("You have already applied", 409);

  // Prevent over-capacity
  const applicationCount = await Application.countDocuments({ interviewId });
  if (applicationCount >= interview.maxParticipants) {
    throw new AppError("Interview is full", 409);
  }

  // Validate resume
  if (!resumeUrl) throw new AppError("Resume is required", 400);

  const application = await Application.create({
    interviewId,
    userId,
    resumeUrl,
    resumeType,
    cloudinaryPublicId,
    status: "pending"
  });

  return application;
};


// ─── Get Applications (Host Only) ────────────────────────────────────────────

export const getApplications = async (interviewId, hostId) => {
  const interview = await Interview.findById(interviewId);
  if (!interview) throw new AppError("Interview not found", 404);

  if (interview.createdBy.toString() !== hostId) {
    throw new AppError("Not authorized", 403);
  }

  const applications = await Application.find({ interviewId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  return applications;
};


// ─── Get My Application (Candidate) ─────────────────────────────────────────

export const getMyApplication = async (interviewId, userId) => {
  const application = await Application.findOne({ interviewId, userId });
  return application; // null means not applied yet
};


// ─── Update Application Status (Host Only) ───────────────────────────────────

export const updateApplicationStatus = async (applicationId, status, hostId) => {
  const application = await Application.findById(applicationId);
  if (!application) throw new AppError("Application not found", 404);

  const interview = await Interview.findById(application.interviewId);
  if (!interview) throw new AppError("Interview not found", 404);

  if (interview.createdBy.toString() !== hostId) {
    throw new AppError("Not authorized", 403);
  }

  application.status = status;
  await application.save();

  return application;
};


// ─── Start Interview (Host Only) ──────────────────────────────────────────────

export const startInterview = async (interviewId, userId) => {
  const result = await Interview.findOneAndUpdate(
    { _id: interviewId, createdBy: userId, status: "scheduled" },
    { 
      $set: { 
        status: "live", 
        startedAt: new Date(), 
        roomName: interviewId.toString() 
      } 
    },
    { new: true }
  );

  if (!result) throw new AppError("Cannot start. Interview may be already live or ended", 400);

  return result;
};


// ─── End Interview (Host Only) ────────────────────────────────────────────────

export const endInterview = async (interviewId, userId) => {
  const result = await Interview.findOneAndUpdate(
    { _id: interviewId, createdBy: userId, status: "live" },
    { $set: { status: "ended", endedAt: new Date() } },
    { new: true }
  );

  if (!result) throw new AppError("Cannot end. Session not live or not authorized", 403);

  return result;
};


// ─── Cancel Interview (Host Only) ─────────────────────────────────────────────

export const cancelInterview = async (interviewId, userId) => {
  const result = await Interview.findOneAndUpdate(
    { _id: interviewId, createdBy: userId, status: "scheduled" },
    { $set: { status: "cancelled" } },
    { new: true }
  );

  if (!result) throw new AppError("Cannot cancel. Session already live/ended or not authorized", 403);

  return result;
};


// TODO: Add cron job to delete ended/cancelled interviews after 24 hours to keep DB clean.


// ─── Join Interview ──────────────────────────────────────────────────────────

export const joinInterview = async (interviewId, userId) => {
  let interview = await Interview.findById(interviewId);

  if (!interview) {
    throw new AppError("Interview not found", 404);
  }

  interview = await checkAndApplyInterviewState(interview);

  if (interview.status !== "live") {
    throw new AppError(`Interview is currently ${interview.status}`, 400);
  }

  const isHost =
    interview.createdBy &&
    interview.createdBy.toString() === userId.toString();

  if (!isHost) {
    const application = await Application.findOne({
      interviewId,
      userId
    });

    if (!application || application.status !== "accepted") {
      throw new AppError("You are not allowed to join this interview", 403);
    }
  }

  const roomName = interview._id.toString();

  // ✅ use service (clean + safe)
  const token = await generateLiveKitToken(
    roomName,
    userId.toString()
  );

  return {
    token,
    url: process.env.LIVEKIT_URL,
  };
};


// ─── Leave Interview ──────────────────────────────────────────────────────────

export const leaveInterview = async (interviewId, userId) => {
  const participant = await Participant.findOne({ interviewId, userId });
  if (!participant) throw new AppError("Not in interview", 400);

  participant.isActive = false;
  await participant.save();

  return true;
};


// ─── Kick Participant (Host Only) ────────────────────────────────────────────

export const kickParticipant = async (interviewId, userId, hostId) => {
  const interview = await Interview.findById(interviewId);
  if (!interview) throw new AppError("Interview not found", 404);

  if (interview.createdBy.toString() !== hostId) {
    throw new AppError("Not authorized", 403);
  }

  const participant = await Participant.findOne({ interviewId, userId });
  if (!participant) throw new AppError("User not in interview", 404);

  participant.isActive = false;
  await participant.save();

  return true;
};


// ─── Get Participants ────────────────────────────────────────────────────────

export const getParticipants = async (interviewId) => {
  return await Participant.find({ interviewId, isActive: true })
    .populate("userId", "name email");
};


// ─── Heartbeat ───────────────────────────────────────────────────────────────

export const updateHeartbeat = async (interviewId, userId) => {
  await Participant.findOneAndUpdate(
    { interviewId, userId },
    { lastSeen: new Date(), isActive: true }
  );
};
