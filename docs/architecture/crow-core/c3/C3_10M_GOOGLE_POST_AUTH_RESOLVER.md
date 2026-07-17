# C3.10L / C3.10M — Google OAuth and Crow post-auth resolver

Google authenticates identity only. Crow authorization follows server-controlled gates.

## Journey

```text
Continue with Google
→ Supabase /auth/callback (exchangeCodeForSession)
→ /auth/resolving (Crow post-auth resolver UI)
→ legal gate when mandatory agreements missing
→ activation when legal=3 and verified email
→ role-aware landing (/account for ordinary requesters)
```

## Trust boundaries

- Provider and verified-email evidence come from Supabase `getUser()` identity data.
- Do not trust query parameters, form fields, or `user_metadata` alone for verification.
- Google provider email must match canonical Auth email when a provider email claim is present.
- One Auth user maps to one PlatformAccount; provider collisions fail closed.

## Feature flags

| Flag | Proof window | Lockdown |
|------|--------------|----------|
| `GOOGLE_SSO_ENABLED` | `true` | `false` |
| `ACCOUNT_REGISTRATION_ENABLED` | `false` | `false` |
| `CROW_ONBOARDING_GENERATION_REQUIRED` | `2` | `1` |
| `CROW_PHONE_VERIFICATION_REQUIRED` | `false` | `false` |

## Operator env (gitignored)

```text
C3_GOOGLE_PROOF_EMAIL=
C3_PROOF_ACCOUNT_RETENTION=retain_after_proof
C3_GOOGLE_PROVIDER_CONFIRMED=true
C3_GOOGLE_REDIRECT_CONFIRMED=true
C3_MANUAL_BROWSER_SESSION_CERTIFIED=true|false
```

## Verification

```text
npm run c3-google-proof-identity:verify
npm run c3-google-legal-onboarding:verify
```

Password recovery hosted proof remains deferred to C3.11.
