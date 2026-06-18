import { createServerClient } from "@supabase/ssr";
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
import { isAccountRegistrationEnabled } from "@/lib/account/feature-flags";
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

function redirectToLogin(request: NextRequest, error?: string) {
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
  return NextResponse.redirect(url);
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
    isAccountRegistrationEnabled() && isC3SessionOnlyPath(pathname);

  const needsAuth =
    c3SessionGate ||
    (!isPublicPath(pathname) &&
      (isPlatformPath(pathname) ||
        isPortalPath(pathname) ||
        tenantSlug !== null ||
        pathname.startsWith("/api/")));

  if (!needsAuth) {
    return response;
  }

  if (isAuthDisabled()) {
    return response;
  }

  if (!isSupabaseAuthConfigured()) {
    return redirectToLogin(request, "config");
  }

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirectToLogin(request);
  }

  if (c3SessionGate) {
    return response;
  }

  const { role, tenantSlugs } = getCrowAuth(user);

  if (isPlatformPath(pathname)) {
    if (!canAccessPlatformPath(role, pathname)) {
      return redirectToLogin(request, "forbidden");
    }
    return response;
  }

  if (isPortalPath(pathname)) {
    if (role && !canAccessPortalPath(role) && !isClient(role)) {
      return redirectToLogin(request, "forbidden");
    }
    if (
      isPlatformConsoleRole(role) &&
      request.nextUrl.searchParams.get("preview") !== "client"
    ) {
      const adminUrl = request.nextUrl.clone();
      adminUrl.pathname = routes.admin.overview;
      adminUrl.search = "";
      return NextResponse.redirect(adminUrl);
    }
    return response;
  }

  if (tenantSlug) {
    if (!canAccessTenant(role, tenantSlugs, tenantSlug)) {
      return redirectToLogin(request, "forbidden");
    }
    if (!canAccessTenantPath(role, pathname, tenantSlug)) {
      return redirectToLogin(request, "forbidden");
    }
    return response;
  }

  if (pathname.startsWith("/api/")) {
    if (isHandlerAuthorizedApiPath(pathname, request.method)) {
      return response;
    }
    if (!canAccessPlatformPath(role, "/admin/overview")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return response;
}
