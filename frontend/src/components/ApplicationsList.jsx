"use client";

import { useState } from "react";
import { useApplications, useUpdateApplicationStatus } from "../hooks/useInterviews";
import { 
  FiExternalLink, FiCheck, FiX, FiClock, FiFileText, FiLink, FiUsers, 
  FiUser, FiMail, FiPaperclip, FiChevronDown, FiChevronUp, FiEye,
  FiAward, FiUserCheck, FiUserX
} from "react-icons/fi";

const STATUS_CONFIG = {
  pending:  { 
    label: "Pending",  
    class: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    icon: FiClock,
    gradient: "from-amber-500/20 to-transparent"
  },
  accepted: { 
    label: "Accepted", 
    class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    icon: FiCheck,
    gradient: "from-emerald-500/20 to-transparent"
  },
  rejected: { 
    label: "Rejected", 
    class: "bg-red-500/15 text-red-400 border-red-500/20",
    icon: FiX,
    gradient: "from-red-500/20 to-transparent"
  },
};

function Avatar({ name, email, size = "md" }) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
  
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base"
  };

  const colors = [
    "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
    "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400",
    "from-green-500/20 to-green-600/20 border-green-500/30 text-green-400",
    "from-pink-500/20 to-pink-600/20 border-pink-500/30 text-pink-400",
    "from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400",
    "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400",
  ];
  
  const colorIndex = (name?.length || 0) % colors.length;
  const colorClass = colors[colorIndex];

  return (
    <div className={`rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center font-bold flex-shrink-0 ${sizeClasses[size]}`}>
      {initials}
    </div>
  );
}

