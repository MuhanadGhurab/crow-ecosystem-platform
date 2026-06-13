import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLighthousePipelineCard } from "@/components/admin/lighthouse-pipeline-card";
import { GrantTenantAccessForm } from "@/components/admin/grant-tenant-access-form";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { ProCrowWorkbenchSection } from "@/components/procrow/procrow-workbench-section";
import { TenantCommandCenterHeader } from "@/components/admin/tenant-command-center-header";
import { TenantCommandCenterActionBar } from "@/components/admin/tenant-command-center-action-bar";
import { TenantLifecycleStepper } from "@/components/admin/tenant-lifecycle-stepper";
import { TenantCommandCenterOverview } from "@/components/admin/tenant-command-center-overview";
import { TenantCommandCenterWorkforceFocus } from "@/components/admin/tenant-command-center-workforce-focus";
import { AdminTenantMembershipBreakGlassPanel } from "@/components/admin/admin-tenant-membership-break-glass-panel";
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
import { moduleLabel } from "@/lib/catalog-labels";
import { TENANT_WORKFORCE_ACTIVATION_TITLE } from "@/lib/constants/crow-workforce-activation";
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
import { buildCemRuntimeHandoffSnapshotForTenantId } from "@/lib/services/cem-runtime-handoff.service";
import { buildCemOperatingModelSnapshotForTenantId } from "@/lib/services/cem-operating-model.service";
import { AdminCemRuntimeHandoffPanel } from "@/components/admin/admin-cem-runtime-handoff-panel";
import { AdminCemOperatingModelPanel } from "@/components/admin/admin-cem-operating-model-panel";
import { AdminCemModuleDepthPanel } from "@/components/admin/admin-cem-module-depth-panel";
import { AdminCemTransactionWorkflowPanel } from "@/components/admin/admin-cem-transaction-workflow-panel";
import { buildCemModuleDepthSummaryForTenantId } from "@/lib/services/cem-module-depth.service";
import { buildCemTransactionWorkflowSummaryForTenantId } from "@/lib/services/cem-transaction-workflow.service";
import { AdminCemWorkflowPersistencePanel } from "@/components/admin/admin-cem-workflow-persistence-panel";
import { buildCemWorkflowPersistenceSummaryForTenantId } from "@/lib/services/cem-workflow-persistence.service";
import { AdminTenantMembershipAccessPanel } from "@/components/admin/admin-tenant-membership-access-panel";
import { AdminTenantMembershipInvitePanel } from "@/components/admin/admin-tenant-membership-invite-panel";
import { isBusinessPortalInviteEmailConfigured } from "@/lib/email/send-business-portal-invite-email";
import { buildTenantMembershipAccessSummaryForTenantId } from "@/lib/services/tenant-membership-access.service";
import { listTenantMembershipInvitesForTenant } from "@/lib/services/tenant-invite-token.service";
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
    cemRuntimeHandoff,
    cemOperatingModel,
    cemModuleDepthSummary,
    cemTransactionWorkflowSummary,
    cemWorkflowPersistenceSnapshot,
    tenantMembershipAccessSummary,
    tenantMembershipInvites,
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
    buildCemRuntimeHandoffSnapshotForTenantId(tenant.id),
    buildCemOperatingModelSnapshotForTenantId(tenant.id),
    buildCemModuleDepthSummaryForTenantId(tenant.id),
    buildCemTransactionWorkflowSummaryForTenantId(tenant.id),
    buildCemWorkflowPersistenceSummaryForTenantId(tenant.id),
    buildTenantMembershipAccessSummaryForTenantId(tenant.id),
    listTenantMembershipInvitesForTenant(tenant.id),
  ]);

  if (activeTab === "advanced" && capabilitySnapshot) {
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
    activeTab === "advanced"
      ? await listTenantAdvisoryNotifications(tenant.id, tenant.slug).catch(() => [])
      : [];

  const workforcePendingCount = tenantMembershipInvites.filter((i) => i.status === "pending").length;
  const workforceAcceptedCount = tenantMembershipInvites.filter((i) => i.status === "accepted").length;
  const activeMembershipCount =
    tenantMembershipAccessSummary?.activeMembershipCount ?? health.membershipCount;
  const runtimeReady =
    summary.cybercrowInitialized &&
    cemOps.readinessLabel !== "Not ready" &&
    cemOps.readinessLabel !== "Blocked";

  return (
    <div className="space-y-6">
      <TenantCommandCenterHeader
        displayName={tenant.organization.displayName}
        slug={tenant.slug}
        healthLabel={health.healthLabel}
        runtimeLabel={summary.cybercrowInitialized ? "Prepared" : "Needs setup"}
        portalReadinessLabel={cemOps.readinessLabel}
        membershipCount={activeMembershipCount}
        enabledModuleCount={tenant.modules.length}
        cybercrowInitialized={summary.cybercrowInitialized}
        createdAt={tenant.createdAt}
        updatedAt={tenant.updatedAt}
        requestReference={request?.referenceCode}
      />

      <TenantCommandCenterActionBar
        tenantId={tenant.id}
        tenantSlug={tenant.slug}
        requestHref={request?.id ? routes.admin.request(request.id) : undefined}
      />

      <TenantLifecycleStepper />

      <TenantControlRoomNav tenantId={tenant.id} activeTab={activeTab} />

      {activeTab === "overview" && (
        <div className="space-y-6">
          <TenantCommandCenterOverview
            tenantId={tenant.id}
            tenantSlug={tenant.slug}
            healthLabel={health.healthLabel}
            runtimeReady={runtimeReady}
            workforcePendingCount={workforcePendingCount}
            workforceAcceptedCount={workforceAcceptedCount}
            portalAccessLabel={cemOps.readinessLabel}
            activeMembershipCount={activeMembershipCount}
          />
          {tenantMembershipAccessSummary && (
            <AdminTenantMembershipAccessPanel summary={tenantMembershipAccessSummary} />
          )}
          <p className="text-xs text-slate-600">
            ProCrow prepares tenant runtime; Business Portal (CEM) is where tenant employees operate day
            to day after workforce activation.
          </p>
        </div>
      )}

      {activeTab === "workforce" && (
        <div className="space-y-4" aria-label={TENANT_WORKFORCE_ACTIVATION_TITLE}>
          <TenantCommandCenterWorkforceFocus />
          <AdminTenantMembershipInvitePanel
            tenantId={tenant.id}
            tenantSlug={tenant.slug}
            accessSummary={tenantMembershipAccessSummary}
            inviteHistory={tenantMembershipInvites}
            inviteEmailConfigured={isBusinessPortalInviteEmailConfigured()}
          />
        </div>
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
          <ProCrowWorkbenchSection
            title="Runtime preparation"
            description="CEM handoff, cohesion, and transaction workflow readiness before workforce activation."
          >
            {cemRuntimeHandoff && <AdminCemRuntimeHandoffPanel snapshot={cemRuntimeHandoff} />}
            <AdminRuntimeCohesionSummary tenantSlug={tenant.slug} snapshot={runtimeCohesion} />
            {cemTransactionWorkflowSummary && (
              <AdminCemTransactionWorkflowPanel
                tenantSlug={tenant.slug}
                summary={cemTransactionWorkflowSummary}
              />
            )}
            {cemWorkflowPersistenceSnapshot && (
              <AdminCemWorkflowPersistencePanel snapshot={cemWorkflowPersistenceSnapshot} />
            )}
          </ProCrowWorkbenchSection>
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

      {activeTab === "advanced" && (
        <div className="space-y-6">
          {capabilitySnapshot ? (
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
          )}
          <section className="cc-glass-card space-y-4 !p-6">
            <h3 className="text-sm font-medium text-cyan-400">Organization model</h3>
            {orgIntel ? (
              <>
                <p className="text-sm text-slate-400">
                  Sector: <span className="font-mono text-cyan-300">{orgIntel.record.sectorTemplateKey}</span>{" "}
                  · Status: {orgIntel.record.status}
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
          </section>
          <AdminTenantMembershipBreakGlassPanel
            tenantId={tenant.id}
            tenantSlug={tenant.slug}
            memberships={memberships}
          />
          <section className="cc-glass-card space-y-4">
            <h3 className="text-sm font-medium text-violet-300">Grant tenant access (direct)</h3>
            <p className="text-xs text-slate-500">
              Immediate membership grant for operator recovery. Normal workforce activation should use
              Business Portal Invite on the Workforce Activation tab.
            </p>
            <GrantTenantAccessForm tenantId={tenant.id} tenantSlug={tenant.slug} />
          </section>
        </div>
      )}

      {activeTab === "cem" && (
        <section className="cc-glass-card cc-entity-block--cem space-y-4 !p-6">
          <h3 className="text-sm font-medium text-cyan-400">CEM runtime · modules & operations</h3>
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
          {cemOperatingModel && <AdminCemOperatingModelPanel snapshot={cemOperatingModel} />}
          {cemModuleDepthSummary.length > 0 && (
            <AdminCemModuleDepthPanel items={cemModuleDepthSummary} />
          )}
          <div className="flex flex-wrap gap-3 border-t border-cyan-500/10 pt-4 text-sm">
            <Link
              href={routes.tenant(tenant.slug).dashboard}
              className="text-cyan-400 hover:text-cyan-300"
            >
              Open Business Portal (CEM runtime) →
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

      {activeTab === "cybercrow-sarea" && (
        <div className="space-y-6">
          <ProCrowWorkbenchSection
            title="CyberCrow trust readiness"
            description="Review trust, identity, evidence, GRC, and risk readiness for this tenant."
          >
            {cybercrowTrust && <AdminCybercrowTrustReadinessPanel snapshot={cybercrowTrust} />}
          </ProCrowWorkbenchSection>
        <section className="cc-glass-card cc-entity-block--cybercrow space-y-4 !p-6">
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
        <ProCrowWorkbenchSection
          title="SAREA experience mapping"
          description="Shape role-based experience — RBAC controls access."
        >
          {sareaExperienceMapping && (
            <AdminSareaExperienceMappingPanel snapshot={sareaExperienceMapping} />
          )}
        </ProCrowWorkbenchSection>
        <section className="cc-glass-card cc-entity-block--sarea space-y-5 !p-6">
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
        </div>
      )}

      {activeTab === "evidence" && (
        <section className="cc-glass-card space-y-4">
          <h3 className="text-sm font-medium text-violet-300">Evidence & logs</h3>
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
          {memberships.length > 0 && (
            <div className="border-t border-cyan-500/10 pt-4">
              <h4 className="text-sm font-medium text-slate-400">Active memberships (reference)</h4>
              <ul className="mt-3 space-y-2 text-xs text-slate-500">
                {memberships.map((m) => (
                  <li key={m.id} className="font-mono">
                    {m.supabaseUserId.slice(0, 8)}… · {m.role}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-slate-600">
                To grant access, use Workforce Activation (invite) or Advanced (break-glass).
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
