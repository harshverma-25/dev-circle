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
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiPhoneOff
} from "react-icons/fi";


// ================= VIDEO GRID =================
function VideoGrid() {
  const tracks = useTracks([Track.Source.Camera]);

  if (tracks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        No participants yet
      </div>
    );
  }

  return (
    <div
      className="grid gap-3 p-4 h-full w-full"
      style={{
        gridTemplateColumns:
          tracks.length === 1
            ? "1fr"
            : tracks.length === 2
            ? "1fr 1fr"
            : "repeat(auto-fit, minmax(250px, 1fr))"
      }}
    >
      {tracks.map((track) => {
        const metadata = track.participant.metadata
          ? JSON.parse(track.participant.metadata)
          : null;
        const name = metadata?.name || track.participant.identity;

        return (
          <div
            key={`${track.participant.identity}-${track.source}`}
            className="bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center relative"
          >
            <VideoTrack trackRef={track} />
            <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 text-xs rounded text-white z-10">
              {name}
            </div>
          </div>
        );
      })}
    </div>
  );
}


// ================= CHAT PANEL =================
function ChatPanel() {
  return (
    <div className="hidden md:flex w-[300px] flex-col bg-[#111] border-l border-white/10">
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
    <div className="w-full flex justify-center gap-6 py-4 bg-black border-t border-white/10">
      <button onClick={toggleMic} className="text-white">
        {mic ? <FiMic size={22} /> : <FiMicOff size={22} />}
      </button>

      <button onClick={toggleCam} className="text-white">
        {cam ? <FiVideo size={22} /> : <FiVideoOff size={22} />}
      </button>

      <button onClick={leaveRoom} className="text-red-500">
        <FiPhoneOff size={22} />
      </button>
    </div>
  );
}


// ================= MAIN ROOM UI =================
function CustomRoomUI() {
  return (
    <div className="flex flex-col h-screen w-screen bg-black">
      
      {/* TOP AREA */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* VIDEO AREA */}
        <div className="flex-1">
          <VideoGrid />
        </div>

        {/* CHAT */}
        <ChatPanel />
      </div>

      {/* CONTROLS */}
      <Controls />
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
  const { data: myApplication } = useMyApplication(id);

  const { mutate: joinRoom } = useJoinInterview();
  const { mutate: startInterview } = useStartInterview();

  useEffect(() => {
    if (hasHydrated && !user) router.push("/auth");
  }, [user, hasHydrated]);

  // LOADING
  if (!hasHydrated || isLoadingInterview) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh] text-zinc-400">
          Loading...
        </div>
      </Layout>
    );
  }

  // LIVE ROOM
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

  // NORMAL UI
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