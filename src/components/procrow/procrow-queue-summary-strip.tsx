import type { ProCrowOperatorQueueSummary } from "@/lib/procrow/procrow-operator-queue-contract";

export function ProCrowQueueSummaryStrip({
  summary,
  compact,
}: {
  summary: ProCrowOperatorQueueSummary;
  compact?: boolean;
}) {
  const cells = compact
    ? [
        { k: "Total", v: summary.total },
        { k: "Critical", v: summary.critical },
        { k: "On ProCrow", v: summary.waitingOnProCrow },
        { k: "On client", v: summary.waitingOnClient },
      ]
    : [
        { k: "Total", v: summary.total },
        { k: "Critical", v: summary.critical },
        { k: "High", v: summary.high },
        { k: "Medium", v: summary.medium },
        { k: "Low", v: summary.low },
        { k: "Blocked", v: summary.blocked },
        { k: "On client", v: summary.waitingOnClient },
        { k: "On ProCrow", v: summary.waitingOnProCrow },
        { k: "Ready for action", v: summary.readyForAction },
      ];

  return (
    <div className="flex flex-wrap gap-2 rounded-lg border border-slate-700/60 bg-slate-900/40 px-3 py-2 text-xs text-slate-400">
      {cells.map((c) => (
        <span key={c.k} className="tabular-nums">
          <span className="text-slate-500">{c.k}:</span>{" "}
          <span className="font-mono text-slate-200">{c.v}</span>
        </span>
      ))}
    </div>
  );
}
