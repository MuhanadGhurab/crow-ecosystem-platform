import { redirect } from "next/navigation";
import { LegalReviewGate } from "@/components/account/legal-review-gate";
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
import { routes } from "@/lib/routes";

export default async function RegisterLegalPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (!isAccountRegistrationEnabled()) {
    redirect("/login?error=config");
  }

  const { next } = await searchParams;
  const nextPath = sanitizeAuthNextPathOptional(next);

  const user = await getSessionUser();
  if (!user) {
    redirect(routes.auth.loginWithNext(routes.account.registerLegal));
  }

  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (account && isPlatformAccountActive(account)) {
    redirect(await resolveC3PostAuthLanding(user, nextPath));
  }

  const locale = await resolveRegistrationLocale();
  if (account && (await hasMandatoryLegalAcceptanceComplete(account.id, locale))) {
    const verifyPath = nextPath
      ? `${routes.account.verifyEmail}?next=${encodeURIComponent(nextPath)}`
      : routes.account.verifyEmail;
    redirect(verifyPath);
  }

  const documents = await loadMandatoryLegalDocumentsForRegistration(locale);

  return (
    <div className="cc-starfield cc-noise flex min-h-[100dvh] items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="cc-glass-card relative z-10 w-full max-w-2xl !p-6 sm:!p-8">
        <CrowMark href="/" size="sm" showTagline={false} />
        <h1 className="cc-page-title mt-6">Review legal agreements</h1>
        <p className="mt-2 text-xs text-slate-600">
          Before your platform account is created, you must review and accept
          Crow&apos;s mandatory legal documents. Email verification comes next.
        </p>

        <LegalReviewGate documents={documents} locale={locale} nextPath={nextPath} />
      </div>
    </div>
  );
}
