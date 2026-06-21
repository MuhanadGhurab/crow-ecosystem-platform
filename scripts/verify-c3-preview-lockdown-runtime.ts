/**
 * Post-deploy Preview lockdown runtime checks (no secrets).
 * Usage: npx tsx scripts/verify-c3-preview-lockdown-runtime.ts --url https://...
 */
function parseArgs(): string {
  const idx = process.argv.indexOf("--url");
  if (idx === -1 || !process.argv[idx + 1]) {
    console.error("Usage: --url <preview-deployment-url>");
    process.exit(1);
  }
  return process.argv[idx + 1].replace(/\/$/, "");
}

async function expectUnavailable(path: string, base: string): Promise<void> {
  const res = await fetch(`${base}${path}`, { redirect: "manual" });
  if (res.status === 404) {
    console.log(`  ✓ ${path} → 404 (disabled)`);
    return;
  }
  if (res.status === 401 || res.status === 403) {
    console.log(`  ✓ ${path} → ${res.status} (preview gate — route not public)`);
    return;
  }
  throw new Error(`${path} expected unavailable (404/401/403), got ${res.status}`);
}

async function main() {
  const base = parseArgs();
  console.log(`\nPreview lockdown runtime checks: ${base}\n`);
  await expectUnavailable("/auth-canary", base);
  await expectUnavailable("/api/c3/session-proof", base);
  console.log("\nPreview lockdown runtime checks passed.\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
