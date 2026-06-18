# C3 — Legal Agreement and Consent Evidence Engine

## Purpose

Canonical legal-document versioning, append-only acceptance evidence, and a **Legal Review Gate** in C3 registration. Platform accounts are not created until mandatory acceptances are recorded; activation requires **both** legal evidence and email verification.

## Document taxonomy

| `LegalDocumentType` | Classification | Role |
|---------------------|----------------|------|
| `TERMS_OF_SERVICE` | `mandatory_contractual` | Contractual terms; required checkbox at registration |
| `PRIVACY_NOTICE` | `mandatory_notice` | Privacy notice acknowledgment; required checkbox |
| `ACCEPTABLE_USE_POLICY` | `mandatory_contractual` | Acceptable use; required checkbox |

Optional purpose-based consent (e.g. `marketing_email`) is stored separately in `AccountConsentPreference` and does **not** gate activation.

## Versioning model

- **`LegalDocument`** — stable identity per document type.
- **`LegalDocumentVersion`** — immutable published snapshot per locale and audience (`platform_requester`).
  - Fields: `versionNumber`, `locale`, `title`, `contentFormat` (`markdown`), `contentBody`, `contentSha256`, `effectiveAt`, `publishedAt`, `mandatoryClassification`, `reacceptancePolicy`, `supersedesVersionId`.
  - Status: `draft` → `published` → `superseded`.
  - **Immutability:** once `published`, `contentBody` and `contentSha256` must not change; material changes require a new version.

## Evidence model (`AccountLegalAcceptance`)

Append-only rows per `platformAccountId` + `legalDocumentVersionId` (unique constraint for idempotency).

| Field | Purpose |
|-------|---------|
| `documentHashAtAcceptance` | SHA-256 of `contentBody` at accept time |
| `acceptedLocale` | Locale under which acceptance occurred |
| `acceptedAt` | Server timestamp |
| `acceptanceMethod` | e.g. `registration_web` |
| `affirmativeActionType` | e.g. `checkbox_submit` |
| `registrationCorrelationId` | UUID linking acceptances in one registration submission |
| `userAgentSummary` | Truncated/sanitized UA from request headers |
| `networkEvidence` | Optional policy-approved JSON |
| `supersedesAcceptanceId` | Chain for reacceptance |

No update or delete APIs for acceptance rows.

## Consent preferences (`AccountConsentPreference`)

Purpose-based optional consent (currently `marketing_email`):

- Default **false** at registration unless explicit opt-in checkbox.
- Withdrawal updates `withdrawnAt` without deactivating the account.
- Audit event: `consent_preference_updated`.

## Registration sequence

```
signUp (credentials/OAuth session only)
  → /register/legal (Legal Review Gate)
  → completeRegistrationWithLegalAcceptance (transaction)
       → PlatformAccount PENDING_EMAIL_VERIFICATION
       → AccountLegalAcceptance rows
       → AccountConsentPreference
       → issueEmailVerificationCode
  → /verify-email
  → verifyEmailCode
       → activate only if hasMandatoryLegalAcceptanceComplete
  → ACTIVE + deferred onboarding
```

**Constitutional rules (server-enforced):**

1. Legal acceptance alone does **not** activate the account.
2. Email verification alone does **not** activate if mandatory acceptances are missing.
3. Client scroll/review UI state (`scrolledToBottom`) is **never** trusted or stored.

## Server validation (`completeRegistrationWithLegalAcceptance`)

- Reject if no published mandatory versions exist for locale.
- Reject if submitted `versionId` ≠ current published id for that document type.
- Reject if client hash ≠ server-computed `contentSha256`.
- Reject if required contractual/notice checkboxes are false.
- Transaction: create/ensure account + profile stub + acceptances + consent + audit + OTP issue.

## Activation gates

- `email-verification.service.ts` — returns `legal_incomplete` before `activatePlatformAccount` when acceptances missing.
- `platform-account.service.ts` — defense-in-depth check in `activatePlatformAccount`.

## Reacceptance (foundation)

`ReacceptancePolicy` on versions:

| Policy | Behavior |
|--------|----------|
| `none` | No follow-up required |
| `notice_only` | Banner on `/account/legal`; no block |
| `required_before_protected_activity` | `gateAuthSessionForC3` redirects to `/account/legal?reaccept=1` |

Reacceptance does **not** remove memberships or suspend the account.

## Saudi / ERP boundary

- **Account registration** covers **platform** terms (ToS, Privacy, AUP) for individual requesters.
- **ERP / tenant org-authority** attestation is **out of scope** for account registration.
- Future ERP declaration copy is stubbed in `src/lib/legal/erp-attestation.ts` for request flows.
- Platform terms ≠ tenant/enterprise agreements; enterprise legal review remains a separate workflow.

See also: `C3_EXISTING_ACCOUNT_AUTH_REQUEST_INVITE_MAPPING.md`.

## Self-service (`/account/legal`)

Active accounts only (`requireActivePlatformAccount`):

- Accepted version history and dates.
- Current published documents.
- Pending reacceptance banners.
- Marketing consent toggle (`account.consent.update.self`).

Public read-only full-page views: `/legal/[slug]/[versionId]` (print/download).

## Threat model summary

| Threat | Mitigation |
|--------|------------|
| API bypass without checkboxes | Action rejects; activation gate |
| Stale version acceptance | Server compares to current published ids |
| Hash mismatch / tampering | Server recomputes SHA-256; hash stored at publish and accept |
| Wrong account binding | Session `supabaseUserId`; acceptances keyed in same transaction |
| Replay / duplicate submit | `@@unique([platformAccountId, legalDocumentVersionId])` |
| Concurrent registration | Transaction + unique email on `PlatformAccount` |
| Unsafe HTML in documents | Markdown + sanitize (`legal-content-sanitize.ts`) |
| False marketing consent | Default false; explicit opt-in required |
| Acceptance deletion | No delete API; append-only |
| Locale mismatch | Version locale validated at registration |
| Forced consent | Separate checkboxes; marketing unchecked by default |
| Activation without both gates | Unit + static verifier on verify/activate paths |
| Client scroll spoofing | `scrolledToBottom` explicitly ignored server-side |

## Local development

| Step | Command |
|------|---------|
| Apply migration (local DB only) | `npx prisma migrate dev` — includes `20260614150000_c3_legal_agreement` |
| Seed v1 documents | `SEED_LEGAL_DOCUMENTS=true npx prisma db seed` |
| Verify wiring | `npm run c3-account:verify` |

**Out of scope on this branch:** hosted Preview/Production migrations, git commit/push.

## Code map

| Area | Path |
|------|------|
| Schema | `prisma/schema.prisma` |
| Migration | `prisma/migrations/20260614150000_c3_legal_agreement/` |
| Legal services | `src/lib/legal/*` |
| Registration action | `src/lib/actions/account-legal.ts` |
| Auth orchestration | `src/lib/account/c3-auth-orchestration.ts` |
| Legal Review Gate UI | `src/components/account/legal-review-gate.tsx` |
| Account legal UI | `src/components/account/account-legal-panel.tsx` |
| Seed | `prisma/seed-legal-documents.ts` |
