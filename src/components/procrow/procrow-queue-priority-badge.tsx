import type { ProCrowQueuePriority } from "@/lib/procrow/procrow-operator-queue-contract";

function tone(p: ProCrowQueuePriority): string {
  switch (p) {
    case "critical":
      return "border-rose-500/50 bg-rose-500/15 text-rose-100";
    case "high":
      return "border-rose-500/35 bg-rose-500/10 text-rose-200";
    case "medium":
      return "border-amber-500/30 bg-amber-500/10 text-amber-100";
    default:
      return "border-slate-600/50 bg-slate-800/40 text-slate-300";
  }
}

export function ProCrowQueuePriorityBadge({ priority }: { priority: ProCrowQueuePriority }) {
  return (
    <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tone(priority)}`}>
      {priority}
    </span>
  );
}
