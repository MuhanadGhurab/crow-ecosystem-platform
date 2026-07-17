import { readFileSync } from "node:fs";
import { join } from "node:path";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const evidence = readFileSync(
  join(process.cwd(), "scripts/lib/c3-preview-e2e-evidence.ts"),
  "utf8"
);

assert(
  evidence.includes('"mandatory_contractual"') && evidence.includes('"mandatory_notice"'),
  "evidence counts contractual and notice mandatory acceptances"
);
assert(
  !evidence.includes('mandatoryClassification: "mandatory_contractual"'),
  "evidence no longer counts only contractual rows"
);

const legalService = readFileSync(
  join(process.cwd(), "src/lib/legal/legal-document.service.ts"),
  "utf8"
);
assert(
  legalService.includes('"mandatory_notice"'),
  "mandatory resolver includes privacy notice classification"
);

const formAck = readFileSync(
  join(process.cwd(), "src/lib/account/c3-legal-form-acknowledgement.ts"),
  "utf8"
);
assert(formAck.includes("ACCEPTABLE_USE_POLICY"), "AUP acknowledgement validated");
assert(formAck.includes("PRIVACY_NOTICE"), "privacy acknowledgement validated");
assert(formAck.includes("TERMS_OF_SERVICE"), "terms acknowledgement validated");

console.log("c3-preview-e2e-evidence.test.ts: OK");
