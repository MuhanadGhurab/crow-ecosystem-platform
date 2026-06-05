/**
 * M3.5 — Purchase-to-stock manual smoke & demo script documentation verifier.
 *
 *   npm run purchase-smoke:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED = [
  "docs/internal/M3_5_PURCHASE_TO_STOCK_MANUAL_SMOKE.md",
  "docs/internal/M3_5_PURCHASE_TO_STOCK_DEMO_SCRIPT.md",
  "docs/internal/M3_5_SCREENSHOT_CHECKLIST.md",
] as const;

const SMOKE_REQUIRED_SECTIONS = [
  "Environment tested",
  "Account used",
  "Tenant tested",
  "Access smoke",
  "Client-only block",
  "Wrong tenant slug",
  "Purchase-to-stock route",
  "Module link",
  "Reports",
  "CyberCrow evidence",
  "SAREA experience",
  "ProCrow visibility",
  "Final decision",
] as const;

const DEMO_REQUIRED_SECTIONS = [
  "/access",
  "/meem-global/dashboard",
  "/meem-global/workflows/purchase-to-stock",
  "CyberCrow",
  "SAREA",
  "ProCrow",
  "staging",
  "not production launch",
] as const;

const FORBIDDEN_POSITIVE_CLAIMS = [
  "supplier paid",
  "legal purchase order issued",
  "accounting posted",
  "inventory legally updated",
  "production launch approved",
  "production ready",
  "activate payments",
  "activate live payments",
  "certified compliance",
  "certifies compliance",
  "SIEM replacement",
  "replaces your SIEM",
  "real stock mutation",
  "payment completed",
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

function normalizeDocText(text: string): string {
  return text.toLowerCase().replace(/\*\*/g, "");
}

function lineHasForbiddenPositiveClaim(line: string, phrase: string): boolean {
  const lower = normalizeDocText(line);
  const needle = phrase.toLowerCase();
  const idx = lower.indexOf(needle);
  if (idx === -1) return false;

  const before = lower.slice(0, idx);
  const negated =
    /\b(not|never|without|denies|avoid|do not|does not|no)\b/.test(before) ||
    lower.includes("do not say") ||
    lower.includes("what not to claim") ||
    lower.includes("safe copy checks");

  return !negated;
}

function main(): boolean {
  let pass = true;

  console.log("\n=== M3.5 Purchase-to-stock smoke & demo docs ===\n");

  for (const rel of REQUIRED) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  const pkg = fileText("package.json");
  if (!pkg.includes('"purchase-smoke:verify"')) {
    pass = fail("package.json missing purchase-smoke:verify") && pass;
  } else {
    pass = ok("npm script purchase-smoke:verify") && pass;
  }

  const smoke = fileText("docs/internal/M3_5_PURCHASE_TO_STOCK_MANUAL_SMOKE.md");
  for (const section of SMOKE_REQUIRED_SECTIONS) {
    if (!smoke.includes(section)) {
      pass = fail(`Smoke doc missing section/topic: ${section}`) && pass;
    }
  }
  pass = ok("Smoke doc covers access, tenant, workflow, modules, reports, hooks, ProCrow") && pass;

  if (!smoke.includes("mkkzero@gmail.com") || !smoke.includes("meem-global")) {
    pass = fail("Smoke doc must record test account and tenant") && pass;
  }
  if (!smoke.includes("wbwnsndcxrgyqwppurms")) {
    pass = fail("Smoke doc must record Supabase project id") && pass;
  }
  pass = ok("Smoke doc environment + account recorded") && pass;

  const demo = fileText("docs/internal/M3_5_PURCHASE_TO_STOCK_DEMO_SCRIPT.md");
  const demoNorm = normalizeDocText(demo);
  for (const section of DEMO_REQUIRED_SECTIONS) {
    if (!demoNorm.includes(section.toLowerCase())) {
      pass = fail(`Demo script missing: ${section}`) && pass;
    }
  }
  pass = ok("Demo script routes and safe framing") && pass;

  const milestones = fileText("docs/internal/MILESTONES.md");
  if (!milestones.includes("M3.5")) {
    pass = fail("MILESTONES.md must include M3.5 entry") && pass;
  }
  const status = fileText("docs/internal/PROJECT_STATUS.md");
  if (!status.includes("M3.5")) {
    pass = fail("PROJECT_STATUS.md must include M3.5 entry") && pass;
  }
  pass = ok("Milestone trackers updated") && pass;

  const combinedLines = [smoke, demo].join("\n").split("\n");
  for (const phrase of FORBIDDEN_POSITIVE_CLAIMS) {
    const offending = combinedLines.filter((line) =>
      lineHasForbiddenPositiveClaim(line, phrase),
    );
    if (offending.length > 0) {
      pass = fail(`Forbidden positive claim in M3.5 docs: ${phrase}`) && pass;
    }
  }
  pass = ok("No forbidden production/payment/accounting/legal PO claims in docs") && pass;

  if (pass) console.log("\nPASS: M3.5 smoke & demo documentation");
  else console.error("\nFAIL: M3.5 doc checks failed");
  return pass;
}

process.exit(main() ? 0 : 1);
