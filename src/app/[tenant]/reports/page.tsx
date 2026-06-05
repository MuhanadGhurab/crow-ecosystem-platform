import Link from "next/link";
import { notFound } from "next/navigation";
import { ErpChainLinks } from "@/components/tenant/erp-chain-links";
import { ErpModuleHub } from "@/components/tenant/erp-module-hub";
import { MeemReportsHub } from "@/components/tenant/meem-reports-hub";
import { ReportsBiOperationsReadinessPanel } from "@/components/tenant/reports/reports-bi-operations-readiness-panel";
import { getReportsBiReadinessSnapshot } from "@/lib/services/reports-bi-readiness.service";
import { TenantRuntimeDemoHint } from "@/components/tenant/tenant-runtime-demo-hint";
import { TenantCemOperationalReadinessNote } from "@/components/tenant/tenant-cem-operational-readiness-note";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantModulePage } from "@/components/tenant/tenant-module-page";
import { StatCard } from "@/components/ui/stat-card";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { resolveMeemHubAiKeys, showMeemErpHub } from "@/lib/meem/meem-hub-utils";
import { routes } from "@/lib/routes";
import { getCemOperationsSnapshot } from "@/lib/services/cem-operations-intelligence.service";
import { getReportsKpiSummary } from "@/lib/services/reports.service";
import { safeWorkspaceSummary } from "@/lib/services/workspace-summary-safe";
import { getTenantBySlug } from "@/lib/services/tenant.service";
import {
  buildCemOperatingModelSnapshotForTenantSlug,
  selectModuleOperatingContext,
} from "@/lib/services/cem-operating-model.service";
import { TenantModuleOperatingContext } from "@/components/tenant/tenant-module-operating-context";
import { TenantOperatingModelCrossLink } from "@/components/tenant/tenant-operating-model-cross-link";
import { TenantCemModuleDepthSection } from "@/components/tenant/tenant-cem-module-depth-section";
import { buildCemModuleDepthSnapshotForTenantSlug } from "@/lib/services/cem-module-depth.service";

