import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { CybercrowAuditLogList } from "@/components/tenant/cybercrow/cybercrow-audit-log-list";
import type { LogisticsAuditFilter } from "@/lib/constants/cybercrow-audit-events";
import { isLogisticsAuditAction } from "@/lib/constants/cybercrow-audit-events";
import { listPlatformAuditFeed } from "@/lib/services/platform-admin.service";

function parseCategory(raw: string | undefined): LogisticsAuditFilter {
  if (raw === "logistics" || raw === "platform") return raw;
  return "all";
}

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tenant?: string }>;
}) {
  const { category: categoryParam, tenant: tenantSlug } = await searchParams;
  const category = parseCategory(categoryParam);
  const { cyberLogs, notifications } = await listPlatformAuditFeed(60, {
    category,
    tenantSlug: tenantSlug || undefined,
  });

  const logisticsCount = cyberLogs.filter((log) => isLogisticsAuditAction(log.action)).length;
  const tenantSlugs = [...new Set(cyberLogs.map((log) => log.tenant.slug))];

  const base = "/admin/audit";
  const filterHref = (cat: LogisticsAuditFilter, slug?: string) => {
    const params = new URLSearchParams();
    if (cat !== "all") params.set("category", cat);
    if (slug) params.set("tenant", slug);
    const q = params.toString();
    return q ? `${base}?${q}` : base;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Platform Admin"
        title="Audit & notifications"
        description="Cross-tenant CyberCrow audit events and pipeline email notification log. Filter logistics ops for MEEM and other logistics tenants."
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-cc-sm border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
          <p className="text-xs text-slate-500">Audit entries (this feed)</p>
          <p className="text-2xl font-bold tabular-nums text-cyan-200">{cyberLogs.length}</p>
        </div>
        <div className="rounded-cc-sm border border-teal-500/20 bg-teal-500/5 px-4 py-3">
          <p className="text-xs text-slate-500">Logistics-tagged (filtered view)</p>
          <p className="text-2xl font-bold tabular-nums text-teal-200">{logisticsCount}</p>
        </div>
        <div className="rounded-cc-sm border border-white/10 bg-white/[0.03] px-4 py-3">
          <p className="text-xs text-slate-500">Tenants in feed · notifications</p>
          <p className="text-2xl font-bold tabular-nums text-white">
            {tenantSlugs.length} · {notifications.length}
          </p>
        </div>
      </section>

      <nav className="flex flex-wrap gap-2" aria-label="Platform audit filters">
        {(
          [
            { key: "all" as const, label: "All audit" },
            { key: "logistics" as const, label: "Logistics ops" },
            { key: "platform" as const, label: "Platform & policy" },
          ] as const
        ).map((tab) => (
          <Link
            key={tab.key}
            href={filterHref(tab.key, tenantSlug)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              category === tab.key
                ? "bg-cyan-500/20 text-cyan-200"
                : "bg-white/5 text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </Link>
        ))}
        <Link
          href={filterHref("logistics", "meem-global")}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            tenantSlug === "meem-global" && category === "logistics"
              ? "bg-teal-500/20 text-teal-200"
              : "bg-white/5 text-slate-400 hover:text-slate-200"
          }`}
        >
          MEEM logistics
        </Link>
      </nav>

      <section className="cc-glass-card">
        <h3 className="font-display text-sm font-semibold text-cyan-400">Email notifications</h3>
        {notifications.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No notifications logged yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {notifications.map((n) => (
              <li key={n.id} className="cc-list-item flex-col !items-start gap-1">
                <p className="text-white">{n.subject}</p>
                <p className="text-xs text-slate-500">
                  {n.eventType} → {n.recipientEmail} ·{" "}
                  <span
                    className={
                      n.status === "sent"
                        ? "text-teal-300"
                        : n.status === "failed"
                          ? "text-red-400"
                          : n.status === "skipped"
                            ? "text-amber-300"
                            : "text-slate-400"
                    }
                  >
                    {n.status === "skipped" && n.errorMessage
                      ? `skipped — ${n.errorMessage}`
                      : n.status === "failed" && n.errorMessage
                        ? `failed — ${n.errorMessage}`
                        : n.status}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="cc-glass-card">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          CyberCrow audit log
          {tenantSlug ? (
            <span className="ml-2 font-normal text-slate-500">/{tenantSlug}</span>
          ) : null}
        </h3>
        {cyberLogs.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No audit entries.</p>
        ) : (
          <div className="mt-3 space-y-4">
            <CybercrowAuditLogList
              logs={cyberLogs.map((log) => ({
                id: log.id,
                action: log.action,
                entityType: log.entityType,
                entityId: log.entityId,
                metadata: log.metadata,
                createdAt: log.createdAt,
              }))}
            />
            <ul className="space-y-1 border-t border-white/5 pt-3 text-xs text-slate-500">
              {cyberLogs.slice(0, 12).map((log) => (
                <li key={`${log.id}-tenant`}>
                  {log.tenant.organization.displayName} · /{log.tenant.slug}
                  {isLogisticsAuditAction(log.action) ? " · logistics" : null}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
