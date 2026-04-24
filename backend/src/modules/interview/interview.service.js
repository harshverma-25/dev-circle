import Interview from "../../models/interview.model.js";

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