# M4C — Tenant Invite Acceptance Schema Proposal

**Date:** 5 Jun 2026  
**Status:** **PROPOSAL — awaiting explicit migration approval**  
**Audience:** Internal delivery / ProCrow operators / engineering

**Related:** [`M4B_TENANT_MEMBERSHIP_INVITE_ONBOARDING_FLOW.md`](M4B_TENANT_MEMBERSHIP_INVITE_ONBOARDING_FLOW.md) · [`M4_TENANT_MEMBERSHIP_BUSINESS_PORTAL_ACCESS_HARDENING.md`](M4_TENANT_MEMBERSHIP_BUSINESS_PORTAL_ACCESS_HARDENING.md)

---

## Part 1 — Why existing schema is insufficient

### `TenantMembership` today

| Field | Limitation for invite acceptance |
|-------|--------------------------------|
| `supabaseUserId` | Requires Auth user at row creation — cannot represent pre-acceptance invite |
| `tenantId`, `role` | No pending state; upsert in M4B activates membership immediately |
| `createdAt` | No `expiresAt`, `acceptedAt`, `revokedAt`, or status lifecycle |

**M4B PATH A** infers `pending_account` / `pending_acceptance` in UI only. There is no durable invite row, no token, no revoke, and no idempotent acceptance boundary.

### Why not extend `TenantMembership`?

| Approach | Risk |
|----------|------|
| Add `email`, `tokenHash`, `status` to `TenantMembership` | Conflates **membership** (active access) with **invite** (pre-access intent); complicates unique constraint on `supabaseUserId` when user does not exist yet |
| Nullable `supabaseUserId` on membership | Breaks M4 guard assumptions (membership = proven user); invites orphan rows that look like access |
| Reuse `PlatformNotification` metadata | Audit/inbox only — not authoritative for acceptance, expiry, or single-use tokens |

### Existing token patterns (not reusable as-is)

| Pattern | Use | Reuse for tenant invite? |
|---------|-----|---------------------------|
| `EnterpriseBlueprint.proposalToken` | Client proposal approval (public `/proposal/[token]`) | **No** — different trust model, no tenant RBAC, client commercial scope |
| `commercial.service` `randomBytes(24).base64url` | Proposal token generation | **Pattern only** — adopt entropy + URL shape, store **hash** not raw token |
| M4B `PlatformNotification` `tenant_membership_invite` | Operator audit log | **Supplement** — keep for audit; not source of truth for acceptance |

### Auth / metadata (unchanged at proposal stage)

- Supabase Auth user required **at acceptance time** (not at invite creation).
- `grantTenantAccess` in `membership.service.ts` remains the only approved path to sync `app_metadata.tenant_slugs` and `crow_role`.
- No email-domain matching; invited email must match signed-in user exactly (case-normalized).

---

## Part 2 — Proposed model

### New enum: `TenantMembershipInviteStatus`

```
pending | accepted | revoked | expired
```

### New model: `TenantMembershipInvite`

| Field | Type | Notes |
|-------|------|-------|
| `id` | `String @id @default(cuid())` | Primary key |
| `tenantId` | `String` | FK → `Tenant`, `onDelete: Cascade` |
| `email` | `String` | Normalized lowercase invited address |
| `role` | `String` | Allowlist: `tenant_user` \| `tenant_admin` only |
| `tokenHash` | `String @unique` | SHA-256 (or similar) of one-time raw token — **never store raw token** |
| `status` | `TenantMembershipInviteStatus @default(pending)` | Lifecycle |
| `expiresAt` | `DateTime` | Default e.g. now + 7 days (operator-configurable at create) |
| `invitedByUserId` | `String` | Supabase Auth user id of operator (platform staff or tenant admin) |
| `acceptedByUserId` | `String?` | Set on acceptance |
| `acceptedAt` | `DateTime?` | Set on acceptance |
| `revokedAt` | `DateTime?` | Set on revoke |
| `revokedByUserId` | `String?` | Operator who revoked |
| `operatorNote` | `String?` | Optional internal note (not shown on public invite page) |
| `createdAt` | `DateTime @default(now())` | |
| `updatedAt` | `DateTime @updatedAt` | |

### Indexes

