# C3 — Existing Account, Auth, Request & Invite Mapping

**Gate document (mandatory before Prisma/service edits).** Maps C3 Universal Account Registration to current CYBERCROW identity and intake flows.

## 1. Identity sources today

| Source | Location | Notes |
|--------|----------|-------|
| Supabase Auth | `src/lib/supabase/*`, `signUp` / `signIn` in `src/lib/actions/auth.ts` | Canonical credentials + OAuth sessions |
| `crow_role` in JWT `app_metadata` | Set in `assignDefaultClientRoleOnSignUp`, Entra callback | Route/permission layer |
| `TenantMembershipInvite.targetSupabaseUserId` | `prisma/schema.prisma` | Pre-existing invite linkage |
| Client ERP requests | `ClientImplementationRequest` + `linkRequestsForUser` | Email match on signup |

**C3 adds:** `PlatformAccount` (1:1 with Supabase user) as global Crow account state machine — **not** a second login system.

## 2. Sign-up / sign-in touchpoints

| Flow | File | Current behavior | C3 change (flag on) |
|------|------|------------------|---------------------|
| Email/password signup | `auth.ts` → `signUp` | Immediate `assignDefaultClientRoleOnSignUp` + `linkRequestsForUser` | Create `PlatformAccount` `PENDING_EMAIL_VERIFICATION`, send OTP, redirect `/verify-email`; defer role + link |
| Email/password sign-in | `auth.ts` → `signIn` → `finalizeAuthUser` | Same immediate link/role | If pending → `/verify-email`; if active → run deferred onboarding once; else existing landing |
| OAuth callback | `src/app/auth/callback/route.ts` | Immediate link + role | Same gating via `c3-auth-orchestration` |
| Post-login redirect | `post-login-redirect.ts` | Role-based admin vs client home | Insert C3 status check before role landing |

**Feature flag:** `ACCOUNT_REGISTRATION_ENABLED` — when `false`, preserve legacy behavior (no PlatformAccount writes).

## 3. Request linking deferral

| Function | File | Deferred until |
|----------|------|----------------|
| `linkRequestsForUser` | `client-request-link.service.ts` | `PlatformAccount.status === ACTIVE` |
| `assignDefaultClientRoleOnSignUp` | `auth.ts` | `ACTIVE` (after email verification) |

Also called from `implementation-request.ts` — unchanged for staff-created flows; C3 only gates **auth finalize** paths.

## 4. Invitation inbox (C3 scope)

| Model / flow | Mapping |
|--------------|---------|
| `TenantMembershipInvite` | Read by `targetSupabaseUserId` or normalized email when account ACTIVE |
| Accept | Sets membership; requires `account.invitation.accept.self` permission |
| No tenant privilege until invite accepted | Existing tenant RBAC unchanged |

## 5. Route & middleware mapping

| C3 route | Existing | Protection |
|----------|----------|------------|
| `/register` | Alias → `/signup` | Public |
| `/verify-email` | New | Auth required; pending accounts only |
| `/account/*` | New | Auth + ACTIVE platform account |

Add to `RESERVED_PATH_SEGMENTS` and `PUBLIC_PREFIXES` where applicable in `route-protection.ts`.

## 6. Permissions mapping

New self-scoped keys (granted only when `PlatformAccount` is `ACTIVE`):

- `account.profile.read.self`, `account.profile.update.self`
- `account.request.create`, `account.request.read.self`, `account.request.update_draft.self`
- `account.invitation.read.self`, `account.invitation.accept.self`
- `account.session.read.self`, `account.session.revoke.self`

Platform staff roles unchanged. Client role gains account self-permissions **after activation**, not at raw signup.

## 7. Email delivery

| Layer | Path |
|-------|------|
| Port | `src/lib/email/email-delivery.port.ts` |
| OTP | HMAC-SHA256 over `challengeId:code` with `EMAIL_VERIFICATION_CODE_SECRET` |
| Production adapter | Deferred (M4D merge); test/in-memory adapter for local/CI |

## 8. C2 mutation guard

All C3 Prisma writes call `assertC2DatabaseEnvironmentSafe()` from `c2-database-mutation-guard.ts` before mutations.

## 9. Non-goals (this branch)

- No M4D/Resend production wiring
- No hosted Preview/Production migrations
- No duplicate Supabase project or parallel session store

## 10. Decision traceability

Implementation order: this doc → schema migration → services → auth wiring → UI → tests/verifier → Section 30 PO report.
