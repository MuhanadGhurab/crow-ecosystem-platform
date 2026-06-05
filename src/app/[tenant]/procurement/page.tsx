import Link from "next/link";
import { notFound } from "next/navigation";
import { FinanceLinkageBanner } from "@/components/tenant/finance/finance-linkage-banner";
import { ErpChainLinks } from "@/components/tenant/erp-chain-links";
import { ErpModuleHub } from "@/components/tenant/erp-module-hub";
import { MeemProcurementHub } from "@/components/tenant/meem-procurement-hub";
import { ProcurementOperationsReadinessPanel } from "@/components/tenant/procurement/procurement-operations-readiness-panel";
import { ProcurementSupplyLinkageBanner } from "@/components/tenant/procurement/procurement-supply-linkage-banner";
import { TenantModulePage } from "@/components/tenant/tenant-module-page";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantRuntimeStatStrip } from "@/components/tenant/tenant-runtime-stat-strip";
import { StatCard } from "@/components/ui/stat-card";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { LOGISTICS_PROCUREMENT_SAMPLES } from "@/lib/erp/industry-packs/logistics";
import { resolveMeemHubAiKeys, showMeemErpHub } from "@/lib/meem/meem-hub-utils";
import { isUseMockData } from "@/lib/mock/env";
import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { routes } from "@/lib/routes";
import { getProcurementOperationsReadinessSnapshot } from "@/lib/services/procurement-readiness.service";
import {
  getProcurementSummary,
  listPurchaseRequests,
} from "@/lib/services/procurement.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";
import {
  buildCemOperatingModelSnapshotForTenantSlug,
  selectModuleOperatingContext,
} from "@/lib/services/cem-operating-model.service";
import { TenantModuleOperatingContext } from "@/components/tenant/tenant-module-operating-context";
import { TenantCemModuleDepthSection } from "@/components/tenant/tenant-cem-module-depth-section";
import { buildCemModuleDepthSnapshotForTenantSlug } from "@/lib/services/cem-module-depth.service";

const STATUS_CLASS: Record<string, string> = {
  draft: "bg-slate-600/30 text-slate-300",
  submitted: "bg-amber-500/15 text-amber-300",
  approved: "bg-cyan-500/15 text-cyan-300",
  ordered: "bg-teal-500/15 text-teal-300",
  received: "bg-teal-500/15 text-teal-300",
  cancelled: "bg-slate-700/50 text-slate-400",
};

const PRIORITY_CLASS: Record<string, string> = {
  normal: "text-slate-400",
  urgent: "text-amber-300",
};

function formatSar(amount: number) {
  return new Intl.NumberFormat("en-SA", { maximumFractionDigits: 0 }).format(amount);
}

