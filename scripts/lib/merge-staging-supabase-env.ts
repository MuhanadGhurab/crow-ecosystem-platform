import { readFileSync, existsSync } from "node:fs";

function parseEnvFile(path: string): Map<string, string> {
  const map = new Map<string, string>();
  if (!existsSync(path)) return map;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i <= 0) continue;
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (v) map.set(t.slice(0, i), v);
  }
  return map;
}

const SUPABASE_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

/** Fill missing Supabase admin vars from .env.staging (operator census only). */
export function mergeStagingSupabaseEnvIfMissing(): void {
  const staging = parseEnvFile(".env.staging");
  for (const key of SUPABASE_KEYS) {
    if (process.env[key]?.trim()) continue;
    const value = staging.get(key);
    if (value) process.env[key] = value;
  }
}
