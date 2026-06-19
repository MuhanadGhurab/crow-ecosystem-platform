import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export type RouteHandlerCookieAudit = {
  getSetCookieNames(): string[];
};

type CookieToSet = { name: string; value: string; options: CookieOptions };

/** Cookie adapter for Route Handlers — writes every Set-Cookie to the returned response. */
export function createRouteHandlerCookieAdapter(
  request: NextRequest,
  response: NextResponse
): {
  getAll(): ReturnType<NextRequest["cookies"]["getAll"]>;
  setAll(cookiesToSet: CookieToSet[]): void;
} {
  const setCookieNames: string[] = [];

  return {
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookiesToSet) {
      for (const { name, value, options } of cookiesToSet) {
        request.cookies.set(name, value);
        response.cookies.set(name, value, options);
        setCookieNames.push(name);
      }
    },
  };
}

/**
 * Supabase client for Route Handlers — bind `setAll` to the exact response you will return.
 * Create the redirect (or other) response before calling this helper.
 */
export function createSupabaseRouteHandlerClient(
  request: NextRequest,
  response: NextResponse
): { supabase: SupabaseClient; cookieAudit: RouteHandlerCookieAudit } {
  const adapter = createRouteHandlerCookieAdapter(request, response);
  const setCookieNames = new Set<string>();

  const trackingAdapter = {
    getAll: adapter.getAll,
    setAll(cookiesToSet: CookieToSet[]) {
      adapter.setAll(cookiesToSet);
      for (const { name } of cookiesToSet) {
        setCookieNames.add(name);
      }
    },
  };

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: trackingAdapter,
  });

  return {
    supabase,
    cookieAudit: {
      getSetCookieNames: () => [...setCookieNames],
    },
  };
}
