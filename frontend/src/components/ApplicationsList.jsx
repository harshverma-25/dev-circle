"use client";

import { useApplications, useUpdateApplicationStatus } from "../hooks/useInterviews";
import { FiExternalLink, FiCheck, FiX, FiClock, FiFileText, FiLink, FiUsers } from "react-icons/fi";

const STATUS_CONFIG = {
  pending:  { label: "Pending",  class: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  accepted: { label: "Accepted", class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  rejected: { label: "Rejected", class: "bg-red-500/15 text-red-400 border-red-500/20" },
};

function Avatar({ name }) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
  return (
    <div className="w-9 h-9 rounded-full bg-[#adc6ff]/15 border border-[#adc6ff]/25 flex items-center justify-center text-[#adc6ff] text-xs font-bold flex-shrink-0">
      {initials}
    </div>
  );
}

function ResumeLink({ application }) {
  if (!application.resumeUrl) {
    return (
      <span className="text-zinc-600 text-xs italic">File deleted</span>
    );
  }
  const isFile = application.resumeType === "file";
  return (
    <a
      href={application.resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-[#adc6ff] text-xs hover:text-white transition-colors group"
    >
      {isFile ? <FiFileText size={13} /> : <FiLink size={13} />}
      <span className="underline underline-offset-2 decoration-white/20 group-hover:decoration-white/60 transition-all">
        {isFile ? "View File" : "View Link"}
      </span>
      <FiExternalLink size={11} className="opacity-60" />
    </a>
  );
}

export default function ApplicationsList({ interviewId }) {
  const { data: applications, isLoading } = useApplications(interviewId);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateApplicationStatus();

  const handleStatus = (applicationId, status) => {
    updateStatus({ applicationId, status });
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-8 text-zinc-500 text-sm">
        <FiClock size={16} className="animate-pulse" />
        Loading applications...
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="py-10 text-center border border-dashed border-white/10 rounded-2xl">
        <FiUsers size={28} className="text-zinc-700 mx-auto mb-3" />
        <p className="text-zinc-500 text-sm">No one has applied yet</p>
        <p className="text-zinc-700 text-xs mt-1">Share the interview link to get applicants</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {applications.map((app) => {
        const statusCfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
        const user      = app.userId;

        return (
          <div
            key={app._id}
            className="flex items-center gap-4 bg-[#1a1a1a] border border-white/7 rounded-xl px-4 py-3.5 hover:border-white/12 transition-colors"
          >
            {/* Avatar */}
            <Avatar name={user?.name} />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name || "Unknown"}</p>
              <p className="text-zinc-500 text-xs truncate">{user?.email}</p>
            </div>

            {/* Resume */}
            <div className="hidden sm:block">
              <ResumeLink application={app} />
            </div>

            {/* Status badge */}
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium whitespace-nowrap ${statusCfg.class}`}>
              {statusCfg.label}
            </span>

            {/* Action buttons — only show if still pending */}
            {app.status === "pending" && (
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleStatus(app._id, "accepted")}
                  disabled={isUpdating}
                  title="Accept"
                  className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all flex items-center justify-center disabled:opacity-40"
                >
                  <FiCheck size={14} />
                </button>
                <button
                  onClick={() => handleStatus(app._id, "rejected")}
                  disabled={isUpdating}
                  title="Reject"
                  className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all flex items-center justify-center disabled:opacity-40"
                >
                  <FiX size={14} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
