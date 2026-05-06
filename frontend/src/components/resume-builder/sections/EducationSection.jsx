"use client";

import { useState } from "react";
import { FiBook, FiPlus, FiTrash2, FiChevronDown } from "react-icons/fi";
import useResumeStore from "../../../store/useResumeStore";
import SectionWrapper from "./ui/SectionWrapper";
import FormField from "./ui/FormField";

function EducationEntry({ entry, index, update, remove }) {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  const headerText = entry.degree || entry.institution 
    ? `${entry.degree || "Degree"} @ ${entry.institution || "Institution"}`
    : "New Education";

  return (
    <div className="border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden">
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
          aria-label="Remove education"
        >
          <FiTrash2 className="text-sm" />
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Institution"
              id={`edu-inst-${entry.id}`}
              placeholder="e.g. Stanford University"
              value={entry.institution}
              onChange={(e) => update(entry.id, { institution: e.target.value })}
            />
            <FormField
              label="Degree / Major"
              id={`edu-degree-${entry.id}`}
              placeholder="e.g. B.S. in Computer Science"
              value={entry.degree}
              onChange={(e) => update(entry.id, { degree: e.target.value })}
            />
            <FormField
              label="Duration"
              id={`edu-duration-${entry.id}`}
              placeholder="e.g. 2018 - 2022"
              value={entry.duration}
              onChange={(e) => update(entry.id, { duration: e.target.value })}
            />
            <FormField
              label="Grade / CGPA"
              id={`edu-grade-${entry.id}`}
              placeholder="e.g. 3.8/4.0"
              value={entry.grade}
              onChange={(e) => update(entry.id, { grade: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function EducationSection({ isOpen, onToggle }) {
  const education = useResumeStore((state) => state.resume.education);
  const addEducation = useResumeStore((state) => state.addEducation);
  const updateEducation = useResumeStore((state) => state.updateEducation);
  const removeEducation = useResumeStore((state) => state.removeEducation);

  return (
    <SectionWrapper
      label="Education"
      icon={FiBook}
      color="#c9b1ff"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-3">
        {education.map((entry, index) => (
          <EducationEntry
            key={entry.id}
            index={index}
            entry={entry}
            update={updateEducation}
            remove={removeEducation}
          />
        ))}

        {education.length === 0 && (
          <p className="text-xs text-zinc-500 text-center py-4 bg-white/[0.02] rounded-lg border border-white/5 border-dashed">
            No education added yet.
          </p>
        )}

        <button
          type="button"
          onClick={addEducation}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-white/20 text-[#c9b1ff] text-sm font-medium hover:bg-white/[0.03] transition-colors"
        >
          <FiPlus /> Add Education
        </button>
      </div>
    </SectionWrapper>
  );
}
