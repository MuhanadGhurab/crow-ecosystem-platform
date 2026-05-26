import Link from "next/link";
import { notFound } from "next/navigation";
import { ErpChainLinks } from "@/components/tenant/erp-chain-links";
import { ErpModuleHub } from "@/components/tenant/erp-module-hub";
import { MeemReportsHub } from "@/components/tenant/meem-reports-hub";
import { TenantReportsReadinessPanel } from "@/components/tenant/tenant-reports-readiness-panel";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantModulePage } from "@/components/tenant/tenant-module-page";
import { StatCard } from "@/components/ui/stat-card";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { resolveMeemHubAiKeys, showMeemErpHub } from "@/lib/meem/meem-hub-utils";
import { routes } from "@/lib/routes";
import { getReportsKpiSummary } from "@/lib/services/reports.service";
import { safeWorkspaceSummary } from "@/lib/services/workspace-summary-safe";
import { getTenantBySlug } from "@/lib/services/tenant.service";

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

  const [kpis, summary] = await Promise.all([
    getReportsKpiSummary(tenant.id, moduleKeys),
    safeWorkspaceSummary(tenant.id),
  ]);
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
          ? `Cross-module KPIs, executive narratives, and AI roll-ups for ${tenant.organization.displayName}.`
          : `Cross-module KPIs and executive snapshots for ${tenant.organization.displayName}.`
      }
      route="/[tenant]/reports"
      tenantSlug={slug}
    >
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
          <TenantReportsReadinessPanel
            slug={slug}
            organizationName={tenant.organization.displayName}
            tenantModules={tenantModules}
            kpis={kpis}
            cybercrowInitialized={summary.cybercrowInitialized}
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
