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
  useEndInterview,
  useCancelInterview,
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
  const { mutate: endInterview } = useEndInterview();
  const { mutate: cancelInterview } = useCancelInterview();

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
  const isLive = interview.status === "live";

  const handleJoin = () => {
    joinRoom(id, {
      onSuccess: (data) => setJoinedData(data)
    });
  };

  if (isHost) {
    const isCancelled = interview.status === "cancelled";
    const isEnded = interview.status === "ended";

    if (isCancelled) {
      return (
        <Layout>
          <div className="max-w-4xl mx-auto py-20 text-center text-red-400">
            <h1 className="text-2xl font-bold">This interview has been cancelled.</h1>
            <button onClick={() => router.push("/interview")} className="mt-4 text-white hover:underline">Go back</button>
          </div>
        </Layout>
      );
    }

    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-10 px-4 text-white">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold">{interview.title}</h1>
            <div className="flex gap-3">
              {isLive && !isEnded && (
                <button
                  onClick={() => endInterview(id, { onSuccess: () => router.push("/interview") })}
                  className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all"
                >
                  End Interview
                </button>
              )}
              {!isLive && (
                <button
                  onClick={() => cancelInterview(id, { onSuccess: () => router.push("/interview") })}
                  className="bg-white/5 text-zinc-400 border border-white/10 px-4 py-2 rounded-xl font-bold hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all"
                >
                  Delete Interview
                </button>
              )}
            </div>
          </div>

          <div className="bg-[#141414] border border-white/5 rounded-3xl p-8 mb-10">
            {isEnded ? (
               <div className="text-center py-6">
                  <p className="text-zinc-500 text-lg mb-4">This interview session has ended.</p>
                  <button onClick={() => router.push("/interview")} className="bg-white/10 px-6 py-2 rounded-xl">Back to List</button>
               </div>
            ) : isLive ? (
              <div className="text-center py-10">
                <p className="text-[#4edea3] font-bold mb-6 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-[#4edea3] rounded-full animate-pulse"></span>
                  SESSION IS LIVE
                </p>
                <button
                  onClick={handleJoin}
                  className="bg-[#4edea3] text-[#003824] px-10 py-4 rounded-2xl font-black text-xl hover:brightness-110 shadow-[0_10px_40px_rgba(78,222,163,0.3)] transition-all active:scale-95"
                >
                  Join Meeting Room
                </button>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-zinc-500 mb-6 font-medium">Ready to start the session?</p>
                <button
                  onClick={() => startInterview(id)}
                  className="bg-[#adc6ff] text-[#002e6a] px-10 py-4 rounded-2xl font-black text-xl hover:brightness-110 shadow-[0_10px_40px_rgba(173,198,255,0.3)] transition-all active:scale-95"
                >
                  Start Interview
                </button>
              </div>
            )}
          </div>

          {!isEnded && <ApplicationsList interviewId={id} />}
        </div>
      </Layout>
    );
  }

  const appStatus = myApplication?.status;
  const isEnded = interview.status === "ended";
  const isCancelled = interview.status === "cancelled";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-20 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">{interview.title}</h1>
        
        {isCancelled ? (
           <p className="text-red-400 text-lg">This interview has been cancelled by the host.</p>
        ) : isEnded ? (
           <p className="text-zinc-500 text-lg">This interview session has ended.</p>
        ) : (
          <>
            {!myApplication && (
              <button
                onClick={() => setShowApplyModal(true)}
                className="bg-[#adc6ff] text-[#002e6a] px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all"
              >
                Apply for Interview
              </button>
            )}

            {appStatus === "accepted" && isLive && (
              <div className="mt-8">
                 <p className="text-[#4edea3] font-bold mb-4 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-[#4edea3] rounded-full animate-pulse"></span>
                  INTERVIEW IS LIVE
                </p>
                <button
                  onClick={handleJoin}
                  className="bg-[#4edea3] text-[#003824] px-10 py-4 rounded-2xl font-black text-xl hover:brightness-110 shadow-[0_10px_40px_rgba(78,222,163,0.3)] transition-all active:scale-95"
                >
                  Join Meeting Room
                </button>
              </div>
            )}

            {appStatus === "accepted" && !isLive && (
              <p className="text-zinc-500 text-lg mt-4 italic">The host hasn't started the session yet. Hang tight!</p>
            )}

            {appStatus === "pending" && (
              <p className="text-orange-400 text-lg mt-4">Your application is under review.</p>
            )}

            {appStatus === "rejected" && (
              <p className="text-red-400 text-lg mt-4">Your application was not accepted for this session.</p>
            )}
          </>
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