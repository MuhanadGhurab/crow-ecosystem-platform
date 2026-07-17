import assert from "node:assert/strict";

import { buildSignupHandoffUrl, parseJourneyUrlParam } from "./journey-state";

assert.equal(parseJourneyUrlParam("transform"), "TRANSFORM");
assert.ok(buildSignupHandoffUrl("TRANSFORM").includes("journey=transform"));
console.log("crow-story-journey:test PASS");
