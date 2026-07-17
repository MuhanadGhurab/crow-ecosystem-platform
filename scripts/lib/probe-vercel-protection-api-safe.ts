/**
 * Probe Vercel protection API — logs status codes and payload keys only (no secrets).
 */
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const DEPLOYMENT_ID = "dpl_BxDkM28qvy5GWocQynweFAd9ejyN";
const DEPLOYMENT_HOST =
  "crow-ecosystem-platform-by12e7s1m-muhanadghurabs-projects.vercel.app";
const PROJECT_ID = "prj_lsHQMiMZskg8CzRVd4EHfiAo8o7h";

function loadToken(): string {
  const path = join(
    homedir(),
    "AppData",
    "Roaming",
    "xdg.data",
    "com.vercel.cli",
    "auth.json"
  );
  const parsed = JSON.parse(readFileSync(path, "utf8")) as { token?: string };
  if (!parsed.token) throw new Error("no token");
  return parsed.token;
}

function safeSummary(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== "object") return { type: typeof payload };
  const obj = payload as Record<string, unknown>;
  const out: Record<string, unknown> = { keys: Object.keys(obj) };
  if (obj.error && typeof obj.error === "object") {
    const err = obj.error as Record<string, unknown>;
    out.errorKeys = Object.keys(err);
    out.errorCode = err.code ?? err.message ?? null;
  }
  if (typeof obj.secret === "string") out.hasSecret = true;
  if (typeof obj.protectionBypassUrl === "string") out.hasProtectionBypassUrl = true;
  if (typeof obj.url === "string") out.hasUrl = true;
  if (Array.isArray(obj.bypasses)) out.bypassCount = obj.bypasses.length;
  if (obj.ssoProtection && typeof obj.ssoProtection === "object") {
    out.ssoDeploymentType = (obj.ssoProtection as { deploymentType?: string }).deploymentType;
  }
  return out;
}

async function req(
  token: string,
  method: string,
  url: string,
  body?: Record<string, unknown>
): Promise<void> {
  const res = await fetch(url, {
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
  const label = url.replace("https://api.vercel.com/", "");
  console.log(JSON.stringify({ method, status: res.status, path: label, ...safeSummary(payload) }));
}

async function main() {
  const token = loadToken();
  await req(token, "GET", `https://api.vercel.com/v13/deployments/${DEPLOYMENT_ID}`);
  await req(
    token,
    "GET",
    `https://api.vercel.com/v1/aliases/${encodeURIComponent(DEPLOYMENT_HOST)}`
  );
  await req(
    token,
    "GET",
    `https://api.vercel.com/v1/aliases/${encodeURIComponent(DEPLOYMENT_ID)}/protection-bypass`
  );
  await req(
    token,
    "GET",
    `https://api.vercel.com/v1/aliases/${encodeURIComponent(DEPLOYMENT_HOST)}/protection-bypass`
  );
  await req(token, "GET", `https://api.vercel.com/v9/projects/${PROJECT_ID}`);
  await req(token, "PATCH", `https://api.vercel.com/v1/aliases/${encodeURIComponent(DEPLOYMENT_ID)}/protection-bypass`, {
    revoke: { regenerate: true },
  });
  await req(token, "PATCH", `https://api.vercel.com/v1/aliases/${encodeURIComponent(DEPLOYMENT_ID)}/protection-bypass`, {
    regenerate: true,
  });
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
