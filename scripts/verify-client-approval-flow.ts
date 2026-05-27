/**
 * I6 — Client scope approval + ProCrow status sync.
 *
 *   npm run client-approval:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED_FILES = [
  "src/lib/client-portal/client-approval-contract.ts",
  "src/lib/services/client-approval.service.ts",
  "src/lib/actions/client-approval.ts",
  "src/components/client-portal/client-proposal-approval-panel.tsx",
  "docs/internal/I6_SCOPE_APPROVAL_PROCROW_STATUS_SYNC.md",
] as const;

const CLIENT_APPROVAL_PATHS = [
  "src/lib/services/client-approval.service.ts",
  "src/lib/actions/client-approval.ts",
  "src/components/client-portal/client-proposal-approval-panel.tsx",
  "src/app/client/proposals/[proposalId]/page.tsx",
] as const;

const FORBIDDEN_CLAIM_PHRASES = [
  "legally signed",
  "e-signature complete",
  "payment authorized",
  "activate tenant",
  "production go-live approved",
  "fully compliant",
  "ai-powered approval",
] as const;

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
  {
    label: "Client approval panel must not use service role",
    paths: ["src/components/client-portal/client-proposal-approval-panel.tsx"],
    pattern: /service_role|SUPABASE_SERVICE_ROLE/,
  },
  {
    label: "Client approval action must not assign platform_admin",
    paths: ["src/lib/actions/client-approval.ts", "src/lib/services/client-approval.service.ts"],
    pattern: /platform_admin|PLATFORM_ADMIN/,
  },
  {
    label: "Client approval must not auto-provision tenant",
    paths: ["src/lib/services/client-approval.service.ts"],
    pattern: /createTenant|provisionTenant|tenant\.create/i,
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

  console.log("\n=== I6 Client scope approval ===\n");

  for (const rel of REQUIRED_FILES) {
    check(existsSync(join(ROOT, rel)), `Required file: ${rel}`, `Missing: ${rel}`);
  }

  const approvalService = fileText("src/lib/services/client-approval.service.ts");
  check(
    approvalService.includes("getClientApprovalEligibility"),
    "Eligibility service exported",
    "Missing getClientApprovalEligibility"
  );
  check(
    approvalService.includes("approveClientProposalScope"),
    "Approval mutation service exported",
    "Missing approveClientProposalScope"
  );
  check(
    approvalService.includes("clientHasStrongRequestOwnership"),
    "Strong ownership check present",
    "Missing clientHasStrongRequestOwnership"
  );
  check(
    approvalService.includes("client_scope_approved"),
    "Platform notification on approval",
    "Missing client_scope_approved notification"
  );
  check(
    approvalService.includes("clientCanAccessRequest"),
    "Uses clientCanAccessRequest for access",
    "Missing clientCanAccessRequest usage"
  );

  const approvalAction = fileText("src/lib/actions/client-approval.ts");
  check(approvalAction.includes('"use server"'), "Server action file", "client-approval.ts not server-only");
  check(
    approvalAction.includes("approveClientProposalScopeAction"),
    "approveClientProposalScopeAction exists",
    "Missing approveClientProposalScopeAction"
  );

  const proposalDetail = fileText("src/app/client/proposals/[proposalId]/page.tsx");
  check(
    proposalDetail.includes("ClientProposalApprovalPanel"),
    "Proposal detail uses approval panel",
    "Missing ClientProposalApprovalPanel on proposal detail"
  );
  check(
    proposalDetail.includes("getClientApprovalEligibility"),
    "Proposal detail loads eligibility",
    "Missing eligibility on proposal detail"
  );
  check(
    !proposalDetail.includes("ClientPortalApprovalBlocked"),
    "Proposal detail does not use generic blocked card only",
    "Proposal detail still uses ClientPortalApprovalBlocked instead of approval panel"
  );

  const publicProposal = fileText("src/app/proposal/[token]/page.tsx");
  check(
    publicProposal.includes("ProposalTokenApprovalNotice"),
    "Public token route uses sign-in notice",
    "Public proposal missing ProposalTokenApprovalNotice"
  );

  for (const { label, paths, pattern } of DANGEROUS_PATTERNS) {
    for (const rel of paths) {
      if (!existsSync(join(ROOT, rel))) continue;
      const text = fileText(rel);
      check(!pattern.test(text), `${rel}: ${label} absent`, `${rel}: ${label}`);
    }
  }

  for (const rel of CLIENT_APPROVAL_PATHS) {
    const text = fileText(rel);
    for (const phrase of FORBIDDEN_CLAIM_PHRASES) {
      if (text.toLowerCase().includes(phrase.toLowerCase())) {
        const negated =
          text.toLowerCase().includes(`not ${phrase.toLowerCase()}`) ||
          text.toLowerCase().includes(`is not ${phrase.toLowerCase()}`);
        check(negated, `${rel} negates "${phrase}"`, `${rel} may overclaim: "${phrase}"`);
      }
    }
  }

  console.log(passed ? "\nI6 client-approval:verify PASSED\n" : "\nI6 client-approval:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
