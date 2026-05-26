/**
 * Phase F2 — report staging env readiness without printing secrets.
 * Usage: node --env-file=.env.staging scripts/f2-env-status.mjs
 */
const REQUIRED = [
  "DATABASE_URL",
  "DIRECT_URL",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const OPTIONAL = [
  "TURNSTILE_ENABLED",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "TURNSTILE_SECRET_KEY",
  "RESEND_API_KEY",
];

function status(name) {
  const v = process.env[name];
  if (!v?.trim()) return { name, state: "missing" };
  if (name.includes("SECRET") || (name.includes("KEY") && !name.startsWith("NEXT_PUBLIC"))) {
    return { name, state: "set", detail: `${v.trim().length} chars` };
  }
  if (name === "DATABASE_URL" || name === "DIRECT_URL") {
    try {
      const u = new URL(v.replace(/^postgresql:/, "http:"));
      return { name, state: "set", detail: u.hostname };
    } catch {
      return { name, state: "set", detail: "(parse failed)" };
    }
  }
  return { name, state: "set", detail: v.trim() };
}

console.log("\n=== Phase F2 env status (no secrets) ===\n");
console.log("Required:");
for (const k of REQUIRED) {
  const s = status(k);
  console.log(`  ${s.state === "missing" ? "✗" : "✓"} ${k}${s.detail ? `: ${s.detail}` : ""}`);
}
console.log("\nFlags:");
console.log(`  AUTH_DISABLED=${process.env.AUTH_DISABLED ?? "(unset)"}`);
console.log(`  USE_MOCK_DATA=${process.env.USE_MOCK_DATA ?? "(unset)"}`);

console.log("\nTurnstile:");
const te = process.env.TURNSTILE_ENABLED === "true";
const hasSite = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim());
const hasSecret = Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
console.log(`  TURNSTILE_ENABLED=${process.env.TURNSTILE_ENABLED ?? "(unset)"}`);
console.log(`  site key: ${hasSite ? "set" : "missing"}`);
console.log(`  secret key: ${hasSecret ? "set" : "missing"}`);
if (te && (!hasSite || !hasSecret)) {
  console.log("  ✗ Turnstile enabled but keys incomplete");
  process.exitCode = 1;
}

console.log("\nOptional:");
for (const k of OPTIONAL) {
  const s = status(k);
  if (s.state === "missing") console.log(`  - ${k}: not set`);
  else console.log(`  ✓ ${k}${s.detail ? `: ${s.detail}` : ""}`);
}

const site = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
if (site && !site.includes("vercel.app") && !site.startsWith("https://")) {
  console.log("\n⚠ NEXT_PUBLIC_SITE_URL should be https:// and match Vercel deployment");
}
if (site) {
  console.log(`\nSupabase redirect to configure: ${site.replace(/\/$/, "")}/auth/callback`);
}

console.log("");
