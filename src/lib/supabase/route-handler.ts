import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export type RouteHandlerCookieAudit = {
  getSetCookieNames(): string[];
};

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Supabase client for Route Handlers — collects auth cookies during sign-in, then
 * apply them to the single redirect response returned to the browser.
 */
export function createSupabaseRouteHandlerClient(request: NextRequest): {
  supabase: SupabaseClient;
  cookieAudit: RouteHandlerCookieAudit;
  applyCollectedCookies(response: NextResponse): void;
} {
  const collected: CookieToSet[] = [];
  const secure = request.nextUrl.protocol === "https:";

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookieOptions: {
      path: "/",
      sameSite: "lax",
      secure,
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const entry of cookiesToSet) {
          collected.push(entry);
          request.cookies.set(entry.name, entry.value);
        }
      },
    },
  });

  return {
    supabase,
    cookieAudit: {
      getSetCookieNames: () => collected.map((cookie) => cookie.name),
    },
    applyCollectedCookies(response) {
      for (const { name, value, options } of collected) {
        response.cookies.set(name, value, {
          ...options,
          path: options.path ?? "/",
          sameSite: options.sameSite ?? "lax",
          secure: options.secure ?? secure,
        });
      }
    },
  };
}

/** @deprecated Use createSupabaseRouteHandlerClient(request) + applyCollectedCookies. */
export function createRouteHandlerCookieAdapter(
  request: NextRequest,
  response: NextResponse
): {
  getAll(): ReturnType<NextRequest["cookies"]["getAll"]>;
  setAll(cookiesToSet: CookieToSet[]): void;
} {
  const secure = request.nextUrl.protocol === "https:";
  return {
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookiesToSet) {
      for (const { name, value, options } of cookiesToSet) {
        request.cookies.set(name, value);
        response.cookies.set(name, value, {
          ...options,
          secure: options.secure ?? secure,
        });
      }
    },
  };
}
