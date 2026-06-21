/**
 * C3 Crow brand identity assertions.
 * Run: npx tsx src/lib/brand/crow-brand-identity.test.ts
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function assert(condition: boolean, label: string): void {
  if (!condition) throw new Error(`FAIL: ${label}`);
  console.log(`  ✓ ${label}`);
}

function main(): void {
  console.log("crow-brand-identity.test\n");

  const heroBg = read("src/components/brand/crow-hero-background.tsx");
  assert(heroBg.includes("export function CrowHeroBackground"), "Crow hero background renders");
  assert(heroBg.includes('aria-hidden={true}') || heroBg.includes("aria-hidden"), "Decorative aria-hidden");

  const publicMark = read("src/components/public/brand/crow-mark.tsx");
  assert(publicMark.includes('aria-label="Crow Ecosystem home"'), "Logo accessible name");

  const globals = read("src/app/globals.css");
  assert(
    globals.includes("prefers-reduced-motion") && globals.includes("crow-hero-ambient"),
    "Reduced-motion removes ambient movement",
  );
  assert(
    globals.includes("crow-hero-mark") && globals.includes("max-width: 640px"),
    "Mobile uses simplified hero mark",
  );

  const heroSection = read("src/components/public/hero-section.tsx");
  const headlineIdx = heroSection.indexOf("HOMEPAGE_HERO_HEADLINE");
  const primaryCtaIdx = heroSection.indexOf("HOMEPAGE_PRIMARY_CTA");
  const secondaryCtaIdx = heroSection.indexOf("HOMEPAGE_SECONDARY_CTA");
  assert(headlineIdx > 0 && primaryCtaIdx > headlineIdx, "CTA hierarchy: headline before primary CTA");
  assert(secondaryCtaIdx > primaryCtaIdx, "CTA hierarchy: primary before secondary");
  assert(heroSection.indexOf("CrowHeroBackground") < headlineIdx, "Hero content order after background");

  const homepageVerify = read("scripts/verify-public-homepage-visual-reset.ts");
  assert(homepageVerify.includes("HOMEPAGE_HERO_HEADLINE"), "Homepage verifier constants intact");

  assert(!heroBg.match(/\.(mp4|webm|gif)/i), "No large video/GIF in hero background");
  assert(!heroSection.includes("<video"), "No video element in hero section");
  assert(!heroBg.toLowerCase().includes("webgl"), "No WebGL in hero background");

  const loading = read("src/components/brand/crow-loading-mark.tsx");
  const svgPaths = read("src/components/brand/crow-svg-paths.ts");
  assert(
    loading.includes("CROW_MOTION_OUTLINE_PATH") && heroBg.includes("crow-svg-paths"),
    "Loader and hero share brand SVG source",
  );
  assert(
    svgPaths.includes("CROW_ARMOR_PLATES") && svgPaths.includes("eye-slit"),
    "Armored plate geometry with slit eye",
  );
  assert(
    read("src/components/brand/crow-mark-svg.tsx").includes("crow-armor-plates"),
    "Mark SVG renders armored plate stack",
  );

  assert(
    loading.includes("sessionStorage") && loading.includes("fade"),
    "Loader stops after page readiness (session gate + fade)",
  );
  assert(!heroBg.includes("authorized") && !heroBg.includes("status-indicator"), "Background not auth/status");

  assert(existsSync(join(ROOT, "src/components/crow-core-lab/crow-brand-lab-section.tsx")), "Arch Lab brand section exists");

  console.log("\nAll crow-brand-identity tests passed.");
}

main();
