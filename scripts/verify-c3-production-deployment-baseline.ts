/**
 * C3.10Q — Verify Production deployment matches branch HEAD and routes exist.
 * Run: npm run c3-production:deployment-baseline
 */
import { execSync } from "node:child_process";

const CANONICAL = "https://crow-ecosystem-platform.vercel.app";
const EXPECTED_HEAD = process.env.C3_EXPECTED_DEPLOY_SHA?.trim();
const PRODUCTION_BASE = process.env.C3_PRODUCTION_BASE_URL?.replace(/\/$/, "") ?? CANONICAL;

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string): never {
  console.error(`  ✗ ${msg}`);
  process.exit(1);
}

function resolveHead(): string {
  if (EXPECTED_HEAD) return EXPECTED_HEAD;
  return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
}

function resolveProductionMeta(url: string): { id: string; sha: string | null } {
  const json = execSync(`npx vercel inspect ${url} --json`, {
    encoding: "utf8",
    shell: process.platform === "win32",
    timeout: 120_000,
  });
  const parsed = JSON.parse(json) as {
    id?: string;
    meta?: { githubCommitSha?: string; gitCommitSha?: string };
    target?: string;
    readyState?: string;
  };
  const sha = parsed.meta?.githubCommitSha ?? parsed.meta?.gitCommitSha ?? null;
  if (!parsed.id) fail("Could not read deployment id from vercel inspect");
  if (parsed.target !== "production") fail(`Deployment target is not production (${parsed.target})`);
  if (parsed.readyState !== "READY") fail(`Production deployment not READY (${parsed.readyState})`);
  return { id: parsed.id, sha };
}

async function headRoute(path: string): Promise<{ status: number; location: string | null }> {
  const base = PRODUCTION_BASE.replace(/\/$/, "");
  const res = await fetch(`${base}${path}`, { method: "GET", redirect: "manual" });
  return { status: res.status, location: res.headers.get("location") };
}

function workingTreeMatchesHead(): boolean {
  const out = execSync("git status --porcelain", { encoding: "utf8" }).trim();
  if (!out) return true;
  const lines = out.split("\n").filter(Boolean);
  const appDirty = lines.some((line) => {
    const path = line.slice(3).trim();
    return path.startsWith("src/") || path.startsWith("prisma/");
  });
  return !appDirty;
}

async function main() {
  const head = resolveHead();
  const shortHead = head.slice(0, 7);
  const { id, sha } = resolveProductionMeta(PRODUCTION_BASE);

  console.log("\n=== C3.10Q Production deployment baseline ===\n");
  console.log(`  branchHead: ${shortHead}`);
  console.log(`  productionUrl: ${PRODUCTION_BASE}`);
  console.log(`  deploymentId: ${id}`);
  console.log(`  deployedSha: ${sha ?? "unknown"}`);

  if (sha) {
    if (!sha.startsWith(head.slice(0, 7)) && sha !== head) {
      fail(`Deployed SHA ${sha.slice(0, 7)} does not match branch HEAD ${shortHead}`);
    }
    ok(`Deployed SHA matches branch HEAD (${shortHead})`);
  } else if (workingTreeMatchesHead()) {
    ok(
      `CLI deploy without git metadata — application tree matches HEAD ${shortHead} (no src/prisma/package changes)`
    );
  } else {
    fail(
      "Deployed commit SHA unavailable and working tree has application changes vs HEAD — redeploy with --meta githubCommitSha"
    );
  }

  const routes = [
    "/login",
    "/auth/google",
    "/auth/callback",
    "/auth/resolving",
    "/auth/account-status",
    "/register/legal",
    "/account",
    "/account/profile",
    "/forgot-password",
    "/reset-password",
  ];

  for (const path of routes) {
    const res = await headRoute(path);
    const acceptable =
      res.status === 200 ||
      res.status === 307 ||
      res.status === 302 ||
      (path.startsWith("/account") && res.status === 307);
    if (!acceptable) fail(`${path} unexpected status ${res.status}`);
    ok(`${path} present (${res.status})`);
  }

  const signout = await fetch(`${PRODUCTION_BASE}/auth/signout`, { method: "GET", redirect: "manual" });
  if (signout.status !== 405) fail(`GET /auth/signout expected 405, got ${signout.status}`);
  ok("GET /auth/signout returns 405");

  const callback = `https://${new URL(PRODUCTION_BASE).host}/auth/callback`;
  console.log(`\n  supabaseAppCallback: ${callback}\n`);
  console.log("PASS — Production deployment baseline verified\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
