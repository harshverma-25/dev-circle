import { AccessToken } from "livekit-server-sdk";

export const generateLiveKitToken = async (roomName, userId) => {
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

  const token = await at.toJwt(); // async in SDK v2+
  return token;
};
