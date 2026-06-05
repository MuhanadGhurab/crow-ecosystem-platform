import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLighthousePipelineCard } from "@/components/admin/lighthouse-pipeline-card";
import { GrantTenantAccessForm } from "@/components/admin/grant-tenant-access-form";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { ProCrowTenantWorkbenchHeader } from "@/components/procrow/procrow-tenant-workbench-header";
import { ProCrowWorkbenchSection } from "@/components/procrow/procrow-workbench-section";
import { ProCrowContextLinkGrid } from "@/components/procrow/procrow-context-link-grid";
import { TenantPosturePills } from "@/components/admin/tenant-posture-pills";
import { TenantPlanPanel } from "@/components/admin/tenant-plan-panel";
import { AdminRuntimeCohesionSummary } from "@/components/admin/admin-runtime-cohesion-summary";
import { TenantAdvisoryNotifications } from "@/components/admin/tenant-advisory-notifications";
import { listTenantAdvisoryNotifications } from "@/lib/services/platform-notification.service";
import {
  parseTenantControlRoomTab,
  TenantControlRoomNav,
} from "@/components/admin/tenant-control-room-nav";
import { checkTenantCapabilityReadiness } from "@/lib/services/capability-readiness.service";
import { getTenantBillingAlignment } from "@/lib/services/subscription-billing-alignment.service";
import { evaluateTenantSubscriptionAdvisories } from "@/lib/services/subscription-notification.service";
import { getTenantCapabilitySnapshot } from "@/lib/services/subscription-capability.service";
import { getTenantUsageSignals } from "@/lib/services/usage-signals.service";
import { moduleLabel, planLabel } from "@/lib/catalog-labels";
import { routes } from "@/lib/routes";
import { getCybercrowDashboardMetrics } from "@/lib/services/cybercrow-dashboard.service";
import { getSocWorkflowSummary } from "@/lib/services/cybercrow-soc-workflow.service";
import { getTenantLifecycleSnapshot } from "@/lib/services/lighthouse-pipeline.service";
import { listTenantMemberships } from "@/lib/services/membership.service";
import { listSareaProfilesForTenant } from "@/lib/services/sarea.service";
import { getTenantPersonaMaterialization } from "@/lib/services/sarea-materialization.service";
import { SareaPersonaMaterializationPanel } from "@/components/studio/sarea/sarea-persona-materialization-panel";
import { SareaTenantHealthPanel } from "@/components/studio/sarea/sarea-tenant-health-panel";
import { getTenantSareaHealthDetail } from "@/lib/services/sarea-studio.service";
import { getTenantIdentityCounts } from "@/lib/services/tenant-identity.service";
import { getTenantHealthSummary } from "@/lib/services/tenant-health.service";
import { getOrgIntelligenceForRequest } from "@/lib/services/org-intelligence.service";
import { getCemOperationsSnapshot } from "@/lib/services/cem-operations-intelligence.service";
import { getRuntimeCohesionSnapshot } from "@/lib/services/runtime-cohesion.service";
import { getTenantById, getTenantWorkspaceSummary } from "@/lib/services/tenant.service";
import { buildCyberCrowTenantTrustSnapshotForTenantId } from "@/lib/services/cybercrow-tenant-trust.service";
import { buildSareaExperienceMappingSnapshotForTenantId } from "@/lib/services/sarea-experience-mapping.service";
import { AdminCybercrowTrustReadinessPanel } from "@/components/admin/admin-cybercrow-trust-readiness-panel";
import { AdminSareaExperienceMappingPanel } from "@/components/admin/admin-sarea-experience-mapping-panel";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export const dynamic = "force-dynamic";

