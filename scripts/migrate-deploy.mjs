/**
 * Production migrate: deploy, then auto-baseline on P3005 (db push without history).
 * Used by vercel.json buildCommand and npm run db:migrate:deploy.
 */
import "./assert-remote-database-url.mjs";
import { spawnSync } from "node:child_process";

function runMigrateDeploy() {
  return spawnSync("npx", ["prisma", "migrate", "deploy"], {
    encoding: "utf8",
    shell: process.platform === "win32",
    env: process.env,
  });
}

let result = runMigrateDeploy();
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);

const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;

if (result.status !== 0 && /P1000/i.test(output)) {
  console.error(
    "\n✗ Database authentication failed (P1000). Vercel cannot finish migrate deploy.\n" +
      "  Reset password in Supabase → Database → Connect → copy fresh Session + Transaction URIs.\n" +
      "  Ensure NEXT_PUBLIC_SUPABASE_URL matches the same project as DATABASE_URL.\n" +
      "  Local check: npm run db:test\n"
  );
  process.exit(1);
}

if (result.status !== 0 && /P3005/.test(output)) {
  console.log(
    "\n→ Database has tables but no migration history (typical after db push). Baselining…\n"
  );
  const baseline = spawnSync("node", ["scripts/baseline-migrations-from-push.mjs"], {
    stdio: "inherit",
    env: process.env,
  });
  if (baseline.status !== 0) process.exit(baseline.status ?? 1);

  result = runMigrateDeploy();
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
}

process.exit(result.status ?? 1);
