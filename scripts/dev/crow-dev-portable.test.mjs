/**
 * CROW.DEVFLOW.PORTABLE.1 — portable development safety checks (no secrets, no DB).
 */

import assert from "node:assert/strict";
import {
  getNodeMajor,
  parseEnvKeys,
  detectUnsafeEnvFlags,
  requiredRepoFiles,
  EXPECTED_NODE_MAJOR,
} from "./crow-dev-portable-lib.mjs";

function test(name, fn) {
  return { name, fn };
}

const cases = [
  test("1. Node major parser accepts 24.x", () => {
    assert.equal(getNodeMajor("v24.1.0"), 24);
    assert.equal(EXPECTED_NODE_MAJOR, 24);
  }),

  test("2. parseEnvKeys ignores comments and captures keys without leaking intent", () => {
    const map = parseEnvKeys(`
# secret=should-ignore
CROW_RUNTIME_MODE=alpha_development
CROW_DATA_CLASSIFICATION=demo_only
DATABASE_URL=postgresql://user:password@host/db
`);
    assert.equal(map.get("CROW_RUNTIME_MODE"), "alpha_development");
    assert.equal(map.has("secret"), false);
    assert.ok(map.has("DATABASE_URL"));
  }),

  test("3. detectUnsafeEnvFlags catches commercial / blueprint complete", () => {
    const bad = parseEnvKeys(`
CROW_RUNTIME_MODE=commercial_production
CROW_ALLOW_REAL_CUSTOMER_DATA=true
CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE=1
`);
    const hits = detectUnsafeEnvFlags(bad);
    assert.ok(hits.includes("CROW_RUNTIME_MODE"));
    assert.ok(hits.includes("CROW_ALLOW_REAL_CUSTOMER_DATA"));
    assert.ok(hits.includes("CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE"));
  }),

  test("4. alpha defaults are not flagged unsafe", () => {
    const good = parseEnvKeys(`
CROW_RUNTIME_MODE=alpha_development
CROW_DATA_CLASSIFICATION=demo_only
`);
    assert.deepEqual(detectUnsafeEnvFlags(good), []);
  }),

  test("5. required repo files list includes portable docs and env templates", () => {
    const files = requiredRepoFiles();
    assert.ok(files.includes("docs/crow/development/PORTABLE-ALPHA-DEVELOPMENT-WORKFLOW.md"));
    assert.ok(files.includes(".env.alpha.example"));
    assert.ok(files.includes("AGENTS.md"));
  }),
];

let failed = 0;
for (const c of cases) {
  try {
    c.fn();
    console.log(`PASS ${c.name}`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL ${c.name}`);
    console.error(err);
  }
}
console.log(`FAILED_REQUIRED_GATE_COUNT=${failed}`);
if (failed > 0) process.exit(1);
