import type { RoiAssumption, RoiCalculation, RoiConfidence, RoiModel, RoiResult } from "../commercial";
import { COMMERCIAL_ADVISORY_FOOTER } from "./advisory-labels";
import { ROI_SCENARIO_MULTIPLIERS } from "./roi-scenarios";

export type RoiCalculatorInput = {
  model: RoiModel;
  scenarios?: ("CONSERVATIVE" | "BASE" | "OPTIMISTIC")[];
};

function sumApprovedAssumptions(assumptions: readonly RoiAssumption[], keys: string[]): number {
  return assumptions
    .filter((a) => keys.includes(a.key) && a.approvalStatus !== "rejected")
    .reduce((sum, a) => sum + a.value, 0);
}

export function calculateRoi(input: RoiCalculatorInput): RoiResult {
  const { model } = input;
  const scenarios = input.scenarios ?? ["CONSERVATIVE", "BASE", "OPTIMISTIC"];

  const benefitKeys = [
    "manual_process_cost",
    "duplicate_work",
    "processing_delays",
    "productivity_gains",
  ];
  const costKeys = ["error_correction", "compliance_effort", "user_administration"];

  const baseBenefit = sumApprovedAssumptions(model.assumptions, benefitKeys);
  const baseCost = sumApprovedAssumptions(model.assumptions, costKeys);
  const implementation =
    model.implementationCostEstimate ?? sumApprovedAssumptions(model.assumptions, ["implementation"]);
  const subscription =
    model.subscriptionAnnualEstimate ??
    sumApprovedAssumptions(model.assumptions, ["subscription_annual"]);

  const calculations: RoiCalculation[] = scenarios.map((scenario) => {
    const mult = ROI_SCENARIO_MULTIPLIERS[scenario];
    const annualBenefitSar = Math.round(baseBenefit * mult);
    const annualCostSar = Math.round((baseCost + subscription) * mult);
    const netAnnualBenefitSar = annualBenefitSar - annualCostSar;
    const paybackMonths =
      netAnnualBenefitSar > 0 && implementation > 0
        ? Math.ceil((implementation / netAnnualBenefitSar) * 12)
        : null;
    const threeYearRoiPercent =
      implementation > 0
        ? Math.round(((netAnnualBenefitSar * 3 - implementation) / implementation) * 100)
        : null;

    return {
      scenario,
      annualBenefitSar,
      annualCostSar,
      netAnnualBenefitSar,
      paybackMonths,
      threeYearRoiPercent,
      assumptionIds: model.assumptions.map((a) => a.key),
      formulaInputs: {
        baseBenefit,
        baseCost,
        implementation,
        subscription,
        multiplier: mult,
      },
    };
  });

  const unapproved = model.assumptions.filter((a) => a.approvalStatus === "draft");
  const confidence: RoiConfidence =
    unapproved.length === 0 ? "HIGH" : unapproved.length <= 2 ? "MEDIUM" : "LOW";

  return {
    model,
    calculations,
    confidence,
    evidenceSources: model.assumptions.map((a) => ({
      id: a.key,
      label: a.label,
      sourceType: "assumption" as const,
      referenceId: a.key,
    })),
    advisoryFooter: COMMERCIAL_ADVISORY_FOOTER,
  };
}
