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
  FiPhoneOff,
  FiMessageSquare,
  FiX,
  FiUsers,
  FiCalendar,
  FiClock,
  FiUser
} from "react-icons/fi";


// ================= VIDEO GRID =================
function VideoGrid() {
  const tracks = useTracks([Track.Source.Camera]);

  if (tracks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500 text-center p-4">
        <div>
          <FiUsers className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No participants yet</p>
          <p className="text-sm mt-1">Waiting for others to join...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid gap-3 p-4 h-full w-full auto-rows-fr"
      style={{
        gridTemplateColumns:
          tracks.length === 1
            ? "1fr"
            : tracks.length === 2
            ? "repeat(2, 1fr)"
            : tracks.length <= 4
            ? "repeat(2, 1fr)"
            : "repeat(auto-fit, minmax(280px, 1fr))"
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
            className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl overflow-hidden flex items-center justify-center relative group shadow-xl"
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
            <VideoTrack trackRef={track} className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white z-10 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {name}
            </div>
          </div>
        );
      })}
    </div>
  );
}


// ================= CHAT PANEL =================
function ChatPanel({ isOpen, onClose }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      // Chat logic will go here when implemented
      setMessage("");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile overlay */}
      <div className="fixed inset-0 bg-black/80 z-40 md:hidden" onClick={onClose} />
      
      {/* Chat panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[320px] md:w-[350px] bg-gradient-to-b from-zinc-900 to-black border-l border-white/10 flex flex-col z-50 shadow-2xl">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-white font-semibold">
            <FiMessageSquare className="text-blue-400" />
            <span>Messages</span>
          </div>
          <button onClick={onClose} className="md:hidden text-white/60 hover:text-white">
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
          <div className="text-center text-zinc-600 py-8">
            <p>No messages yet</p>
            <p className="text-xs mt-1">Be the first to send a message</p>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-zinc-800/50 text-white px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="Type a message..."
            />
            <button 
              onClick={handleSend}
              className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


// ================= CONTROLS =================
function Controls({ onChatToggle }) {
  const room = useRoomContext();
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  const toggleMic = async () => {
    await room.localParticipant.setMicrophoneEnabled(!mic);
    setMic(!mic);
  };

  const toggleCam = async () => {
    await room.localParticipant.setCameraEnabled(!cam);
    setCam(!cam);
  };

  const leaveRoom = () => {
    setIsLeaving(true);
    room.disconnect();
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="w-full flex justify-center gap-4 md:gap-6 py-4 px-4 bg-gradient-to-t from-black to-transparent backdrop-blur-sm border-t border-white/10">
      <button 
        onClick={toggleMic} 
        className={`p-3 md:p-4 rounded-full transition-all transform hover:scale-110 active:scale-95 ${
          mic 
            ? 'bg-zinc-700 hover:bg-zinc-600 text-white' 
            : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
        }`}
      >
        {mic ? <FiMic size={20} /> : <FiMicOff size={20} />}
      </button>

      <button 
        onClick={toggleCam} 
        className={`p-3 md:p-4 rounded-full transition-all transform hover:scale-110 active:scale-95 ${
          cam 
            ? 'bg-zinc-700 hover:bg-zinc-600 text-white' 
            : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
        }`}
      >
        {cam ? <FiVideo size={20} /> : <FiVideoOff size={20} />}
      </button>

      <button 
        onClick={onChatToggle}
        className="p-3 md:p-4 rounded-full bg-zinc-700 hover:bg-zinc-600 text-white transition-all transform hover:scale-110 active:scale-95 md:hidden"
      >
        <FiMessageSquare size={20} />
      </button>

      <button 
        onClick={leaveRoom} 
        disabled={isLeaving}
        className="p-3 md:p-4 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all transform hover:scale-110 active:scale-95 disabled:opacity-50"
      >
        <FiPhoneOff size={20} />
      </button>
    </div>
  );
}


// ================= MAIN ROOM UI =================
function CustomRoomUI() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-br from-zinc-900 to-black">
      
      {/* TOP AREA */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* VIDEO AREA */}
        <div className="flex-1 min-w-0">
          <VideoGrid />
        </div>

        {/* CHAT - Desktop */}
        <div className="hidden md:block">
          <ChatPanel isOpen={true} onClose={() => {}} />
        </div>

        {/* CHAT - Mobile */}
        <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>

      {/* CONTROLS */}
      <Controls onChatToggle={() => setIsChatOpen(!isChatOpen)} />
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
  }, [user, hasHydrated, router]);

  // LOADING
  if (!hasHydrated || isLoadingInterview) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-[60vh] text-zinc-400">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p>Loading interview details...</p>
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
          <div className="max-w-4xl mx-auto py-20 text-center px-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-12">
              <h1 className="text-3xl md:text-4xl font-bold text-red-400 mb-4">Interview Cancelled</h1>
              <p className="text-zinc-400 mb-6">This interview has been cancelled by the host.</p>
              <button 
                onClick={() => router.push("/interview")} 
                className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all"
              >
                Go back to interviews
              </button>
            </div>
          </div>
        </Layout>
      );
    }

    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-8 md:py-10 px-4 text-white">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                {interview.title}
              </h1>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-zinc-400">
                <div className="flex items-center gap-1">
                  <FiCalendar size={14} />
                  <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                </div>
                {interview.duration && (
                  <div className="flex items-center gap-1">
                    <FiClock size={14} />
                    <span>{interview.duration} min</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              {isLive && !isEnded && (
                <button
                  onClick={() => endInterview(id, { onSuccess: () => router.push("/interview") })}
                  className="flex-1 md:flex-none bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2.5 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all"
                >
                  End Interview
                </button>
              )}
              {!isLive && (
                <button
                  onClick={() => cancelInterview(id, { onSuccess: () => router.push("/interview") })}
                  className="flex-1 md:flex-none bg-white/5 text-zinc-400 border border-white/10 px-4 py-2.5 rounded-xl font-bold hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all"
                >
                  Delete Interview
                </button>
              )}
            </div>
          </div>

          {/* Main action card */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-black border border-white/10 rounded-3xl p-6 md:p-8 mb-10 backdrop-blur-sm">
            {isEnded ? (
              <div className="text-center py-6 md:py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                  <FiVideoOff className="w-8 h-8 text-zinc-500" />
                </div>
                <p className="text-zinc-500 text-lg mb-6">This interview session has ended.</p>
                <button 
                  onClick={() => router.push("/interview")} 
                  className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all font-medium"
                >
                  Back to List
                </button>
              </div>
            ) : isLive ? (
              <div className="text-center py-6 md:py-12">
                <div className="inline-flex items-center gap-2 bg-[#4edea3]/10 px-4 py-2 rounded-full mb-6">
                  <span className="w-2 h-2 bg-[#4edea3] rounded-full animate-pulse"></span>
                  <span className="text-[#4edea3] font-bold text-sm uppercase tracking-wide">Session is live</span>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-6">Ready to join the interview?</h3>
                <button
                  onClick={handleJoin}
                  className="bg-gradient-to-r from-[#4edea3] to-[#3abe8a] text-[#003824] px-8 md:px-12 py-4 rounded-2xl font-bold text-lg md:text-xl hover:shadow-2xl hover:shadow-[#4edea3]/30 transition-all active:scale-95"
                >
                  Join Meeting Room
                </button>
              </div>
            ) : (
              <div className="text-center py-6 md:py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <FiVideo className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-zinc-400 mb-6 font-medium">The interview hasn't started yet.</p>
                <button
                  onClick={() => startInterview(id)}
                  className="bg-gradient-to-r from-[#adc6ff] to-[#8eaeff] text-[#002e6a] px-8 md:px-12 py-4 rounded-2xl font-bold text-lg md:text-xl hover:shadow-2xl hover:shadow-[#adc6ff]/30 transition-all active:scale-95"
                >
                  Start Interview Session
                </button>
              </div>
            )}
          </div>

          {/* Applications */}
          {!isEnded && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiUsers />
                Applications
              </h2>
              <ApplicationsList interviewId={id} />
            </div>
          )}
        </div>
      </Layout>
    );
  }

  const appStatus = myApplication?.status;
  const isEnded = interview.status === "ended";
  const isCancelled = interview.status === "cancelled";

  // Participant view
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 md:py-20 px-4 text-center text-white">
        {/* Hero section */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <FiVideo className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            {interview.title}
          </h1>
          {interview.description && (
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">{interview.description}</p>
          )}
        </div>
        
        {isCancelled ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 md:p-12">
            <p className="text-red-400 text-lg">This interview has been cancelled by the host.</p>
          </div>
        ) : isEnded ? (
          <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 md:p-12">
            <p className="text-zinc-500 text-lg">This interview session has ended.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {!myApplication && (
              <button
                onClick={() => setShowApplyModal(true)}
                className="bg-gradient-to-r from-[#adc6ff] to-[#8eaeff] text-[#002e6a] px-8 md:px-10 py-3 md:py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-[#adc6ff]/30 transition-all transform hover:scale-105 active:scale-95"
              >
                Apply for Interview
              </button>
            )}

            {appStatus === "accepted" && isLive && (
              <div className="animate-fade-in">
                <div className="inline-flex items-center gap-2 bg-[#4edea3]/10 px-4 py-2 rounded-full mb-6">
                  <span className="w-2 h-2 bg-[#4edea3] rounded-full animate-pulse"></span>
                  <span className="text-[#4edea3] font-bold text-sm uppercase tracking-wide">Interview is live</span>
                </div>
                <div className="bg-gradient-to-br from-zinc-900/50 to-black border border-white/10 rounded-3xl p-8 md:p-12">
                  <h3 className="text-xl md:text-2xl font-semibold mb-6">You've been accepted!</h3>
                  <button
                    onClick={handleJoin}
                    className="bg-gradient-to-r from-[#4edea3] to-[#3abe8a] text-[#003824] px-10 md:px-12 py-4 rounded-2xl font-bold text-lg md:text-xl hover:shadow-2xl hover:shadow-[#4edea3]/30 transition-all active:scale-95"
                  >
                    Join Meeting Room Now
                  </button>
                </div>
              </div>
            )}

            {appStatus === "accepted" && !isLive && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 md:p-8">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <FiClock className="w-6 h-6 text-yellow-400" />
                </div>
                <p className="text-yellow-400 text-lg font-medium">Interview hasn't started yet</p>
                <p className="text-zinc-500 mt-2">The host will begin the session soon. Hang tight!</p>
              </div>
            )}

            {appStatus === "pending" && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 md:p-8">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-orange-400" />
                </div>
                <p className="text-orange-400 text-lg font-medium">Application Under Review</p>
                <p className="text-zinc-500 mt-2">The host is reviewing your application. You'll be notified once a decision is made.</p>
              </div>
            )}

            {appStatus === "rejected" && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 md:p-8">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500/20 flex items-center justify-center">
                  <FiX className="w-6 h-6 text-red-400" />
                </div>
                <p className="text-red-400 text-lg font-medium">Application Not Accepted</p>
                <p className="text-zinc-500 mt-2">Your application was not selected for this interview. Keep trying with other opportunities!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showApplyModal && (
        <ApplyModal
          interview={interview}
          onClose={() => setShowApplyModal(false)}
        />
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </Layout>
  );
}