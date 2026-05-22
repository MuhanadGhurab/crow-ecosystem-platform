import Link from "next/link";
import { notFound } from "next/navigation";
import { ErpChainLinks } from "@/components/tenant/erp-chain-links";
import { ErpModuleHub } from "@/components/tenant/erp-module-hub";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { LOGISTICS_INVENTORY_SAMPLES } from "@/lib/erp/industry-packs/logistics";
import { isUseMockData } from "@/lib/mock/env";
import { MEEM_TENANT_SLUG } from "@/lib/mock/meem-global";
import { routes } from "@/lib/routes";
import { getInventorySummary, listInventoryItems } from "@/lib/services/inventory.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

const STATUS_CLASS: Record<string, string> = {
  active: "bg-teal-500/15 text-teal-300",
  low_stock: "bg-amber-500/15 text-amber-300",
  reserved: "bg-cyan-500/15 text-cyan-300",
  discontinued: "bg-slate-600/30 text-slate-300",
};

const CATEGORY_LABEL: Record<string, string> = {
  pallet: "Pallets",
  cold_chain: "Cold-chain",
  fleet_spare: "Fleet spare parts",
  packaging: "Packaging",
  general: "General",
};

function formatQty(n: number) {
  return new Intl.NumberFormat("en-SA", { maximumFractionDigits: 0 }).format(n);
}

function isLogisticsIndustry(industry: string | null | undefined): boolean {
  return industry === "logistics" || industry === "logistics_fulfillment";
}

export default async function InventoryPage({
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
  const useMockInventory = isUseMockData() && slug === MEEM_TENANT_SLUG;
  const hasInventoryModule = hasErpModule(tenantModules, "inventory");
  const hasWarehouseModule = hasErpModule(tenantModules, "warehouse");
  const hasLogisticsModule = hasErpModule(tenantModules, "logistics");
  const hasSalesModule = hasErpModule(tenantModules, "sales");

  const [items, summary] = useMockInventory
    ? [
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
        })),
        {
          totalSkus: LOGISTICS_INVENTORY_SAMPLES.length,
          lowStock: LOGISTICS_INVENTORY_SAMPLES.filter(
            (s) =>
              s.status === "low_stock" ||
              (s.reorderLevel > 0 && s.qtyOnHand <= s.reorderLevel)
          ).length,
          locations: new Set(LOGISTICS_INVENTORY_SAMPLES.map((s) => s.location)).size,
          qtyOnHand: LOGISTICS_INVENTORY_SAMPLES.reduce((n, s) => n + s.qtyOnHand, 0),
        },
      ]
    : await Promise.all([
        listInventoryItems(tenant.id),
        getInventorySummary(tenant.id),
      ]);

  const r = routes.tenant(slug);

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CEM · Inventory"
        entity="cem"
        title="Inventory"
        description={
          showLogisticsHub
            ? `Stock levels, hub locations, and reorder signals for ${tenant.organization.displayName}.`
            : `SKUs, warehouses, and stock for ${tenant.organization.displayName}.`
        }
      />

      {showLogisticsHub && (
        <ErpModuleHub
          slug={slug}
          organizationName={tenant.organization.displayName}
          moduleKey="inventory"
        />
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="SKUs on hand"
          value={summary.totalSkus}
          entity="cem"
          accent="cyan"
          hint={`${formatQty(summary.qtyOnHand)} units total`}
        />
        <StatCard
          label="Low stock"
          value={summary.lowStock}
          entity="cem"
          accent="amber"
          hint="At or below reorder level"
        />
        <StatCard
          label="Locations"
          value={summary.locations}
          entity="cem"
          accent="cyan"
        />
        <StatCard
          label="Units on hand"
          value={formatQty(summary.qtyOnHand)}
          entity="cem"
          accent="teal"
        />
      </section>

      <section className="cc-glass-card">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          Stock items ({items.length})
        </h3>
        {items.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No inventory records yet.
            {hasInventoryModule && (
              <>
                {" "}
                Run <code className="text-cyan-400">npm run db:seed:meem:ops</code> for sample
                data when the inventory module is enabled.
              </>
            )}
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {items.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-start justify-between gap-4 rounded-cc border border-cyan-500/10 bg-white/5 p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-white">{row.name}</p>
                    <span className="font-mono text-xs text-cyan-400/80">{row.sku}</span>
                    {row.referenceCode && (
                      <span className="font-mono text-xs text-slate-500">{row.referenceCode}</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {CATEGORY_LABEL[row.category] ?? row.category}
                    {row.location ? ` · ${row.location}` : ""}
                  </p>
                  <p className="mt-2 font-display text-lg font-semibold tabular-nums text-cyan-300">
                    {formatQty(row.qtyOnHand)} on hand
                    {row.reorderLevel > 0 && (
                      <span className="ml-2 text-sm font-normal text-slate-500">
                        (reorder at {formatQty(row.reorderLevel)})
                      </span>
                    )}
                  </p>
                  {(hasWarehouseModule || hasLogisticsModule || hasSalesModule) && (
                    <p className="mt-1 text-xs text-slate-500">
                      {hasWarehouseModule && (
                        <Link href={r.warehouse} className="text-cyan-400 hover:text-cyan-300">
                          Warehouse
                        </Link>
                      )}
                      {hasWarehouseModule && (hasLogisticsModule || hasSalesModule) && " · "}
                      {hasLogisticsModule && (
                        <Link href={r.logistics} className="text-teal-400 hover:text-teal-300">
                          Logistics
                        </Link>
                      )}
                      {hasLogisticsModule && hasSalesModule && " · "}
                      {hasSalesModule && (
                        <Link href={r.sales} className="text-teal-400 hover:text-teal-300">
                          Sales
                        </Link>
                      )}
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    STATUS_CLASS[row.status] ?? "bg-slate-700/50 text-slate-400"
                  }`}
                >
                  {row.status.replace("_", " ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ErpChainLinks tenantSlug={slug} currentModule="inventory" tenantModules={tenantModules} />

      <div className="flex flex-wrap gap-3">
        <Link href={r.sales} className="text-sm text-slate-400 hover:text-white">
          Sales →
        </Link>
        <Link href={r.dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
          ← Dashboard
        </Link>
      </div>
    </div>
  );
}
