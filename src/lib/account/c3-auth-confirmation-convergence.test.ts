import { readFileSync } from "fs";
import { join } from "path";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const auth = readFileSync(join(process.cwd(), "src/lib/actions/auth.ts"), "utf8");
const accountLegal = readFileSync(join(process.cwd(), "src/lib/actions/account-legal.ts"), "utf8");
const account = readFileSync(join(process.cwd(), "src/lib/actions/account.ts"), "utf8");
const emailVerify = readFileSync(
  join(process.cwd(), "src/lib/account/email-verification.service.ts"),
  "utf8"
);
const provisioning = readFileSync(
  join(process.cwd(), "src/lib/account/c3-registration-provisioning.service.ts"),
  "utf8"
);

const c3Branch = auth.indexOf("if (isC3AuthEnabled())");
const signUpCall = auth.indexOf("supabase.auth.signUp");
assert(c3Branch >= 0 && signUpCall > c3Branch, "C3 path avoids client signUp");

const completeFnIdx = accountLegal.indexOf(
  "async function completeRegistrationWithLegalAcceptanceInternal"
);
const completeBody = accountLegal.slice(completeFnIdx);
assert(
  completeBody.indexOf("recordLegalAcceptances") <
    completeBody.indexOf("issueEmailVerificationCode"),
  "legal acceptance precedes OTP issuance"
);
assert(
  accountLegal.includes("provisionUnconfirmedAuthUser") ||
    accountLegal.includes("getSessionUser"),
  "registration orchestration supports admin and OAuth paths"
);

assert(
  provisioning.includes("email_confirm: false"),
  "new auth users start unconfirmed"
);
assert(
  provisioning.includes("compensateOrphanAuthUser"),
  "compensation helper exists"
);

const finalizeIdx = emailVerify.indexOf("async function finalizeActivationIfPending");
const finalizeBody = emailVerify.slice(finalizeIdx);
const confirmIdx = finalizeBody.indexOf("confirmSupabaseUserEmail");
const activateIdx = finalizeBody.indexOf("await activatePlatformAccount");
assert(confirmIdx >= 0 && activateIdx > confirmIdx, "Supabase confirm precedes activation");

assert(
  account.includes("loginAfterVerificationPath") || account.includes('verified: "1"'),
  "explicit sign-in after OTP"
);
assert(!account.includes("runDeferredClientOnboarding"), "no auto session after verify");

assert(
  emailVerify.includes('return { ok: true, activated: false }'),
  "already-active account returns safe continue state"
);

console.log("c3-auth-confirmation-convergence.test.ts: OK");
