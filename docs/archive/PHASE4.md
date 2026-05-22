# Phase 4 — CEM identity & tenant membership

**Status:** Done · **Snapshot:** [`PLATFORM_STATUS.md`](PLATFORM_STATUS.md)

Phase 4 turns provisioned tenants into usable organizations: structure, users, roles, and Supabase access grants.

## Delivered

| Area | What changed |
|------|----------------|
| **TenantMembership** | Prisma model linking `supabaseUserId` ↔ `tenantId` |
| **CEM seed on go-live** | Discovery departments, branches, roles, workflows → tenant tables; primary contact → Profile |
| **Default RBAC** | Tenant Admin, Manager, Employee + permissions when discovery has no roles |
| **Tenant identity services** | All reads scoped by `tenantId` |
| **CEM UI** | `/[tenant]/users`, `/roles`, `/departments`, `/workflows` — real data |
| **Grant access** | Admin tenant detail form + `npm run auth:grant-tenant` |

## Database migration

After pulling Phase 4 code:

```powershell
cd d:\CYBERCROW
npx prisma db push
npx prisma generate
```

## Backfill existing tenants

Smoke tenants created before Phase 4 have no CEM rows until seeded:

```powershell
npm run cem:backfill-seed
```

## Grant a user tenant access

User must exist in **Supabase → Authentication → Users**.

**UI:** `/admin/tenants/[id]` → Grant tenant access form

**CLI:**

```powershell
$env:TENANT_SLUG="e2e-smoke-mpcr3bfa-mpcr3bfa"
$env:USER_EMAIL="mkkzero@gmail.com"
$env:TENANT_ROLE="tenant_admin"
npm run auth:grant-tenant
```

This updates `tenant_memberships` and Supabase `app_metadata` (`crow_role`, `tenant_slugs`).

## New tenant flow (automatic)

1. Complete discovery (departments, roles, workflows optional but recommended)
2. Approve blueprint & go-live
3. Pipeline runs `seedTenantCemFromDiscovery`
4. Platform admin grants themselves or customer users via admin tenant page

## Verify

1. `npm run cem:backfill-seed` on existing tenant
2. Open `/{slug}/users` — see primary contact profile
3. Open `/{slug}/departments` — see discovery structure
4. Grant a second user → sign in as them → access `/{slug}/dashboard`

## Next (Phase 5+)

See [`PHASE5.md`](PHASE5.md) and [`ROADMAP.md`](ROADMAP.md):

- SAREA studio sub-pages (in progress)
- HR / CRM tenant-scoped CRUD
- Invite-by-email
- Billing, notifications, `prisma migrate` (Phase 6)
