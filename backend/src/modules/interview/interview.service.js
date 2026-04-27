import Interview from "../../models/interview.model.js";
import Application from "../../models/application.model.js";
import Participant from "../../models/participant.model.js";
import { AppError } from "../../utils/AppError.js";
import { generateLiveKitToken } from "../../services/livekit.service.js";


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

  return interviews;
};


// ─── Get Single Interview ────────────────────────────────────────────────────

export const getInterviewById = async (interviewId) => {
  const interview = await Interview.findById(interviewId)
    .populate("createdBy", "name email");

  if (!interview) throw new AppError("Interview not found", 404);

  return interview;
};


// ─── Apply to Interview ──────────────────────────────────────────────────────

export const applyToInterview = async (interviewId, userId, resumeData) => {
  const { resumeUrl, resumeType = "link", cloudinaryPublicId = null } = resumeData;

  const interview = await Interview.findById(interviewId);
  if (!interview) throw new AppError("Interview not found", 404);

  if (interview.isStarted) throw new AppError("Interview already started", 409);

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
  const interview = await Interview.findById(interviewId);
  if (!interview) throw new AppError("Interview not found", 404);

  if (interview.createdBy.toString() !== userId) {
    throw new AppError("Not authorized", 403);
  }

  if (interview.isStarted) throw new AppError("Interview already started", 409);

  interview.isStarted = true;
  interview.startedAt = new Date();
  interview.roomName  = interview._id.toString();

  await interview.save();

  return interview;
};


// ─── Join Interview ──────────────────────────────────────────────────────────

export const joinInterview = async (interviewId, userId) => {
  const interview = await Interview.findById(interviewId);
  if (!interview) throw new AppError("Interview not found", 404);

  if (!interview.isStarted) throw new AppError("Interview has not started yet", 400);

  const isHost = interview.createdBy.toString() === userId;

  if (!isHost) {
    // Candidate must have an accepted application
    const application = await Application.findOne({ interviewId, userId });

    if (!application) throw new AppError("You have not applied for this interview", 400);

    if (application.status === "rejected") {
      throw new AppError("Your application was not accepted", 403);
    }

    if (application.status === "pending") {
      throw new AppError("Your application is still pending review", 403);
    }
  }

  // Track active participants
  await Participant.findOneAndUpdate(
    { interviewId, userId },
    { isActive: true, lastSeen: new Date() },
    { upsert: true, new: true }
  );

  const token = await generateLiveKitToken(interview.roomName, userId);

  return {
    token,
    roomName: interview.roomName,
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
