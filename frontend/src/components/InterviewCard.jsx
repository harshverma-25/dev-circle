"use client";

import { useRouter } from "next/navigation";
import { FiClock, FiUsers, FiArrowRight } from "react-icons/fi";

export default function InterviewCard({ interview }) {
  const router = useRouter();

  const isLive = interview.isStarted;
  const statusColor = isLive ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30";
  const dateStr = new Date(interview.scheduledAt).toLocaleDateString(undefined, {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
  });

  return (
    <div className="bg-[#141414] border border-white/5 hover:border-white/20 transition-all rounded-2xl p-6 group flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusColor}`}>
            {isLive ? "● LIVE" : "Waiting"}
          </span>
          <span className="text-zinc-500 text-xs flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full">
            <FiClock size={12} /> {dateStr}
          </span>
        </div>

        <h2 className="text-xl font-semibold text-white mb-2 line-clamp-1 group-hover:text-[#adc6ff] transition-colors">
          {interview.title}
        </h2>

        <p className="text-sm text-zinc-400 mb-6 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white border border-white/5">
            {interview.createdBy?.name?.[0]?.toUpperCase() || "?"}
          </span>
          Host: <span className="text-zinc-300">{interview.createdBy?.name || "Unknown"}</span>
        </p>
      </div>

      <div className="flex items-end justify-between border-t border-white/5 pt-5 mt-auto">
        <div className="flex flex-col gap-1">
          <div className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Participants</div>
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <FiUsers size={16} className="text-zinc-500" />
            <span>
              <span className="text-white font-medium">{interview.applications?.length || 0}</span>
              <span className="text-zinc-600 mx-1">/</span>
              {interview.maxParticipants}
            </span>
          </div>
        </div>

        <button
          onClick={() => router.push(`/interview/${interview._id}`)}
          className="h-10 px-5 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 active:scale-95"
        >
          View Details
          <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}