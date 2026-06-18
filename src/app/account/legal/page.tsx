import { AccountLegalPanel } from "@/components/account/account-legal-panel";
import { requireActivePlatformAccount } from "@/lib/auth/session";
import { findPlatformAccountBySupabaseUserId } from "@/lib/account/platform-account.service";
import { getMarketingEmailConsent } from "@/lib/legal/account-consent.service";
import {
  getAcceptanceHistory,
  getPendingReacceptanceForAccount,
} from "@/lib/legal/legal-acceptance.service";
import { resolveRegistrationLocale } from "@/lib/legal/registration-locale";
import { isAccountRegistrationEnabled } from "@/lib/account/feature-flags";

type PageProps = {
  searchParams: Promise<{ reaccept?: string }>;
};

export default async function AccountLegalPage({ searchParams }: PageProps) {
  if (!isAccountRegistrationEnabled()) {
    return (
      <div className="cc-glass-card rounded-xl border border-white/10 p-6">
        <p className="text-white/70">Account legal management is not enabled.</p>
      </div>
    );
  }

  const user = await requireActivePlatformAccount();
  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account) {
    return (
      <div className="cc-glass-card rounded-xl border border-white/10 p-6">
        <p className="text-white/70">No platform account found.</p>
      </div>
    );
  }

  const locale = await resolveRegistrationLocale();
  const params = await searchParams;
  const showReacceptBanner = params.reaccept === "1";

  const [acceptances, pendingReacceptance, marketingGranted] = await Promise.all([
    getAcceptanceHistory(account.id),
    getPendingReacceptanceForAccount(account.id, locale),
    getMarketingEmailConsent(account.id),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Legal &amp; consent</h1>
      <p className="mt-2 text-sm text-white/60">
        Your recorded acceptances, pending document updates, and optional marketing preferences.
      </p>
      <div className="mt-8">
        <AccountLegalPanel
          acceptances={acceptances}
          pendingReacceptance={pendingReacceptance}
          marketingGranted={marketingGranted}
          showReacceptBanner={showReacceptBanner}
        />
      </div>
    </div>
  );
}
