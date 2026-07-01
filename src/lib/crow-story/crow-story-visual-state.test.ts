import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { CROW_STORY_CHAPTER_ORDER } from "./chapter-order";
import { CROW_STORY_DEFINITION } from "./definition";
import {
  isCrowGlyphPhase,
  isCrowVisible,
  projectFullStoryState,
  projectCrowStoryState,
} from "./projection";

assert.equal(CROW_STORY_DEFINITION.chapters.length, 7);

const interactive = readFileSync(
  join(process.cwd(), "src/components/crow-story/crow-story-interactive.tsx"),
  "utf8",
);
assert.ok(!interactive.includes("preview-boundary"), "preview placeholder must be removed");
assert.ok(!interactive.includes("Chapters 3–7"), "future chapter placeholder copy removed");

for (const key of CROW_STORY_CHAPTER_ORDER) {
  const ch = CROW_STORY_DEFINITION.chapters.find((c) => c.key === key);
  assert.ok(ch, `chapter ${key} defined`);
}

const ideaMid = projectCrowStoryState({
  chapterKey: "idea",
  chapterProgress: 0.6,
  journey: null,
  deviceMode: "DESKTOP_STICKY",
  motionMode: "FULL",
});
assert.ok(isCrowVisible(ideaMid), "Crow visible during chapter 1");
assert.ok(ideaMid.crowOpacity > 0.5);
assert.ok(ideaMid.crowX <= 1200 && ideaMid.crowX >= 0, "Crow inside stage bounds");

const workFull = projectFullStoryState({
  progressByChapter: { idea: 1, choice: 1, signals: 1, people: 1, work: 1 },
  activeChapterKey: "work",
  journey: "NEW",
  deviceMode: "DESKTOP_STICKY",
  motionMode: "FULL",
});
assert.ok(workFull.workflowPathProgress >= 0.99);
assert.equal(workFull.crowPose, "workflow-trace");

const trustCrystallize = projectFullStoryState({
  progressByChapter: { idea: 1, choice: 1, signals: 1, people: 1, work: 1, trust: 0.95 },
  activeChapterKey: "trust",
  journey: "TRANSFORM",
  deviceMode: "DESKTOP_STICKY",
  motionMode: "FULL",
});
assert.ok(trustCrystallize.blueprintProgress > 0.7);
assert.ok(trustCrystallize.watchPoints.length >= 4);

const runtimeActive = projectFullStoryState({
  progressByChapter: Object.fromEntries(CROW_STORY_CHAPTER_ORDER.map((k) => [k, 1])) as Record<
    string,
    number
  >,
  activeChapterKey: "runtime",
  journey: "NEW",
  deviceMode: "DESKTOP_STICKY",
  motionMode: "FULL",
});
assert.ok(runtimeActive.runtimeActivity);
assert.ok(isCrowGlyphPhase("runtime", 1));

const newChoice = projectCrowStoryState({
  chapterKey: "choice",
  chapterProgress: 1,
  journey: "NEW",
  deviceMode: "DESKTOP_STICKY",
  motionMode: "FULL",
});
const transformChoice = projectCrowStoryState({
  chapterKey: "choice",
  chapterProgress: 1,
  journey: "TRANSFORM",
  deviceMode: "DESKTOP_STICKY",
  motionMode: "FULL",
});
assert.notEqual(newChoice.newPathEmphasis, transformChoice.newPathEmphasis);
assert.notEqual(newChoice.crowPose, transformChoice.crowPose);

const reverseA = projectCrowStoryState({
  chapterKey: "idea",
  chapterProgress: 0.42,
  journey: null,
  deviceMode: "DESKTOP_STICKY",
  motionMode: "FULL",
});
const reverseB = projectCrowStoryState({
  chapterKey: "idea",
  chapterProgress: 0.42,
  journey: null,
  deviceMode: "DESKTOP_STICKY",
  motionMode: "FULL",
});
assert.deepEqual(
  { x: reverseA.crowX, y: reverseA.crowY, o: reverseA.crowOpacity },
  { x: reverseB.crowX, y: reverseB.crowY, o: reverseB.crowOpacity },
);

console.log("crow-story-visual-state:test PASS");
