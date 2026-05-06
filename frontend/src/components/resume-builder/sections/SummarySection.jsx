"use client";

import { FiFileText } from "react-icons/fi";
import useResumeStore from "../../../store/useResumeStore";
import SectionWrapper from "./ui/SectionWrapper";
import TextareaField from "./ui/TextareaField";

export default function SummarySection({ isOpen, onToggle }) {
  const summary = useResumeStore((state) => state.resume.summary);
  const setSummary = useResumeStore((state) => state.setSummary);

  return (
    <SectionWrapper
      label="Professional Summary"
      icon={FiFileText}
      color="#b5ead7"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <TextareaField
        label="Summary"
        id="summary-text"
        rows={6}
        placeholder="A brief summary of your professional background, key skills, and career goals..."
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        hint={`${summary.length} characters`}
      />
    </SectionWrapper>
  );
}
