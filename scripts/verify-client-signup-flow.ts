/**
 * Client sign-up flow — auth hardening guards (pre-K2 browser smoke).
 *
 *   npm run client-signup:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED_FILES = [
  "src/app/signup/page.tsx",
  "src/components/portal/auth/sign-up-form.tsx",
  "src/lib/actions/auth.ts",
  "src/lib/auth/sanitize-auth-next.ts",
  "src/lib/services/client-request-link.service.ts",
  "scripts/verify-client-signup-flow.ts",
] as const;

const SIGNUP_ROLE_PATHS = [
  "src/lib/services/client-request-link.service.ts",
  "src/lib/actions/auth.ts",
  "src/app/auth/callback/route.ts",
] as const;

const CLIENT_FACING_AUTH_PATHS = [
  "src/components/portal/auth/sign-in-form.tsx",
  "src/components/portal/auth/sign-up-form.tsx",
  "src/components/portal/auth/sign-in-with-google.tsx",
  "src/components/portal/auth/sign-in-with-entra.tsx",
  "src/app/login/page.tsx",
  "src/app/signup/page.tsx",
] as const;

const FORBIDDEN_SIGNUP_PHRASES = [
  "pay now",
  "live checkout",
  "activate live payments",
  "automatic tenant provisioning",
  "auto-provision tenant",
  "production go-live approved",
  "certified compliant",
  "legally binding",
  "e-signature complete",
] as const;

const DANGEROUS_PATTERNS: { label: string; paths: string[]; pattern: RegExp }[] = [
  {
    label: "Sign-up must not assign platform_admin",
    paths: SIGNUP_ROLE_PATHS,
    pattern: /crow_role:\s*["']platform_admin["']|platform_admin.*signUp|signUp.*platform_admin/i,
  },
  {
    label: "Client-facing auth must not import service role",
    paths: CLIENT_FACING_AUTH_PATHS,
    pattern: /SUPABASE_SERVICE_ROLE|service_role/,
  },
  {
    label: "Sign-up form must not expose service role",
    paths: ["src/components/portal/auth/sign-up-form.tsx"],
    pattern: /createClient\(.*service/i,
  },
];

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

function scanForbidden(rel: string): string | null {
  const lower = fileText(rel).toLowerCase();
  for (const phrase of FORBIDDEN_SIGNUP_PHRASES) {
    if (lower.includes(phrase)) return phrase;
  }
  return null;
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

  console.log("\n=== Client sign-up flow ===\n");

  for (const f of REQUIRED_FILES) {
    check(existsSync(join(ROOT, f)), `Required file: ${f}`, `Missing: ${f}`);
  }

  const pkg = fileText("package.json");
  check(pkg.includes('"client-signup:verify"'), "package.json defines client-signup:verify", "Add script");

  const routes = fileText("src/lib/routes.ts");
  check(routes.includes("signup:") && routes.includes("signupWithNext"), "routes.auth.signup defined", "Missing signup routes");

  const loginPage = fileText("src/app/login/page.tsx");
  check(
    loginPage.includes("routes.auth.signupWithNext") || loginPage.includes("Create account"),
    "Login links to sign-up",
    "Login page missing sign-up link"
  );

  const signInForm = fileText("src/components/portal/auth/sign-in-form.tsx");
  check(signInForm.includes("signupWithNext"), "Sign-in form links to sign-up", "SignInForm missing sign-up link");

  const signupPage = fileText("src/app/signup/page.tsx");
  check(signupPage.includes("SignUpForm"), "Sign-up page renders SignUpForm", "Missing SignUpForm");
  check(
    signupPage.includes("sanitizeAuthNextPathWithDefault"),
    "Sign-up page sanitizes ?next=",
    "Sign-up page must use sanitizeAuthNextPathWithDefault"
  );

  const authActions = fileText("src/lib/actions/auth.ts");
  check(authActions.includes("export async function signUp"), "signUp server action exists", "Missing signUp");
  check(
    authActions.includes("sanitizeAuthNextPathOptional") &&
      authActions.includes("sanitizeAuthNextPathWithDefault"),
    "Auth actions sanitize next redirects",
    "auth.ts must sanitize next paths"
  );
  check(
    authActions.includes("assignDefaultClientRoleOnSignUp"),
    "signUp assigns default client role",
    "signUp must call assignDefaultClientRoleOnSignUp"
  );

  const linkService = fileText("src/lib/services/client-request-link.service.ts");
  check(
    linkService.includes("assignDefaultClientRoleOnSignUp"),
    "assignDefaultClientRoleOnSignUp exported",
    "Missing assignDefaultClientRoleOnSignUp"
  );
  check(
    linkService.includes("PUBLIC_SIGNUP_ALLOWED_ROLE"),
    "Public signup uses PUBLIC_SIGNUP_ALLOWED_ROLE constant",
    "Use PUBLIC_SIGNUP_ALLOWED_ROLE in link service"
  );
  check(
    !/crow_role:\s*["']platform_admin["']/.test(linkService),
    "Link service never sets platform_admin on signup paths",
    "platform_admin must not appear as assigned role in link service"
  );
  check(
    linkService.includes("I9 hardening") || linkService.includes("review-only"),
    "Email-only request linking documented as review-only in non-mock",
    "Document I9 email-link hardening in link service"
  );

  const callback = fileText("src/app/auth/callback/route.ts");
  check(
    callback.includes("assignDefaultClientRoleOnSignUp") && callback.includes("!role"),
    "OAuth callback assigns client only when no role",
    "Callback must gate assignDefaultClientRoleOnSignUp on missing role"
  );

  const routeProtection = fileText("src/lib/auth/route-protection.ts");
  const publicPrefixes = routeProtection.match(/PUBLIC_PREFIXES = \[([\s\S]*?)\] as const/)?.[1] ?? "";
  check(!publicPrefixes.includes('"/request"'), "/request not public", "/request must stay auth-gated");
  check(publicPrefixes.includes('"/signup"'), "/signup is public", "Add /signup to PUBLIC_PREFIXES");

  const requestPage = fileText("src/app/(public)/request/page.tsx");
  check(
    requestPage.includes("loginWithNext") || requestPage.includes("redirect"),
    "/request page auth-gates unauthenticated users",
    "/request must redirect when unauthenticated"
  );

  const apiRoute = fileText("src/app/api/implementation-requests/route.ts");
  check(
    apiRoute.includes("Sign in required") && apiRoute.includes("401"),
    "Anonymous ERP POST blocked with 401",
    "implementation-requests POST must require auth"
  );

  const approvalService = fileText("src/lib/services/client-approval.service.ts");
  check(
    approvalService.includes("canApproveScope"),
    "Approval gated on canApproveScope",
    "client-approval.service must use canApproveScope"
  );
  check(
    approvalService.includes("getClientOrganizationAccessDecisionForRequest"),
    "Approval uses organization access decision",
    "Missing getClientOrganizationAccessDecisionForRequest in approval"
  );

  const sanitize = fileText("src/lib/auth/sanitize-auth-next.ts");
  check(
    sanitize.includes("isSafeAuthNextPath") && sanitize.includes("PUBLIC_SIGNUP_ALLOWED_ROLE"),
    "sanitize-auth-next hardening module",
    "Missing sanitize-auth-next helpers"
  );

  for (const { label, paths, pattern } of DANGEROUS_PATTERNS) {
    for (const rel of paths) {
      if (!existsSync(join(ROOT, rel))) continue;
      check(!pattern.test(fileText(rel)), label, `${label} — ${rel}`);
    }
  }

  for (const rel of ["src/app/signup/page.tsx", "src/components/portal/auth/sign-up-form.tsx"]) {
    const hit = scanForbidden(rel);
    check(!hit, `No forbidden claim in ${rel}`, `Forbidden "${hit}" in ${rel}`);
  }

  console.log(passed ? "\nclient-signup:verify PASSED\n" : "\nclient-signup:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