export default async function AdminTenantDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ tenantId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tenantId } = await params;
  const { tab: tabParam } = await searchParams;
  const activeTab = parseTenantControlRoomTab(tabParam);

  const tenant = await getTenantById(tenantId);
  if (!tenant) notFound();

  const request = tenant.blueprint?.request;

  const [
    summary,
    health,
    identity,
    memberships,
    lifecycle,
    cybercrow,
    socSummary,
    sareaProfiles,
    sareaPersonaMaterialization,
    sareaHealthDetail,
    orgIntel,
    capabilitySnapshot,
    capabilityReadiness,
    usageSignals,
    billingAlignment,
    cemOps,
    runtimeCohesion,
    cybercrowTrust,
    sareaExperienceMapping,
  ] = await Promise.all([
    getTenantWorkspaceSummary(tenant.id),
    getTenantHealthSummary(tenant.id),
    getTenantIdentityCounts(tenant.id),
    listTenantMemberships(tenant.id),
    getTenantLifecycleSnapshot(tenant.id),
    getCybercrowDashboardMetrics(tenant.id),
    getSocWorkflowSummary(tenant.id),
    listSareaProfilesForTenant(tenant.id),
    getTenantPersonaMaterialization(tenant.id),
    getTenantSareaHealthDetail(tenant.id),
    request?.id ? getOrgIntelligenceForRequest(request.id) : Promise.resolve(null),
    getTenantCapabilitySnapshot(tenant.id),
    checkTenantCapabilityReadiness(tenant.id),
    getTenantUsageSignals(tenant.id),
    getTenantBillingAlignment(tenant.id),
    getCemOperationsSnapshot(tenant.id),
    getRuntimeCohesionSnapshot(
      tenant.id,
      tenant.modules.filter((m) => m.enabled !== false).map((m) => m.moduleKey),
      tenant.organization.industry,
      tenant.slug
    ),
    buildCyberCrowTenantTrustSnapshotForTenantId(tenant.id),
    buildSareaExperienceMappingSnapshotForTenantId(tenant.id),
  ]);

  if (activeTab === "plan" && capabilitySnapshot) {
    await evaluateTenantSubscriptionAdvisories({
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      displayName: tenant.organization.displayName,
      usageSignals,
      readiness: capabilityReadiness,
    }).catch(() => undefined);
  }

  const planCheckedAt = new Date();
  const advisoryNotifications =
    activeTab === "plan"
      ? await listTenantAdvisoryNotifications(tenant.id, tenant.slug).catch(() => [])
      : [];
  const requestStatus = request?.status as ImplementationRequestStatus | undefined;
  const posture = {
    cybercrowInitialized: summary.cybercrowInitialized,
    enabledModuleCount: tenant.modules.length,
    sareaProfileCount: summary.sareaProfileCount,
  };

  return (
    <div className="space-y-6">
      <ProCrowTenantWorkbenchHeader
        displayName={tenant.organization.displayName}
        slug={tenant.slug}
        healthLabel={health.healthLabel}
        enabledModuleCount={tenant.modules.length}
        cybercrowInitialized={summary.cybercrowInitialized}
        sareaProfileCount={summary.sareaProfileCount}
        requestHref={request?.id ? routes.admin.request(request.id) : undefined}
      />

      <TenantPosturePills posture={posture} health={health} requestStatus={requestStatus} />

      <ProCrowContextLinkGrid
        links={[
          { label: "Go / No-Go", href: routes.admin.goNoGo },
          { label: "Operator queue", href: routes.admin.queue },
          {
            label: "CEM dashboard",
            href: routes.tenant(tenant.slug).dashboard,
            description: "Runtime operations",
          },
          {
            label: "CyberCrow",
            href: routes.tenant(tenant.slug).cybercrow.dashboard,
            description: "Trust cockpit",
          },
        ]}
      />

      <TenantControlRoomNav tenantId={tenant.id} activeTab={activeTab} />

      {activeTab === "plan" &&
        (capabilitySnapshot ? (
          <>
            <TenantAdvisoryNotifications rows={advisoryNotifications} />
            <TenantPlanPanel
              snapshot={capabilitySnapshot}
              readiness={capabilityReadiness}
              usageSignals={usageSignals}
              billing={billingAlignment}
              checkedAt={planCheckedAt}
            />
          </>
        ) : (
          <p className="cc-glass-card text-sm text-slate-500">
            Could not load subscription capability snapshot for this tenant.
          </p>
        ))}

      {activeTab === "overview" && (
        <div className="space-y-6">
          {cybercrowTrust && <AdminCybercrowTrustReadinessPanel snapshot={cybercrowTrust} />}
          {sareaExperienceMapping && (
            <AdminSareaExperienceMappingPanel snapshot={sareaExperienceMapping} />
          )}
          <AdminRuntimeCohesionSummary tenantSlug={tenant.slug} snapshot={runtimeCohesion} />
          <section className="cc-glass-card space-y-4">
            <h3 className="text-sm font-medium text-cyan-400">Operational health</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-slate-500">Status</p>
                <p className="text-sm font-medium text-white">{health.healthLabel}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Open incidents</p>
                <p className="text-sm font-medium text-white">{health.openIncidentCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Auth memberships</p>
                <p className="text-sm font-medium text-cyan-300">{health.membershipCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Plan</p>
                <p className="text-sm font-medium text-white">{planLabel(tenant.planKey)}</p>
              </div>
            </div>
          </section>
          {lifecycle && <AdminLighthousePipelineCard pipeline={lifecycle} />}
          <div className="flex flex-wrap gap-3">
            <Link href={routes.tenant(tenant.slug).dashboard} className="cc-btn-primary text-sm">
              Open CEM runtime →
            </Link>
            <Link
              href={routes.tenant(tenant.slug).cybercrow.dashboard}
              className="cc-btn-secondary text-sm"
            >
              CyberCrow console
            </Link>
          </div>
        </div>
      )}

      {activeTab === "organization" && (
        <section className="cc-glass-card space-y-4 !p-6">
          <h3 className="text-sm font-medium text-cyan-400">Organization model</h3>
          {orgIntel ? (
            <>
              <p className="text-sm text-slate-400">
                Sector: <span className="font-mono text-cyan-300">{orgIntel.record.sectorTemplateKey}</span> ·{" "}
                Status: {orgIntel.record.status}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-cc-sm border border-white/10 px-3 py-2">
                  <p className="text-xs text-slate-500">Departments</p>
                  <p className="text-lg font-semibold text-white">{orgIntel.model.departments.length}</p>
                </div>
                <div className="rounded-cc-sm border border-white/10 px-3 py-2">
                  <p className="text-xs text-slate-500">Positions</p>
                  <p className="text-lg font-semibold text-white">{orgIntel.model.positions.length}</p>
                </div>
                <div className="rounded-cc-sm border border-white/10 px-3 py-2">
                  <p className="text-xs text-slate-500">SAREA profiles</p>
                  <p className="text-lg font-semibold text-white">{orgIntel.model.sareaProfiles.length}</p>
                </div>
              </div>
              {request && (
                <Link
                  href={routes.discovery(request.id).organizationModel}
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  View discovery organization model →
                </Link>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-500">
              No organizational intelligence record — run discovery organization model for this tenant&apos;s
              request.
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-3 border-t border-cyan-500/10 pt-4">
            <div>
              <p className="text-xs text-slate-500">Live CEM departments</p>
              <p className="text-lg font-semibold text-white">{identity.departments}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Live CEM roles</p>
              <p className="text-lg font-semibold text-white">{identity.roles}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Live workflows</p>
              <p className="text-lg font-semibold text-white">{summary.workflowCount}</p>
            </div>
          </div>
        </section>
      )}

      {activeTab === "cem" && (
        <section className="cc-glass-card cc-entity-block--cem space-y-4 !p-6">
          <h3 className="text-sm font-medium text-cyan-400">CEM modules & operations</h3>
          <p className="text-xs text-slate-500">
            Operational readiness: {cemOps.readinessLabel} — {cemOps.readinessDetail}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-slate-500">Departments</p>
              <p className="text-lg font-semibold text-white">{identity.departments}</p>
              <p className="text-xs text-slate-600">
                {cemOps.departmentsWithProfiles} with profiles
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Roles</p>
              <p className="text-lg font-semibold text-white">{identity.roles}</p>
              <p className="text-xs text-slate-600">
                {cemOps.rolesWithAssignments} with assignments
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Workflows</p>
              <p className="text-lg font-semibold text-white">{summary.workflowCount}</p>
              <p className="text-xs text-slate-600">
                {cemOps.workflowsWithoutTasks} without tasks
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Open tasks</p>
              <p className="text-lg font-semibold text-white">{summary.openTaskCount}</p>
              <p className="text-xs text-slate-600">
                {cemOps.unassignedTaskCount} unassigned
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Enabled modules
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {tenant.modules.map((m) => (
                <li
                  key={m.id}
                  className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300"
                >
                  {moduleLabel(m.moduleKey)}
                </li>
              ))}
            </ul>
          </div>
          {cemOps.recommendedActions.length > 0 && (
            <div className="border-t border-cyan-500/10 pt-4">
              <p className="text-xs font-medium text-slate-500">Recommended next actions</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-400">
                {cemOps.recommendedActions.map((a) => (
                  <li key={a.label}>
                    {a.label}
                    {a.hint ? ` — ${a.hint}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap gap-3 border-t border-cyan-500/10 pt-4 text-sm">
            <Link
              href={routes.tenant(tenant.slug).dashboard}
              className="text-cyan-400 hover:text-cyan-300"
            >
              Open CEM runtime →
            </Link>
            <Link
              href={routes.tenant(tenant.slug).workflows}
              className="text-cyan-400 hover:text-cyan-300"
            >
              Workflows →
            </Link>
            <Link
              href={routes.tenant(tenant.slug).cybercrow.dashboard}
              className="text-violet-400 hover:text-violet-300"
            >
              CyberCrow →
            </Link>
            <Link href={routes.sarea.profiles} className="text-rose-400 hover:text-rose-300">
              SAREA profiles →
            </Link>
          </div>
        </section>
      )}

      {activeTab === "cybercrow" && (
        <section className="cc-glass-card cc-entity-block--cybercrow space-y-4 !p-6">
          {cybercrowTrust && <AdminCybercrowTrustReadinessPanel snapshot={cybercrowTrust} />}
          <p className="text-xs text-slate-500">
            CyberCrow protects this tenant. SAREA adapts presentation on the workspace dashboard —
            RBAC still governs access.
          </p>
          <h3 className="text-sm font-medium text-violet-300">CyberCrow trust posture</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-slate-500">Baseline</p>
              <p className="text-sm font-medium text-white">
                {summary.cybercrowInitialized ? "Initialized ✓" : "Not initialized"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Risk score</p>
              <p className="text-lg font-semibold text-violet-200">{cybercrow.riskScore}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Compliance</p>
              <p className="text-lg font-semibold text-teal-200">{cybercrow.compliancePct}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Open incidents</p>
              <p className="text-lg font-semibold text-amber-200">
                {cybercrow.openIncidentCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Events needing review</p>
              <p className="text-lg font-semibold text-indigo-200">
                {socSummary.pendingReviewEvents}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            SOC chain: security events → incidents → evidence → risk → GRC. Rule-based posture only
            — not a substitute for enterprise SOC tooling.
          </p>
          <Link
            href={routes.tenant(tenant.slug).cybercrow.dashboard}
            className="inline-block text-sm text-violet-300 hover:text-violet-200"
          >
            Full CyberCrow console →
          </Link>
        </section>
      )}

      {activeTab === "sarea" && (
        <section className="cc-glass-card cc-entity-block--sarea space-y-5 !p-6">
          {sareaExperienceMapping && (
            <AdminSareaExperienceMappingPanel snapshot={sareaExperienceMapping} />
          )}
          <div className="rounded-lg border border-rose-500/15 bg-rose-950/15 px-4 py-3 text-xs text-slate-400">
            <p className="font-medium text-rose-200">RBAC controls access. SAREA controls experience.</p>
            <p className="mt-1">
              How healthy is this tenant&apos;s adaptive UI? Five personas should be tenant-backed
              with layouts, navigation, and widgets. Partial or fallback states need studio review.
            </p>
          </div>
          <h3 className="text-sm font-medium text-rose-300">SAREA health (advisory)</h3>
          <SareaTenantHealthPanel health={sareaHealthDetail} tenantSlug={tenant.slug} />
          <h3 className="text-sm font-medium text-rose-300">Persona materialization</h3>
          <SareaPersonaMaterializationPanel
            rows={sareaPersonaMaterialization}
            tenantSlug={tenant.slug}
            compact
          />
          {sareaPersonaMaterialization.some((r) => r.state !== "tenant_backed") ? (
            <p className="text-xs text-amber-200/90">
              Next: open SAREA studio role mapping, assign recommended RBAC slugs, run{" "}
              <span className="font-mono text-slate-400">npm run sarea:meem-upgrade</span> or tenant
              backfill when applicable.
            </p>
          ) : (
            <p className="text-xs text-teal-300/90">All five personas are tenant-backed for this tenant.</p>
          )}
          <h3 className="text-sm font-medium text-rose-300">Profiles & mappings</h3>
          {sareaProfiles.length === 0 ? (
            <p className="text-sm text-slate-500">
              No SAREA profiles yet — run tenant provisioning or sarea:backfill-seed.
            </p>
          ) : (
            <ul className="space-y-3">
              {sareaProfiles.map((p) => (
                <li
                  key={p.id}
                  className="rounded-cc-sm border border-rose-500/15 bg-white/[0.02] px-4 py-3"
                >
                  <p className="font-medium text-white">{p.name}</p>
                  <p className="text-xs text-slate-500">
                    {p.personaKey} · {p._count.roleExperienceMaps} role maps ·{" "}
                    {p._count.dashboardLayouts} layouts · {p._count.widgetRules} widgets ·{" "}
                    {p._count.navigationProfiles} nav · {p._count.deviceRules} device
                  </p>
                  <Link
                    href={`/api/sarea/preview?persona=${p.personaKey}&redirect=${routes.tenant(tenant.slug).dashboard}`}
                    className="mt-2 inline-block text-xs text-cyan-300"
                  >
                    Preview {p.personaKey} →
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-3">
            <Link href={routes.sarea.profiles} className="text-sm text-rose-300 hover:text-rose-200">
              SAREA studio →
            </Link>
            <Link href={routes.sarea.roleMapping} className="text-sm text-slate-400 hover:text-slate-300">
              Role mapping →
            </Link>
            <Link href={routes.sarea.preview} className="text-sm text-slate-400 hover:text-slate-300">
              Preview →
            </Link>
          </div>
        </section>
      )}

      {activeTab === "readiness" && (
        <div className="space-y-6">
          {lifecycle ? (
            <AdminLighthousePipelineCard pipeline={lifecycle} />
          ) : (
            <p className="cc-glass-card text-sm text-slate-500">
              No blueprint request linked — provision from an approved blueprint.
            </p>
          )}
          {request && (
            <section className="cc-glass-card space-y-3">
              <h3 className="text-sm font-medium text-cyan-400">Implementation request</h3>
              <p className="font-mono text-xs text-slate-500">{request.referenceCode}</p>
              <RequestStatusBadge status={request.status as ImplementationRequestStatus} />
              <Link
                href={routes.admin.request(request.id)}
                className="inline-block text-sm text-cyan-400 hover:text-cyan-300"
              >
                View request →
              </Link>
            </section>
          )}
        </div>
      )}

      {activeTab === "audit" && (
        <section className="cc-glass-card space-y-4">
          <h3 className="text-sm font-medium text-violet-300">Audit & access</h3>
          <p className="text-sm text-slate-500">
            {summary.auditLogCount} CyberCrow audit rows · {health.securityEventCount} security
            events
          </p>
          <Link
            href={`${routes.admin.audit}?tenant=${tenant.slug}`}
            className="text-sm text-violet-300 hover:text-violet-200"
          >
            Platform audit feed →
          </Link>
          <div className="border-t border-cyan-500/10 pt-4">
            <h4 className="text-sm font-medium text-cyan-400">Grant tenant access</h4>
            <div className="mt-4">
              <GrantTenantAccessForm tenantId={tenant.id} tenantSlug={tenant.slug} />
            </div>
            {memberships.length > 0 && (
              <ul className="mt-4 space-y-2 text-xs text-slate-500">
                {memberships.map((m) => (
                  <li key={m.id} className="font-mono">
                    {m.supabaseUserId.slice(0, 8)}… · {m.role}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
