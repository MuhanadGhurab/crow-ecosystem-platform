import Link from "next/link";
import { notFound } from "next/navigation";
import { ErpModuleHub } from "@/components/tenant/erp-module-hub";
import { InventoryOperationsReadinessPanel } from "@/components/tenant/inventory/inventory-operations-readiness-panel";
import { MeemInventoryHub } from "@/components/tenant/meem-inventory-hub";
import { SupplyChainOperationsLinkageBanner } from "@/components/tenant/supply-chain/supply-chain-operations-linkage-banner";
import { TenantModulePage } from "@/components/tenant/tenant-module-page";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantRuntimeStatStrip } from "@/components/tenant/tenant-runtime-stat-strip";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { LOGISTICS_INVENTORY_SAMPLES } from "@/lib/erp/industry-packs/logistics";
import { resolveMeemHubAiKeys, showMeemErpHub } from "@/lib/meem/meem-hub-utils";
import { isUseMockData } from "@/lib/mock/env";
import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { routes } from "@/lib/routes";
import { getInventoryOperationsReadinessSnapshot } from "@/lib/services/inventory-warehouse-readiness.service";
import {
  getInventorySummary,
  listInventoryItems,
} from "@/lib/services/inventory.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";
import {
  buildCemOperatingModelSnapshotForTenantSlug,
  selectModuleOperatingContext,
} from "@/lib/services/cem-operating-model.service";
import { TenantModuleOperatingContext } from "@/components/tenant/tenant-module-operating-context";
import { TenantCemModuleDepthSection } from "@/components/tenant/tenant-cem-module-depth-section";
import { buildCemModuleDepthSnapshotForTenantSlug } from "@/lib/services/cem-module-depth.service";

