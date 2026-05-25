/**
 * Pre-Vercel validation — run before deploy or with staging env file.
 * Usage: npm run validate:vercel-env
 *        node --env-file=.env.staging scripts/validate-vercel-env.mjs
 */
import { readFileSync, existsSync } from "node:fs";

const errors = [];
const warnings = [];
const fixes = [];

function check(name, ok, errMsg, fixMsg) {
  if (!ok) {
    errors.push(`${name}: ${errMsg}`);
    if (fixMsg) fixes.push(fixMsg);
  }
}

const databaseUrl = process.env.DATABASE_URL ?? "";
const directUrl = process.env.DIRECT_URL ?? "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

// Unencoded @ in password breaks postgres URLs (user:pass@host)
if (databaseUrl) {
  const userinfo = databaseUrl.match(/^postgresql:\/\/([^@]+)@/i)?.[1] ?? "";
  if (userinfo.includes("@") || (userinfo.includes(":") && /:[^%]*@/.test(databaseUrl))) {
    const afterColon = userinfo.split(":").slice(1).join(":");
    if (afterColon.includes("@") && !afterColon.includes("%40")) {
      check(
        "DATABASE_URL password",
        false,
        "password contains @ — encode as %40",
        "Change Mkk@1123 → Mkk%401123 in the password segment"
      );
    }
  }
}

check(
  "DATABASE_URL",
  databaseUrl && !/localhost|127\.0\.0\.1/i.test(databaseUrl),
  "must be remote Supabase pooler (not localhost)",
  "Paste Transaction pooler URL (port 6543) from Supabase Dashboard"
);

check(
  "DATABASE_URL pgbouncer",
  !databaseUrl || databaseUrl.includes("pgbouncer=true"),
  "add ?pgbouncer=true for transaction pooler (port 6543)",
  "Append ?pgbouncer=true to DATABASE_URL"
);

check(
  "DIRECT_URL pgbouncer",
  !directUrl || !directUrl.includes("pgbouncer=true"),
  "remove ?pgbouncer=true from DIRECT_URL (session pooler 5432 only)",
  "DIRECT_URL should end at /postgres with no pgbouncer query param"
);

check(
  "pooler hosts (not db.<ref>.supabase.co)",
  !/db\.[a-z0-9]+\.supabase\.co/i.test(databaseUrl) &&
    !/db\.[a-z0-9]+\.supabase\.co/i.test(directUrl),
  "use aws-*-*.pooler.supabase.com — direct db host causes P1001 on Vercel",
  "Supabase Connect → Session (5432) + Transaction (6543) pooler URIs"
);

check(
  "AUTH_DISABLED",
  process.env.AUTH_DISABLED !== "true",
  "must not be true in production",
  "Unset AUTH_DISABLED or set false on Vercel"
);

check(
  "USE_MOCK_DATA",
  process.env.USE_MOCK_DATA !== "true",
  "must not be true in production",
  "Unset USE_MOCK_DATA or set false on Vercel"
);

if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_WEBHOOK_SECRET) {
  warnings.push("STRIPE_WEBHOOK_SECRET missing (use STRIPE_ not TRIPE_)");
}

if (existsSync(".env.production.example")) {
  const example = readFileSync(".env.production.example", "utf8");
  if (/sb_secret_|re_[a-zA-Z0-9_]{10,}/.test(example)) {
    errors.push(
      ".env.production.example contains real-looking secrets — use placeholders only"
    );
    fixes.push("Restore .env.production.example from git; keep secrets in .env.staging only");
  }
}

if (!siteUrl || siteUrl.includes("your-app.vercel.app")) {
  warnings.push("NEXT_PUBLIC_SITE_URL is placeholder — set after first deploy and redeploy");
}

if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  errors.push("Missing Supabase anon/publishable key");
}

console.log("\n=== Vercel pre-deploy validation ===\n");

if (fixes.length) {
  console.log("Suggested fixes:");
  fixes.forEach((f) => console.log(`  → ${f}`));
  console.log("");
}

if (warnings.length) {
  console.log("Warnings:");
  warnings.forEach((w) => console.log(`  ⚠ ${w}`));
  console.log("");
}

if (errors.length) {
  console.log("Blockers:");
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  console.log("\nSee docs/internal/P2_STAGING_PREP.md\n");
  process.exit(1);
}

console.log("✓ Vercel env structure OK — paste into Vercel if not already.\n");
