import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

function readSrc(rel: string): string {
  return readFileSync(resolve(root, rel), "utf8");
}

// §1 — real login uses HTTP POST /login/submit (303 + Set-Cookie); setSession materializes cookies
{
  const auth = readSrc("src/lib/actions/auth.ts");
  assert(auth.includes("signInWithPassword"), "signIn must use signInWithPassword");
  assert(auth.includes("setSession"), "sign-in must materialize session cookies after password auth");
  assert(auth.includes("resolveSignInSubmissionUrl"), "resolveSignInSubmissionUrl must exist");
  const loginSubmit = readSrc("src/app/login/submit/route.ts");
  assert(loginSubmit.includes("resolveSignInSubmissionUrl"), "login submit route must resolve sign-in");
}

{
  const form = readSrc("src/components/portal/auth/sign-in-form.tsx");
  assert(form.includes('action="/login/submit"'), "sign-in form must POST /login/submit for durable cookies");
  assert(form.includes('method="post"'), "sign-in form must use POST");
}

// §8 — OAuth cannot bypass phone; email OTP cannot mark phone
{
  const emailSvc = readSrc("src/lib/account/email-verification.service.ts");
  assert(!emailSvc.includes("phoneVerifiedAt"), "email verify must not set phoneVerifiedAt");
  const phoneSvc = readSrc("src/lib/account/phone-verification.service.ts");
  assert(!phoneSvc.includes("emailVerifiedAt:"), "phone verify must not set emailVerifiedAt");
  assert(phoneSvc.includes("email_unverified"), "phone verify requires email first");
}

// §13 — generation gate
{
  const platform = readSrc("src/lib/account/platform-account.service.ts");
  assert(platform.includes("isOnboardingGenerationCurrent"), "ACTIVE gate includes generation");
}

// §10 — onboarding routes
{
  const orch = readSrc("src/lib/account/c3-auth-orchestration.ts");
  assert(orch.includes("routes.onboarding.legal"), "legal onboarding path");
  assert(orch.includes("isPhoneVerificationRequiredForAccount"), "phone path gated by policy");
  assert(orch.includes("routes.onboarding.verifyPhone"), "phone route retained for future");
}

// identity reset defaults dry-run
{
  const plan = readSrc("scripts/identity-reset-plan.ts");
  assert(plan.includes('mode: "dry-run"'), "reset plan defaults to dry-run");
  assert(plan.includes("execute is not authorized"), "execute blocked in C3.10A");
}

console.log("c3-dual-channel-onboarding: all static checks passed");
