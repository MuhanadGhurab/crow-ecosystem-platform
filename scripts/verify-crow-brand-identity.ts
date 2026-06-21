/**
 * C3 — Crow brand identity & homepage integration static verifier.
 * Run: npm run crow-brand-identity:verify
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";

import { countMigrationSql } from "./lib/migration-baseline";

const ROOT = process.cwd();

const REQUIRED_FILES = [
  "src/components/brand/types.ts",
  "src/components/brand/crow-svg-paths.ts",
  "src/components/brand/crow-mark-svg.tsx",
  "src/components/brand/crow-mark.tsx",
  "src/components/brand/crow-wordmark.tsx",
  "src/components/brand/crow-hero-background.tsx",
  "src/components/brand/crow-brand-surface.tsx",
  "src/components/brand/crow-loading-mark.tsx",
  "src/components/brand/crow-app-shell.tsx",
  "src/components/brand/index.ts",
  "src/components/crow-core-lab/crow-brand-lab-section.tsx",
  "src/lib/brand/crow-brand-identity.test.ts",
  "docs/architecture/crow-core/c3/C3_CROW_BRAND_AND_HOMEPAGE_IDENTITY.md",
];

const FORBIDDEN_HERO_ASSETS = [
  /\.mp4$/i,
  /\.webm$/i,
  /\.gif$/i,
  /webgl/i,
  /three\.js/i,
  /@react-three/i,
];

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function assert(condition: boolean, label: string, detail?: string): void {
  if (!condition) {
    throw new Error(detail ? `${label}: ${detail}` : label);
  }
  console.log(`  ✓ ${label}`);
}

function main(): void {
  console.log("Crow brand identity verification\n");

  for (const rel of REQUIRED_FILES) {
    assert(existsSync(join(ROOT, rel)), `Required file exists: ${rel}`);
  }

  const migrationCount = countMigrationSql(ROOT);
  const C3_BRAND_MIGRATION_BASELINE = 17; // C1:13 + C2:1 + C3 account + C3 legal + C3 RLS
  assert(
    migrationCount === C3_BRAND_MIGRATION_BASELINE,
    `Migration count unchanged (baseline ${C3_BRAND_MIGRATION_BASELINE}, no new migration)`,
    `found ${migrationCount}`,
  );

  const heroBg = read("src/components/brand/crow-hero-background.tsx");
  assert(heroBg.includes("aria-hidden"), "CrowHeroBackground is aria-hidden");
  assert(heroBg.includes("crow-svg-paths"), "Hero uses shared SVG paths");
  assert(heroBg.includes('intensity = "balanced"'), "Default intensity balanced");
  assert(
    heroBg.includes('position = "center-right"') || heroBg.includes('"center-right"'),
    "Default position center-right",
  );

  const heroSection = read("src/components/public/hero-section.tsx");
  assert(heroSection.includes("CrowHeroBackground"), "Homepage hero uses CrowHeroBackground");
  assert(heroSection.includes("HOMEPAGE_HERO_HEADLINE"), "Hero headline constant preserved");
  assert(heroSection.includes("HOMEPAGE_PRIMARY_CTA"), "Primary CTA preserved");
  assert(heroSection.includes("HOMEPAGE_SECONDARY_CTA"), "Secondary CTA preserved");
  assert(!heroSection.includes("<video"), "No video in hero section");

  const globals = read("src/app/globals.css");
  assert(globals.includes("crow-hero-ambient"), "Hero ambient motion CSS exists");
  assert(globals.includes("prefers-reduced-motion"), "Reduced-motion rules in globals.css");
  assert(
    globals.includes("@media (max-width: 640px)") && globals.includes("crow-hero-network"),
    "Mobile simplification for hero network",
  );

  const archLab = read("src/components/crow-core-lab/architecture-lab-content.tsx");
  assert(archLab.includes("CrowBrandLabSection"), "Architecture Lab includes brand section");

  const brandLab = read("src/components/crow-core-lab/crow-brand-lab-section.tsx");
  assert(
    brandLab.includes("Brand reference prototype"),
    "Architecture Lab labels brand prototype",
  );

  const appShell = read("src/components/brand/crow-app-shell.tsx");
  const loadingMark = read("src/components/brand/crow-loading-mark.tsx");
  assert(appShell.includes("CrowStartupLoader"), "App shell wraps startup loader");
  assert(
    loadingMark.includes("crow-startup-loader-seen") || loadingMark.includes("SESSION_KEY"),
    "Loader session gate present",
  );

  const layout = read("src/app/layout.tsx");
  assert(layout.includes("CrowAppShell"), "Root layout uses CrowAppShell");

  const footer = read("src/components/public/public-footer.tsx");
  assert(footer.includes("CrowMarkSvg"), "Footer uses restrained crow watermark");

  for (const pattern of FORBIDDEN_HERO_ASSETS) {
    assert(!pattern.test(heroBg), `Hero background avoids heavy asset: ${pattern}`);
    assert(!pattern.test(heroSection), `Hero section avoids heavy asset: ${pattern}`);
  }

  const publicMark = read("src/components/public/brand/crow-mark.tsx");
  assert(
    publicMark.includes('from "@/components/brand/crow-mark-svg"'),
    "Public nav mark shares canonical SVG",
  );
  assert(publicMark.includes('aria-label="Crow Ecosystem home"'), "Nav logo accessible name");

  const pkg = read("package.json");
  assert(pkg.includes("crow-brand-identity:verify"), "package.json script registered");
  assert(pkg.includes("crow-motion-identity:verify"), "motion verify script registered");

  console.log("\nCrow brand identity: PASSED");
}

main();
