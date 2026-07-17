import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const EXPECTED_PROJECT_REF = "wbwnsndcxrgyqwppurms";

export type ParsedEnvFile = Map<string, string>;

export type HostedEnvLoadOptions = {
  primaryEnvFile?: string;
  supplementalEnvFiles?: string[];
  protectDatabaseUrlsFromLocalhostOverride?: boolean;
  applyToProcessEnv?: boolean;
};

export type HostedEnvLoadResult = {
  primaryEnvFile: string;
  supplementalEnvFiles: string[];
  loadedFiles: string[];
  targetClassification: "hosted" | "localhost" | "unknown";
};

const PROTECTED_DATABASE_KEYS = [
  "DATABASE_URL",
  "DIRECT_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_URL",
] as const;

const LOCALHOST_PATTERN = /127\.0\.0\.1|localhost|::1/i;

export function parseEnvFile(path: string): ParsedEnvFile {
  const map = new Map<string, string>();
  if (!existsSync(path)) return map;

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value) map.set(trimmed.slice(0, eq), value);
  }
  return map;
}

export function isLocalhostDatabaseTarget(value: string): boolean {
  if (!value.trim()) return false;
  if (LOCALHOST_PATTERN.test(value)) return true;
  try {
    const parsed = new URL(value.replace(/^postgresql:/, "http:"));
    const port = parsed.port || "5432";
    if (port === "5433" && /127\.0\.0\.1|localhost/i.test(parsed.hostname)) {
      return true;
    }
  } catch {
    return LOCALHOST_PATTERN.test(value);
  }
  return false;
}

export function resolveRepoEnvPath(relativePath: string): string {
  return join(process.cwd(), relativePath);
}

export function loadHostedOperatorEnv(
  options: HostedEnvLoadOptions = {}
): HostedEnvLoadResult {
  const primaryEnvFile = options.primaryEnvFile ?? ".env.staging.runtime";
  const supplementalEnvFiles = options.supplementalEnvFiles ?? [".env.migration.recovery"];
  const protect = options.protectDatabaseUrlsFromLocalhostOverride ?? true;
  const apply = options.applyToProcessEnv ?? true;

  const merged = new Map<string, string>();
  const loadedFiles: string[] = [];

  const primaryPath = resolveRepoEnvPath(primaryEnvFile);
  if (!existsSync(primaryPath)) {
    throw new Error(`Hosted operator env missing: ${primaryEnvFile}`);
  }
  loadedFiles.push(primaryEnvFile);
  for (const [key, value] of parseEnvFile(primaryPath)) {
    merged.set(key, value);
  }

  for (const supplemental of supplementalEnvFiles) {
    const supplementalPath = resolveRepoEnvPath(supplemental);
    if (!existsSync(supplementalPath)) continue;
    loadedFiles.push(supplemental);
    for (const [key, value] of parseEnvFile(supplementalPath)) {
      if (
        protect &&
        (PROTECTED_DATABASE_KEYS as readonly string[]).includes(key) &&
        isLocalhostDatabaseTarget(value)
      ) {
        const existing = merged.get(key);
        if (existing && !isLocalhostDatabaseTarget(existing)) {
          continue;
        }
      }
      merged.set(key, value);
    }
  }

  if (apply) {
    for (const [key, value] of merged) {
      process.env[key] = value;
    }
    process.env.CLOUD_HOSTED_ENV_FILE = primaryEnvFile;
  }

  const direct = merged.get("DIRECT_URL") ?? merged.get("DATABASE_URL") ?? "";
  let targetClassification: HostedEnvLoadResult["targetClassification"] = "unknown";
  if (direct) {
    targetClassification = isLocalhostDatabaseTarget(direct) ? "localhost" : "hosted";
  }

  return {
    primaryEnvFile,
    supplementalEnvFiles: supplementalEnvFiles.filter((f) =>
      existsSync(resolveRepoEnvPath(f))
    ),
    loadedFiles,
    targetClassification,
  };
}

export function assertHostedEnvNotLocalhost(result: HostedEnvLoadResult): void {
  if (result.targetClassification === "localhost") {
    throw new Error(
      `Hosted verification blocked: database target classified as localhost after loading ${result.loadedFiles.join(", ")}.`
    );
  }
}

export function expectedHostedProjectRef(): string {
  return EXPECTED_PROJECT_REF;
}
