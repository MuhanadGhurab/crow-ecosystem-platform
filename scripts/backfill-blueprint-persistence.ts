/**
 * C2 — Blueprint persistence backfill (defaults to dry-run).
 *
 *   npm run blueprint-persistence:backfill              # default: --dry-run
 *   npm run blueprint-persistence:backfill -- --dry-run --tenant <id>
 *   npm run blueprint-persistence:backfill -- --apply --tenant <id>
 */

import { runBlueprintPersistenceBackfill } from "../src/lib/crow-core/blueprint-runtime/blueprint-backfill.service";

function parseArgs(argv: string[]) {
  if (argv.includes("--apply") && argv.includes("--dry-run")) {
    throw new Error("Use either --dry-run or --apply, not both.");
  }
  const dryRun = argv.includes("--dry-run") || !argv.includes("--apply");
  const tenantIdx = argv.indexOf("--tenant");
  const blueprintIdx = argv.indexOf("--blueprint");
  const limitIdx = argv.indexOf("--limit");

  return {
    dryRun,
    tenantId: tenantIdx >= 0 ? argv[tenantIdx + 1] : undefined,
    blueprintId: blueprintIdx >= 0 ? argv[blueprintIdx + 1] : undefined,
    limit: limitIdx >= 0 ? Number(argv[limitIdx + 1]) : undefined,
  };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (!opts.dryRun) {
    console.warn(
      "WARNING: --apply will write version rows. Do not run against hosted Preview/Production without runbook approval."
    );
  }

  const report = await runBlueprintPersistenceBackfill(opts);

  console.log("\n=== Blueprint persistence backfill ===\n");
  console.log(`Mode: ${report.dryRun ? "DRY RUN" : "APPLY"}`);
  console.log(`Processed: ${report.processed}`);
  console.log(`Would create / created: ${report.created}`);
  console.log(`Skipped (existing): ${report.skipped}`);
  console.log(`Unresolved tenant: ${report.unresolved}`);

  for (const row of report.rows) {
    console.log(`- ${row.blueprintId} [${row.action}] ${row.message}`);
  }

  console.log("\nDone.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
