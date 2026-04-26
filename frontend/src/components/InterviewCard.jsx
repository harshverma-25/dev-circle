"use client";

import { useRouter } from "next/navigation";

export default function InterviewCard({ interview }) {
  const router = useRouter();

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">

      <h2 className="text-lg font-semibold text-white mb-1">
        {interview.title}
      </h2>

      <p className="text-sm text-gray-400 mb-3">
        By {interview.createdBy?.name || "Unknown"}
      </p>

      <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
        <span>
          {interview.applications?.length || 0} / {interview.maxParticipants}
        </span>

        <span
          className={`text-xs px-2 py-1 rounded ${
            interview.isStarted
              ? "bg-green-500/20 text-green-400"
              : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {interview.isStarted ? "Live" : "Waiting"}
        </span>
      </div>

      <button
        onClick={() => router.push(`/interview/${interview._id}`)}
        className="w-full bg-blue-400 text-black py-2 rounded-lg"
      >
        View
      </button>
    </div>
  );
}