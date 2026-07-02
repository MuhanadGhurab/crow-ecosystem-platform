"use client";

import { CrowMarkSvg } from "@/components/brand/crow-mark-svg";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";

const STAGES = [
  { id: "intent", label: "Organizational Intent", accent: "violet" },
  { id: "operating", label: "Operating Model", accent: "cyan", nested: true },
  { id: "blueprint", label: "Enterprise Blueprint", accent: "violet" },
  { id: "runtime", label: "Operational Runtime", accent: "cyan" },
] as const;

const OPERATING_ELEMENTS = ["People", "Responsibilities", "Workflows", "Trust"] as const;

const ACCENT = {
  cyan: {
    border: "border-cyan-500/35",
    bg: "bg-cyan-500/10",
    text: "text-cyan-200",
    line: "stroke-cyan-400/60",
  },
  violet: {
    border: "border-violet-500/35",
    bg: "bg-violet-500/10",
    text: "text-violet-200",
    line: "stroke-violet-400/50",
  },
} as const;

function StageNode({
  label,
  accent,
  nested,
  compact = false,
}: {
  label: string;
  accent: keyof typeof ACCENT;
  nested?: boolean;
  compact?: boolean;
}) {
  const a = ACCENT[accent];
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border text-center ${a.border} ${a.bg} ${
        nested ? "min-h-[88px] px-2 py-3 sm:min-h-[100px] sm:px-3" : compact ? "min-h-[64px] px-2 py-2" : "min-h-[72px] px-3 py-3"
      }`}
    >
      <span className={`text-[10px] font-semibold uppercase tracking-wide sm:text-xs ${a.text}`}>
        {label}
      </span>
      {nested ? (
        <div className="mt-2 grid w-full grid-cols-2 gap-1.5">
          {OPERATING_ELEMENTS.map((el) => (
            <span
              key={el}
              className="rounded-md border border-white/[0.08] bg-black/20 px-1 py-1 text-[8px] font-medium text-slate-300 sm:text-[9px]"
            >
              {el}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PublicOperatingDiagram() {
  return (
    <figure
      className="relative w-full"
      aria-labelledby="public-v2-operating-diagram-title"
      aria-describedby="public-v2-operating-diagram-desc"
    >
      <figcaption className="sr-only">
        <span id="public-v2-operating-diagram-title">Crow transformation model</span>
        <span id="public-v2-operating-diagram-desc">
          Organizational Intent flows to Operating Model with People, Responsibilities, Workflows,
          and Trust, then to Enterprise Blueprint and Operational Runtime.
        </span>
      </figcaption>

      <div
        className="pointer-events-none absolute right-2 top-2 opacity-[0.12] sm:right-4 sm:top-4"
        aria-hidden
      >
        <CrowMarkSvg variant="watermark" className="h-10 w-10 sm:h-12 sm:w-12" labeled={false} />
      </div>

      {/* Desktop / tablet horizontal flow */}
      <div className="hidden sm:block">
        <svg
          viewBox="0 0 720 160"
          className={`h-auto w-full max-h-[180px] ${PUBLIC_V2_MOTION_CLASS.diagram}`}
          role="img"
          aria-hidden
        >
          <path d="M108 80 H168" className={`fill-none ${ACCENT.violet.line}`} strokeWidth="2" markerEnd="url(#arrow)" />
          <path d="M312 80 H372" className={`fill-none ${ACCENT.cyan.line}`} strokeWidth="2" markerEnd="url(#arrow)" />
          <path d="M516 80 H576" className={`fill-none ${ACCENT.violet.line}`} strokeWidth="2" markerEnd="url(#arrow)" />
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" className="fill-cyan-400/70" />
            </marker>
          </defs>
        </svg>
        <div className="grid grid-cols-4 gap-2 lg:gap-3">
          <StageNode label={STAGES[0].label} accent="violet" compact />
          <StageNode label={STAGES[1].label} accent="cyan" nested />
          <StageNode label={STAGES[2].label} accent="violet" compact />
          <StageNode label={STAGES[3].label} accent="cyan" compact />
        </div>
      </div>

      {/* Mobile stacked flow */}
      <div className="flex flex-col gap-2 sm:hidden">
        {STAGES.map((stage, i) => (
          <div key={stage.id}>
            <StageNode
              label={stage.label}
              accent={stage.accent}
              nested={"nested" in stage ? stage.nested : false}
            />
            {i < STAGES.length - 1 ? (
              <div className="flex justify-center py-1" aria-hidden>
                <span className="text-cyan-400/60">↓</span>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </figure>
  );
}
