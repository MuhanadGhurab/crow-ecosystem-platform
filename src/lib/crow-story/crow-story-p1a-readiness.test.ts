import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";

const required = [
  "src/lib/crow-story/definition.ts",
  "src/lib/crow-story/projection.ts",
  "src/lib/crow-story/journey-state.ts",
  "src/app/experience/architects-map/page.tsx",
  "src/app/experience/architects-map/article/page.tsx",
  "src/app/start/page.tsx",
  "src/components/crow-story/crow-story-interactive.tsx",
  "src/components/crow-story/homepage-architects-map-preview.tsx",
  "docs/architecture/crow-core/CROW_STORY_P1A_ARCHITECTURE.md",
];

for (const p of required) {
  assert.ok(existsSync(join(process.cwd(), p)), `missing ${p}`);
}

console.log("crow-story-p1a-readiness:test PASS");
