import Link from "next/link";
import { routes } from "@/lib/routes";
import {
  resolveNotificationActionLink,
  type PlatformNotificationRow,
} from "@/lib/services/platform-notification.service";

export function TenantAdvisoryNotifications({
  rows,
}: {
  rows: PlatformNotificationRow[];
}) {
  if (rows.length === 0) {
    return (
      <section className="cc-glass-card space-y-2 !p-6">
        <h3 className="text-sm font-medium text-cyan-400">Platform advisories</h3>
        <p className="text-sm text-slate-500">
          No subscription advisories logged for this tenant yet. Advisories are deduped to once per
          24 hours per event type.
        </p>
        <Link href={routes.admin.notifications} className="text-xs text-cyan-400 hover:text-cyan-300">
          Open notification center →
        </Link>
      </section>
    );
  }

  return (
    <section className="cc-glass-card space-y-4 !p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium text-cyan-400">Platform advisories</h3>
          <p className="mt-1 text-xs text-slate-500">
            Recent subscription and usage advisories (display only — 24h dedupe on emit).
          </p>
        </div>
        <Link href={`${routes.admin.notifications}?tenant=${rows[0]?.parsed.tenantSlug ?? ""}`} className="text-xs text-cyan-400 hover:text-cyan-300">
          All for tenant →
        </Link>
      </div>
      <ul className="space-y-2">
        {rows.map((row) => {
          const action = resolveNotificationActionLink(row);
          return (
            <li
              key={row.id}
              className="rounded-cc-sm border border-amber-500/15 bg-amber-500/5 px-3 py-2 text-sm"
            >
              <p className="font-medium text-amber-100/90">{row.parsed.title}</p>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2 whitespace-pre-line">
                {row.body}
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                {row.createdAt.toLocaleString()} · {row.eventType} · {row.status}
                {action && (
                  <>
                    {" "}
                    ·{" "}
                    <Link href={action.href} className="text-cyan-400 hover:text-cyan-300">
                      {action.label} →
                    </Link>
                  </>
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
