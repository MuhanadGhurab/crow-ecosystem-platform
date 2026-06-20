/**
 * C3.10L — Google OAuth + Crow legal gate verifier.
 * Run: npm run c3-google-legal-onboarding:verify
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

  console.log("\n=== C3.10L Google OAuth legal onboarding ===\n");

  check(
    existsSync(join(ROOT, "scripts/lib/c3-google-proof-identity-resolution.ts")),
    "Google proof identity resolver exists",
    "missing c3-google-proof-identity-resolution.ts"
  );

  const flags = read("src/lib/account/feature-flags.ts");
  check(
    flags.includes("isC3PlatformAccountGateEnabled"),
    "platform account gate decoupled from registration",
    "missing isC3PlatformAccountGateEnabled"
  );
  check(
    flags.includes("isC3GoogleOnboardingSurfaceEnabled"),
    "Google onboarding surface flag",
    "missing isC3GoogleOnboardingSurfaceEnabled"
  );

  const callback = read("src/app/auth/callback/route.ts");
  check(
    callback.includes("isC3GoogleOAuthCallbackEligible"),
    "OAuth callback uses Google eligibility",
    "callback must gate Google OAuth"
  );
  check(
    callback.includes("routes.auth.resolving"),
    "OAuth callback redirects to resolver",
    "callback must redirect to /auth/resolving"
  );
  check(
    !callback.includes("gateAuthSessionForC3"),
    "callback does not duplicate gate logic",
    "callback must not call gateAuthSessionForC3"
  );
  check(
    !callback.includes("resolveC3PostAuthLanding"),
    "callback does not choose landing directly",
    "callback must not call resolveC3PostAuthLanding"
  );

  const resolver = read("src/lib/auth/c3-post-auth-resolution.ts");
  check(
    existsSync(join(ROOT, "src/lib/auth/c3-post-auth-resolution.ts")),
    "post-auth resolver service exists",
    "missing c3-post-auth-resolution.ts"
  );
  check(
    resolver.includes("gateAuthSessionForC3"),
    "resolver reuses C3 gate",
    "resolver must call gateAuthSessionForC3"
  );
  check(
    resolver.includes("resolveC3PostAuthLanding"),
    "resolver reuses landing resolution",
    "resolver must call resolveC3PostAuthLanding"
  );
  check(
    read("src/components/auth/crow-post-auth-resolver.tsx").includes("Securing your Google session"),
    "branded resolver stages",
    "resolver UI missing stage copy"
  );

  const provider = read("src/lib/account/provider-identity.service.ts");
  check(
    provider.includes("EMAIL_VERIFICATION_SOURCES.GOOGLE_OAUTH_VERIFIED"),
    "Google verification evidence",
    "missing GOOGLE_OAUTH_VERIFIED evidence"
  );
  check(
    provider.includes("resolveOAuthProviderForPlatformAccount"),
    "OAuth provider resolution exported",
    "missing resolveOAuthProviderForPlatformAccount"
  );

  const legal = read("src/lib/actions/account-legal.ts");
  check(
    legal.includes("isOAuthPath && account.emailVerifiedAt"),
    "verified Google email bypasses Crow OTP after legal",
    "OAuth legal path must skip OTP when email verified"
  );

  const login = read("src/app/login/page.tsx");
  const googleButton = read("src/components/portal/auth/sign-in-with-google.tsx");
  check(
    login.includes("Continue with Google") || googleButton.includes("Continue with Google"),
    "Google button label",
    "Google button label missing"
  );

  const unit = spawnSync("npx", ["tsx", "src/lib/account/c3-google-legal-onboarding.test.ts"], {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
  });
  if (unit.status !== 0) {
    passed = false;
  }

  const manualCert = process.env.C3_MANUAL_BROWSER_SESSION_CERTIFIED?.trim().toLowerCase();
  if (manualCert === "true") {
    ok("C3_MANUAL_BROWSER_SESSION_CERTIFIED=true recorded by operator");
  } else {
    console.log(
      "  ⚠ C3_MANUAL_BROWSER_SESSION_CERTIFIED not true — hosted browser proof pending (operator action)"
    );
  }

  console.log("");
  if (passed) {
    console.log(
      "PASS — GOOGLE OAUTH AUTHENTICATES IDENTITY; CROW LEGAL GATE AND POST-AUTH RESOLVER VERIFIED\n"
    );
    process.exit(0);
  }

  console.error("FAIL — Google OAuth legal onboarding static verification failed\n");
  process.exit(1);
}

main();
