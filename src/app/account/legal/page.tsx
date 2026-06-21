import { AccountLegalPanel } from "@/components/account/account-legal-panel";
import { requireActivePlatformAccount } from "@/lib/auth/session";
import { findPlatformAccountBySupabaseUserId } from "@/lib/account/platform-account.service";
import { getMarketingEmailConsent } from "@/lib/legal/account-consent.service";
import {
  getAcceptanceHistory,
  getPendingReacceptanceForAccount,
} from "@/lib/legal/legal-acceptance.service";
import { getCurrentPublishedMandatoryVersions } from "@/lib/legal/legal-document.service";
import { verifyVersionContentHash } from "@/lib/legal/legal-document-validation";
import { legalContactConfigurationStatus } from "@/lib/legal/legal-contact-config";
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

  const [acceptances, pendingReacceptance, marketingGranted, currentVersions] =
    await Promise.all([
      getAcceptanceHistory(account.id),
      getPendingReacceptanceForAccount(account.id, locale),
      getMarketingEmailConsent(account.id),
      getCurrentPublishedMandatoryVersions({ locale }),
    ]);

  const latestAcceptedByType = new Map<string, (typeof acceptances)[0]>();
  for (const row of acceptances) {
    const type = row.legalDocumentVersion.legalDocument.documentType;
    const existing = latestAcceptedByType.get(type);
    if (
      !existing ||
      row.legalDocumentVersion.versionNumber >
        existing.legalDocumentVersion.versionNumber
    ) {
      latestAcceptedByType.set(type, row);
    }
  }

  const pendingTypes = new Set(
    pendingReacceptance
      .filter((p) => p.currentVersionId !== p.acceptedVersionId)
      .map((p) => p.documentType)
  );

  const currentDocuments = currentVersions.map((v) => {
    const accepted = latestAcceptedByType.get(v.legalDocument.documentType);
    return {
      documentType: v.legalDocument.documentType,
      title: v.title,
      versionNumber: v.versionNumber,
      versionId: v.id,
      contentSha256: v.contentSha256,
      hashValid: verifyVersionContentHash(v),
      effectiveAt: v.effectiveAt.toISOString(),
      acceptedVersionNumber: accepted?.legalDocumentVersion.versionNumber ?? null,
      acceptedAt: accepted?.acceptedAt.toISOString() ?? null,
      reacceptanceRequired: pendingTypes.has(v.legalDocument.documentType),
    };
  });

  const contactStatus = legalContactConfigurationStatus();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Legal &amp; consent</h1>
      <p className="mt-2 text-sm text-white/60">
        Current mandatory documents, acceptance evidence, optional marketing preferences, and
        security trust positioning.
      </p>
      <div className="mt-8">
        <AccountLegalPanel
          acceptances={acceptances}
          pendingReacceptance={pendingReacceptance}
          marketingGranted={marketingGranted}
          showReacceptBanner={showReacceptBanner}
          currentDocuments={currentDocuments}
          contactConfigurationStatus={contactStatus}
        />
      </div>
    </div>
  );
}
