/**
 * I7 — Client onboarding tracker MVP.
 *
 *   npm run client-onboarding:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED_FILES = [
  "src/lib/client-portal/client-onboarding-contract.ts",
  "src/lib/client-portal/client-onboarding-steps.ts",
  "src/lib/services/client-onboarding.service.ts",
  "src/components/client-portal/client-onboarding-tracker-panel.tsx",
  "src/app/client/onboarding/page.tsx",
  "src/components/admin/admin-onboarding-readiness-panel.tsx",
  "docs/internal/I7_ONBOARDING_TRACKER_MVP.md",
] as const;

const ONBOARDING_PATHS = [
  "src/lib/services/client-onboarding.service.ts",
  "src/components/client-portal/client-onboarding-tracker-panel.tsx",
  "src/components/client-portal/client-onboarding-dashboard-tile.tsx",
  "src/components/client-portal/client-onboarding-summary-card.tsx",
  "src/app/client/onboarding/page.tsx",
  "src/app/client/page.tsx",
] as const;

const FORBIDDEN_CLAIM_PHRASES = [
  "legally signed",
  "e-signature complete",
  "payment authorized",
  "activate production",
  "production go-live approved",
  "fully compliant",
  "ai-powered onboarding",
  "automatic tenant provisioning",
] as const;

const DANGEROUS_PATTERNS: { label: string; paths: string[]; pattern: RegExp }[] = [
  {
    label: "Onboarding service must not auto-provision tenant",
    paths: ["src/lib/services/client-onboarding.service.ts"],
    pattern: /createTenant|provisionTenant|tenant\.create\(/i,
  },
  {
    label: "Onboarding client UI must not use service role",
    paths: [
      "src/components/client-portal/client-onboarding-tracker-panel.tsx",
      "src/components/client-portal/client-onboarding-dashboard-tile.tsx",
      "src/components/client-portal/client-onboarding-summary-card.tsx",
      "src/app/client/onboarding/page.tsx",
    ],
    pattern: /service_role|SUPABASE_SERVICE_ROLE/,
  },
  {
    label: "Onboarding must not assign platform_admin",
    paths: ["src/lib/services/client-onboarding.service.ts"],
    pattern: /platform_admin|PLATFORM_ADMIN/,
  },
];

function fail(msg: string) {
  console.error(`FAIL: ${msg}`);
  return false;
}

function ok(msg: string) {
  console.log(`OK: ${msg}`);
  return true;
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

  console.log("\n=== I7 Client onboarding tracker ===\n");

  for (const rel of REQUIRED_FILES) {
    check(existsSync(join(ROOT, rel)), `Required file: ${rel}`, `Missing: ${rel}`);
  }

  const service = fileText("src/lib/services/client-onboarding.service.ts");
  check(
    service.includes("buildClientOnboardingTracker"),
    "buildClientOnboardingTracker exported",
    "Missing buildClientOnboardingTracker"
  );
  check(
    service.includes("buildClientOnboardingTrackerForAdmin"),
    "Admin onboarding tracker exported",
    "Missing buildClientOnboardingTrackerForAdmin"
  );
  check(
    service.includes("clientCanAccessRequest"),
    "Uses clientCanAccessRequest for access",
    "Missing clientCanAccessRequest usage"
  );
  check(
    service.includes("CLIENT_ONBOARDING_PRODUCTION_GATED_NOTE"),
    "Production-gated trust note referenced",
    "Missing production-gated note"
  );

  const onboardingPage = fileText("src/app/client/onboarding/page.tsx");
  check(
    onboardingPage.includes("ClientOnboardingTrackerPanel"),
    "/client/onboarding uses tracker panel",
    "Onboarding page missing ClientOnboardingTrackerPanel"
  );
  check(
    onboardingPage.includes("buildClientOnboardingOverview"),
    "Onboarding page uses onboarding service",
    "Onboarding page missing service call"
  );

  const adminPage = fileText("src/app/admin/requests/[requestId]/page.tsx");
  check(
    adminPage.includes("AdminOnboardingReadinessPanel"),
    "Admin request page shows onboarding readiness",
    "Admin page missing AdminOnboardingReadinessPanel"
  );

  const contract = fileText("src/lib/client-portal/client-onboarding-contract.ts");
  check(
    contract.includes("waiting_for_scope_approval"),
    "Advisory status: waiting_for_scope_approval",
    "Missing waiting_for_scope_approval status"
  );
  check(
    contract.includes("tenant_pending"),
    "Advisory status: tenant_pending",
    "Missing tenant_pending status"
  );

  const steps = fileText("src/lib/client-portal/client-onboarding-steps.ts");
  check(
    steps.includes("buildClientOnboardingTrackerSteps"),
    "12-step onboarding model builder",
    "Missing buildClientOnboardingTrackerSteps"
  );

  for (const rel of ONBOARDING_PATHS) {
    const text = fileText(rel);
    for (const phrase of FORBIDDEN_CLAIM_PHRASES) {
      check(
        !text.toLowerCase().includes(phrase.toLowerCase()),
        `No forbidden claim "${phrase}" in ${rel}`,
        `Forbidden phrase "${phrase}" in ${rel}`
      );
    }
  }

  for (const { label, paths, pattern } of DANGEROUS_PATTERNS) {
    for (const rel of paths) {
      if (!existsSync(join(ROOT, rel))) continue;
      const text = fileText(rel);
      check(!pattern.test(text), `${label} (${rel})`, `${label} — matched in ${rel}`);
    }
  }

  console.log(passed ? "\nPASS: I7 client onboarding tracker checks.\n" : "\nFAIL: I7 checks failed.\n");
  process.exit(passed ? 0 : 1);
}

main();
