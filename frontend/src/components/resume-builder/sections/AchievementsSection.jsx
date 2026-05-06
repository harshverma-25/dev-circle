"use client";

import { useState } from "react";
import { FiAward, FiPlus, FiTrash2, FiChevronDown } from "react-icons/fi";
import useResumeStore from "../../../store/useResumeStore";
import SectionWrapper from "./ui/SectionWrapper";
import FormField from "./ui/FormField";
import TextareaField from "./ui/TextareaField";

function AchievementEntry({ entry, index, update, remove }) {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  const headerText = entry.title || "New Achievement";

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
          aria-label="Remove achievement"
        >
          <FiTrash2 className="text-sm" />
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 border-t border-white/5">
          <FormField
            label="Title / Award Name"
            id={`ach-title-${entry.id}`}
            placeholder="e.g. Employee of the Year"
            value={entry.title}
            onChange={(e) => update(entry.id, { title: e.target.value })}
          />
          <TextareaField
            label="Description"
            id={`ach-desc-${entry.id}`}
            rows={3}
            placeholder="Details about the achievement..."
            value={entry.description}
            onChange={(e) => update(entry.id, { description: e.target.value })}
          />
          <FormField
            label="Link / Reference (Optional)"
            id={`ach-link-${entry.id}`}
            placeholder="e.g. https://credential.net/..."
            value={entry.link}
            onChange={(e) => update(entry.id, { link: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}

export default function AchievementsSection({ isOpen, onToggle }) {
  const achievements = useResumeStore((state) => state.resume.achievements);
  const addAchievement = useResumeStore((state) => state.addAchievement);
  const updateAchievement = useResumeStore((state) => state.updateAchievement);
  const removeAchievement = useResumeStore((state) => state.removeAchievement);

  return (
    <SectionWrapper
      label="Achievements"
      icon={FiAward}
      color="#f6a5c0"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-3">
        {achievements.map((entry, index) => (
          <AchievementEntry
            key={entry.id}
            index={index}
            entry={entry}
            update={updateAchievement}
            remove={removeAchievement}
          />
        ))}

        {achievements.length === 0 && (
          <p className="text-xs text-zinc-500 text-center py-4 bg-white/[0.02] rounded-lg border border-white/5 border-dashed">
            No achievements added yet.
          </p>
        )}

        <button
          type="button"
          onClick={addAchievement}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-white/20 text-[#f6a5c0] text-sm font-medium hover:bg-white/[0.03] transition-colors"
        >
          <FiPlus /> Add Achievement
        </button>
      </div>
    </SectionWrapper>
  );
}
