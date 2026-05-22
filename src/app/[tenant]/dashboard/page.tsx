import Link from "next/link";
import { notFound } from "next/navigation";
import { MeemDashboardHints } from "@/components/tenant/meem-dashboard-hints";
import { SareaDashboardWidgets } from "@/components/tenant/sarea-dashboard-widgets";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { getCrowAuth } from "@/lib/auth/roles";
import { planLabel } from "@/lib/catalog-labels";
import { getAiExtraKeys } from "@/lib/discovery-answers";
import { MOCK_CYBERCROW_DASHBOARD } from "@/lib/mock/workspace-summary";
import { MEEM_TENANT_SLUG } from "@/lib/mock/meem-global";
import { routes } from "@/lib/routes";
import { requireTenantAccess } from "@/lib/auth/session";
import { getSareaRuntimeContext } from "@/lib/services/sarea-runtime.service";
import { safeWorkspaceSummary } from "@/lib/services/workspace-summary-safe";
import { getTenantBySlug } from "@/lib/services/tenant.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export default async function TenantDashboardPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await requireTenantAccess(slug);
  const tenant = await getTenantBySlug(slug);

  if (!tenant) {
    notFound();
  }

  const { role } = getCrowAuth(user);
  const runtime = await getSareaRuntimeContext(tenant.id, user.email ?? "", role);
  const summary = await safeWorkspaceSummary(tenant.id);
  const request = tenant.blueprint?.request;
  const mock = MOCK_CYBERCROW_DASHBOARD;
  const r = routes.tenant(slug);
  const isMeem = slug === MEEM_TENANT_SLUG;
  const answers = tenant.blueprint?.request?.discoveryProfile?.answers ?? [];
  const aiExtraKeys = isMeem
    ? getAiExtraKeys(answers).length > 0
      ? getAiExtraKeys(answers)
      : ["route_optimization", "doc_intelligence", "demand_forecast", "anomaly_detection"]
    : [];
  const openTasks = summary.openTaskCount ?? 0;
  const riskScore = summary.cybercrowInitialized ? mock.riskScore : "—";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-cyan-950/30 via-cc-elevated/90 to-teal-950/25 p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl"
          aria-hidden
        />
        <span className="cc-entity-badge cc-entity-badge--cem relative">Tenant operations</span>
        <h2 className="cc-section-title relative mt-4">{tenant.organization.displayName}</h2>
        <p className="relative mt-2 text-sm text-slate-400">
          Plan: <span className="font-medium text-cyan-300">{planLabel(tenant.planKey)}</span>
          {request && (
            <>
              {" "}
              · Request{" "}
              <span className="font-mono text-slate-500">{request.referenceCode}</span>
            </>
          )}
        </p>
        <p className="relative mt-2 text-xs text-rose-300/90">
          SAREA · <span className="font-mono">{runtime.profileName}</span> ({runtime.personaKey})
          {runtime.compact && " · compact"}
        </p>
        {request?.status && (
          <div className="relative mt-3">
            <RequestStatusBadge status={request.status as ImplementationRequestStatus} />
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="CEM users" value={summary.profileCount} entity="cem" accent="cyan" />
        <StatCard label="Departments" value={summary.departmentCount} entity="cem" accent="teal" />
        <StatCard label="Roles" value={summary.roleCount} entity="cem" accent="cyan" />
        <StatCard
          label="Security posture"
          value={riskScore}
          entity="cem"
          accent="teal"
          hint={
            summary.cybercrowInitialized ? "CyberCrow initialized" : "Awaiting CyberCrow init"
          }
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="cc-glass-card lg:col-span-2">
          <h3 className="text-sm font-medium text-cyan-400">Operational load</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Open tasks",
                value: String(openTasks),
                pct: Math.min(100, openTasks * 18 + 12),
              },
              {
                label: "Workflows",
                value: String(summary.workflowCount ?? 0),
                pct: Math.min(100, (summary.workflowCount ?? 0) * 20 + 20),
              },
              { label: "Modules live", value: `${tenant.modules.length}`, pct: 92 },
            ].map((w) => (
              <div key={w.label} className="rounded-cc-sm border border-cyan-500/10 bg-white/[0.03] p-3">
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
        <article className="cc-glass-card border-violet-500/15">
          <h3 className="text-sm font-medium text-violet-300">Risk snapshot</h3>
          <p className="mt-3 font-display text-4xl font-bold text-violet-200">{mock.riskScore}</p>
          <p className="text-xs text-slate-500">CyberCrow posture · {mock.openIncidents} incidents</p>
          <div className="cc-risk-meter mt-4">
            <span
              className="cc-risk-meter-fill cc-risk-meter-fill--mid"
              style={{ width: `${mock.riskScore}%` }}
            />
          </div>
          <Link
            href={r.cybercrow.dashboard}
            className="mt-4 inline-block text-xs text-violet-400 hover:text-violet-300"
          >
            Open CyberCrow →
          </Link>
        </article>
      </section>

      {isMeem && (
        <MeemDashboardHints
          slug={slug}
          aiExtraKeys={aiExtraKeys}
          workflowCount={summary.workflowCount ?? 0}
          openTaskCount={openTasks}
        />
      )}

      <SareaDashboardWidgets
        slug={slug}
        runtime={runtime}
        summary={{
          profileCount: summary.profileCount,
          departmentCount: summary.departmentCount,
          roleCount: summary.roleCount,
          auditLogCount: summary.auditLogCount,
          moduleCount: tenant.modules.length,
          openTaskCount: openTasks,
        }}
        modules={tenant.modules}
      />

      <section className="flex flex-wrap gap-3">
        <Link href={r.users} className="cc-btn-secondary text-sm">
          Users & roles
        </Link>
        <Link href={r.departments} className="cc-btn-secondary text-sm">
          Structure
        </Link>
        {runtime.navKeys.includes("workflows") && (
          <Link href={r.workflows} className="cc-btn-secondary text-sm">
            Workflows
          </Link>
        )}
        <Link href={r.cybercrow.dashboard} className="cc-btn-primary text-sm !from-violet-600 !via-violet-500 !to-indigo-500">
          CyberCrow
        </Link>
        {tenant.blueprint && (
          <Link href={routes.blueprint(tenant.blueprint.id).overview} className="cc-btn-secondary text-sm">
            Blueprint
          </Link>
        )}
      </section>
    </div>
  );
}
