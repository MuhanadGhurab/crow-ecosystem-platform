/**
 * C3.3 — Verify branch-scoped Preview environment variable presence (names only).
 * Run: npm run c3-preview-env:verify
 */
import { spawnSync } from "node:child_process";

const BRANCH = "feat/c3-account-registration-email-verification";

const BRANCH_REQUIRED = [
  "ACCOUNT_REGISTRATION_ENABLED",
  "APP_ENVIRONMENT",
  "DATABASE_ENVIRONMENT",
  "EMAIL_PROVIDER",
  "RESEND_API_KEY",
  "EXPECTED_DATABASE_FINGERPRINT",
  "EMAIL_VERIFICATION_CODE_SECRET",
];

const PREVIEW_REQUIRED = [
  "AUTH_DISABLED",
  "USE_MOCK_DATA",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "DIRECT_URL",
  "NEXT_PUBLIC_SITE_URL",
];

const FROM_ONE_OF = ["C3_VERIFICATION_FROM_EMAIL", "NOTIFICATION_FROM_EMAIL"];

function listEnv(target: string): string {
  const result = spawnSync("npx", ["vercel", "env", "ls", ...target.split(" ")], {
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  return `${result.stdout ?? ""}${result.stderr ?? ""}`;
}

function main() {
  const branchOutput = listEnv(`preview ${BRANCH}`);
  const previewOutput = listEnv("preview");
  const combined = `${branchOutput}\n${previewOutput}`;

  if (!branchOutput.includes(BRANCH)) {
    console.error("\n✗ Could not list Vercel Preview env for branch:", BRANCH);
    process.exit(1);
  }

  console.log(`\n=== C3 Preview env (${BRANCH}) ===\n`);
  console.log("Branch-scoped:");
  let passed = true;
  for (const name of BRANCH_REQUIRED) {
    const present = branchOutput.includes(name);
    console.log(`  ${present ? "✓" : "✗"} ${name}`);
    if (!present) passed = false;
  }

  console.log("\nInherited Preview:");
  for (const name of PREVIEW_REQUIRED) {
    const present = previewOutput.includes(name);
    console.log(`  ${present ? "✓" : "✗"} ${name}`);
    if (!present) passed = false;
  }

  const fromPresent = FROM_ONE_OF.some((name) => combined.includes(name));
  console.log(`\n  ${fromPresent ? "✓" : "✗"} ${FROM_ONE_OF.join(" | ")} (one required)`);
  if (!fromPresent) passed = false;

  console.log(
    passed ? "\nc3-preview-env:verify PASSED\n" : "\nc3-preview-env:verify FAILED\n"
  );
  process.exit(passed ? 0 : 1);
}

main();
