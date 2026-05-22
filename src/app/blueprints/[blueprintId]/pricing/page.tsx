import Link from "next/link";
import { notFound } from "next/navigation";

import { BlueprintProposalPanel } from "@/components/blueprint/commercial/blueprint-proposal-panel";
import { resolveBlueprintPricingEstimate } from "@/lib/blueprint-pricing";
import { getSareaPackageKey } from "@/lib/discovery-answers";
import { SAREA_PACKAGES } from "@/lib/constants/sarea-packages";
import { formatSar } from "@/lib/services/commercial.service";
import { SAUDI_VAT_RATE } from "@/lib/services/pricing.service";
import { planLabel, moduleLabel } from "@/lib/catalog-labels";
import { routes } from "@/lib/routes";
import { getEnterpriseBlueprint } from "@/lib/services/blueprint.service";
import { isUseMockData } from "@/lib/mock/env";

export default async function BlueprintPricingPage({
  params,
}: {
  params: Promise<{ blueprintId: string }>;
}) {
  const { blueprintId } = await params;
  const blueprint = await getEnterpriseBlueprint(blueprintId).catch(() => null);

  if (!blueprint) {
    notFound();
  }

  const estimate = await resolveBlueprintPricingEstimate(blueprint.requestId);
  const estimatedMonthlySar = blueprint.request.estimatedMonthlySar
    ? Number(blueprint.request.estimatedMonthlySar)
    : null;
  const planKey = blueprint.request.requestedPlans[0]?.planKey;
  const b = routes.blueprint(blueprintId);
  const answers = blueprint.request.discoveryProfile?.answers ?? [];
  const selectedSareaKey = getSareaPackageKey(answers);

  const lineRows = [
    { label: "Base plan (CEM)", amount: estimate.baseMonthlySar, entity: "cem" },
    ...(estimate.employeeBandMonthlySar > 0
      ? [{ label: "Employee band scale", amount: estimate.employeeBandMonthlySar, entity: "cem" as const }]
      : []),
    { label: "Modules add-on", amount: estimate.modulesMonthlySar, entity: "cem" },
    { label: "CyberCrow security", amount: estimate.securityMonthlySar, entity: "cybercrow" },
    { label: "SAREA experience", amount: estimate.sareaMonthlySar, entity: "sarea" },
    ...(estimate.aiExtrasMonthlySar > 0
      ? [{ label: "AI extras", amount: estimate.aiExtrasMonthlySar, entity: "sarea" as const }]
      : []),
  ];

  return (
    <div className="space-y-8">
      {isUseMockData() && (
        <p className="rounded-cc-sm border border-amber-500/25 bg-amber-500/10 px-4 py-2 text-sm text-amber-100">
          Demo pricing workspace — <code className="text-xs">USE_MOCK_DATA=true</code> · estimate from mock
          pipeline constants.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-white">Pricing workspace</h2>
          <p className="mt-1 text-sm text-slate-400">
            Full commercial control room for {blueprint.request.organizationName}
            {planKey ? ` · ${planLabel(planKey)}` : ""}
          </p>
        </div>
        <Link href={b.overview} className="cc-btn-secondary text-sm">
          ← Overview
        </Link>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_min(22rem,40%)] xl:items-start">
        <div className="space-y-6">
          <section className="cc-glass-card overflow-hidden">
            <h3 className="text-sm font-medium text-cyan-400">Line items</h3>
            <table className="mt-4 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                  <th className="pb-2 font-medium">Component</th>
                  <th className="pb-2 text-right font-medium">Monthly SAR</th>
                </tr>
              </thead>
              <tbody>
                {lineRows.map((row) => (
                  <tr key={row.label} className={`cc-pricing-line--${row.entity} border-b border-white/5`}>
                    <td className="py-3 text-slate-300">{row.label}</td>
                    <td className="py-3 text-right font-medium tabular-nums text-white">
                      {formatSar(row.amount)}
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-white/5">
                  <td className="pt-4 font-medium text-white">
                    Subtotal (excl. VAT, ×{estimate.complexityMultiplier} complexity)
                  </td>
                  <td className="pt-4 text-right font-medium tabular-nums text-white">
                    {formatSar(estimatedMonthlySar ?? estimate.totalMonthlySar)}
                  </td>
                </tr>
                {estimate.vatRate > 0 && (
                  <>
                    <tr className="border-b border-white/5">
                      <td className="py-3 text-slate-400">
                        VAT ({Math.round((estimate.vatRate ?? SAUDI_VAT_RATE) * 100)}%)
                      </td>
                      <td className="py-3 text-right tabular-nums text-slate-300">
                        {formatSar(estimate.vatAmountSar, 2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="pt-3 font-medium text-teal-200">Total (incl. VAT)</td>
                      <td className="pt-3 text-right font-display text-lg font-semibold tabular-nums text-teal-300">
                        {formatSar(estimate.totalInclVatSar, 2)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </section>

          <section className="cc-glass-card">
            <h3 className="text-sm font-medium text-rose-300">SAREA packages (catalog)</h3>
            <ul className="mt-4 space-y-3">
              {SAREA_PACKAGES.map((pkg) => (
                <li
                  key={pkg.key}
                  className={`rounded-cc-sm border px-3 py-2 text-sm ${
                    pkg.key === (selectedSareaKey ?? "professional")
                      ? "border-rose-500/30 bg-rose-500/10"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <span className="font-medium text-white">{pkg.label}</span>
                  <span className="ml-2 text-rose-300">{formatSar(pkg.monthlySar)}/mo</span>
                  <p className="mt-1 text-xs text-slate-500">{pkg.description}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              Scenario toggles and PDF export are planned — totals recalc via{" "}
              <code className="text-slate-400">pricing.service.ts</code> today.
            </p>
          </section>

          {blueprint.modules.length > 0 && (
            <section className="cc-entity-block cc-entity-block--cem">
              <h3 className="text-sm font-medium text-cyan-400">Blueprint modules</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                {blueprint.modules.map((m) => (
                  <li key={m.id}>{moduleLabel(m.moduleKey)}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="xl:sticky xl:top-24 xl:self-start">
          <BlueprintProposalPanel
            blueprintId={blueprintId}
            proposalStatus={blueprint.proposalStatus}
            proposalToken={blueprint.proposalToken}
            estimatedMonthlySar={estimatedMonthlySar}
            estimateBreakdown={estimate}
          />
        </div>
      </div>
    </div>
  );
}