| Index | Purpose |
|-------|---------|
| `@@index([tenantId])` | ProCrow invite list per tenant |
| `@@index([email])` | Lookup pending invites by email |
| `@@unique([tokenHash])` | Token lookup |
| `@@index([status])` | Filter pending / expired |
| `@@index([expiresAt])` | Expiry sweeps / validation |

### Optional composite guard (implementation detail)

Consider `@@index([tenantId, email, status])` to list pending invites per tenant+email without allowing duplicate **pending** rows (enforce in service layer if not unique in DB).

### Prisma sketch (not applied)

```prisma
enum TenantMembershipInviteStatus {
  pending
  accepted
  revoked
  expired
}

model TenantMembershipInvite {
  id                String                       @id @default(cuid())
  tenantId          String
  email             String
  role              String
  tokenHash         String                       @unique
  status            TenantMembershipInviteStatus @default(pending)
  expiresAt         DateTime
  invitedByUserId   String
  acceptedByUserId  String?
  acceptedAt        DateTime?
  revokedAt         DateTime?
  revokedByUserId   String?
  operatorNote      String?
  createdAt         DateTime                     @default(now())
  updatedAt         DateTime                     @updatedAt

  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([email])
  @@index([status])
  @@index([expiresAt])
  @@map("tenant_membership_invites")
}
```

Add to `Tenant` model:

```prisma
membershipInvites TenantMembershipInvite[]
```

---

## Part 3 — Safety and rollout

| Concern | Mitigation |
|---------|------------|
| Destructive DDL | **Additive only** — new table + enum; `TenantMembership` unchanged |
| Backfill | **Not required** — existing memberships remain valid; M4B direct-grant path can coexist until UI migration |
| Raw token storage | Generate high-entropy token once; persist `tokenHash` only; show raw token / URL once at create |
| Token reuse | On accept: set `status=accepted`, `acceptedAt`; reject subsequent accepts |
| Wrong email | Acceptance requires authenticated session email === `invite.email` (normalized) |
| Expired / revoked | Service checks `expiresAt` and `status` before accept |
| platform_admin / ProCrow | Role allowlist in service + action; never write `platform_admin` from invite path |
| Client approval | Invite route does not touch proposal tokens or client approval flows |
| Public self-join | Route `/tenant-invite/[token]` validates token only; membership created only on guarded accept action |
| Email domain auto-membership | **Forbidden** — exact email match only |

### Rollout sequence (post-approval)

1. Apply migration (dev/staging first).
2. `prisma generate` + deploy app code (M4C implementation tranche).
3. ProCrow panel: **Create invite link** creates `TenantMembershipInvite` row; **Add member** (M4B immediate grant) remains for break-glass / legacy until deprecated in UI copy.
4. Optional cron/job later: mark `pending` → `expired` when `expiresAt < now()` (can be lazy on read for M4C).
5. Production migration deploy only with explicit operator approval (separate from this proposal).

---

## Part 4 — Implementation mapping (after approval)

| Component | Responsibility |
|-----------|----------------|
| `tenant-invite-acceptance-contract.ts` | Status snapshot, disclaimers, allowlist |
| `tenant-invite-token.service.ts` | Create/hash/lookup/accept/revoke/list |
| `tenant-invite-acceptance.ts` actions | Create (operator), accept (auth user), revoke (operator) |
| `/tenant-invite/[token]` route | Sign-in CTA, accept UI, safe error states |
| Admin panel enhancement | Copy link, expiry, invite list, revoke pending |
| `sanitizeAuthNextPath` | Preserve `/tenant-invite/[token]` through login/signup |

### Email delivery (M4C default)

**Manual copy-link mode** — no Crow transactional email. Optional Supabase `inviteUserByEmail` remains documented as Supabase Auth delivery, not Crow-owned email. Full provider → **M4D**.

---

## Part 5 — Approval checklist

Before implementing migration + code:

- [ ] Engineering lead approves additive `tenant_membership_invites` table
- [ ] Operator confirms staging migration window
- [ ] Security review: token hash algorithm, no raw token persistence, accept guards
- [ ] Explicit sign-off to run `prisma migrate dev` / deploy migration

**Until all boxes checked:** no `prisma/schema.prisma` change, no migration SQL, no acceptance route.

---

## Decision

**Migration required for M4C implementation.**  
**Proposal complete — STOP here until explicit approval.**
