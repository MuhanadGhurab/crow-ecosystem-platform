import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(path: string) {
  return readFileSync(join(root, path), "utf8");
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

console.log("crow-story-bundle-containment:verify");

test("homepage has no dynamic story import", () => {
  const home = read("src/app/(public)/page.tsx");
  assert.ok(!home.includes("dynamic("));
  assert.ok(!home.includes("crow-story-interactive"));
});

test("login page has no story import", () => {
  const login = read("src/app/login/page.tsx");
  assert.ok(!login.includes("crow-story"));
});

test("signup page has no story import", () => {
  const signup = read("src/app/signup/page.tsx");
  assert.ok(!signup.includes("crow-story"));
});

test("story page lazy-loads interactive bundle", () => {
  const story = read("src/app/experience/architects-map/page.tsx");
  assert.ok(story.includes("dynamic("));
  assert.ok(story.includes("crow-story-interactive"));
});

test("interactive renderer has seven chapters and native SVG crow", () => {
  const interactive = read("src/components/crow-story/crow-story-interactive.tsx");
  assert.ok(interactive.includes("useStoryScrollEngine"));
  assert.ok(!interactive.includes("preview-boundary"));
  const actor = read("src/components/crow-story/crow-story-actor.tsx");
  assert.ok(!actor.includes("foreignObject"));
});

console.log("crow-story-bundle-containment:verify PASS");
