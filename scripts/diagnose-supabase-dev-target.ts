/**
 * Safe Supabase development target diagnostics (no secrets logged).
 * Run: npx tsx scripts/diagnose-supabase-dev-target.ts
 */
import { FORBIDDEN_HOSTED_SUPABASE_REFS } from "./lib/local-database-safety";

type Check = { name: string; ok: boolean; detail: string };

function parseProjectRef(url: string | undefined): string | null {
  if (!url?.trim()) return null;
  try {
    const host = new URL(url).hostname;
    const match = host.match(/^([a-z0-9]+)\.supabase\.co$/i);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

async function dnsResolves(hostname: string): Promise<boolean> {
  try {
    const { lookup } = await import("node:dns/promises");
    await lookup(hostname);
    return true;
  } catch {
    return false;
  }
}

async function httpsReachable(url: string): Promise<{ ok: boolean; status?: number }> {
  try {
    const res = await fetch(`${url}/auth/v1/health`, { method: "GET" });
    return { ok: res.ok || res.status === 401, status: res.status };
  } catch {
    return { ok: false };
  }
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const ref = parseProjectRef(url);
  const checks: Check[] = [];

  checks.push({
    name: "NEXT_PUBLIC_SUPABASE_URL set",
    ok: Boolean(url?.trim()),
    detail: url ? "present" : "missing",
  });

  checks.push({
    name: "hostname is *.supabase.co",
    ok: Boolean(ref),
    detail: ref ? `${ref}.supabase.co` : "invalid or missing",
  });

  if (ref) {
    checks.push({
      name: "not documented Preview/Production ref",
      ok: !FORBIDDEN_HOSTED_SUPABASE_REFS.has(ref),
      detail: FORBIDDEN_HOSTED_SUPABASE_REFS.has(ref)
        ? "matches hosted production ref — do not use for C3 local proof"
        : "not in forbidden hosted ref list",
    });

    const hostname = `${ref}.supabase.co`;
    const dnsOk = await dnsResolves(hostname);
    checks.push({
      name: "DNS resolves",
      ok: dnsOk,
      detail: dnsOk ? "resolved" : "ENOTFOUND / lookup failed",
    });

    if (dnsOk) {
      const reach = await httpsReachable(`https://${hostname}`);
      checks.push({
        name: "HTTPS auth health reachable",
        ok: reach.ok,
        detail: reach.status ? `HTTP ${reach.status}` : "unreachable",
      });
    }
  }

  const publishable =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  checks.push({
    name: "public key configured",
    ok: Boolean(publishable?.trim()),
    detail: publishable ? "present (not logged)" : "missing",
  });

  checks.push({
    name: "service role configured for local onboarding",
    ok: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
    detail: process.env.SUPABASE_SERVICE_ROLE_KEY ? "present (not logged)" : "missing",
  });

  console.log("\n=== Supabase development target diagnostics ===\n");
  let passed = true;
  for (const c of checks) {
    const mark = c.ok ? "✓" : "✗";
    console.log(`  ${mark} ${c.name}: ${c.detail}`);
    if (!c.ok) passed = false;
  }

  if (!passed && ref === "qnujbwfztmrmsvkugvot") {
    console.log(
      "\n  Product-owner action: replace stale ref qnujbwfztmrmsvkugvot in .env.local with a" +
        " dedicated active development Supabase project (not wbwnsndcxrgyqwppurms production)."
    );
  }

  console.log(passed ? "\nSupabase dev target: OK\n" : "\nSupabase dev target: BLOCKED\n");
  process.exit(passed ? 0 : 1);
}

main();
