/**
 * GHURAVIA IMPLEMENTATION-ENTRY VALIDATION HARNESS
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(here, "../../..");

async function pkg(name) {
  return JSON.parse(await readFile(path.join(workspaceRoot, "packages", name, "package.json"), "utf8"));
}

test("dependency direction is contracts -> domain -> web", async () => {
  const [contracts, domain, web] = await Promise.all(["contracts", "domain", "web"].map(pkg));
  assert.equal(contracts.dependencies, undefined);
  assert.deepEqual(domain.dependencies, { "@ghv-val-1b/contracts": "file:../contracts" });
  assert.deepEqual(Object.keys(web.dependencies).sort(), ["@ghv-val-1b/contracts", "@ghv-val-1b/domain"]);
});

test("validation paths are portable through node:path", () => {
  assert.equal(path.basename(path.join("packages", "contracts", "src")), "src");
  assert.ok(workspaceRoot.includes("local-workspace"));
});
