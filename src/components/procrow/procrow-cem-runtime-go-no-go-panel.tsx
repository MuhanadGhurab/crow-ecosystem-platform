import type { CemRuntimeGoNoGoDependency } from "@/lib/cem/cem-runtime-handoff-contract";

type Props = {
  dependency: CemRuntimeGoNoGoDependency;
};

const STATUS_STYLE: Record<CemRuntimeGoNoGoDependency["status"], string> = {
  ready: "border-teal-500/30 text-teal-200",
  warning: "border-amber-500/30 text-amber-200",
  blocked: "border-rose-500/30 text-rose-200",
};

export function ProCrowCemRuntimeGoNoGoPanel({ dependency }: Props) {
  return (
    <section className="cc-glass-card cc-entity-block--cem !p-5 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-cyan-300">
          CEM runtime handoff (Go/No-Go dependency)
        </h2>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${STATUS_STYLE[dependency.status]}`}
        >
          {dependency.status}
        </span>
      </div>
      <p className="text-sm text-white">{dependency.label}</p>
      <p className="text-xs text-slate-400">{dependency.advisoryNote}</p>
      <p className="text-xs text-slate-500">{dependency.relationshipNote}</p>
      <p className="text-xs text-slate-500">
        Staging Business Portal handoff only — F23-gated production; no payment or subscription
        activation.
      </p>
    </section>
  );
}
