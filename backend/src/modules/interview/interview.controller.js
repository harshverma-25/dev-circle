import {
  createInterview,
  getInterviews,
  getInterviewById,
  applyToInterview,
  getApplications,
  getMyApplication,
  updateApplicationStatus,
  startInterview,
  joinInterview,
  leaveInterview,
  kickParticipant,
  getParticipants,
  updateHeartbeat,
} from "./interview.service.js";


// ─── Create Interview ─────────────────────────────────────────────────────────

export const createInterviewController = async (req, res, next) => {
  try {
    const interview = await createInterview(req.body, req.user.userId);
    res.status(201).json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};


// ─── List Interviews ──────────────────────────────────────────────────────────

export const getInterviewsController = async (req, res, next) => {
  try {
    const interviews = await getInterviews();
    res.status(200).json({ success: true, interviews });
  } catch (error) {
    next(error);
  }
};


// ─── Get Single Interview ─────────────────────────────────────────────────────

export const getInterviewByIdController = async (req, res, next) => {
  try {
    const interview = await getInterviewById(req.params.id);
    res.status(200).json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};


// ─── Apply to Interview ───────────────────────────────────────────────────────

export const applyToInterviewController = async (req, res, next) => {
  try {
    const { resumeUrl, resumeType, cloudinaryPublicId } = req.body;

    const application = await applyToInterview(
      req.params.id,
      req.user.userId,
      { resumeUrl, resumeType, cloudinaryPublicId }
    );

    res.status(201).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};


// ─── Get Applications (Host Only) ─────────────────────────────────────────────

export const getApplicationsController = async (req, res, next) => {
  try {
    const applications = await getApplications(req.params.id, req.user.userId);
    res.status(200).json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};


// ─── Get My Application ───────────────────────────────────────────────────────

export const getMyApplicationController = async (req, res, next) => {
  try {
    const application = await getMyApplication(req.params.id, req.user.userId);
    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};


// ─── Update Application Status (Host Only) ────────────────────────────────────

export const updateApplicationStatusController = async (req, res, next) => {
  try {
    const { status } = req.body;
    const application = await updateApplicationStatus(
      req.params.applicationId,
      status,
      req.user.userId
    );
    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};


// ─── Start Interview ──────────────────────────────────────────────────────────

export const startInterviewController = async (req, res, next) => {
  try {
    const interview = await startInterview(req.params.id, req.user.userId);
    res.status(200).json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};


// ─── Join Interview ───────────────────────────────────────────────────────────

export const joinInterviewController = async (req, res, next) => {
  try {
    const data = await joinInterview(req.params.id, req.user.userId);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
};


// ─── Leave Interview ──────────────────────────────────────────────────────────

export const leaveInterviewController = async (req, res, next) => {
  try {
    await leaveInterview(req.params.id, req.user.userId);
    res.status(200).json({ success: true, message: "Left interview" });
  } catch (error) {
    next(error);
  }
};


// ─── Kick Participant ─────────────────────────────────────────────────────────

export const kickParticipantController = async (req, res, next) => {
  try {
    await kickParticipant(req.params.id, req.params.userId, req.user.userId);
    res.status(200).json({ success: true, message: "Participant removed" });
  } catch (error) {
    next(error);
  }
};


// ─── Get Participants ─────────────────────────────────────────────────────────

export const getParticipantsController = async (req, res, next) => {
  try {
    const participants = await getParticipants(req.params.id);
    res.status(200).json({ success: true, participants });
  } catch (error) {
    next(error);
  }
};


// ─── Heartbeat ────────────────────────────────────────────────────────────────

export const heartbeatController = async (req, res, next) => {
  try {
    await updateHeartbeat(req.params.id, req.user.userId);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
