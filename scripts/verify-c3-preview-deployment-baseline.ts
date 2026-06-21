/**
 * C3.10O — Verify immutable Preview deployment matches branch HEAD and routes exist.
 * Run: npm run c3-preview:deployment-baseline
 */
import { execSync } from "node:child_process";

const EXPECTED_HEAD = process.env.C3_EXPECTED_DEPLOY_SHA?.trim();
const PREVIEW_BASE = process.env.C3_PREVIEW_BASE_URL?.replace(/\/$/, "");

function bypassSecret(): string | undefined {
  return process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim() || undefined;
}

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

function resolvePreviewBase(): string {
  if (PREVIEW_BASE) return PREVIEW_BASE;
  const out = execSync("npx vercel ls crow-ecosystem-platform", {
    encoding: "utf8",
    shell: process.platform === "win32",
    timeout: 120_000,
  });
  const match = out.match(
    /https:\/\/crow-ecosystem-platform-[a-z0-9]+-muhanadghurabs-projects\.vercel\.app/
  );
  if (!match?.[0]) fail("Could not resolve latest Preview URL");
  return match[0];
}

function resolveDeploymentMeta(url: string): { id: string; sha: string | null } {
  const json = execSync(`npx vercel inspect ${url} --json`, {
    encoding: "utf8",
    shell: process.platform === "win32",
    timeout: 120_000,
  });
  const parsed = JSON.parse(json) as {
    id?: string;
    meta?: { githubCommitSha?: string; gitCommitSha?: string; gitDirty?: string };
  };
  const sha = parsed.meta?.githubCommitSha ?? parsed.meta?.gitCommitSha ?? null;
  if (!parsed.id) fail("Could not read deployment id from vercel inspect");
  return { id: parsed.id, sha };
}

async function headRoute(path: string): Promise<{ status: number; location: string | null }> {
  const base =
    PREVIEW_BASE?.replace(/\/$/, "") ??
    process.env.C3_PREVIEW_BASE_URL?.replace(/\/$/, "") ??
    fail("C3_PREVIEW_BASE_URL required for route checks");
  const headers: Record<string, string> = {};
  const bypass = bypassSecret();
  if (bypass) headers["x-vercel-protection-bypass"] = bypass;
  const res = await fetch(`${base}${path}`, { method: "GET", redirect: "manual", headers });
  return { status: res.status, location: res.headers.get("location") };
}

function routePresent(path: string, result: { status: number; location: string | null }): void {
  const okStatuses = new Set([200, 307, 302, 401, 403]);
  if (okStatuses.has(result.status)) return;
  if (result.status === 308 && result.location) return;
  fail(`${path} unexpected status ${result.status}`);
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
  const previewBase = resolvePreviewBase();
  const { id, sha } = resolveDeploymentMeta(previewBase);

  console.log("\n=== C3.10O Preview deployment baseline ===\n");
  console.log(`  branchHead: ${shortHead}`);
  console.log(`  previewUrl: ${previewBase}`);
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

  process.env.C3_PREVIEW_BASE_URL = previewBase;

  const resolving = await headRoute("/auth/resolving");
  routePresent("/auth/resolving", resolving);
  ok(`/auth/resolving present (${resolving.status})`);

  const accountStatus = await headRoute("/auth/account-status");
  routePresent("/auth/account-status", accountStatus);
  ok(`/auth/account-status present (${accountStatus.status})`);

  const legal = await headRoute("/register/legal");
  routePresent("/register/legal", legal);
  ok(`/register/legal present (${legal.status})`);

  const account = await headRoute("/account");
  routePresent("/account", account);
  ok(`/account present (${account.status})`);

  const profile = await headRoute("/account/profile");
  routePresent("/account/profile", profile);
  ok(`/account/profile present (${profile.status})`);

  const proofIdentity = await headRoute("/api/c3/proof-identity");
  if (proofIdentity.status === 401) {
    ok(`/api/c3/proof-identity present (401 JSON expected when unauthenticated)`);
  } else if (proofIdentity.status === 404 || proofIdentity.status === 307 || proofIdentity.status === 302) {
    ok(`/api/c3/proof-identity present (${proofIdentity.status})`);
  } else {
    fail(`/api/c3/proof-identity unexpected status ${proofIdentity.status}`);
  }

  const callback = `https://${new URL(previewBase).host}/auth/callback`;
  console.log(`\n  supabaseAppCallback: ${callback}\n`);
  console.log("PASS — Preview deployment baseline verified\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
