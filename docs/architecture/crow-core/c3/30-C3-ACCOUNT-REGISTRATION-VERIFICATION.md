# C3 — Account registration verification

## Threat model alignment (C3 spec)

| Control | C3 implementation |
|---------|-------------------|
| Duplicate login / identity split | Single `PlatformAccount` per Supabase user; no second credential store |
| OTP brute force | 6-digit code, 15m TTL, max 5 sends per challenge, 60s resend cooldown |
| OTP replay / cross-challenge reuse | HMAC-SHA256 over `challengeId:code` with `EMAIL_VERIFICATION_CODE_SECRET`; `timingSafeEqual` on verify |
| Email enumeration on verify | Generic failure messages; server validates session + pending account |
| Premature tenant access | `assignDefaultClientRoleOnSignUp` + `linkRequestsForUser` deferred until `ACTIVE` |
| Blocked / suspended accounts | `gateAuthSessionForC3` rejects blocked statuses before role landing |
| Accidental prod writes | `assertC2DatabaseEnvironmentSafe()` on all C3 Prisma mutations |
| Legacy regression | `ACCOUNT_REGISTRATION_ENABLED !== "true"` → no `PlatformAccount` writes; legacy auth path unchanged |
| Session-only account surfaces | Middleware + `requireActivePlatformAccount` gate `/account/*` and `/verify-email` when C3 on |
| Production email leakage | In-memory dev adapter only; no M4D/Resend wiring on this branch |
| Legal bypass / stale terms | Legal Review Gate before account creation; hash + version validation; dual activation gate |
| Forced marketing consent | Marketing default false; separate optional checkbox |
| Client scroll spoofing | Server ignores `scrolledToBottom`; only checkbox + version/hash validated |

## Status flow (with Legal Review Gate)

```
signUp / OAuth → Supabase session only (no PlatformAccount yet)
              → /register/legal (Legal Review Gate)
              → completeRegistrationWithLegalAcceptance
                   → PlatformAccount (PENDING_EMAIL_VERIFICATION)
                   → AccountLegalAcceptance + consent evidence
                   → issueEmailVerificationCode (in-memory email)
              → /verify-email
              → verifyEmailCode
                   → activate only if hasMandatoryLegalAcceptanceComplete
                   → ACTIVE
              → runDeferredClientOnboarding (role + request link)
              → resolvePostAuthLanding
```

Blocked statuses (`SUSPENDED`, `CLOSED`) fail closed at `gateAuthSessionForC3`.

Pending reacceptance (`required_before_protected_activity`) redirects active users to `/account/legal?reaccept=1` without removing memberships.

## Legal acceptance gates (addendum)

1. **No early account:** `signUp` must **not** call `bootstrapPlatformAccountOnSignUp`; redirect to `routes.account.registerLegal`.
2. **Mandatory documents:** ToS, Privacy Notice, and AUP published for locale (`en-US` default) before registration can complete.
3. **Evidence:** `AccountLegalAcceptance` rows with hash, locale, correlation id, and affirmative action type.
4. **Dual activation:** OTP verify and `activatePlatformAccount` both require `hasMandatoryLegalAcceptanceComplete`.
5. **Self-service:** `/account/legal` (ACTIVE only) shows history and marketing consent controls.

Full design: `C3_LEGAL_AGREEMENT_AND_CONSENT_ENGINE.md`.

## Verifiers

- `npm run c3-account:verify` — OTP + legal unit tests + static wiring checks
- `npx tsx src/lib/account/otp-code.test.ts` — HMAC, secret requirement, timing-safe compare
- `npx tsx src/lib/legal/legal-document-hash.test.ts` — canonical SHA-256
- `npx tsx src/lib/legal/legal-acceptance.service.test.ts` — mandatory complete/incomplete
- `npx tsx src/lib/legal/registration-legal-gate.test.ts` — scroll ignored; marketing default
- `npx tsx src/lib/account/email-verification-legal-gate.test.ts` — activation requires legal
- `scripts/verify-c3-account-registration.ts` — schema, auth, middleware, permissions, legal UI, doc files

## Environment gates (local only)

| Variable | Requirement |
|----------|-------------|
| `ACCOUNT_REGISTRATION_ENABLED` | Must be `"true"` to enable C3 paths |
| `EMAIL_VERIFICATION_CODE_SECRET` | Min 16 chars when issuing/verifying OTP |
| `SEED_LEGAL_DOCUMENTS` | Set `"true"` when seeding v1 ToS/Privacy/AUP locally |
| Database | Local dev DB only; no Preview/Production migrations on this branch |

## Migrations (local)

| Migration | Purpose |
|-----------|---------|
| `20260614140000_c3_account_registration` | PlatformAccount, OTP challenges, profile |
| `20260614150000_c3_legal_agreement` | LegalDocument*, AccountLegalAcceptance, consent |

Do **not** rewrite applied migrations. Do **not** deploy these to Preview/Production from this branch.

## C3 acceptance gates before merge

1. `npx prisma generate` succeeds with C3 + legal models present.
2. `npm run c3-account:verify` passes (OTP + legal tests + static verifier).
3. With flag **off**: sign-up/sign-in behave as before (no `PlatformAccount` rows).
4. With flag **on**: signup → `/register/legal` → accept → `/verify-email` → `ACTIVE`.
5. Without legal acceptances: OTP verify returns `legal_incomplete`; account stays pending.
6. After verify: deferred onboarding runs, `/account/profile` and `/account/legal` load.
7. OAuth callback applies same C3 + legal gate as password sign-in.
8. All C3 mutations invoke `assertC2DatabaseEnvironmentSafe()`.

## Out of scope (documented)

- `/account/settings`, `/account/sessions`, invitation inbox UI (routes reserved only)
- Production email adapter (M4D merge)
- Hosted environment migrations
- Git commit/push from agent session
- ERP org-authority checkbox on account registration (future request flow)

## Evidence artifacts

| Artifact | Path |
|----------|------|
| Mapping spec | `docs/architecture/crow-core/c3/C3_EXISTING_ACCOUNT_AUTH_REQUEST_INVITE_MAPPING.md` |
| Legal engine spec | `docs/architecture/crow-core/c3/C3_LEGAL_AGREEMENT_AND_CONSENT_ENGINE.md` |
| Account migration | `prisma/migrations/20260614140000_c3_account_registration/migration.sql` |
| Legal migration | `prisma/migrations/20260614150000_c3_legal_agreement/migration.sql` |
| Orchestration | `src/lib/account/c3-auth-orchestration.ts` |
| Legal acceptance | `src/lib/legal/legal-acceptance.service.ts` |
| Registration action | `src/lib/actions/account-legal.ts` |
| OTP service | `src/lib/account/email-verification.service.ts` |
| Static verifier | `scripts/verify-c3-account-registration.ts` |
