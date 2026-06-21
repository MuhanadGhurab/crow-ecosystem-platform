/**
 * C3.6 — Auth confirmation convergence static verifier.
 * Run: npm run c3-auth-convergence:verify
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string) {
  console.error(`  ✗ ${msg}`);
}

function fileText(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
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

  console.log("\n=== C3 auth confirmation convergence ===\n");

  const required = [
    "src/lib/supabase/admin.ts",
    "src/lib/account/supabase-email-confirmation.service.ts",
    "src/lib/account/c3-registration-provisioning.service.ts",
    "src/lib/security/c3-registration-rate-limit.ts",
    "src/lib/security/c3-registration-origin-guard.ts",
    "scripts/verify-c3-auth-confirmation-convergence.ts",
    "docs/architecture/crow-core/c3/C3_AUTH_CONFIRMATION_CONVERGENCE.md",
    "src/lib/supabase/admin.server-boundary.test.ts",
    "src/lib/account/c3-auth-confirmation-convergence.test.ts",
  ];
  for (const f of required) {
    check(existsSync(join(ROOT, f)), `Required file: ${f}`, `Missing: ${f}`);
  }

  const admin = fileText("src/lib/supabase/admin.ts");
  check(admin.includes('import "server-only"'), "Admin client is server-only", "admin.ts must import server-only");
  check(
    admin.includes("SUPABASE_SERVICE_ROLE_KEY") && !admin.includes("NEXT_PUBLIC_"),
    "Service role is server env only",
    "admin.ts must not expose NEXT_PUBLIC service role"
  );

  const auth = fileText("src/lib/actions/auth.ts");
  const c3RedirectIdx = auth.indexOf("isC3AuthEnabled()");
  const signUpCallIdx = auth.indexOf("supabase.auth.signUp");
  check(
    c3RedirectIdx >= 0 && signUpCallIdx > c3RedirectIdx,
    "C3 signup redirects to legal before client signUp",
    "auth.ts must not call supabase.auth.signUp for C3 registration"
  );

  const accountLegal = fileText("src/lib/actions/account-legal.ts");
  check(
    accountLegal.includes("provisionUnconfirmedAuthUser"),
    "completeRegistrationWithLegalAcceptance provisions via admin",
    "account-legal must call provisionUnconfirmedAuthUser"
  );
  check(
    !accountLegal.includes("requireAuth(routes.account.registerLegal)"),
    "Legal completion does not require session for email/password path",
    "account-legal must not require auth for new registrations"
  );
  check(
    accountLegal.includes("compensateOrphanAuthUser"),
    "Registration failure compensation wired",
    "account-legal must call compensateOrphanAuthUser on failure"
  );

  const provisioning = fileText("src/lib/account/c3-registration-provisioning.service.ts");
  check(
    provisioning.includes("email_confirm: false"),
    "Admin createUser leaves email unconfirmed",
    "provisioning must set email_confirm: false"
  );
  check(
    provisioning.includes("C3_GENERIC_REGISTRATION_MESSAGE"),
    "Generic duplicate-email response defined",
    "provisioning must define generic registration message"
  );

  const emailVerify = fileText("src/lib/account/email-verification.service.ts");
  check(
    emailVerify.includes("confirmSupabaseUserEmail"),
    "Crow OTP path confirms Supabase email via admin",
    "email-verification must call confirmSupabaseUserEmail"
  );
  check(
    emailVerify.includes("isSupabaseUserEmailConfirmed"),
    "Idempotent activation checks Supabase confirmation",
    "email-verification must support idempotent completion"
  );

  const accountActions = fileText("src/lib/actions/account.ts");
  check(
    !accountActions.includes("requireAuth(routes.account.verifyEmail)"),
    "OTP verify works without session",
    "account.ts verify must not require session"
  );
  check(
    accountActions.includes("loginAfterVerificationPath") ||
      accountActions.includes('verified: "1"'),
    "Post-OTP redirect requires explicit sign-in",
    "account.ts must redirect to login after verification"
  );

  const flags = fileText("src/lib/account/feature-flags.ts");
  check(
    flags.includes('=== "true"'),
    "Registration remains opt-in via ACCOUNT_REGISTRATION_ENABLED",
    "feature flag must default off"
  );

  const pkg = fileText("package.json");
  check(
    pkg.includes('"c3-auth-convergence:verify"'),
    "package.json defines c3-auth-convergence:verify",
    "Add c3-auth-convergence:verify script"
  );

  check(
    !fileText("src/lib/actions/account.ts").includes("supabase.auth.signUp"),
    "Account actions do not use client signUp",
    "No client signUp in account actions"
  );

  const membership = fileText("src/lib/services/membership.service.ts");
  check(
    membership.includes("getSupabaseAdminClient"),
    "Membership service uses canonical admin client",
    "membership.service must import getSupabaseAdminClient"
  );

  const login = fileText("src/app/login/page.tsx");
  check(
    login.includes("verified") && login.includes("Email verified"),
    "Login page shows post-verification guidance",
    "login page must handle verified=1"
  );

  console.log(passed ? "\nc3-auth-convergence:verify PASSED\n" : "\nc3-auth-convergence:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
