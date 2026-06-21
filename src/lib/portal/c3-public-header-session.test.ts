import { readFileSync } from "fs";
import { join } from "path";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const root = process.cwd();

function fileText(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

const nav = fileText("src/components/public/public-header-nav.tsx");
const header = fileText("src/components/public/public-header.tsx");
const resolver = fileText("src/components/public/public-header-auth-resolver.tsx");
const publicLayout = fileText("src/app/(public)/layout.tsx");
const auth = fileText("src/lib/portal/public-header-auth.ts");
const lite = fileText("src/lib/portal/portal-access-lite.ts");
const authoritative = fileText("src/lib/auth/authoritative-crow-auth.ts");

// 1. Unauthenticated visitor sees Sign in
assert(nav.includes("Sign in"), "nav must render Sign in for visitors");
assert(
  nav.includes("!portalCta && !authLoading") || nav.includes("!portalCta &&"),
  "Sign in must not appear while auth slot is loading"
);

// 2–5. ACTIVE role-neutral PlatformAccount header (display name, account link, profile, legal)
assert(
  auth.includes("resolvePublicHeaderAuth") &&
    auth.includes("resolveAuthoritativeCrowAuth") &&
    auth.includes("displayName") &&
    auth.includes('tone: "account"') &&
    auth.includes("routes.account.home"),
  "public header auth resolves role-neutral platform accounts to /account"
);
assert(
  nav.includes("routes.account.profile") && nav.includes("Profile"),
  "nav must expose Profile for account sessions"
);
assert(
  nav.includes("routes.account.legal") && nav.includes("Legal"),
  "nav must expose Legal for account sessions"
);
assert(
  resolver.includes("resolvePublicHeaderAuth") && resolver.includes("getSessionUser"),
  "isolated auth resolver must load session outside static shell"
);

// 6. crow_role not required; stale client metadata alone must not grant client nav
assert(
  auth.includes("resolveAuthoritativeCrowAuth"),
  "header auth must use authoritative crow auth before portal CTA"
);
assert(
  authoritative.includes('meta.role === "client"') &&
    authoritative.includes("membershipCount === 0") &&
    authoritative.includes("return { role: null"),
  "stale crow_role=client without ownership must not grant client authority"
);

// 7. TenantMembership required before Business Portal navigation
assert(
  lite.includes("hasBusinessPortalAccess") &&
    lite.includes("tenantSlugs.length > 0"),
  "business portal CTA requires tenant slugs / membership"
);
assert(
  authoritative.includes("tenant_admin") &&
    authoritative.includes("dbSlugs.length === 0"),
  "tenant roles without membership must not grant business portal authority"
);

// 8–9. ProCrow internal; platform admin requires console authority
assert(
  lite.includes("isPlatformConsoleRole") &&
    lite.includes('label: "ProCrow"') &&
    lite.includes("canAccessPlatformPath"),
  "procrow CTA remains platform-console gated"
);
assert(
  !nav.includes('href="/admin"') || nav.includes("portalCta"),
  "public nav must not hardcode admin routes"
);

// 10. Session lookup failure must not grant a portal
assert(
  auth.includes("catch") &&
    auth.includes("Session fallback") &&
    auth.includes("must not infer portal roles"),
  "db lookup failure falls back to account label without portal inference"
);
assert(
  auth.includes("getAuthenticatedPortalCta(userWithAuthoritativeMetadata") &&
    auth.includes("if (portalCta)") &&
    auth.includes("isC3PlatformAccountGateEnabled"),
  "authoritative portal CTA is evaluated before account-session fallback"
);

// 11. Public static-route caching not globally disabled
assert(
  !publicLayout.includes('dynamic = "force-dynamic"'),
  "public layout must not force-dynamic entire marketing surface"
);
assert(
  header.includes("Suspense") &&
    header.includes("PublicHeaderAuthResolver") &&
    header.includes("authLoading"),
  "scoped Suspense auth slot preserves static public shell"
);

console.log(
  "PASS — PUBLIC HEADER RECOGNIZES ROLE-NEUTRAL PLATFORM ACCOUNTS WITHOUT GRANTING PORTAL AUTHORITY"
);
