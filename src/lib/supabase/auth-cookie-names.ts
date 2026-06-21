import { getSupabaseUrl } from "@/lib/supabase/env";

/** Supabase project ref from `NEXT_PUBLIC_SUPABASE_URL` (e.g. `wbwnsndcxrgyqwppurms`). */
export function getSupabaseProjectRef(): string {
  const url = getSupabaseUrl();
  const match = url.match(/https?:\/\/([^.]+)\./);
  if (!match?.[1]) {
    throw new Error("Cannot parse Supabase project ref from NEXT_PUBLIC_SUPABASE_URL");
  }
  return match[1];
}

/** Base auth cookie name emitted by `@supabase/ssr` for this project. */
export function supabaseAuthCookieBaseName(): string {
  return `sb-${getSupabaseProjectRef()}-auth-token`;
}

export function isSupabaseAuthCookieName(name: string): boolean {
  const base = supabaseAuthCookieBaseName();
  return name === base || name.startsWith(`${base}.`);
}

type NamedCookie = { name: string };

/** Collect Supabase auth cookie names (base + chunk suffixes) from a cookie list. */
export function listSupabaseAuthCookieNames(cookies: NamedCookie[]): string[] {
  return cookies.filter((cookie) => isSupabaseAuthCookieName(cookie.name)).map((c) => c.name);
}
