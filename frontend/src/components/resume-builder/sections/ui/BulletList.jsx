"use client";

import { FiPlus, FiTrash2 } from "react-icons/fi";

export default function BulletList({ label = "Bullet Points", bullets, onChange }) {
  const add = () => onChange([...bullets, ""]);
  const update = (i, val) => {
    const next = [...bullets];
    next[i] = val;
    onChange(next);
  };
  const remove = (i) => onChange(bullets.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">{label}</span>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 text-xs text-[#adc6ff] hover:text-white transition-colors"
        >
          <FiPlus className="text-xs" />
          Add Point
        </button>
      </div>

      <div className="space-y-2">
        {bullets.map((bullet, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-zinc-500 text-xs flex-shrink-0">•</span>
            <input
              value={bullet}
              onChange={(e) => update(i, e.target.value)}
              placeholder="Describe a key contribution or achievement…"
              className="flex-1 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#adc6ff]/60 transition-all"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove bullet point"
              className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors flex-shrink-0"
            >
              <FiTrash2 className="text-xs" />
            </button>
          </div>
        ))}
      </div>

      {bullets.length === 0 && (
        <p className="text-xs text-zinc-600 italic py-1">
          No bullet points yet. Click &quot;Add Point&quot; above.
        </p>
      )}
    </div>
  );
}
