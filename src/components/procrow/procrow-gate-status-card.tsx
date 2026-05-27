import type { ProCrowGateItem, ProCrowGateStatus } from "@/lib/procrow/procrow-go-no-go-contract";

const STATUS_DOT: Record<ProCrowGateStatus, string> = {
  pass: "bg-emerald-400",
  needs_review: "bg-amber-400",
  blocked: "bg-rose-500",
  not_run: "bg-slate-500",
  advisory: "bg-cyan-400",
};

type ProCrowGateStatusCardProps = {
  gate: ProCrowGateItem;
};

export function ProCrowGateStatusCard({ gate }: ProCrowGateStatusCardProps) {
  return (
    <article
      className="rounded-cc-sm border border-white/[0.06] bg-white/[0.02] p-4 text-sm"
      data-procrow-go-no-go-gate={gate.key}
    >
      <div className="flex items-start gap-2">
        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[gate.status]}`} aria-hidden />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-white">{gate.label}</h3>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{gate.status}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-600">{gate.category}</span>
          </div>
          <p className="text-slate-400">{gate.description}</p>
          {gate.evidence ? <p className="text-xs text-slate-500">{gate.evidence}</p> : null}
          {gate.relatedCommand ? (
            <p className="font-mono text-xs text-cyan-400/90">
              {gate.relatedCommand}
            </p>
          ) : null}
          {gate.relatedDoc ? <p className="text-xs text-slate-600">{gate.relatedDoc}</p> : null}
          {gate.risk ? <p className="text-xs text-amber-200/80">Risk: {gate.risk}</p> : null}
          <p className="border-t border-white/[0.04] pt-2 text-xs text-slate-300">
            <span className="font-semibold text-slate-400">Next: </span>
            {gate.operatorAction}
          </p>
        </div>
      </div>
    </article>
  );
}
