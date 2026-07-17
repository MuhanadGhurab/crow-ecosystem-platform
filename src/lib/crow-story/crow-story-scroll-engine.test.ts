import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { progressInRange, interpolateKeyframes, quadraticBezierPoint } from "./interpolation";

assert.ok(Math.abs(progressInRange(0.5, 0.2, 0.8) - 0.5) < 0.001);
assert.ok(progressInRange(0.1, 0.2, 0.8) === 0);
assert.ok(progressInRange(0.9, 0.2, 0.8) === 1);

const kf = interpolateKeyframes(0.5, [
  { at: 0, value: 0 },
  { at: 1, value: 100 },
]);
assert.ok(kf > 80 && kf < 95, `eased midpoint expected ~87.5, got ${kf}`);

const pt = quadraticBezierPoint(0.5, { x: 0, y: 0 }, { x: 50, y: 100 }, { x: 100, y: 0 });
assert.ok(pt.x > 40 && pt.x < 60);

const engine = readFileSync(join(process.cwd(), "src/lib/crow-story/use-story-scroll-engine.ts"), "utf8");
assert.ok(engine.includes("requestAnimationFrame"), "rAF scroll loop required");
assert.ok(engine.includes("IntersectionObserver"), "IO for chapter detection required");
assert.ok(engine.includes("passive: true"), "passive scroll listener required");

const interactive = readFileSync(
  join(process.cwd(), "src/components/crow-story/crow-story-interactive.tsx"),
  "utf8",
);
assert.ok(interactive.includes("useStoryScrollEngine"));
assert.ok(interactive.includes("projectFullStoryState"));

console.log("crow-story-scroll-engine:test PASS");
