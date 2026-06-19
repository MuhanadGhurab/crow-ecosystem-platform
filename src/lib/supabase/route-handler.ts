import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseAuthCookieName } from "@/lib/supabase/auth-cookie-names";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export type RouteHandlerCookieAudit = {
  getSetCookieNames(): string[];
};

type CookieToSet = { name: string; value: string; options: CookieOptions };

function mergeCookieOptions(
  options: CookieOptions,
  secure: boolean
): CookieOptions {
  return {
    ...options,
    path: options.path ?? "/",
    sameSite: options.sameSite ?? "lax",
    secure: options.secure ?? secure,
    httpOnly: options.httpOnly ?? true,
  };
}

/**
 * Expire stale Supabase auth cookies (base + chunk suffixes) before issuing a new session.
 * Prevents orphaned chunks from a prior browser context breaking session parsing.
 */
export function clearStaleSupabaseAuthCookies(
  request: NextRequest,
  response: NextResponse
): string[] {
  const cleared: string[] = [];
  const secure = request.nextUrl.protocol === "https:";

  for (const cookie of request.cookies.getAll()) {
    if (!isSupabaseAuthCookieName(cookie.name)) continue;
    request.cookies.set(cookie.name, "");
    response.cookies.set(cookie.name, "", {
      path: "/",
      maxAge: 0,
      sameSite: "lax",
      secure,
    });
    cleared.push(cookie.name);
  }

  return cleared;
}

/** Cookie adapter for Route Handlers — writes every Set-Cookie to the returned response. */
export function createRouteHandlerCookieAdapter(
  request: NextRequest,
  response: NextResponse,
  secure = request.nextUrl.protocol === "https:"
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
        response.cookies.set(name, value, mergeCookieOptions(options, secure));
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
  const secure = request.nextUrl.protocol === "https:";
  const adapter = createRouteHandlerCookieAdapter(request, response, secure);
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
    cookieOptions: {
      path: "/",
      sameSite: "lax",
      secure,
      httpOnly: true,
    },
    cookies: trackingAdapter,
  });

  return {
    supabase,
    cookieAudit: {
      getSetCookieNames: () => [...setCookieNames],
    },
  };
}
