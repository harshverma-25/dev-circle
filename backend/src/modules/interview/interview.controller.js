import { createInterview, getInterviews, applyToInterview, startInterview, joinInterview } from "./interview.service.js";


export const createInterviewController = async (req, res) => {
  try {
    const userId = req.user.userId;

    const interview = await createInterview(req.body, userId);

    res.status(201).json({
      success: true,
      interview
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getInterviewsController = async (req, res) => {
  try {
    const interviews = await getInterviews();

    res.status(200).json({
      success: true,
      interviews
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const applyToInterviewController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const application = await applyToInterview(id, userId);

    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const startInterviewController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const interview = await startInterview(id, userId);

    res.status(200).json({
      success: true,
      interview
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const joinInterviewController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const data = await joinInterview(id, userId);

    res.status(200).json({
      success: true,
      ...data
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const leaveInterviewController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    await leaveInterview(id, userId);

    res.status(200).json({
      success: true,
      message: "Left interview"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const kickParticipantController = async (req, res) => {
  try {
    const hostId = req.user.userId;
    const { id, userId } = req.params;

    await kickParticipant(id, userId, hostId);

    res.status(200).json({
      success: true,
      message: "User kicked"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getParticipantsController = async (req, res) => {
  try {
    const { id } = req.params;

    const participants = await getParticipants(id);

    res.status(200).json({
      success: true,
      participants
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const heartbeatController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    await updateHeartbeat(id, userId);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
