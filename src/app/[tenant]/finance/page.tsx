import Link from "next/link";
import { notFound } from "next/navigation";
import { ErpChainLinks } from "@/components/tenant/erp-chain-links";
import { ErpModuleHub } from "@/components/tenant/erp-module-hub";
import { FinanceOperationsReadinessPanel } from "@/components/tenant/finance/finance-operations-readiness-panel";
import { MeemFinanceHub } from "@/components/tenant/meem-finance-hub";
import { TenantModulePage } from "@/components/tenant/tenant-module-page";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantRuntimeStatStrip } from "@/components/tenant/tenant-runtime-stat-strip";
import { StatCard } from "@/components/ui/stat-card";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { LOGISTICS_FINANCE_SAMPLES } from "@/lib/erp/industry-packs/logistics";
import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { resolveMeemHubAiKeys, showMeemErpHub } from "@/lib/meem/meem-hub-utils";
import { isUseMockData } from "@/lib/mock/env";
import { routes } from "@/lib/routes";
import { getFinanceOperationsReadinessSnapshot } from "@/lib/services/finance-readiness.service";
import { getFinanceSummary, listFinanceEntries } from "@/lib/services/finance.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";
import {
  buildCemOperatingModelSnapshotForTenantSlug,
  selectModuleOperatingContext,
} from "@/lib/services/cem-operating-model.service";
import { TenantModuleOperatingContext } from "@/components/tenant/tenant-module-operating-context";
import { TenantCemModuleDepthSection } from "@/components/tenant/tenant-cem-module-depth-section";
import { buildCemModuleDepthSnapshotForTenantSlug } from "@/lib/services/cem-module-depth.service";

const STATUS_CLASS: Record<string, string> = {
  open: "bg-amber-500/15 text-amber-300",
  posted: "bg-cyan-500/15 text-cyan-300",
  cleared: "bg-teal-500/15 text-teal-300",
  paid: "bg-teal-500/15 text-teal-300",
};

const ENTRY_LABEL: Record<string, string> = {
  invoice: "Invoice",
  payment: "Payment",
};

const DIRECTION_LABEL: Record<string, string> = {
  ar: "Accounts receivable",
  ap: "Accounts payable",
};

function formatSar(amount: number) {
  return new Intl.NumberFormat("en-SA", { maximumFractionDigits: 0 }).format(amount);
}

