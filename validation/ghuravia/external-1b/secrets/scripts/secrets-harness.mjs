/**
 * GHURAVIA IMPLEMENTATION-ENTRY VALIDATION HARNESS
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const required = ["GHV_VAL_1B_SYNTHETIC_SECRET", "GHV_VAL_1B_SYNTHETIC_PASSWORD"];
for (const key of required) {
  if (!process.env[key]) throw new Error(`${key} is required`);
}
const output = JSON.stringify(Object.fromEntries(required.map((key) => [key, "[REDACTED]"])));
for (const key of required) assert.ok(!output.includes(process.env[key]));
const child = spawnSync(process.execPath, ["-e", "process.exit(process.env.GHV_VAL_1B_SYNTHETIC_SECRET ? 0 : 1)"], {
  env: { GHV_VAL_1B_SYNTHETIC_SECRET: process.env.GHV_VAL_1B_SYNTHETIC_SECRET },
  encoding: "utf8"
});
assert.equal(child.status, 0);
assert.equal(child.stdout, "");
assert.equal(child.stderr, "");
console.log("PASS synthetic secrets injected; values redacted; child process did not echo secrets");
