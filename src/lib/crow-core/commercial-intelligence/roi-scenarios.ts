import type { RoiScenario } from "../commercial";

export const ROI_SCENARIO_MULTIPLIERS: Record<RoiScenario, number> = {
  CONSERVATIVE: 0.75,
  BASE: 1,
  OPTIMISTIC: 1.25,
};

export function scenarioLabel(scenario: RoiScenario): string {
  switch (scenario) {
    case "CONSERVATIVE":
      return "Conservative";
    case "BASE":
      return "Base";
    case "OPTIMISTIC":
      return "Optimistic";
  }
}
