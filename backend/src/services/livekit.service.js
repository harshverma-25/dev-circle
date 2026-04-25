import { AccessToken } from "livekit-server-sdk";
import { generateLiveKitToken } from "../../services/livekit.service.js";

export const generateLiveKitToken = (roomName, userId) => {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: userId.toString()
    }
  );

  at.addGrant({
    roomJoin: true,
    room: roomName
  });

  return at.toJwt();
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

  // check capacity
  const count = await Application.countDocuments({ interviewId });

  if (count >= interview.maxParticipants) {
    throw new Error("Room is full");
  }

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

