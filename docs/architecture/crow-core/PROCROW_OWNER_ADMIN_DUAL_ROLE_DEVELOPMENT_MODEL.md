# PROCROW owner-admin dual-role development model

**Task:** PROCROW.ADMIN.2A  
**Status:** CURRENT DEVELOPMENT-PHASE CONFIGURATION (owner-authorized)

This is **not** the mandatory future production staffing model. It documents the intentional temporary state where one designated personal account holds both `PLATFORM_ADMIN` and `IMPLEMENTER` during FTGP certification and ProCrow development.

## Owner authorization

The project owner explicitly authorizes:

| Role | Purpose |
|------|---------|
| `PLATFORM_ADMIN` | Platform ownership and ProCrow administrative authority |
| `IMPLEMENTER` | Governed implementation and tenant-build authority |

## Invariants

```text
Two separate PlatformInternalRoleAssignment rows
Two separate role enum values
Separate grant provenance (bootstrap / implementer grant / owner-admin transfer correlation IDs)
Separate audit events per grant
Independent revocation (revoking one ACTIVE assignment does not remove the other)
No automatic role inheritance
No role union in Auth metadata or crow_role
```

`pickHighestInternalCrowRole` returns `platform_admin` when both are active — this selects the **permission surface priority** for session resolution. It does **not** merge assignments or delete the independent `IMPLEMENTER` row.

## Active versus historical assignments

After PROCROW.ADMIN.2 owner-admin transfer:

| Metric | Expected |
|--------|----------|
| Total assignment rows | 3 |
| Active rows | 2 (`PLATFORM_ADMIN` + `IMPLEMENTER` on owner account) |
| Revoked rows | 1 (former bootstrap `PLATFORM_ADMIN`) |

Revoked history must remain in the database and must **not** be counted as active authority.

## Fingerprint schemes (not interchangeable)

| Scheme | Namespace | Represents |
|--------|-----------|------------|
| FTGP.0F bootstrap target | `ftgp-pa-target:{platformAccountId}` | Bootstrap manifest designation for immutable account ID |
| ProCrow owner-admin target | `procrow-owner-admin-target:{platformAccountId}` | Owner-admin transfer target account |
| ProCrow assignment | `procrow-pa-assignment:{assignmentId}` | Specific assignment row identity |
| Operator email | `procrow-owner-admin-email:{normalizedEmail}` | Designation input only (not runtime authority) |

Example reconciled values (post-transfer):

```text
Former bootstrap account — FTGP scheme: b3ee2ec185cf9893
Former bootstrap account — ProCrow scheme: 49fb3f94bcce3a93
Designated owner account — ProCrow scheme: 832287cbd374fb83
```

Do not compare fingerprints across schemes as if they were the same identity key.

## Authority separation tests

- `PLATFORM_ADMIN` alone does not include `IMPLEMENTER`
- `IMPLEMENTER` alone does not include `PLATFORM_ADMIN`
- Dual-role account includes both only because both ACTIVE rows exist
- Internal roles do not imply client ownership or tenant membership

## Browser proof

Private certification host only:

```bash
C3_PREVIEW_HEADED=true npm run procrow-owner-admin:browser-proof:execute
npm run procrow-owner-admin:browser-proof:verify
```

## Future separation

Moving `IMPLEMENTER` to a different human operator requires only:

1. Grant `IMPLEMENTER` to the new account (controlled operator tooling)
2. Revoke `IMPLEMENTER` on the owner account

No architectural change to the role model is required.
