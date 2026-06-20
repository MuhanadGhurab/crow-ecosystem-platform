import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  canAccessPortal,
  canAccessTenant,
  getCrowAuth,
  isClient,
  isPlatformStaff,
} from "@/lib/auth/roles";
import type { CrowRole } from "@/lib/auth/roles";
import {
  canAccessPlatformPath,
  hasPermission,
  type PermissionKey,
} from "@/lib/auth/permissions";
import { isAccountRegistrationEnabled } from "@/lib/account/feature-flags";
import {
  findPlatformAccountBySupabaseUserId,
  isPlatformAccountActive,
} from "@/lib/account/platform-account.service";
import { isOnboardingGenerationCurrent } from "@/lib/account/onboarding-generation";
import { createClient } from "@/lib/supabase/server";
import { isAuthDisabled } from "@/lib/supabase/env";
import { countRequestsForEmail } from "@/lib/services/client-request-link.service";
import { routes } from "@/lib/routes";

export async function getSessionUser(): Promise<User | null> {
  if (isAuthDisabled()) {
    return null;
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

function devBypassRole(): CrowRole {
  const raw = process.env.AUTH_DEV_ROLE?.trim();
  const allowed: CrowRole[] = [
    "client",
    "tenant_admin",
    "tenant_user",
    "implementer",
    "sales",
    "auditor_readonly",
  ];
  if (raw && allowed.includes(raw as CrowRole)) {
    return raw as CrowRole;
  }
  return "platform_admin";
}

function devBypassUser(): User {
  const role = devBypassRole();
  const tenantSlugs =
    role === "tenant_admin" ||
    role === "tenant_user" ||
    role === "auditor_readonly"
      ? [process.env.AUTH_DEV_TENANT_SLUG?.trim() || "meem-global"]
      : [];
  return {
    id: role === "client" ? "dev-client" : "dev-bypass",
    email: role === "client" ? "client.demo@alnoor.test" : "dev@local",
    app_metadata: { crow_role: role, tenant_slugs: tenantSlugs },
    user_metadata: {},
    aud: "authenticated",
    created_at: new Date(0).toISOString(),
  } as unknown as User;
}

export async function requireAuth(nextPath?: string): Promise<User> {
  if (isAuthDisabled()) {
    return devBypassUser();
  }
  const user = await getSessionUser();
  if (!user) {
    const q = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/login${q}`);
  }
  return user;
}

export async function requirePlatformStaff(): Promise<User> {
  const user = await requireAuth();
  if (isAuthDisabled()) {
    return user;
  }
  const { role } = getCrowAuth(user);
  if (!isPlatformStaff(role)) {
    redirect("/unauthorized?reason=platform_staff");
  }
  return user;
}

/** Platform route guard with sales / auditor scoping via permission matrix. */
export async function requirePlatformPathAccess(pathname: string): Promise<User> {
  const user = await requireAuth(pathname);
  if (isAuthDisabled()) {
    return user;
  }
  const { role } = getCrowAuth(user);
  if (!canAccessPlatformPath(role, pathname)) {
    redirect("/unauthorized?reason=permission");
  }
  return user;
}

export async function requirePermission(permission: PermissionKey): Promise<User> {
  const user = await requireAuth();
  if (isAuthDisabled()) {
    return user;
  }
  const { role } = getCrowAuth(user);
  if (!hasPermission(role, permission)) {
    redirect("/unauthorized?reason=permission");
  }
  return user;
}

/** Any platform console role with at least one platform.* permission (sales, auditor, staff). */
export async function requirePlatformConsole(): Promise<User> {
  const user = await requireAuth();
  if (isAuthDisabled()) {
    return user;
  }
  const { role } = getCrowAuth(user);
  const allowed =
    isPlatformStaff(role) ||
    hasPermission(role, "platform.requests.view") ||
    hasPermission(role, "platform.audit.view") ||
    hasPermission(role, "platform.blueprint.view");
  if (!allowed) {
    redirect("/unauthorized?reason=platform_console");
  }
  return user;
}

/** @deprecated Prefer requireTenantBusinessPortalAccess for M4 membership checks. */
export async function requireTenantAccess(slug: string): Promise<User> {
  const { requireTenantBusinessPortalAccess } = await import(
    "@/lib/auth/tenant-business-portal-guard"
  );
  const { user } = await requireTenantBusinessPortalAccess(slug);
  return user;
}

/** Client portal — client role, staff preview, or email-matched requests. */
/** C3 — authenticated session with ACTIVE platform account (self-service /account/*). */
export async function requireActivePlatformAccount(nextPath?: string): Promise<User> {
  const user = await requireAuth(nextPath);
  if (isAuthDisabled()) {
    return user;
  }
  if (!isAccountRegistrationEnabled()) {
    redirect("/login?error=config");
  }
  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (
    !account ||
    !isPlatformAccountActive(account) ||
    !isOnboardingGenerationCurrent(account.onboardingGeneration)
  ) {
    redirect(routes.onboarding.verifyEmail);
  }
  return user;
}

export async function requireClientAccess(nextPath = "/portal/requests"): Promise<User> {
  const user = await requireAuth(nextPath);
  if (isAuthDisabled()) {
    return user;
  }

  const { role } = getCrowAuth(user);
  if (canAccessPortal(role)) {
    return user;
  }

  if (user.email) {
    try {
      const count = await countRequestsForEmail(user.email);
      if (count > 0) {
        return user;
      }
    } catch {
      /* DB unavailable */
    }
  }

  redirect("/login?error=forbidden");
}
