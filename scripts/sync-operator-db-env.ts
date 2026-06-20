#!/usr/bin/env tsx
/** Merge hosted DB vars from .env.staging into gitignored .env.preview.operator (no values printed). */
import { readFileSync, writeFileSync } from "node:fs";

function parseEnv(path: string): Map<string, string> {
  const map = new Map<string, string>();
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

const staging = parseEnv(".env.staging");
const keys = [
  "DATABASE_URL",
  "DIRECT_URL",
  "BACKEND_ISOLATION",
  "EXPECTED_DATABASE_FINGERPRINT",
] as const;

let op = readFileSync(".env.preview.operator", "utf8");
for (const key of keys) {
  const value = staging.get(key);
  if (!value) continue;
  const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const line = `${key}="${escaped}"`;
  const re = new RegExp(`^${key}=.*$`, "m");
  op = re.test(op) ? op.replace(re, line) : `${op.trimEnd()}\n${line}\n`;
}

writeFileSync(".env.preview.operator", op);
console.log(`Synced: ${keys.filter((k) => staging.has(k)).join(", ")}`);
