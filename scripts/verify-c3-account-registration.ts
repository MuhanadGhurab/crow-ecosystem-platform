/**
 * C3 — Universal platform account registration static verifier.
 * Run: npm run c3-account:verify
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();

const REQUIRED_FILES = [
  "prisma/migrations/20260614140000_c3_account_registration/migration.sql",
  "prisma/migrations/20260614150000_c3_legal_agreement/migration.sql",
  "prisma/migrations/20260614160000_c3_public_schema_access_hardening/migration.sql",
  "src/lib/account/feature-flags.ts",
  "src/lib/account/otp-code.ts",
  "src/lib/account/platform-account.service.ts",
  "src/lib/account/email-verification.service.ts",
  "src/lib/account/c3-auth-orchestration.ts",
  "src/lib/account/platform-account-profile.service.ts",
  "src/lib/email/email-delivery.port.ts",
  "src/lib/email/in-memory-email-delivery.adapter.ts",
  "src/lib/email/get-email-delivery-port.ts",
  "src/lib/actions/account.ts",
  "src/lib/actions/account-legal.ts",
  "src/lib/legal/legal-document-hash.ts",
  "src/lib/legal/legal-document.service.ts",
  "src/lib/legal/legal-acceptance.service.ts",
  "src/lib/legal/account-consent.service.ts",
  "src/lib/legal/legal-content-sanitize.ts",
  "src/lib/legal/registration-locale.ts",
  "prisma/seed-legal-documents.ts",
  "src/app/register/page.tsx",
  "src/app/register/legal/page.tsx",
  "src/app/verify-email/page.tsx",
  "src/app/legal/[slug]/[versionId]/page.tsx",
  "src/app/account/legal/page.tsx",
  "src/components/account/verify-email-form.tsx",
  "src/components/account/legal-review-gate.tsx",
  "src/components/account/legal-document-panel.tsx",
  "src/components/account/account-legal-panel.tsx",
  "src/app/account/layout.tsx",
  "src/app/account/profile/page.tsx",
  "src/components/account/account-profile-form.tsx",
  "src/lib/account/otp-code.test.ts",
  "src/lib/legal/legal-document-hash.test.ts",
  "src/lib/legal/legal-acceptance.service.test.ts",
  "src/lib/legal/registration-legal-gate.test.ts",
  "src/lib/account/email-verification-legal-gate.test.ts",
  "docs/architecture/crow-core/c3/C3_EXISTING_ACCOUNT_AUTH_REQUEST_INVITE_MAPPING.md",
  "docs/architecture/crow-core/c3/C3_LEGAL_AGREEMENT_AND_CONSENT_ENGINE.md",
  "docs/architecture/crow-core/c3/30-C3-ACCOUNT-REGISTRATION-VERIFICATION.md",
];

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string) {
  console.error(`  ✗ ${msg}`);
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

  console.log("\n=== C3 account registration ===\n");

  for (const f of REQUIRED_FILES) {
    check(existsSync(join(ROOT, f)), `Required file: ${f}`, `Missing: ${f}`);
  }

  const rlsMigration = fileText(
    "prisma/migrations/20260614160000_c3_public_schema_access_hardening/migration.sql"
  );
  check(
    rlsMigration.includes("ENABLE ROW LEVEL SECURITY") &&
      rlsMigration.includes('REVOKE ALL ON TABLE "platform_accounts"'),
    "C3 RLS hardening migration denies PostgREST client access",
    "Add RLS + REVOKE hardening for C3 public tables"
  );

  const pkg = fileText("package.json");
  check(pkg.includes('"c3-account:verify"'), "package.json defines c3-account:verify", "Add c3-account:verify script");

  const schema = fileText("prisma/schema.prisma");
  check(schema.includes("model PlatformAccount"), "Prisma PlatformAccount model", "Missing PlatformAccount");
  check(
    schema.includes("model EmailVerificationChallenge"),
    "Prisma EmailVerificationChallenge model",
    "Missing EmailVerificationChallenge"
  );
  check(
    schema.includes("PENDING_EMAIL_VERIFICATION"),
    "PlatformAccountStatus includes PENDING_EMAIL_VERIFICATION",
    "Missing pending status enum"
  );
  check(schema.includes("model LegalDocument"), "Prisma LegalDocument model", "Missing LegalDocument");
  check(
    schema.includes("model LegalDocumentVersion"),
    "Prisma LegalDocumentVersion model",
    "Missing LegalDocumentVersion"
  );
  check(
    schema.includes("model AccountLegalAcceptance"),
    "Prisma AccountLegalAcceptance model",
    "Missing AccountLegalAcceptance"
  );
  check(
    schema.includes("model AccountConsentPreference"),
    "Prisma AccountConsentPreference model",
    "Missing AccountConsentPreference"
  );
  check(
    schema.includes("legal_acceptance_recorded"),
    "Audit event legal_acceptance_recorded",
    "Missing legal_acceptance_recorded audit type"
  );

  const flags = fileText("src/lib/account/feature-flags.ts");
  check(
    flags.includes('ACCOUNT_REGISTRATION_ENABLED') && flags.includes('=== "true"'),
    "Feature flag reads ACCOUNT_REGISTRATION_ENABLED",
    "feature-flags.ts must gate on ACCOUNT_REGISTRATION_ENABLED === true"
  );

  const otp = fileText("src/lib/account/otp-code.ts");
  check(
    otp.includes("EMAIL_VERIFICATION_CODE_SECRET") && otp.includes("challengeId"),
    "OTP hashing uses EMAIL_VERIFICATION_CODE_SECRET + challengeId",
    "otp-code.ts must HMAC with challengeId"
  );
  check(otp.includes("timingSafeEqual"), "OTP verify uses timingSafeEqual", "Use timing-safe compare");

  const platformSvc = fileText("src/lib/account/platform-account.service.ts");
  check(
    platformSvc.includes("assertC2DatabaseEnvironmentSafe"),
    "Platform account mutations call C2 guard",
    "platform-account.service must call assertC2DatabaseEnvironmentSafe"
  );

  const emailVerify = fileText("src/lib/account/email-verification.service.ts");
  check(
    emailVerify.includes("assertC2DatabaseEnvironmentSafe"),
    "Email verification mutations call C2 guard",
    "email-verification.service must call assertC2DatabaseEnvironmentSafe"
  );
  check(
    emailVerify.includes("hasMandatoryLegalAcceptanceComplete"),
    "Email verification requires legal acceptance before activation",
    "email-verification.service must gate activation on legal evidence"
  );
  check(
    emailVerify.includes("legal_incomplete"),
    "Email verification returns legal_incomplete when acceptances missing",
    "email-verification.service must surface legal_incomplete"
  );

  const activateIdx = platformSvc.indexOf("export async function activatePlatformAccount");
  const platformLegalIdx = platformSvc.indexOf("hasMandatoryLegalAcceptanceComplete");
  check(platformLegalIdx >= 0, "activatePlatformAccount checks legal completeness", "platform-account.service must check legal");
  check(
    activateIdx >= 0 && platformLegalIdx < platformSvc.indexOf('status: "ACTIVE"', activateIdx),
    "activatePlatformAccount blocks without legal evidence",
    "activatePlatformAccount must not set ACTIVE without legal acceptances"
  );

  const accountLegal = fileText("src/lib/actions/account-legal.ts");
  check(
    accountLegal.includes("completeRegistrationWithLegalAcceptance"),
    "completeRegistrationWithLegalAcceptance action exported",
    "account-legal.ts must export completeRegistrationWithLegalAcceptance"
  );
  check(
    accountLegal.includes("submitRegistrationLegalFormAction"),
    "submitRegistrationLegalFormAction exported",
    "account-legal.ts must export plain form action"
  );
  check(
    accountLegal.includes("resolveMandatoryAcceptancesForLocale"),
    "server-side legal version resolution",
    "account-legal must resolve legal versions server-side"
  );
  check(
    accountLegal.includes('void formData.get("scrolledToBottom")'),
    "Server ignores client scroll state",
    "account-legal must not trust scrolledToBottom"
  );
  check(
    accountLegal.includes("assertC2DatabaseEnvironmentSafe"),
    "account-legal mutations call C2 guard",
    "account-legal.ts must call assertC2DatabaseEnvironmentSafe"
  );

  const orchestration = fileText("src/lib/account/c3-auth-orchestration.ts");
  check(
    orchestration.includes("hasMandatoryLegalAcceptanceComplete"),
    "c3-auth-orchestration checks mandatory legal acceptance",
    "c3-auth-orchestration must call hasMandatoryLegalAcceptanceComplete"
  );
  check(
    orchestration.includes("registerLegalPath"),
    "c3-auth-orchestration routes to legal registration gate",
    "c3-auth-orchestration must define registerLegalPath"
  );
  check(
    orchestration.includes("gateAuthSessionForC3"),
    "gateAuthSessionForC3 exported",
    "Missing gateAuthSessionForC3"
  );
  check(
    orchestration.includes("runDeferredClientOnboarding"),
    "runDeferredClientOnboarding exported",
    "Missing deferred onboarding"
  );
  check(
    !orchestration.includes("assignDefaultClientRoleOnSignUp"),
    "Deferred onboarding does not auto-assign client role on activation",
    "c3-auth-orchestration must not call assignDefaultClientRoleOnSignUp"
  );

  check(
    orchestration.includes("isAccountRegistrationEnabled"),
    "Orchestration respects feature flag",
    "c3-auth-orchestration must check isAccountRegistrationEnabled"
  );

  const c3Landing = fileText("src/lib/auth/c3-post-auth-landing.ts");
  const auth = fileText("src/lib/actions/auth.ts");
  check(
    c3Landing.includes("resolveC3PostAuthLanding") && c3Landing.includes("routes.account.home"),
    "C3 post-auth landing routes active requesters to /account",
    "c3-post-auth-landing must route active accounts without role to account home"
  );
  check(
    auth.includes("resolveC3PostAuthLanding"),
    "auth.ts uses resolveC3PostAuthLanding for C3 sign-in",
    "auth.ts finalizeAuthUser must call resolveC3PostAuthLanding"
  );
  check(
    fileText("src/app/login/page.tsx").includes("resolveC3PostAuthLanding"),
    "Login page uses C3 post-auth landing",
    "login page must call resolveC3PostAuthLanding"
  );
  check(
    auth.includes("routes.account.registerLegal"),
    "auth.ts redirects signup to legal registration gate",
    "auth.ts must redirect to /register/legal after signup"
  );
  check(
    !auth.includes("bootstrapPlatformAccountOnSignUp"),
    "auth.ts does not bootstrap account before legal acceptance",
    "auth.ts must not call bootstrapPlatformAccountOnSignUp on signup"
  );
  check(
    auth.includes("gateAuthSessionForC3"),
    "auth.ts wires C3 session gate",
    "auth.ts must call gateAuthSessionForC3"
  );
  check(
    auth.includes("isC3AuthEnabled") || auth.includes("isAccountRegistrationEnabled"),
    "auth.ts branches on C3 flag",
    "auth.ts must gate legacy vs C3 paths"
  );

  const callback = fileText("src/app/auth/callback/route.ts");
  check(
    callback.includes("gateAuthSessionForC3"),
    "OAuth callback uses C3 gate",
    "callback route must call gateAuthSessionForC3"
  );

  const middleware = fileText("src/lib/supabase/middleware.ts");
  check(
    middleware.includes("isC3SessionOnlyPath") && middleware.includes("isAccountRegistrationEnabled"),
    "Middleware gates C3 session-only paths",
    "middleware must gate /account and /verify-email when C3 on"
  );

  const routeProtection = fileText("src/lib/auth/route-protection.ts");
  check(routeProtection.includes('"verify-email"'), "verify-email reserved segment", "Add verify-email segment");
  check(
    routeProtection.includes("isC3SessionOnlyPath"),
    "isC3SessionOnlyPath helper",
    "route-protection must define isC3SessionOnlyPath"
  );
  check(
    routeProtection.includes("isC3LegalRegistrationPath"),
    "isC3LegalRegistrationPath helper",
    "route-protection must define isC3LegalRegistrationPath"
  );
  check(
    routeProtection.includes("isPublicLegalDocumentPath"),
    "isPublicLegalDocumentPath helper",
    "route-protection must define isPublicLegalDocumentPath"
  );
  check(
    routeProtection.includes('"/register"'),
    "/register in public prefixes",
    "Add /register to PUBLIC_PREFIXES"
  );

  const permissions = fileText("src/lib/auth/permissions.ts");
  check(
    permissions.includes("account.profile.read.self") &&
      permissions.includes("account.profile.update.self"),
    "Account self permissions defined",
    "permissions.ts must define account.profile.*.self"
  );
  check(
    permissions.includes("account.legal.read.self"),
    "account.legal.read.self permission",
    "permissions.ts must define account.legal.read.self"
  );
  check(
    permissions.includes("account.consent.update.self"),
    "account.consent.update.self permission",
    "permissions.ts must define account.consent.update.self"
  );

  const session = fileText("src/lib/auth/session.ts");
  check(
    session.includes("requireActivePlatformAccount"),
    "requireActivePlatformAccount helper",
    "session.ts must export requireActivePlatformAccount"
  );

  const accountActions = fileText("src/lib/actions/account.ts");
  check(
    accountActions.includes("verifyEmailCode") && accountActions.includes("updateAccountProfile"),
    "Account server actions exist",
    "account.ts must export verify/profile actions"
  );
  check(
    accountActions.includes("isAccountRegistrationEnabled"),
    "Account actions gated by feature flag",
    "account actions must check isAccountRegistrationEnabled"
  );
  check(
    !accountActions.includes("runDeferredClientOnboarding"),
    "Verify action does not auto-sign-in after OTP",
    "verifyEmailCode must not run deferred onboarding or auto session"
  );
  check(
    accountActions.includes("verified=1") || accountActions.includes('verified: "1"'),
    "Verify action redirects to login with verified flag",
    "verifyEmailCode must redirect to /login?verified=1"
  );

  const routes = fileText("src/lib/routes.ts");
  check(
    routes.includes("account:") && routes.includes("verifyEmail"),
    "routes.account.* defined",
    "routes.ts must define account routes"
  );
  check(
    routes.includes('registerLegal: "/register/legal"'),
    "routes.account.registerLegal defined",
    "routes.ts must define registerLegal"
  );
  check(
    routes.includes('legal: "/account/legal"'),
    "routes.account.legal defined",
    "routes.ts must define account legal route"
  );
  check(
    routes.includes("legalDocumentView"),
    "routes.account.legalDocumentView defined",
    "routes.ts must define public legal document view helper"
  );

  const inMemoryEmail = fileText("src/lib/email/in-memory-email-delivery.adapter.ts");
  check(
    inMemoryEmail.includes("deliveries"),
    "In-memory email adapter exposes deliveries for tests",
    "InMemoryEmailDeliveryAdapter must track deliveries"
  );

  const hostedEmail = fileText("src/lib/email/get-email-delivery-port.ts");
  check(
    hostedEmail.includes("ResendEmailDeliveryAdapter") &&
      hostedEmail.includes("assertHostedEmailProviderConfigured"),
    "Hosted email uses Resend adapter with configuration guard",
    "get-email-delivery-port must wire Resend for hosted environments"
  );
  check(
    existsSync(join(ROOT, "src/lib/email/resend-email-delivery.adapter.ts")),
    "Resend email delivery adapter present",
    "Add resend-email-delivery.adapter.ts"
  );

  const registerPage = fileText("src/app/register/page.tsx");
  check(
    registerPage.includes("signupWithNext") || registerPage.includes("routes.auth.signup"),
    "/register aliases to signup",
    "/register must redirect to signup"
  );

  const verifyPage = fileText("src/app/verify-email/page.tsx");
  check(
    verifyPage.includes("VerifyEmailForm") && verifyPage.includes("isAccountRegistrationEnabled"),
    "/verify-email page gated",
    "verify-email page must check C3 flag"
  );
  check(
    verifyPage.includes("routes.account.registerLegal"),
    "/verify-email redirects missing account to legal gate",
    "verify-email page must redirect to registerLegal when no account"
  );

  const accountLayout = fileText("src/app/account/layout.tsx");
  check(
    accountLayout.includes("requireActivePlatformAccount"),
    "/account layout requires ACTIVE account",
    "account layout must call requireActivePlatformAccount"
  );

  console.log(passed ? "\nc3-account:verify PASSED\n" : "\nc3-account:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
