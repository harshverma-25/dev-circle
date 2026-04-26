import {
  createInterview,
  getInterviews,
  applyToInterview,
  startInterview,
  joinInterview,
  leaveInterview,
  kickParticipant,
  getParticipants,
  updateHeartbeat
} from "./interview.service.js";


export const createInterviewController = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const interview = await createInterview(req.body, userId);

    res.status(201).json({
      success: true,
      interview
    });
  } catch (error) {
    next(error);
  }
};

export const getInterviewsController = async (req, res, next) => {
  try {
    const interviews = await getInterviews();

    res.status(200).json({
      success: true,
      interviews
    });
  } catch (error) {
    next(error);
  }
};

export const applyToInterviewController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const application = await applyToInterview(id, userId);

    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    next(error);
  }
};

export const startInterviewController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const interview = await startInterview(id, userId);

    res.status(200).json({
      success: true,
      interview
    });
  } catch (error) {
    next(error);
  }
};

export const joinInterviewController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const data = await joinInterview(id, userId);

    res.status(200).json({
      success: true,
      ...data
    });
  } catch (error) {
    next(error);
  }
};

export const leaveInterviewController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    await leaveInterview(id, userId);

    res.status(200).json({
      success: true,
      message: "Left interview"
    });
  } catch (error) {
    next(error);
  }
};

export const kickParticipantController = async (req, res, next) => {
  try {
    const hostId = req.user.userId;
    const { id, userId } = req.params;

    await kickParticipant(id, userId, hostId);

    res.status(200).json({
      success: true,
      message: "User kicked"
    });
  } catch (error) {
    next(error);
  }
};

export const getParticipantsController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const participants = await getParticipants(id);

    res.status(200).json({
      success: true,
      participants
    });
  } catch (error) {
    next(error);
  }
};

export const heartbeatController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    await updateHeartbeat(id, userId);

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
