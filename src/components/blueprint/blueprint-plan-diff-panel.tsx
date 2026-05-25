import { PLAN_DISPLAY_NAMES } from "@/lib/subscription/plan-capabilities";
import type { BlueprintPlanDiff, PlanDiffAdvisoryLabel } from "@/lib/services/blueprint-plan-diff.service";

function advisoryUiLabel(
  hint: PlanDiffAdvisoryLabel,
  currentPlanDisplayName: string
): string {
  switch (hint) {
    case "included":
      return `Available in ${currentPlanDisplayName}`;
    case "growth":
      return "Recommended in Crow Growth";
    case "enterprise":
      return "Enterprise capability";
  }
}

export function BlueprintPlanDiffPanel({ diff }: { diff: BlueprintPlanDiff }) {
  return (
    <section className="cc-glass-card space-y-5 !p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Plan comparison (advisory)
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Comparing <span className="text-cyan-200">{diff.currentPlanDisplayName}</span> vs Crow
          Growth vs Crow Enterprise for sector{" "}
          <span className="font-mono text-cyan-300">{diff.sectorTemplateKey}</span> — does not block
          go-live.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
              <th className="py-2 pr-4">Dimension</th>
              <th className="py-2 pr-4">{diff.currentPlanDisplayName}</th>
              <th className="py-2 pr-4">{PLAN_DISPLAY_NAMES.growth}</th>
              <th className="py-2 pr-4">{PLAN_DISPLAY_NAMES.enterprise}</th>
              <th className="py-2">Advisory</th>
            </tr>
          </thead>
          <tbody>
            {diff.dimensions.map((row) => (
              <tr key={row.key} className="border-b border-white/5">
                <td className="py-3 pr-4 text-slate-300">{row.label}</td>
                <td className="py-3 pr-4 font-medium text-white">{row.current}</td>
                <td className="py-3 pr-4 text-slate-400">{row.growth}</td>
                <td className="py-3 pr-4 text-slate-400">{row.enterprise}</td>
                <td className="py-3 text-xs text-amber-300/90">
                  {advisoryUiLabel(row.advisoryForCurrent, diff.currentPlanDisplayName)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {diff.roleSamples.map((sample) => (
          <div
            key={sample.tier}
            className={`rounded-cc-sm border px-3 py-3 ${
              sample.tier === diff.currentPlanKey
                ? "border-cyan-500/25 bg-cyan-500/5"
                : "border-white/10"
            }`}
          >
            <p className="text-xs font-medium text-slate-500">{sample.tierLabel}</p>
            <p className="mt-1 text-lg font-semibold text-white">{sample.positionCount} roles</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-400">
              {sample.sampleTitles.map((title) => (
                <li key={title}>{title}</li>
              ))}
              {sample.positionCount > sample.sampleTitles.length && (
                <li className="text-slate-600">
                  +{sample.positionCount - sample.sampleTitles.length} more
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        Depth trims use sector org-intelligence templates — advisory bands only. Proceed with your
        selected plan when operational readiness is complete.
      </p>
    </section>
  );
}
