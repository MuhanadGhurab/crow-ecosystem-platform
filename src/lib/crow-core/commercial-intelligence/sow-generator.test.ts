import { SOW_SECTION_KEYS } from "../commercial";
import { generateSowDraft } from "./sow-generator";
import {
  buildMeemGlobalReferenceDocument,
  buildMeemGlobalReferenceRoiModel,
} from "../blueprint-studio/fixtures/meem-global-reference";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const document = buildMeemGlobalReferenceDocument();
assert(document !== null, "Meem reference document available");

const { draft, warnings } = generateSowDraft({
  document: document!,
  roiModel: buildMeemGlobalReferenceRoiModel(),
  organizationName: "Meem Global (reference)",
});

assert(draft.sections.length === SOW_SECTION_KEYS.length, "22 SOW sections");
assert(draft.advisoryDisclaimer.length > 10, "SOW advisory disclaimer");
assert(Array.isArray(warnings), "warnings array returned");

console.log("commercial-intelligence/sow-generator: OK");
