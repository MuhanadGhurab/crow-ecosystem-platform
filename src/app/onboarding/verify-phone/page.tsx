import Link from "next/link";
import { redirect } from "next/navigation";

import { VerifyPhoneForm } from "@/components/account/verify-phone-form";
import { CrowMark } from "@/components/public/brand/crow-mark";
import { gateAuthSessionForC3 } from "@/lib/account/c3-auth-orchestration";
import { isAccountRegistrationEnabled } from "@/lib/account/feature-flags";
import {
  findPlatformAccountBySupabaseUserId,
  isPlatformAccountActive,
} from "@/lib/account/platform-account.service";
import { resolveC3PostAuthLanding } from "@/lib/auth/c3-post-auth-landing";
import { getSessionUser } from "@/lib/auth/session";
import { sanitizeAuthNextPathOptional } from "@/lib/auth/sanitize-auth-next";
import { routes } from "@/lib/routes";

export default async function OnboardingVerifyPhonePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; message?: string }>;
}) {
  if (!isAccountRegistrationEnabled()) {
    redirect("/login?error=config");
  }

  const { next, error: errorParam, message: messageParam } = await searchParams;
  const nextPath = sanitizeAuthNextPathOptional(next);

  const user = await getSessionUser();
  if (!user) {
    redirect(routes.auth.loginWithNext(routes.onboarding.verifyPhone));
  }

  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account) {
    redirect(routes.onboarding.legal);
  }

  if (isPlatformAccountActive(account)) {
    redirect(await resolveC3PostAuthLanding(user, nextPath));
  }

  const gate = await gateAuthSessionForC3(user, nextPath);
  if (gate.action === "redirect" && gate.path !== routes.onboarding.verifyPhone) {
    redirect(gate.path);
  }

  return (
    <div className="cc-starfield cc-noise flex min-h-[100dvh] items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="cc-glass-card relative z-10 w-full max-w-md !p-6 sm:!p-8">
        <CrowMark href="/" size="sm" showTagline={false} />
        <h1 className="cc-page-title mt-6">Verify your phone</h1>
        <p className="mt-2 text-xs text-slate-600">
          Phone verification is required before your platform account becomes active.
        </p>

        <div className="mt-6">
          <VerifyPhoneForm
            maskedPhone={account.phoneMasked}
            nextPath={nextPath}
            initialError={typeof errorParam === "string" ? errorParam : undefined}
            initialMessage={typeof messageParam === "string" ? messageParam : undefined}
          />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href={routes.auth.signOut} className="text-cyan-400 hover:text-cyan-300">
            Sign out
          </Link>
        </p>
      </div>
    </div>
  );
}
