import Link from "next/link";
import { moduleLabel } from "@/lib/catalog-labels";
import { MEEM_LOGISTICS_FEATURES } from "@/lib/meem/meem-ops-catalog";
import { routes } from "@/lib/routes";
import type { CybercrowDashboardMetrics } from "@/lib/services/cybercrow-dashboard.service";
import type { SareaRuntimeContext } from "@/lib/services/sarea-runtime.service";
import { isWidgetVisible } from "@/lib/services/sarea-runtime.service";

type TenantDashboardWidgetsProps = {
  slug: string;
  runtime: SareaRuntimeContext;
  isMeem?: boolean;
  aiExtraKeys?: string[];
  summary: {
    profileCount: number;
    departmentCount: number;
    roleCount: number;
    auditLogCount: number;
    moduleCount: number;
    openTaskCount?: number;
    workflowCount?: number;
  };
  modules: { id: string; moduleKey: string }[];
  cybercrow?: {
    initialized: boolean;
    initializedAt: Date | null;
    metrics: CybercrowDashboardMetrics | null;
  };
};

export function SareaDashboardWidgets({
  slug,
  runtime,
  isMeem = false,
  aiExtraKeys = [],
  summary,
  modules,
  cybercrow,
}: TenantDashboardWidgetsProps) {
  const r = routes.tenant(slug);
  const gridClass = runtime.compact
    ? "grid gap-3 sm:grid-cols-2"
    : runtime.density === "spacious"
      ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

  const enabledAi = new Set(aiExtraKeys);
  const activeAi = isMeem
    ? MEEM_LOGISTICS_FEATURES.filter((f) => enabledAi.has(f.aiExtraKey))
    : [];

  return (
    <>
      {isWidgetVisible(runtime, "operational_load") && (
        <section className="grid gap-4 lg:grid-cols-3">
          <article className="cc-glass-card lg:col-span-2">
            <h3 className="text-sm font-medium text-cyan-400">Operational load</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Open tasks",
                  value: String(summary.openTaskCount ?? 0),
                  pct: Math.min(100, (summary.openTaskCount ?? 0) * 18 + 12),
                },
                {
                  label: "Workflows",
                  value: String(summary.workflowCount ?? 0),
                  pct: Math.min(100, (summary.workflowCount ?? 0) * 20 + 20),
                },
                { label: "Modules live", value: `${summary.moduleCount}`, pct: 92 },
              ].map((w) => (
                <div
                  key={w.label}
                  className="rounded-cc-sm border border-cyan-500/10 bg-white/[0.03] p-3"
                >
                  <p className="text-2xl font-bold tabular-nums text-cyan-300">{w.value}</p>
                  <p className="text-xs text-slate-500">{w.label}</p>
                  <div className="cc-risk-meter mt-2">
                    <span
                      className="cc-risk-meter-fill cc-risk-meter-fill--low"
                      style={{ width: `${w.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
          {isWidgetVisible(runtime, "cybercrow_posture") && cybercrow?.initialized && cybercrow.metrics && (
            <article className="cc-glass-card border-violet-500/15">
              <h3 className="text-sm font-medium text-violet-300">Risk snapshot</h3>
              <p className="mt-3 font-display text-4xl font-bold text-violet-200">
                {cybercrow.metrics.riskScore}
              </p>
              <p className="text-xs text-slate-500">
                Trend {cybercrow.metrics.riskTrend} · {cybercrow.metrics.openIncidentCount} open
                incidents
              </p>
              <Link
                href={r.cybercrow.dashboard}
                className="mt-4 inline-block text-xs text-violet-400 hover:text-violet-300"
              >
                Open CyberCrow →
              </Link>
            </article>
          )}
        </section>
      )}

      {isWidgetVisible(runtime, "cybercrow_posture") && cybercrow && (
        <section className="cc-glass-card border-violet-500/15">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-violet-300">CyberCrow posture</h3>
              {cybercrow.initialized ? (
                <>
                  <p className="mt-2 text-xs text-teal-300/90">
                    Initialized
                    {cybercrow.initializedAt
                      ? ` · ${cybercrow.initializedAt.toLocaleString("en-GB", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}`
                      : ""}
                  </p>
                  {cybercrow.metrics && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-4">
                      <div>
                        <p className="text-2xl font-bold tabular-nums text-violet-200">
                          {cybercrow.metrics.riskScore}
                        </p>
                        <p className="text-xs text-slate-500">Risk score</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold tabular-nums text-teal-300">
                          {cybercrow.metrics.compliancePct}%
                        </p>
                        <p className="text-xs text-slate-500">Compliance</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold tabular-nums text-amber-300">
                          {cybercrow.metrics.openIncidentCount}
                        </p>
                        <p className="text-xs text-slate-500">Open incidents</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold tabular-nums text-cyan-300">
                          {summary.auditLogCount}
                        </p>
                        <p className="text-xs text-slate-500">Audit events</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="mt-2 text-sm text-amber-300/90">
                  Awaiting CyberCrow initialization — posture metrics appear after pipeline
                  `initializeCyberCrow`.
                </p>
              )}
            </div>
            <Link href={r.cybercrow.dashboard} className="cc-btn-secondary text-sm">
              CyberCrow console
            </Link>
          </div>
          {cybercrow.initialized && cybercrow.metrics && cybercrow.metrics.controls.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {cybercrow.metrics.controls.slice(0, 4).map((c) => (
                <li
                  key={c.key}
                  className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200"
                >
                  {c.key} · {c.pct}%
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className={gridClass}>
        {isWidgetVisible(runtime, "fleet_kpis") && (
          <article className="cc-glass-card border-teal-500/15 lg:col-span-2">
            <p className="text-sm font-medium text-teal-300">Fleet KPIs</p>
            <p className="mt-1 text-xs text-slate-500">
              SLA breaches · regional hub load · on-time delivery signals
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-2xl font-bold tabular-nums text-teal-300">94%</p>
                <p className="text-xs text-slate-500">On-time delivery</p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-amber-300">3</p>
                <p className="text-xs text-slate-500">SLA breaches (7d)</p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-cyan-300">3</p>
                <p className="text-xs text-slate-500">Active hub sites</p>
              </div>
            </div>
            {isMeem && activeAi.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {activeAi.map((f) => (
                  <li
                    key={f.key}
                    className="rounded-full border border-teal-500/25 bg-teal-500/10 px-3 py-1 text-xs text-teal-300"
                  >
                    {f.title}
                  </li>
                ))}
              </ul>
            )}
            <Link href={r.logistics} className="mt-3 inline-block text-xs text-teal-400">
              Logistics hub →
            </Link>
          </article>
        )}

        {isWidgetVisible(runtime, "ops_board") && (
          <article className="cc-glass-card border-cyan-500/15">
            <p className="text-sm font-medium text-cyan-300">Ops board</p>
            <p className="mt-1 text-xs text-slate-500">Dispatch queue · warehouse throughput</p>
            <p className="mt-3 text-2xl font-bold tabular-nums text-cyan-300">
              {summary.openTaskCount ?? "—"}
            </p>
            <p className="text-xs text-slate-500">Open workflow tasks</p>
            <p className="mt-2 text-sm text-slate-400">
              {summary.workflowCount ?? 0} active workflow
              {(summary.workflowCount ?? 0) === 1 ? "" : "s"}
            </p>
            <Link href={r.workflows} className="mt-3 inline-block text-xs text-cyan-400">
              Workflows →
            </Link>
          </article>
        )}

        {isWidgetVisible(runtime, "pod_mobile") && (
          <article className="cc-glass-card border-teal-500/15">
            <p className="text-sm font-medium text-teal-300">POD mobile</p>
            <p className="mt-1 text-xs text-slate-500">Shipment scan · proof of delivery · OCR verify</p>
            <Link href={r.workflows} className="mt-4 inline-block cc-btn-secondary text-sm">
              Open POD capture
            </Link>
            <Link href={r.tasks} className="mt-2 block text-xs text-teal-400">
              My tasks →
            </Link>
          </article>
        )}

        {isWidgetVisible(runtime, "tasks") && (
          <article className="cc-glass-card">
            <p className="text-2xl font-bold text-cyan-300">{summary.openTaskCount ?? "—"}</p>
            <p className="text-sm text-slate-500">Open tasks</p>
            <Link href={r.tasks} className="mt-2 inline-block text-xs text-cyan-400">
              Open tasks →
            </Link>
          </article>
        )}
        {isWidgetVisible(runtime, "alerts") && (
          <article className="cc-glass-card border-violet-500/15">
            <p className="text-2xl font-bold text-violet-300">{summary.auditLogCount}</p>
            <p className="text-sm text-slate-500">Security signals</p>
            <Link href={r.cybercrow.dashboard} className="mt-2 inline-block text-xs text-violet-400">
              CyberCrow →
            </Link>
          </article>
        )}
        {isWidgetVisible(runtime, "structure") && (
          <>
            <article className="cc-glass-card">
              <p className="text-2xl font-bold text-cyan-300">{summary.profileCount}</p>
              <p className="text-sm text-slate-500">CEM users</p>
            </article>
            <article className="cc-glass-card">
              <p className="text-2xl font-bold text-teal-300">{summary.departmentCount}</p>
              <p className="text-sm text-slate-500">Departments</p>
            </article>
            <article className="cc-glass-card">
              <p className="text-2xl font-bold text-cyan-300">{summary.roleCount}</p>
              <p className="text-sm text-slate-500">Roles</p>
            </article>
          </>
        )}
        {isWidgetVisible(runtime, "modules") && (
          <article className="cc-glass-card">
            <p className="text-2xl font-bold text-teal-300">{summary.moduleCount}</p>
            <p className="text-sm text-slate-500">Enabled modules</p>
          </article>
        )}
        {isWidgetVisible(runtime, "reports") && (
          <article className="cc-glass-card border-rose-500/15">
            <p className="text-sm font-medium text-rose-300">Reports</p>
            <p className="mt-1 text-xs text-slate-500">Persona: {runtime.personaKey}</p>
            <Link href={r.reports} className="mt-2 inline-block text-xs text-rose-400">
              View reports →
            </Link>
          </article>
        )}
      </section>

      {isWidgetVisible(runtime, "modules") && modules.length > 0 && (
        <section className="cc-glass-card">
          <h3 className="text-sm font-medium text-cyan-400">Enabled CEM modules</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {modules.map((m) => (
              <li
                key={m.id}
                className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300"
              >
                {moduleLabel(m.moduleKey)}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
