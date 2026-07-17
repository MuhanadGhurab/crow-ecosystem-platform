#!/usr/bin/env tsx
/**
 * FTGP.1G/1H — Owner browser proof gate (artifact-backed).
 */
import { execSync } from "node:child_process";

function main() {
  execSync("npx tsx scripts/verify-ftgp-client-owner-browser-proof.ts", {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
}

main();
