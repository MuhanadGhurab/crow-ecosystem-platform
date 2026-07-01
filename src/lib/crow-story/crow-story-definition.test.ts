import assert from "node:assert/strict";

import { CROW_STORY_DEFINITION } from "./definition";
import { parseJourneyUrlParam } from "./journey-state";

assert.equal(CROW_STORY_DEFINITION.chapters.length, 7);
assert.equal(parseJourneyUrlParam("new"), "NEW");
console.log("crow-story-definition:test PASS");
