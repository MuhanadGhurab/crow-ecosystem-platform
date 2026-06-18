# C3.6 — Auth Confirmation Convergence

## Decision

C3 uses a **single user-visible mailbox verification flow** (Crow OTP via Resend). The shared Supabase project keeps **Confirm Email enabled** (`mailer_autoconfirm=false`). C3 does **not** use the client-side `signUp()` confirmation path for new email/password registrations.

## Flow

```text
Account details (/signup)
→ /register/legal (email + password + mandatory legal acceptance)
→ server Admin API: create Auth user (unconfirmed)
→ PlatformAccount PENDING_EMAIL_VERIFICATION
→ Crow OTP email (Resend)
→ /verify-email (no session required)
→ Crow OTP verified
→ server Admin API: confirm email
→ PlatformAccount ACTIVE
→ /login?verified=1
→ explicit password sign-in
→ /account (active requester, least privilege)
```

## Global Supabase behavior

- **Do not** disable Confirm Email globally.
- Production legacy signup behavior remains unchanged when `ACCOUNT_REGISTRATION_ENABLED=false`.
- C3 email/password registration uses `src/lib/supabase/admin.ts` (service role, server-only).

## Preview callback (OAuth / future email Auth)

Preserve for operator allowlist:

`https://crow-ecosystem-platform-8rujeaal4-muhanadghurabs-projects.vercel.app/auth/callback`

The C3 email/password path does **not** depend on this callback.

## Security notes

- Plaintext passwords exist only in the TLS request and immediate Admin `createUser` call.
- No service role in browser bundles (`server-only` + static boundary tests).
- Duplicate email responses are generic (`C3_GENERIC_REGISTRATION_MESSAGE`).
- Registration remains behind `ACCOUNT_REGISTRATION_ENABLED=false` until product-owner enables controlled preview E2E.

## Audit mapping (no new migration)

Distinct phases use existing `PlatformAccountAuditEventType` values with metadata, e.g.:

- `registration_started` — `{ supabaseAuthUserProvisioned: true }`
- `legal_acceptance_recorded`
- `verification_code_sent`
- `verification_succeeded` — `{ supabaseEmailConfirmed: true }`
- `account_activated`
- `verification_failed` — compensation / orphan / delivery failure reasons
