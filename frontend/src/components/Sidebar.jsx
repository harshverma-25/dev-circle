"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaTerminal, FaFileAlt, FaChevronLeft, FaChevronRight, FaCog } from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  const navItem = (href, label, Icon, isActive, disabled = false) => {
    return (
      <Link
        href={href}
        className={`relative flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
          isActive
            ? "bg-blue-500/10 text-blue-400 border-l-2 border-blue-400"
            : "text-zinc-400 hover:text-white hover:bg-white/5"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-3 w-full">
          <Icon className={`text-lg ${!isExpanded ? "mx-auto" : ""}`} />
          {isExpanded && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
        </div>

        {isExpanded && disabled && (
          <span className="text-[10px] uppercase font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded">
            Soon
          </span>
        )}

        {/* Tooltip for collapsed mode */}
        {!isExpanded && !disabled && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
            {label}
          </div>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed z-50 hidden md:flex items-center justify-center w-6 h-6 -ml-3 bg-[#1a1a1a] border border-white/10 rounded-full hover:bg-white/10 transition-all duration-200 group"
        style={{ left: isExpanded ? "260px" : "70px", top: "80px" }}
      >
        {isExpanded ? (
          <FaChevronLeft size={10} className="text-zinc-400 group-hover:text-white" />
        ) : (
          <FaChevronRight size={10} className="text-zinc-400 group-hover:text-white" />
        )}
      </button>

      <aside 
        className={`fixed left-0 top-16 z-40 bg-gradient-to-b from-[#121212] to-black backdrop-blur-xl border-r border-white/10 flex flex-col py-6 gap-2 hidden md:flex transition-all duration-300 ease-in-out shadow-xl ${
          isExpanded ? "w-[260px]" : "w-[70px]"
        }`}
        style={{ height: "calc(100vh - 64px)" }}
      >
        {/* HEADER */}
        <div className={`overflow-hidden mb-6 ${isExpanded ? "px-6" : "px-4"}`}>
          {isExpanded ? (
            <div className="animate-fadeIn">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1 whitespace-nowrap">
                DevCircle
              </p>
              <p className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap">
                Community Hub
              </p>
            </div>
          ) : (
            <div className="flex justify-center animate-fadeIn">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                <span className="text-blue-400 text-sm font-bold">DC</span>
              </div>
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col gap-1 flex-1">
          {navItem("/", "Home", FaHome, pathname === "/")}
          {navItem("/interview", "Interview", FaTerminal, pathname.startsWith("/interview"))}
          {navItem("/resume", "Resume", FaFileAlt, pathname.startsWith("/resume"), true)}
        </div>

        {/* FOOTER - Settings */}
        <div className={`mt-auto pt-4 border-t border-white/10 ${isExpanded ? "px-6" : "px-3"}`}>
          {isExpanded ? (
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
              <FaCog size={16} />
              <span className="text-sm font-medium">Settings</span>
            </div>
          ) : (
            <div className="relative group flex justify-center py-2 cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                <FaCog size={18} className="text-zinc-400" />
              </div>
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                Settings
              </div>
            </div>
          )}
        </div>
      </aside>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}