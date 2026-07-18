/**
 * CROW.GAP004.2 — Redacted Preview vs Production database isolation check.
 *
 * Prints fingerprints / masked hosts / project refs only.
 * Never prints full connection strings, passwords, or tokens.
 * Never connects to a database. Never runs migrations. Never writes data.
 *
 * Usage:
 *   node scripts/safety/check-db-isolation-env.mjs
 *   PRODUCTION_DATABASE_URL=... PREVIEW_DATABASE_URL=... node scripts/safety/check-db-isolation-env.mjs
 *   node scripts/safety/check-db-isolation-env.mjs --production-env-file=.env.production.runtime --preview-env-file=.env.preview.operator
 *
 * Exit codes:
 *   0 — isolation proven (refs/fingerprints differ; Preview ≠ known Production ref)
 *   1 — incomplete evidence, shared, or unsafe
 *   2 — usage / parse error
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const KNOWN_PRODUCTION_SUPABASE_REF = "wbwnsndcxrgyqwppurms";

function maskSegment(value, keepStart = 2, keepEnd = 2) {
  if (!value || value.length <= keepStart + keepEnd + 1) return "***";
  return `${value.slice(0, keepStart)}***${value.slice(-keepEnd)}`;
}

function fingerprintDatabaseUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return {
      provider: "unknown",
      maskedHost: "***",
      maskedDatabase: "***",
      schema: "public",
      port: "?",
      targetHash: createHash("sha256").update("invalid").digest("hex").slice(0, 16),
      supabaseProjectRef: null,
      valid: false,
    };
  }

  const host = parsed.hostname;
  const database = parsed.pathname.replace(/^\//, "") || "postgres";
  const schema = parsed.searchParams.get("schema") ?? "public";
  const supabaseMatch = host.match(/db\.([a-z0-9]+)\.supabase\.co/i);
  const poolerHostMatch = host.match(/postgres\.([a-z0-9]+)\.supabase\.co/i);
  const poolerUserMatch = (parsed.username || "").match(/^postgres\.([a-z0-9]{20,})$/i);
  const projectRef =
    supabaseMatch?.[1] ?? poolerHostMatch?.[1] ?? poolerUserMatch?.[1] ?? null;

  const provider =
    host.includes("supabase.com") || host.includes("supabase.co")
      ? "supabase"
      : host.includes("localhost") || host.includes("127.0.0.1")
        ? "postgres"
        : "postgres";

  const stableId = `${host}|${database}|${schema}|${parsed.port || "5432"}`;
  const targetHash = createHash("sha256").update(stableId).digest("hex").slice(0, 16);

  return {
    provider,
    maskedHost: maskSegment(host, 3, 4),
    maskedDatabase: maskSegment(database, 2, 2),
    schema,
    port: parsed.port || "5432",
    targetHash,
    supabaseProjectRef: projectRef,
    valid: true,
  };
}

function maskRef(ref) {
  if (!ref) return "(none)";
  if (ref.length <= 8) return "***";
  return `${ref.slice(0, 4)}…${ref.slice(-4)}`;
}

function parseEnvFile(path) {
  const abs = resolve(path);
  if (!existsSync(abs)) {
    throw new Error(`Env file not found: ${path}`);
  }
  const text = readFileSync(abs, "utf8");
  /** @type {Record<string, string>} */
  const out = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function parseArgs(argv) {
  /** @type {{ productionEnvFile?: string; previewEnvFile?: string; checkVercelJson: boolean }} */
  const opts = { checkVercelJson: true };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--production-env-file" && argv[i + 1]) {
      opts.productionEnvFile = argv[++i];
    } else if (a === "--preview-env-file" && argv[i + 1]) {
      opts.previewEnvFile = argv[++i];
    } else if (a.startsWith("--production-env-file=")) {
      opts.productionEnvFile = a.slice("--production-env-file=".length);
    } else if (a.startsWith("--preview-env-file=")) {
      opts.previewEnvFile = a.slice("--preview-env-file=".length);
    } else if (a === "--skip-vercel-json") {
      opts.checkVercelJson = false;
    } else if (a === "--help" || a === "-h") {
      console.log(`Usage: node scripts/safety/check-db-isolation-env.mjs [options]

Options:
  --production-env-file=<path>  Load PRODUCTION DATABASE_URL/DIRECT_URL from file
  --preview-env-file=<path>     Load PREVIEW DATABASE_URL/DIRECT_URL from file
  --skip-vercel-json            Skip vercel.json migrate-deploy scan

Env vars (alternative to files):
  PRODUCTION_DATABASE_URL / PRODUCTION_DIRECT_URL
  PREVIEW_DATABASE_URL / PREVIEW_DIRECT_URL

Never prints full URLs or secrets.`);
      process.exit(0);
    }
  }
  return opts;
}

