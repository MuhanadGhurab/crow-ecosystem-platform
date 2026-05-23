/**
 * Mark all prisma/migrations as applied when the DB was synced via `db push`
 * (P3005: schema not empty, no migration history).
 *
 * Usage: npm run db:migrate:baseline
 * Requires: implementation_requests table exists; no finished migrations yet.
 */
import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function prismaCli(args) {
  return spawnSync("npx", ["prisma", ...args], {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
}

try {
  const schemaRows = await prisma.$queryRaw`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'implementation_requests'
    ) AS ok
  `;
  if (!schemaRows[0]?.ok) {
    console.error(
      "\n✗ Cannot baseline: table implementation_requests is missing.\n" +
        "  Use an empty database, or run npm run db:push then retry.\n"
    );
    process.exit(1);
  }

  let applied = 0;
  try {
    const migRows = await prisma.$queryRaw`
      SELECT count(*)::int AS c
      FROM "_prisma_migrations"
      WHERE finished_at IS NOT NULL
    `;
    applied = Number(migRows[0]?.c ?? 0);
  } catch {
    applied = 0;
  }

  if (applied > 0) {
    console.error(
      `\n✗ Cannot baseline: ${applied} migration(s) already recorded.\n` +
        "  If deploy failed mid-way, use: npx prisma migrate resolve\n"
    );
    process.exit(1);
  }

  const names = readdirSync("prisma/migrations", { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  if (!names.length) {
    console.error("\n✗ No migration folders under prisma/migrations\n");
    process.exit(1);
  }

  console.log(`\n→ Baselining ${names.length} migration(s) (db push → migrate history)\n`);

  for (const name of names) {
    const r = prismaCli(["migrate", "resolve", "--applied", name]);
    if (r.status !== 0) process.exit(r.status ?? 1);
  }

  console.log("\n✓ Baseline complete.\n");
} finally {
  await prisma.$disconnect();
}
