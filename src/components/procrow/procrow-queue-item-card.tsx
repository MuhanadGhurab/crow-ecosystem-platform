import Link from "next/link";
import type { ProCrowOperatorQueueItem } from "@/lib/procrow/procrow-operator-queue-contract";
import { ProCrowQueuePriorityBadge } from "@/components/procrow/procrow-queue-priority-badge";

export function ProCrowQueueItemCard({
  item,
  compact,
}: {
  item: ProCrowOperatorQueueItem;
  compact?: boolean;
}) {
  return (
    <li className="cc-glass-card flex flex-col gap-2 !p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <ProCrowQueuePriorityBadge priority={item.priority} />
          <span className="text-[10px] uppercase tracking-wide text-slate-500">{item.owner}</span>
          <span className="text-[10px] uppercase tracking-wide text-slate-500">{item.stage.replace(/_/g, " ")}</span>
          <span className="text-[10px] uppercase tracking-wide text-slate-600">{item.status.replace(/_/g, " ")}</span>
        </div>
        <p className="font-medium text-white">{item.title}</p>
        {!compact && <p className="text-sm text-slate-400">{item.description}</p>}
        <p className="text-xs text-slate-500">{item.reason}</p>
        {item.organizationName && (
          <p className="text-xs text-slate-600">
            Org: <span className="text-slate-400">{item.organizationName}</span>
          </p>
        )}
      </div>
      <Link
        href={item.relatedRoute}
        className="shrink-0 rounded border border-cyan-500/30 px-3 py-1.5 text-center text-sm text-cyan-300 hover:bg-cyan-500/10"
      >
        {item.actionLabel}
      </Link>
    </li>
  );
}