function summarizeLabel(label, url) {
  if (!url || !url.trim()) {
    return { label, present: false, fp: null };
  }
  const fp = fingerprintDatabaseUrl(url.trim());
  return { label, present: true, fp };
}

function printSummary(row) {
  if (!row.present || !row.fp) {
    console.log(`  ${row.label}: MISSING`);
    return;
  }
  const fp = row.fp;
  console.log(
    `  ${row.label}: provider=${fp.provider} host=${fp.maskedHost} db=${fp.maskedDatabase} schema=${fp.schema} port=${fp.port} ref=${maskRef(fp.supabaseProjectRef)} fingerprint=${fp.targetHash} valid=${fp.valid}`,
  );
}

function checkVercelJsonNoMigrate() {
  const path = resolve("vercel.json");
  if (!existsSync(path)) {
    return { ok: false, detail: "vercel.json missing" };
  }
  const text = readFileSync(path, "utf8");
  const hasMigrateDeploy =
    /db:migrate:deploy/.test(text) ||
    /migrate\s+deploy/.test(text) ||
    /prisma\s+migrate\s+deploy/.test(text);
  return {
    ok: !hasMigrateDeploy,
    detail: hasMigrateDeploy
      ? "vercel.json appears to invoke migrate deploy — UNSAFE while GAP-004 open"
      : "vercel.json has no migrate deploy in buildCommand",
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  console.log("check-db-isolation-env (redacted)");
  console.log("KNOWN_PRODUCTION_SUPABASE_REF=" + KNOWN_PRODUCTION_SUPABASE_REF);
  console.log("mode=no-connect; no-migrate; no-write");

  let productionDb = process.env.PRODUCTION_DATABASE_URL?.trim() || "";
  let productionDirect = process.env.PRODUCTION_DIRECT_URL?.trim() || "";
  let previewDb = process.env.PREVIEW_DATABASE_URL?.trim() || "";
  let previewDirect = process.env.PREVIEW_DIRECT_URL?.trim() || "";

  if (opts.productionEnvFile) {
    const env = parseEnvFile(opts.productionEnvFile);
    productionDb = env.DATABASE_URL?.trim() || productionDb;
    productionDirect = env.DIRECT_URL?.trim() || productionDirect;
    console.log(`loaded production env file keys only from: ${opts.productionEnvFile}`);
  }
  if (opts.previewEnvFile) {
    const env = parseEnvFile(opts.previewEnvFile);
    previewDb = env.DATABASE_URL?.trim() || previewDb;
    previewDirect = env.DIRECT_URL?.trim() || previewDirect;
    console.log(`loaded preview env file keys only from: ${opts.previewEnvFile}`);
  }

  const rows = [
    summarizeLabel("PRODUCTION_DATABASE_URL", productionDb),
    summarizeLabel("PRODUCTION_DIRECT_URL", productionDirect),
    summarizeLabel("PREVIEW_DATABASE_URL", previewDb),
    summarizeLabel("PREVIEW_DIRECT_URL", previewDirect),
  ];

  console.log("\nFingerprints (redacted):");
  for (const row of rows) printSummary(row);

  /** @type {string[]} */
  const failures = [];
  /** @type {string[]} */
  const notes = [];

  if (!productionDb) failures.push("PRODUCTION_DATABASE_URL missing");
  if (!previewDb) failures.push("PREVIEW_DATABASE_URL missing");

  const prodFp = productionDb ? fingerprintDatabaseUrl(productionDb) : null;
  const prevFp = previewDb ? fingerprintDatabaseUrl(previewDb) : null;
  const prodDirectFp = productionDirect ? fingerprintDatabaseUrl(productionDirect) : null;
  const prevDirectFp = previewDirect ? fingerprintDatabaseUrl(previewDirect) : null;

  if (prodFp && !prodFp.valid) failures.push("PRODUCTION_DATABASE_URL unparseable");
  if (prevFp && !prevFp.valid) failures.push("PREVIEW_DATABASE_URL unparseable");

  if (prodFp?.supabaseProjectRef && prevFp?.supabaseProjectRef) {
    if (prodFp.supabaseProjectRef === prevFp.supabaseProjectRef) {
      failures.push(
        `Preview and Production share Supabase project ref (${maskRef(prodFp.supabaseProjectRef)})`,
      );
    } else {
      notes.push("Supabase project refs differ (primary isolation signal)");
    }
  } else if (prodFp && prevFp && prodFp.targetHash === prevFp.targetHash) {
    // Without project refs, identical host/db/schema/port fingerprints imply shared target.
    failures.push("Preview and Production DATABASE_URL fingerprints are identical (no project refs to disambiguate)");
  }

  if (prevFp?.supabaseProjectRef === KNOWN_PRODUCTION_SUPABASE_REF) {
    failures.push(
      "PREVIEW_DATABASE_URL resolves to known Production Supabase ref wbwnsndcxrgyqwppurms",
    );
  }

  // Fingerprint equality is only a hard failure when project refs are missing or equal.
  // Shared Supabase pooler hostnames can yield identical host|db|schema|port hashes across refs.
  const refsDiffer =
    Boolean(prodFp?.supabaseProjectRef) &&
    Boolean(prevFp?.supabaseProjectRef) &&
    prodFp.supabaseProjectRef !== prevFp.supabaseProjectRef;

  if (prodFp && prevFp && prodFp.targetHash === prevFp.targetHash && !refsDiffer) {
    failures.push("DATABASE_URL target fingerprints match (not isolated)");
  }

  if (
    prodDirectFp &&
    prevDirectFp &&
    prodDirectFp.targetHash === prevDirectFp.targetHash
  ) {
    const directRefsDiffer =
      Boolean(prodDirectFp.supabaseProjectRef) &&
      Boolean(prevDirectFp.supabaseProjectRef) &&
      prodDirectFp.supabaseProjectRef !== prevDirectFp.supabaseProjectRef;
    if (!directRefsDiffer) {
      failures.push("DIRECT_URL target fingerprints match (not isolated)");
    }
  }

  if (prodDirectFp?.supabaseProjectRef && prevDirectFp?.supabaseProjectRef) {
    if (prodDirectFp.supabaseProjectRef === prevDirectFp.supabaseProjectRef) {
      failures.push("DIRECT_URL Preview/Production share Supabase project ref");
    }
  }

  let vercelOk = true;
  if (opts.checkVercelJson) {
    const v = checkVercelJsonNoMigrate();
    console.log(`\nvercel.json: ${v.detail}`);
    if (!v.ok) {
      vercelOk = false;
      failures.push(v.detail);
    }
  }

  console.log("\nNotes:");
  if (notes.length === 0 && failures.length === 0) console.log("  (none)");
  for (const n of notes) console.log(`  · ${n}`);

  console.log("\nFailures:");
  if (failures.length === 0) console.log("  (none)");
  for (const f of failures) console.log(`  · ${f}`);

  const isolationProven =
    failures.length === 0 &&
    Boolean(prodFp?.valid) &&
    Boolean(prevFp?.valid) &&
    vercelOk &&
    prevFp.supabaseProjectRef !== KNOWN_PRODUCTION_SUPABASE_REF &&
    (refsDiffer ||
      (prodFp.targetHash !== prevFp.targetHash &&
        Boolean(prodFp.supabaseProjectRef || prevFp.supabaseProjectRef)));


  console.log("\nCounters:");
  console.log(`PREVIEW_DATABASE_ISOLATION_PROVEN_COUNT=${isolationProven ? 1 : 0}`);
  console.log("UNAUTHORIZED_MIGRATION_COUNT=0");
  console.log("HOSTED_BUSINESS_WRITE_COUNT=0");
  console.log("PRODUCTION_DATABASE_MIGRATION_COUNT=0");
  console.log("PRODUCTION_DATABASE_WRITE_COUNT=0");
  console.log(
    "NOTE: Local operator env-file comparison is not a substitute for Vercel dashboard Preview vs Production binding proof.",
  );

  if (!isolationProven) {
    console.log("\nRESULT=BLOCKED — isolation not proven from provided inputs");
    process.exit(1);
  }

  console.log("\nRESULT=READY — isolation proven from provided redacted fingerprints");
  process.exit(0);
}

main();
