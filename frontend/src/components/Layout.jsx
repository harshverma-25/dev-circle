"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="bg-[#0b0b0f] text-white min-h-screen overflow-x-hidden">
      
      <Navbar />
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="md:ml-[260px] pt-16">
        
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>

      </main>
    </div>
  );
}