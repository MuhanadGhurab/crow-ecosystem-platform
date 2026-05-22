/**
 * M4 CyberCrow rehearsal prep — backfill GRC/evidence for meem-global.
 * Walkthrough: docs/M4_CYBERCROW_REHEARSAL.md
 */
import { spawnSync } from "node:child_process";

console.log("\nM4 CyberCrow rehearsal — see docs/M4_CYBERCROW_REHEARSAL.md\n");

const env = { ...process.env, TENANT_SLUG: process.env.TENANT_SLUG ?? "meem-global" };
const r = spawnSync(
  "npx",
  ["tsx", "--env-file=.env", "scripts/backfill-cybercrow-seed.ts"],
  { stdio: "inherit", env, shell: true }
);

process.exit(r.status ?? 1);
