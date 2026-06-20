# C3.9A — Hosted SMS & Dual-Channel Migration Security Preflight

**Branch:** `feat/c3-account-registration-email-verification`  
**PR:** #9  
**Date:** 2026-06-18  
**Status:** Preflight only — migration not applied, registration disabled, no live SMS.

---

## 1. Workspace secret / ignore audit

### Requirements met

| Requirement | Status |
|-------------|--------|
| `.env.preview.*` not tracked | ✓ (gitignored; not in index) |
| Credentials not in Git history | ✓ (no `.env.preview.*` in `git ls-files`) |
| Temp evidence excluded | ✓ (`tmp-legal.html`, internal E2E screenshots/reports) |
| Ad-hoc debug scripts excluded | ✓ (`scripts/check-c3-*.ts`, smoke scripts) |

### Categorized inventory (local operator)

**KEEP_LOCAL_IGNORED**

- `.env.preview.*`, `.env.preview.e2e`
- `.backups/`
- `tmp-legal.html`, `-X`
- `docs/internal/screenshots/c3-preview-e2e/`
- `docs/internal/C3.*-PREVIEW-E2E-REPORT.md`
- Ad-hoc scripts: `scripts/check-c3-*.ts`, `scripts/smoke-c3-provision-hosted.ts`, etc.

**SAFE_TO_ARCHIVE_INTERNAL**

- Masked preview audit JSON under `docs/architecture/crow-core/c2/.c21-*` (already gitignored)
- C3 brand screenshots under `docs/internal/screenshots/c3-crow-brand/` (product evidence; not secrets)

**SAFE_TO_DELETE_TEMPORARY**

- `tmp-legal.html` after debugging
- Stale `-X` scratch files
- Local Mailpit captures if any

**REQUIRES_MANUAL_REVIEW**

- Any `.env.preview.*` before sharing machine backups
- HAR files or browser captures from Preview (may contain session cookies)
- Operator notes containing phone numbers or OTPs

### Modified debug scripts decision

| Script | Decision |
|--------|----------|
| `scripts/debug-c3-preview-legal-submit.ts` | **Restored** to HEAD — ad-hoc; not part of C3.9 |
| `scripts/verify-c3-hosted-smoke.ts` | **Restored** to HEAD — superseded by controlled verify suite |

---

## 2. Migration object inventory (`20260618140000_c3_dual_channel_onboarding`)

### New tables

| Table | Purpose |
|-------|---------|
| `phone_verification_challenges` | OTP hash, attempts, expiry, delivery metadata |
| `platform_provider_identities` | OAuth provider linkage (Google, etc.) |

### Altered tables

| Table | Changes |
|-------|---------|
| `platform_accounts` | +7 columns (generation, email/phone verification evidence) |

### New columns (`platform_accounts`)

- `onboardingGeneration` INTEGER NOT NULL DEFAULT **2**
- `emailVerifiedAt`, `emailVerificationSource`
- `phoneNormalized`, `phoneMasked`, `phoneVerifiedAt`, `phoneVerificationSource`

### Indexes

- UNIQUE `platform_accounts_phoneNormalized_key`
- `phone_verification_challenges_(platformAccountId, status)`
- `phone_verification_challenges_(phoneNormalized, purpose, status)`
- `phone_verification_challenges_expiresAt`
- `platform_provider_identities_platformAccountId`
- `platform_provider_identities_emailNormalized`
- UNIQUE `platform_provider_identities_(provider, providerUserId)`

### Foreign keys

- `phone_verification_challenges.platformAccountId` → `platform_accounts.id` ON DELETE CASCADE
- `platform_provider_identities.platformAccountId` → `platform_accounts.id` ON DELETE CASCADE

### Enum changes

- `PlatformAccountStatus`: +`PENDING_LEGAL_ACCEPTANCE`, +`PENDING_PHONE_VERIFICATION`
- New: `PhoneVerificationChallengeStatus`, `PhoneVerificationPurpose`, `PlatformAuthProvider`
- `PlatformAccountAuditEventType`: +phone/email/provider audit events

### Backfills

```sql
UPDATE platform_accounts SET onboardingGeneration = 1
WHERE onboardingGeneration = 2 AND status = 'ACTIVE';
```

Legacy ACTIVE → generation **1**. New rows default generation **2**.

### Destructive-change review

| Check | Result |
|-------|--------|
| DROP TABLE / COLUMN | **None** |
| RENAME | **None** |
| Uncontrolled DELETE | **None** |
| Table rewrite | **None** |
| Nullability regression on existing cols | **None** |
| Automatic legacy activation | **None** |

