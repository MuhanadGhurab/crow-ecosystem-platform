/**
 * K2.4 — Tenant provisioning wording guards (staging/runtime, not production go-live).
 *
 *   npm run tenant-provisioning-wording:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const PROVISION_SURFACES = [
  "src/lib/constants/tenant-provisioning-wording.ts",
  "src/components/blueprint/blueprint-provision-form.tsx",
  "src/app/blueprints/[blueprintId]/go-live/page.tsx",
  "src/app/blueprints/[blueprintId]/overview/page.tsx",
  "src/app/blueprints/[blueprintId]/readiness/page.tsx",
  "src/app/blueprints/[blueprintId]/layout.tsx",
  "src/components/admin/onboarding-pipeline-context.tsx",
] as const;

const FORBIDDEN_IN_PROVISION = [
  "Approve blueprint & go live",
  "Provision CEM tenant",
  "production ready",
  "activate subscription",
  "activate live payments",
  "automatic tenant provisioning",
  "auto-provision tenant",
  "production go-live approved",
  "tenant is live",
  "pay now",
  "live checkout",
] as const;

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

  console.log("\n=== K2.4 Tenant provisioning wording ===\n");

  const pkg = fileText("package.json");
  check(
    pkg.includes('"tenant-provisioning-wording:verify"'),
    "package.json defines tenant-provisioning-wording:verify",
    "Add npm script"
  );

  const constants = fileText("src/lib/constants/tenant-provisioning-wording.ts");
  check(
    constants.includes("Prepare CEM tenant runtime") &&
      constants.includes("Create staging tenant") &&
      constants.includes("F23-gated") &&
      constants.includes("Go/No-Go"),
    "Constants define safe staging/runtime copy with F23 gate",
    "tenant-provisioning-wording.ts must include title, button, F23/Go-No-Go"
  );

  const form = fileText("src/components/blueprint/blueprint-provision-form.tsx");
  check(
    form.includes("TENANT_PROVISION_BUTTON_LABEL") && form.includes("TENANT_PROVISION_SAFETY_NOTE"),
    "Provision form uses shared wording constants",
    "BlueprintProvisionForm must import tenant-provisioning-wording constants"
  );
  check(
    !form.includes("approveClientProposalScopeAction") &&
      !form.includes("canApproveScope"),
    "Provision form does not weaken client approval rules",
    "Provision form must not import client approval"
  );

  for (const rel of PROVISION_SURFACES) {
    check(existsSync(join(ROOT, rel)), `Surface exists: ${rel}`, `Missing ${rel}`);
    const text = fileText(rel);
    for (const phrase of FORBIDDEN_IN_PROVISION) {
      check(
        !text.includes(phrase),
        `No forbidden phrase in ${rel}: "${phrase}"`,
        `Unsafe phrase "${phrase}" in ${rel}`
      );
    }
  }

  const repoWide = [
    "src/components/blueprint/blueprint-provision-form.tsx",
    "src/app/blueprints/[blueprintId]/go-live/page.tsx",
  ];
  for (const rel of repoWide) {
    const text = fileText(rel);
    check(
      text.includes("staging") || text.includes("runtime preparation") || text.includes("Runtime prep"),
      `${rel} frames staging/runtime preparation`,
      `${rel} must mention staging or runtime preparation`
    );
  }

  const approvalService = fileText("src/lib/services/client-approval.service.ts");
  check(
    approvalService.includes("canApproveScope"),
    "Client approval still uses canApproveScope",
    "Do not weaken client-approval.service"
  );

  console.log(
    passed
      ? "\ntenant-provisioning-wording:verify PASSED\n"
      : "\ntenant-provisioning-wording:verify FAILED\n"
  );
  process.exit(passed ? 0 : 1);
}

main();
