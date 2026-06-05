import Link from "next/link";
import { notFound } from "next/navigation";
import { ErpModuleHub } from "@/components/tenant/erp-module-hub";
import { MeemWarehouseHub } from "@/components/tenant/meem-warehouse-hub";
import { SupplyChainOperationsLinkageBanner } from "@/components/tenant/supply-chain/supply-chain-operations-linkage-banner";
import { WarehouseOperationsReadinessPanel } from "@/components/tenant/warehouse/warehouse-operations-readiness-panel";
import { TenantModulePage } from "@/components/tenant/tenant-module-page";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantRuntimeStatStrip } from "@/components/tenant/tenant-runtime-stat-strip";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { resolveMeemHubAiKeys, showMeemErpHub } from "@/lib/meem/meem-hub-utils";
import { routes } from "@/lib/routes";
import { getWarehouseOperationsReadinessSnapshot } from "@/lib/services/inventory-warehouse-readiness.service";
import {
  getWarehouseSummary,
  listWarehouseLocations,
} from "@/lib/services/warehouse.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";
import {
  buildCemOperatingModelSnapshotForTenantSlug,
  selectModuleOperatingContext,
} from "@/lib/services/cem-operating-model.service";
import { TenantModuleOperatingContext } from "@/components/tenant/tenant-module-operating-context";
import { TenantCemModuleDepthSection } from "@/components/tenant/tenant-cem-module-depth-section";
import { buildCemModuleDepthSnapshotForTenantSlug } from "@/lib/services/cem-module-depth.service";

export default async function TenantWarehousePage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const tenantModules = tenant.modules ?? [];
  const enabledModuleKeys = tenantModules.filter((m) => m.enabled).map((m) => m.moduleKey);
  if (!hasErpModule(tenantModules, "warehouse")) notFound();

  const showMeemHub = showMeemErpHub(
    slug,
    tenant.organization.industry,
    tenantModules,
    "warehouse"
  );
  const answers = tenant.blueprint?.request?.discoveryProfile?.answers ?? [];
  const aiExtraKeys = showMeemHub ? resolveMeemHubAiKeys(answers, "warehouse") : [];

  const [locations, summary, readiness, operatingModel, moduleDepth] = await Promise.all([
    listWarehouseLocations(tenant.id),
    getWarehouseSummary(tenant.id),
    getWarehouseOperationsReadinessSnapshot(
      tenant.id,
      enabledModuleKeys,
      tenant.organization.industry
    ),
    buildCemOperatingModelSnapshotForTenantSlug(slug),
    buildCemModuleDepthSnapshotForTenantSlug(slug, "warehouse"),
  ]);
  const moduleCtx = operatingModel
    ? selectModuleOperatingContext(operatingModel, "warehouse")
    : { relatedFlows: [], moduleAssignment: undefined };

  const linkageWarnings: string[] = [];
  if (!readiness.procurementEnabled) {
    linkageWarnings.push("Procurement module off — enable for inbound receiving handoff.");
  }
  if (!readiness.inventoryEnabled) {
    linkageWarnings.push("Inventory module off — enable for SKU / movement context.");
  }
  if (!readiness.logisticsEnabled) {
    linkageWarnings.push("Logistics module off — enable for dispatch handoff from outbound lanes.");
  }

  const cybercrowLive = readiness.cybercrowInitialized;
  const r = routes.tenant(slug);

  return (
    <TenantModulePage
      engine="CEM"
      title="Warehouse"
      description={`Warehouse operations readiness for ${tenant.organization.displayName} — receiving, putaway, picking, and logistics handoffs without a full WMS or warehouse automation platform.`}
      route="/[tenant]/warehouse"
      tenantSlug={slug}
    >
      <div className="space-y-8">
        <SupplyChainOperationsLinkageBanner
          slug={slug}
          variant="warehouse"
          warnings={linkageWarnings}
        />

        <TenantRuntimeCrossLinks
          slug={slug}
          current="warehouse"
          cybercrowLive={cybercrowLive}
        />

        <TenantRuntimeStatStrip
          items={[
            { label: "Readiness", value: readiness.readinessLabel, accent: "cyan" },
            { label: "Locations", value: String(summary.totalLocations) },
            { label: "Inbound lanes", value: String(summary.inbound), accent: "teal" },
            { label: "Outbound lanes", value: String(summary.outbound), accent: "amber" },
            { label: "Warehouse open tasks", value: readiness.warehouseRelatedOpenTasks },
          ]}
        />

        <WarehouseOperationsReadinessPanel
          slug={slug}
          snapshot={readiness}
          cybercrowLive={cybercrowLive}
        />

        {operatingModel && (
          <TenantModuleOperatingContext
            slug={slug}
            moduleKey="warehouse"
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

        {locations.length > 0 && (
          <section className="cc-glass-card space-y-3">
            <h2 className="text-sm font-medium text-cyan-400">
              Warehouse locations (coordination view)
            </h2>
            <p className="text-xs text-slate-500">
              Lane and zone records support receiving and dispatch readiness — not live automation,
              RFID, or IoT sensor events.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-slate-500">
                    <th className="py-2 pr-4">Site</th>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Zone</th>
                    <th className="py-2 pr-4">Bin</th>
                    <th className="py-2 pr-4">Movement</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.slice(0, 12).map((row) => (
                    <tr key={row.id} className="border-b border-white/5 text-slate-300">
                      <td className="py-2 pr-4">{row.site}</td>
                      <td className="py-2 pr-4">{row.name}</td>
                      <td className="py-2 pr-4">{row.zone ?? "—"}</td>
                      <td className="py-2 pr-4 font-mono text-xs">{row.bin ?? "—"}</td>
                      <td className="py-2 pr-4 text-xs">{row.movementKind}</td>
                      <td className="py-2 text-xs">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {readiness.logisticsEnabled && (
              <p className="text-xs text-slate-500">
                <Link href={r.logistics} className="text-cyan-400 hover:text-cyan-300">
                  Logistics dispatch handoff →
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
              moduleKey="warehouse"
            />
            <MeemWarehouseHub
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
