"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen">
      <Navbar />
      <Sidebar />

      <main className="md:ml-[260px] pt-16 min-h-screen flex flex-col">
        {children}

        <footer className="px-lg py-xl border-t border-white/10 text-center md:text-left mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-lg">
            <div>
              <div className="text-xl font-bold text-white mb-xs font-h2">DevCircle</div>
              <p className="text-body-sm text-zinc-500">© 2024 DevCircle Interview Platform. All rights reserved.</p>
            </div>
            <div className="flex gap-lg text-body-sm text-zinc-400">
              <a className="hover:text-primary transition-colors" href="#">Privacy</a>
              <a className="hover:text-primary transition-colors" href="#">Terms</a>
              <a className="hover:text-primary transition-colors" href="#">Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}