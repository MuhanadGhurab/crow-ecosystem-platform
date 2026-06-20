import Link from "next/link";
import { redirect } from "next/navigation";
import { LegalReviewGate } from "@/components/account/legal-review-gate";
import { OnboardingProgress } from "@/components/account/onboarding-progress";
import { CrowMark } from "@/components/public/brand/crow-mark";
import { isAccountRegistrationEnabled } from "@/lib/account/feature-flags";
import {
  findPlatformAccountBySupabaseUserId,
  isPlatformAccountActive,
} from "@/lib/account/platform-account.service";
import { loadMandatoryLegalDocumentsForRegistration } from "@/lib/actions/account-legal";
import { resolveC3PostAuthLanding } from "@/lib/auth/c3-post-auth-landing";
import { getSessionUser } from "@/lib/auth/session";
import { sanitizeAuthNextPathOptional } from "@/lib/auth/sanitize-auth-next";
import { hasMandatoryLegalAcceptanceComplete } from "@/lib/legal/legal-acceptance.service";
import { resolveRegistrationLocale } from "@/lib/legal/registration-locale";
import { resolveRegistrationErrorDisplay } from "@/lib/account/c3-registration-error-display";
import { routes } from "@/lib/routes";

export const maxDuration = 60;

export default async function RegisterLegalPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string;
    email?: string;
    error?: string;
    message?: string;
    ref?: string;
  }>;
}) {
  if (!isAccountRegistrationEnabled()) {
    redirect("/login?error=config");
  }

  const {
    next,
    email: emailParam,
    error: errorParam,
    message: messageParam,
    ref: refParam,
  } = await searchParams;
  const nextPath = sanitizeAuthNextPathOptional(next);
  const initialEmail = typeof emailParam === "string" ? emailParam.trim() : "";

  const user = await getSessionUser();
  if (!user && !initialEmail) {
    redirect(routes.auth.signupWithNext(routes.account.registerLegal));
  }

  const account = user ? await findPlatformAccountBySupabaseUserId(user.id) : null;
  if (user && account && isPlatformAccountActive(account)) {
    redirect(await resolveC3PostAuthLanding(user, nextPath));
  }

  const locale = await resolveRegistrationLocale();
  if (account && (await hasMandatoryLegalAcceptanceComplete(account.id, locale))) {
    const params = new URLSearchParams({ email: account.email });
    if (nextPath) params.set("next", nextPath);
    redirect(`${routes.onboarding.verifyEmail}?${params.toString()}`);
  }

  const documents = await loadMandatoryLegalDocumentsForRegistration(locale);
  const showAccountFields = !user;
  const email = user?.email ?? initialEmail;

  const errorDisplay = resolveRegistrationErrorDisplay({
    error: typeof errorParam === "string" ? errorParam : undefined,
    message: typeof messageParam === "string" ? messageParam : undefined,
    ref: typeof refParam === "string" ? refParam : undefined,
  });

  return (
    <div className="cc-starfield cc-noise flex min-h-[100dvh] items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="cc-glass-card relative z-10 w-full max-w-2xl !p-6 sm:!p-8">
        <CrowMark href="/" size="sm" showTagline={false} />
        <OnboardingProgress current="legal" />
        <h1 className="cc-page-title mt-2">Review legal agreements</h1>
        <p className="mt-2 text-xs text-slate-600">
          Before your platform account is created, you must review and accept
          Crow&apos;s mandatory legal documents. Email verification comes next.
        </p>

        <LegalReviewGate
          documents={documents}
          locale={locale}
          nextPath={nextPath}
          showAccountFields={showAccountFields}
          initialEmail={email}
          initialErrorBody={
            errorDisplay?.isAlert ? errorDisplay.body : undefined
          }
          initialMessageBody={
            errorDisplay && !errorDisplay.isAlert ? errorDisplay.body : undefined
          }
        />
      </div>
    </div>
  );
}
