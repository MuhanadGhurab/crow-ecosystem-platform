# PROCROW personal owner-admin transfer

**Task:** PROCROW.ADMIN.1  
**Status:** Tooling prepared; transfer executes only after operator designation and authorization.

This document distinguishes **initial Platform Admin bootstrap** (FTGP.0F) from the **later personal owner-admin transfer** controlled by the gitignored operator file.

## Authority model

Runtime ProCrow authority comes only from `PlatformInternalRoleAssignment` (ACTIVE `PLATFORM_ADMIN`). The operator Gmail is **designation input only** for controlled grant tooling — never a runtime authorization mechanism.

Resolution chain:

```text
.env.procrow-owner-admin.operator (gitignored)
  → normalized verified Google email
  → unique Supabase Auth identity
  → unique active PlatformAccount
  → immutable account ID
  → target fingerprint (procrow-owner-admin-target:{accountId})
  → authoritative PlatformInternalRoleAssignment
```

Forbidden paths:

- Auth metadata / `crow_role`
- Email comparison in route guards
- Hard-coded email lists in source, docs, tests, or Git history
- Reading the operator file during normal application runtime

## Operator file

| File | Tracked | Purpose |
|------|---------|---------|
| `.env.procrow-owner-admin.operator` | No (gitignored) | Owner enters personal Gmail and transfer authorization |
| `.env.procrow-owner-admin.operator.example` | Yes | Safe template with no real email |

Required keys:

```text
PROCROW_OWNER_ADMIN_EMAIL=
PROCROW_OWNER_ADMIN_PROVIDER=google
PROCROW_OWNER_ADMIN_TRANSFER_AUTHORIZED=false
```

Set `PROCROW_OWNER_ADMIN_TRANSFER_AUTHORIZED=true` only when ready to dry-run or execute.

Designation artifact (gitignored): `.procrow-owner-admin-designation.local.json` — fingerprints and integrity hash only; no full Gmail, tokens, or session material.

## Commands

| Command | Writes | Requires |
|---------|--------|----------|
| `npm run procrow-owner-admin:designate` | Artifact only | Email filled; `TRANSFER_AUTHORIZED=false` |
| `npm run procrow-owner-admin:transfer:dry-run` | None | Valid designation; `TRANSFER_AUTHORIZED=true` |
| `npm run procrow-owner-admin:transfer:execute` | DB transfer | Dry-run preconditions; clean tree; feature branch |
| `npm run procrow-owner-admin:verify` | None | Hosted baseline |

## Target readiness

Before transfer, the designated account must:

- Sign in normally (Google) on the private certification or preview host
- Have an active `PlatformAccount`
- Have verified Google provider identity
- Have current mandatory legal acceptance

The target must **not** be:

- Candidate 07 owner (`876863fe8c15c5c3` fingerprint family)
- Retained C3 requester fixture (`faf26007ce4a55b9`)

## Single-admin invariant

After transfer:

```text
Active PLATFORM_ADMIN count = 1
Active PLATFORM_ADMIN fingerprint = designated owner-admin target
```

Transfer types:

- `IDEMPOTENT_NO_OP` — target is already the sole active Platform Admin (0 assignment mutations)
- `ATOMIC_SINGLE_ADMIN_TRANSFER` — grant target, then revoke previous (1 create, 1 soft revoke, 2 audit events)

Physical mutations (non–no-op transfer):

1. `PlatformInternalRoleAssignment` CREATE — target `PLATFORM_ADMIN` ACTIVE
2. `PlatformAccountAuditEvent` — `platform_internal_role_granted`
3. `PlatformInternalRoleAssignment` UPDATE — previous assignment REVOKED (history preserved)
4. `PlatformAccountAuditEvent` — `platform_internal_role_revoked`

Grant correlation ID: `procrow-owner-admin-transfer-authoritative-v1`

## Preservation

The transfer does **not**:

- Delete previous user or `PlatformAccount`
- Remove unrelated role assignments from either account
- Change `IMPLEMENTER`, tenant memberships, Candidate 07, Discovery, Blueprints, or Auth metadata

## Relationship to FTGP.0F bootstrap

| Phase | Mechanism | Correlation |
|-------|-----------|-------------|
| FTGP.0F initial bootstrap | `PLATFORM_INTERNAL_ROLE_BOOTSTRAP_*` operator env + self-grant | `ftgp-first-platform-admin-abac3f9b-...` |
| PROCROW.ADMIN.1 owner transfer | `.env.procrow-owner-admin.operator` + atomic transfer service | `procrow-owner-admin-transfer-authoritative-v1` |

Initial bootstrap establishes the first authoritative Platform Admin on the hosted database. Owner-admin transfer moves sole `PLATFORM_ADMIN` to the project owner's personal Gmail account without changing the authority model.

## Verification gates

- `npm run procrow-owner-admin:verify` — sole admin, IMPLEMENTER preserved, Candidate 07 unchanged
- `npm run procrow-owner-admin:transfer:test` — focused regression tests
- `npm run ftgp-platform-admin-runtime:verify` — route authority via role resolution (post-transfer)

## Manual actions

1. Enter personal Gmail in `.env.procrow-owner-admin.operator`
2. Complete normal Google login + legal acceptance if account does not exist
3. Run `designate`, then set `PROCROW_OWNER_ADMIN_TRANSFER_AUTHORIZED=true`
4. Run `transfer:dry-run`, then `transfer:execute`, then `verify`
