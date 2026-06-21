/**
 * C3.10N — Static verification that Google OAuth always passes through the
 * current Crow legal gate before role-aware landing.
 * Run: npm run c3-google-hosted-routing:verify
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string) {
  console.error(`  ✗ ${msg}`);
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

  console.log("\n=== C3.10N Google hosted routing & legal gate ===\n");

  const callback = read("src/app/auth/callback/route.ts");
  check(
    callback.includes("C3_OAUTH_PROVIDER_COOKIE"),
    "OAuth callback reads server Google provider cookie",
    "callback must read c3_oauth_provider cookie"
  );
  check(
    callback.includes("routes.auth.resolving"),
    "OAuth callback hands off to Crow resolver",
    "callback must redirect to /auth/resolving"
  );
  check(
    callback.includes("isGoogleSsoEnabled()") &&
      callback.indexOf("assignDefaultClientRoleOnSignUp") >
        callback.lastIndexOf("if (isGoogleSsoEnabled())"),
    "Legacy client role assignment blocked when Google SSO enabled",
    "callback must fail closed to resolver before client role assignment"
  );

  const googleRoute = read("src/app/auth/google/route.ts");
  check(
    googleRoute.includes('oauthProviderCookieOptions().name') &&
      googleRoute.includes('"google"'),
    "Google start sets provider cookie",
    "/auth/google must set c3_oauth_provider=google"
  );

  const resolver = read("src/lib/auth/c3-post-auth-resolution.ts");
  const resolverIdx = resolver.indexOf("gateAuthSessionForC3");
  const landingIdx = resolver.indexOf("resolveC3PostAuthLanding");
  check(
    resolverIdx >= 0 && landingIdx > resolverIdx,
    "Resolver runs legal gate before role landing",
    "gateAuthSessionForC3 must precede resolveC3PostAuthLanding"
  );

  const session = read("src/lib/auth/session.ts");
  check(
    session.includes("enforceC3HumanAccessGate"),
    "Shared human access gate exported",
    "session.ts must export enforceC3HumanAccessGate"
  );
  check(
    session.includes("requireClientAccess") &&
      session.indexOf("enforceC3HumanAccessGate") <
        session.indexOf("requireClientAccess"),
    "Client portal uses human access gate",
    "requireClientAccess must call enforceC3HumanAccessGate"
  );

  const tenantGuard = read("src/lib/auth/tenant-business-portal-guard.ts");
  check(
    tenantGuard.includes("enforceC3HumanAccessGate"),
    "Tenant Business Portal uses human access gate",
    "tenant guard must call enforceC3HumanAccessGate"
  );

  const registerLegal = read("src/app/register/legal/page.tsx");
  check(
    registerLegal.includes("hasMandatoryLegalAcceptanceComplete") &&
      registerLegal.includes("isOnboardingGenerationCurrent"),
    "Legal page checks current mandatory versions before skipping",
    "register/legal must verify current legal before leaving gate"
  );

  const login = read("src/app/login/page.tsx");
  check(
    login.includes("redirectAuthenticatedSession"),
    "Login existing session uses canonical authenticated entry",
    "login must not bypass legal gate for existing sessions"
  );

  const entry = read("src/lib/auth/c3-authenticated-entry.ts");
  check(
    entry.includes("gateAuthSessionForC3") && entry.includes("routes.auth.resolving"),
    "Authenticated entry reuses gate and resolver for Google",
    "c3-authenticated-entry must gate before landing"
  );

  const legalSvc = read("src/lib/legal/legal-acceptance.service.ts");
  check(
    legalSvc.includes("getCurrentPublishedMandatoryVersions"),
    "Legal completeness uses current published mandatory versions",
    "legal gate must compare current mandatory versions"
  );

  const resolverUi = read("src/components/auth/crow-post-auth-resolver.tsx");
  check(
    resolverUi.includes("Securing your Google session"),
    "Resolver shows Google session stage copy",
    "resolver UI missing Google session stage"
  );

  check(
    existsSync(join(ROOT, "src/app/auth/resolving/page.tsx")),
    "Resolver route exists",
    "missing /auth/resolving page"
  );
  check(
    existsSync(join(ROOT, "src/app/auth/account-status/page.tsx")),
    "Account status route exists",
    "missing /auth/account-status page"
  );

  const unit = spawnSync("npx", ["tsx", "src/lib/account/c3-google-hosted-routing.test.ts"], {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
  });
  if (unit.status !== 0) {
    passed = false;
  }

  console.log("");
  if (passed) {
    console.log(
      "PASS — GOOGLE AUTHENTICATION ALWAYS PASSES THROUGH CURRENT CROW LEGAL GATE BEFORE ROLE LANDING\n"
    );
    process.exit(0);
  }

  console.error("FAIL — Google hosted routing / legal gate verification failed\n");
  process.exit(1);
}

main();
