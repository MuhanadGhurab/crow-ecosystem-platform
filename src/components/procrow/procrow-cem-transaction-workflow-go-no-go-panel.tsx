import type { CemTransactionWorkflowGoNoGoDependency } from "@/lib/cem/cem-transaction-workflow-contract";

type Props = {
  dependency: CemTransactionWorkflowGoNoGoDependency;
};

const STATUS_STYLE: Record<CemTransactionWorkflowGoNoGoDependency["status"], string> = {
  ready: "border-teal-500/30 text-teal-200",
  warning: "border-amber-500/30 text-amber-200",
  blocked: "border-rose-500/30 text-rose-200",
};

export function ProCrowCemTransactionWorkflowGoNoGoPanel({ dependency }: Props) {
  return (
    <section className="cc-glass-card cc-entity-block--cem !p-5 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-cyan-300">
          CEM transaction workflow (Go/No-Go dependency)
        </h2>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${STATUS_STYLE[dependency.status]}`}
        >
          {dependency.status}
        </span>
      </div>
      <p className="text-sm text-white">{dependency.label}</p>
      <p className="text-xs text-slate-400">{dependency.advisoryNote}</p>
      <ul className="list-disc pl-4 text-xs text-slate-500 space-y-1">
        {dependency.workflowChecks.map((check) => (
          <li key={check}>{check}</li>
        ))}
      </ul>
      <p className="text-xs text-slate-500">
        Does not auto-pass Go/No-Go — F23-gated production; no payment, accounting posting, or
        legal PO issuance.
      </p>
    </section>
  );
}
