"use client";

import { use, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useJoinInterview } from "../../../hooks/useInterviews";

export default function InterviewRoomPage({ params }) {
  const { id } = use(params);
  const [joinedData, setJoinedData] = useState(null);

  const { mutate: joinRoom, isPending, isError, error } = useJoinInterview();

  const handleJoin = () => {
    joinRoom(id, {
      onSuccess: (data) => {
        setJoinedData(data);
      }
    });
  };

  if (!joinedData?.token) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-on-surface">
        <div className="glass-panel p-10 rounded-2xl max-w-md text-center flex flex-col items-center gap-6">
          <h1 className="text-2xl font-bold font-h2 text-primary">Ready to Join?</h1>
          <p className="text-on-surface-variant mb-4">
            Make sure your camera and microphone are ready before entering the interview session.
          </p>

          {isError && (
            <div className="w-full p-3 bg-error-container text-on-error-container rounded-lg text-sm mb-2">
              Could not join: {error?.response?.data?.message ?? error?.message}
            </div>
          )}

          <button
            onClick={handleJoin}
            disabled={isPending}
            className="w-full py-3 px-6 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary-fixed-dim transition-all disabled:opacity-50 pulse-glow"
          >
            {isPending ? "Connecting..." : "Join Session"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-surface-container-lowest">
      <LiveKitRoom
        token={joinedData.token}
        serverUrl={joinedData.url}
        connect={true}
        video={true}
        audio={true}
        className="h-full"
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}