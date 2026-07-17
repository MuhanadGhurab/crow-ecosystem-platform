/**
 * Build operator runtime env for Production proofs (never commit output).
 * Merges .env.staging, Production Vercel pull, and canonical Production URL.
 */
import { execSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const RUNTIME_ENV_PATH = join(process.cwd(), ".env.production.runtime");
const CANONICAL_PRODUCTION = "https://crow-ecosystem-platform.vercel.app";

function parseEnv(content: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq);
    let value = trimmed.slice(eq + 1);
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value.length === 0) continue;
    map.set(key, value);
  }
  return map;
}

function serializeEnv(map: Map<string, string>): string {
  return [...map.entries()].map(([k, v]) => `${k}=${v}`).join("\n") + "\n";
}

function pullProductionEnv(targetPath: string): void {
  const result = spawnSync(
    "npx",
    ["vercel", "env", "pull", targetPath, "--environment=production", "--yes"],
    { encoding: "utf8", shell: process.platform === "win32" }
  );
  if ((result.status ?? 1) !== 0) {
    throw new Error("Failed to pull Production env from Vercel");
  }
}

function resolveProductionBase(): string {
  const override = process.env.C3_PRODUCTION_BASE_URL?.replace(/\/$/, "");
  if (override) return override;

  try {
    const out = execSync("npx vercel ls crow-ecosystem-platform --prod", {
      encoding: "utf8",
      shell: process.platform === "win32",
      timeout: 120_000,
    });
    const match = out.match(
      /https:\/\/crow-ecosystem-platform-[a-z0-9]+-muhanadghurabs-projects\.vercel\.app/
    );
    if (match?.[0]) return match[0];
  } catch {
    /* fall through to canonical alias */
  }

  return CANONICAL_PRODUCTION;
}

export function buildProductionRuntimeEnv(): string {
  const merged = new Map<string, string>();

  if (existsSync(join(process.cwd(), ".env.staging"))) {
    for (const [k, v] of parseEnv(readFileSync(join(process.cwd(), ".env.staging"), "utf8"))) {
      merged.set(k, v);
    }
  }

  const pulledPath = join(process.cwd(), ".env.production.pulled.tmp");
  pullProductionEnv(pulledPath);
  for (const [k, v] of parseEnv(readFileSync(pulledPath, "utf8"))) {
    merged.set(k, v);
  }

  const operatorPath = join(process.cwd(), ".env.production.operator");
  if (existsSync(operatorPath)) {
    for (const [k, v] of parseEnv(readFileSync(operatorPath, "utf8"))) {
      merged.set(k, v);
    }
  }

  const productionBase =
    process.env.C3_PRODUCTION_BASE_URL?.replace(/\/$/, "") ?? CANONICAL_PRODUCTION;
  merged.set("C3_PRODUCTION_BASE_URL", productionBase);
  merged.set("C3_PREVIEW_BASE_URL", productionBase);

  if (process.env.C3_PRODUCTION_DEPLOYMENT_ID?.trim()) {
    merged.set("C3_PRODUCTION_DEPLOYMENT_ID", process.env.C3_PRODUCTION_DEPLOYMENT_ID.trim());
  }

  writeFileSync(RUNTIME_ENV_PATH, serializeEnv(merged));
  return RUNTIME_ENV_PATH;
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("c3-production-runtime-env.ts")) {
  try {
    const path = buildProductionRuntimeEnv();
    console.log(`Runtime env written: ${path}`);
    const map = parseEnv(readFileSync(path, "utf8"));
    console.log(`C3_PRODUCTION_BASE_URL=${map.get("C3_PRODUCTION_BASE_URL")}`);
    console.log(`GOOGLE_SSO_ENABLED=${map.get("GOOGLE_SSO_ENABLED") ?? "(unset)"}`);
    const manual = map.get("C3_MANUAL_BROWSER_SESSION_CERTIFIED")?.trim();
    console.log(`C3_MANUAL_BROWSER_SESSION_CERTIFIED=${manual ? "recorded" : "unset"}`);
    const corroborated = map.get("C3_SERVER_STATE_CORROBORATED")?.trim();
    console.log(`C3_SERVER_STATE_CORROBORATED=${corroborated ? "recorded" : "unset"}`);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}
