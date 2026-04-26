"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 w-[260px] h-[calc(100vh-64px)] border-r border-white/5 bg-[#121212]/90 p-4">
      <nav className="flex flex-col gap-3 text-gray-400">

        <Link href="/" className="hover:text-white">
          Home
        </Link>

        <Link href="/interview" className="hover:text-white">
          Interview
        </Link>

        <Link href="/resume" className="hover:text-white">
          Resume
        </Link>

      </nav>
    </aside>
  );
}