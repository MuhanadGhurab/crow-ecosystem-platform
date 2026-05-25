import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLighthousePipelineCard } from "@/components/admin/lighthouse-pipeline-card";
import { GrantTenantAccessForm } from "@/components/admin/grant-tenant-access-form";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { TenantPosturePills } from "@/components/admin/tenant-posture-pills";
import { TenantPlanPanel } from "@/components/admin/tenant-plan-panel";
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
import { getTenantLifecycleSnapshot } from "@/lib/services/lighthouse-pipeline.service";
import { listTenantMemberships } from "@/lib/services/membership.service";
import { listSareaProfilesForTenant } from "@/lib/services/sarea.service";
import { getTenantIdentityCounts } from "@/lib/services/tenant-identity.service";
import { getTenantHealthSummary } from "@/lib/services/tenant-health.service";
import { getOrgIntelligenceForRequest } from "@/lib/services/org-intelligence.service";
import { getTenantById, getTenantWorkspaceSummary } from "@/lib/services/tenant.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

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
    sareaProfiles,
    orgIntel,
    capabilitySnapshot,
    capabilityReadiness,
    usageSignals,
    billingAlignment,
  ] = await Promise.all([
    getTenantWorkspaceSummary(tenant.id),
    getTenantHealthSummary(tenant.id),
    getTenantIdentityCounts(tenant.id),
    listTenantMemberships(tenant.id),
    getTenantLifecycleSnapshot(tenant.id),
    getCybercrowDashboardMetrics(tenant.id),
    listSareaProfilesForTenant(tenant.id),
    request?.id ? getOrgIntelligenceForRequest(request.id) : Promise.resolve(null),
    getTenantCapabilitySnapshot(tenant.id),
    checkTenantCapabilityReadiness(tenant.id),
    getTenantUsageSignals(tenant.id),
    getTenantBillingAlignment(tenant.id),
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
    <div className="space-y-8">
      <div>
        <Link href={routes.admin.tenants} className="text-sm text-cyan-400 hover:text-cyan-300">
          ← All tenants
        </Link>
        <h2 className="mt-4 font-display text-xl font-semibold text-white">
          {tenant.organization.displayName}
        </h2>
        <p className="mt-1 font-mono text-sm text-cyan-400">/{tenant.slug}</p>
        <p className="mt-2 text-sm text-slate-500">
          Tenant control room — CEM runtime, CyberCrow trust, SAREA experiences.
        </p>
        <TenantPosturePills
          posture={posture}
          health={health}
          requestStatus={requestStatus}
        />
      </div>

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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-slate-500">Departments</p>
              <p className="text-lg font-semibold text-white">{identity.departments}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Roles</p>
              <p className="text-lg font-semibold text-white">{identity.roles}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Workflows</p>
              <p className="text-lg font-semibold text-white">{summary.workflowCount}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Open tasks</p>
              <p className="text-lg font-semibold text-white">{summary.openTaskCount}</p>
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
        </section>
      )}

      {activeTab === "cybercrow" && (
        <section className="cc-glass-card cc-entity-block--cybercrow space-y-4 !p-6">
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
          </div>
          <Link
            href={routes.tenant(tenant.slug).cybercrow.dashboard}
            className="inline-block text-sm text-violet-300 hover:text-violet-200"
          >
            Full CyberCrow console →
          </Link>
        </section>
      )}

      {activeTab === "sarea" && (
        <section className="cc-glass-card cc-entity-block--sarea space-y-4 !p-6">
          <h3 className="text-sm font-medium text-rose-300">SAREA experience profiles</h3>
          <p className="text-sm text-slate-500">
            Role → RBAC permission → SAREA profile → adaptive dashboard and navigation.
          </p>
          {sareaProfiles.length === 0 ? (
            <p className="text-sm text-slate-500">No SAREA profiles mapped yet.</p>
          ) : (
            <ul className="space-y-3">
              {sareaProfiles.map((p) => (
                <li
                  key={p.id}
                  className="rounded-cc-sm border border-rose-500/15 bg-white/[0.02] px-4 py-3"
                >
                  <p className="font-medium text-white">{p.name}</p>
                  <p className="text-xs text-slate-500">
                    Persona: {p.personaKey} · layouts {p._count.dashboardLayouts} · widgets{" "}
                    {p._count.widgetRules}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <Link href={routes.sarea.profiles} className="text-sm text-rose-300 hover:text-rose-200">
            SAREA studio →
          </Link>
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
