import { AccountProfileForm } from "@/components/account/account-profile-form";
import { getPlatformAccountProfile } from "@/lib/account/platform-account-profile.service";
import { findPlatformAccountBySupabaseUserId } from "@/lib/account/platform-account.service";
import { requireActivePlatformAccount } from "@/lib/auth/session";

export default async function AccountProfilePage() {
  const user = await requireActivePlatformAccount();
  const account = await findPlatformAccountBySupabaseUserId(user.id);
  const profile = account
    ? await getPlatformAccountProfile(account.id)
    : null;

  return (
    <div className="cc-glass-card !p-6 sm:!p-8">
      <h1 className="cc-page-title">Platform profile</h1>
      <p className="mt-2 text-sm text-slate-400">
        Your universal Crow identity. This is separate from tenant-specific client
        profiles.
      </p>
      {account && (
        <p className="mt-1 text-xs text-slate-600">
          Account ID: <span className="font-mono">{account.publicAccountId}</span>
        </p>
      )}
      <AccountProfileForm profile={profile} />
    </div>
  );
}
