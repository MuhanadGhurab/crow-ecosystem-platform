/**
 * C3 — Crow motion loader identity static verifier.
 * Run: npm run crow-motion-identity:verify
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();

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
  console.log("Crow motion identity verification\n");

  assert(
    existsSync(join(ROOT, "src/components/brand/crow-loading-mark.tsx")),
    "crow-loading-mark.tsx exists",
  );
  assert(
    existsSync(join(ROOT, "src/components/brand/crow-svg-paths.ts")),
    "crow-svg-paths.ts exists",
  );

  const loading = read("src/components/brand/crow-loading-mark.tsx");
  assert(loading.includes("CROW_MOTION_OUTLINE_PATH"), "Loader uses shared motion outline path");
  assert(loading.includes("prefers-reduced-motion"), "Loader respects reduced motion");
  assert(
    loading.includes("sessionStorage") || loading.includes("SESSION_KEY"),
    "Loader uses session storage gate",
  );
  assert(loading.includes("aria-hidden"), "Loader mark is decorative (aria-hidden)");
  assert(!loading.includes("setInterval"), "Loader avoids perpetual interval animation");

  const globals = read("src/app/globals.css");
  assert(globals.includes("crow-motion-stroke"), "Motion stroke CSS class exists");
  assert(globals.includes("crow-loader-bar"), "Loader progress bar CSS exists");
  assert(globals.includes("@keyframes crow-motion-draw"), "Motion draw keyframes exist");

  const heroBg = read("src/components/brand/crow-hero-background.tsx");
  assert(
    heroBg.includes("CROW_PROFILE_PATH") || heroBg.includes("crow-svg-paths"),
    "Hero shares brand geometry with loader",
  );

  const svgPaths = read("src/components/brand/crow-svg-paths.ts");
  assert(
    svgPaths.includes("CROW_MOTION_OUTLINE_PATH") && svgPaths.includes("CROW_PROFILE_PATH"),
    "Single SVG path source for motion + hero",
  );

  console.log("\nCrow motion identity: PASSED");
}

main();
