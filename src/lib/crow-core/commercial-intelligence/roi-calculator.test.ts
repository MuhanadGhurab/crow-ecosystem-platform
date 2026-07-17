import { calculateRoi } from "./roi-calculator";
import { buildMeemGlobalReferenceRoiModel } from "../blueprint-studio/fixtures/meem-global-reference";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const model = buildMeemGlobalReferenceRoiModel();
const result = calculateRoi({ model });

assert(result.calculations.length === 3, "three ROI scenarios");
assert(result.confidence !== undefined, "confidence present");
assert(result.advisoryFooter.length > 20, "advisory footer attached");

for (const calc of result.calculations) {
  assert(calc.scenario === "CONSERVATIVE" || calc.scenario === "BASE" || calc.scenario === "OPTIMISTIC", "valid scenario");
  assert(typeof calc.netAnnualBenefitSar === "number", "net benefit numeric");
}

console.log("commercial-intelligence/roi-calculator: OK");
