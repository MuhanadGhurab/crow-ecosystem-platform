import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx?|jsx?)$/.test(name)) out.push(full);
  }
  return out;
}

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

console.log("public-v2-bundle-containment:verify");

const FORBIDDEN = [
  "@/lib/crow-story",
  "@/components/crow-story",
  "useStoryScrollEngine",
  "crow-story-interactive",
  "@prisma/client",
  "persistCommittedJourney",
  "persistSoftJourney",
];

test("preview route is presentation-only", () => {
  const page = read("src/app/preview/public-home/page.tsx");
  for (const token of FORBIDDEN) {
    assert.ok(!page.includes(token), `page contains ${token}`);
  }
});

test("public-v2 components contain no forbidden imports", () => {
  const componentDir = join(root, "src/components/public-v2");
  const libDir = join(root, "src/lib/public-v2");
  const files = [...walk(componentDir), ...walk(libDir)].filter(
    (f) => !f.endsWith(".test.ts")
  );
  for (const abs of files) {
    const rel = abs.slice(root.length + 1).replace(/\\/g, "/");
    const src = read(rel);
    for (const token of FORBIDDEN) {
      assert.ok(!src.includes(token), `${rel} contains ${token}`);
    }
  }
});

test("homepage bundle not modified for public-v2", () => {
  const home = read("src/app/(public)/page.tsx");
  assert.ok(!home.includes("public-v2"));
});

console.log("public-v2-bundle-containment:verify PASS");
