import Link from "next/link";
import { notFound } from "next/navigation";
import { MeemDashboardHints } from "@/components/tenant/meem-dashboard-hints";
import { SareaDashboardWidgets } from "@/components/tenant/sarea-dashboard-widgets";
import { CybercrowConnectionPanel } from "@/components/tenant/cybercrow/cybercrow-connection-panel";
import { TenantCemOperationsPanel } from "@/components/tenant/tenant-cem-operations-panel";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantRuntimeNextActions } from "@/components/tenant/tenant-runtime-next-actions";
import { TwinEngineStrip } from "@/components/tenant/twin-engine-strip";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import { planLabel } from "@/lib/catalog-labels";
import { getAiExtraKeys } from "@/lib/discovery-answers";
import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { SAREA_PREVIEW_PERSONA_KEYS } from "@/lib/constants/sarea-personas";
import { resolveMeemLiveIds } from "@/lib/server/meem-live";
import { routes } from "@/lib/routes";
import { requireTenantAccess } from "@/lib/auth/session";
import { getCybercrowDashboardMetrics } from "@/lib/services/cybercrow-dashboard.service";
import {
  getSareaRuntimeContext,
  isWidgetVisible,
} from "@/lib/services/sarea-runtime.service";
import { getCemOperationsSnapshot } from "@/lib/services/cem-operations-intelligence.service";
import { safeWorkspaceSummary } from "@/lib/services/workspace-summary-safe";
import { getTenantBySlug } from "@/lib/services/tenant.service";
import { readSareaPreviewPersona } from "@/lib/sarea/preview-cookie";
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
  const previewPersona =
    role && isPlatformStaff(role) ? await readSareaPreviewPersona() : null;
  const runtime = await getSareaRuntimeContext(
    tenant.id,
    user.email ?? "",
    role,
    previewPersona
  );
  const [summary, cemOps] = await Promise.all([
    safeWorkspaceSummary(tenant.id),
    getCemOperationsSnapshot(tenant.id),
  ]);
  const cybercrowMetrics = summary.cybercrowInitialized
    ? await getCybercrowDashboardMetrics(tenant.id).catch(() => null)
    : null;

  const request = tenant.blueprint?.request;
  const r = routes.tenant(slug);
  const isMeem = slug === MEEM_TENANT_SLUG;
  const meemIds = isMeem ? await resolveMeemLiveIds() : null;
  const answers = tenant.blueprint?.request?.discoveryProfile?.answers ?? [];
  const aiExtraKeys = isMeem
    ? getAiExtraKeys(answers).length > 0
      ? getAiExtraKeys(answers)
      : ["route_optimization", "doc_intelligence", "demand_forecast", "anomaly_detection"]
    : [];
  const openTasks = summary.openTaskCount ?? 0;

  return (
    <div className="space-y-8">
      {previewPersona && (
        <p className="rounded-cc border border-rose-500/20 bg-rose-950/20 px-4 py-2 text-xs text-rose-200">
          SAREA preview · <span className="font-mono">{previewPersona}</span> ·{" "}
          {runtime.profileName}
          {runtime.previewRecommended ? " (recommended fallback — not tenant-backed)" : " (tenant-backed)"}{" "}
          · platform staff only. RBAC unchanged.{" "}
          {isMeem && (
            <>
              {SAREA_PREVIEW_PERSONA_KEYS.filter((p) => p !== previewPersona).map((persona) => (
                <Link
                  key={persona}
                  href={`/api/sarea/preview?persona=${persona}&redirect=/${slug}/dashboard`}
                  className="ml-2 text-rose-300 underline"
                >
                  {persona.replace("_", " ")}
                </Link>
              ))}{" "}
            </>
          )}
          <Link
            href={`/api/sarea/preview?redirect=/${slug}/dashboard`}
            className="text-rose-300 underline"
          >
            Clear preview
          </Link>
        </p>
      )}

      {isMeem && isPlatformStaff(role) && !previewPersona && (
        <p className="rounded-cc border border-rose-500/15 bg-rose-950/10 px-4 py-2 text-xs text-slate-400">
          SAREA acceptance:{" "}
          <Link href={routes.sarea.preview} className="text-rose-300 underline">
            Open preview hub
          </Link>
          {" · "}
          {meemIds?.requestId && (
            <Link
              href={routes.discovery(meemIds.requestId).experience}
              className="text-rose-300 underline"
            >
              Discovery experience
            </Link>
          )}
        </p>
      )}

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
          {summary.cybercrowInitialized && " · CyberCrow live"}
        </p>
        {request?.status && (
          <div className="relative mt-3">
            <RequestStatusBadge status={request.status as ImplementationRequestStatus} />
          </div>
        )}
      </section>

      {isMeem && !isWidgetVisible(runtime, "fleet_kpis") && (
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
        isMeem={isMeem}
        aiExtraKeys={aiExtraKeys}
        cybercrow={{
          initialized: summary.cybercrowInitialized,
          initializedAt: summary.cybercrowInitializedAt ?? null,
          metrics: cybercrowMetrics,
        }}
        summary={{
          profileCount: summary.profileCount,
          departmentCount: summary.departmentCount,
          roleCount: summary.roleCount,
          auditLogCount: summary.auditLogCount,
          moduleCount: tenant.modules.length,
          openTaskCount: openTasks,
          workflowCount: summary.workflowCount ?? 0,
        }}
        modules={tenant.modules}
      />

      <CybercrowConnectionPanel tenantSlug={slug} variant="tenant" />

      <TenantCemOperationsPanel slug={slug} snapshot={cemOps} />

      <TenantRuntimeNextActions
        slug={slug}
        planKey={tenant.planKey}
        summary={{
          openTaskCount: openTasks,
          workflowCount: summary.workflowCount ?? 0,
          profileCount: summary.profileCount,
          departmentCount: summary.departmentCount,
          moduleCount: tenant.modules.length,
          cybercrowInitialized: summary.cybercrowInitialized,
        }}
        sareaProfileName={runtime.profileName}
      />

      {isMeem && <TwinEngineStrip tenantSlug={slug} variant="sarea" />}

      <TenantRuntimeCrossLinks
        slug={slug}
        current="dashboard"
        cybercrowLive={summary.cybercrowInitialized}
      />

      <section className="flex flex-wrap gap-3">
        {isWidgetVisible(runtime, "structure") && (
          <>
            <Link href={r.users} className="cc-btn-secondary text-sm">
              Users & roles
            </Link>
            <Link href={r.departments} className="cc-btn-secondary text-sm">
              Structure
            </Link>
          </>
        )}
        {runtime.navKeys.includes("workflows") && (
          <Link href={r.workflows} className="cc-btn-secondary text-sm">
            Workflows
          </Link>
        )}
        {isWidgetVisible(runtime, "cybercrow_posture") && (
          <Link
            href={r.cybercrow.dashboard}
            className="cc-btn-primary text-sm !from-violet-600 !via-violet-500 !to-indigo-500"
          >
            CyberCrow
          </Link>
        )}
        {tenant.blueprint && (
          <Link href={routes.blueprint(tenant.blueprint.id).overview} className="cc-btn-secondary text-sm">
            Blueprint
          </Link>
        )}
      </section>
    </div>
  );
}
