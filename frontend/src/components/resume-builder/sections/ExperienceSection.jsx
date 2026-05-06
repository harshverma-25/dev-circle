"use client";

import { useState } from "react";
import { FiBriefcase, FiPlus, FiTrash2, FiChevronDown } from "react-icons/fi";
import useResumeStore from "../../../store/useResumeStore";
import SectionWrapper from "./ui/SectionWrapper";
import FormField from "./ui/FormField";
import BulletList from "./ui/BulletList";

function ExperienceEntry({ entry, index, update, remove }) {
  const [isExpanded, setIsExpanded] = useState(index === 0); // Open the first one by default

  const headerText = entry.role || entry.company 
    ? `${entry.role || "Role"} @ ${entry.company || "Company"}`
    : "New Experience";

  return (
    <div className="border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden">
      {/* Header */}
      <div className="flex items-center bg-white/[0.03]">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 flex items-center gap-2 px-4 py-3 text-sm font-medium text-zinc-200 hover:text-white transition-colors text-left"
        >
          <FiChevronDown
            className={`transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
          />
          <span className="truncate">{headerText}</span>
        </button>
        <button
          type="button"
          onClick={() => remove(entry.id)}
          className="px-4 py-3 text-zinc-500 hover:text-red-400 transition-colors"
          aria-label="Remove experience"
        >
          <FiTrash2 className="text-sm" />
        </button>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="p-4 space-y-4 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Company"
              id={`exp-company-${entry.id}`}
              placeholder="e.g. Google"
              value={entry.company}
              onChange={(e) => update(entry.id, { company: e.target.value })}
            />
            <FormField
              label="Role"
              id={`exp-role-${entry.id}`}
              placeholder="e.g. Senior Developer"
              value={entry.role}
              onChange={(e) => update(entry.id, { role: e.target.value })}
            />
            <FormField
              label="Duration"
              id={`exp-duration-${entry.id}`}
              placeholder="e.g. Jan 2021 - Present"
              value={entry.duration}
              onChange={(e) => update(entry.id, { duration: e.target.value })}
            />
            <FormField
              label="Location"
              id={`exp-location-${entry.id}`}
              placeholder="e.g. Mountain View, CA"
              value={entry.location}
              onChange={(e) => update(entry.id, { location: e.target.value })}
            />
          </div>
          
          <BulletList
            label="Responsibilities & Achievements"
            bullets={entry.bullets}
            onChange={(bullets) => update(entry.id, { bullets })}
          />
        </div>
      )}
    </div>
  );
}

export default function ExperienceSection({ isOpen, onToggle }) {
  const experience = useResumeStore((state) => state.resume.experience);
  const addExperience = useResumeStore((state) => state.addExperience);
  const updateExperience = useResumeStore((state) => state.updateExperience);
  const removeExperience = useResumeStore((state) => state.removeExperience);

  return (
    <SectionWrapper
      label="Work Experience"
      icon={FiBriefcase}
      color="#ffd6a5"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-3">
        {experience.map((entry, index) => (
          <ExperienceEntry
            key={entry.id}
            index={index}
            entry={entry}
            update={updateExperience}
            remove={removeExperience}
          />
        ))}

        {experience.length === 0 && (
          <p className="text-xs text-zinc-500 text-center py-4 bg-white/[0.02] rounded-lg border border-white/5 border-dashed">
            No work experience added yet.
          </p>
        )}

        <button
          type="button"
          onClick={addExperience}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-white/20 text-[#ffd6a5] text-sm font-medium hover:bg-white/[0.03] transition-colors"
        >
          <FiPlus /> Add Experience
        </button>
      </div>
    </SectionWrapper>
  );
}
