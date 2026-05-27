/**
 * I10 — Client review notes & request-changes verifier.
 *
 * Run:
 *   npm run client-notes:verify
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

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

const ROOT = join(import.meta.dirname, "..");

const REQUIRED_FILES = [
  "src/lib/client-portal/client-review-notes-contract.ts",
  "src/lib/services/client-review-notes.service.ts",
  "src/lib/actions/client-review-notes.ts",
  "src/components/client-portal/client-review-feedback-panel.tsx",
  "src/components/admin/admin-client-review-feedback-panel.tsx",
  "scripts/verify-client-review-notes.ts",
] as const;

const FORBIDDEN_CLAIM_PHRASES = [
  "legally signed",
  "e-signature complete",
  "payment authorized",
  "activate tenant",
  "production go-live approved",
  "fully compliant",
  "ai-powered approval",
  "ai-reviewed",
  "live payments",
  "automatic tenant provisioning",
  "certified compliant",
  "reject contract",
  "legally dispute",
] as const;

const DANGEROUS_PATTERNS: { label: string; paths: string[]; pattern: RegExp }[] = [
  {
    label: "Public token route must not expose client feedback or approval forms",
    paths: ["src/app/proposal/[token]/page.tsx"],
    pattern:
      /ClientReviewFeedbackPanel|submitClientReviewNote|requestClientProposalChanges|approveClientProposalScope|ProposalClientActions/,
  },
  {
    label: "Client-facing code must not use service role",
    paths: ["src/app/client", "src/components/client-portal", "src/lib/actions/client-review-notes.ts"],
    pattern: /service_role|SUPABASE_SERVICE_ROLE/,
  },
  {
    label: "Client code must not assign platform admin",
    paths: ["src/app/client", "src/lib/actions/client-review-notes.ts"],
    pattern: /platform_admin|PLATFORM_ADMIN/,
  },
  {
    label: "Review notes service must not auto-provision tenant",
    paths: ["src/lib/services/client-review-notes.service.ts"],
    pattern: /createTenant|provisionTenant|tenant\.create/i,
  },
  {
    label: "Review notes service must not activate payments",
    paths: ["src/lib/services/client-review-notes.service.ts"],
    pattern: /stripe\.payments|activate.*payment|live payments/i,
  },
  {
    label: "Request changes must not auto-update proposal status to rejected",
    paths: ["src/lib/services/client-review-notes.service.ts"],
    pattern: /proposalStatus:\s*["']REJECTED|CLIENT_REJECTED|CANCELLED/i,
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

  console.log("\n=== I10 Client review notes & request-changes ===\n");

  for (const rel of REQUIRED_FILES) {
    check(existsSync(join(ROOT, rel)), `Required file: ${rel}`, `Missing: ${rel}`);
  }

  const pkg = fileText("package.json");
  check(
    pkg.includes('"client-notes:verify"'),
    "package.json defines client-notes:verify script",
    "Missing npm script client-notes:verify"
  );

  const notesService = fileText("src/lib/services/client-review-notes.service.ts");
  check(
    notesService.includes("getClientOrganizationAccessDecisionForRequest") &&
      notesService.includes("canApproveScope"),
    "Request-changes eligibility uses organization access decision",
    "Missing canApproveScope gating in client-review-notes.service"
  );
  check(
    notesService.includes("canRequestChanges = true") &&
      notesService.includes('proposalStatus === "SENT"'),
    "Official request-changes requires canApproveScope and SENT proposal",
    "Request-changes gating incomplete"
  );
  check(
    notesService.includes("CLIENT_REVIEW_NOTE_EMAIL_ONLY_HINT") ||
      notesService.includes("ownership_unverified"),
    "Email-only reviewers blocked from official request-changes",
    "Missing email-only reviewer block messaging"
  );
  check(
    notesService.includes("CLIENT_REVIEW_NOTE_EVENT_TYPES") &&
      notesService.includes("platformNotification.create"),
    "Persistence uses platform notification inbox (no new schema)",
    "Missing platform notification persistence path"
  );

  const proposalPage = fileText("src/app/client/proposals/[proposalId]/page.tsx");
  check(
    proposalPage.includes("ClientReviewFeedbackPanel"),
    "Proposal detail includes review feedback panel",
    "Proposal page missing ClientReviewFeedbackPanel"
  );

  const adminPage = fileText("src/app/admin/requests/[requestId]/page.tsx");
  check(
    adminPage.includes("AdminClientReviewFeedbackPanel"),
    "Admin request detail includes client feedback panel",
    "Admin request page missing AdminClientReviewFeedbackPanel"
  );

  const tokenPage = fileText("src/app/proposal/[token]/page.tsx");
  check(
    !tokenPage.includes("ClientReviewFeedbackPanel") &&
      !tokenPage.includes("requestClientProposalChanges"),
    "Public token route has no client feedback mutations",
    "Public token route exposes client feedback — security violation"
  );

  for (const { label, paths, pattern } of DANGEROUS_PATTERNS) {
    for (const rel of paths) {
      const abs = join(ROOT, rel);
      if (!existsSync(abs)) continue;
      if (statSync(abs).isDirectory()) {
        for (const fAbs of listFilesRecursive(abs)) {
          const text = readFileSync(fAbs, "utf8");
          if (pattern.test(text)) {
            check(false, `${label} (${rel})`, `${label} — matched in ${fAbs}`);
            break;
          }
        }
      } else {
        const text = readFileSync(abs, "utf8");
        check(!pattern.test(text), `${label} (${rel})`, `${label} — matched in ${rel}`);
      }
    }
  }

  const scanRoots = [
    "src/lib/client-portal/client-review-notes-contract.ts",
    "src/components/client-portal/client-review-feedback-panel.tsx",
    "src/lib/services/client-review-notes.service.ts",
  ];
  for (const rel of scanRoots) {
    const lower = fileText(rel).toLowerCase();
    for (const phrase of FORBIDDEN_CLAIM_PHRASES) {
      check(
        !lower.includes(phrase.toLowerCase()),
        `No forbidden claim "${phrase}" in ${rel}`,
        `Forbidden claim "${phrase}" found in ${rel}`
      );
    }
  }

  const docPath = "docs/internal/I10_REQUEST_CHANGES_CLIENT_REVIEW_NOTES.md";
  check(
    existsSync(join(ROOT, docPath)),
    `Documentation: ${docPath}`,
    `Missing ${docPath}`
  );

  console.log(passed ? "\nI10 client review notes: PASSED\n" : "\nI10 client review notes: FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
