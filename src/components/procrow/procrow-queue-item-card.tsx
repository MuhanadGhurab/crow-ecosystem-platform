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
  const stageLabel = item.stage.replace(/_/g, " ");
  const statusLabel = item.status.replace(/_/g, " ");

  return (
    <li className="cc-glass-card flex flex-col gap-3 !p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <ProCrowQueuePriorityBadge priority={item.priority} />
          <span className="rounded border border-slate-700/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
            {stageLabel}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-slate-600">{statusLabel}</span>
          <span className="text-[10px] text-slate-600">· {item.owner}</span>
        </div>
        <p className="font-medium text-white">{item.title}</p>
        {item.organizationName && (
          <p className="text-xs text-slate-500">
            {item.organizationName}
            {item.referenceCode && (
              <span className="ml-2 font-mono text-slate-600">{item.referenceCode}</span>
            )}
          </p>
        )}
        {!compact && item.description && (
          <p className="line-clamp-2 text-sm text-slate-500">{item.description}</p>
        )}
        <p className="text-xs text-amber-200/80">
          <span className="font-medium text-slate-500">Blocker: </span>
          {item.reason}
        </p>
        <p className="text-xs text-cyan-200/90">
          <span className="font-medium text-slate-500">Next: </span>
          {item.actionLabel}
        </p>
      </div>
      <Link
        href={item.relatedRoute}
        className="cc-btn-secondary shrink-0 text-center text-sm !px-4"
      >
        Open →
      </Link>
    </li>
  );
}
