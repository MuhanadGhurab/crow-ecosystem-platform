import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

/** Supabase client for Route Handlers — persists auth cookies on the outgoing response. */
export function createSupabaseRouteHandlerClient(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  function redirectWithSession(path: string): NextResponse {
    const redirect = NextResponse.redirect(new URL(path, request.url), 303);
    for (const cookieHeader of supabaseResponse.headers.getSetCookie()) {
      redirect.headers.append("set-cookie", cookieHeader);
    }
    return redirect;
  }

  return { supabase, redirectWithSession };
}
