/**
 * C3.10B — email-only onboarding policy static verifier.
 * Run: npm run c3-email-only-onboarding:verify
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string) {
  console.error(`  ✗ ${msg}`);
}

function main() {
  let passed = true;
  const check = (cond: boolean, passMsg: string, failMsg: string) => {
    if (cond) ok(passMsg);
    else {
      fail(failMsg);
      passed = false;
    }
  };

  console.log("\n=== C3.10B email-only onboarding policy ===\n");

  check(
    existsSync(join(ROOT, "src/lib/account/phone-verification-policy.ts")),
    "phone-verification-policy.ts exists",
    "missing phone-verification-policy.ts"
  );

  const policy = read("src/lib/account/phone-verification-policy.ts");
  check(
    policy.includes("CROW_PHONE_VERIFICATION_REQUIRED"),
    "policy reads CROW_PHONE_VERIFICATION_REQUIRED",
    "policy env key missing"
  );
  check(!policy.includes("process.env.NEXT_PUBLIC_"), "policy is server-side only", "NEXT_PUBLIC leak");
  check(
    policy.includes("return false") && policy.includes("if (!raw)"),
    "default policy defers phone verification",
    "default policy must be false"
  );
  check(
    policy.includes("CROW_PHONE_ONBOARDING_GENERATION"),
    "generation-3 phone threshold wired",
    "generation-3 threshold missing"
  );

  const activation = read("src/lib/account/platform-account-activation.ts");
  check(
    activation.includes("phone-verification-policy"),
    "activation uses canonical policy helper",
    "activation must not scatter env reads"
  );

  const orch = read("src/lib/account/c3-auth-orchestration.ts");
  check(
    orch.includes("isPhoneVerificationRequiredForAccount"),
    "auth gate respects phone policy",
    "auth orchestration missing policy gate"
  );
  check(
    orch.includes("activatePlatformAccountIfReady"),
    "stale phone-pending accounts reconcile when policy off",
    "missing activation reconcile"
  );

  const phoneSvc = read("src/lib/account/phone-verification.service.ts");
  check(
    phoneSvc.includes("isPhoneVerificationRequiredForAccount"),
    "phone OTP issuance guarded by policy",
    "phone service must not issue when policy off"
  );
  check(!phoneSvc.includes("emailVerifiedAt:"), "phone OTP cannot confirm email");

  const emailSvc = read("src/lib/account/email-verification.service.ts");
  check(!emailSvc.includes("phoneVerifiedAt"), "email OTP cannot confirm phone");

  const accountActions = read("src/lib/actions/account.ts");
  check(
    accountActions.includes("isPhoneVerificationRequired()"),
    "phone server actions blocked when policy off",
    "phone actions missing policy guard"
  );

  const verifyPhonePage = read("src/app/onboarding/verify-phone/page.tsx");
  check(
    verifyPhonePage.includes("isPhoneVerificationRequired()"),
    "phone route redirects when policy off",
    "verify-phone page must hide journey step"
  );

  const progress = read("src/components/account/onboarding-progress.tsx");
  check(
    progress.includes("Legal") && progress.includes("Email") && progress.includes("Active"),
    "onboarding progress shows Legal → Email → Active",
    "onboarding progress labels missing"
  );
  check(
    progress.includes("isPhoneVerificationRequired"),
    "progress hides phone step when policy off",
    "progress must use policy helper"
  );

  const bootstrap = read("src/lib/platform/platform-owner-bootstrap.resolution.ts");
  check(
    bootstrap.includes("isPhoneVerificationRequiredForAccount"),
    "platform owner bootstrap respects phone policy",
    "bootstrap must not require phone when policy off"
  );

  const gen = read("src/lib/account/onboarding-generation.ts");
  check(gen.includes("CROW_EMAIL_ONLY_ONBOARDING_GENERATION"), "generation-2 documented");
  check(gen.includes("CROW_PHONE_ONBOARDING_GENERATION"), "generation-3 documented");

  console.log(
    passed
      ? "\nPASS — LEGAL AND EMAIL VERIFICATION ACTIVATE GENERATION-2 ACCOUNTS; PHONE VERIFICATION DEFERRED\n"
      : "\nFAIL — email-only onboarding policy checks failed\n"
  );
  process.exit(passed ? 0 : 1);
}

main();
