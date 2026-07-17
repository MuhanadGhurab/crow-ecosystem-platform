#!/usr/bin/env tsx
/**
 * Read-only Supabase Auth settings audit (no secrets in output).
 */
import { readFileSync } from "node:fs";

function loadEnvFile(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

async function main() {
  const env = loadEnvFile(".env.staging");
  const base = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const anon = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !anon) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or publishable key in .env.staging");
    process.exit(1);
  }

  const res = await fetch(`${base}/auth/v1/settings`, {
    headers: { apikey: anon, Authorization: `Bearer ${anon}` },
  });
  if (!res.ok) {
    console.error(`Auth settings request failed: HTTP ${res.status}`);
    process.exit(1);
  }

  const settings = (await res.json()) as Record<string, unknown>;
  const external = (settings.external ?? {}) as Record<string, unknown>;

  console.log(
    JSON.stringify(
      {
        disable_signup: settings.disable_signup ?? null,
        mailer_autoconfirm: settings.mailer_autoconfirm ?? null,
        external_email_enabled: external.email ?? null,
        external_google_enabled: external.google ?? null,
        site_url_host: typeof settings.site_url === "string" ? new URL(settings.site_url).host : null,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