---

## 3. RLS and grants (new tables)

| Table | RLS | anon grants | authenticated grants | Policies |
|-------|-----|-------------|----------------------|----------|
| `phone_verification_challenges` | ENABLED | REVOKED | REVOKED | None (server-side only) |
| `platform_provider_identities` | ENABLED | REVOKED | REVOKED | None (server-side only) |

**Server-side access:** Prisma uses service role / direct Postgres — unaffected by PostgREST revokes.

**Why browser-direct access is unnecessary:** Phone challenges and provider identities are activation evidence; all reads/writes go through Server Actions and services.

**Verification:** `npm run c3-dual-channel:hosted-schema-verify` (static audit; optional `--live-disposable` on port 5433 only).

---

## 4. Dual-channel data separation

| Evidence type | Storage | Must not |
|---------------|---------|----------|
| Email verification | `emailVerifiedAt`, email OTP service | Confirm phone |
| Phone verification | `phone_verification_challenges`, `phoneVerifiedAt` | Confirm email, grant roles |
| Legal acceptance | legal consent tables / services | Bypassed by phone |
| Activation | `status=ACTIVE` + generation gate | Set by Supabase session alone |
| Auth session | Supabase | Activate PlatformAccount |
| Authorization | memberships / roles | Granted at registration |

Phone OTP success does **not** create tenant slug, client role, or admin access. OAuth verified email does **not** set `phoneVerifiedAt`.

---

## 5. Phone-data privacy

| Field | Handling |
|-------|----------|
| `phoneNormalized` (E.164) | DB only; duplicate check uses normalized value; generic error on conflict |
| `phoneMasked` | UI display |
| Challenge destination | Stored normalized on challenge row |
| OTP / `codeHash` | HMAC/hash only; not logged |
| Provider refs | `providerMessageId` operational metadata |

**Gaps before Production:** Application-level encryption or Supabase Vault for `phoneNormalized` not implemented — **document as Production blocker** if regulatory review requires at-rest encryption beyond Postgres ACL + RLS. Do not invent crypto without key-management ops.

**Confirmed:** No raw phone in URLs, generic user errors, local-dev logs masked destination only.

---

## 6. SMS provider matrix (Saudi + international)

Facts marked ✓ are from vendor documentation or CST/Taqnyat public guidance; assumptions marked ~.

| Criterion | Twilio | Unifonic / Taqnyat (regional) | Infobip (enterprise MENA) |
|-----------|--------|-------------------------------|---------------------------|
| Saudi delivery | ✓ via registered sender | ✓ primary market | ✓ MENA focus |
| Sender ID registration | ✓ ~2 weeks CST | ✓ local compliance | ✓ enterprise onboarding |
| OTP / transactional | ✓ Verify API ~ | ✓ OTP templates (purpose text required) | ✓ 2FA APIs |
| Arabic + English | ✓ | ✓ | ✓ |
| Webhooks / DLR | ✓ | ✓ | ✓ |
| Sandbox / test | ✓ magic numbers | ~ limited test numbers | ~ trial accounts |
| Custom OTP engine (transport only) | ✓ REST SMS body | ✓ REST | ✓ REST |
| WhatsApp fallback path | ✓ same vendor | ~ Unifonic WA | ✓ Infobip WA |
| Min spend / verification | ~ pay-as-you-go | ~ business verification | ~ enterprise contract |
| Lock-in | Medium | Medium (regional) | Higher (enterprise) |

### Recommendations

1. **PRIMARY:** **Unifonic or Taqnyat** — Saudi sender-ID compliance, Arabic templates, regional support.
2. **SECONDARY:** **Twilio** — mature API, sandbox, global fallback if regional primary degrades.
3. **ENTERPRISE / REGIONAL:** **Infobip** — multi-channel (SMS + WhatsApp), MENA enterprise SLAs.

**Configuration blockers:** CST-approved alphanumeric sender ID (~2 weeks), business verification, Preview spend caps, webhook endpoint on protected Preview.

---

## 7. Hosted adapter contract

```ts
sendVerificationCode({
  destinationE164,
  code,
  locale,
  correlationId,
}): Promise<{
  accepted: boolean;
  providerMessageReference?: string;
  providerName: string;
  failureCategory?: PhoneDeliveryFailureCategory;
  retryable?: boolean;
}>
```

