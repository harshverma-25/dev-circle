"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useJoinInterview, useInterview, useStartInterview } from "../../../hooks/useInterviews";
import useAuthStore from "../../../store/useAuthStore";

export default function InterviewRoomPage() {
  const { id } = useParams();
  const router = useRouter();

  const { user, hasHydrated } = useAuthStore();
  const [joinedData, setJoinedData] = useState(null);

  const { data: interview, isLoading } = useInterview(id);
  const { mutate: joinRoom, isPending, isError, error } = useJoinInterview();
  const { mutate: startInterview, isPending: isStarting } = useStartInterview();

  // 🔐 redirect after hydration
  useEffect(() => {
    if (hasHydrated && !user) {
      router.push("/auth");
    }
  }, [user, hasHydrated, router]);

  // 🟡 loading state
  if (!hasHydrated || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex h-screen items-center justify-center text-red-400">
        Interview not found
      </div>
    );
  }

  // Check if current user is the host
  const isHost = interview.createdBy?._id === user?.id;

  const handleJoin = () => {
    joinRoom(id, {
      onSuccess: (data) => {
        setJoinedData(data);
      },
    });
  };

  // 🟡 WAITING
  if (!interview.isStarted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0b0f] text-white">
        <div className="bg-white/5 border border-white/10 p-8 rounded-xl text-center max-w-md">
          <h1 className="text-xl font-semibold mb-2">
            {isHost ? "Ready to start?" : "Waiting for host..."}
          </h1>
  
          <p className="text-gray-400 text-sm mb-6">
            {isHost
              ? "You are the host. Start the interview when ready."
              : "Host hasn't started this interview yet."}
          </p>
  
          {isHost && (
            <button
              onClick={() => startInterview(id)}
              disabled={isStarting}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isStarting ? "Starting..." : "Start Interview"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // 🟢 READY TO JOIN
  if (!joinedData?.token) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0b0f] text-white">
        <div className="bg-white/5 border border-white/10 p-8 rounded-xl text-center max-w-md">

          <h1 className="text-xl font-semibold mb-4">
            Interview is Live 🚀
          </h1>

          {isError && (
            <p className="text-red-400 text-sm mb-3">
              {error?.response?.data?.message || error?.message}
            </p>
          )}

          <button
            onClick={handleJoin}
            disabled={isPending}
            className="bg-blue-400 text-black px-6 py-3 rounded-lg"
          >
            {isPending ? "Connecting..." : "Join Session"}
          </button>

        </div>
      </div>
    );
  }

  // 🔴 LIVE ROOM
  return (
    <div className="h-screen w-full bg-black">
      <LiveKitRoom
        token={joinedData.token}
        serverUrl={joinedData.url}
        connect
        video
        audio
        className="h-full"
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}