export default async function ProcurementPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const tenantModules = tenant.modules ?? [];
  const enabledModuleKeys = tenantModules.filter((m) => m.enabled).map((m) => m.moduleKey);
  const hasProcurementModule = hasErpModule(tenantModules, "procurement");
  if (!hasProcurementModule) notFound();

  const showMeemHub = showMeemErpHub(
    slug,
    tenant.organization.industry,
    tenantModules,
    "procurement"
  );
  const useMockProcurement = isUseMockData() && slug === MEEM_TENANT_SLUG;
  const hasInventoryModule = hasErpModule(tenantModules, "inventory");
  const hasWarehouseModule = hasErpModule(tenantModules, "warehouse");
  const hasFinanceModule = hasErpModule(tenantModules, "finance");
  const answers = tenant.blueprint?.request?.discoveryProfile?.answers ?? [];
  const aiExtraKeys = showMeemHub ? resolveMeemHubAiKeys(answers, "procurement") : [];

  const [requests, summary, readiness, operatingModel, moduleDepth] = await Promise.all([
    useMockProcurement
      ? Promise.resolve(
          LOGISTICS_PROCUREMENT_SAMPLES.map((s, i) => ({
            id: `mock-pr-${i}`,
            tenantId: tenant.id,
            referenceCode: s.referenceCode,
            title: s.title,
            status: s.status,
            priority: s.priority,
            amountSar: s.amountSar,
            vendorName: s.vendorName,
            linkedInventoryRef: s.linkedInventoryRef,
            linkedFinanceRef: s.linkedFinanceRef,
            createdAt: new Date(),
            updatedAt: new Date(),
          }))
        )
      : listPurchaseRequests(tenant.id),
    useMockProcurement
      ? Promise.resolve({
          total: LOGISTICS_PROCUREMENT_SAMPLES.length,
          draft: 0,
          submitted: LOGISTICS_PROCUREMENT_SAMPLES.filter((s) => s.status === "submitted")
            .length,
          approved: LOGISTICS_PROCUREMENT_SAMPLES.filter((s) => s.status === "approved").length,
          urgent: LOGISTICS_PROCUREMENT_SAMPLES.filter((s) => s.priority === "urgent").length,
          totalAmountSar: LOGISTICS_PROCUREMENT_SAMPLES.reduce(
            (n, s) => n + (s.amountSar ?? 0),
            0
          ),
        })
      : getProcurementSummary(tenant.id),
    getProcurementOperationsReadinessSnapshot(
      tenant.id,
      enabledModuleKeys,
      tenant.organization.industry
    ),
    buildCemOperatingModelSnapshotForTenantSlug(slug),
    buildCemModuleDepthSnapshotForTenantSlug(slug, "procurement"),
  ]);

  const r = routes.tenant(slug);
  const unlinkedFinanceCount = hasFinanceModule
    ? requests.filter((row) => !row.linkedFinanceRef).length
    : 0;
  const financeWarnings =
    unlinkedFinanceCount > 0
      ? [
          `${unlinkedFinanceCount} purchase request(s) without finance reference — coordinate on the Finance hub.`,
        ]
      : [];
  const supplyWarnings: string[] = [];
  if (hasInventoryModule && readiness.requestsWithoutInventoryLink > 0) {
    supplyWarnings.push(
      `${readiness.requestsWithoutInventoryLink} PR(s) without inventory SKU reference.`
    );
  }

  const cybercrowLive = readiness.cybercrowInitialized;
  const moduleCtx = operatingModel
    ? selectModuleOperatingContext(operatingModel, "procurement")
    : { relatedFlows: [], moduleAssignment: undefined };

  return (
    <TenantModulePage
      engine="CEM"
      title="Procurement"
      description={`Supplier and purchase operations readiness for ${tenant.organization.displayName} — purchase requests, approvals, and handoffs to finance and inventory without live supplier payments.`}
      route="/[tenant]/procurement"
      tenantSlug={slug}
    >
      <div className="space-y-8">
        <ProcurementSupplyLinkageBanner
          slug={slug}
          hasFinance={hasFinanceModule}
          hasInventory={hasInventoryModule}
          hasWarehouse={hasWarehouseModule}
          warnings={supplyWarnings}
        />
        {hasFinanceModule && (
          <FinanceLinkageBanner slug={slug} variant="procurement" warnings={financeWarnings} />
        )}

        <TenantRuntimeStatStrip
          items={[
            { label: "Purchase requests", value: String(summary.total) },
            { label: "In review", value: String(summary.draft + summary.submitted) },
            { label: "Approved", value: String(summary.approved) },
            { label: "PR value SAR", value: formatSar(summary.totalAmountSar) },
          ]}
        />

        <ProcurementOperationsReadinessPanel
          slug={slug}
          snapshot={readiness}
          cybercrowLive={cybercrowLive}
        />

        {operatingModel && (
          <TenantModuleOperatingContext
            slug={slug}
            moduleKey="procurement"
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

        {showMeemHub && (
          <>
            <ErpModuleHub
              slug={slug}
              organizationName={tenant.organization.displayName}
              moduleKey="procurement"
            />
            <MeemProcurementHub
              slug={slug}
              organizationName={tenant.organization.displayName}
              aiExtraKeys={aiExtraKeys}
            />
          </>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Open PRs"
            value={String(summary.submitted + summary.draft)}
            entity="cem"
            accent="amber"
            hint="Draft + submitted"
          />
          <StatCard
            label="Approved"
            value={String(summary.approved)}
            entity="cem"
            accent="cyan"
          />
          <StatCard label="Urgent" value={String(summary.urgent)} entity="cem" accent="amber" />
          <StatCard
            label="PR value"
            value={`${formatSar(summary.totalAmountSar)} SAR`}
            entity="cem"
            accent="teal"
            hint={`${summary.total} requests`}
          />
        </section>

        <section className="cc-glass-card">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            Purchase requests ({requests.length})
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Operator-managed PR list — amounts are coordination signals, not paid spend or issued
            purchase orders.
          </p>
          {requests.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No purchase requests yet. Run{" "}
              <code className="text-cyan-400">npm run db:seed:tenant:ops -- --tenant={slug}</code>{" "}
              after enabling the procurement module for sample PRs linked to low-stock SKUs.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {requests.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-wrap items-start justify-between gap-4 rounded-cc border border-cyan-500/10 bg-white/5 p-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-white">{row.title}</p>
                      {row.referenceCode && (
                        <span className="font-mono text-xs text-slate-500">{row.referenceCode}</span>
                      )}
                      <span
                        className={`text-xs font-medium uppercase ${PRIORITY_CLASS[row.priority] ?? "text-slate-400"}`}
                      >
                        {row.priority}
                      </span>
                    </div>
                    {row.vendorName && (
                      <p className="mt-1 text-xs text-slate-500">Vendor: {row.vendorName}</p>
                    )}
                    {row.linkedInventoryRef && hasInventoryModule && (
                      <p className="mt-1 text-xs text-slate-500">
                        SKU ref:{" "}
                        <Link href={r.inventory} className="text-cyan-400 hover:text-cyan-300">
                          {row.linkedInventoryRef}
                        </Link>
                      </p>
                    )}
                    {row.linkedFinanceRef && hasFinanceModule && (
                      <p className="mt-1 text-xs text-slate-500">
                        AP ref:{" "}
                        <Link href={r.finance} className="text-cyan-400 hover:text-cyan-300">
                          {row.linkedFinanceRef}
                        </Link>
                      </p>
                    )}
                    {row.amountSar != null && (
                      <p className="mt-2 font-display text-lg font-semibold tabular-nums text-cyan-300">
                        {formatSar(row.amountSar)} SAR
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

        <ErpChainLinks
          tenantSlug={slug}
          currentModule="procurement"
          tenantModules={tenantModules}
        />

        <TenantRuntimeCrossLinks slug={slug} current="procurement" cybercrowLive={cybercrowLive} />

        <div className="flex flex-wrap gap-3">
          {hasInventoryModule && (
            <Link href={r.inventory} className="text-sm text-slate-400 hover:text-white">
              Inventory →
            </Link>
          )}
          {hasWarehouseModule && (
            <Link href={r.warehouse} className="text-sm text-slate-400 hover:text-white">
              Warehouse →
            </Link>
          )}
          {hasFinanceModule && (
            <Link href={r.finance} className="text-sm text-slate-400 hover:text-white">
              Finance →
            </Link>
          )}
          <Link href={r.dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
            ← Dashboard
          </Link>
        </div>
      </div>
    </TenantModulePage>
  );
}
