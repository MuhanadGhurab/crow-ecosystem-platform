/**
 * Inspect .env.preview.proof-link without printing secrets.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const PATH = join(process.cwd(), ".env.preview.proof-link");
const TARGET_HOST = "crow-ecosystem-platform-by12e7s1m-muhanadghurabs-projects.vercel.app";
const TARGET_DEPLOYMENT = "dpl_BxDkM28qvy5GWocQynweFAd9ejyN";

function classify(raw: string): {
  present: boolean;
  kind: string;
  hasShareParam: boolean;
  hostMatch: boolean;
  wrongHost: string | null;
  malformed: boolean;
  lineCount: number;
} {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      present: true,
      kind: "empty",
      hasShareParam: false,
      hostMatch: false,
      wrongHost: null,
      malformed: true,
      lineCount: 0,
    };
  }

  const lines = trimmed.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith("#"));
  let urlLine =
    lines.find((l) => /^https?:\/\//i.test(l.trim()))?.trim() ??
    lines.find((l) => /^(PROOF|SHARE|URL|VERCEL)[_A-Z]*=/i.test(l.trim()))?.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "") ??
    lines[0]?.trim() ??
    "";
  let url: URL;
  try {
    url = new URL(urlLine);
  } catch {
    return {
      present: true,
      kind: "malformed_url",
      hasShareParam: false,
      hostMatch: false,
      wrongHost: null,
      malformed: true,
      lineCount: lines.length,
    };
  }

  const host = url.hostname.toLowerCase();
  const hostMatch = host === TARGET_HOST;
  const hasShareParam =
    url.searchParams.has("_vercel_share") ||
    url.searchParams.has("share") ||
    /[?&]_vercel_share=/.test(urlLine);

  let kind = "unknown";
  if (hostMatch && !hasShareParam && url.pathname === "/") {
    kind = "bare_preview_url";
  } else if (hostMatch && hasShareParam) {
    kind = "shareable_link";
  } else if (!hostMatch && hasShareParam) {
    kind = "shareable_link_wrong_host";
  } else if (!hostMatch) {
    kind = "bare_url_wrong_host";
  }

  return {
    present: true,
    kind,
    hasShareParam,
    hostMatch,
    wrongHost: hostMatch ? null : host,
    malformed: false,
    lineCount: lines.length,
  };
}

function main() {
  if (!existsSync(PATH)) {
    console.log(JSON.stringify({ present: false, targetDeployment: TARGET_DEPLOYMENT, targetHost: TARGET_HOST }));
    return;
  }

  const raw = readFileSync(PATH, "utf8");
  const result = classify(raw);
  console.log(
    JSON.stringify({
      ...result,
      targetDeployment: TARGET_DEPLOYMENT,
      targetHost: TARGET_HOST,
    })
  );
}

main();
