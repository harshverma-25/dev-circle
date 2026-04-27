"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import InterviewCard from "../../components/InterviewCard";
import CreateInterviewModal from "../../components/CreateInterviewModal";
import { useInterviews } from "../../hooks/useInterviews";
import useAuthStore from "../../store/useAuthStore";
import { FiPlus, FiServer, FiLayers } from "react-icons/fi";

export default function InterviewPage() {
  const router = useRouter();
  const { user, hasHydrated } = useAuthStore();
  const { data: interviews, isLoading, isError, error } = useInterviews();

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // "all" | "hosting" | "applied"

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push("/auth");
    }
  }, [user, hasHydrated, router]);

  if (!hasHydrated || !user) return null;

  const filteredInterviews = interviews?.filter((interview) => {
    if (filter === "hosting") return interview.createdBy?._id === user.id;
    // Note: We don't have enough data in the naive list to securely filter by 'applied' natively
    // We would need the backend list endpoint to either return an "hasApplied" boolean,
    // or we fetch user's applications. For now, "applied" can just mean "not hosting but active".
    // Alternatively, just hide the applied filter if not strictly needed.
    if (filter === "applied") return interview.createdBy?._id !== user.id; 
    return true;
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-zinc-400 text-xs font-semibold tracking-wide uppercase mb-4">
              Community Sessions
            </span>
            <h1 className="text-4xl text-white font-bold tracking-tight mb-2">Live Interviews</h1>
            <p className="text-zinc-400 text-lg">Join peers for real-time practice or host your own session.</p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-[#adc6ff] text-[#002e6a] px-6 py-3 rounded-xl font-bold hover:brightness-110 shadow-[0_4px_20px_rgba(173,198,255,0.2)] transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap"
          >
            <FiPlus size={20} /> Host Session
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 border-b border-white/10 pb-6 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              filter === "all" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <FiLayers size={16} /> All Sessions
          </button>
          <button
            onClick={() => setFilter("hosting")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              filter === "hosting" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <FiServer size={16} /> Hosting
          </button>
        </div>

        {/* CONTENT */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-[#141414] animate-pulse rounded-2xl border border-white/5"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center">
            <p>Failed to load interviews: {error?.message}</p>
          </div>
        ) : filteredInterviews?.length === 0 ? (
          <div className="py-20 text-center bg-[#141414] border border-dashed border-white/10 rounded-3xl">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-zinc-500">
              <FiServer size={28} />
            </div>
            <h3 className="text-xl text-white font-semibold mb-2">No sessions found</h3>
            <p className="text-zinc-500 max-w-sm mx-auto mb-8">
              {filter === "hosting" 
                ? "You haven't created any interview sessions yet." 
                : "There are no active interview sessions right now. Be the first to host one!"}
            </p>
            {filter !== "hosting" && (
              <button
                onClick={() => setOpen(true)}
                className="bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                Host a Session
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterviews?.map((item) => (
              <InterviewCard key={item._id} interview={item} />
            ))}
          </div>
        )}

        {/* MODAL */}
        {open && <CreateInterviewModal onClose={() => setOpen(false)} />}
      </div>
    </Layout>
  );
}