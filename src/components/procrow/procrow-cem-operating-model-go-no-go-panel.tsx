import type { CemOperatingGoNoGoDependency } from "@/lib/cem/cem-operating-model-contract";

type Props = {
  dependency: CemOperatingGoNoGoDependency;
};

const STATUS_STYLE: Record<CemOperatingGoNoGoDependency["status"], string> = {
  ready: "border-teal-500/30 text-teal-200",
  warning: "border-amber-500/30 text-amber-200",
  blocked: "border-rose-500/30 text-rose-200",
};

export function ProCrowCemOperatingModelGoNoGoPanel({ dependency }: Props) {
  return (
    <section className="cc-glass-card cc-entity-block--cem !p-5 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-teal-300">
          CEM core operating model (Go/No-Go dependency)
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
      <ul className="list-disc pl-4 text-xs text-slate-500 space-y-1">
        {dependency.spineChecks.map((check) => (
          <li key={check}>{check}</li>
        ))}
      </ul>
      <p className="text-xs text-slate-500">
        Staging operational model only — F23-gated production; no payment or subscription activation.
      </p>
    </section>
  );
}
