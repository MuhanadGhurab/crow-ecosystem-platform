# M4B — Tenant Membership Invite / Onboarding Flow

**Date:** 5 Jun 2026  
**Status:** **PASSED** (PATH A — no migration)  
**Audience:** Internal delivery / ProCrow operators

**Related:** [`M4_TENANT_MEMBERSHIP_BUSINESS_PORTAL_ACCESS_HARDENING.md`](M4_TENANT_MEMBERSHIP_BUSINESS_PORTAL_ACCESS_HARDENING.md) · [`L5_ACCESS_GATEWAY_PORTAL_ROLE_MODEL.md`](L5_ACCESS_GATEWAY_PORTAL_ROLE_MODEL.md)

---

## Objective

Provide a **ProCrow-controlled** path to add tenant users with `tenant_user` or `tenant_admin` roles without script-only membership grants. Business Portal access still requires verified `TenantMembership`; invite does **not** grant ProCrow, `platform_admin`, Client Portal approval rights, payments, or tenant auto-provisioning.

---

## Part 1 — Audit (existing capability)

### Prisma `TenantMembership`

| Field | Purpose |
|-------|---------|
| `id` | Primary key |
| `supabaseUserId` | Supabase Auth user id |
| `tenantId` | FK to tenant |
| `role` | `tenant_user` \| `tenant_admin` (Crow tenant role) |
| `createdAt` | Audit timestamp |

**No** invite token, email, status, or expiry columns exist today.

### Existing helpers (reused)

| Location | Capability |
|----------|------------|
| `src/lib/services/membership.service.ts` | `grantTenantAccess`, `grantTenantAccessByEmail`, `inviteAndGrantTenantAccess`, `listTenantMemberships`, **`lookupSupabaseUserByEmail`** (M4B) |
| `src/lib/actions/membership.ts` | `grantTenantAccessAction` (platform staff), `inviteTenantUserAction` (tenant policy `cem.users.invite`) |
| `src/components/admin/grant-tenant-access-form.tsx` | Legacy audit-tab form |
| `src/lib/auth/tenant-policy-guard.ts` | `requireActionTenantPolicy` |
| `src/lib/services/tenant-membership-access.service.ts` | M4 Business Portal access decisions |
| `scripts/grant-tenant-access.ts` | Operator script (still valid for break-glass) |

### Auth / onboarding behavior

- Supabase Auth user **must exist** (or be created via optional Supabase invite API) before DB membership is active.
- `grantTenantAccess` syncs `app_metadata.tenant_slugs` and `crow_role` via existing safe helper.
- `/signup` is Client Portal oriented — **no** email-domain auto-membership.
- `/access` lists Business Portal cards only for proven tenant slugs (M4).

---

## Part 2 — Schema decision

**PATH A — NO MIGRATION** (chosen)

Existing `TenantMembership` is sufficient for M4B:

- Operator adds membership when Auth user exists → immediate **active** state.
- When Auth user missing → **pending_account** (operator message + audit log); user signs up with exact email, operator re-runs Add member.
- Optional checkbox uses Supabase `inviteUserByEmail` — does **not** imply Crow transactional email.

**PATH B deferred to M4C:** persisted invite tokens, acceptance links, cancel/expiry states in DB.

No `M4B_TENANT_MEMBERSHIP_INVITE_SCHEMA_PROPOSAL.md` created.

---

## Part 3 — Contract

`src/lib/tenant/tenant-membership-invite-contract.ts`

- `TenantInviteStatus`, `TenantInviteRole`, `TenantInviteSource`
- `TenantMembershipInviteDraft`, `TenantMembershipInviteSnapshot`
- `TENANT_INVITE_ROLE_ALLOWLIST` = `tenant_user` \| `tenant_admin`
- `TENANT_MEMBERSHIP_INVITE_DISCLAIMERS`

---

## Part 4 — Service

`src/lib/services/tenant-membership-invite.service.ts`

- `buildTenantMembershipInviteSnapshot` — preflight by email
- `createTenantMembershipInvite` — PATH A flows:
  1. No auth user, no Supabase API → pending_account + audit
  2. `useSupabaseInviteApi` → `inviteAndGrantTenantAccess`
  3. Auth user exists → `grantTenantAccess` / `grantTenantAccessByEmail`
- Audit: `platformNotification` event `tenant_membership_invite`

---

## Part 5 — Server actions & security

`src/lib/actions/tenant-membership-invite.ts`

| Action | Guard |
|--------|-------|
| `createTenantMembershipInviteAction` | Platform staff **or** tenant admin with `cem.users.invite` + `canManageTenantUsers` |

`cancelTenantMembershipInviteAction` — **not implemented** (no persisted invite row without migration). Documented for M4C.

`inviteTenantUserAction` copy updated to avoid false “Invitation sent” claims.

---

## Part 6 — ProCrow UI

`/admin/tenants/[tenantId]` overview tab:

- `AdminTenantMembershipInvitePanel` — email, role, optional note, optional Supabase invite API
- Safety copy: Business Portal only; no ProCrow / platform admin / client approval / payments
- Honest email delivery disclaimer

Existing `AdminTenantMembershipAccessPanel` retained for M4 access model summary.

---

## Part 7 — Access gateway / sign-in

| State | Behavior |
|-------|----------|
| Active membership + sign-in | `/access` shows Business Portal card; `/[tenant]/dashboard` loads |
| Pending account | Operator UI explains user must sign up with invited email; re-run Add member |
| Client-only user | M4 blocks Business Portal (unchanged) |
| Email domain match | **Not used** for membership |

---

## Manual test path (operator)

1. ProCrow → `/admin/tenants/{tenantId}` → **Tenant membership invite (M4B)** panel.
2. Enter email + `tenant_admin` or `tenant_user` → **Add tenant member**.
3. If account exists: confirm success message; user signs in → `/access` → `/{slug}/dashboard`.
4. If no account: confirm pending_account message; user signs up at `/signup` with same email; re-run Add member.
5. Optional: enable Supabase invite API checkbox; verify membership in DB + metadata sync.

**Staging reference:** `meem-global` · prior smoke account `mkkzero@gmail.com` (`tenant_admin`) from script grant — pattern now reproducible via ProCrow panel.

---

## Verification

```bash
npm run tenant-invite:verify
npm run tenant-membership:verify
npm run access-gateway:verify
npm run auth-landing:verify
npm run cem-transaction:verify
npm run cem-workflow-persistence:verify
npm run tenant-demo:verify
npm run runtime:verify
npm run erp:verify
npm run typecheck
npm run lint
npm run build
npm run public:mirror-manifest
```

---

## Remaining gaps (M4C+)

- Persisted invite rows with token, expiry, cancel
- Crow/Resend transactional invite email
- Self-service accept link (`pending_acceptance` → `active`)
- `cancelTenantMembershipInviteAction` with safe membership revoke policy
- Entra group mapping (`future_entra_mapping` source stub in contract)

---

## Recommended next phase

1. **M4C** — Tenant invite acceptance token + email delivery  
2. **M3.6** — Purchase-to-stock UX refinement  
3. **M3.4B** — Approved workflow persistence migration
