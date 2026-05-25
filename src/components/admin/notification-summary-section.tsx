import Link from "next/link";
import { StatCard } from "@/components/ui/stat-card";
import { routes } from "@/lib/routes";
import type { PlatformNotificationInboxSummary } from "@/lib/services/platform-notification.service";
import { NotificationInboxRow } from "@/components/admin/notification-inbox-row";

export function NotificationSummarySection({
  summary,
}: {
  summary: PlatformNotificationInboxSummary;
}) {
  return (
    <section className="cc-glass-card !p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
            Platform notifications
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Subscription advisories, go-live signals, and pipeline log — advisory visibility only.
          </p>
        </div>
        <Link href={routes.admin.notifications} className="text-sm text-cyan-400 hover:text-cyan-300">
          Notification center →
        </Link>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Advisories (7d)"
          value={summary.recentAdvisoryCount}
          hint="open subscription events"
          accent="cyan"
        />
        <StatCard
          label="High priority"
          value={summary.highPriorityCount}
          hint="review recommended"
          accent="star"
        />
        <StatCard
          label="Tenants needing review"
          value={summary.tenantsNeedingReview}
          accent="violet"
        />
      </div>

      <p className="mt-2 text-xs text-slate-600">
        Last updated {summary.lastUpdatedAt.toLocaleString()}
      </p>

      {summary.latest.length > 0 && (
        <div className="mt-6 space-y-2 border-t border-cyan-500/10 pt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Latest notifications
          </p>
          <ul className="space-y-2">
            {summary.latest.map((row) => (
              <NotificationInboxRow key={row.id} row={row} compact />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
