/**
 * L3 — Public + Client Portal UX refinement guards.
 *
 *   npm run public-client-ux:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const FORBIDDEN_PHRASES = [
  "pay now",
  "start subscription",
  "free month",
  "live checkout",
  "activate live payments",
  "automatic tenant provisioning",
  "auto-provision tenant",
  "production go-live approved",
  "certified compliant",
  "autonomous validation",
  "ai-powered governance",
  "legally binding",
  "e-signature",
] as const;

const REQUIRED_FILES = [
  "docs/internal/L3_PUBLIC_CLIENT_PORTAL_UX_REFINEMENT.md",
  "src/lib/constants/public-client-ux.ts",
  "src/components/public/public-request-gate-note.tsx",
  "src/components/product/commercial-lifecycle-mini.tsx",
  "src/components/client-portal/client-journey-summary.tsx",
  "src/components/client-portal/client-next-action-panel.tsx",
  "scripts/verify-public-client-ux-refinement.ts",
] as const;

const PUBLIC_SURFACES = [
  "src/lib/constants/homepage.ts",
  "src/lib/constants/public-client-ux.ts",
  "src/components/public/hero-section.tsx",
  "src/components/public/public-header.tsx",
  "src/components/public/public-request-gate-note.tsx",
  "src/components/public/request-page-hero.tsx",
  "src/app/(public)/pricing/page.tsx",
  "src/app/(public)/security/page.tsx",
  "src/app/login/page.tsx",
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

function scanForbidden(rel: string): string | null {
  const lower = fileText(rel).toLowerCase();
  for (const phrase of FORBIDDEN_PHRASES) {
    if (lower.includes(phrase)) return phrase;
  }
  return null;
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

  console.log("\n=== L3 Public + Client Portal UX ===\n");

  for (const f of REQUIRED_FILES) {
    check(existsSync(join(ROOT, f)), `Required file: ${f}`, `Missing: ${f}`);
  }

  const pkg = fileText("package.json");
  check(
    pkg.includes('"public-client-ux:verify"'),
    "package.json defines public-client-ux:verify",
    "Add public-client-ux:verify script"
  );

  const routeProtection = fileText("src/lib/auth/route-protection.ts");
  const publicPrefixesBlock = routeProtection.match(/PUBLIC_PREFIXES = \[([\s\S]*?)\] as const/)?.[1] ?? "";
  check(
    !publicPrefixesBlock.includes('"/request"'),
    "/request not in PUBLIC_PREFIXES",
    "/request must stay auth-gated"
  );

  const requestPage = fileText("src/app/(public)/request/page.tsx");
  check(
    requestPage.includes("loginWithNext") && requestPage.includes("redirect"),
    "/request page redirects unauthenticated users",
    "/request must redirect to login when unauthenticated"
  );

  const hero = fileText("src/components/public/hero-section.tsx");
  check(
    hero.includes("Start Enterprise Request") && hero.toLowerCase().includes("sign in"),
    "Homepage hero CTA + account note",
    "Hero needs Start Enterprise Request and sign-in guidance"
  );

  const pricing = fileText("src/app/(public)/pricing/page.tsx");
  check(
    pricing.includes("CommercialLifecycleMini") && pricing.includes("PRICING_COMMERCIAL_HONESTY"),
    "Pricing uses commercial lifecycle honesty copy",
    "Pricing page missing lifecycle honesty components"
  );

  const security = fileText("src/app/(public)/security/page.tsx");
  check(
    security.includes("NOT_CLAIMS") || security.includes("Not a SIEM"),
    "Security page includes safe disclaimers",
    "Security page missing NOT_CLAIMS / SIEM disclaimer"
  );

  const login = fileText("src/app/login/page.tsx");
  check(
    login.includes("LOGIN_CLIENT_PURPOSE") && login.includes("Sign in to submit"),
    "Login supports account-first request flow",
    "Login page missing L3 account-first copy"
  );

  const clientHome = fileText("src/app/client/page.tsx");
  check(
    clientHome.includes("ClientNextActionPanel") && clientHome.includes("ClientJourneySummary"),
    "Client dashboard uses L3 journey + next action",
    "Client home missing ClientNextActionPanel / ClientJourneySummary"
  );

  for (const rel of PUBLIC_SURFACES) {
    const hit = scanForbidden(rel);
    check(!hit, `No forbidden phrase in ${rel}`, `Forbidden "${hit}" in ${rel}`);
  }

  const commercialMini = fileText("src/components/product/commercial-lifecycle-mini.tsx");
  check(
    !commercialMini.toLowerCase().includes("live checkout"),
    "CommercialLifecycleMini avoids live checkout phrase",
    'Use "automated checkout" or manual billing wording per L1'
  );

  console.log(passed ? "\nL3 public-client-ux: PASSED\n" : "\nL3 public-client-ux: FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
