# M4 — Tenant Membership & Business Portal Access Hardening

## Access audit (Part 1)

### Source of tenant access truth

| Layer | Mechanism | Authoritative? |
|-------|-----------|----------------|
| Database | `TenantMembership` (`tenant_memberships`) via `membership.service` | **Primary** — ProCrow grant/sync writes DB + Supabase `app_metadata.tenant_slugs` |
| JWT metadata | `crow_role` + `tenant_slugs` in Supabase `app_metadata` | **Temporary fallback** when DB row missing; warned in decision |
| Middleware | `canAccessTenant(role, tenantSlugs, slug)` in `src/lib/supabase/middleware.ts` | First-line JWT check only |
| Layout guard | `requireTenantBusinessPortalAccess` → `resolveTenantBusinessPortalAccess` | **Authoritative** for `/[tenant]/*` |
| Workflow actions | `requireActionTenantPolicy` + `canUseWorkflowActions` | Server-side on mutations |

### Gaps closed in M4

- Client Portal users no longer treated as Business Portal eligible on `/access` or sync lite checks.
- Email-linked request reviewers (no `crow_role`) blocked from Business Portal.
- Access gateway builds actionable Business Portal cards only from **proven** slugs (`listTenantBusinessPortalSlugsForUser`).
- Blocked UX on `/access?reason=business_portal_blocked`.
- ProCrow tenant overview shows membership model status (DB vs metadata).

### Remaining gaps (documented, not blocking M4)

- Public header CTA (`portal-access-lite`) still uses sync `tenant_slugs` for single-portal routing — full DB proof requires async header path (future).
- Middleware remains JWT-only; layout + action guards are authoritative.
- Multi-tenant selector on `/access` lists multiple cards but no dedicated picker UX beyond labels.
- Entra ID group mapping not implemented (future).

## Membership model decision — **PATH A: existing schema**

`TenantMembership` already exists. **No M4B migration required.**

ProCrow **Grant Tenant Access** remains the safe membership assignment path.

## Contract (Part 2)

`src/lib/tenant/tenant-membership-contract.ts`

- Roles, statuses, access levels, sources
- `TenantBusinessPortalAccessDecision` with `canViewBusinessPortal`, `canUseWorkflowActions`, `blockedReason`, disclaimers

## Access decision service (Part 3)

`src/lib/services/tenant-membership-access.service.ts`

- `resolveTenantBusinessPortalAccess(user, tenantSlug)` — read-only
- `listTenantBusinessPortalSlugsForUser(user)` — for access gateway
- `buildTenantMembershipAccessSummaryForTenantId(tenantId)` — ProCrow preview

Rules enforced:

- Block `client` role
- Block email-only reviewers
- Block wrong tenant slug
- Platform staff → `operator_preview` when policy allows
- No auto-create membership, no platform_admin assignment, no email-domain match

## Route guard (Part 4)

`src/lib/auth/tenant-business-portal-guard.ts`

- `requireTenantBusinessPortalAccess(tenantSlug)`
- `src/app/[tenant]/layout.tsx` via `requireTenantAccess` delegation in `session.ts`

## Workflow action guards (Part 5)

`src/lib/auth/tenant-policy-guard.ts` returns `{ user, tenant, decision }`.

`cem.workflows.manage` requires `decision.canUseWorkflowActions`.

`src/lib/actions/cem-transaction-workflow.ts` uses `requireActionTenantPolicy`.

## Access gateway (Part 6)

`buildCrowAccessGatewaySnapshot` is **async** and uses proven slugs.

Client-only users see Business Portal as **unavailable** with explicit copy.

## Public header / landing (Part 7)

`portal-access-lite.ts` blocks client from sync Business Portal eligibility.

Post-login routing unchanged for multi-portal (`/access`); tenant employees without proven slug see pending Business Portal card.

## Blocked state (Part 8)

`src/components/tenant/tenant-access-blocked-panel.tsx` on `/access` when `reason=business_portal_blocked`.

## ProCrow preview (Part 9)

`AdminTenantMembershipAccessPanel` on `/admin/tenants/[tenantId]` overview tab.

## Verification (Part 10)

`npm run tenant-membership:verify`

Full suite per M4 acceptance (typecheck, lint, build, existing M3/L5 verifiers).

## Recommended next

- **M4B** — Tenant invite flow + metadata/DB reconciliation hardening (if needed)
- **M3.4B** — Approved workflow persistence migration
- **M3.5** — Purchase-to-stock manual smoke & demo script
