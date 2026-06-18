import Link from "next/link";
import { redirect } from "next/navigation";
import { VerifyEmailForm } from "@/components/account/verify-email-form";
import { CrowMark } from "@/components/public/brand/crow-mark";
import {
  findPlatformAccountBySupabaseUserId,
  isPlatformAccountActive,
} from "@/lib/account/platform-account.service";
import { isAccountRegistrationEnabled } from "@/lib/account/feature-flags";
import { resolveC3PostAuthLanding } from "@/lib/auth/c3-post-auth-landing";
import { getSessionUser } from "@/lib/auth/session";
import { sanitizeAuthNextPathOptional } from "@/lib/auth/sanitize-auth-next";
import { routes } from "@/lib/routes";

export default async function VerifyEmailPage({
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
    redirect(routes.auth.loginWithNext(routes.account.verifyEmail));
  }

  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account) {
    redirect(routes.account.registerLegal);
  }

  if (isPlatformAccountActive(account)) {
    redirect(await resolveC3PostAuthLanding(user, nextPath));
  }

  return (
    <div className="cc-starfield cc-noise flex min-h-[100dvh] items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="cc-glass-card relative z-10 w-full max-w-md !p-6 sm:!p-8">
        <CrowMark href="/" size="sm" showTagline={false} />
        <h1 className="cc-page-title mt-6">Verify your email</h1>
        <p className="mt-2 text-xs text-slate-600">
          One platform account per person. Email verification is required before Crow
          access is granted.
        </p>

        <div className="mt-6">
          <VerifyEmailForm email={account.email} nextPath={nextPath} />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Wrong account?{" "}
          <Link href={routes.auth.signOut} className="text-cyan-400 hover:text-cyan-300">
            Sign out
          </Link>
        </p>
      </div>
    </div>
  );
}
