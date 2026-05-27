/**
 * I9 — Client organization membership & linkage verifier.
 *
 * Run:
 *   npm run client-org:verify
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED_FILES = [
  "src/lib/client-portal/client-organization-contract.ts",
  "src/lib/services/client-organization-link.service.ts",
  "src/lib/services/client-request-link.service.ts",
  "src/lib/services/client-approval.service.ts",
  "src/app/client/company/page.tsx",
  "src/app/client/settings/page.tsx",
] as const;

const FORBIDDEN_CLAIM_PHRASES = [
  "legally signed",
  "e-signature complete",
  "payment authorized",
  "activate tenant",
  "production go-live approved",
  "fully compliant",
  "ai-powered approval",
  "live payments",
  "automatic tenant provisioning",
  "certified compliant",
] as const;

const DANGEROUS_PATTERNS: { label: string; paths: string[]; pattern: RegExp }[] = [
  {
    label: "Public token approval wiring must not import token approval logic",
    paths: ["src/app/proposal/[token]/page.tsx"],
    pattern: /ProposalClientActions|approveProposalByToken/,
  },
  {
    label: "Client-facing code must not use service role",
    paths: ["src/app/client", "src/components/client-portal"],
    pattern: /service_role|SUPABASE_SERVICE_ROLE/,
  },
  {
    label: "Client code must not assign platform admin",
    paths: ["src/app/client"],
    pattern: /platform_admin|PLATFORM_ADMIN/,
  },
  {
    label: "Client approval must not auto-provision tenant",
    paths: ["src/lib/services/client-approval.service.ts"],
    pattern: /createTenant|provisionTenant|tenant\.create|tenant\.createMany/i,
  },
  {
    label: "Client approval must not activate payments",
    paths: ["src/lib/services/client-approval.service.ts"],
    pattern: /payment authorized|stripe\.payments|activate.*payment|live payments/i,
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

function listFilesRecursive(dirAbs: string): string[] {
  const entries = readdirSync(dirAbs, { withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    const p = join(dirAbs, e.name);
    if (e.isDirectory()) out.push(...listFilesRecursive(p));
    else out.push(p);
  }
  return out;
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

  console.log("\n=== I9 Client organization membership & linkage ===\n");

  for (const rel of REQUIRED_FILES) {
    check(existsSync(join(ROOT, rel)), `Required file: ${rel}`, `Missing: ${rel}`);
  }

  const requestLinkService = fileText("src/lib/services/client-request-link.service.ts");
  // I9 hardening: `submittedByUserId` write from contact-email must occur ONLY in mock mode.
  const hardeningOk =
    requestLinkService.includes("submittedByUserId: user.id") &&
    requestLinkService.includes("if (isUseMockData())") &&
    requestLinkService.indexOf("if (isUseMockData())") < requestLinkService.indexOf("submittedByUserId: user.id");
  check(
    hardeningOk,
    "Non-mock email contact match does not write submittedByUserId",
    "Hardening missing: contact-email submittedByUserId write not mock-gated"
  );

  const approvalService = fileText("src/lib/services/client-approval.service.ts");
  // Approval must use decision canApproveScope.
  const usesDecision =
    approvalService.includes("getClientOrganizationAccessDecisionForRequest") &&
    approvalService.includes("canApproveScope") &&
    approvalService.includes("ownership_unverified");
  check(
    usesDecision,
    "Approval gates on ClientOrganizationAccessDecision.canApproveScope",
    "Approval does not gate on decision.canApproveScope"
  );

  // Legacy submittedByUserId-only gate must be removed/replaced.
  check(
    !/submittedByUserId\s*!==\s*user\.id/.test(approvalService),
    "No submittedByUserId-only final gate remains",
    "Approval still compares submittedByUserId directly"
  );

  // UI must include membership context card blocks (read-only).
  const companyPage = fileText("src/app/client/company/page.tsx");
  check(
    companyPage.includes("Organization access (read-only)") || companyPage.includes("Organization access"),
    "Company page surfaces organization membership context",
    "Company page missing organization membership context"
  );

  const settingsPage = fileText("src/app/client/settings/page.tsx");
  check(
    settingsPage.includes("Organization access (read-only)") || settingsPage.includes("Organization access"),
    "Settings page surfaces organization membership context",
    "Settings page missing organization membership context"
  );

  // Dangerous patterns scan (static).
  for (const { label, paths, pattern } of DANGEROUS_PATTERNS) {
    for (const relOrDir of paths) {
      const abs = join(ROOT, relOrDir);
      if (!existsSync(abs)) continue;

      if (statSync(abs).isDirectory()) {
        const files = listFilesRecursive(abs);
        for (const fAbs of files) {
          const text = readFileSync(fAbs, "utf8");
          if (pattern.test(text)) {
            check(false, label, `${label} matched in ${fAbs}`);
            break;
          }
        }
      } else {
        const text = readFileSync(abs, "utf8");
        if (pattern.test(text)) {
          check(false, label, `${label} matched in ${relOrDir}`);
        }
      }
    }
  }

  // Forbidden claim phrases in key client/approval files.
  const claimScanPaths = [
    "src/lib/services/client-approval.service.ts",
    "src/lib/client-portal/client-approval-contract.ts",
    "src/app/proposal/[token]/page.tsx",
    "src/app/client/company/page.tsx",
    "src/app/client/settings/page.tsx",
  ];

  for (const rel of claimScanPaths) {
    if (!existsSync(join(ROOT, rel))) continue;
    const text = fileText(rel).toLowerCase();
    for (const phrase of FORBIDDEN_CLAIM_PHRASES) {
      const p = phrase.toLowerCase();
      if (text.includes(p)) {
        const negated =
          text.includes(`not ${p}`) ||
          text.includes(`is not ${p}`) ||
          text.includes(`not a ${p}`) ||
          text.includes(`no ${p}`);
        check(
          negated,
          `Claim "${phrase}" is negated in ${rel}`,
          `${rel} contains forbidden claim phrase: "${phrase}"`
        );
      }
    }
  }

  console.log(passed ? "\nI9 client-org:verify PASSED\n" : "\nI9 client-org:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();

