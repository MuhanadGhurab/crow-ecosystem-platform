# C3.10B — Email-only onboarding policy (deferred phone verification)

## Product decision

Phone/SMS verification is **deferred** until Crow is ready for customer-facing production.
Account activation for the current release requires:

```text
mandatory legal acceptance (Terms + Privacy Notice + AUP)
AND verified email
= ACTIVE PlatformAccount (generation 2)
```

Phone infrastructure remains in place but dormant — no SMS provider calls, no phone
challenges, and no Unifonic credentials required while the policy flag is off.

## Server configuration

| Variable | Current value | Notes |
|----------|---------------|-------|
| `CROW_PHONE_VERIFICATION_REQUIRED` | `false` (default) | Server-side only; never `NEXT_PUBLIC_*` |
| `CROW_ONBOARDING_GENERATION_REQUIRED` | `2` after cutover | `1` during legacy gate; do not set `3` now |

Canonical helper: `isPhoneVerificationRequired()` in
`src/lib/account/phone-verification-policy.ts`.

## Onboarding generations

| Generation | Semantics |
|------------|-----------|
| 1 | Legacy identities before authorized fresh reset |
| 2 | Legal + verified email (current enrollment) |
| 3 (future) | Legal + verified email + verified phone when policy enabled |

Generation-2 semantics must not change silently when phone verification is enabled later;
phone applies only to generation-3 enrollments when `CROW_PHONE_VERIFICATION_REQUIRED=true`.

## Active journey (policy off)

```text
legal missing → /onboarding/legal
email missing → /onboarding/verify-email
legal + email complete → ACTIVE
ACTIVE → normal post-auth landing
```

Progress indicator: **Legal → Email → Active** (phone step hidden, components retained).

## Platform Owner bootstrap

While `CROW_PHONE_VERIFICATION_REQUIRED=false`, bootstrap plan requires ACTIVE generation-2
account with legal=3 and email verified; phone evidence is not required.

Execute remains disabled until separately authorized. No designated email or password in repo.

## Verification

```bash
npm run c3-email-only-onboarding:verify
```

Expected:

```text
PASS — LEGAL AND EMAIL VERIFICATION ACTIVATE GENERATION-2 ACCOUNTS; PHONE VERIFICATION DEFERRED
```

## Preview proof flags (branch Preview only)

```text
ACCOUNT_REGISTRATION_ENABLED=true
CROW_PHONE_VERIFICATION_REQUIRED=false
CROW_ONBOARDING_GENERATION_REQUIRED=2
```

Use a **disposable** identity — not the designated Platform Owner email.

After proof: cleanup test data, set `ACCOUNT_REGISTRATION_ENABLED=false`, keep phone policy false.

## Not in scope

- Identity reset execution
- C3.8 migration rollback or phone table deletion
- Production promotion
- Unifonic credential onboarding
