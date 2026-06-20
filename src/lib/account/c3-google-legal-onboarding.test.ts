import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

function readSrc(rel: string): string {
  return readFileSync(resolve(root, rel), "utf8");
}

{
  const flags = readSrc("src/lib/account/feature-flags.ts");
  assert(flags.includes("isC3PlatformAccountGateEnabled"), "platform gate flag");
  assert(flags.includes("isGoogleSsoEnabled"), "google SSO wired into platform gate");
}

{
  const callback = readSrc("src/app/auth/callback/route.ts");
  assert(callback.includes("isC3GoogleOAuthCallbackEligible"), "callback gates Google OAuth");
  assert(callback.includes("routes.auth.resolving"), "callback hands off to Crow resolver");
  assert(callback.includes("C3_OAUTH_PROVIDER_COOKIE"), "callback reads Google provider cookie");
  assert(
    callback.includes("isGoogleSsoEnabled()") &&
      callback.indexOf("assignDefaultClientRoleOnSignUp") >
        callback.lastIndexOf("if (isGoogleSsoEnabled())"),
    "client role assignment unreachable when Google SSO enabled"
  );
  assert(callback.includes("exchangeCodeForSession"), "PKCE code exchange");
  assert(callback.includes("Cache-Control"), "no-store on OAuth response");
  assert(!callback.includes("gateAuthSessionForC3"), "callback must not duplicate C3 gate");
}

{
  const session = readSrc("src/lib/auth/session.ts");
  assert(session.includes("enforceC3HumanAccessGate"), "human portals share legal gate");
}

{
  const registerLegal = readSrc("src/app/register/legal/page.tsx");
  assert(
    registerLegal.includes("hasMandatoryLegalAcceptanceComplete") &&
      registerLegal.includes("isOnboardingGenerationCurrent"),
    "legal page requires current mandatory acceptance before exit"
  );
}

{
  const resolver = readSrc("src/lib/auth/c3-post-auth-resolution.ts");
  assert(resolver.includes("gateAuthSessionForC3"), "resolver reuses C3 gate");
  assert(resolver.includes("resolveC3PostAuthLanding"), "resolver reuses landing policy");
  assert(resolver.includes("resolvePlatformAccountForOAuthUser"), "resolver links provider identity");
}

{
  const resolverPage = readSrc("src/app/auth/resolving/page.tsx");
  assert(resolverPage.includes("CrowPostAuthResolver"), "branded resolver page");
}

{
  const provider = readSrc("src/lib/account/provider-identity.service.ts");
  assert(provider.includes("GOOGLE_OAUTH_VERIFIED"), "Google verification source recorded");
  assert(provider.includes("email_confirmed_at"), "uses Supabase confirmed email state");
  assert(provider.includes("identity_data?.email_verified"), "uses provider verified claim");
  assert(!provider.includes("user_metadata?.email_verified"), "must not trust editable metadata alone");
  assert(provider.includes("provider_collision"), "collision fails safely");
}

{
  const orch = readSrc("src/lib/account/c3-auth-orchestration.ts");
  assert(orch.includes("isC3PlatformAccountGateEnabled"), "gate runs when Google SSO enabled");
  assert(orch.includes("routes.onboarding.legal"), "legal gate before account");
}

{
  const legal = readSrc("src/lib/actions/account-legal.ts");
  assert(legal.includes("isC3GoogleOnboardingSurfaceEnabled"), "OAuth legal when registration off");
  assert(
    legal.includes("isOAuthPath && account.emailVerifiedAt"),
    "verified Google email skips Crow OTP"
  );
  assert(legal.includes("activatePlatformAccountIfReady"), "legal=3 activates when ready");
}

{
  const middleware = readSrc("src/lib/supabase/middleware.ts");
  assert(middleware.includes("isC3PlatformAccountGateEnabled"), "account session gate with Google SSO");
}

{
  const googleRoute = readSrc("src/app/auth/google/route.ts");
  assert(googleRoute.includes("routes.account.home"), "Google OAuth default next is /account");
  assert(googleRoute.includes("isGoogleSsoEnabled"), "Google start hidden when misconfigured");
}

{
  const signOut = readSrc("src/app/auth/signout/route.ts");
  assert(signOut.includes("status: 405"), "GET sign-out returns 405");
  assert(signOut.includes("export async function POST"), "POST sign-out supported");
}

{
  const emailSvc = readSrc("src/lib/account/email-verification.service.ts");
  const legalBlock = readSrc("src/lib/actions/account-legal.ts");
  assert(
    !legalBlock.includes("issueEmailVerificationCode({") ||
      legalBlock.includes("isOAuthPath && account.emailVerifiedAt"),
    "Google verified path must not require Crow OTP"
  );
  assert(!emailSvc.includes("assignDefaultClientRole"), "email verify must not assign roles");
}

console.log("c3-google-legal-onboarding: all static checks passed");
