import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

function readSrc(rel: string): string {
  return readFileSync(resolve(root, rel), "utf8");
}

function extractFunctionBody(source: string, exportName: string): string {
  const start = source.indexOf(`export async function ${exportName}`);
  assert.notEqual(start, -1, `${exportName} must exist`);
  const braceStart = source.indexOf("{", start);
  let depth = 0;
  for (let i = braceStart; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error(`Could not parse ${exportName}`);
}

{
  const accountActions = readSrc("src/lib/actions/account.ts");
  const updateProfile = extractFunctionBody(accountActions, "updateAccountProfile");
  assert(
    !updateProfile.includes("isAccountRegistrationEnabled"),
    "updateAccountProfile must not depend on ACCOUNT_REGISTRATION_ENABLED"
  );
  assert(
    updateProfile.includes("requireActivePlatformAccount"),
    "updateAccountProfile must require an active platform account session"
  );
  assert(
    updateProfile.includes("findPlatformAccountBySupabaseUserId(user.id)"),
    "profile update must bind to authenticated Supabase user"
  );
  assert(
    updateProfile.includes("isPlatformAccountActive(account)"),
    "profile update must require ACTIVE platform account"
  );
  assert(
    !updateProfile.includes("formData.get(\"platformAccountId\")"),
    "profile update must ignore client-supplied account ids"
  );

  const verifyEmail = extractFunctionBody(accountActions, "verifyEmailCode");
  assert(
    verifyEmail.includes("isAccountRegistrationEnabled"),
    "email verification remains registration-gated"
  );
}

{
  const legalPage = readSrc("src/app/account/legal/page.tsx");
  assert(
    !legalPage.includes("isAccountRegistrationEnabled"),
    "account legal page must not block existing accounts when registration is disabled"
  );
  assert(
    legalPage.includes("requireActivePlatformAccount"),
    "account legal page must require active platform account"
  );
}

{
  const legalActions = readSrc("src/lib/actions/account-legal.ts");
  const marketing = extractFunctionBody(legalActions, "updateMarketingConsent");
  const reaccept = extractFunctionBody(legalActions, "recordReacceptance");
  assert(
    !marketing.includes("isAccountRegistrationEnabled"),
    "marketing consent must not depend on registration flag"
  );
  assert(
    !reaccept.includes("isAccountRegistrationEnabled"),
    "legal reacceptance must not depend on registration flag"
  );
  assert(
    marketing.includes("requireActivePlatformAccount"),
    "marketing consent must require active platform account"
  );
  assert(
    reaccept.includes("requireActivePlatformAccount"),
    "legal reacceptance must require active platform account"
  );

  const registrationLegal = readSrc("src/lib/actions/account-legal.ts");
  assert(
    registrationLegal.includes("completeRegistrationWithLegalAcceptanceInternal") &&
      registrationLegal.includes("isAccountRegistrationEnabled") &&
      registrationLegal.includes("isOAuthLegalSurface"),
    "new registration legal acceptance remains registration-gated with OAuth exception"
  );
}

{
  const profilePage = readSrc("src/app/account/profile/page.tsx");
  assert(
    profilePage.includes("requireActivePlatformAccount"),
    "profile page must require active platform account"
  );
  assert(
    !profilePage.includes("isAccountRegistrationEnabled"),
    "profile page must not depend on registration flag"
  );
}

{
  const session = readSrc("src/lib/auth/session.ts");
  const requireActive = extractFunctionBody(session, "requireActivePlatformAccount");
  assert(
    requireActive.includes("enforceC3HumanAccessGate"),
    "active account guard must enforce legal/onboarding gate"
  );
}

{
  const profileService = readSrc("src/lib/account/platform-account-profile.service.ts");
  assert(
    profileService.includes("assertProfileFieldLimits"),
    "profile service must validate field lengths"
  );
  assert(
    !profileService.includes("crow_role") &&
      !profileService.includes("legalAcceptance") &&
      !profileService.includes("TenantMembership"),
    "profile service must not mutate role, legal, or membership state"
  );
}

{
  const registerLegal = readSrc("src/app/register/legal/page.tsx");
  assert(
    registerLegal.includes("isAccountRegistrationEnabled") &&
      registerLegal.includes("oauthLegalSurface"),
    "registration legal page keeps registration lockdown with OAuth exception"
  );
}

console.log(
  "PASS — EXISTING ACTIVE PLATFORM ACCOUNT PROFILE WORKS WHILE PUBLIC REGISTRATION REMAINS DISABLED"
);
