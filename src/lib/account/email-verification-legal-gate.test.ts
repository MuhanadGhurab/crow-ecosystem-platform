import { readFileSync } from "fs";
import { join } from "path";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const emailVerify = readFileSync(
  join(process.cwd(), "src/lib/account/email-verification.service.ts"),
  "utf8"
);
const platformSvc = readFileSync(
  join(process.cwd(), "src/lib/account/platform-account.service.ts"),
  "utf8"
);

const legalIdx = emailVerify.indexOf("const legalComplete = await hasMandatoryLegalAcceptanceComplete");
const activateCallIdx = emailVerify.indexOf("await activatePlatformAccount(account.id)");
assert(legalIdx >= 0, "email verification imports legal completeness check");
assert(activateCallIdx >= 0, "email verification calls activatePlatformAccount");
assert(legalIdx < activateCallIdx, "legal check runs before activation");

assert(
  emailVerify.includes('"legal_incomplete"'),
  "email verification returns legal_incomplete reason"
);

const platformLegalIdx = platformSvc.indexOf("hasMandatoryLegalAcceptanceComplete");
const platformActivateIdx = platformSvc.indexOf("export async function activatePlatformAccount");
assert(platformLegalIdx >= 0, "platform service checks legal completeness");
assert(platformActivateIdx >= 0, "activatePlatformAccount exists");
assert(
  platformLegalIdx < platformSvc.indexOf("status: \"ACTIVE\"", platformActivateIdx),
  "activatePlatformAccount blocks without legal evidence"
);

console.log("email-verification-legal-gate.test.ts: OK");
