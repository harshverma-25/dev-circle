import { AccessToken } from "livekit-server-sdk";

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