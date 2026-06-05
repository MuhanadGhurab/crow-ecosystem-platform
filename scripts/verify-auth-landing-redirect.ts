/**
 * K2.5 — Post-auth landing + public portal CTA guards.
 *
 *   npm run auth-landing:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

function fail(msg: string) {
  console.error(`FAIL: ${msg}`);
  return false;
}

function ok(msg: string) {
  console.log(`OK: ${msg}`);
  return true;
}

function fileText(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function main() {
  let passed = true;
  const check = (cond: boolean, passMsg: string, failMsg: string) => {
    if (cond) ok(passMsg);
    else {
      fail(failMsg);
      passed = false;
    }
  };

  console.log("\n=== K2.5 Auth landing redirect ===\n");

  const pkg = fileText("package.json");
  check(pkg.includes('"auth-landing:verify"'), "package.json defines auth-landing:verify", "Add npm script");

  const landing = fileText("src/lib/auth/post-login-redirect.ts");
  const portalCtaSource = existsSync(join(ROOT, "src/lib/portal/portal-access-lite.ts"))
    ? `${landing}\n${fileText("src/lib/portal/portal-access-lite.ts")}`
    : landing;
  check(
    landing.includes("resolvePostAuthLanding") && landing.includes("getAuthenticatedPortalCta"),
    "Centralized post-auth landing helpers",
    "post-login-redirect must export resolvePostAuthLanding + getAuthenticatedPortalCta"
  );
  check(
    landing.includes('routes.client.home') || landing.includes('"/client"'),
    "Client default landing is /client",
    "Client default must be /client"
  );
  check(
    landing.includes("routes.admin.overview") || landing.includes('"/admin/overview"'),
    "Platform admin default is /admin/overview",
    "Staff default must be /admin/overview"
  );
  check(
    landing.includes("role_config") || landing.includes("no_role"),
    "No-role users get login error path",
    "Handle missing role with login error"
  );
  check(
    portalCtaSource.includes('label: "ProCrow"') && portalCtaSource.includes("isPlatformConsoleRole"),
    "ProCrow CTA only for platform console roles",
    "getAuthenticatedPortalCta must gate ProCrow label"
  );
  check(
    !portalCtaSource.includes('label: "ProCrow"') || portalCtaSource.includes("isClient(role)"),
    "Portal CTA distinguishes client vs platform",
    "Portal CTA role branching"
  );

  const login = fileText("src/app/login/page.tsx");
  const signup = fileText("src/app/signup/page.tsx");
  check(
    login.includes("resolvePostAuthLanding") && login.includes("existingUser"),
    "Login redirects signed-in users",
    "Login page must redirect existing session"
  );
  check(
    signup.includes("resolvePostAuthLanding") && signup.includes("existingUser"),
    "Signup redirects signed-in users",
    "Signup page must redirect existing session"
  );

  const authActions = fileText("src/lib/actions/auth.ts");
  check(
    authActions.includes("refreshSessionUser") && authActions.includes("resolvePostAuthLanding"),
    "Sign-in refreshes session and uses post-auth landing",
    "auth.ts must refresh session before landing"
  );
  check(
    authActions.includes("assignDefaultClientRoleOnSignUp"),
    "Sign-in may assign client role when missing",
    "finalizeAuthUser must attempt client role assignment"
  );

  const callback = fileText("src/app/auth/callback/route.ts");
  check(
    callback.includes("resolvePostAuthLanding") && callback.includes("refreshSessionUser"),
    "OAuth callback uses landing + session refresh",
    "callback route must refresh session after role assign"
  );

  const requestPage = fileText("src/app/(public)/request/page.tsx");
  check(
    requestPage.includes("signupWithNext"),
    "/request redirects unauthenticated users to signup",
    "/request must use signupWithNext"
  );

  const header = fileText("src/components/public/public-header.tsx");
  const headerNav = fileText("src/components/public/public-header-nav.tsx");
  check(
    header.includes("getAuthenticatedPortalCta") && header.includes("getSessionUser"),
    "Public header resolves session portal CTA",
    "PublicHeader must be server-aware"
  );
  check(
    !headerNav.includes("/admin") || headerNav.includes("portalCta"),
    "Public header nav uses portalCta prop (no hardcoded admin)",
    "Do not hardcode /admin in public header nav"
  );
  check(
    headerNav.includes("portalCta.label") && headerNav.includes("Sign in"),
    "Header shows portal CTA or Sign in",
    "Public header nav alternates CTA"
  );

  const linkService = fileText("src/lib/services/client-request-link.service.ts");
  check(
    !/crow_role:\s*["']platform_admin["']/.test(linkService),
    "Signup paths never assign platform_admin",
    "link service must not assign platform_admin"
  );

  console.log(passed ? "\nauth-landing:verify PASSED\n" : "\nauth-landing:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
