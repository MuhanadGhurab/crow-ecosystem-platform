/** Supabase project URL and anon/publishable key from environment. */

/** Project base URL only — not PostgREST `/rest/v1` (see docs/PLATFORM_STATUS.md). */
export function normalizeSupabaseProjectUrl(raw: string): string {
  return raw.trim().replace(/\/rest\/v1\/?$/i, "").replace(/\/$/, "");
}

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }
  return normalizeSupabaseProjectUrl(url);
}

export function getSupabaseAnonKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    );
  }
  return key;
}

export function isSupabaseAuthConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

/** Local dev only — skips auth checks when true. Never enable in production. */
export function isAuthDisabled(): boolean {
  return process.env.AUTH_DISABLED === "true";
}
