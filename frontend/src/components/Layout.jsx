"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="bg-background text-on-background">
      <Navbar />
      <Sidebar />

      <main className="ml-[260px] mt-16 p-10 min-h-screen">
        {children}
      </main>
    </div>
  );
}