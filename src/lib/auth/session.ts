import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { canAccessPortal, isPlatformStaff, type CrowRole } from "@/lib/auth/roles";
import {
  canAccessPlatformPath,
  hasPermission,
  type PermissionKey,
} from "@/lib/auth/permissions";
import {
  resolveAuthoritativeCrowAuth,
  resolveAuthoritativeCrowAuthContext,
  type AuthoritativeCrowAuthContext,
} from "@/lib/auth/authoritative-crow-auth";
import { gateAuthSessionForC3 } from "@/lib/account/c3-auth-orchestration";
import { isC3PlatformAccountGateEnabled } from "@/lib/account/feature-flags";
import {
  findPlatformAccountBySupabaseUserId,
  isPlatformAccountActive,
} from "@/lib/account/platform-account.service";
import { isOnboardingGenerationCurrent } from "@/lib/account/onboarding-generation";
import { createClient } from "@/lib/supabase/server";
import { isAuthDisabled } from "@/lib/supabase/env";
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

async function resolveGuardAuth(user: User): Promise<AuthoritativeCrowAuthContext> {
  if (isAuthDisabled()) {
    const role = devBypassRole();
    const tenantSlugs =
      role === "tenant_admin" ||
      role === "tenant_user" ||
      role === "auditor_readonly"
        ? [process.env.AUTH_DEV_TENANT_SLUG?.trim() || "meem-global"]
        : [];
    return {
      auth: { role, tenantSlugs },
      user: {
        ...user,
        app_metadata: { crow_role: role, tenant_slugs: tenantSlugs },
      } as User,
    };
  }
  return resolveAuthoritativeCrowAuthContext(user);
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
  await enforceC3HumanAccessGate(user);
  const { auth } = await resolveGuardAuth(user);
  if (!isPlatformStaff(auth.role)) {
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
  await enforceC3HumanAccessGate(user, pathname);
  const { auth } = await resolveGuardAuth(user);
  if (!canAccessPlatformPath(auth.role, pathname)) {
    redirect("/unauthorized?reason=permission");
  }
  return user;
}

export async function requirePermission(permission: PermissionKey): Promise<User> {
  const user = await requireAuth();
  if (isAuthDisabled()) {
    return user;
  }
  const { auth } = await resolveGuardAuth(user);
  if (!hasPermission(auth.role, permission)) {
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
  await enforceC3HumanAccessGate(user);
  const { auth } = await resolveGuardAuth(user);
  const allowed =
    isPlatformStaff(auth.role) ||
    hasPermission(auth.role, "platform.requests.view") ||
    hasPermission(auth.role, "platform.audit.view") ||
    hasPermission(auth.role, "platform.blueprint.view");
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

/** Enforce C3 legal + activation before any protected human application surface. */
export async function enforceC3HumanAccessGate(
  user: User,
  nextPath?: string
): Promise<void> {
  if (isAuthDisabled() || !isC3PlatformAccountGateEnabled()) {
    return;
  }

  const gate = await gateAuthSessionForC3(user, nextPath);
  if (gate.action === "redirect") {
    redirect(gate.path);
  }
  if (gate.action === "error") {
    redirect("/login?error=forbidden");
  }

  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (
    !account ||
    !isPlatformAccountActive(account) ||
    !isOnboardingGenerationCurrent(account.onboardingGeneration)
  ) {
    const q = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`${routes.account.registerLegal}${q}`);
  }
}

/** C3 — authenticated session with ACTIVE platform account (self-service /account/*). */
export async function requireActivePlatformAccount(nextPath?: string): Promise<User> {
  const user = await requireAuth(nextPath);
  if (isAuthDisabled()) {
    return user;
  }
  if (!isC3PlatformAccountGateEnabled()) {
    redirect("/login?error=config");
  }

  await enforceC3HumanAccessGate(user, nextPath);
  return user;
}

/** Client portal — authoritative customer relationship or staff preview only. */
export async function requireClientAccess(nextPath = "/portal/requests"): Promise<User> {
  const user = await requireAuth(nextPath);
  if (isAuthDisabled()) {
    return user;
  }

  await enforceC3HumanAccessGate(user, nextPath);

  const { auth } = await resolveGuardAuth(user);
  if (canAccessPortal(auth.role)) {
    return user;
  }

  redirect(routes.account.home);
}

/** Authoritative Crow auth for layouts and navigation. */
export async function requireAuthoritativeCrowAuth(
  nextPath?: string
): Promise<AuthoritativeCrowAuthContext> {
  const user = await requireAuth(nextPath);
  return resolveGuardAuth(user);
}

export { resolveAuthoritativeCrowAuth };
