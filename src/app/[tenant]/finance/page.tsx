import Link from "next/link";
import { notFound } from "next/navigation";
import { ErpChainLinks } from "@/components/tenant/erp-chain-links";
import { ErpModuleHub } from "@/components/tenant/erp-module-hub";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { isUseMockData } from "@/lib/mock/env";
import { MEEM_TENANT_SLUG } from "@/lib/mock/meem-global";
import { LOGISTICS_FINANCE_SAMPLES } from "@/lib/erp/industry-packs/logistics";
import { routes } from "@/lib/routes";
import { getFinanceSummary, listFinanceEntries } from "@/lib/services/finance.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

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

function isLogisticsIndustry(industry: string | null | undefined): boolean {
  return industry === "logistics" || industry === "logistics_fulfillment";
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
  const showLogisticsHub = isLogisticsIndustry(tenant.organization.industry);
  const useMockFinance = isUseMockData() && slug === MEEM_TENANT_SLUG;
  const hasFinanceModule = hasErpModule(tenantModules, "finance");

  const [entries, summary] = useMockFinance
    ? [
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
        })),
        {
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
        },
      ]
    : await Promise.all([
        listFinanceEntries(tenant.id),
        getFinanceSummary(tenant.id),
      ]);

  const r = routes.tenant(slug);

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CEM · Finance"
        entity="cem"
        title="Finance"
        description={
          showLogisticsHub
            ? `AR/AP, freight billing, and payments for ${tenant.organization.displayName}.`
            : `General ledger, AP/AR, and financial reporting for ${tenant.organization.displayName}.`
        }
      />

      {showLogisticsHub && (
        <ErpModuleHub
          slug={slug}
          organizationName={tenant.organization.displayName}
          moduleKey="finance"
        />
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="AR open"
          value={`${formatSar(summary.arOpenSar)} SAR`}
          entity="cem"
          accent="amber"
          hint="Outstanding receivables"
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
        {entries.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No finance records yet.
            {hasFinanceModule && (
              <>
                {" "}
                Run <code className="text-cyan-400">npm run db:seed:meem:ops</code> (or tenant
                ops seed) for sample freight billing rows.
              </>
            )}
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
                      <span className="font-mono text-xs text-slate-500">{row.referenceCode}</span>
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
