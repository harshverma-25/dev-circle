import Interview from "../../models/interview.model.js";
import Application from "../../models/application.model.js";

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