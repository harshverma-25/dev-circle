"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 w-[260px] h-[calc(100vh-64px)] z-40 bg-[#121212]/95 backdrop-blur-xl border-r border-white/10 flex-col py-6 space-y-2 hidden md:flex">
      <div className="px-6 mb-8">
        <div className="text-label-caps text-zinc-500 uppercase tracking-widest mb-xs">Naation</div>
        <div className="text-body-sm font-medium text-primary">Interm</div>
      </div>

      <Link
        href="/"
        className={`flex items-center px-6 py-3 space-x-md transition-all duration-200 group ${
          pathname === "/"
            ? "text-primary bg-primary/10 active-nav-border"
            : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
        }`}
      >
        <span className="material-symbols-outlined">home</span>
        <span className="font-inter text-sm font-medium">Home</span>
      </Link>

      <Link
        href="/interview"
        className={`flex items-center px-6 py-3 space-x-md transition-all duration-200 group ${
          pathname.startsWith("/interview")
            ? "text-primary bg-primary/10 active-nav-border"
            : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
        }`}
      >
        <span className="material-symbols-outlined">terminal</span>
        <span className="font-inter text-sm font-medium">Interview</span>
      </Link>

      {/* F-5: Keep resume as "Coming Soon" */}
      <Link
        href="/resume"
        className={`flex items-center justify-between px-6 py-3 space-x-md transition-all duration-200 group ${
          pathname.startsWith("/resume")
            ? "text-primary bg-primary/10 active-nav-border"
            : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
        }`}
      >
        <div className="flex items-center space-x-md">
          <span className="material-symbols-outlined opacity-50">description</span>
          <span className="font-inter text-sm font-medium opacity-50">Resume</span>
        </div>
        <span className="text-[10px] uppercase font-bold text-zinc-600 bg-white/5 px-2 py-0.5 rounded">Soon</span>
      </Link>
    </aside>
  );
}