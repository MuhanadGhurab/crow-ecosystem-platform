import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { CROW_STORY_CHAPTER_ORDER } from "./chapter-order";

const required = [
  "src/lib/crow-story/interpolation.ts",
  "src/lib/crow-story/use-story-scroll-engine.ts",
  "src/components/crow-story/crow-story-crow-svg.tsx",
  "src/components/crow-story/crow-story-operating-map.tsx",
  "src/components/crow-story/crow-story-interactive.tsx",
  "docs/architecture/crow-core/CROW_STORY_VISUAL_IMPLEMENTATION.md",
];

for (const p of required) {
  assert.ok(existsSync(join(process.cwd(), p)), `missing ${p}`);
}

const interactive = readFileSync(
  join(process.cwd(), "src/components/crow-story/crow-story-interactive.tsx"),
  "utf8",
);
assert.ok(interactive.includes("chapters.map"), "seven chapter sections rendered");
assert.ok(interactive.includes("useStoryScrollEngine"));
assert.ok(!interactive.includes("preview-boundary"));

const actor = readFileSync(join(process.cwd(), "src/components/crow-story/crow-story-actor.tsx"), "utf8");
assert.ok(!actor.includes("foreignObject"), "Crow must use native SVG not foreignObject");

const map = readFileSync(
  join(process.cwd(), "src/components/crow-story/crow-story-operating-map.tsx"),
  "utf8",
);
assert.ok(map.includes("strokeDashoffset"), "workflow path scrubbing required");

console.log("crow-story-seven-chapter-readiness:test PASS");
