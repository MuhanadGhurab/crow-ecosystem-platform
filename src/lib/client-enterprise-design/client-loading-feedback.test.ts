import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

console.log("client-loading-feedback:test");

test("route progress bar component exists", () => {
  const src = readFileSync(join(process.cwd(), "src", "components", "ui", "route-progress-bar.tsx"), "utf8");
  assert.ok(src.includes("role=\"progressbar\""));
  assert.ok(src.includes("aria-busy"));
});

test("pending button blocks duplicate submission", () => {
  const src = readFileSync(join(process.cwd(), "src", "components", "ui", "pending-button.tsx"), "utf8");
  assert.ok(src.includes("disabled={disabled || pending}"));
  assert.ok(src.includes("aria-busy"));
});

test("save status uses aria-live", () => {
  const src = readFileSync(join(process.cwd(), "src", "components", "ui", "save-status-indicator.tsx"), "utf8");
  assert.ok(src.includes("aria-live=\"polite\""));
});

test("journey uses pending submit label", () => {
  const src = readFileSync(
    join(process.cwd(), "src", "components", "client-enterprise-design", "client-design-journey.tsx"),
    "utf8",
  );
  assert.ok(src.includes("Submitting your request"));
  assert.ok(src.includes("Saving your design"));
});

test("sign-in form pending state", () => {
  const src = readFileSync(join(process.cwd(), "src", "components", "portal", "auth", "sign-in-form.tsx"), "utf8");
  assert.ok(src.includes("Signing in"));
  assert.ok(src.includes("aria-busy"));
});

console.log("client-loading-feedback:test PASS");
