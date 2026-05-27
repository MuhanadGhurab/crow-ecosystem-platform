/**
 * I4 — Client Profile + Company Profile MVP (read-only + safe user metadata edits).
 *
 *   npm run client-profile:verify
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED_FILES = [
  "src/lib/client-portal/client-profile-contract.ts",
  "src/lib/services/client-profile.service.ts",
  "src/lib/actions/client-profile.ts",
  "src/components/client-portal/client-profile-completeness.tsx",
  "src/components/client-portal/client-profile-edit-form.tsx",
  "src/components/client-portal/client-linking-status.tsx",
  "docs/internal/I4_CLIENT_PROFILE_COMPANY_PROFILE_MVP.md",
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
    label: "Client profile service must not implement approval mutations",
    paths: ["src/lib/services/client-profile.service.ts"],
    pattern: /approveProposal|clientApprove|rejectProposal/i,
  },
  {
    label: "Client profile actions must not use service role",
    paths: ["src/lib/actions/client-profile.ts"],
    pattern: /service_role|SUPABASE_SERVICE_ROLE|updateUserById/,
  },
  {
    label: "Client portal components must not import service role",
    paths: ["src/components/client-portal"],
    pattern: /service_role|SUPABASE_SERVICE_ROLE/,
  },
  {
    label: "Client routes must not assign platform_admin from profile",
    paths: ["src/app/client/profile", "src/app/client/company", "src/app/client/settings"],
    pattern: /crow_role:\s*["']platform_admin["']/,
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

  console.log("\n=== I4 Client Profile + Company MVP ===\n");

  for (const rel of REQUIRED_FILES) {
    check(existsSync(join(ROOT, rel)), `File exists: ${rel}`, `Missing file: ${rel}`);
  }

  const contract = fileText("src/lib/client-portal/client-profile-contract.ts");
  check(
    contract.includes("ClientProfileSummary"),
    "Profile contract defines ClientProfileSummary",
    "Missing ClientProfileSummary"
  );
  check(
    contract.includes("CompanyProfileSummary"),
    "Profile contract defines CompanyProfileSummary",
    "Missing CompanyProfileSummary"
  );
  check(
    contract.includes("ClientAccountLinkState"),
    "Profile contract defines linking states",
    "Missing ClientAccountLinkState"
  );

  const service = fileText("src/lib/services/client-profile.service.ts");
  check(
    service.includes("buildClientProfilePageModel"),
    "Client profile service builds profile page model",
    "Missing buildClientProfilePageModel"
  );
  check(
    service.includes("buildClientCompanyPageModel"),
    "Client profile service builds company page model",
    "Missing buildClientCompanyPageModel"
  );
  check(
    !/prisma\.\w+\.(update|delete|create)/.test(service),
    "Profile service has no Prisma mutations",
    "Profile service must not mutate request/company data in I4"
  );

  const profilePage = fileText("src/app/client/profile/page.tsx");
  check(
    profilePage.includes("ClientProfileCompleteness"),
    "Profile page shows completeness",
    "Profile page must include completeness UI"
  );
  check(
    profilePage.includes("buildClientProfilePageModel"),
    "Profile page uses client profile service",
    "Profile page must use buildClientProfilePageModel"
  );
  check(
    profilePage.includes("platform admin"),
    "Profile page includes admin access disclaimer",
    "Profile page must state profile does not grant admin access"
  );

  const companyPage = fileText("src/app/client/company/page.tsx");
  check(
    companyPage.includes("buildClientCompanyPageModel"),
    "Company page uses client profile service",
    "Company page must use buildClientCompanyPageModel"
  );
  check(
    companyPage.includes("No company profile linked"),
    "Company page handles unlinked state",
    "Company page must handle not-linked state"
  );

  const pkg = fileText("package.json");
  check(
    pkg.includes('"client-profile:verify"'),
    "package.json defines client-profile:verify",
    'Add "client-profile:verify" to package.json scripts'
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
    walkTsFiles("src/app/client/profile"),
    walkTsFiles("src/app/client/company")
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

  console.log(
    passed ? "\nI4 client-profile:verify PASSED\n" : "\nI4 client-profile:verify FAILED\n"
  );
  process.exit(passed ? 0 : 1);
}

main();
