import Link from "next/link";
import { notFound } from "next/navigation";
import { FinanceLinkageBanner } from "@/components/tenant/finance/finance-linkage-banner";
import { ErpChainLinks } from "@/components/tenant/erp-chain-links";
import { ErpModuleHub } from "@/components/tenant/erp-module-hub";
import { MeemProcurementHub } from "@/components/tenant/meem-procurement-hub";
import { TenantModulePage } from "@/components/tenant/tenant-module-page";
import { StatCard } from "@/components/ui/stat-card";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { LOGISTICS_PROCUREMENT_SAMPLES } from "@/lib/erp/industry-packs/logistics";
import { resolveMeemHubAiKeys, showMeemErpHub } from "@/lib/meem/meem-hub-utils";
import { isUseMockData } from "@/lib/mock/env";
import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { routes } from "@/lib/routes";
import {
  getProcurementSummary,
  listPurchaseRequests,
} from "@/lib/services/procurement.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

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
  const hasFinanceModule = hasErpModule(tenantModules, "finance");
  const answers = tenant.blueprint?.request?.discoveryProfile?.answers ?? [];
  const aiExtraKeys = showMeemHub ? resolveMeemHubAiKeys(answers, "procurement") : [];

  const [requests, summary] = useMockProcurement
    ? [
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
        })),
        {
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
        },
      ]
    : await Promise.all([listPurchaseRequests(tenant.id), getProcurementSummary(tenant.id)]);

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

  return (
    <TenantModulePage
      engine="CEM"
      title="Procurement"
      description={
        showMeemHub
          ? `Purchase requests tied to low-stock SKUs and AP lines for ${tenant.organization.displayName}.`
          : `Purchase requests and vendor orders for ${tenant.organization.displayName}.`
      }
      route="/[tenant]/procurement"
      tenantSlug={slug}
    >
      {hasFinanceModule && (
        <FinanceLinkageBanner slug={slug} variant="procurement" warnings={financeWarnings} />
      )}
      {showMeemHub ? (
        <div className="space-y-8">
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
            <StatCard
              label="Urgent"
              value={String(summary.urgent)}
              entity="cem"
              accent="amber"
            />
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

          <div className="flex flex-wrap gap-3">
            {hasInventoryModule && (
              <Link href={r.inventory} className="text-sm text-slate-400 hover:text-white">
                Inventory →
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
      ) : undefined}
    </TenantModulePage>
  );
}
