"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaTerminal, FaFileAlt } from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();

  const navItem = (href, label, Icon, isActive, disabled = false) => {
    return (
      <Link
        href={href}
        className={`flex items-center justify-between px-6 py-3 rounded-lg transition-all duration-200 group ${
          isActive
            ? "bg-blue-500/10 text-blue-400 border-l-2 border-blue-400"
            : "text-zinc-400 hover:text-white hover:bg-white/5"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-3">
          <Icon className="text-sm" />
          <span className="text-sm font-medium">{label}</span>
        </div>

        {disabled && (
          <span className="text-[10px] uppercase font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded">
            Soon
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-16 w-[260px] h-[calc(100vh-64px)] z-40 bg-[#121212]/95 backdrop-blur-xl border-r border-white/10 flex flex-col py-6 gap-2 hidden md:flex">

      {/* HEADER */}
      <div className="px-6 mb-6">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
          DevCircle
        </p>
        <p className="text-sm font-medium text-blue-400">
          Community Hub
        </p>
      </div>

      {/* NAV */}
      <div className="flex flex-col gap-1">
        {navItem("/", "Home", FaHome, pathname === "/")}
        {navItem("/interview", "Interview", FaTerminal, pathname.startsWith("/interview"))}
        {navItem("/resume", "Resume", FaFileAlt, pathname.startsWith("/resume"), true)}
      </div>

      {/* FOOTER */}
      <div className="mt-auto px-6 text-xs text-zinc-500">
        Settings
      </div>

    </aside>
  );
}