**Fail closed:** `C3_PHONE_DELIVERY_MODE=hosted-sms` on Vercel requires `C3_SMS_PROVIDER_API_KEY`, `C3_SMS_SENDER_ID`, `C3_SMS_PROVIDER_NAME`. No fallback to console/in-memory on Preview/Production.

**Env vars (Preview apply later):**

- `C3_PHONE_DELIVERY_MODE=hosted-sms`
- `C3_SMS_PROVIDER_NAME`
- `C3_SMS_PROVIDER_API_KEY`
- `C3_SMS_SENDER_ID`

---

## 8. Failure taxonomy

See `src/lib/phone/phone-delivery-failure.ts`. Provider failure leaves phone unverified, account inactive, no authz changes.

---

## 9. Preview SMS test strategy

1. Provider sandbox / test recipient (Twilio magic numbers or vendor test MSISDN).
2. Explicit allowlist env `C3_PHONE_SMS_TEST_ALLOWLIST` (product-owner numbers only) — **future; not a universal OTP backdoor**.
3. Message spend limits on provider account.
4. Protected Vercel Preview + registration enabled only during test window.
5. OTP never in HTML, API JSON, or client logs.

---

## 10. Controlled migration preflight

| Gate | Required |
|------|----------|
| `APP_ENVIRONMENT=preview` | ✓ |
| `DATABASE_ENVIRONMENT=production` (shared backend) | ✓ documented |
| `BACKEND_ISOLATION=shared` | ✓ |
| Direct `DIRECT_URL` | ✓ for fingerprint |
| Expected DB fingerprint | ✓ via existing assert |
| `ALLOW_DATABASE_MIGRATION=true` | Apply only |
| `--allow-shared-production-backend` | ✓ |
| `MIGRATION_BACKUP_CHECKSUM` | Apply only (C3.9A) |
| `--check-only` before apply | ✓ |
| Pending stack | 4 C3 migrations including dual-channel |
| No failed migrations | ✓ checked |

**This phase:** check-only not run against hosted DB (operator runs when authorized).

**Result:** `READY — C3.8 MIGRATION REVIEWED; CONTROLLED APPLY AUTHORIZATION REQUIRED`

---

## 11. Legacy generation behavior & lockout risk

| Rule | Value |
|------|-------|
| Legacy ACTIVE after migration | `onboardingGeneration = 1` |
| New accounts | default **2** |
| Required generation (`CROW_ONBOARDING_GENERATION_REQUIRED`) | **2** (default) |

`isPlatformAccountActive()` requires `status === ACTIVE` **and** `onboardingGeneration >= required`.

**Lockout risk: YES** — generation-1 ACTIVE users are treated as **inactive** immediately after C3.8 code deploy, redirected to onboarding, **before** formal identity reset.

**Mitigation options (product-owner choice):**

1. Temporarily set `CROW_ONBOARDING_GENERATION_REQUIRED=1` during transition (documented rollback).
2. Operator bump specific accounts to generation 2 after manual re-verification.
3. Execute identity reset during maintenance window with comms.

**Emergency recovery:** Supabase login remains; operators can complete legal/email/phone onboarding or use generation override — does not permanently bypass verification.

---

## 12. Google OAuth readiness (review only)

| Item | Status |
|------|--------|
| Callback URLs for Preview + Production | Manual Supabase + Google Console allowlist |
| Verified-email claim validation | Implemented in provider identity service |
| One Supabase user → one PlatformAccount | Enforced |
| No auto tenant/client role | ✓ |
| Legal + phone always required for gen 2 | ✓ |
| Identity collisions fail safe | ✓ |

**Manual actions:** Add Preview callback to Google OAuth client; confirm Supabase Google provider enabled on Preview project.

---

## 13. Confirmations

| Item | Confirmed |
|------|-----------|
| Migration not applied | ✓ |
| Registration disabled | ✓ (feature flag; re-verify Vercel after any flag churn) |
| No legacy identity changed | ✓ |
| Production unchanged | ✓ |
| PR #9 not merged | ✓ |
| No live SMS sent | ✓ |

---

## 14. Final decision

**READY — SMS PROVIDER DECISION AND C3.8 MIGRATION AUTHORIZATION REQUIRED**

Sub-conditions:

- **CONDITIONAL PASS — LEGACY LOCKOUT POLICY REQUIRED** before deploy
- **CONDITIONAL PASS — PROVIDER SELECTION BLOCKED** until sender ID approved
- Migration hardening (RLS on new tables) addressed in C3.9A commits
