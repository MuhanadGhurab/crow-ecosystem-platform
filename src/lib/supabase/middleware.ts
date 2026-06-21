import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  canAccessPortalPath,
  canAccessPlatformPath,
  canAccessTenantPath,
} from "@/lib/auth/permissions";
import {
  canAccessTenant,
  getCrowAuth,
  isClient,
  isPlatformConsoleRole,
} from "@/lib/auth/roles";
import { routes } from "@/lib/routes";
import { isC3PlatformAccountGateEnabled } from "@/lib/account/feature-flags";
import {
  isAuthCanarySessionRefreshPath,
  isC3AuthCanaryEnabled,
} from "@/lib/auth/c3-auth-canary";
import {
  getTenantSlugFromPath,
  isAuthApiPath,
  isC3SessionOnlyPath,
  isHandlerAuthorizedApiPath,
  isPlatformPath,
  isPortalPath,
  isPublicApiPath,
  isPublicPath,
} from "@/lib/auth/route-protection";
import {
  assertAuthNotDisabledInProduction,
  getSupabaseAnonKey,
  getSupabaseUrl,
  isAuthDisabled,
  isSupabaseAuthConfigured,
} from "@/lib/supabase/env";
import {
  emitC3SessionDiagnostic,
  isC3SessionDiagnosticsEnabled,
} from "@/lib/account/c3-session-diagnostics";
import { listSupabaseAuthCookieNames } from "@/lib/supabase/auth-cookie-names";

type CookieToSet = { name: string; value: string; options: CookieOptions };

function applyHostedCookieDefaults(options: CookieOptions, secure: boolean): CookieOptions {
  return {
    ...options,
    path: options.path ?? "/",
    sameSite: options.sameSite ?? "lax",
    secure: options.secure ?? secure,
  };
}

/** Preserve Supabase Set-Cookie headers when returning a different NextResponse (redirect/rewrite). */
export function copySupabaseResponseCookies(source: NextResponse, target: NextResponse): void {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie.name, cookie.value, {
      path: cookie.path,
      domain: cookie.domain,
      sameSite: cookie.sameSite as CookieOptions["sameSite"],
      secure: cookie.secure,
      httpOnly: cookie.httpOnly,
      maxAge: cookie.maxAge,
      expires: cookie.expires,
    });
  }
}

