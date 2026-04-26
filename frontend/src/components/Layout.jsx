"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="bg-[#0b0b0f] text-white min-h-screen overflow-x-hidden">

      {/* NAVBAR */}
      <Navbar />

      {/* BODY */}
      <div className="flex">

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <main className="flex-1 pt-16 md:ml-[260px]">
          
          <div className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </div>

        </main>

      </div>

    </div>
  );
}