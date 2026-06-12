/**
 * A1.1 — Public homepage hero & website visual reset verifier.
 *
 *   npm run public-homepage:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const FORBIDDEN_OVERCLAIM = [
  "certified compliance",
  "SIEM replacement",
  "legal audit evidence",
  "autonomous detection",
  "autonomous remediation",
  "activate live payments",
  "production go-live approved",
] as const;

const FORBIDDEN_PUBLIC_EXPOSURE = [
  { file: "src/app/(public)/page.tsx", pattern: /href=["']\/admin/i },
  { file: "src/components/public/hero-section.tsx", pattern: /href=["']\/admin/i },
  { file: "src/components/public/public-header-nav.tsx", pattern: /ProCrow.*href.*\/admin/i },
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

function main(): boolean {
  let pass = true;
  const check = (cond: boolean, passMsg: string, failMsg: string) => {
    if (cond) ok(passMsg);
    else {
      fail(failMsg);
      pass = false;
    }
  };

  console.log("\n=== A1.1 Public homepage hero & visual reset ===\n");

  const docPath = "docs/internal/A1_1_PUBLIC_HOMEPAGE_HERO_VISUAL_RESET.md";
  check(existsSync(join(ROOT, docPath)), `Required doc: ${docPath}`, `Missing: ${docPath}`);

  const pkg = fileText("package.json");
  check(
    pkg.includes('"public-homepage:verify"'),
    "package.json defines public-homepage:verify",
    "Add public-homepage:verify script"
  );

  const hero = fileText("src/components/public/hero-section.tsx");
  check(
    !hero.includes("EnterpriseOperatingModelCard"),
    "Hero side card (EnterpriseOperatingModelCard) removed from hero",
    "Remove EnterpriseOperatingModelCard from hero-section.tsx"
  );
  check(
    hero.includes("Start Enterprise Request"),
    "Hero primary CTA: Start Enterprise Request",
    "Add primary CTA to hero"
  );
  check(
    hero.includes("Explore modules"),
    "Hero secondary CTA: Explore modules",
    "Add secondary CTA to hero"
  );
  check(
    hero.includes("HOMEPAGE_HERO_HEADLINE"),
    "Hero uses centralized headline constant",
    "Wire hero to HOMEPAGE_HERO_HEADLINE"
  );
  check(
    !hero.includes("CrowMotif") && !hero.includes("EnterpriseOperatingModelCard"),
    "Hero avoids side diagram and decorative motes",
    "Remove side card and decorative motes from hero"
  );

  const homepage = fileText("src/lib/constants/homepage.ts");
  check(
    homepage.includes("Build the operating workspace your company actually runs on"),
    "Homepage headline is cleaner single-line style",
    "Update HOMEPAGE_HERO_HEADLINE"
  );
  check(
    homepage.includes("Account required to submit"),
    "Homepage account note present",
    "Add HOMEPAGE_HERO_ACCOUNT_NOTE"
  );
  check(
    homepage.includes("HOMEPAGE_CROW_WORKS_STEPS") && homepage.includes('"Request"'),
    "Five-step How Crow works constants exist",
    "Define HOMEPAGE_CROW_WORKS_STEPS with Request step"
  );
  check(
    homepage.includes("Business Portal Operations"),
    "Five-step flow includes Business Portal Operations",
    "Add step 05 Business Portal Operations"
  );
  check(
    homepage.includes("HOMEPAGE_THREE_WORKSPACES") && homepage.includes("Client Portal"),
    "Three workspaces section constants exist",
    "Define HOMEPAGE_THREE_WORKSPACES"
  );
  check(
    homepage.includes("ProCrow") && homepage.includes("Prepare, govern"),
    "ProCrow workspace explained safely",
    "Add ProCrow to three workspaces"
  );
  check(
    homepage.includes("HOMEPAGE_RUNTIME_ENGINES") &&
      homepage.includes("CyberCrow") &&
      homepage.includes("SAREA"),
    "CEM / CyberCrow / SAREA engine cards defined",
    "Define HOMEPAGE_RUNTIME_ENGINES"
  );

  const howItWorks = fileText("src/components/public/homepage-how-it-works.tsx");
  check(
    howItWorks.includes("How Crow works") && howItWorks.includes("HOMEPAGE_CROW_WORKS_STEPS"),
    "How Crow works section component exists",
    "Create homepage-how-it-works.tsx"
  );

  const threeWs = fileText("src/components/public/homepage-three-workspaces.tsx");
  check(
    threeWs.includes("Three workspaces") && threeWs.includes("HOMEPAGE_THREE_WORKSPACES"),
    "Three workspaces section component exists",
    "Create homepage-three-workspaces.tsx"
  );

  const engines = fileText("src/components/public/homepage-runtime-engines.tsx");
  check(
    engines.includes("HOMEPAGE_RUNTIME_ENGINES") && !engines.includes("CyberCrowCardPreview"),
    "Product engines section without heavy CyberCrow preview card",
    "Simplify homepage-runtime-engines.tsx"
  );

  const publicPage = fileText("src/app/(public)/page.tsx");
  check(
    publicPage.includes("HomepageHowItWorks") &&
      publicPage.includes("HomepageThreeWorkspaces") &&
      publicPage.includes("HomepageRuntimeEngines"),
    "Public page composes new homepage sections",
    "Wire sections in (public)/page.tsx"
  );
  check(
    !publicPage.includes("EnterpriseOperatingModelCard"),
    "Public page does not mount hero side card",
    "Remove EnterpriseOperatingModelCard from page"
  );

  const header = fileText("src/components/public/public-header-nav.tsx");
  check(
    header.includes("Start request") || header.includes("Start Enterprise Request"),
    "Header CTA visible",
    "Add header CTA"
  );

  for (const phrase of FORBIDDEN_OVERCLAIM) {
    const lower = homepage.toLowerCase();
    check(
      !lower.includes(phrase),
      `No overclaim in homepage constants: "${phrase}"`,
      `Remove overclaim from homepage.ts: ${phrase}`
    );
  }

  for (const { file, pattern } of FORBIDDEN_PUBLIC_EXPOSURE) {
    if (existsSync(join(ROOT, file))) {
      const text = fileText(file);
      check(!pattern.test(text), `No public ProCrow/admin exposure in ${file}`, `Remove admin links from ${file}`);
    }
  }

  const middleware = existsSync(join(ROOT, "src/middleware.ts"))
    ? fileText("src/middleware.ts")
    : "";
  const authGuard = existsSync(join(ROOT, "src/lib/auth/route-guards.ts"))
    ? fileText("src/lib/auth/route-guards.ts")
    : "";
  check(
    middleware.length > 0 || authGuard.length > 0,
    "Auth/route guard files unchanged (still present)",
    "Unexpected removal of auth guards"
  );

  console.log(pass ? "\nA1.1 public homepage visual reset: PASSED\n" : "\nA1.1 public homepage visual reset: FAILED\n");
  return pass;
}

const success = main();
process.exit(success ? 0 : 1);
