import assert from "node:assert/strict";
import {
  assessGoogleProviderLinkage,
  type ProviderLinkageRow,
} from "../../../scripts/lib/c3-proof-requester-provider-linkage";

const accountId = "acct-1";
const email = "requester@example.com";

function googleRow(
  overrides: Partial<ProviderLinkageRow> = {}
): ProviderLinkageRow {
  return {
    platformAccountId: accountId,
    provider: "google",
    providerUserId: "google-subject-1",
    emailNormalized: email,
    ...overrides,
  };
}

{
  const result = assessGoogleProviderLinkage({
    accountId,
    emailNormalized: email,
    ownedProviderRows: [googleRow()],
    foreignGoogleRowForEmail: false,
    foreignGoogleRowsForOwnedProviderUserIds: [],
    authIdentities: [{ provider: "google", id: "google-subject-1" }],
    ownedGoogleProviderUserIds: ["google-subject-1"],
  });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.googleLinked, true);
}

{
  const result = assessGoogleProviderLinkage({
    accountId,
    emailNormalized: email,
    ownedProviderRows: [googleRow()],
    foreignGoogleRowForEmail: true,
    foreignGoogleRowsForOwnedProviderUserIds: [],
    authIdentities: [{ provider: "google", id: "google-subject-1" }],
    ownedGoogleProviderUserIds: ["google-subject-1"],
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.reason, "foreign_google_email_collision");
  }
}

{
  const result = assessGoogleProviderLinkage({
    accountId,
    emailNormalized: email,
    ownedProviderRows: [googleRow(), googleRow({ providerUserId: "google-subject-2" })],
    foreignGoogleRowForEmail: false,
    foreignGoogleRowsForOwnedProviderUserIds: [],
    authIdentities: [{ provider: "google", id: "google-subject-1" }],
    ownedGoogleProviderUserIds: ["google-subject-1", "google-subject-2"],
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.reason, "multiple_google_rows_on_account");
  }
}

{
  const result = assessGoogleProviderLinkage({
    accountId,
    emailNormalized: email,
    ownedProviderRows: [googleRow({ emailNormalized: "other@example.com" })],
    foreignGoogleRowForEmail: false,
    foreignGoogleRowsForOwnedProviderUserIds: [],
    authIdentities: [{ provider: "google", id: "google-subject-1" }],
    ownedGoogleProviderUserIds: ["google-subject-1"],
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.reason, "provider_email_mismatch");
  }
}

{
  const result = assessGoogleProviderLinkage({
    accountId,
    emailNormalized: email,
    ownedProviderRows: [googleRow()],
    foreignGoogleRowForEmail: false,
    foreignGoogleRowsForOwnedProviderUserIds: [
      googleRow({ platformAccountId: "acct-2" }),
    ],
    authIdentities: [{ provider: "google", id: "google-subject-1" }],
    ownedGoogleProviderUserIds: ["google-subject-1"],
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.reason, "foreign_google_provider_user_collision");
  }
}

{
  const result = assessGoogleProviderLinkage({
    accountId,
    emailNormalized: email,
    ownedProviderRows: [],
    foreignGoogleRowForEmail: false,
    foreignGoogleRowsForOwnedProviderUserIds: [],
    authIdentities: [],
    ownedGoogleProviderUserIds: [],
  });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.googleLinked, false);
}

console.log(
  "PASS — PRESERVED GOOGLE REQUESTER PROVIDER LINKAGE IS AUTHORITATIVE AND NON-COLLIDING\n"
);
