import { diffBlueprintDocuments } from "./blueprint-diff.service";
import { buildMeemGlobalReferenceDocument } from "./fixtures/meem-global-reference";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const base = buildMeemGlobalReferenceDocument();
assert(base !== null, "Meem reference document available");

const unchanged = diffBlueprintDocuments(base!, base!);
assert(
  unchanged.every((s) => s.impact === "NONE"),
  "identical documents have NONE impact"
);

const modified = {
  ...base!,
  assumptions: [...base!.assumptions, "Additional scope assumption for diff test"],
};
const changed = diffBlueprintDocuments(base!, modified);
const assumptionsDiff = changed.find((s) => s.sectionKey === "assumptions");
assert(assumptionsDiff !== undefined, "assumptions section diff present");
assert(assumptionsDiff!.impact !== "NONE", "assumption change detected");

console.log("blueprint-studio/diff: OK");
