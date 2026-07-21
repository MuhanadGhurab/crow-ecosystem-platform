/**
 * GHURAVIA IMPLEMENTATION-ENTRY VALIDATION HARNESS
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */

import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../../");
const vercel = JSON.parse(await readFile(path.join(root, "vercel.json"), "utf8"));
assert.equal(vercel?.git?.deploymentEnabled?.["feat/ghuravia-foundation"], false);
await assert.rejects(access(path.join(root, ".github", "workflows")));
console.log("PASS automatic Preview disabled; no deployment workflow");
