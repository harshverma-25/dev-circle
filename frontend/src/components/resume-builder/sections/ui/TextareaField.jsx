export default function TextareaField({ label, id, rows = 4, hint, ...props }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-medium text-zinc-400">
          {label}
        </label>
        {hint && <span className="text-[11px] text-zinc-600">{hint}</span>}
      </div>
      <textarea
        id={id}
        rows={rows}
        className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#adc6ff]/60 focus:bg-white/[0.08] transition-all duration-150 resize-none"
        {...props}
      />
    </div>
  );
}
