import Link from "next/link";
import { notFound } from "next/navigation";
import { CommercialLinkageBanner } from "@/components/tenant/crm-sales/commercial-linkage-banner";
import { FinanceLinkageBanner } from "@/components/tenant/finance/finance-linkage-banner";
import { ErpChainLinks } from "@/components/tenant/erp-chain-links";
import { ErpModuleHub } from "@/components/tenant/erp-module-hub";
import { MeemSalesHub } from "@/components/tenant/meem-sales-hub";
import { SalesCommercialReadinessPanel } from "@/components/tenant/sales/sales-commercial-readiness-panel";
import { TenantModulePage } from "@/components/tenant/tenant-module-page";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantRuntimeStatStrip } from "@/components/tenant/tenant-runtime-stat-strip";
import { StatCard } from "@/components/ui/stat-card";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { LOGISTICS_SALES_SAMPLES } from "@/lib/erp/industry-packs/logistics";
import { resolveMeemHubAiKeys, showMeemErpHub } from "@/lib/meem/meem-hub-utils";
import { isUseMockData } from "@/lib/mock/env";
import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { routes } from "@/lib/routes";
import { getSalesCommercialReadinessSnapshot } from "@/lib/services/crm-sales-readiness.service";
import { getSalesSummary, listSalesOpportunities } from "@/lib/services/sales.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";
import {
  buildCemOperatingModelSnapshotForTenantSlug,
  selectModuleOperatingContext,
} from "@/lib/services/cem-operating-model.service";
import { TenantModuleOperatingContext } from "@/components/tenant/tenant-module-operating-context";

const STATUS_CLASS: Record<string, string> = {
  draft: "bg-slate-600/30 text-slate-300",
  quoted: "bg-cyan-500/15 text-cyan-300",
  negotiation: "bg-amber-500/15 text-amber-300",
  won: "bg-teal-500/15 text-teal-300",
  fulfilled: "bg-teal-500/15 text-teal-300",
  lost: "bg-rose-500/15 text-rose-300",
};

const KIND_LABEL: Record<string, string> = {
  quote: "Freight quote",
  order: "Order / contract",
  opportunity: "B2B opportunity",
};

function formatSar(amount: number) {
  return new Intl.NumberFormat("en-SA", { maximumFractionDigits: 0 }).format(amount);
}