function ResumeLink({ application }) {
  if (!application.resumeUrl) {
    return (
      <span className="text-zinc-600 text-xs italic flex items-center gap-1">
        <FiPaperclip size={11} />
        No file
      </span>
    );
  }
  const isFile = application.resumeType === "file";
  return (
    <a
      href={application.resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-[#adc6ff] text-xs hover:text-white transition-all group px-2 py-1 rounded-lg hover:bg-white/5"
    >
      {isFile ? <FiFileText size={12} /> : <FiLink size={12} />}
      <span className="underline underline-offset-2 decoration-white/20 group-hover:decoration-white/60 transition-all">
        {isFile ? "Resume" : "Portfolio"}
      </span>
      <FiExternalLink size={10} className="opacity-60 group-hover:opacity-100" />
    </a>
  );
}

function ApplicationDetails({ application, isExpanded }) {
  const user = application.userId;
  
  if (!isExpanded) return null;
  
  return (
    <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-xs">
          <FiMail className="text-zinc-500" size={14} />
          <span className="text-zinc-400">{user?.email || "No email"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <FiUser className="text-zinc-500" size={14} />
          <span className="text-zinc-400">{user?.name || "Unknown"}</span>
        </div>
      </div>
      
      {application.message && (
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-zinc-400 text-xs leading-relaxed">
            {application.message}
          </p>
        </div>
      )}
      
      <div className="flex justify-end">
        <ResumeLink application={application} />
      </div>
    </div>
  );
}

export default function ApplicationsList({ interviewId }) {
  const { data: applications, isLoading } = useApplications(interviewId);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateApplicationStatus();
  const [expandedApplication, setExpandedApplication] = useState(null);

  const handleStatus = (applicationId, status, e) => {
    e.stopPropagation();
    updateStatus({ applicationId, status });
  };

  const toggleExpand = (applicationId) => {
    setExpandedApplication(expandedApplication === applicationId ? null : applicationId);
  };

  // Stats
  const stats = {
    total: applications?.length || 0,
    pending: applications?.filter(a => a.status === "pending").length || 0,
    accepted: applications?.filter(a => a.status === "accepted").length || 0,
    rejected: applications?.filter(a => a.status === "rejected").length || 0,
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3 py-12 text-zinc-500">
          <div className="relative">
            <FiClock size={20} className="animate-spin" />
          </div>
          <span className="text-sm">Loading applications...</span>
        </div>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="py-16 text-center bg-gradient-to-br from-zinc-900/30 to-black rounded-3xl border border-dashed border-white/10">
        <div className="relative inline-block">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiUsers size={32} className="text-zinc-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        <h4 className="text-white font-semibold mb-2">No applications yet</h4>
        <p className="text-zinc-500 text-sm max-w-sm mx-auto px-4">
          Share the interview link to start receiving applications from candidates
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-xs text-zinc-400">
          <FiLink size={12} />
          <span>Share the link to attract applicants</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-zinc-900/50 to-black rounded-xl p-3 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-xs">Total</span>
            <FiUsers size={14} className="text-blue-400" />
          </div>
          <p className="text-xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-zinc-900/50 to-black rounded-xl p-3 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-xs">Pending</span>
            <FiClock size={14} className="text-amber-400" />
          </div>
          <p className="text-xl font-bold text-amber-400 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-zinc-900/50 to-black rounded-xl p-3 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-xs">Accepted</span>
            <FiUserCheck size={14} className="text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-emerald-400 mt-1">{stats.accepted}</p>
        </div>
        <div className="bg-gradient-to-br from-zinc-900/50 to-black rounded-xl p-3 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-xs">Rejected</span>
            <FiUserX size={14} className="text-red-400" />
          </div>
          <p className="text-xl font-bold text-red-400 mt-1">{stats.rejected}</p>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {applications.map((app) => {
          const statusCfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
          const user = app.userId;
          const StatusIcon = statusCfg.icon;
          const isExpanded = expandedApplication === app._id;

          return (
            <div
              key={app._id}
              className="group relative bg-gradient-to-br from-zinc-900/50 to-black rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${statusCfg.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              {/* Main Content */}
              <div 
                className="relative p-4 cursor-pointer"
                onClick={() => toggleExpand(app._id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Avatar */}
                  <Avatar name={user?.name} email={user?.email} size="md" />

                  {/* User Info - Mobile optimized */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="text-white font-semibold text-base truncate">
                          {user?.name || "Unknown Applicant"}
                        </p>
                        <div className="flex items-center gap-2 mt-1 sm:hidden">
                          <StatusIcon size={12} className={statusCfg.class.split(' ')[1]} />
                          <span className={`text-xs font-medium ${statusCfg.class.split(' ')[1]}`}>
                            {statusCfg.label}
                          </span>
                        </div>
                      </div>
                      
                      {/* Desktop Status & Actions */}
                      <div className="hidden sm:flex items-center gap-3">
                        {/* Status badge */}
                        <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium whitespace-nowrap ${statusCfg.class}`}>
                          <StatusIcon size={12} />
                          {statusCfg.label}
                        </span>

                        {/* Action buttons */}
                        {app.status === "pending" && (
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => handleStatus(app._id, "accepted", e)}
                              disabled={isUpdating}
                              title="Accept Application"
                              className="relative group/btn w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/40 transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <FiCheck size={16} />
                              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
                                Accept
                              </span>
                            </button>
                            <button
                              onClick={(e) => handleStatus(app._id, "rejected", e)}
                              disabled={isUpdating}
                              title="Reject Application"
                              className="relative group/btn w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <FiX size={16} />
                              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
                                Reject
                              </span>
                            </button>
                          </div>
                        )}

                        {/* Expand/collapse indicator */}
                        <button 
                          className="p-1 text-zinc-500 hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(app._id);
                          }}
                        >
                          {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Email - Desktop */}
                    <p className="text-zinc-500 text-sm truncate hidden sm:block mt-0.5">
                      {user?.email}
                    </p>

                    {/* Resume link - Mobile */}
                    <div className="mt-2 sm:hidden">
                      <ResumeLink application={app} />
                    </div>
                  </div>

                  {/* Mobile expand/collapse */}
                  <div className="flex items-center justify-between sm:hidden">
                    <div className="flex gap-2">
                      {app.status === "pending" && (
                        <>
                          <button
                            onClick={(e) => handleStatus(app._id, "accepted", e)}
                            disabled={isUpdating}
                            className="flex-1 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium"
                          >
                            Accept
                          </button>
                          <button
                            onClick={(e) => handleStatus(app._id, "rejected", e)}
                            disabled={isUpdating}
                            className="flex-1 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                    <button 
                      className="p-2 text-zinc-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(app._id);
                      }}
                    >
                      {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                <ApplicationDetails application={app} isExpanded={isExpanded} />
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}