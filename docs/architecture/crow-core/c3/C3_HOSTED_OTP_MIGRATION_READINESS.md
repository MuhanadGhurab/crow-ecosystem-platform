# C3.3 — Hosted OTP Provider & Migration Readiness

## Scope

C3.3 closes the hosted email-provider blocker for Preview validation while keeping:

- `ACCOUNT_REGISTRATION_ENABLED=false` on Preview
- No hosted migration apply without product-owner authorization phrase
- No Production promotion
- Shared Supabase classification: `APP_ENVIRONMENT=preview`, `DATABASE_ENVIRONMENT=production`, `BACKEND_ISOLATION=shared`

## Email provider selection

| Environment | Selection |
|-------------|-----------|
| Local dev + `LOCAL_EMAIL_PROVIDER=mailpit` | Mailpit adapter |
| `NODE_ENV=test` | In-memory adapter (tests only) |
| Preview / Production + `EMAIL_PROVIDER=resend` | Resend adapter |

Hosted environments **fail closed** when `EMAIL_PROVIDER`, `RESEND_API_KEY`, or From address is missing. No Mailpit, console, or in-memory fallback on hosted.

## M4D reuse (PR #2 not merged)

Generic patterns extracted from `69cfe0c` into the canonical C3 `EmailDeliveryPort`:

- Resend HTTP delivery shape
- `summarizeDeliveryError` / HTTP failure sanitization
- Server-only `RESEND_API_KEY` + From resolution

Invite-specific modules (`send-business-portal-invite-email`, tenant templates) were **not** merged to avoid a second abstraction.

## Verification

```bash
npm run c3-hosted-email:verify
npm run c3-resend:provider-test
npm run db:backup:pre-migration
npm run db:migrate:controlled -- --environment production --check-only
```

Post-migration RLS SQL: `docs/internal/c3-post-migration-rls-verification.sql`

## Supabase native confirmation

C3 activation path: legal acceptance → Crow OTP → `PlatformAccount ACTIVE`.

When Supabase returns a session immediately after `signUp` (email confirmation disabled), users proceed to `/register/legal` without a second Supabase confirmation email. If the Supabase project enables mandatory email confirmation, users would experience **double verification** (Supabase link + Crow OTP) — a product decision before enabling registration.

## Authorization phrase (migration apply only)

`GO — APPLY THE REVIEWED C3 ADDITIVE MIGRATIONS TO THE SHARED SUPABASE PROJECT FOR PREVIEW TESTING`
