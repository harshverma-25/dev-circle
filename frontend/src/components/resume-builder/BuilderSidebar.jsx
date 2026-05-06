"use client";

import { useState } from "react";
import useResumeStore from "../../store/useResumeStore";

import PersonalInfoSection from "./sections/PersonalInfoSection";
import SummarySection from "./sections/SummarySection";
import ExperienceSection from "./sections/ExperienceSection";
import EducationSection from "./sections/EducationSection";
import SkillsSection from "./sections/SkillsSection";
import ProjectsSection from "./sections/ProjectsSection";
import AchievementsSection from "./sections/AchievementsSection";

export default function BuilderSidebar() {
  const [activeSection, setActiveSection] = useState("personal");

  const resume = useResumeStore((state) => state.resume);
  const resetResume = useResumeStore((state) => state.resetResume);

  const toggleSection = (id) => {
    setActiveSection((prev) => (prev === id ? null : id));
  };

  // ── Calculate completion % ──
  let completed = 0;
  if (resume.personal.fullName || resume.personal.email) completed++;
  if (resume.summary.trim().length > 0) completed++;
  if (
    resume.skills.languages.length > 0 ||
    resume.skills.frontend.length > 0 ||
    resume.skills.backend.length > 0 ||
    resume.skills.database.length > 0 ||
    resume.skills.tools.length > 0
  ) completed++;
  if (resume.experience.length > 0) completed++;
  if (resume.education.length > 0) completed++;
  if (resume.projects.length > 0) completed++;
  if (resume.achievements.length > 0) completed++;

  const completionPercent = Math.round((completed / 7) * 100);

  return (
    <aside
      id="builder-sidebar"
      className="flex flex-col h-full bg-[#13131a] border-r border-white/[0.06] overflow-hidden print:hidden"
    >
      {/* Sidebar header */}
      <div className="flex-shrink-0 px-5 pt-6 pb-4 border-b border-white/[0.06]">
        <h2 className="text-base font-semibold text-white">Resume Editor</h2>
        <p className="text-xs text-zinc-500 mt-1">
          Fill in each section — the preview updates instantly.
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex-shrink-0 px-5 py-3 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-zinc-500">Completion</span>
          <span className="text-[11px] font-medium text-zinc-400">{completionPercent}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/[0.05]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#adc6ff] to-[#c9b1ff] transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
            role="progressbar"
            aria-valuenow={completionPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Scrollable sections */}
      <nav
        aria-label="Resume sections"
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        <PersonalInfoSection
          isOpen={activeSection === "personal"}
          onToggle={() => toggleSection("personal")}
        />
        <SummarySection
          isOpen={activeSection === "summary"}
          onToggle={() => toggleSection("summary")}
        />
        <ExperienceSection
          isOpen={activeSection === "experience"}
          onToggle={() => toggleSection("experience")}
        />
        <EducationSection
          isOpen={activeSection === "education"}
          onToggle={() => toggleSection("education")}
        />
        <SkillsSection
          isOpen={activeSection === "skills"}
          onToggle={() => toggleSection("skills")}
        />
        <ProjectsSection
          isOpen={activeSection === "projects"}
          onToggle={() => toggleSection("projects")}
        />
        <AchievementsSection
          isOpen={activeSection === "achievements"}
          onToggle={() => toggleSection("achievements")}
        />
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
          onClick={() => {
            if (window.confirm("Are you sure you want to reset all data?")) {
              resetResume();
            }
          }}
          className="w-full px-4 py-2 rounded-lg border border-white/10 text-zinc-400 text-sm hover:text-white hover:border-white/20 transition-all duration-150"
        >
          Reset Resume
        </button>
      </div>
    </aside>
  );
}
