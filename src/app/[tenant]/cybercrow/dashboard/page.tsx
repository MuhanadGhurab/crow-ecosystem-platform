import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { routes } from "@/lib/routes";
import {
  countLogisticsAuditEvents,
  tenantHasLogisticsModule,
} from "@/lib/services/cybercrow-logistics-audit.service";
import { getCybercrowDashboardMetrics } from "@/lib/services/cybercrow-dashboard.service";
import { listTenantAuditLogs } from "@/lib/services/cybercrow-tenant.service";
import { safeWorkspaceSummary } from "@/lib/services/workspace-summary-safe";
import { getTenantBySlug } from "@/lib/services/tenant.service";

const SEVERITY_CLASS: Record<string, string> = {
  info: "text-cyan-400",
  low: "text-teal-400",
  medium: "text-amber-300",
  high: "text-rose-400",
  critical: "text-rose-500",
};

export default async function CybercrowDashboardPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);

  if (!tenant) {
    notFound();
  }

  const [summary, metrics] = await Promise.all([
    safeWorkspaceSummary(tenant.id),
    getCybercrowDashboardMetrics(tenant.id),
  ]);
  const moduleKeys = (tenant.modules ?? []).map((m) => m.moduleKey);
  const logisticsOpsEnabled = tenantHasLogisticsModule(moduleKeys);
  const logisticsAuditCount = logisticsOpsEnabled
    ? await countLogisticsAuditEvents(tenant.id)
    : 0;
  const recentLogisticsAudit = logisticsOpsEnabled
    ? await listTenantAuditLogs(tenant.id, { category: "logistics", limit: 4 })
    : [];
  const r = routes.tenant(slug).cybercrow;
  const initialized = summary.cybercrowInitialized;
  const riskLevel =
    metrics.riskScore >= 80 ? "low" : metrics.riskScore >= 60 ? "mid" : "high";
  const trendLabel =
    metrics.riskTrend === "up"
      ? "up"
      : metrics.riskTrend === "down"
        ? "down"
        : "stable";

  return (
    <div className="space-y-8">
      {initialized && (
        <section className="rounded-lg border border-teal-500/25 bg-teal-950/20 px-4 py-3 text-sm text-teal-100/90">
          <p className="font-medium text-teal-300">CyberCrow baseline active</p>
          <p className="mt-1 text-xs text-slate-400">
            Audit action <code className="text-teal-400">CYBERCROW_INITIALIZED</code>
            {summary.cybercrowInitializedAt
              ? ` · ${summary.cybercrowInitializedAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}`
              : " · recorded at provision"}
          </p>
        </section>
      )}

      {metrics.demoMetrics && (
        <section className="rounded-lg border border-amber-500/20 bg-amber-950/20 px-4 py-3 text-sm text-amber-100/90">
          <p className="font-medium text-amber-300">Posture from live counts</p>
          <p className="mt-1 text-xs text-slate-400">
            No seeded incidents or security events yet — score reflects audit log volume (
            {summary.auditLogCount}) until baseline rows are provisioned.
          </p>
        </section>
      )}

      <PageHeader
        badge="CyberCrow"
        entity="cybercrow"
        title="Security operations center"
        description="NCA-aligned baseline · real-time posture · audit, risk, and compliance in one console."
      />

      <section className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/40 via-cc-elevated/90 to-indigo-950/30 p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-600/25 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
              Posture score
            </p>
            <p className="mt-2 font-display text-5xl font-bold tabular-nums text-white sm:text-6xl">
              {metrics.riskScore}
              <span className="ml-2 text-lg font-medium text-violet-300/80">/ 100</span>
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Trending {trendLabel} · {summary.securityEventCount} security events · compliance{" "}
              <span className="text-indigo-300">{metrics.compliancePct}%</span>
            </p>
          </div>
          <div className="min-w-[12rem] flex-1 lg:max-w-md">
            <div className="cc-risk-meter">
              <span
                className={`cc-risk-meter-fill cc-risk-meter-fill--${riskLevel}`}
                style={{ width: `${metrics.riskScore}%` }}
              />
            </div>
            <p className="mt-2 text-right text-xs text-slate-500">
              Derived from incidents ({metrics.openIncidentCount} open) and event severity
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Audit log entries"
          value={summary.auditLogCount}
          entity="cybercrow"
          accent="violet"
        />
        <StatCard
          label="Security events"
          value={summary.securityEventCount}
          entity="cybercrow"
          accent="indigo"
        />
        <StatCard
          label="Open incidents"
          value={metrics.openIncidentCount}
          entity="cybercrow"
          accent="star"
          hint="Active response"
        />
        <StatCard
          label="High-severity events"
          value={metrics.highSeverityEventCount}
          entity="cybercrow"
          accent="violet"
        />
      </section>

      {logisticsOpsEnabled && logisticsAuditCount > 0 && (
        <section className="cc-glass-card border-teal-500/15">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-teal-300">Logistics operations audit</h3>
            <Link
              href={`${r.auditLogs}?category=logistics`}
              className="text-xs text-teal-400 hover:text-teal-300"
            >
              {logisticsAuditCount} logistics events →
            </Link>
          </div>
          <ul className="mt-4 space-y-2">
            {recentLogisticsAudit.map((log) => (
              <li key={log.id} className="cc-list-item flex-col !items-start gap-1 sm:flex-row sm:items-center">
                <span className="text-white">{log.action.replace(/_/g, " ").toLowerCase()}</span>
                <span className="text-xs text-slate-500">
                  {log.createdAt.toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}
                </span>
              </li>
            ))}
          </ul>
          {hasErpModule(tenant.modules ?? [], "logistics") && (
            <Link href={routes.tenant(slug).logistics} className="mt-3 inline-block text-xs text-cyan-400">
              Logistics hub →
            </Link>
          )}
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card">
          <h3 className="text-sm font-medium text-violet-300">Recent security events</h3>
          {metrics.recentEvents.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No security events recorded yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {metrics.recentEvents.map((e) => (
                <li key={e.id} className="cc-list-item flex-col !items-start gap-1 sm:flex-row sm:items-center">
                  <span className="text-white">{e.action}</span>
                  <span className={`text-xs font-medium ${SEVERITY_CLASS[e.severity] ?? "text-slate-400"}`}>
                    {e.severity} · {e.at}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={r.securityEvents}
            className="mt-4 inline-block text-xs text-violet-400 hover:text-violet-300"
          >
            All security events →
          </Link>
        </section>

        <section className="cc-glass-card">
          <h3 className="text-sm font-medium text-violet-300">Compliance controls</h3>
          {metrics.controls.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              Controls appear after CyberCrow baseline seed at provision.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {metrics.controls.map((c) => (
                <li key={c.key}>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span className="font-mono text-slate-300">{c.key}</span>
                    <span>
                      {c.status} · {c.pct}%
                    </span>
                  </div>
                  <div className="cc-risk-meter mt-1">
                    <span
                      className={`cc-risk-meter-fill ${c.pct >= 90 ? "cc-risk-meter-fill--low" : c.pct >= 70 ? "cc-risk-meter-fill--mid" : "cc-risk-meter-fill--high"}`}
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={r.compliance}
            className="mt-4 inline-block text-xs text-violet-400 hover:text-violet-300"
          >
            Compliance console →
          </Link>
        </section>
      </div>

      <section className="cc-glass-card">
        <h3 className="text-sm font-medium text-violet-300">Security areas</h3>
        <nav className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: r.auditLogs, label: "Audit logs", sub: `${summary.auditLogCount} entries` },
            { href: r.risk, label: "Risk", sub: `Score ${metrics.riskScore}` },
            { href: r.compliance, label: "Compliance", sub: `${metrics.compliancePct}%` },
            { href: r.incidents, label: "Incidents", sub: `${metrics.openIncidentCount} open` },
            { href: r.identity, label: "Identity", sub: "IdP & MFA" },
            { href: r.sessions, label: "Sessions", sub: "Activity" },
            { href: r.grc, label: "GRC", sub: "Summary & findings" },
            { href: r.evidence, label: "Evidence", sub: "Repository" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 px-4 py-3 transition hover:border-violet-400/35 hover:bg-violet-500/10"
            >
              <span className="font-medium text-white">{item.label}</span>
              <span className="mt-0.5 block text-xs text-slate-500">{item.sub}</span>
            </Link>
          ))}
        </nav>
      </section>
    </div>
  );
}
