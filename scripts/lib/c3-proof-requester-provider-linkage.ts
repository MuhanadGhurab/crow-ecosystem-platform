/**
 * C3.10AA — Authoritative Google provider linkage assessment for proof requesters.
 */
export type ProviderLinkageRow = {
  platformAccountId: string;
  provider: string;
  providerUserId: string;
  emailNormalized: string | null;
};

export type ProviderLinkageFailureReason =
  | "foreign_google_email_collision"
  | "foreign_google_provider_user_collision"
  | "multiple_google_rows_on_account"
  | "provider_email_mismatch"
  | "duplicate_auth_google_identities"
  | "auth_google_subject_mismatch";

export type ProviderLinkageAssessment =
  | { ok: true; googleLinked: boolean }
  | { ok: false; reason: ProviderLinkageFailureReason; detail: string };

function countGoogleIdentities(identities: { provider: string }[] | undefined): number {
  return identities?.filter((identity) => identity.provider === "google").length ?? 0;
}

export function assessGoogleProviderLinkage(input: {
  accountId: string;
  emailNormalized: string;
  ownedProviderRows: ProviderLinkageRow[];
  foreignGoogleRowForEmail: boolean;
  foreignGoogleRowsForOwnedProviderUserIds: ProviderLinkageRow[];
  authIdentities: { provider: string; id?: string }[] | undefined;
  ownedGoogleProviderUserIds: string[];
}): ProviderLinkageAssessment {
  if (input.foreignGoogleRowForEmail) {
    return {
      ok: false,
      reason: "foreign_google_email_collision",
      detail: "Google provider row linked to a different PlatformAccount for the trusted email",
    };
  }

  for (const foreign of input.foreignGoogleRowsForOwnedProviderUserIds) {
    if (foreign.platformAccountId !== input.accountId) {
      return {
        ok: false,
        reason: "foreign_google_provider_user_collision",
        detail: "Google provider subject linked to a different PlatformAccount",
      };
    }
  }

  const ownedGoogleRows = input.ownedProviderRows.filter((row) => row.provider === "google");
  if (ownedGoogleRows.length > 1) {
    return {
      ok: false,
      reason: "multiple_google_rows_on_account",
      detail: "Multiple Google provider rows on the same PlatformAccount",
    };
  }

  for (const row of ownedGoogleRows) {
    if (row.emailNormalized && row.emailNormalized !== input.emailNormalized) {
      return {
        ok: false,
        reason: "provider_email_mismatch",
        detail: "Google provider email does not match authoritative PlatformAccount email",
      };
    }
  }

  const authGoogleCount = countGoogleIdentities(input.authIdentities);
  if (authGoogleCount > 1) {
    return {
      ok: false,
      reason: "duplicate_auth_google_identities",
      detail: "Multiple Google identities on the same Supabase Auth user",
    };
  }

  if (ownedGoogleRows.length === 1 && authGoogleCount === 1) {
    const authGoogleIds =
      input.authIdentities
        ?.filter((identity) => identity.provider === "google")
        .map((identity) => identity.id)
        .filter((id): id is string => Boolean(id)) ?? [];
    const ownedIds = ownedGoogleRows.map((row) => row.providerUserId);
    const linked =
      authGoogleIds.length === 0 ||
      ownedIds.some((providerUserId) => authGoogleIds.includes(providerUserId));
    if (!linked) {
      return {
        ok: false,
        reason: "auth_google_subject_mismatch",
        detail: "Supabase Google identity subject does not match PlatformProviderIdentity row",
      };
    }
  }

  return {
    ok: true,
    googleLinked: ownedGoogleRows.length === 1 || authGoogleCount === 1,
  };
}
