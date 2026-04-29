"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useTracks,
  VideoTrack,
  useRoomContext
} from "@livekit/components-react";
import { Track } from "livekit-client";

import {
  useInterview,
  useJoinInterview,
  useStartInterview,
  useMyApplication
} from "../../../hooks/useInterviews";

import useAuthStore from "../../../store/useAuthStore";
import Layout from "../../../components/Layout";
import ApplyModal from "../../../components/ApplyModal";
import ApplicationsList from "../../../components/ApplicationsList";

import {
  FiPlay,
  FiVideo,
  FiClock,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiMic,
  FiMicOff,
  FiVideoOff,
  FiPhoneOff
} from "react-icons/fi";


// ================= VIDEO GRID =================
function VideoGrid() {
  const tracks = useTracks([Track.Source.Camera]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 h-full w-full p-2">
      {tracks.map((track) => (
        <div
          key={track.sid}
          className="bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center"
        >
          <VideoTrack trackRef={track} />
        </div>
      ))}
    </div>
  );
}


// ================= CHAT PANEL =================
function ChatPanel() {
  return (
    <div className="w-[320px] bg-[#0f0f0f] border-l border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10 text-white font-semibold">
        Messages
      </div>

      <div className="flex-1 overflow-y-auto p-3 text-sm text-zinc-400">
        No messages yet
      </div>

      <div className="p-3 border-t border-white/10 flex gap-2">
        <input
          className="flex-1 bg-zinc-800 text-white px-3 py-2 rounded-lg outline-none"
          placeholder="Enter a message..."
        />
        <button className="bg-blue-500 px-4 rounded-lg text-white">
          Send
        </button>
      </div>
    </div>
  );
}


// ================= CONTROLS =================
function Controls() {
  const room = useRoomContext();
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);

  const toggleMic = async () => {
    await room.localParticipant.setMicrophoneEnabled(!mic);
    setMic(!mic);
  };

  const toggleCam = async () => {
    await room.localParticipant.setCameraEnabled(!cam);
    setCam(!cam);
  };

  const leaveRoom = () => {
    room.disconnect();
    window.location.reload();
  };

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-4 bg-black/60 backdrop-blur px-6 py-3 rounded-2xl">
      <button onClick={toggleMic} className="text-white">
        {mic ? <FiMic size={20} /> : <FiMicOff size={20} />}
      </button>

      <button onClick={toggleCam} className="text-white">
        {cam ? <FiVideo size={20} /> : <FiVideoOff size={20} />}
      </button>

      <button onClick={leaveRoom} className="text-red-500">
        <FiPhoneOff size={20} />
      </button>
    </div>
  );
}


// ================= MAIN ROOM UI =================
function CustomRoomUI() {
  return (
    <div className="flex h-screen w-screen bg-black">
      {/* VIDEO */}
      <div className="flex-1 relative">
        <VideoGrid />
        <Controls />
      </div>

      {/* CHAT */}
      <ChatPanel />
    </div>
  );
}


// ================= PAGE =================
export default function InterviewRoomPage() {
  const { id } = useParams();
  const router = useRouter();

  const { user, hasHydrated } = useAuthStore();
  const [joinedData, setJoinedData] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const { data: interview, isLoading: isLoadingInterview } = useInterview(id);
  const { data: myApplication, isLoading: isLoadingApp } = useMyApplication(id);

  const { mutate: joinRoom, isPending: isJoining, error: joinError } = useJoinInterview();
  const { mutate: startInterview, isPending: isStarting } = useStartInterview();

  useEffect(() => {
    if (hasHydrated && !user) router.push("/auth");
  }, [user, hasHydrated]);

  // ================= LOADING =================
  if (!hasHydrated || isLoadingInterview) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh] text-zinc-400">
          Loading...
        </div>
      </Layout>
    );
  }

  // ================= LIVE ROOM =================
  if (joinedData?.token) {
    return (
      <LiveKitRoom
        token={joinedData.token}
        serverUrl={joinedData.url}
        connect
        video
        audio
        className="h-screen w-screen"
      >
        <RoomAudioRenderer />
        <CustomRoomUI />
      </LiveKitRoom>
    );
  }

  // ================= NORMAL UI =================
  const isHost = interview.createdBy?._id === user?.id;
  const isStarted = interview.isStarted;

  const handleJoin = () => {
    joinRoom(id, {
      onSuccess: (data) => setJoinedData(data)
    });
  };

  if (isHost) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-10 px-4 text-white">
          <h1 className="text-2xl mb-4">{interview.title}</h1>

          {isStarted ? (
            <button
              onClick={handleJoin}
              className="bg-green-500 px-4 py-2 rounded"
            >
              Join Interview
            </button>
          ) : (
            <button
              onClick={() => startInterview(id)}
              className="bg-blue-500 px-4 py-2 rounded"
            >
              Start Interview
            </button>
          )}

          <ApplicationsList interviewId={id} />
        </div>
      </Layout>
    );
  }

  const appStatus = myApplication?.status;

  return (
    <Layout>
      <div className="text-center text-white py-20">
        <h1 className="text-2xl mb-4">{interview.title}</h1>

        {!myApplication && (
          <button
            onClick={() => setShowApplyModal(true)}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            Apply
          </button>
        )}

        {appStatus === "accepted" && isStarted && (
          <button
            onClick={handleJoin}
            className="bg-green-500 px-4 py-2 rounded mt-4"
          >
            Join Session
          </button>
        )}
      </div>

      {showApplyModal && (
        <ApplyModal
          interview={interview}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </Layout>
  );
}