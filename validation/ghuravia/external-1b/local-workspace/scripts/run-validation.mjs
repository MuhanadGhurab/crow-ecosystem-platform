/**
 * GHURAVIA IMPLEMENTATION-ENTRY VALIDATION HARNESS
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const command of [["npm", ["run", "typecheck"]], ["npm", ["run", "test"]]]) {
  const result = spawnSync(command[0], command[1], { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
