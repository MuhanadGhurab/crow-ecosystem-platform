import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const decision = readFileSync(
  join(process.cwd(), "src/components/crow-story/crow-story-decision.tsx"),
  "utf8",
);
assert.ok(decision.includes("aria-pressed"));
assert.ok(decision.includes("Scrolling does not select") === false);
const interactive = readFileSync(
  join(process.cwd(), "src/components/crow-story/crow-story-interactive.tsx"),
  "utf8",
);
assert.ok(interactive.includes('aria-live="polite"'));
assert.ok(interactive.includes("crow-story-actor") || interactive.includes("CrowStoryOperatingMap"));
console.log("crow-story-accessibility:test PASS");