function formatSar(amount: number) {
  return new Intl.NumberFormat("en-SA", { maximumFractionDigits: 0 }).format(amount);
}

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const tenantModules = tenant.modules ?? [];
  const moduleKeys = tenantModules.filter((m) => m.enabled !== false).map((m) => m.moduleKey);
  const showMeemHub = showMeemErpHub(
    slug,
    tenant.organization.industry,
    tenantModules,
    "reports"
  );
  const hasReportsModule = hasErpModule(tenantModules, "bi");
  const answers = tenant.blueprint?.request?.discoveryProfile?.answers ?? [];
  const aiExtraKeys = showMeemHub ? resolveMeemHubAiKeys(answers, "reports") : [];

  const [kpis, summary, cemOps, biSnapshot, operatingModel, moduleDepth] = await Promise.all([
    getReportsKpiSummary(tenant.id, moduleKeys),
    safeWorkspaceSummary(tenant.id),
    getCemOperationsSnapshot(tenant.id),
    getReportsBiReadinessSnapshot(tenant.id, moduleKeys, tenant.organization.industry),
    buildCemOperatingModelSnapshotForTenantSlug(slug),
    buildCemModuleDepthSnapshotForTenantSlug(slug, "reports"),
  ]);
  const moduleCtx = operatingModel
    ? selectModuleOperatingContext(operatingModel, "bi")
    : { relatedFlows: [], moduleAssignment: undefined };
  const r = routes.tenant(slug);

  const hasAnyErpData =
    moduleKeys.some((k) =>
      ["sales", "inventory", "warehouse", "finance", "logistics"].includes(k)
    ) || kpis.activeWorkflows > 0;

  return (
    <TenantModulePage
      engine="CEM"
      title="Reports"
      description={
        showMeemHub
          ? `Visibility layer — KPI roll-ups and executive narratives for ${tenant.organization.displayName}. Advisory signals, not predictive analytics.`
          : `Visibility layer — reporting readiness and executive roll-ups for ${tenant.organization.displayName}. Advisory BI, not a data warehouse.`
      }
      route="/[tenant]/reports"
      tenantSlug={slug}
    >
      <TenantRuntimeDemoHint beat="visibility" compact />
      <TenantCemOperationalReadinessNote slug={slug} variant="reports" />
      {operatingModel && (
        <TenantOperatingModelCrossLink variant="reports" snapshot={operatingModel} />
      )}
      {operatingModel && (
        <TenantModuleOperatingContext
          slug={slug}
          moduleKey="bi"
          moduleAssignment={moduleCtx.moduleAssignment}
          relatedFlows={moduleCtx.relatedFlows}
          cybercrowInitialized={summary.cybercrowInitialized}
        />
      )}
      {moduleDepth && (
        <TenantCemModuleDepthSection
          slug={slug}
          snapshot={moduleDepth}
          cybercrowInitialized={summary.cybercrowInitialized}
        />
      )}

      {showMeemHub ? (
        <div className="space-y-8">
          <ErpModuleHub
            slug={slug}
            organizationName={tenant.organization.displayName}
            moduleKey="reports"
          />
          <MeemReportsHub
            slug={slug}
            organizationName={tenant.organization.displayName}
            aiExtraKeys={aiExtraKeys}
          />

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Pipeline SAR"
              value={`${formatSar(kpis.pipelineSar)} SAR`}
              entity="cem"
              accent="cyan"
              hint={
                hasErpModule(tenantModules, "sales")
                  ? `${kpis.salesCount} opportunities`
                  : "Enable sales module"
              }
            />
            <StatCard
              label="Low stock SKUs"
              value={String(kpis.lowStockCount)}
              entity="cem"
              accent="amber"
              hint={
                hasErpModule(tenantModules, "inventory")
                  ? `${kpis.inventorySkus} SKUs tracked`
                  : "Enable inventory module"
              }
            />
            <StatCard
              label="Open AR"
              value={`${formatSar(kpis.openArSar)} SAR`}
              entity="cem"
              accent="amber"
              hint={
                hasErpModule(tenantModules, "finance")
                  ? `${kpis.financeEntries} ledger lines`
                  : "Enable finance module"
              }
            />
            <StatCard
              label="Active workflows"
              value={String(kpis.activeWorkflows)}
              entity="cem"
              accent="teal"
              hint={`${kpis.openTasks} open tasks`}
            />
          </section>

          {hasAnyErpData && (
            <section className="cc-glass-card">
              <h3 className="font-display text-sm font-semibold text-cyan-400">Module snapshot</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm text-slate-400">
                {hasErpModule(tenantModules, "sales") && (
                  <li>
                    Sales: {kpis.salesCount} rows · {formatSar(kpis.pipelineSar)} SAR pipeline
                  </li>
                )}
                {hasErpModule(tenantModules, "inventory") && (
                  <li>
                    Inventory: {kpis.inventorySkus} SKUs · {kpis.lowStockCount} low stock
                  </li>
                )}
                {hasErpModule(tenantModules, "warehouse") && (
                  <li>Warehouse: {kpis.warehouseLocations} locations</li>
                )}
                {hasErpModule(tenantModules, "finance") && (
                  <li>
                    Finance: {kpis.financeEntries} entries · {formatSar(kpis.openArSar)} SAR open AR
                  </li>
                )}
                <li>
                  Workflows: {kpis.activeWorkflows} active · {kpis.openTasks} open tasks
                </li>
              </ul>
            </section>
          )}

          {!hasAnyErpData && (
            <p className="text-sm text-slate-500">
              Enable ERP modules on the blueprint and run tenant ops seed for cross-module KPIs.
              {hasReportsModule && (
                <>
                  {" "}
                  Try{" "}
                  <code className="text-cyan-400">
                    npm run db:seed:tenant:ops -- --tenant={slug}
                  </code>
                </>
              )}
            </p>
          )}

          <ReportsBiOperationsReadinessPanel
            slug={slug}
            organizationName={tenant.organization.displayName}
            tenantModules={tenantModules}
            snapshot={biSnapshot}
            cemOps={cemOps}
            cybercrowLive={summary.cybercrowInitialized}
          />

          <ErpChainLinks tenantSlug={slug} currentModule="reports" tenantModules={tenantModules} />

          <div className="flex flex-wrap gap-3">
            <Link href={r.dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
              ← Dashboard
            </Link>
            <Link href={r.sales} className="text-sm text-slate-400 hover:text-white">
              Sales →
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <ReportsBiOperationsReadinessPanel
            slug={slug}
            organizationName={tenant.organization.displayName}
            tenantModules={tenantModules}
            snapshot={biSnapshot}
            cemOps={cemOps}
            cybercrowLive={summary.cybercrowInitialized}
          />
          <TenantRuntimeCrossLinks
            slug={slug}
            current="reports"
            cybercrowLive={summary.cybercrowInitialized}
          />
        </div>
      )}
    </TenantModulePage>
  );
}
