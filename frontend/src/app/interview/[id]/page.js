"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useInterview, useJoinInterview, useStartInterview, useMyApplication } from "../../../hooks/useInterviews";
import useAuthStore from "../../../store/useAuthStore";
import ApplyModal from "../../../components/ApplyModal";
import ApplicationsList from "../../../components/ApplicationsList";
import Layout from "../../../components/Layout";
import { FiPlay, FiVideo, FiClock, FiFileText, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function InterviewRoomPage() {
  const { id } = useParams();
  
  const router = useRouter();
  const { user, hasHydrated } = useAuthStore();
  const [joinedData, setJoinedData] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Queries
  const { data: interview, isLoading: isLoadingInterview } = useInterview(id);
  const { data: myApplication, isLoading: isLoadingApp } = useMyApplication(id);
  
  // Mutations
  const { mutate: joinRoom, isPending: isJoining, error: joinError } = useJoinInterview();
  const { mutate: startInterview, isPending: isStarting } = useStartInterview();

  // Redirect unauthenticated
  useEffect(() => {
    if (hasHydrated && !user) {
      router.push("/auth");
    }
  }, [user, hasHydrated, router]);

  if (!hasHydrated || isLoadingInterview) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <FiClock size={32} className="text-zinc-600 animate-spin mb-4" />
          <p className="text-zinc-500">Loading interview details...</p>
        </div>
      </Layout>
    );
  }

  if (!interview) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-8 rounded-2xl text-center">
            <FiXCircle size={40} className="mx-auto mb-4 opacity-80" />
            <h2 className="text-xl font-bold mb-2">Interview Not Found</h2>
            <p className="text-red-400/80">This session may have been deleted or never existed.</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle active LiveKit room display first
  if (joinedData?.token) {
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

  // ─── Determine User Role & State ──────────────────────────────────────────────

  const isHost = interview.createdBy?._id === user?.id;
  const isStarted = interview.isStarted;

  const handleJoin = () => {
    joinRoom(id, {
      onSuccess: (data) => setJoinedData(data),
      onError: (err) => console.error(err)
    });
  };

  // ─── HOST VIEW ────────────────────────────────────────────────────────────────
  if (isHost) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-8 px-4">
          
          <div className="bg-[#141414] border border-white/10 rounded-3xl p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="inline-block px-3 py-1 bg-[#adc6ff]/10 text-[#adc6ff] border border-[#adc6ff]/20 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                  Host Dashboard
                </span>
                <h1 className="text-3xl text-white font-bold mb-2">{interview.title}</h1>
                <p className="text-zinc-400">Manage applicants and control your session.</p>
              </div>

              {isStarted ? (
                <div className="text-right">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-full text-sm font-semibold mb-4 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Live Now
                  </span>
                  <button
                    onClick={handleJoin}
                    disabled={isJoining}
                    className="w-full bg-emerald-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FiVideo size={18} /> Join as Host
                  </button>
                  {joinError && <p className="text-red-400 text-xs mt-2">{joinError.message}</p>}
                </div>
              ) : (
                <div className="text-right">
                  <span className="inline-block px-4 py-1.5 bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded-full text-sm font-semibold mb-4">
                    Waiting to start
                  </span>
                  <button
                    onClick={() => startInterview(id)}
                    disabled={isStarting}
                    className="w-full bg-[#adc6ff] text-[#002e6a] px-6 py-3 rounded-xl font-bold hover:brightness-110 shadow-[0_4px_20px_rgba(173,198,255,0.2)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FiPlay size={18} /> Start Interview
                  </button>
                </div>
              )}
            </div>
            
            <div className="border-t border-white/5 pt-8 mt-4">
              <h3 className="text-lg font-semibold text-white mb-4">Applicants</h3>
              <ApplicationsList interviewId={id} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ─── CANDIDATE VIEW ───────────────────────────────────────────────────────────
  
  const appStatus = myApplication?.status;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12 px-4">
        
        <div className="bg-[#141414] border border-white/10 rounded-3xl p-10 text-center">
          <h1 className="text-3xl text-white font-bold mb-4">{interview.title}</h1>
          <p className="text-zinc-400 mb-10 flex items-center justify-center gap-2">
            Host: <span className="font-medium text-zinc-300">{interview.createdBy?.name}</span>
          </p>

          <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-8 max-w-md mx-auto">
            
            {isLoadingApp ? (
              <div className="flex flex-col items-center">
                <FiClock size={24} className="text-zinc-600 animate-spin mb-3" />
                <p className="text-zinc-500 text-sm">Checking application status...</p>
              </div>
            ) : !myApplication ? (
              // 1. Not Applied
              <div>
                <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FiFileText size={28} />
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">Apply to Join</h3>
                <p className="text-zinc-400 text-sm mb-8">
                  Submit your resume to be considered for this practice session.
                </p>
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="w-full bg-[#adc6ff] text-[#002e6a] px-6 py-3.5 rounded-xl font-bold hover:brightness-110 transition-all text-sm"
                >
                  Apply Now
                </button>
              </div>
            ) : appStatus === "pending" ? (
              // 2. Applied - Pending
              <div>
                <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FiClock size={28} />
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">Application Under Review</h3>
                <p className="text-zinc-400 text-sm">
                  The host is currently reviewing your resume. Check back soon.
                </p>
              </div>
            ) : appStatus === "rejected" ? (
              // 3. Applied - Rejected
              <div>
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FiXCircle size={28} />
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">Not Selected</h3>
                <p className="text-zinc-400 text-sm">
                  Unfortunately, the host did not select your application for this session. Keep applying!
                </p>
              </div>
            ) : appStatus === "accepted" ? (
              // 4. Applied - Accepted
              <div>
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FiCheckCircle size={28} />
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">Application Accepted!</h3>
                
                {isStarted ? (
                  <div className="mt-6">
                    <p className="text-emerald-400/80 text-sm mb-6">The interview has started. You can join the room now.</p>
                    {joinError && <p className="text-red-400 text-xs mb-3">{joinError?.response?.data?.message || joinError.message}</p>}
                    <button
                      onClick={handleJoin}
                      disabled={isJoining}
                      className="w-full bg-emerald-500 text-black px-6 py-3.5 rounded-xl font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                    >
                      {isJoining ? "Connecting..." : <><FiVideo size={18} /> Join Session</>}
                    </button>
                  </div>
                ) : (
                  <p className="text-zinc-400 text-sm mt-4">
                    Waiting for the host to start the interview...
                  </p>
                )}
              </div>
            ) : null}

          </div>
        </div>

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