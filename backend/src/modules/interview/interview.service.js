import Interview from "../../models/interview.model.js";
import Application from "../../models/application.model.js";
import Participant from "../../models/participant.model.js";
import { AppError } from "../../utils/AppError.js";
import { generateLiveKitToken } from "../../services/livekit.service.js";


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

export const getInterviews = async () => {
  const interviews = await Interview.find()
    .sort({ createdAt: -1 })
    .populate("createdBy", "name email");

  return interviews;
};

export const applyToInterview = async (interviewId, userId) => {
  // check interview exists
  const interview = await Interview.findById(interviewId);
  if (!interview) {
    throw new AppError("Interview not found", 404);
  }

  // check if already started
  if (interview.isStarted) {
    throw new AppError("Interview already started", 409);
  }

  // check duplicate (extra safety)
  const existing = await Application.findOne({
    interviewId,
    userId
  });

  if (existing) {
    throw new AppError("Already applied", 409);
  }

  // check capacity using APPLICATION count (prevent over-application)
  const applicationCount = await Application.countDocuments({
    interviewId
  });

  if (applicationCount >= interview.maxParticipants) {
    throw new AppError("Interview is full", 409);
  }

  // create application
  const application = await Application.create({
    interviewId,
    userId
  });

  return application;
};

export const joinInterview = async (interviewId, userId) => {
  const interview = await Interview.findById(interviewId);

  if (!interview) {
    throw new AppError("Interview not found", 404);
  }

  // check started
  if (!interview.isStarted) {
    throw new AppError("Interview not started yet", 400);
  }

  // check applied
  const application = await Application.findOne({
    interviewId,
    userId
  });

  if (!application) {
    throw new AppError("You have not applied", 400);
  }

  // check capacity (use ACTIVE participants now)
  const activeCount = await Participant.countDocuments({
    interviewId,
    isActive: true
  });

  if (activeCount >= interview.maxParticipants) {
    throw new AppError("Room is full", 409);
  }

  // ✅ TRACK PARTICIPANT HERE (THIS WAS YOUR QUESTION)
  await Participant.findOneAndUpdate(
    { interviewId, userId },
    {
      isActive: true,
      lastSeen: new Date()
    },
    { upsert: true, new: true }
  );

  // generate LiveKit token (async in SDK v2+)
  const token = await generateLiveKitToken(
    interview.roomName,
    userId
  );

  return {
    token,
    roomName: interview.roomName,
    url: process.env.LIVEKIT_URL
  };
};

export const startInterview = async (interviewId, userId) => {
  const interview = await Interview.findById(interviewId);

  if (!interview) {
    throw new AppError("Interview not found", 404);
  }

  // check ownership
  if (interview.createdBy.toString() !== userId) {
    throw new AppError("Not authorized", 403);
  }

  // check already started
  if (interview.isStarted) {
    throw new AppError("Interview already started", 409);
  }

  // start interview
  interview.isStarted = true;
  interview.startedAt = new Date();
  interview.roomName = interview._id.toString();

  await interview.save();

  return interview;
};

export const leaveInterview = async (interviewId, userId) => {
  const participant = await Participant.findOne({
    interviewId,
    userId
  });

  if (!participant) {
    throw new AppError("Not in interview", 400);
  }

  participant.isActive = false;
  await participant.save();

  return true;
};

export const kickParticipant = async (interviewId, userId, hostId) => {
  const interview = await Interview.findById(interviewId);

  if (!interview) throw new AppError("Interview not found", 404);

  if (interview.createdBy.toString() !== hostId) {
    throw new AppError("Not authorized", 403);
  }

  const participant = await Participant.findOne({
    interviewId,
    userId
  });

  if (!participant) {
    throw new AppError("User not in interview", 404);
  }

  participant.isActive = false;
  await participant.save();

  return true;
};

export const getParticipants = async (interviewId) => {
  return await Participant.find({
    interviewId,
    isActive: true
  }).populate("userId", "name email");
};

export const updateHeartbeat = async (interviewId, userId) => {
  await Participant.findOneAndUpdate(
    { interviewId, userId },
    {
      lastSeen: new Date(),
      isActive: true
    }
  );
};
