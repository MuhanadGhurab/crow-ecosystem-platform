/**
 * Attempt revoke + remint shareable link without printing secrets.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const DEPLOYMENT_ID = "dpl_BxDkM28qvy5GWocQynweFAd9ejyN";
const DEPLOYMENT_HOST =
  "crow-ecosystem-platform-by12e7s1m-muhanadghurabs-projects.vercel.app";
const PROJECT_ID = "prj_lsHQMiMZskg8CzRVd4EHfiAo8o7h";
const OUT_PATH = join(process.cwd(), ".env.preview.proof-link");
const TTL_SECONDS = 60 * 60 * 24 * 14;

function loadToken(): string {
  const path = join(
    homedir(),
    "AppData",
    "Roaming",
    "xdg.data",
    "com.vercel.cli",
    "auth.json"
  );
  return JSON.parse(readFileSync(path, "utf8")).token as string;
}

function extractShareUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  for (const key of ["protectionBypassUrl", "protection_bypass_url", "url", "link"]) {
    const value = obj[key];
    if (typeof value === "string" && value.startsWith("http")) return value;
  }
  if (typeof obj.secret === "string") {
    const u = new URL(`https://${DEPLOYMENT_HOST}/login`);
    u.searchParams.set("_vercel_share", obj.secret);
    return u.toString();
  }
  return null;
}

async function api(
  token: string,
  method: string,
  path: string,
  body?: Record<string, unknown>,
  teamId?: string
): Promise<{ status: number; payload: unknown }> {
  const qs = teamId ? `?teamId=${encodeURIComponent(teamId)}` : "";
  const res = await fetch(`https://api.vercel.com${path}${qs}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { rawLen: text.length };
  }
  return { status: res.status, payload };
}

async function main() {
  const token = loadToken();
  const project = await api(token, "GET", `/v9/projects/${PROJECT_ID}`);
  const teamId =
    project.payload &&
    typeof project.payload === "object" &&
    typeof (project.payload as { accountId?: string }).accountId === "string"
      ? (project.payload as { accountId: string }).accountId
      : undefined;

  const revokeAttempts: Array<{ label: string; method: string; path: string; body?: Record<string, unknown> }> = [
    { label: "delete-deployment-bypass", method: "DELETE", path: `/v1/deployments/${DEPLOYMENT_ID}/protection-bypass` },
    { label: "delete-alias-host-bypass", method: "DELETE", path: `/v1/aliases/${encodeURIComponent(DEPLOYMENT_HOST)}/protection-bypass` },
    { label: "delete-alias-id-bypass", method: "DELETE", path: `/v1/aliases/${encodeURIComponent(DEPLOYMENT_ID)}/protection-bypass` },
    {
      label: "patch-revoke-shareable",
      method: "PATCH",
      path: `/v1/aliases/${encodeURIComponent(DEPLOYMENT_ID)}/protection-bypass`,
      body: { shareable: { scope: "alias-protection-override", action: "revoke" } },
    },
  ];

  for (const attempt of revokeAttempts) {
    const { status, payload } = await api(token, attempt.method, attempt.path, attempt.body, teamId);
    const keys =
      payload && typeof payload === "object" ? Object.keys(payload as object) : [];
    console.log(JSON.stringify({ step: attempt.label, status, keys }));
  }

  const mintAttempts = [
    DEPLOYMENT_ID,
    DEPLOYMENT_HOST,
    `https://${DEPLOYMENT_HOST}`,
  ];

  let shareUrl: string | null = null;
  let lastStatus = 0;

  for (const id of mintAttempts) {
    const { status, payload } = await api(
      token,
      "PATCH",
      `/v1/aliases/${encodeURIComponent(id)}/protection-bypass`,
      { ttl: TTL_SECONDS },
      teamId
    );
    lastStatus = status;
    shareUrl = extractShareUrl(payload);
    const summary: Record<string, unknown> = { mintTarget: id.slice(0, 40), status, minted: Boolean(shareUrl) };
    if (payload && typeof payload === "object") {
      const p = payload as Record<string, unknown>;
      summary.hasSecret = typeof p.secret === "string";
      if (p.error) summary.error = p.error;
    }
    console.log(JSON.stringify(summary));
    if (shareUrl) break;
  }

  if (!shareUrl) {
    console.error(`REVOKE_REMINT_FAILED lastStatus=${lastStatus}`);
    process.exit(1);
  }

  const parsed = new URL(shareUrl);
  if (!parsed.searchParams.has("_vercel_share")) {
    console.error("REVOKE_REMINT_FAILED missing_vercel_share");
    process.exit(1);
  }
  if (parsed.hostname !== DEPLOYMENT_HOST) {
    const secret = parsed.searchParams.get("_vercel_share");
    if (!secret) {
      console.error("REVOKE_REMINT_FAILED host_mismatch");
      process.exit(1);
    }
    shareUrl = `https://${DEPLOYMENT_HOST}/login?_vercel_share=${encodeURIComponent(secret)}`;
    parsed.href = shareUrl;
  }

  writeFileSync(
    OUT_PATH,
    `# C3 Preview proof shareable link — gitignored. Do not commit.\n# Deployment: ${DEPLOYMENT_ID}\n${shareUrl}\n`,
    "utf8"
  );

  console.log("REVOKE_REMINT_OK");
  console.log(`host=${parsed.hostname}`);
  console.log(`stored=${OUT_PATH}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
