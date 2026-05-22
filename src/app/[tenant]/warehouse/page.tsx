import Link from "next/link";
import { notFound } from "next/navigation";
import { ErpChainLinks } from "@/components/tenant/erp-chain-links";
import { ErpModuleHub } from "@/components/tenant/erp-module-hub";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { LOGISTICS_WAREHOUSE_SAMPLES } from "@/lib/erp/industry-packs/logistics";
import { isUseMockData } from "@/lib/mock/env";
import { MEEM_TENANT_SLUG } from "@/lib/mock/meem-global";
import { routes } from "@/lib/routes";
import { getTenantBySlug } from "@/lib/services/tenant.service";
import { getWarehouseSummary, listWarehouseLocations } from "@/lib/services/warehouse.service";

const STATUS_CLASS: Record<string, string> = {
  active: "bg-teal-500/15 text-teal-300",
  maintenance: "bg-amber-500/15 text-amber-300",
  closed: "bg-slate-600/30 text-slate-300",
};

const MOVEMENT_LABEL: Record<string, string> = {
  inbound: "Inbound",
  outbound: "Outbound",
  staging: "Staging",
  cold_storage: "Cold storage",
};

function isLogisticsIndustry(industry: string | null | undefined): boolean {
  return industry === "logistics" || industry === "logistics_fulfillment";
}

export default async function WarehousePage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const tenantModules = tenant.modules ?? [];
  const showLogisticsHub =
    isLogisticsIndustry(tenant.organization.industry) || slug === MEEM_TENANT_SLUG;
  const useMockWarehouse = isUseMockData() && slug === MEEM_TENANT_SLUG;
  const hasWarehouseModule = hasErpModule(tenantModules, "warehouse");
  const hasInventoryModule = hasErpModule(tenantModules, "inventory");
  const hasLogisticsModule = hasErpModule(tenantModules, "logistics");

  const [locations, summary] = useMockWarehouse
    ? [
        LOGISTICS_WAREHOUSE_SAMPLES.map((s, i) => ({
          id: `mock-wh-${i}`,
          tenantId: tenant.id,
          referenceCode: s.referenceCode,
          name: s.name,
          site: s.site,
          zone: s.zone,
          bin: s.bin,
          movementKind: s.movementKind,
          status: s.status,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        {
          totalLocations: LOGISTICS_WAREHOUSE_SAMPLES.length,
          sites: new Set(LOGISTICS_WAREHOUSE_SAMPLES.map((s) => s.site)).size,
          inbound: LOGISTICS_WAREHOUSE_SAMPLES.filter((s) => s.movementKind === "inbound").length,
          outbound: LOGISTICS_WAREHOUSE_SAMPLES.filter((s) => s.movementKind === "outbound").length,
          coldStorage: LOGISTICS_WAREHOUSE_SAMPLES.filter((s) => s.movementKind === "cold_storage")
            .length,
        },
      ]
    : await Promise.all([
        listWarehouseLocations(tenant.id),
        getWarehouseSummary(tenant.id),
      ]);

  const r = routes.tenant(slug);

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CEM · Warehouse"
        entity="cem"
        title="Warehouse"
        description={
          showLogisticsHub
            ? `Zones, bins, and inbound/outbound lanes for ${tenant.organization.displayName}.`
            : `Warehouse locations and movement lanes for ${tenant.organization.displayName}.`
        }
      />

      {showLogisticsHub && (
        <ErpModuleHub
          slug={slug}
          organizationName={tenant.organization.displayName}
          moduleKey="warehouse"
        />
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Locations"
          value={summary.totalLocations}
          entity="cem"
          accent="cyan"
          hint={`${summary.sites} hub sites`}
        />
        <StatCard
          label="Inbound lanes"
          value={summary.inbound}
          entity="cem"
          accent="teal"
        />
        <StatCard
          label="Outbound lanes"
          value={summary.outbound}
          entity="cem"
          accent="cyan"
        />
        <StatCard
          label="Cold storage"
          value={summary.coldStorage}
          entity="cem"
          accent="amber"
        />
      </section>

      <section className="cc-glass-card">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          Zones & bins ({locations.length})
        </h3>
        {locations.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No warehouse locations yet.
            {hasWarehouseModule && (
              <>
                {" "}
                Run <code className="text-cyan-400">npm run db:seed:meem:ops</code> for sample
                data when the warehouse module is enabled.
              </>
            )}
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {locations.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-start justify-between gap-4 rounded-cc border border-cyan-500/10 bg-white/5 p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-white">{row.name}</p>
                    {row.referenceCode && (
                      <span className="font-mono text-xs text-slate-500">{row.referenceCode}</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {row.site}
                    {row.zone ? ` · ${row.zone}` : ""}
                    {row.bin ? ` · ${row.bin}` : ""}
                  </p>
                  {(hasInventoryModule || hasLogisticsModule) && (
                    <p className="mt-1 text-xs text-slate-500">
                      {hasInventoryModule && (
                        <Link href={r.inventory} className="text-cyan-400 hover:text-cyan-300">
                          Inventory
                        </Link>
                      )}
                      {hasInventoryModule && hasLogisticsModule && " · "}
                      {hasLogisticsModule && (
                        <Link href={r.logistics} className="text-teal-400 hover:text-teal-300">
                          Logistics
                        </Link>
                      )}
                      {" · "}
                      <Link href={r.workflows} className="text-teal-400 hover:text-teal-300">
                        Workflows
                      </Link>
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-300">
                    {MOVEMENT_LABEL[row.movementKind] ?? row.movementKind}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      STATUS_CLASS[row.status] ?? "bg-slate-700/50 text-slate-400"
                    }`}
                  >
                    {row.status.replace("_", " ")}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ErpChainLinks tenantSlug={slug} currentModule="warehouse" tenantModules={tenantModules} />

      <div className="flex flex-wrap gap-3">
        <Link href={r.dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
          ← Dashboard
        </Link>
      </div>
    </div>
  );
}
