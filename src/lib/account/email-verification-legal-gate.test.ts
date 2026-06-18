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

const finalizeIdx = emailVerify.indexOf("async function finalizeActivationIfPending");
const finalizeBody = emailVerify.slice(finalizeIdx);
const legalIdx = finalizeBody.indexOf("hasMandatoryLegalAcceptanceComplete");
const confirmIdx = finalizeBody.indexOf("confirmSupabaseUserEmail");
const activateCallIdx = finalizeBody.indexOf("await activatePlatformAccount");
assert(legalIdx >= 0, "finalize checks legal completeness");
assert(confirmIdx >= 0, "finalize confirms Supabase email via admin");
assert(activateCallIdx >= 0, "finalize calls activatePlatformAccount");
assert(legalIdx < confirmIdx && confirmIdx < activateCallIdx, "legal → confirm → activate order");

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
