/**
 * Build operator runtime env for Preview proofs (never commit output).
 * Merges .env.staging, branch Preview pull, automation bypass, and canonical URL.
 */
import { execSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BRANCH = "feat/c3-account-registration-email-verification";
const RUNTIME_ENV_PATH = join(process.cwd(), ".env.staging.runtime");

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

function pullPreviewEnv(targetPath: string): void {
  const result = spawnSync(
    "npx",
    ["vercel", "env", "pull", targetPath, "--environment=preview", "--git-branch", BRANCH, "--yes"],
    { encoding: "utf8", shell: process.platform === "win32" }
  );
  if ((result.status ?? 1) !== 0) {
    throw new Error("Failed to pull branch Preview env from Vercel");
  }
}

function resolveLatestPreviewUrl(): string {
  const out = execSync("npx vercel ls crow-ecosystem-platform", {
    encoding: "utf8",
    timeout: 120_000,
    shell: process.platform === "win32",
  });
  const match = out.match(/https:\/\/crow-ecosystem-platform-[a-z0-9]+-muhanadghurabs-projects\.vercel\.app/);
  if (!match?.[0]) {
    throw new Error("Could not resolve latest Ready Preview deployment URL");
  }
  return match[0];
}

function resolveAutomationBypassSecret(previewBase: string): string {
  const existing = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
  if (existing && existing.length >= 8) return existing;

  const out = execSync(`npx vercel curl -v "${previewBase}/api/health" 2>&1`, {
    encoding: "utf8",
    timeout: 120_000,
    shell: process.platform === "win32",
    stdio: ["pipe", "pipe", "pipe"],
  });
  const match = out.match(/x-vercel-protection-bypass:\s*(\S+)/i);
  if (!match?.[1]) {
    throw new Error(
      "Could not resolve VERCEL_AUTOMATION_BYPASS_SECRET — set it in Vercel Deployment Protection → Protection Bypass for Automation"
    );
  }
  return match[1];
}

export function buildPreviewRuntimeEnv(): string {
  const merged = new Map<string, string>();

  if (existsSync(join(process.cwd(), ".env.staging"))) {
    for (const [k, v] of parseEnv(readFileSync(join(process.cwd(), ".env.staging"), "utf8"))) {
      merged.set(k, v);
    }
  }

  const pulledPath = join(process.cwd(), ".env.preview.pulled.tmp");
  pullPreviewEnv(pulledPath);
  for (const [k, v] of parseEnv(readFileSync(pulledPath, "utf8"))) {
    merged.set(k, v);
  }

  const previewBase = process.env.C3_PREVIEW_BASE_URL?.replace(/\/$/, "") ?? resolveLatestPreviewUrl();
  merged.set("C3_PREVIEW_BASE_URL", previewBase);
  if (process.env.C3_PREVIEW_DEPLOYMENT_ID?.trim()) {
    merged.set("C3_PREVIEW_DEPLOYMENT_ID", process.env.C3_PREVIEW_DEPLOYMENT_ID.trim());
  }
  merged.set("VERCEL_AUTOMATION_BYPASS_SECRET", resolveAutomationBypassSecret(previewBase));

  writeFileSync(RUNTIME_ENV_PATH, serializeEnv(merged));
  return RUNTIME_ENV_PATH;
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("c3-preview-runtime-env.ts")) {
  try {
    const path = buildPreviewRuntimeEnv();
    console.log(`Runtime env written: ${path}`);
    const map = parseEnv(readFileSync(path, "utf8"));
    console.log(`C3_PREVIEW_BASE_URL=${map.get("C3_PREVIEW_BASE_URL")}`);
    console.log(`VERCEL_AUTOMATION_BYPASS_SECRET=(set, ${map.get("VERCEL_AUTOMATION_BYPASS_SECRET")?.length ?? 0} chars)`);
    const manual = map.get("C3_MANUAL_BROWSER_SESSION_CERTIFIED")?.trim();
    console.log(`C3_MANUAL_BROWSER_SESSION_CERTIFIED=${manual ? "recorded" : "unset"}`);
    const otpSecret = map.get("EMAIL_VERIFICATION_CODE_SECRET")?.trim();
    console.log(`EMAIL_VERIFICATION_CODE_SECRET_PRESENT=${Boolean(otpSecret && otpSecret.length >= 16)}`);
    console.log(`C3_OPERATOR_ASSISTED_EMAIL_OTP=${map.get("C3_OPERATOR_ASSISTED_EMAIL_OTP") === "true"}`);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}