export default async function TenantInventoryPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const tenantModules = tenant.modules ?? [];
  const enabledModuleKeys = tenantModules.filter((m) => m.enabled).map((m) => m.moduleKey);
  if (!hasErpModule(tenantModules, "inventory")) notFound();

  const showMeemHub = showMeemErpHub(
    slug,
    tenant.organization.industry,
    tenantModules,
    "inventory"
  );
  const useMockInventory = isUseMockData() && slug === MEEM_TENANT_SLUG;
  const answers = tenant.blueprint?.request?.discoveryProfile?.answers ?? [];
  const aiExtraKeys = showMeemHub ? resolveMeemHubAiKeys(answers, "inventory") : [];

  const [items, summary, readiness, operatingModel, moduleDepth] = await Promise.all([
    useMockInventory
      ? Promise.resolve(
          LOGISTICS_INVENTORY_SAMPLES.map((s, i) => ({
            id: `mock-inv-${i}`,
            tenantId: tenant.id,
            referenceCode: s.referenceCode,
            sku: s.sku,
            name: s.name,
            category: s.category,
            qtyOnHand: s.qtyOnHand,
            reorderLevel: s.reorderLevel,
            location: s.location,
            status: s.status,
            createdAt: new Date(),
            updatedAt: new Date(),
          }))
        )
      : listInventoryItems(tenant.id),
    useMockInventory
      ? Promise.resolve({
          totalSkus: LOGISTICS_INVENTORY_SAMPLES.length,
          lowStock: LOGISTICS_INVENTORY_SAMPLES.filter((s) => s.status === "low_stock").length,
          locations: new Set(LOGISTICS_INVENTORY_SAMPLES.map((s) => s.location)).size,
          qtyOnHand: LOGISTICS_INVENTORY_SAMPLES.reduce((n, s) => n + s.qtyOnHand, 0),
        })
      : getInventorySummary(tenant.id),
    getInventoryOperationsReadinessSnapshot(
      tenant.id,
      enabledModuleKeys,
      tenant.organization.industry
    ),
    buildCemOperatingModelSnapshotForTenantSlug(slug),
    buildCemModuleDepthSnapshotForTenantSlug(slug, "inventory"),
  ]);
  const moduleCtx = operatingModel
    ? selectModuleOperatingContext(operatingModel, "inventory")
    : { relatedFlows: [], moduleAssignment: undefined };

  const linkageWarnings: string[] = [];
  if (readiness.procurementEnabled && readiness.prsWithoutInventoryRef > 0) {
    linkageWarnings.push(
      `${readiness.prsWithoutInventoryRef} purchase request(s) without inventory SKU reference — link on Procurement hub.`
    );
  }
  if (!readiness.warehouseEnabled) {
    linkageWarnings.push("Warehouse module off — enable for receiving and movement coordination.");
  }
  if (!readiness.logisticsEnabled) {
    linkageWarnings.push("Logistics module off — enable for dispatch / delivery handoff when needed.");
  }

  const cybercrowLive = readiness.cybercrowInitialized;
  const r = routes.tenant(slug);

  return (
    <TenantModulePage
      engine="CEM"
      title="Inventory"
      description={`Stock and material operations readiness for ${tenant.organization.displayName} — SKU visibility, adjustments, and supply-chain handoffs without real-time stock accuracy guarantees.`}
      route="/[tenant]/inventory"
      tenantSlug={slug}
    >
      <div className="space-y-8">
        <SupplyChainOperationsLinkageBanner
          slug={slug}
          variant="inventory"
          warnings={linkageWarnings}
        />

        <TenantRuntimeCrossLinks
          slug={slug}
          current="inventory"
          cybercrowLive={cybercrowLive}
        />

        <TenantRuntimeStatStrip
          items={[
            { label: "Readiness", value: readiness.readinessLabel, accent: "cyan" },
            { label: "SKUs", value: String(summary.totalSkus) },
            { label: "Low-stock signals", value: String(summary.lowStock), accent: "amber" },
            { label: "Qty on hand", value: String(summary.qtyOnHand) },
            { label: "Inventory open tasks", value: readiness.inventoryRelatedOpenTasks },
          ]}
        />

        <InventoryOperationsReadinessPanel
          slug={slug}
          snapshot={readiness}
          cybercrowLive={cybercrowLive}
        />

        {operatingModel && (
          <TenantModuleOperatingContext
            slug={slug}
            moduleKey="inventory"
            moduleAssignment={moduleCtx.moduleAssignment}
            relatedFlows={moduleCtx.relatedFlows}
            cybercrowInitialized={cybercrowLive}
          />
        )}

        {moduleDepth && (
          <TenantCemModuleDepthSection
            slug={slug}
            snapshot={moduleDepth}
            cybercrowInitialized={cybercrowLive}
          />
        )}

        {items.length > 0 && (
          <section className="cc-glass-card space-y-3">
            <h2 className="text-sm font-medium text-cyan-400">
              {useMockInventory ? "Sample SKUs (MEEM reference)" : "Inventory items (coordination view)"}
            </h2>
            <p className="text-xs text-slate-500">
              Quantities are coordination signals for readiness — not certified stock accuracy,
              valuation, or barcode-scanner events.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-slate-500">
                    <th className="py-2 pr-4">SKU</th>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Qty</th>
                    <th className="py-2 pr-4">Location</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.slice(0, 12).map((row) => (
                    <tr key={row.id} className="border-b border-white/5 text-slate-300">
                      <td className="py-2 pr-4 font-mono text-xs">{row.sku}</td>
                      <td className="py-2 pr-4">{row.name}</td>
                      <td className="py-2 pr-4">{row.qtyOnHand}</td>
                      <td className="py-2 pr-4 text-xs">{row.location ?? "—"}</td>
                      <td className="py-2 text-xs">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {readiness.procurementEnabled && (
              <p className="text-xs text-slate-500">
                <Link href={r.procurement} className="text-cyan-400 hover:text-cyan-300">
                  Procurement receiving handoff →
                </Link>
              </p>
            )}
          </section>
        )}

        {showMeemHub && (
          <>
            <ErpModuleHub
              slug={slug}
              organizationName={tenant.organization.displayName}
              moduleKey="inventory"
            />
            <MeemInventoryHub
              slug={slug}
              organizationName={tenant.organization.displayName}
              aiExtraKeys={aiExtraKeys}
            />
          </>
        )}
      </div>
    </TenantModulePage>
  );
}
