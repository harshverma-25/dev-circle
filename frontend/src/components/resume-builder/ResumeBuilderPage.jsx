"use client";

import { useState } from "react";
import Link from "next/link";
import { FiArrowLeft, FiFileText, FiEdit3, FiEye } from "react-icons/fi";
import BuilderSidebar from "./BuilderSidebar";
import ResumePreviewPanel from "./ResumePreviewPanel";
import { generatePDF } from "../../lib/pdf-utils";
import useResumeStore from "../../store/useResumeStore";

/* ── Top bar ─────────────────────────────────────────────────────────────── */

function BuilderTopBar({ activeTab, setActiveTab }) {
  const resume = useResumeStore((state) => state.resume);

  const handleDownload = async () => {
    const fileName = `${resume.personal.fullName || "resume"}.pdf`;
    await generatePDF("a4-resume-preview", fileName);
  };

  return (
    <header
      id="builder-topbar"
      className="
        flex-shrink-0 flex items-center justify-between
        px-4 md:px-6 h-14
        bg-[#0f0f13]/95 backdrop-blur-md
        border-b border-white/[0.06]
        z-20
        print:hidden
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
        </div>
      </div>

      {/* Middle: Mobile Tabs */}
      <div className="flex lg:hidden bg-white/5 rounded-lg p-1 border border-white/10">
        <button
          onClick={() => setActiveTab("edit")}
          className={`flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
            activeTab === "edit" ? "bg-[#adc6ff] text-[#0a0a14]" : "text-zinc-400"
          }`}
        >
          <FiEdit3 />
          EDIT
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
            activeTab === "preview" ? "bg-[#adc6ff] text-[#0a0a14]" : "text-zinc-400"
          }`}
        >
          <FiEye />
          PREVIEW
        </button>
      </div>

      {/* Right: Export */}
      <div className="flex items-center gap-2">
        <button
          id="btn-topbar-export"
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#adc6ff] to-[#c9b1ff] text-[#0a0a14] text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
        >
          <FiFileText className="sm:hidden" />
          <span className="hidden sm:inline">Export PDF</span>
          <span className="sm:hidden text-[10px]">PDF</span>
        </button>
      </div>
    </header>
  );
}

/* ── Page shell ──────────────────────────────────────────────────────────── */

export default function ResumeBuilderPage() {
  const [activeTab, setActiveTab] = useState("edit");

  return (
    <div
      id="resume-builder-root"
      className="flex flex-col h-screen bg-[#0f0f13] overflow-hidden"
    >
      <BuilderTopBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[420px_1fr] overflow-hidden">
        {/* Editor Sidebar */}
        <div className={`h-full overflow-hidden ${activeTab === "edit" ? "block" : "hidden lg:block"}`}>
          <BuilderSidebar />
        </div>

        {/* Preview Panel */}
        <div className={`h-full overflow-hidden ${activeTab === "preview" ? "block" : "hidden lg:block"}`}>
          <ResumePreviewPanel />
        </div>
      </div>
    </div>
  );
}
