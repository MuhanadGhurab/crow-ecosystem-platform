/**
 * Mint a Vercel Shareable Link for a protected Preview deployment.
 * Writes URL to .env.preview.proof-link — never prints the URL or token.
 *
 * Usage:
 *   C3_PREVIEW_DEPLOYMENT_ID=dpl_... C3_PREVIEW_DEPLOYMENT_HOST=host.vercel.app npx tsx scripts/lib/mint-c3-preview-shareable-link.ts
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const OUT_PATH = join(process.cwd(), ".env.preview.proof-link");
const TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days proof window

function requireDeploymentTarget(): { id: string; host: string } {
  const id = process.env.C3_PREVIEW_DEPLOYMENT_ID?.trim();
  const host = process.env.C3_PREVIEW_DEPLOYMENT_HOST?.trim();
  if (!id || !host) {
    throw new Error(
      "Set C3_PREVIEW_DEPLOYMENT_ID and C3_PREVIEW_DEPLOYMENT_HOST before minting a shareable link"
    );
  }
  return { id, host };
}

function loadVercelToken(): string {
  const candidates = [
    join(homedir(), "AppData", "Roaming", "xdg.data", "com.vercel.cli", "auth.json"),
    join(homedir(), ".vercel", "auth.json"),
  ];
  for (const path of candidates) {
    if (!existsSync(path)) continue;
    const parsed = JSON.parse(readFileSync(path, "utf8")) as { token?: string };
    if (parsed.token?.trim()) return parsed.token.trim();
  }
  const env = process.env.VERCEL_TOKEN?.trim() || process.env.VERCEL_ACCESS_TOKEN?.trim();
  if (env) return env;
  throw new Error("Vercel CLI token not found — run vercel login");
}

function extractShareUrl(payload: unknown, host: string): string | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  const candidates = [
    obj.protectionBypassUrl,
    obj.protection_bypass_url,
    obj.url,
    obj.link,
  ];
  for (const value of candidates) {
    if (typeof value === "string" && value.startsWith("http")) return value;
  }
  if (typeof obj.secret === "string" && obj.secret.length > 0) {
    return buildLoginShareUrl(host, obj.secret);
  }
  const bypass = obj.protectionBypass;
  if (bypass && typeof bypass === "object") {
    const nested = extractShareUrl(bypass, host);
    if (nested) return nested;
    const secretKeys = Object.keys(bypass as Record<string, unknown>).filter(
      (key) => key.length >= 8 && !["createdAt", "expiresAt", "scope"].includes(key)
    );
    if (secretKeys.length === 1) {
      return buildLoginShareUrl(host, secretKeys[0]!);
    }
  }
  const share = obj.share;
  if (share && typeof share === "object") {
    const nested = extractShareUrl(share, host);
    if (nested) return nested;
  }
  return null;
}

async function patchProtectionBypass(
  token: string,
  id: string,
  body: Record<string, unknown>
): Promise<{ status: number; payload: unknown }> {
  const res = await fetch(`https://api.vercel.com/v1/aliases/${encodeURIComponent(id)}/protection-bypass`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text.slice(0, 200) };
  }
  return { status: res.status, payload };
}

function buildLoginShareUrl(host: string, secret: string): string {
  const base = `https://${host}/login`;
  const url = new URL(base);
  url.searchParams.set("_vercel_share", secret);
  return url.toString();
}

async function revokeShareableLink(): Promise<void> {
  const { host: DEPLOYMENT_HOST } = requireDeploymentTarget();
  const token = loadVercelToken();
  await patchProtectionBypass(token, DEPLOYMENT_HOST, {
    shareable: { scope: "alias-protection-override", action: "revoke" },
  });
  await patchProtectionBypass(token, "crow-ecosystem-platform", {
    shareable: { scope: "alias-protection-override", action: "revoke" },
  });
  if (existsSync(OUT_PATH)) {
    writeFileSync(
      OUT_PATH,
      `# C3 Preview proof shareable link — revoked\n# REVOKED_AT=${new Date().toISOString()}\n`,
      "utf8"
    );
  }
  console.log("REVOKE_OK");
  console.log(`host=${DEPLOYMENT_HOST}`);
}

async function main() {
  if (process.argv.includes("--revoke")) {
    await revokeShareableLink();
    return;
  }

  const { id: DEPLOYMENT_ID, host: DEPLOYMENT_HOST } = requireDeploymentTarget();
  const token = loadVercelToken();

  async function tryMint(id: string, body: Record<string, unknown>): Promise<string | null> {
    const { status, payload } = await patchProtectionBypass(token, id, body);
    let shareUrl = extractShareUrl(payload, DEPLOYMENT_HOST);
    if (shareUrl) return shareUrl;
    if (status === 409) {
      await patchProtectionBypass(token, id, {
        shareable: { scope: "alias-protection-override", action: "revoke" },
      });
      const remint = await patchProtectionBypass(token, id, { ttl: TTL_SECONDS });
      shareUrl = extractShareUrl(remint.payload, DEPLOYMENT_HOST);
      if (shareUrl) return shareUrl;
    }
    return null;
  }

  let shareUrl: string | null = null;
  let lastStatus = 0;

  const mintTargets = [
    DEPLOYMENT_HOST,
    DEPLOYMENT_ID,
    "crow-ecosystem-platform",
  ];

  for (const id of mintTargets) {
    const { status, payload } = await patchProtectionBypass(token, id, { ttl: TTL_SECONDS });
    lastStatus = status;
    shareUrl = extractShareUrl(payload, DEPLOYMENT_HOST);
    if (shareUrl) break;

    if (status === 409) {
      shareUrl = await tryMint(id, { ttl: TTL_SECONDS });
      if (shareUrl) break;
    }
  }

  if (!shareUrl && lastStatus === 409) {
    const fallback = await patchProtectionBypass(token, "crow-ecosystem-platform", {
      ttl: TTL_SECONDS,
    });
    lastStatus = fallback.status;
    shareUrl = extractShareUrl(fallback.payload, DEPLOYMENT_HOST);
  }

  if (!shareUrl) {
    console.error(`MINT_FAILED status=${lastStatus}`);
    process.exit(1);
  }

  let parsed: URL;
  try {
    parsed = new URL(shareUrl);
  } catch {
    console.error("MINT_FAILED malformed_share_url");
    process.exit(1);
  }

  const hasShare =
    parsed.searchParams.has("_vercel_share") ||
    parsed.searchParams.has("x-vercel-protection-bypass");

  if (!hasShare) {
    console.error("MINT_FAILED missing_share_parameter_in_api_response");
    process.exit(1);
  }

  if (parsed.hostname !== DEPLOYMENT_HOST) {
    const shareParam =
      parsed.searchParams.get("_vercel_share") ??
      parsed.searchParams.get("x-vercel-protection-bypass");
    if (shareParam) {
      if (parsed.searchParams.has("_vercel_share")) {
        shareUrl = buildLoginShareUrl(DEPLOYMENT_HOST, shareParam);
      } else {
        const u = new URL(`https://${DEPLOYMENT_HOST}/login`);
        u.searchParams.set("x-vercel-protection-bypass", shareParam);
        shareUrl = u.toString();
      }
      parsed = new URL(shareUrl);
    }
  }

  const finalHasShare =
    parsed.searchParams.has("_vercel_share") ||
    parsed.searchParams.has("x-vercel-protection-bypass");

  if (!finalHasShare) {
    console.error("MINT_FAILED missing_share_parameter");
    process.exit(1);
  }

  writeFileSync(
    OUT_PATH,
    `# C3 Preview proof shareable link — gitignored. Do not commit.\n# Deployment: ${DEPLOYMENT_ID}\nC3_PREVIEW_SHAREABLE_LINK=${shareUrl}\n`,
    "utf8"
  );

  console.log("MINT_OK");
  console.log(`deploymentId=${DEPLOYMENT_ID}`);
  console.log(`host=${parsed.hostname}`);
  console.log(`hasShareParam=${finalHasShare}`);
  console.log(`stored=${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