export default async function FinancePage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const tenantModules = tenant.modules ?? [];
  const enabledModuleKeys = tenantModules.filter((m) => m.enabled).map((m) => m.moduleKey);
  const hasFinanceModule = hasErpModule(tenantModules, "finance");
  const hasLogisticsModule = hasErpModule(tenantModules, "logistics");
  const showFinanceHub = showMeemErpHub(
    slug,
    tenant.organization.industry,
    tenantModules,
    "finance"
  );
  const useMockFinance = isUseMockData() && slug === MEEM_TENANT_SLUG;

  const answers = tenant.blueprint?.request?.discoveryProfile?.answers ?? [];
  const aiExtraKeys = showFinanceHub ? resolveMeemHubAiKeys(answers, "finance") : [];

  const [entries, summary, readiness, operatingModel, moduleDepth] = await Promise.all([
    useMockFinance
      ? Promise.resolve(
          LOGISTICS_FINANCE_SAMPLES.map((s, i) => ({
            id: `mock-fin-${i}`,
            tenantId: tenant.id,
            referenceCode: s.referenceCode,
            title: s.title,
            entryType: s.entryType,
            direction: s.direction,
            status: s.status,
            amountSar: s.amountSar,
            customerName: s.customerName,
            linkedReference: s.linkedReference,
            createdAt: new Date(),
            updatedAt: new Date(),
          }))
        )
      : hasFinanceModule
        ? listFinanceEntries(tenant.id)
        : Promise.resolve([]),
    useMockFinance
      ? Promise.resolve({
          total: LOGISTICS_FINANCE_SAMPLES.length,
          arOpenSar: LOGISTICS_FINANCE_SAMPLES.filter(
            (s) => s.direction === "ar" && s.status === "open"
          ).reduce((n, s) => n + s.amountSar, 0),
          arPostedSar: LOGISTICS_FINANCE_SAMPLES.filter(
            (s) => s.direction === "ar" && s.status === "posted"
          ).reduce((n, s) => n + s.amountSar, 0),
          apOpenSar: LOGISTICS_FINANCE_SAMPLES.filter(
            (s) => s.direction === "ap" && s.status === "open"
          ).reduce((n, s) => n + s.amountSar, 0),
          paymentsClearedSar: LOGISTICS_FINANCE_SAMPLES.filter(
            (s) => s.entryType === "payment" && s.status === "cleared"
          ).reduce((n, s) => n + s.amountSar, 0),
        })
      : hasFinanceModule
        ? getFinanceSummary(tenant.id)
        : Promise.resolve({
            total: 0,
            arOpenSar: 0,
            arPostedSar: 0,
            apOpenSar: 0,
            paymentsClearedSar: 0,
          }),
    getFinanceOperationsReadinessSnapshot(
      tenant.id,
      enabledModuleKeys,
      tenant.organization.industry
    ),
    buildCemOperatingModelSnapshotForTenantSlug(slug),
    buildCemModuleDepthSnapshotForTenantSlug(slug, "finance"),
  ]);

  const r = routes.tenant(slug);
  const cybercrowLive = readiness.cybercrowInitialized;
  const moduleCtx = operatingModel
    ? selectModuleOperatingContext(operatingModel, "finance")
    : { relatedFlows: [], moduleAssignment: undefined };

  return (
    <TenantModulePage
      engine="CEM"
      title="Finance"
      description={`Financial operations readiness for ${tenant.organization.displayName}. Billing coordination, expense visibility, and approval trails — not live payments, tax calculation, or a full accounting platform.`}
      route="/[tenant]/finance"
      tenantSlug={slug}
    >
      <div className="space-y-8">
        <TenantRuntimeStatStrip
          items={[
            { label: "Readiness", value: readiness.readinessLabel, accent: "amber" },
            { label: "Ledger lines", value: readiness.financeEntryCount },
            { label: "Open AR", value: hasFinanceModule ? formatSar(readiness.arOpenSar) : "—" },
            { label: "Open AP", value: hasFinanceModule ? formatSar(readiness.apOpenSar) : "—" },
            {
              label: "Sales pipeline",
              value: readiness.salesEnabled ? formatSar(readiness.salesPipelineSar) : "—",
              accent: "cyan",
            },
            {
              label: "PR value",
              value: readiness.procurementEnabled
                ? formatSar(readiness.procurementAmountSar)
                : "—",
            },
          ]}
        />

        <FinanceOperationsReadinessPanel
          slug={slug}
          snapshot={readiness}
          cybercrowLive={cybercrowLive}
        />

        {operatingModel && (
          <TenantModuleOperatingContext
            slug={slug}
            moduleKey="finance"
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

        {showFinanceHub && (
          <>
            <ErpModuleHub
              slug={slug}
              organizationName={tenant.organization.displayName}
              moduleKey="finance"
            />
            <MeemFinanceHub
              slug={slug}
              organizationName={tenant.organization.displayName}
              aiExtraKeys={aiExtraKeys}
            />
          </>
        )}

        {hasFinanceModule && (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="AR open"
                value={`${formatSar(summary.arOpenSar)} SAR`}
                entity="cem"
                accent="amber"
                hint="Outstanding receivables (coordination)"
              />
              <StatCard
                label="AR posted"
                value={`${formatSar(summary.arPostedSar)} SAR`}
                entity="cem"
                accent="cyan"
              />
              <StatCard
                label="AP open"
                value={`${formatSar(summary.apOpenSar)} SAR`}
                entity="cem"
                accent="amber"
              />
              <StatCard
                label="Payments cleared"
                value={`${formatSar(summary.paymentsClearedSar)} SAR`}
                entity="cem"
                accent="teal"
                hint={`${summary.total} ledger lines`}
              />
            </section>

            <section className="cc-glass-card">
              <h3 className="font-display text-sm font-semibold text-cyan-400">
                Ledger ({entries.length})
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Operator-managed ledger lines for coordination — not legal invoices or bank
                reconciliation.
              </p>
              {entries.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  No finance records yet. Enable sales/procurement linkage or run tenant ops seed for
                  sample freight billing rows where applicable.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {entries.map((row) => (
                    <li
                      key={row.id}
                      className="flex flex-wrap items-start justify-between gap-4 rounded-cc border border-cyan-500/10 bg-white/5 p-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-white">{row.title}</p>
                          {row.referenceCode && (
                            <span className="font-mono text-xs text-slate-500">
                              {row.referenceCode}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {ENTRY_LABEL[row.entryType] ?? row.entryType}
                          {" · "}
                          {DIRECTION_LABEL[row.direction] ?? row.direction}
                          {row.customerName ? ` · ${row.customerName}` : ""}
                        </p>
                        {row.linkedReference && (
                          <p className="mt-1 text-xs text-slate-500">
                            Linked:{" "}
                            <Link href={r.sales} className="text-cyan-400 hover:text-cyan-300">
                              {row.linkedReference}
                            </Link>
                            {hasLogisticsModule && (
                              <>
                                {" "}
                                ·{" "}
                                <Link
                                  href={r.logistics}
                                  className="text-teal-400 hover:text-teal-300"
                                >
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

            <ErpChainLinks
              tenantSlug={slug}
              currentModule="finance"
              tenantModules={tenantModules}
            />
          </>
        )}

        <TenantRuntimeCrossLinks slug={slug} current="finance" cybercrowLive={cybercrowLive} />
      </div>
    </TenantModulePage>
  );
}
