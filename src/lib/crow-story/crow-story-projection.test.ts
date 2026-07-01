import assert from "node:assert/strict";

import { projectCrowStoryState } from "./projection";

const s = projectCrowStoryState({
  chapterKey: "idea",
  chapterProgress: 0.9,
  journey: null,
  deviceMode: "DESKTOP_STICKY",
  motionMode: "FULL",
});
assert.equal(s.crowPose, "perch");
console.log("crow-story-projection:test PASS");
