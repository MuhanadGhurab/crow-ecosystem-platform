/**
 * I5 — Proposal / Blueprint authenticated review (read-only, no approval mutations).
 *
 *   npm run client-review:verify
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED_FILES = [
  "src/lib/client-portal/client-review-contract.ts",
  "src/lib/services/client-review.service.ts",
  "src/components/client-portal/client-review-security-notes.tsx",
  "src/components/client-portal/client-review-procrow-counterpart.tsx",
  "docs/internal/I5_PROPOSAL_BLUEPRINT_AUTHENTICATED_REVIEW.md",
] as const;

const REVIEW_ROUTES = [
  "src/app/client/proposals/page.tsx",
  "src/app/client/proposals/[proposalId]/page.tsx",
  "src/app/client/blueprints/[blueprintId]/page.tsx",
] as const;

const FORBIDDEN_CLAIM_PHRASES = [
  "production client portal",
  "approved automatically",
  "fully compliant",
  "ai-powered approval",
  "live payments enabled",
] as const;

const DANGEROUS_PATTERNS: { label: string; paths: string[]; pattern: RegExp }[] = [
  {
    label: "Client review service must not implement approval mutations",
    paths: ["src/lib/services/client-review.service.ts"],
    pattern: /approveProposal|clientApprove|rejectProposal|requestChanges/i,
  },
  {
    label: "Client review pages must not wire ProposalClientActions",
    paths: REVIEW_ROUTES as unknown as string[],
    pattern: /ProposalClientActions/,
  },
  {
    label: "Client review pages must not call approveProposalByToken",
    paths: REVIEW_ROUTES as unknown as string[],
    pattern: /approveProposalByToken/,
  },
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
    label: "Client review components must not use service role",
    paths: ["src/components/client-portal"],
    pattern: /service_role|SUPABASE_SERVICE_ROLE/,
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

function walkTsFiles(dir: string): string[] {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(abs, { withFileTypes: true })) {
    const rel = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkTsFiles(rel));
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) out.push(rel);
  }
  return out;
}

function hasPositiveForbiddenClaim(text: string, phrase: string): boolean {
  const lower = text.toLowerCase();
  const p = phrase.toLowerCase();
  let idx = 0;
  while ((idx = lower.indexOf(p, idx)) !== -1) {
    const before = lower.slice(Math.max(0, idx - 80), idx).replace(/\s+/g, " ");
    if (/\b(not|no|without|nor)(\s+\S+){0,4}\s*$/i.test(before)) {
      idx += p.length;
      continue;
    }
    return true;
  }
  return false;
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

  console.log("\n=== I5 Client proposal/blueprint review ===\n");

  for (const rel of REQUIRED_FILES) {
    check(existsSync(join(ROOT, rel)), `File exists: ${rel}`, `Missing file: ${rel}`);
  }

  for (const rel of REVIEW_ROUTES) {
    check(existsSync(join(ROOT, rel)), `Route exists: ${rel}`, `Missing route: ${rel}`);
  }

  const contract = fileText("src/lib/client-portal/client-review-contract.ts");
  check(
    contract.includes("ClientProposalReviewModel"),
    "Review contract defines ClientProposalReviewModel",
    "Missing ClientProposalReviewModel"
  );
  check(
    contract.includes("ClientBlueprintReviewModel"),
    "Review contract defines ClientBlueprintReviewModel",
    "Missing ClientBlueprintReviewModel"
  );
  check(
    contract.includes("CLIENT_REVIEW_APPROVAL_BLOCKED_REASON"),
    "Review contract defines approval blocked reason",
    "Missing CLIENT_REVIEW_APPROVAL_BLOCKED_REASON"
  );

  const service = fileText("src/lib/services/client-review.service.ts");
  check(
    service.includes("buildClientProposalsListModel"),
    "Review service lists proposals",
    "Missing buildClientProposalsListModel"
  );
  check(
    service.includes("getClientProposalReviewModel"),
    "Review service loads proposal detail",
    "Missing getClientProposalReviewModel"
  );
  check(
    service.includes("getClientBlueprintReviewModel"),
    "Review service loads blueprint detail",
    "Missing getClientBlueprintReviewModel"
  );
  check(
    service.includes("clientCanAccessRequest"),
    "Review service uses clientCanAccessRequest",
    "Review service must gate on clientCanAccessRequest"
  );

  const proposalsPage = fileText("src/app/client/proposals/page.tsx");
  check(
    proposalsPage.includes("buildClientProposalsListModel"),
    "Proposals page uses review service",
    "Proposals page must use buildClientProposalsListModel"
  );
  check(
    !/approveProposal|ProposalClientActions/i.test(proposalsPage),
    "Proposals page has no approval actions",
    "Proposals page must not wire approval UI"
  );

  const proposalDetail = fileText("src/app/client/proposals/[proposalId]/page.tsx");
  check(
    proposalDetail.includes("getClientProposalReviewModel"),
    "Proposal detail uses review service",
    "Proposal detail must use getClientProposalReviewModel"
  );
  check(
    proposalDetail.includes("ClientProposalApprovalPanel") ||
      proposalDetail.includes("getClientApprovalEligibility"),
    "Proposal detail shows approval UI (I6 panel or eligibility)",
    "Proposal detail must wire ClientProposalApprovalPanel or getClientApprovalEligibility"
  );
  check(
    !proposalDetail.includes("approveClientProposalScopeAction") ||
      proposalDetail.includes("ClientProposalApprovalPanel"),
    "Proposal detail does not call approval action directly from page",
    "Proposal page must not invoke approve action except via approval panel"
  );

  const blueprintDetail = fileText("src/app/client/blueprints/[blueprintId]/page.tsx");
  check(
    blueprintDetail.includes("getClientBlueprintReviewModel"),
    "Blueprint detail uses review service",
    "Blueprint detail must use getClientBlueprintReviewModel"
  );

  const requestDetail = fileText("src/app/client/requests/[requestId]/page.tsx");
  check(
    requestDetail.includes("buildClientRequestReviewLinks"),
    "Request detail integrates review links",
    "Request detail must use buildClientRequestReviewLinks"
  );

  const pkg = fileText("package.json");
  check(
    pkg.includes('"client-review:verify"'),
    "package.json defines client-review:verify",
    'Add "client-review:verify" to package.json scripts'
  );

  for (const { label, paths, pattern } of DANGEROUS_PATTERNS) {
    for (const p of paths) {
      const abs = join(ROOT, p);
      if (!existsSync(abs)) continue;
      const files = statSync(abs).isDirectory() ? walkTsFiles(p) : [p];
      for (const rel of files) {
        const text = fileText(rel);
        check(!pattern.test(text), `${label} (${rel})`, `${label} — matched in ${rel}`);
      }
    }
  }

  const reviewFiles = walkTsFiles("src/app/client/proposals")
    .concat(walkTsFiles("src/app/client/blueprints"))
    .concat(["src/lib/services/client-review.service.ts"])
    .concat(walkTsFiles("src/components/client-portal"));

  for (const rel of reviewFiles) {
    const text = fileText(rel);
    for (const phrase of FORBIDDEN_CLAIM_PHRASES) {
      check(
        !hasPositiveForbiddenClaim(text, phrase),
        `No forbidden claim "${phrase}" in ${rel}`,
        `Forbidden claim "${phrase}" in ${rel}`
      );
    }
  }

  console.log(
    passed ? "\nI5 client-review:verify PASSED\n" : "\nI5 client-review:verify FAILED\n"
  );
  process.exit(passed ? 0 : 1);
}

main();
