/**
 * L1 — Product UX simplification, auth-gated request flow & commercial lifecycle guards.
 *
 *   npm run product-ux:verify
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
  "auto-provision",
  "production go-live approved",
  "certified compliant",
  "autonomous validation",
  "ai-powered governance",
] as const;

const REQUIRED_FILES = [
  "docs/internal/L1_PRODUCT_UX_SIMPLIFICATION_AUTH_REQUEST.md",
  "src/lib/constants/commercial-lifecycle.ts",
  "src/lib/constants/procrow-admin-nav.ts",
  "src/lib/constants/product-portal-routing.ts",
  "src/components/product/product-page-header.tsx",
  "src/components/procrow/procrow-workflow-strip.tsx",
  "src/components/procrow/procrow-overview-priority.tsx",
  "src/components/procrow/procrow-commercial-lifecycle-card.tsx",
  "scripts/verify-product-ux-simplification.ts",
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

  console.log("\n=== L1 Product UX simplification ===\n");

  for (const f of REQUIRED_FILES) {
    check(existsSync(join(ROOT, f)), `Required file: ${f}`, `Missing: ${f}`);
  }

  const pkg = fileText("package.json");
  check(pkg.includes('"product-ux:verify"'), "package.json defines product-ux:verify", "Add product-ux:verify script");

  const routeProtection = fileText("src/lib/auth/route-protection.ts");
  const publicPrefixesBlock = routeProtection.match(/PUBLIC_PREFIXES = \[([\s\S]*?)\] as const/)?.[1] ?? "";
  check(
    !publicPrefixesBlock.includes('"/request"'),
    "/request removed from public path prefixes",
    "/request must not be in PUBLIC_PREFIXES"
  );
  check(
    routeProtection.includes("L1 — ERP request intake requires an authenticated session"),
    "implementation-requests POST no longer public API",
    "Remove POST /api/implementation-requests from isPublicApiPath"
  );

  const requestPage = fileText("src/app/(public)/request/page.tsx");
  check(
    requestPage.includes("loginWithNext") || requestPage.includes("redirect"),
    "/request page redirects or gates unauthenticated users",
    "Auth-gate /request page"
  );

  const apiRoute = fileText("src/app/api/implementation-requests/route.ts");
  check(
    apiRoute.includes("Sign in required to submit"),
    "API POST requires authenticated user when auth configured",
    "Require auth on implementation-requests POST"
  );

  const navConst = fileText("src/lib/constants/procrow-admin-nav.ts");
  check(navConst.includes('heading: "Command"'), "ProCrow nav group: Command", "Add Command nav group");
  check(navConst.includes('heading: "Customer flow"'), "ProCrow nav group: Customer flow", "Add Customer flow group");
  check(navConst.includes('heading: "Release center"'), "ProCrow nav group: Release center", "Add Release center group");

  const adminLayout = fileText("src/app/admin/layout.tsx");
  check(
    adminLayout.includes("PROCROW_ADMIN_NAV_GROUPS") && adminLayout.includes("navGroups"),
    "Admin layout uses grouped ProCrow navigation",
    "Wire PROCROW_ADMIN_NAV_GROUPS to AreaShell navGroups"
  );

  const overview = fileText("src/app/admin/overview/page.tsx");
  check(
    overview.includes("ProCrowOverviewPriority"),
    "Overview uses priority / next-action panel",
    "Add ProCrowOverviewPriority to overview"
  );
  check(
    overview.includes("ProCrowWorkflowStrip"),
    "Overview includes workflow strip",
    "Add ProCrowWorkflowStrip to overview"
  );
  check(
    overview.includes("ProCrowCommercialLifecycleCard"),
    "Overview includes commercial lifecycle card",
    "Add commercial lifecycle to overview"
  );

  const commercial = fileText("src/lib/constants/commercial-lifecycle.ts");
  check(
    commercial.includes("Setup/onboarding fee is reviewed after scope approval"),
    "Commercial lifecycle copy present",
    "Add setup fee copy"
  );
  check(
    commercial.includes("No automated checkout"),
    "Commercial lifecycle safety copy",
    "Add COMMERCIAL_LIFECYCLE_SAFETY_COPY"
  );

  const hero = fileText("src/components/public/hero-section.tsx");
  check(
    hero.includes("Sign in") || hero.includes("sign in"),
    "Public hero mentions sign-in for request",
    "Update hero CTA copy for auth-gated flow"
  );

  const l1Doc = fileText("docs/internal/L1_PRODUCT_UX_SIMPLIFICATION_AUTH_REQUEST.md");
  check(l1Doc.includes("L1"), "L1 phase doc present", "L1 doc missing title");
  check(l1Doc.includes("PASSED") || l1Doc.includes("Passed"), "L1 doc records status", "L1 doc status");

  const milestones = fileText("docs/internal/MILESTONES.md");
  check(milestones.includes("L1"), "MILESTONES.md includes L1", "Update MILESTONES.md");

  const status = fileText("docs/internal/PROJECT_STATUS.md");
  check(status.includes("L1"), "PROJECT_STATUS.md mentions L1", "Update PROJECT_STATUS.md");

  for (const phrase of FORBIDDEN_PHRASES) {
    const surfaces = [
      "src/components/procrow/procrow-commercial-lifecycle-card.tsx",
      "src/lib/constants/commercial-lifecycle.ts",
      "src/app/admin/overview/page.tsx",
    ];
    for (const rel of surfaces) {
      const text = fileText(rel).toLowerCase();
      if (text.includes(phrase)) {
        check(false, "", `Forbidden phrase in ${rel}: "${phrase}"`);
      }
    }
  }
  ok("No forbidden payment/overclaim phrases in L1 commercial surfaces");

  if (passed) {
    console.log("\nL1 product-ux:verify PASSED\n");
    process.exit(0);
  }
  console.log("\nL1 product-ux:verify FAILED\n");
  process.exit(1);
}

main();
