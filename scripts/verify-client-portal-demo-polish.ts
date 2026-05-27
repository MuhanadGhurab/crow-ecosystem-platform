/**
 * I8 — Client portal polish & demo rehearsal guards.
 *
 *   npm run client-demo:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED_FILES = [
  "src/components/client-portal/client-portal-page-header.tsx",
  "src/components/client-portal/client-portal-trust-strip.tsx",
  "docs/internal/I8_CLIENT_PORTAL_POLISH_DEMO_REHEARSAL.md",
  "docs/internal/I8_CLIENT_PORTAL_DEMO_PLAYBOOK.md",
] as const;

const CLIENT_POLISH_ROUTES = [
  "src/app/client/page.tsx",
  "src/app/client/profile/page.tsx",
  "src/app/client/company/page.tsx",
  "src/app/client/requests/page.tsx",
  "src/app/client/requests/[requestId]/page.tsx",
  "src/app/client/proposals/page.tsx",
  "src/app/client/proposals/[proposalId]/page.tsx",
  "src/app/client/blueprints/[blueprintId]/page.tsx",
  "src/app/client/onboarding/page.tsx",
  "src/app/client/settings/page.tsx",
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
  "certified compliant",
  "live payments",
] as const;

const REQUIRED_PATTERNS: { label: string; paths: string[]; pattern: RegExp }[] = [
  {
    label: "Public proposal page uses ProposalTokenApprovalNotice",
    paths: ["src/app/proposal/[token]/page.tsx"],
    pattern: /ProposalTokenApprovalNotice/,
  },
  {
    label: "Scope approval panel on authenticated proposal detail",
    paths: ["src/app/client/proposals/[proposalId]/page.tsx"],
    pattern: /ClientProposalApprovalPanel/,
  },
  {
    label: "Approval guide variant on proposals list",
    paths: ["src/app/client/proposals/page.tsx"],
    pattern: /variant="guide"/,
  },
];

const DANGEROUS_PATTERNS: { label: string; paths: string[]; pattern: RegExp }[] = [
  {
    label: "Public proposal page must not import ProposalClientActions",
    paths: ["src/app/proposal/[token]/page.tsx"],
    pattern: /ProposalClientActions/,
  },
  {
    label: "Public proposal page must not import approveProposalByToken",
    paths: ["src/app/proposal/[token]/page.tsx"],
    pattern: /approveProposalByToken/,
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

  console.log("\n=== I8 Client portal polish & demo rehearsal ===\n");

  for (const rel of REQUIRED_FILES) {
    check(existsSync(join(ROOT, rel)), `Required file: ${rel}`, `Missing: ${rel}`);
  }

  const home = fileText("src/app/client/page.tsx");
  check(
    home.includes("ClientPortalTrustStrip"),
    "Client home includes trust strip",
    "Missing ClientPortalTrustStrip on /client"
  );
  check(
    home.includes("ClientPortalPageHeader"),
    "Client home uses shared page header",
    "Missing ClientPortalPageHeader on /client"
  );

  for (const rel of CLIENT_POLISH_ROUTES) {
    const text = fileText(rel);
    check(
      text.includes("ClientPortalPageHeader"),
      `${rel} uses ClientPortalPageHeader`,
      `${rel} missing ClientPortalPageHeader`
    );
  }

  const approvalBlocked = fileText("src/components/client-portal/client-portal-approval-blocked.tsx");
  check(
    approvalBlocked.includes('"guide" | "blocked"'),
    "Approval blocked supports guide variant",
    "Missing guide/blocked variant on ClientPortalApprovalBlocked"
  );

  const approvalService = fileText("src/lib/services/client-approval.service.ts");
  check(
    approvalService.includes("clientCanAccessRequest") || approvalService.includes("submittedByUserId"),
    "Client approval service enforces ownership linkage",
    "Missing ownership check in client-approval.service"
  );

  for (const { label, paths, pattern } of REQUIRED_PATTERNS) {
    for (const rel of paths) {
      const text = fileText(rel);
      check(pattern.test(text), `${label} (${rel})`, `${label} — missing in ${rel}`);
    }
  }

  for (const { label, paths, pattern } of DANGEROUS_PATTERNS) {
    for (const rel of paths) {
      const text = fileText(rel);
      check(!pattern.test(text), `${label} (${rel})`, `${label} — matched in ${rel}`);
    }
  }

  const scanPaths = [
    ...CLIENT_POLISH_ROUTES,
    "src/components/client-portal/client-portal-trust-strip.tsx",
    "src/components/client-portal/client-portal-approval-blocked.tsx",
  ];
  for (const phrase of FORBIDDEN_CLAIM_PHRASES) {
    for (const rel of scanPaths) {
      const text = fileText(rel);
      check(
        !text.toLowerCase().includes(phrase.toLowerCase()),
        `No forbidden phrase "${phrase}" in ${rel}`,
        `Forbidden phrase "${phrase}" found in ${rel}`
      );
    }
  }

  const pkg = fileText("package.json");
  check(
    pkg.includes('"client-demo:verify"'),
    "package.json exposes client-demo:verify",
    "Missing client-demo:verify script"
  );

  console.log(passed ? "\nI8 client portal polish verification PASSED\n" : "\nI8 client portal polish verification FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
