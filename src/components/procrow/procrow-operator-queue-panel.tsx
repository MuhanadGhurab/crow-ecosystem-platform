import Link from "next/link";
import type { ProCrowOperatorQueueSnapshot } from "@/lib/procrow/procrow-operator-queue-contract";
import { routes } from "@/lib/routes";
import { ProCrowQueueSummaryStrip } from "@/components/procrow/procrow-queue-summary-strip";
import { ProCrowQueueItemCard } from "@/components/procrow/procrow-queue-item-card";
import { ProCrowQueueEmptyState } from "@/components/procrow/procrow-queue-empty-state";

export function ProCrowOperatorQueuePanel({
  snapshot,
  compact,
  showSummary = true,
  showSafetyNotes = true,
  fullQueueHref,
  title = "Operator queue",
}: {
  snapshot: ProCrowOperatorQueueSnapshot;
  compact?: boolean;
  showSummary?: boolean;
  showSafetyNotes?: boolean;
  /** When set, shows link to full queue page (e.g. /admin/queue) */
  fullQueueHref?: string;
  title?: string;
}) {
  const top = compact ? snapshot.items.slice(0, 5) : snapshot.items.slice(0, 12);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">{title}</h2>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {fullQueueHref && (
            <Link href={fullQueueHref} className="text-cyan-400 hover:text-cyan-300">
              Full operator queue →
            </Link>
          )}
          <Link href={routes.admin.requests} className="text-slate-500 hover:text-slate-300">
            Requests
          </Link>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Operator-guided, derived readiness from existing signals — not a task engine. Production remains F23-gated;
        tenant provisioning stays ProCrow-controlled.
      </p>

      {showSummary && <ProCrowQueueSummaryStrip summary={snapshot.summary} compact={compact} />}

      {snapshot.items.length === 0 ? (
        <ProCrowQueueEmptyState />
      ) : (
        <ul className="space-y-2">
          {top.map((item) => (
            <ProCrowQueueItemCard key={item.id} item={item} compact={compact} />
          ))}
        </ul>
      )}

      {showSafetyNotes && snapshot.safetyNotes.length > 0 && (
        <ul className="list-inside list-disc space-y-1 text-[11px] text-slate-500">
          {snapshot.safetyNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
