import Interview from "../../models/interview.model.js";
import Application from "../../models/application.model.js";
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
    throw new Error("Interview not found");
  }

  // check if already started
  if (interview.isStarted) {
    throw new Error("Interview already started");
  }

  // check duplicate (extra safety)
  const existing = await Application.findOne({
    interviewId,
    userId
  });

  if (existing) {
    throw new Error("Already applied");
  }

  // check participant count
  const count = await Application.countDocuments({ interviewId });

  if (count >= interview.maxParticipants) {
    throw new Error("Interview is full");
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
    throw new Error("Interview not found");
  }

  // check started
  if (!interview.isStarted) {
    throw new Error("Interview not started yet");
  }

  // check applied
  const application = await Application.findOne({
    interviewId,
    userId
  });

  if (!application) {
    throw new Error("You have not applied");
  }

  // check capacity (use ACTIVE participants now)
  const activeCount = await Participant.countDocuments({
    interviewId,
    isActive: true
  });

  if (activeCount >= interview.maxParticipants) {
    throw new Error("Room is full");
  }

  // ✅ TRACK PARTICIPANT HERE (THIS WAS YOUR QUESTION)
  await Participant.findOneAndUpdate(
    { interviewId, userId },
    { isActive: true },
    { upsert: true }
  );

  // generate token
  const token = generateLiveKitToken(
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
    throw new Error("Interview not found");
  }

  // check ownership
  if (interview.createdBy.toString() !== userId) {
    throw new Error("Not authorized");
  }

  // check already started
  if (interview.isStarted) {
    throw new Error("Interview already started");
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
    throw new Error("Not in interview");
  }

  participant.isActive = false;
  await participant.save();

  return true;
};

export const kickParticipant = async (interviewId, userId, hostId) => {
  const interview = await Interview.findById(interviewId);

  if (!interview) throw new Error("Interview not found");

  if (interview.createdBy.toString() !== hostId) {
    throw new Error("Not authorized");
  }

  const participant = await Participant.findOne({
    interviewId,
    userId
  });

  if (!participant) {
    throw new Error("User not in interview");
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
