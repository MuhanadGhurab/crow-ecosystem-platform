"use client";

import type { JourneyKind } from "@/lib/crow-story/types";

export function CrowStoryDecision({
  selected,
  onSelect,
  className = "",
}: {
  selected: JourneyKind | null;
  onSelect: (journey: JourneyKind) => void;
  className?: string;
}) {
  const options: Array<{ key: JourneyKind; label: string; description: string }> = [
    {
      key: "NEW",
      label: "Build a New Organization",
      description: "Design from purpose and expected scale — departments optional at first.",
    },
    {
      key: "TRANSFORM",
      label: "Transform an Existing Organization",
      description: "Preserve what works and design a controlled transition.",
    },
  ];

  return (
    <div className={`grid gap-3 sm:grid-cols-2 ${className}`} role="group" aria-label="Organization path">
      {options.map((opt) => {
        const isSelected = selected === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(opt.key)}
            className={`cc-glass-card min-h-[48px] rounded-xl border p-4 text-left transition-colors motion-reduce:transition-none ${
              isSelected
                ? "border-cyan-500/60 bg-cyan-500/10 ring-2 ring-cyan-500/30"
                : "border-white/10 hover:border-white/20"
            }`}
            style={{
              transform: isSelected ? "scale(1.02)" : undefined,
              transitionDuration: "220ms",
            }}
          >
            <span className="flex items-center gap-2 font-semibold text-white">
              {isSelected ? (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-xs text-slate-950" aria-hidden>
                  ✓
                </span>
              ) : (
                <span className="inline-flex h-5 w-5 rounded-full border border-slate-600" aria-hidden />
              )}
              {opt.label}
            </span>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{opt.description}</p>
          </button>
        );
      })}
    </div>
  );
}
