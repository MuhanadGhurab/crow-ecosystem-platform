# M4C — Tenant Invite Acceptance Token / Email Delivery

**Date:** 5 Jun 2026  
**Status:** **PROPOSAL-ONLY PASS** (implementation blocked pending migration approval)  
**Audience:** Internal delivery / ProCrow operators

**Related:** [`M4C_TENANT_INVITE_ACCEPTANCE_SCHEMA_PROPOSAL.md`](M4C_TENANT_INVITE_ACCEPTANCE_SCHEMA_PROPOSAL.md) · [`M4B_TENANT_MEMBERSHIP_INVITE_ONBOARDING_FLOW.md`](M4B_TENANT_MEMBERSHIP_INVITE_ONBOARDING_FLOW.md)

---

## Precheck

| Check | Result |
|-------|--------|
| M4 on `main` | `531a9e0` — Tenant membership hardening |
| M4B on `main` | `ad9b6d4` — ProCrow tenant membership invite flow |
| Working tree | Clean at proposal start (`main...origin/main`) |
| Vercel production | **Green** — deployment `4946108823` state `success` (5 Jun 2026) |

---

## Part 1 — Invite schema audit

### Current `TenantMembership`

Fields: `id`, `supabaseUserId`, `tenantId`, `role`, `createdAt`.  
Cannot store invite token, invited email (pre-auth), status, expiry, or revoke lifecycle without conflating inactive invites with active memberships.

### M4B behavior (baseline)

- Operator **Add member** grants membership immediately when Auth user exists.
- **pending_account** is UI/audit-only via `buildTenantMembershipInviteSnapshot`.
- Optional Supabase invite API — documented as Supabase Auth, not Crow email.
- Operator may re-run Add member after user signs up.

### Reusable infrastructure

| Asset | M4C use |
|-------|---------|
| `grantTenantAccess` / metadata sync | **Reuse** on acceptance only |
| `lookupSupabaseUserByEmail` | Pre-acceptance snapshot / operator UI |
| `sanitizeAuthNextPath` | Preserve invite URL through login/signup |
| `PlatformNotification` | Audit supplement on create/accept/revoke |
| `proposalToken` pattern | Entropy + public URL only — **not** same table |

### Auth callback / signup

- `/login` and `/signup` support `?next=` via `sanitizeAuthNextPath`.
- M4C implementation must allow `/tenant-invite/[token]` as safe next path (relative, same-origin).
- Invite token must **not** bypass authentication.

---

## Part 2 — Decision gate

**Migration required** for persisted invite acceptance.

Deliverable: [`M4C_TENANT_INVITE_ACCEPTANCE_SCHEMA_PROPOSAL.md`](M4C_TENANT_INVITE_ACCEPTANCE_SCHEMA_PROPOSAL.md)

| Item | Proposal |
|------|----------|
| New table | `TenantMembershipInvite` |
| Status enum | `pending`, `accepted`, `revoked`, `expired` |
| Token storage | `tokenHash` unique — raw token never stored |
| Role allowlist | `tenant_user`, `tenant_admin` |
| `TenantMembership` | **Unchanged** — created only on acceptance |
| Backfill | Not required |
| Destructive changes | None |

**No migration applied in this phase.**

---

## Parts 3–8 — Implementation status (deferred)

| Part | Planned artifact | Status |
|------|------------------|--------|
| 3 Contract | `tenant-invite-acceptance-contract.ts` | **Not created** — blocked |
| 4 Token service | `tenant-invite-token.service.ts` | **Not created** — blocked |
| 5 Server actions | `tenant-invite-acceptance.ts` | **Not created** — blocked |
| 6 Route | `/tenant-invite/[token]` | **Not created** — blocked |
| 7 ProCrow UI | Copy link, list, revoke | **Not created** — blocked |
| 8 Email | Manual copy-link default | **Documented** — M4D for provider |

---

## Part 9 — Access gateway alignment (planned)

After implementation:

1. User opens invite link → sign in/up with invited email → accept.
2. `grantTenantAccess` syncs metadata.
3. `/access` shows Business Portal card for tenant slug.
4. `/[tenant]/dashboard` loads per M4 guards.
5. Client-only role insufficient without membership.

---

## Part 10 — Verification

```bash
npm run tenant-invite-acceptance:verify   # proposal-mode checks
npm run tenant-invite:verify              # M4B regression
npm run tenant-membership:verify
npm run access-gateway:verify
npm run auth-landing:verify
npm run typecheck
npm run lint
npm run build
npm run public:mirror-manifest
```

**Not run in proposal phase:** `prisma migrate`, `db:generate` for new model, seeds.

---

## Part 11 — Remaining gaps

1. Migration approval + DDL apply
2. Token service + accept route + guarded actions
3. ProCrow panel: create link, list invites, revoke pending
4. Lazy or scheduled expiry (`pending` → `expired`)
5. Session/metadata refresh after accept (may require re-login or callback refresh)
6. Crow-owned email delivery → **M4D**

---

## Recommended next phase

**After migration approval:** complete M4C implementation tranche (contract → service → route → UI → verifiers).

**Alternatively (parallel product work):**

- **M4D** — Tenant invite email delivery provider
- **M3.6** — Purchase-to-Stock UX refinement
- **M3.4B** — Approved workflow persistence migration

---

## Acceptance (this delivery)

| Criterion | Result |
|-----------|--------|
| Invite schema audit documented | **Yes** |
| Migration proposal exists | **Yes** |
| No schema/migration without approval | **Yes** |
| Risks and rollout documented | **Yes** |

**M4C proposal-only: PASSED**  
**M4C implementation: NOT STARTED** (awaiting approval)
