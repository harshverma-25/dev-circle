"use client";

import { FiChevronDown } from "react-icons/fi";

export default function SectionWrapper({
  label,
  icon: Icon,
  color = "#adc6ff",
  isOpen,
  onToggle,
  children,
}) {
  return (
    <div
      className={`rounded-xl border transition-colors duration-200 ${
        isOpen ? "border-white/10" : "border-white/[0.05]"
      }`}
    >
      {/* ── Header / toggle button ── */}
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-4 py-3.5 bg-white/[0.03] hover:bg-white/[0.06] transition-colors duration-150 text-left ${
          isOpen ? "rounded-t-xl" : "rounded-xl"
        }`}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon style={{ color }} className="text-sm" />
        </div>
        <span className="flex-1 text-sm font-medium text-zinc-100">{label}</span>
        <FiChevronDown
          className={`text-zinc-500 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ── Expandable body ── */}
      {isOpen && (
        <div className="px-4 pb-4 pt-3 space-y-4 bg-white/[0.01] border-t border-white/[0.06] rounded-b-xl">
          {children}
        </div>
      )}
    </div>
  );
}
