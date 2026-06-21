# FTGP.0B — Metadata-neutral authority foundation

## Identity versus authority

| Layer | Proves | Must not alone authorize |
|-------|--------|---------------------------|
| Supabase Auth session | External identity (OAuth / email) | Portal routes, request data, ProCrow |
| `PlatformAccount` | Crow lifecycle, legal, verification | Client portal, ProCrow mutations |
| Customer relationships | Request ownership, client org membership | ProCrow, tenant admin |
| `PlatformInternalRoleAssignment` | ProCrow internal operator authority | Client data, tenant runtime |

Supabase `app_metadata.crow_role` may remain for backward compatibility but is **non-authoritative**. Route guards resolve authority from the Crow database via `resolveAuthoritativeCrowAuth`.

## Customer ownership relationships

Authoritative client portal access requires one of:

- `ImplementationRequest.submittedByUserId = authenticated Supabase user id`
- Active `ClientOrganizationMember` linked to the request via `ClientOrganizationRequestLink`

Primary-contact email matching is **not** a final authorization source. A future controlled claim/reconciliation workflow may bind ownership with audit evidence.

Role-neutral ACTIVE accounts without customer relationships land on `/account`. `/client` and `/portal` redirect to `/account`.

## Internal platform roles

Model: `PlatformInternalRoleAssignment` (see migration `20260621120000_ftgp_platform_internal_role_assignment`).

| Enum | Maps to permission role |
|------|-------------------------|
| `PLATFORM_ADMIN` | `platform_admin` |
| `IMPLEMENTER` | `implementer` |
| `SALES` | `sales` |
| `AUDITOR_READONLY` | `auditor_readonly` |

At most one **ACTIVE** row per `(platformAccountId, role)` — enforced by partial unique index plus service-level idempotency on `grantCorrelationId`.

Grant/revoke audit events: `platform_internal_role_granted`, `platform_internal_role_revoked` on `PlatformAccountAuditEvent`.

## Tenant roles

Unchanged: `TenantMembership` + metadata tenant role slugs. Internal platform assignment does **not** create tenant membership.

## Middleware versus server guards

```
Middleware  → valid session? else /login
Layout/page → resolveAuthoritativeCrowAuth + require* guards
Server action → re-check permissions before mutation
```

Middleware must not read JWT `crow_role` for authorization (FTGP.0B).

## Permission matrix (FTGP request review)

| Role | Queue | Detail | Start discovery | Reject | Audit |
|------|-------|--------|-----------------|--------|-------|
| PLATFORM_ADMIN | Yes | Yes | Yes | Yes | Full |
| IMPLEMENTER | Yes | Yes | Yes | Yes | Relevant |
| SALES | Yes | Yes | No | No | Limited |
| AUDITOR_READONLY | No* | Read where authorized | No | No | Read |

\*Queue visibility follows `platform.admin.view` / nav permissions.

Least-privilege FTGP operator: **`IMPLEMENTER`**.

## Bootstrap model

First database-backed admin uses `platform-internal-role-bootstrap.ts` env gates:

- Disabled by default (`PLATFORM_INTERNAL_ROLE_BOOTSTRAP_ENABLED`)
- Explicit `PlatformAccount` id or fingerprint target
- No first-user-admin, no signup hook, no Production without separate authorization
- Execute remains blocked in FTGP.0B

## Migration classification

```
SHARED_DATABASE_MIGRATION
SECURITY_AUTHORITY_MODEL
CONTROLLED_APPLY_REQUIRED
PRODUCTION_COMPATIBILITY_REVIEW_REQUIRED
```

**Not applied** in FTGP.0B — review before controlled apply to shared hosted database.

## Legacy metadata reconciliation

Deferred. When authorized, compare stale metadata to authoritative rows; remove only proven non-authoritative keys; preserve legal evidence. See `scripts/lib/c3-google-proof-role-reconciliation.ts`.

## First operator assignment prerequisites

1. Controlled migration applied in target environment
2. Separate operator identity from retained customer requester
3. Operator `PlatformAccount` ACTIVE, legal complete, generation current
4. Authorized bootstrap or existing `PLATFORM_ADMIN` grantor
5. Database-backed `IMPLEMENTER` (or `PLATFORM_ADMIN` if required) via `grantInternalPlatformRole`

## Verification

```bash
npm run ftgp-authority-boundaries:test
```

Expected: `PASS — REQUESTER OWNERSHIP AND PROCROW AUTHORITY ARE DATABASE-BACKED AND METADATA-NEUTRAL`