function withNoStore(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

function redirectToLogin(
  request: NextRequest,
  sessionResponse: NextResponse,
  error?: string
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  const next = request.nextUrl.pathname + request.nextUrl.search;
  if (next && next !== "/login") {
    url.searchParams.set("next", next);
  }
  if (error) {
    url.searchParams.set("error", error);
  }
  const redirect = NextResponse.redirect(url);
  copySupabaseResponseCookies(sessionResponse, redirect);
  return withNoStore(redirect);
}

function redirectWithSessionCookies(
  sessionResponse: NextResponse,
  url: URL
): NextResponse {
  const redirect = NextResponse.redirect(url);
  copySupabaseResponseCookies(sessionResponse, redirect);
  return withNoStore(redirect);
}

export async function updateSession(request: NextRequest) {
  assertAuthNotDisabledInProduction();

  const { pathname } = request.nextUrl;

  if (isAuthApiPath(pathname)) {
    return NextResponse.next();
  }

  if (isPublicApiPath(pathname, request.method)) {
    return NextResponse.next();
  }

  const tenantSlug = getTenantSlugFromPath(pathname);
  let response = NextResponse.next({ request });

  if (tenantSlug) {
    response.headers.set("x-tenant-slug", tenantSlug);
  }

  const c3SessionGate =
    isC3PlatformAccountGateEnabled() && isC3SessionOnlyPath(pathname);

  const authCanarySessionRefresh =
    isC3AuthCanaryEnabled() && isAuthCanarySessionRefreshPath(pathname);

  const needsAuth =
    c3SessionGate ||
    (!isPublicPath(pathname) &&
      (isPlatformPath(pathname) ||
        isPortalPath(pathname) ||
        tenantSlug !== null ||
        pathname.startsWith("/api/")));

  if (!needsAuth && !authCanarySessionRefresh) {
    return response;
  }

  if (isAuthDisabled()) {
    return response;
  }

  if (!isSupabaseAuthConfigured()) {
    return redirectToLogin(request, response, "config");
  }

  const secure = request.nextUrl.protocol === "https:";
  const authCookiesReceived = listSupabaseAuthCookieNames(request.cookies.getAll());
  if (isC3SessionDiagnosticsEnabled()) {
    emitC3SessionDiagnostic("MIDDLEWARE_AUTH_COOKIE_NAMES_RECEIVED", {
      count: authCookiesReceived.length,
      cookieNames: authCookiesReceived,
      route: pathname,
    });
  }

  let middlewareSetCookieNames: string[] = [];
  let sessionRefreshed = false;

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        sessionRefreshed = cookiesToSet.length > 0;
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, applyHostedCookieDefaults(options, secure));
          middlewareSetCookieNames.push(name);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (sessionRefreshed || middlewareSetCookieNames.length > 0) {
    withNoStore(response);
  }

  if (isC3SessionDiagnosticsEnabled()) {
    emitC3SessionDiagnostic("MIDDLEWARE_USER_VALIDATED", {
      outcome: Boolean(user),
      route: pathname,
    });
    if (sessionRefreshed) {
      emitC3SessionDiagnostic("MIDDLEWARE_SESSION_REFRESHED", { route: pathname });
    }
    if (middlewareSetCookieNames.length > 0) {
      emitC3SessionDiagnostic("MIDDLEWARE_SET_COOKIE_NAMES", {
        count: middlewareSetCookieNames.length,
        cookieNames: [...new Set(middlewareSetCookieNames)],
        route: pathname,
      });
    }
  }

  if (!user) {
    if (authCanarySessionRefresh) {
      return response;
    }
    if (isC3SessionDiagnosticsEnabled()) {
      emitC3SessionDiagnostic("MIDDLEWARE_RESPONSE_ROUTE", {
        route: "/login",
        reason: "unauthenticated",
      });
    }
    return redirectToLogin(request, response);
  }

  if (c3SessionGate) {
    if (isC3SessionDiagnosticsEnabled()) {
      emitC3SessionDiagnostic("MIDDLEWARE_RESPONSE_ROUTE", {
        route: pathname,
        reason: "c3_session_gate",
      });
    }
    return response;
  }

  if (authCanarySessionRefresh) {
    return response;
  }

  const { role, tenantSlugs } = getCrowAuth(user);

  if (isPlatformPath(pathname)) {
    if (!canAccessPlatformPath(role, pathname)) {
      return redirectToLogin(request, response, "forbidden");
    }
    return response;
  }

  if (isPortalPath(pathname)) {
    if (role && !canAccessPortalPath(role) && !isClient(role)) {
      return redirectToLogin(request, response, "forbidden");
    }
    if (
      isPlatformConsoleRole(role) &&
      request.nextUrl.searchParams.get("preview") !== "client"
    ) {
      const adminUrl = request.nextUrl.clone();
      adminUrl.pathname = routes.admin.overview;
      adminUrl.search = "";
      return redirectWithSessionCookies(response, adminUrl);
    }
    return response;
  }

  if (tenantSlug) {
    if (!canAccessTenant(role, tenantSlugs, tenantSlug)) {
      return redirectToLogin(request, response, "forbidden");
    }
    if (!canAccessTenantPath(role, pathname, tenantSlug)) {
      return redirectToLogin(request, response, "forbidden");
    }
    return response;
  }

  if (pathname.startsWith("/api/")) {
    if (isHandlerAuthorizedApiPath(pathname, request.method)) {
      return response;
    }
    if (!canAccessPlatformPath(role, "/admin/overview")) {
      const forbidden = NextResponse.json({ error: "Forbidden" }, { status: 403 });
      copySupabaseResponseCookies(response, forbidden);
      return withNoStore(forbidden);
    }
  }

  return response;
}
