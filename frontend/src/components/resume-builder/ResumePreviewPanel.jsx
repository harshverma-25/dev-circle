"use client";

import { FiDownload, FiEye } from "react-icons/fi";

/* ── Skeleton primitives ─────────────────────────────────────────────────── */

function SkeletonLine({ width = "100%", height = "h-3", className = "" }) {
  return (
    <div
      className={`${height} rounded-full bg-zinc-200/70 animate-pulse ${className}`}
      style={{ width }}
    />
  );
}

function SkeletonBlock({ children, className = "" }) {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
}

/* ── A4 Resume Placeholder ───────────────────────────────────────────────── */

function A4ResumePreview() {
  return (
    /* A4 ratio: 210 × 297mm ≈ 1 : 1.414 */
    <div
      id="a4-resume-preview"
      className="w-full bg-white text-zinc-900 shadow-2xl rounded-sm overflow-hidden"
      style={{ aspectRatio: "1 / 1.414", fontFamily: "var(--font-inter)" }}
    >
      <div className="p-8 h-full flex flex-col gap-5">

        {/* ── Header block ── */}
        <div className="pb-5 border-b-2 border-zinc-900/10">
          <SkeletonLine width="55%" height="h-6" className="bg-zinc-800/20 mb-2" />
          <SkeletonLine width="38%" height="h-3.5" className="bg-zinc-400/40 mb-3" />
          {/* contact row */}
          <div className="flex gap-4 flex-wrap">
            <SkeletonLine width="80px" height="h-2.5" className="bg-zinc-300/70" />
            <SkeletonLine width="110px" height="h-2.5" className="bg-zinc-300/70" />
            <SkeletonLine width="90px" height="h-2.5" className="bg-zinc-300/70" />
            <SkeletonLine width="100px" height="h-2.5" className="bg-zinc-300/70" />
          </div>
        </div>

        {/* ── Summary ── */}
        <SkeletonBlock>
          <SkeletonLine width="22%" height="h-3" className="bg-zinc-800/30" />
          <SkeletonLine width="100%" />
          <SkeletonLine width="92%" />
          <SkeletonLine width="75%" />
        </SkeletonBlock>

        {/* ── Experience ── */}
        <div className="space-y-3">
          <SkeletonLine width="27%" height="h-3" className="bg-zinc-800/30" />
          {[1, 2].map((i) => (
            <div key={i} className="pl-3 border-l-2 border-zinc-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <SkeletonLine width="40%" height="h-2.5" className="bg-zinc-400/50" />
                <SkeletonLine width="18%" height="h-2" className="bg-zinc-300/60" />
              </div>
              <SkeletonLine width="28%" height="h-2" className="bg-zinc-300/50" />
              <SkeletonLine width="95%" height="h-2" />
              <SkeletonLine width="85%" height="h-2" />
            </div>
          ))}
        </div>

        {/* ── Education ── */}
        <div className="space-y-2">
          <SkeletonLine width="22%" height="h-3" className="bg-zinc-800/30" />
          <div className="pl-3 border-l-2 border-zinc-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <SkeletonLine width="42%" height="h-2.5" className="bg-zinc-400/50" />
              <SkeletonLine width="16%" height="h-2" className="bg-zinc-300/60" />
            </div>
            <SkeletonLine width="30%" height="h-2" className="bg-zinc-300/50" />
          </div>
        </div>

        {/* ── Skills ── */}
        <div className="space-y-2">
          <SkeletonLine width="14%" height="h-3" className="bg-zinc-800/30" />
          <div className="flex flex-wrap gap-2">
            {[70, 85, 60, 90, 75, 65, 88, 55].map((w, i) => (
              <div
                key={i}
                className="h-5 rounded-full bg-zinc-100 animate-pulse"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>
        </div>

        {/* ── Projects ── */}
        <div className="space-y-2">
          <SkeletonLine width="18%" height="h-3" className="bg-zinc-800/30" />
          <div className="pl-3 border-l-2 border-zinc-200 space-y-1.5">
            <SkeletonLine width="35%" height="h-2.5" className="bg-zinc-400/50" />
            <SkeletonLine width="92%" height="h-2" />
            <SkeletonLine width="78%" height="h-2" />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Panel ───────────────────────────────────────────────────────────────── */

export default function ResumePreviewPanel() {
  return (
    <section
      id="resume-preview-panel"
      aria-label="Live resume preview"
      className="
        relative flex flex-col
        bg-[#1a1a24]
        /* dot grid background */
        [background-image:radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)]
        [background-size:22px_22px]
        /* sticky on desktop */
        lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto
      "
    >
      {/* Panel top bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-[#1a1a24]/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 text-zinc-400">
          <FiEye className="text-sm" />
          <span className="text-xs font-medium tracking-wide uppercase">Live Preview</span>
        </div>

        <button
          id="btn-preview-download"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-zinc-400 text-xs hover:text-white hover:border-white/20 transition-all"
        >
          <FiDownload className="text-xs" />
          Export PDF
        </button>
      </div>

      {/* A4 paper — centered with padding */}
      <div className="flex-1 flex items-start justify-center p-6 lg:p-10">
        <div className="w-full max-w-[680px]">
          <A4ResumePreview />
        </div>
      </div>
    </section>
  );
}
