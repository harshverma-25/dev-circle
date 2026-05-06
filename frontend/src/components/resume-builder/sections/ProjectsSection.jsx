"use client";

import { useState } from "react";
import { FiGitBranch, FiPlus, FiTrash2, FiChevronDown } from "react-icons/fi";
import useResumeStore from "../../../store/useResumeStore";
import SectionWrapper from "./ui/SectionWrapper";
import FormField from "./ui/FormField";
import BulletList from "./ui/BulletList";

function ProjectEntry({ entry, index, update, remove }) {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  const headerText = entry.title || "New Project";

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
          aria-label="Remove project"
        >
          <FiTrash2 className="text-sm" />
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Project Title"
              id={`proj-title-${entry.id}`}
              placeholder="e.g. E-Commerce Platform"
              value={entry.title}
              onChange={(e) => update(entry.id, { title: e.target.value })}
            />
            <FormField
              label="Tech Stack"
              id={`proj-tech-${entry.id}`}
              placeholder="e.g. React, Node.js, MongoDB"
              value={entry.techStack}
              onChange={(e) => update(entry.id, { techStack: e.target.value })}
            />
            <FormField
              label="Live Link"
              id={`proj-live-${entry.id}`}
              placeholder="e.g. https://myproject.com"
              value={entry.liveLink}
              onChange={(e) => update(entry.id, { liveLink: e.target.value })}
            />
            <FormField
              label="GitHub Link"
              id={`proj-github-${entry.id}`}
              placeholder="e.g. github.com/user/project"
              value={entry.githubLink}
              onChange={(e) => update(entry.id, { githubLink: e.target.value })}
            />
          </div>
          
          <BulletList
            label="Project Details & Features"
            bullets={entry.bullets}
            onChange={(bullets) => update(entry.id, { bullets })}
          />
        </div>
      )}
    </div>
  );
}

export default function ProjectsSection({ isOpen, onToggle }) {
  const projects = useResumeStore((state) => state.resume.projects);
  const addProject = useResumeStore((state) => state.addProject);
  const updateProject = useResumeStore((state) => state.updateProject);
  const removeProject = useResumeStore((state) => state.removeProject);

  return (
    <SectionWrapper
      label="Projects"
      icon={FiGitBranch}
      color="#a0d2ff"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-3">
        {projects.map((entry, index) => (
          <ProjectEntry
            key={entry.id}
            index={index}
            entry={entry}
            update={updateProject}
            remove={removeProject}
          />
        ))}

        {projects.length === 0 && (
          <p className="text-xs text-zinc-500 text-center py-4 bg-white/[0.02] rounded-lg border border-white/5 border-dashed">
            No projects added yet.
          </p>
        )}

        <button
          type="button"
          onClick={addProject}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-white/20 text-[#a0d2ff] text-sm font-medium hover:bg-white/[0.03] transition-colors"
        >
          <FiPlus /> Add Project
        </button>
      </div>
    </SectionWrapper>
  );
}
