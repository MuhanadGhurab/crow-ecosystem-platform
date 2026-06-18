import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

/** Supabase client for Route Handlers — persists auth cookies on the outgoing response. */
export function createSupabaseRouteHandlerClient(request: NextRequest) {
  let cookieResponse = NextResponse.next({ request });

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookieResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  return { supabase, cookieResponse };
}

export function mergeSupabaseCookies(
  target: NextResponse,
  source: NextResponse
): NextResponse {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie.name, cookie.value);
  });
  return target;
}
