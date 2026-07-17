#!/usr/bin/env tsx
/** C3.5 — Read-only HTTP smoke checks for Production and Preview (no mutations). */
const PRODUCTION = "https://crow-ecosystem-platform.vercel.app";
const PREVIEW =
  "https://crow-ecosystem-platform-8rujeaal4-muhanadghurabs-projects.vercel.app";

type Check = {
  label: string;
  url: string;
  expectStatus: number | number[];
  bodyIncludesAny?: string[];
};

async function checkOne(check: Check): Promise<{ label: string; pass: boolean; status: number; note: string }> {
  try {
    const res = await fetch(check.url, { redirect: "manual" });
    const text = await res.text();
    const expected = Array.isArray(check.expectStatus) ? check.expectStatus : [check.expectStatus];
    const statusOk = expected.includes(res.status);
    const bodyOk =
      !check.bodyIncludesAny ||
      check.bodyIncludesAny.some((needle) => text.toLowerCase().includes(needle.toLowerCase()));
    const staleHost = /qnujbwfztmrmsvkugvot/i.test(text);
    return {
      label: check.label,
      pass: statusOk && bodyOk && !staleHost,
      status: res.status,
      note: staleHost ? "stale Supabase hostname detected" : statusOk && bodyOk ? "ok" : "unexpected response",
    };
  } catch (error) {
    return {
      label: check.label,
      pass: false,
      status: 0,
      note: error instanceof Error ? error.message : "fetch failed",
    };
  }
}

async function runSuite(name: string, base: string, checks: Check[]) {
  console.log(`\n${name}:`);
  let allPass = true;
  for (const check of checks) {
    const result = await checkOne(check);
    console.log(`  ${result.pass ? "PASS" : "FAIL"} ${result.label} (${result.status}) — ${result.note}`);
    if (!result.pass) allPass = false;
  }
  return allPass;
}

async function main() {
  console.log("\n=== C3.5 hosted smoke (read-only) ===");

  const common = (base: string): Check[] => [
    { label: "homepage", url: `${base}/`, expectStatus: 200 },
    { label: "health", url: `${base}/api/health`, expectStatus: 200, bodyIncludesAny: ["ok", "deployReady"] },
    { label: "login", url: `${base}/login`, expectStatus: 200 },
    { label: "register gated", url: `${base}/register`, expectStatus: [200, 307] },
  ];

  const prodPass = await runSuite("Production", PRODUCTION, [
    ...common(PRODUCTION),
    { label: "client portal entry", url: `${PRODUCTION}/client`, expectStatus: 307 },
    { label: "admin entry", url: `${PRODUCTION}/admin/overview`, expectStatus: 307 },
    { label: "architecture", url: `${PRODUCTION}/architecture`, expectStatus: 200 },
  ]);

  const previewPass = await runSuite("Preview (protection may apply)", PREVIEW, [
    { label: "homepage", url: `${PREVIEW}/`, expectStatus: 401 },
    { label: "health", url: `${PREVIEW}/api/health`, expectStatus: 401 },
    { label: "login", url: `${PREVIEW}/login`, expectStatus: 401 },
  ]);

  console.log(`\nProduction smoke: ${prodPass ? "PASS" : "FAIL"}`);
  console.log(`Preview smoke: ${previewPass ? "PASS (deployment protection active)" : "FAIL"}\n`);
  process.exit(prodPass && previewPass ? 0 : 1);
}

main();
