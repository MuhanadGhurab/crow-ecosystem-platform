import Link from "next/link";
import { notFound } from "next/navigation";
import { TenantRuntimeCohesionNote } from "@/components/tenant/tenant-runtime-cohesion-note";
import { TenantRuntimePageHeader } from "@/components/tenant/tenant-runtime-page-header";
import { EmptyState } from "@/components/ui/empty-state";
import {
  TenantModulesAdvisoryNote,
  TenantModulesOperationalGrid,
} from "@/components/tenant/tenant-modules-operational-grid";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantRuntimeStatStrip } from "@/components/tenant/tenant-runtime-stat-strip";
import { TenantModulesRuntimeCohesionSection } from "@/components/tenant/tenant-modules-runtime-cohesion-section";
import { routes } from "@/lib/routes";
import { getRuntimeCohesionSnapshot } from "@/lib/services/runtime-cohesion.service";
import { safeWorkspaceSummary } from "@/lib/services/workspace-summary-safe";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function TenantModulesPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);

  if (!tenant) {
    notFound();
  }

  const summary = await safeWorkspaceSummary(tenant.id);
  const moduleKeys = tenant.modules.filter((m) => m.enabled !== false).map((m) => m.moduleKey);
  const cohesion = await getRuntimeCohesionSnapshot(
    tenant.id,
    moduleKeys,
    tenant.organization.industry,
    slug
  );
  const r = routes.tenant(slug);

  return (
    <div className="space-y-8">
      <TenantRuntimePageHeader
        beat="modules"
        badge="CEM · Modules"
        entity="cem"
        title="Organization modules"
        description={`Enabled blueprint modules for ${tenant.organization.displayName}. ProCrow prepared the runtime; CEM operates these areas — depth varies by module.`}
      />
      <TenantRuntimeCohesionNote />

      <TenantRuntimeStatStrip
        items={[
          { label: "Enabled", value: moduleKeys.length, accent: "teal" },
          {
            label: "Workflows",
            value: summary.workflowCount ?? 0,
            hint: "Tenant-wide definitions",
          },
          {
            label: "Open tasks",
            value: summary.openTaskCount ?? 0,
            accent: "amber",
          },
          {
            label: "CyberCrow",
            value: summary.cybercrowInitialized ? "Live" : "Pending",
            accent: "violet",
            hint: summary.cybercrowInitialized ? "Posture metrics" : "Run initialize",
          },
        ]}
      />

      <TenantModulesAdvisoryNote slug={slug} moduleKeys={tenant.modules.map((m) => m.moduleKey)} />

      <TenantModulesRuntimeCohesionSection
        slug={slug}
        snapshot={cohesion}
        enabledModuleKeys={moduleKeys}
      />

      {tenant.modules.length === 0 ? (
        <EmptyState
          title="No modules enabled"
          description="Enable modules on the blueprint or contact your platform administrator. SAREA navigation adapts once modules are assigned."
          action={
            <Link href={r.dashboard} className="cc-btn-primary text-sm">
              Back to dashboard
            </Link>
          }
        />
      ) : (
        <TenantModulesOperationalGrid
          slug={slug}
          modules={tenant.modules}
          workflowCount={summary.workflowCount ?? 0}
          openTaskCount={summary.openTaskCount ?? 0}
        />
      )}

      <section className="cc-glass-card border-rose-500/15">
        <h3 className="text-sm font-medium text-rose-300">SAREA & experience</h3>
        <p className="mt-2 text-sm text-slate-400">
          Module visibility also drives SAREA widgets and navigation density on the tenant dashboard.
          Tune mappings in the studio — persona preview does not change RBAC.
        </p>
        <Link
          href={routes.sarea.roleMapping}
          className="mt-3 inline-block text-sm text-rose-400 hover:text-rose-300"
        >
          SAREA role mapping →
        </Link>
      </section>

      <TenantRuntimeCrossLinks
        slug={slug}
        current="modules"
        cybercrowLive={summary.cybercrowInitialized}
      />
    </div>
  );
}
