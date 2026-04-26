"use client";

import useAuthStore from "../store/useAuthStore";
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="fixed top-0 w-full h-16 z-50 bg-[#121212]/90 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-6">
      <Link href="/" className="text-xl font-bold tracking-tight text-white font-h2">
        DevCir
      </Link>

      <div className="flex items-center gap-lg">
        {!user ? (
          <Link
            href="/auth"
            className="text-zinc-400 font-inter text-body-sm hover:text-white transition-colors duration-200"
          >
            Sign In
          </Link>
        ) : (
          <>
            <button
              onClick={logout}
              className="text-zinc-400 font-inter text-body-sm hover:text-error transition-colors duration-200"
            >
              Sign Out
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-xs">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
