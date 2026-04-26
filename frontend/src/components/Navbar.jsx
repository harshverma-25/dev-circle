"use client";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full h-16 z-50 border-b border-white/10 bg-[#121212]/80 backdrop-blur-lg flex items-center justify-between px-6">
      <div className="flex items-center gap-4 text-white font-bold">
        DevCircle
      </div>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <a href="/auth">Login</a>
            <a href="/auth">Signup</a>
          </>
        ) : (
          <>
            <button onClick={logout}>Logout</button>
            <div className="w-8 h-8 rounded-full bg-gray-700" />
          </>
        )}
      </div>
    </nav>
  );
}