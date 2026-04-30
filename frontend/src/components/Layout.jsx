"use client";

import { useEffect } from "react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="bg-gradient-to-br from-[#0a0a0f] via-[#0b0b0f] to-black min-h-screen text-white">
      
      {/* Animated Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-[#adc6ff]/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
          {children}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-white/5 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
            <p>&copy; 2024 DevCircle. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#adc6ff] transition-colors">About</a>
              <a href="#" className="hover:text-[#adc6ff] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#adc6ff] transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}