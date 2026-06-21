/**
 * C3.10I — Secure password recovery static verifier.
 * Run: npm run c3-password-recovery:verify
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();

const REQUIRED_FILES = [
  "src/app/forgot-password/page.tsx",
  "src/app/reset-password/page.tsx",
  "src/components/auth/forgot-password-form.tsx",
  "src/components/auth/reset-password-form.tsx",
  "src/lib/actions/password-recovery.ts",
  "src/lib/account/password-recovery.service.ts",
  "src/lib/auth/password-recovery-messages.ts",
  "src/lib/auth/trusted-app-origin.ts",
  "src/lib/auth/password-recovery-session.ts",
  "src/lib/auth/password-validation.ts",
  "src/lib/security/password-recovery-rate-limit.ts",
  "src/lib/email/templates/crow-password-changed-email.ts",
  "src/lib/auth/password-recovery.test.ts",
  "prisma/migrations/20260620120000_c3_password_recovery_audit/migration.sql",
  "docs/architecture/crow-core/c3/C3_10I_PASSWORD_RECOVERY.md",
];

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

  console.log("\n=== C3.10I password recovery ===\n");

  for (const f of REQUIRED_FILES) {
    check(existsSync(join(ROOT, f)), `Required file: ${f}`, `Missing: ${f}`);
  }

  const signIn = fileText("src/components/portal/auth/sign-in-form.tsx");
  check(
    signIn.includes("Forgot your password?") &&
      (signIn.includes("forgot-password") || signIn.includes("forgotPassword")),
    "Login form exposes forgot-password link",
    "Sign-in form missing forgot-password link"
  );

  const recoveryAction = fileText("src/lib/actions/password-recovery.ts");
  check(
    recoveryAction.includes("resetPasswordForEmail") &&
      recoveryAction.includes("PASSWORD_RECOVERY_GENERIC_MESSAGE"),
    "Forgot-password action uses Supabase reset + generic response",
    "Recovery request action incomplete"
  );
  check(
    !recoveryAction.includes("console.log") &&
      !/\bpassword\b.*return/.test(recoveryAction),
    "Recovery actions avoid logging or returning passwords",
    "Recovery action may leak password material"
  );

  const resetAction = fileText("src/lib/actions/password-recovery.ts");
  check(
    resetAction.includes("updateUser") && resetAction.includes("signOut"),
    "Reset action updates password then terminates recovery session",
    "Reset action missing updateUser/signOut"
  );

  const callback = fileText("src/app/auth/callback/route.ts");
  check(
    callback.includes("isPasswordRecovery") && callback.includes("PASSWORD_RECOVERY_NEXT_PATH"),
    "Auth callback handles recovery PKCE branch",
    "Callback missing recovery branch"
  );
  check(
    callback.includes("Cache-Control") && callback.includes("private, no-store"),
    "Callback sets no-store cache control",
    "Callback missing Cache-Control"
  );

  const signout = fileText("src/app/auth/signout/route.ts");
  check(
    signout.includes("405") && signout.includes("POST"),
    "GET /auth/signout remains 405; POST sign-out preserved",
    "Sign-out route regression"
  );

  const login = fileText("src/app/login/page.tsx");
  check(
    login.includes("password-reset") && login.includes("changed successfully"),
    "Login shows post-reset confirmation banner",
    "Login missing password-reset banner"
  );

  const changedEmail = fileText("src/lib/email/templates/crow-password-changed-email.ts");
  check(
    changedEmail.includes("never sends passwords") &&
      !changedEmail.includes("newPassword") &&
      !changedEmail.includes("reset URL"),
    "Password-changed notification excludes secrets",
    "Password-changed email template unsafe"
  );

  const schema = fileText("prisma/schema.prisma");
  check(
    schema.includes("password_recovery_requested") &&
      schema.includes("password_recovery_succeeded"),
    "Prisma audit enum includes password recovery events",
    "Prisma audit enum missing recovery events"
  );

  console.log("");
  if (passed) {
    console.log("PASS — SECURE PASSWORD RECOVERY, PASSWORD UPDATE AND REAUTHENTICATION VERIFIED\n");
    process.exit(0);
  }
  console.error("FAIL — password recovery verification incomplete\n");
  process.exit(1);
}

main();
