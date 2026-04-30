"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import InterviewCard from "../../components/InterviewCard";
import CreateInterviewModal from "../../components/CreateInterviewModal";
import { useInterviews } from "../../hooks/useInterviews";
import useAuthStore from "../../store/useAuthStore";
import { FiPlus, FiServer, FiLayers, FiCalendar, FiUsers, FiTrendingUp, FiGrid, FiList } from "react-icons/fi";

export default function InterviewPage() {
  const router = useRouter();
  const { user, hasHydrated } = useAuthStore();
  const { data: interviews, isLoading, isError, error } = useInterviews();

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // "all" | "hosting" | "applied"
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push("/auth");
    }
  }, [user, hasHydrated, router]);

  if (!hasHydrated || !user) return null;

  const filteredInterviews = interviews?.filter((interview) => {
    // 1. Lifecycle filter
    if (interview.status === "cancelled") return false;
    
    if (interview.status === "ended" && interview.endedAt) {
      const endedAt = new Date(interview.endedAt).getTime();
      const now = new Date().getTime();
      const diffMs = now - endedAt;
      if (diffMs > 60000) return false; // Hide after 1 minute
    }

    // 2. User tab filter
    if (filter === "hosting") return interview.createdBy?._id === user.id;
    if (filter === "applied") return interview.createdBy?._id !== user.id; 
    return true;
  });

  // Calculate statistics
  const stats = {
    total: filteredInterviews?.length || 0,
    live: filteredInterviews?.filter(i => i.status === "live").length || 0,
    upcoming: filteredInterviews?.filter(i => i.status === "scheduled").length || 0,
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black">
        <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        
          {/* HEADER SECTION */}
          <div className="relative mb-12">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-full text-zinc-300 text-xs font-semibold tracking-wide uppercase">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Live Platform
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-white via-white to-zinc-500 bg-clip-text text-transparent">
                    Live Interviews
                  </span>
                </h1>
                
                <p className="text-zinc-400 text-lg max-w-2xl">
                  Join real-time practice sessions with peers or host your own interview to gain experience.
                </p>
              </div>

              <button
                onClick={() => setOpen(true)}
                className="group relative bg-gradient-to-r from-[#adc6ff] to-[#8eaeff] text-[#002e6a] px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold shadow-lg hover:shadow-2xl hover:shadow-[#adc6ff]/30 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <FiPlus size={20} className="relative z-10" /> 
                <span className="relative z-10">Host Session</span>
              </button>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-500 text-sm">Total Sessions</p>
                  <p className="text-2xl md:text-3xl font-bold text-white mt-1">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <FiLayers className="text-blue-400" size={20} />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-500 text-sm">Live Now</p>
                  <p className="text-2xl md:text-3xl font-bold text-green-400 mt-1">{stats.live}</p>
                </div>
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <FiTrendingUp className="text-green-400" size={20} />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-500 text-sm">Upcoming</p>
                  <p className="text-2xl md:text-3xl font-bold text-purple-400 mt-1">{stats.upcoming}</p>
                </div>
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <FiCalendar className="text-purple-400" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* TABS & VIEW CONTROLS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  filter === "all" 
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <FiLayers size={16} /> All Sessions
              </button>
              <button
                onClick={() => setFilter("hosting")}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  filter === "hosting" 
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <FiServer size={16} /> My Sessions
              </button>
            </div>

            {/* View toggle - optional enhancement */}
            <div className="flex gap-1 bg-white/5 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"
                }`}
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"
                }`}
              >
                <FiList size={18} />
              </button>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className={`bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 backdrop-blur-sm animate-pulse rounded-2xl border border-white/5 ${
                    viewMode === "grid" ? "h-64" : "h-32"
                  }`}>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-white/10 rounded w-3/4"></div>
                      <div className="h-3 bg-white/5 rounded w-1/2"></div>
                      <div className="h-20 bg-white/5 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-400 p-8 rounded-2xl text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                  <FiServer className="w-8 h-8" />
                </div>
                <p className="text-lg font-semibold mb-2">Failed to load interviews</p>
                <p className="text-sm text-red-400/80">{error?.message || "Please try again later"}</p>
              </div>
            ) : filteredInterviews?.length === 0 ? (
              <div className="py-16 md:py-24 text-center bg-gradient-to-br from-zinc-900/30 to-black border border-dashed border-white/10 rounded-3xl backdrop-blur-sm">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <FiServer size={32} className="text-zinc-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500/20 rounded-full animate-ping"></div>
                </div>
                
                <h3 className="text-2xl text-white font-semibold mb-3">No sessions found</h3>
                <p className="text-zinc-500 max-w-md mx-auto mb-8 px-4">
                  {filter === "hosting" 
                    ? "You haven't created any interview sessions yet. Start hosting to gain experience!" 
                    : filter === "applied"
                    ? "You haven't applied to any sessions yet. Browse and apply to join interviews!"
                    : "There are no active interview sessions right now. Be the first to host one!"}
                </p>
                
                {(filter !== "hosting" || filteredInterviews?.length === 0) && (
                  <button
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 border border-white/10"
                  >
                    <FiPlus size={18} />
                    Host a Session
                  </button>
                )}
              </div>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {filteredInterviews?.map((item) => (
                  <InterviewCard key={item._id} interview={item} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>

          {/* MODAL */}
          {open && <CreateInterviewModal onClose={() => setOpen(false)} />}
        </div>
      </div>
    </Layout>
  );
}