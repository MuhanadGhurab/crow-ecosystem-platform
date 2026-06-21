#!/usr/bin/env tsx
/**
 * Read-only Supabase Auth redirect allowlist audit (hosts only — no secrets).
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

function hostFromUrl(raw: string): string | null {
  try {
    return new URL(raw).host;
  } catch {
    return null;
  }
}

async function main() {
  const env = loadEnvFile(".env.staging");
  const base = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const token =
    env.SUPABASE_ACCESS_TOKEN?.trim() ||
    env.SUPABASE_MANAGEMENT_ACCESS_TOKEN?.trim();
  const ref = base?.match(/https?:\/\/([^.]+)\./)?.[1];

  if (!base || !ref) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.staging");
    process.exit(1);
  }

  if (!token) {
    console.log(
      JSON.stringify(
        {
          managementApi: "unavailable",
          note: "Set SUPABASE_ACCESS_TOKEN locally to list redirect hosts; operator must review Supabase Dashboard → Authentication → URL configuration.",
          recommendedRetainedCallbackHosts: [
            "crow-ecosystem-platform.vercel.app",
            "localhost:3000",
          ],
          obsoleteProofWindowHostToRemove:
            "crow-ecosystem-platform-oz8qikh7x-muhanadghurabs-projects.vercel.app",
          doNotAlterGoogleCloudCallback:
            "https://<project-ref>.supabase.co/auth/v1/callback",
        },
        null,
        2
      )
    );
    return;
  }

  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    console.error(`Management API failed: HTTP ${res.status}`);
    process.exit(1);
  }

  const config = (await res.json()) as Record<string, unknown>;
  const rawList =
    (config.uri_allow_list as string[] | undefined) ??
    (config.additional_redirect_urls as string[] | undefined) ??
    (config.redirect_urls as string[] | undefined) ??
    [];

  const redirectHosts = [...new Set(rawList.map(hostFromUrl).filter(Boolean))] as string[];
  const siteHost = typeof config.site_url === "string" ? hostFromUrl(config.site_url) : null;

  console.log(
    JSON.stringify(
      {
        managementApi: "ok",
        siteUrlHost: siteHost,
        redirectCallbackHosts: redirectHosts,
        googleCloudSupabaseCallbackHost: `${ref}.supabase.co`,
        note: "Remove closed immutable Preview proof hosts when GOOGLE_SSO_ENABLED=false; do not add locked Preview host unless Google SSO re-enabled.",
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