export default async function SalesPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const tenantModules = tenant.modules ?? [];
  const enabledModuleKeys = tenantModules.filter((m) => m.enabled).map((m) => m.moduleKey);
  const showMeemHub = showMeemErpHub(slug, tenant.organization.industry, tenantModules, "sales");
  const useMockSales = isUseMockData() && slug === MEEM_TENANT_SLUG;
  const hasSalesModule = hasErpModule(tenantModules, "sales");
  const hasFinanceModule = hasErpModule(tenantModules, "finance");
  const hasLogisticsModule = hasErpModule(tenantModules, "logistics");
  const answers = tenant.blueprint?.request?.discoveryProfile?.answers ?? [];
  const aiExtraKeys = showMeemHub ? resolveMeemHubAiKeys(answers, "sales") : [];

  const request = tenant.blueprint?.request;
  const requestContext = {
    requestReferenceCode: request?.referenceCode ?? null,
    requestStatus: request?.status ?? null,
  };

  const [opportunities, summary, readiness, operatingModel] = await Promise.all([
    useMockSales
      ? Promise.resolve(
          LOGISTICS_SALES_SAMPLES.map((s, i) => ({
            id: `mock-sales-${i}`,
            tenantId: tenant.id,
            crmAccountId: null,
            referenceCode: s.referenceCode,
            title: s.title,
            kind: s.kind,
            status: s.status,
            customerName: s.customerName,
            amountSar: s.amountSar,
            workflowName: s.workflowName,
            createdAt: new Date(),
            updatedAt: new Date(),
            crmAccount: null,
          }))
        )
      : hasSalesModule
        ? listSalesOpportunities(tenant.id)
        : Promise.resolve([]),
    useMockSales
      ? Promise.resolve({
          total: LOGISTICS_SALES_SAMPLES.length,
          quotes: LOGISTICS_SALES_SAMPLES.filter((s) => s.kind === "quote").length,
          orders: LOGISTICS_SALES_SAMPLES.filter((s) => s.kind === "order").length,
          pipelineSar: LOGISTICS_SALES_SAMPLES.filter(
            (s) => s.status !== "won" && s.status !== "fulfilled"
          ).reduce((n, s) => n + s.amountSar, 0),
          wonSar: LOGISTICS_SALES_SAMPLES.filter(
            (s) => s.status === "won" || s.status === "fulfilled"
          ).reduce((n, s) => n + s.amountSar, 0),
        })
      : hasSalesModule
        ? getSalesSummary(tenant.id)
        : Promise.resolve({
            total: 0,
            quotes: 0,
            orders: 0,
            pipelineSar: 0,
            wonSar: 0,
          }),
    getSalesCommercialReadinessSnapshot(
      tenant.id,
      enabledModuleKeys,
      tenant.organization.industry,
      requestContext
    ),
    buildCemOperatingModelSnapshotForTenantSlug(slug),
  ]);

  const moduleCtx = operatingModel
    ? selectModuleOperatingContext(operatingModel, "sales")
    : { relatedFlows: [], moduleAssignment: undefined };

  const r = routes.tenant(slug);
  const cybercrowLive = readiness.cybercrowInitialized;
  const salesWarnings: string[] = [];
  if (readiness.opportunitiesWithoutAccount > 0) {
    salesWarnings.push(
      `${readiness.opportunitiesWithoutAccount} opportunity line(s) without CRM account link.`
    );
  }

  const pipelineContent = (
    <section className="cc-glass-card">
      <h3 className="font-display text-sm font-semibold text-cyan-400">
        Pipeline lines ({opportunities.length})
      </h3>
      <p className="mt-1 text-xs text-slate-600">
        Amounts are advisory coordination signals — not recognized revenue or issued invoices.
      </p>
      {opportunities.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          No sales records yet.
          {hasSalesModule && !useMockSales && (
            <>
              {" "}
              Run <code className="text-cyan-400">npm run db:seed:meem:ops</code> for sample data
              on MEEM when the sales module is enabled.
            </>
          )}
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {opportunities.map((row) => (
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
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {KIND_LABEL[row.kind] ?? row.kind}
                  {row.customerName ? ` · ${row.customerName}` : ""}
                  {row.crmAccount ? ` · ${row.crmAccount.name}` : ""}
                </p>
                {row.workflowName && (
                  <p className="mt-1 text-xs text-slate-500">
                    Workflow:{" "}
                    <Link href={r.workflows} className="text-cyan-400 hover:text-cyan-300">
                      {row.workflowName}
                    </Link>
                    {hasLogisticsModule && (
                      <>
                        {" "}
                        ·{" "}
                        <Link href={r.logistics} className="text-teal-400 hover:text-teal-300">
                          Logistics
                        </Link>
                      </>
                    )}
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
  );

  return (
    <TenantModulePage
      engine="CEM"
      title="Sales"
      description={`Commercial and sales readiness for ${tenant.organization.displayName}. Pipeline coordination with CRM and Finance — not live invoicing, payment capture, AI lead scoring, or contract signing.`}
      route="/[tenant]/sales"
      tenantSlug={slug}
    >
      <div className="space-y-8">
        <TenantRuntimeStatStrip
          items={[
            { label: "Readiness", value: readiness.readinessLabel, accent: "cyan" },
            { label: "Pipeline lines", value: readiness.opportunityCount },
            {
              label: "Pipeline SAR",
              value: hasSalesModule || useMockSales ? formatSar(summary.pipelineSar) : "—",
              accent: "cyan",
            },
            {
              label: "Won SAR",
              value: hasSalesModule || useMockSales ? formatSar(summary.wonSar) : "—",
              accent: "teal",
            },
            { label: "Sales open tasks", value: readiness.salesRelatedOpenTasks },
          ]}
        />

        <CommercialLinkageBanner
          slug={slug}
          variant="sales"
          requestReferenceCode={requestContext.requestReferenceCode}
          requestStatus={requestContext.requestStatus}
          warnings={salesWarnings}
        />

        {hasFinanceModule && <FinanceLinkageBanner slug={slug} variant="sales" />}

        <SalesCommercialReadinessPanel
          slug={slug}
          snapshot={readiness}
          cybercrowLive={cybercrowLive}
        />

        {operatingModel && (
          <TenantModuleOperatingContext
            slug={slug}
            moduleKey="sales"
            moduleAssignment={moduleCtx.moduleAssignment}
            relatedFlows={moduleCtx.relatedFlows}
            cybercrowInitialized={cybercrowLive}
          />
        )}

        <TenantRuntimeCrossLinks slug={slug} current="sales" cybercrowLive={cybercrowLive} />

        {showMeemHub && (
          <>
            <ErpModuleHub
              slug={slug}
              organizationName={tenant.organization.displayName}
              moduleKey="sales"
            />
            <MeemSalesHub
              slug={slug}
              organizationName={tenant.organization.displayName}
              aiExtraKeys={aiExtraKeys}
            />
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Open pipeline"
                value={`${formatSar(summary.pipelineSar)} SAR`}
                entity="cem"
                accent="cyan"
                hint="Quoted & in negotiation"
              />
              <StatCard
                label="Won / fulfilled"
                value={`${formatSar(summary.wonSar)} SAR`}
                entity="cem"
                accent="teal"
              />
              <StatCard label="Freight quotes" value={summary.quotes} entity="cem" accent="cyan" />
              <StatCard
                label="Orders & contracts"
                value={summary.orders}
                entity="cem"
                accent="teal"
                hint={`${summary.total} total lines`}
              />
            </section>
          </>
        )}

        {(hasSalesModule || useMockSales) && pipelineContent}

        <ErpChainLinks tenantSlug={slug} currentModule="sales" tenantModules={tenantModules} />

        <div className="flex flex-wrap gap-3">
          <Link href={r.crm} className="text-sm text-slate-400 hover:text-white">
            CRM →
          </Link>
          <Link href={r.dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
            ← Dashboard
          </Link>
        </div>
      </div>
    </TenantModulePage>
  );
}
