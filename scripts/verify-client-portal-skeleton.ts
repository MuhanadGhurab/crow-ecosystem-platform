/**
 * I3 — Client Portal data contract & route skeleton (read-only).
 *
 *   npm run client-portal:verify
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED_FILES = [
  "src/lib/client-portal/client-portal-contract.ts",
  "src/lib/client-portal/onboarding-steps.ts",
  "src/lib/services/client-portal.service.ts",
  "src/components/client-portal/client-portal-shell.tsx",
  "src/components/client-portal/client-portal-status-card.tsx",
  "src/components/client-portal/client-portal-next-actions.tsx",
  "src/components/client-portal/client-portal-approval-blocked.tsx",
  "src/components/blueprint/commercial/proposal-token-approval-notice.tsx",
  "docs/internal/I3_CLIENT_PORTAL_DATA_CONTRACT_ROUTE_SKELETON.md",
] as const;

const REQUIRED_ROUTES = [
  "src/app/client/layout.tsx",
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
  "production client portal",
  "approved automatically",
  "fully compliant",
  "ai-powered approval",
  "live payments enabled",
] as const;

const DANGEROUS_PATTERNS: { label: string; paths: string[]; pattern: RegExp }[] = [
  {
    label: "Proposal page must not use token-only approve actions",
    paths: ["src/app/proposal/[token]/page.tsx"],
    pattern: /ProposalClientActions/,
  },
  {
    label: "Client portal components must not import service role",
    paths: ["src/components/client-portal"],
    pattern: /service_role|SUPABASE_SERVICE_ROLE/,
  },
  {
    label: "Client routes must not assign platform_admin on signup",
    paths: ["src/app/client"],
    pattern: /platform_admin.*signup|crow_role:\s*["']platform_admin["']/,
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

  console.log("\n=== I3 Client Portal skeleton ===\n");

  for (const rel of REQUIRED_FILES) {
    check(existsSync(join(ROOT, rel)), `File exists: ${rel}`, `Missing file: ${rel}`);
  }

  for (const rel of REQUIRED_ROUTES) {
    check(existsSync(join(ROOT, rel)), `Route exists: ${rel}`, `Missing route: ${rel}`);
  }

  const contract = fileText("src/lib/client-portal/client-portal-contract.ts");
  check(
    contract.includes("ClientPortalDashboardSnapshot"),
    "Contract defines ClientPortalDashboardSnapshot",
    "Missing ClientPortalDashboardSnapshot in contract"
  );
  check(
    contract.includes("CLIENT_PORTAL_APPROVAL_BLOCKED_REASON"),
    "Contract defines approval blocked reason",
    "Missing CLIENT_PORTAL_APPROVAL_BLOCKED_REASON"
  );
  check(
    contract.includes("PROCROW_COUNTERPARTS"),
    "Contract defines ProCrow counterparts",
    "Missing PROCROW_COUNTERPARTS"
  );

  const service = fileText("src/lib/services/client-portal.service.ts");
  check(
    service.includes("buildClientPortalDashboardSnapshot"),
    "Client portal service builds dashboard snapshot",
    "Missing buildClientPortalDashboardSnapshot"
  );
  check(
    !/approveProposal|clientApprove|rejectProposal/i.test(service),
    "Service has no approval mutations",
    "Client portal service must not implement approval mutations in I3"
  );

  const clientLayout = fileText("src/app/client/layout.tsx");
  check(
    clientLayout.includes("requireClientAccess"),
    "Client layout requires client access",
    "Client layout must call requireClientAccess"
  );

  const proposalPage = fileText("src/app/proposal/[token]/page.tsx");
  check(
    proposalPage.includes("ProposalTokenApprovalNotice"),
    "Public proposal page uses token approval notice",
    "Public proposal page must use ProposalTokenApprovalNotice when actionable"
  );
  check(
    !proposalPage.includes("ProposalClientActions"),
    "Public proposal page does not import ProposalClientActions",
    "Public proposal page must not wire token-only ProposalClientActions"
  );

  const pkg = fileText("package.json");
  check(
    pkg.includes('"client-portal:verify"'),
    "package.json defines client-portal:verify script",
    'Add "client-portal:verify" to package.json scripts'
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

  const clientPortalFiles = walkTsFiles("src/components/client-portal").concat(
    walkTsFiles("src/app/client")
  );
  for (const rel of clientPortalFiles) {
    const text = fileText(rel);
    for (const phrase of FORBIDDEN_CLAIM_PHRASES) {
      check(
        !hasPositiveForbiddenClaim(text, phrase),
        `No forbidden claim "${phrase}" in ${rel}`,
        `Forbidden claim "${phrase}" in ${rel}`
      );
    }
  }

  console.log(passed ? "\nI3 client-portal:verify PASSED\n" : "\nI3 client-portal:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
