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
const activationSvc = readFileSync(
  join(process.cwd(), "src/lib/account/platform-account-activation.ts"),
  "utf8"
);

const finalizeIdx = emailVerify.indexOf("async function finalizeActivationIfPending");
const finalizeBody = emailVerify.slice(finalizeIdx);
const legalIdx = finalizeBody.indexOf("hasMandatoryLegalAcceptanceComplete");
const confirmIdx = finalizeBody.indexOf("confirmSupabaseUserEmail");
const recordEmailIdx = finalizeBody.indexOf("recordEmailVerificationEvidence");
assert(legalIdx >= 0, "finalize checks legal completeness");
assert(confirmIdx >= 0, "finalize confirms Supabase email via admin");
assert(recordEmailIdx >= 0, "finalize records email verification evidence");
assert(legalIdx < confirmIdx && confirmIdx < recordEmailIdx, "legal → confirm → record order");

assert(
  emailVerify.includes('"legal_incomplete"'),
  "email verification returns legal_incomplete reason"
);

assert(
  platformSvc.includes("activatePlatformAccountIfReady"),
  "platform service exposes activatePlatformAccountIfReady"
);
assert(
  activationSvc.includes("canActivatePlatformAccount"),
  "activation checks legal + email + phone readiness"
);

console.log("email-verification-legal-gate.test.ts: OK");
