"use client";

import { useState } from "react";
import { FiCode, FiX } from "react-icons/fi";
import useResumeStore from "../../../store/useResumeStore";
import SectionWrapper from "./ui/SectionWrapper";

function SkillInput({ label, categoryId, skills, setSkillCategory }) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!skills.includes(inputValue.trim())) {
        setSkillCategory(categoryId, [...skills, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkillCategory(
      categoryId,
      skills.filter((s) => s !== skillToRemove)
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-zinc-400">{label}</label>
      <div className="flex flex-wrap gap-2 p-2 min-h-[44px] rounded-lg bg-white/[0.05] border border-white/[0.08] focus-within:border-[#adc6ff]/60 focus-within:bg-white/[0.08] transition-all">
        {skills.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded text-xs text-white"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <FiX className="text-[10px]" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={skills.length === 0 ? "Type and press Enter..." : "..."}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none"
        />
      </div>
    </div>
  );
}

export default function SkillsSection({ isOpen, onToggle }) {
  const skills = useResumeStore((state) => state.resume.skills);
  const setSkillCategory = useResumeStore((state) => state.setSkillCategory);

  const categories = [
    { id: "languages", label: "Languages (e.g. JavaScript, Python)" },
    { id: "frontend", label: "Frontend (e.g. React, Next.js)" },
    { id: "backend", label: "Backend (e.g. Node.js, Django)" },
    { id: "database", label: "Database (e.g. PostgreSQL, MongoDB)" },
    { id: "tools", label: "Tools (e.g. Git, Docker)" },
  ];

  return (
    <SectionWrapper
      label="Technical Skills"
      icon={FiCode}
      color="#ff9eb5"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        {categories.map((cat) => (
          <SkillInput
            key={cat.id}
            label={cat.label}
            categoryId={cat.id}
            skills={skills[cat.id]}
            setSkillCategory={setSkillCategory}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
