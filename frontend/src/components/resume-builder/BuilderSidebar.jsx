"use client";

import {
  FiUser,
  FiBriefcase,
  FiBook,
  FiCode,
  FiGitBranch,
  FiFileText,
  FiChevronRight,
} from "react-icons/fi";

const SECTIONS = [
  {
    id: "personal",
    label: "Personal Information",
    description: "Name, email, phone, location & links",
    icon: FiUser,
    color: "#adc6ff",
  },
  {
    id: "summary",
    label: "Professional Summary",
    description: "A short pitch about yourself",
    icon: FiFileText,
    color: "#b5ead7",
  },
  {
    id: "experience",
    label: "Work Experience",
    description: "Jobs, internships & roles",
    icon: FiBriefcase,
    color: "#ffd6a5",
  },
  {
    id: "education",
    label: "Education",
    description: "Degrees, certifications & courses",
    icon: FiBook,
    color: "#c9b1ff",
  },
  {
    id: "skills",
    label: "Skills",
    description: "Technical & soft skills",
    icon: FiCode,
    color: "#ff9eb5",
  },
  {
    id: "projects",
    label: "Projects",
    description: "Personal, academic & open-source work",
    icon: FiGitBranch,
    color: "#a0d2ff",
  },
];

function SectionCard({ section, index }) {
  const Icon = section.icon;

  return (
    <button
      id={`sidebar-section-${section.id}`}
      aria-label={`Edit ${section.label}`}
      className="w-full group flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/10 transition-all duration-200 text-left cursor-pointer"
    >
      {/* Step number + icon */}
      <div
        className="relative flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${section.color}15` }}
      >
        <Icon style={{ color: section.color }} className="text-base" />
        <span
          className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
          style={{ backgroundColor: `${section.color}22`, color: section.color }}
        >
          {index + 1}
        </span>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-100 truncate">{section.label}</p>
        <p className="text-xs text-zinc-500 truncate mt-0.5">{section.description}</p>
      </div>

      {/* Arrow */}
      <FiChevronRight className="text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </button>
  );
}

export default function BuilderSidebar() {
  return (
    <aside
      id="builder-sidebar"
      className="flex flex-col h-full bg-[#13131a] border-r border-white/[0.06] overflow-hidden"
    >
      {/* Sidebar header */}
      <div className="flex-shrink-0 px-5 pt-6 pb-4 border-b border-white/[0.06]">
        <h2 className="text-base font-semibold text-white">Resume Editor</h2>
        <p className="text-xs text-zinc-500 mt-1">
          Fill in each section — the preview updates instantly.
        </p>
      </div>

      {/* Progress bar placeholder */}
      <div className="flex-shrink-0 px-5 py-3 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-zinc-500">Completion</span>
          <span className="text-[11px] font-medium text-zinc-400">0%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/[0.05]">
          <div
            className="h-full w-0 rounded-full bg-gradient-to-r from-[#adc6ff] to-[#c9b1ff] transition-all duration-500"
            role="progressbar"
            aria-valuenow={0}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Scrollable section list */}
      <nav
        aria-label="Resume sections"
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        {SECTIONS.map((section, index) => (
          <SectionCard key={section.id} section={section} index={index} />
        ))}
      </nav>

      {/* Bottom action area */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-white/[0.06] space-y-2">
        <button
          id="btn-download-resume"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#adc6ff] to-[#c9b1ff] text-[#0a0a14] text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-150"
        >
          Download PDF
        </button>
        <button
          id="btn-reset-resume"
          className="w-full px-4 py-2 rounded-lg border border-white/10 text-zinc-400 text-sm hover:text-white hover:border-white/20 transition-all duration-150"
        >
          Reset Resume
        </button>
      </div>
    </aside>
  );
}
