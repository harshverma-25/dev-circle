"use client";

import useAuthStore from "../store/useAuthStore";
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 w-full h-16 z-50 bg-[#121212]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">

      {/* LEFT: LOGO */}
      <Link href="/" className="text-lg font-semibold text-white tracking-tight">
        DevCircle
      </Link>

      {/* CENTER: SEARCH */}
      <div className="hidden md:flex items-center">
        <input
          type="text"
          placeholder="Find a session..."
          className="bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-lg text-sm text-white placeholder-gray-500 outline-none w-72 focus:border-blue-400"
        />
      </div>

      {/* RIGHT: AUTH */}
      <div className="flex items-center gap-4">

        {!user ? (
          <Link
            href="/auth"
            className="text-zinc-400 text-sm hover:text-white transition-colors"
          >
            Sign In
          </Link>
        ) : (
          <>
            <button
              onClick={logout}
              className="text-zinc-400 text-sm hover:text-red-400 transition-colors"
            >
              Sign Out
            </button>

            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </>
        )}

      </div>
    </nav>
  );
}