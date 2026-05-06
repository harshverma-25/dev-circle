"use client";

import Link from "next/link";
import { FiArrowLeft, FiFileText } from "react-icons/fi";
import BuilderSidebar from "./BuilderSidebar";
import ResumePreviewPanel from "./ResumePreviewPanel";

/* ── Top bar ─────────────────────────────────────────────────────────────── */

function BuilderTopBar() {
  return (
    <header
      id="builder-topbar"
      className="
        flex-shrink-0 flex items-center justify-between
        px-4 md:px-6 h-14
        bg-[#0f0f13]/95 backdrop-blur-md
        border-b border-white/[0.06]
        z-20
      "
    >
      {/* Left: back + brand */}
      <div className="flex items-center gap-3">
        <Link
          href="/resume"
          id="builder-back-link"
          aria-label="Back to Resume page"
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors"
        >
          <FiArrowLeft className="text-base" />
          <span className="hidden sm:inline">Back</span>
        </Link>

        <span className="w-px h-4 bg-white/10" aria-hidden="true" />

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#adc6ff]/15 flex items-center justify-center">
            <FiFileText className="text-[#adc6ff] text-xs" />
          </div>
          <span className="text-sm font-semibold text-white">Resume Builder</span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-[#adc6ff]/10 text-[#adc6ff] text-[10px] font-bold tracking-wider uppercase border border-[#adc6ff]/20">
            Beta
          </span>
        </div>
      </div>

      {/* Right: future action slots */}
      <div className="flex items-center gap-2">
        <button
          id="btn-topbar-save"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-zinc-400 text-xs hover:text-white hover:border-white/20 transition-all"
        >
          Save Draft
        </button>
        <button
          id="btn-topbar-export"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#adc6ff] to-[#c9b1ff] text-[#0a0a14] text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Export PDF
        </button>
      </div>
    </header>
  );
}

/* ── Page shell ──────────────────────────────────────────────────────────── */

export default function ResumeBuilderPage() {
  return (
    <div
      id="resume-builder-root"
      className="flex flex-col h-screen bg-[#0f0f13] overflow-hidden"
    >
      <BuilderTopBar />

      {/*
       * Two-column layout:
       *   mobile  → stacked (sidebar on top, preview below)
       *   desktop → sidebar (420 px fixed) | preview (fills remaining space)
       */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[420px_1fr] overflow-hidden">
        {/* Left: scrollable editor */}
        <BuilderSidebar />

        {/* Right: sticky live preview */}
        <ResumePreviewPanel />
      </div>
    </div>
  );
}
