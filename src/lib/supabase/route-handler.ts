import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

type PendingCookie = { name: string; value: string; options: CookieOptions };

/** Supabase client for Route Handlers — persists auth cookies on the outgoing response. */
export function createSupabaseRouteHandlerClient(request: NextRequest) {
  const pendingCookies: PendingCookie[] = [];

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach((cookie) => pendingCookies.push(cookie));
      },
    },
  });

  function applyCookiesToResponse(response: NextResponse): NextResponse {
    pendingCookies.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
    return response;
  }

  return { supabase, applyCookiesToResponse };
}
