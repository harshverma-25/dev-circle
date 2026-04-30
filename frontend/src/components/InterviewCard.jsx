"use client";

import { useRouter } from "next/navigation";
import { FiClock, FiUsers, FiArrowRight, FiCalendar, FiUser, FiEye, FiActivity } from "react-icons/fi";

export default function InterviewCard({ interview }) {
  const router = useRouter();

  const isLive = interview.status === "live";
  const isEnded = interview.status === "ended" || interview.status === "cancelled";
  
  const statusConfig = {
    label: isLive ? "LIVE NOW" : isEnded ? "ENDED" : "UPCOMING",
    color: isLive 
      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
      : isEnded 
      ? "bg-zinc-500/20 text-zinc-400 border-zinc-500/30" 
      : "bg-amber-500/20 text-amber-400 border-amber-500/30",
    dot: isLive ? "bg-emerald-500" : isEnded ? "bg-zinc-500" : "bg-amber-500"
  };
  
  const dateStr = new Date(interview.scheduledAt).toLocaleDateString(undefined, {
    month: "short", 
    day: "numeric", 
    hour: "numeric", 
    minute: "2-digit"
  });

  const participantCount = interview.applications?.length || 0;
  const isFull = participantCount >= interview.maxParticipants;
  const isAlmostFull = participantCount >= interview.maxParticipants - 1 && !isFull;

  return (
    <div className="group relative bg-gradient-to-br from-zinc-900/80 to-black border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#adc6ff]/5 hover:-translate-y-1">
      {/* Hover Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#adc6ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Status Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${isLive ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : isEnded ? 'bg-zinc-600' : 'bg-gradient-to-r from-amber-500 to-amber-400'}`}></div>
      
      <div className="p-5 sm:p-6 relative z-10">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
          <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusConfig.color}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} ${isLive ? 'animate-pulse' : ''}`}></div>
            {statusConfig.label}
          </div>
          
          <div className="flex items-center gap-1.5 text-zinc-500 text-xs bg-white/5 px-2.5 py-1 rounded-full">
            <FiCalendar size={11} />
            <span>{dateStr}</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 line-clamp-1 group-hover:text-[#adc6ff] transition-colors duration-300">
          {interview.title}
        </h2>

        {/* Host Info - FIXED: Changed div to span inside p tag */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-zinc-400 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#adc6ff]/20 to-purple-500/20 flex items-center justify-center text-[10px] font-bold text-white border border-white/10">
              {interview.createdBy?.name?.[0]?.toUpperCase() || "?"}
            </span>
            <span className="text-zinc-500">Host:</span>
            <span className="text-zinc-300 font-medium">{interview.createdBy?.name || "Unknown"}</span>
          </p>
          
          {/* Participant Count Badge */}
          <div className="flex items-center gap-1 text-xs">
            <div className="flex -space-x-1">
              {[...Array(Math.min(3, participantCount))].map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-[#adc6ff]/30 to-purple-500/30 border border-white/10 flex items-center justify-center text-[8px] font-bold text-white">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              {participantCount > 3 && (
                <div className="w-5 h-5 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[8px] font-bold text-zinc-400">
                  +{participantCount - 3}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-zinc-500 text-xs font-medium uppercase tracking-wide">Capacity</span>
              <FiUsers size={14} className={`${isFull ? 'text-red-400' : isAlmostFull ? 'text-amber-400' : 'text-[#adc6ff]'}`} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white">{participantCount}</span>
              <span className="text-zinc-600 text-sm">/ {interview.maxParticipants}</span>
            </div>
            {isFull && (
              <p className="text-[10px] text-red-400 mt-1">Fully booked</p>
            )}
            {isAlmostFull && !isFull && (
              <p className="text-[10px] text-amber-400 mt-1">Only 1 spot left!</p>
            )}
          </div>
          
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-zinc-500 text-xs font-medium uppercase tracking-wide">Status</span>
              <FiActivity size={14} className={isLive ? 'text-emerald-400' : 'text-zinc-500'} />
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-sm font-semibold ${isLive ? 'text-emerald-400' : isEnded ? 'text-zinc-400' : 'text-amber-400'}`}>
                {isLive ? 'Active Session' : isEnded ? 'Completed' : 'Scheduled'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => router.push(`/interview/${interview._id}`)}
          className="relative w-full group/btn flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-white/5 to-white/2 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95 overflow-hidden"
        >
          <span className="text-sm flex items-center gap-2">
            {isLive ? (
              <>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                Join Session
              </>
            ) : isEnded ? (
              'View Results'
            ) : (
              'View Details'
            )}
          </span>
          <div className="flex items-center gap-1 text-[#adc6ff] group-hover/btn:translate-x-1 transition-transform">
            <span className="text-xs">More</span>
            <FiArrowRight size={14} />
          </div>
          
          {/* Button Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#adc6ff]/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
        </button>
        
        {/* Live Badge Overlay for Live Sessions */}
        {isLive && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full border border-emerald-500/30">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full absolute animate-pulse"></div>
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">REC</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}