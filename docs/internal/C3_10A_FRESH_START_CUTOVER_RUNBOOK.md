# C3.10A — Fresh-start identity cutover runbook (sanitized)

**Phase:** C3.10A planning only — no users deleted, no SMS sent, registration stays disabled.

## Scope of future wipe

Remove or invalidate:

- Supabase Auth users and OAuth identities
- PlatformAccounts, profiles, provider identities
- Email and phone verification challenges
- Account roles and tenant memberships
- Invitations and client request links
- Abandoned test ERP/request links
- Active application sessions (where possible)

Preserve unless separately approved:

- Tenant records and Enterprise Blueprints
- Migration history and legal document versions
- System configuration and non-test operational records
- Security/audit evidence (pseudonymized references where required)
- Application code and architecture

## Reset execution graph (idempotent / resumable)

1. Enter maintenance mode  
2. Disable registration  
3. Create and restore-test fresh backup  
4. Freeze current onboarding generation  
5. Deny legacy identity authorization  
6. Transfer or detach operational ownership  
7. Remove tenant memberships and account roles  
8. Remove invitations and request links  
9. Remove test ERP/account-owned records  
10. Remove verification challenges and provider identities  
11. Remove profiles and PlatformAccounts  
12. Resolve Storage ownership  
13. Delete Supabase Auth identities  
14. Verify zero ordinary legacy users remain  
15. Set `CROW_ONBOARDING_GENERATION_REQUIRED=2`  
16. Redeploy  
17. Register product owner through fresh dual-channel flow  
18. Run explicit platform-owner bootstrap (`npm run platform-owner:bootstrap-plan` then authorized execute)

## Post-reset platform owner bootstrap

**Never** use “first registered user becomes admin.”

The product owner designates a target identity at **runtime only** via `PLATFORM_OWNER_DESIGNATED_EMAIL` (never commit the address or any password to the repository).

Flow:

1. User completes Google or email/password → legal → email OTP → phone OTP → ACTIVE generation-2 requester (least privilege only)
2. Operator runs `npm run platform-owner:bootstrap-plan` with `PLATFORM_OWNER_DESIGNATED_EMAIL` set
3. Plan resolves exactly one Supabase identity + one PlatformAccount, verifies legal/email/phone/generation, and outputs internal `platformAccountId` + `plan_digest`
4. Execute: `npm run platform-owner:bootstrap-execute` (remains gated — authority grant disabled until later authorization)

Execute requires: internal account ID, authorization phrase, database fingerprint, matching plan digest, and `PLATFORM_OWNER_CONFIRM_DESIGNATION=true`.

**C3.10B:** Use a separate disposable test identity for live dual-channel proof — not the designated Platform Owner account.

## Tooling

| Command | Purpose |
|---------|---------|
| `npm run identity-reset:plan` | Read-only hosted census + classification (dry-run) |
| `npm run identity-reset:execute` | **Disabled** |
| `npm run platform-owner:bootstrap-plan` | Dry-run bootstrap validation |
| `npm run platform-owner:bootstrap-execute` | **Disabled** |

## Refusal conditions (execute)

Plan refuses when: unclassified identities, unresolved ownership, fingerprint mismatch, missing backup checksum, invalid execute phrase, ambiguous environment, or unresolved Storage blockers.

Execute phrase (future): `WIPE ALL PREVIOUS USERS AND BEGIN GENERATION 2`

## Hosted baseline (C3.10A)

- Supabase ref: `wbwnsndcxrgyqwppurms`  
- Database fingerprint: `0355c17692e2a90d`  
- C3.8 tables: `phone_verification_challenges`, `platform_provider_identities`  
- Preview flags: registration off, diagnostics/canary off, `CROW_ONBOARDING_GENERATION_REQUIRED=1`
