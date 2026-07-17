# FTGP 0G — IMPLEMENTER Grant Execution

**Phase:** FTGP.0G  
**Date:** 2026-06-22  
**Branch:** `feat/first-tenant-golden-path`  
**Verdict:** `PASSED — FIRST AUTHORITATIVE IMPLEMENTER GRANTED AND VERIFIED`

---

## 1. Scope

One audited `IMPLEMENTER` grant on shared Supabase `wbwnsndcxrgyqwppurms` (fingerprint `0355c17692e2a90d`), granted by the verified `PLATFORM_ADMIN` from FTGP.0F.4.

**Authorized:** preflight, single grant, audit event, runtime verification, documentation, feature-branch commits.

**Not authorized:** additional internal roles, Platform Admin changes, customer/tenant authority, Auth metadata, migrations, Production promotion, merge to `main`.

---

## 2. Grant entrypoint

```bash
npm run ftgp-implementer-grant:execute
```

Audited service: `grantFtgpImplementerRole()` in `src/lib/platform/ftgp-implementer-grant.ts`.

| Field | Value |
|-------|-------|
| Candidate fingerprint | `f82bef0cddd75238` |
| Grantor fingerprint | `b3ee2ec185cf9893` |
| Role | `IMPLEMENTER` |
| Source | `platform_admin_grant` |
| Reason | `INITIAL_FTGP_IMPLEMENTER_OPERATOR` |
| Correlation ID | `ftgp-first-implementer-5d7f9ab4-e5ab-4573-843c-f8259b937fd0` |

Target selected by immutable `PlatformAccount.id` in `.env.ftgp-implementer-grant.operator` only.

---

## 3. Preflight (pre-grant)

```text
IMPLEMENTER_TARGET_ELIGIBLE=PASS
IMPLEMENTER_GRANT_DRY_RUN=PASS
IMPLEMENTER_GRANT_WRITES_EXECUTED=false
Active PLATFORM_ADMIN = 1
Active IMPLEMENTER = 0
Active internal assignments total = 1
IMPLEMENTER_GRANTOR_AUTHORITY=PLATFORM_ADMIN_DATABASE_ASSIGNMENT
```

Implementation audit: `IMPLEMENTER_GRANT_FAIL_CLOSED=PASS`, `IMPLEMENTER_GRANT_IDEMPOTENT=PASS`, `IMPLEMENTER_GRANT_AUDITED=PASS`, `AUTOMATIC_IMPLEMENTER_GRANT=false`.

---

## 4. Execution result

```text
IMPLEMENTER_ASSIGNMENT_CREATED=PASS
ACTIVE_IMPLEMENTER_COUNT=1
ACTIVE_PLATFORM_ADMIN_COUNT=1
UNAUTHORIZED_INTERNAL_ASSIGNMENT_COUNT=0
IMPLEMENTER_GRANT_AUDIT_EVENT_DELTA=1
IMPLEMENTER_GRANT_WRITES_EXECUTED=true
```

Assignment fingerprint (opaque): `8701cae1b309823a`  
Idempotent re-invocation: `IMPLEMENTER_GRANT_IDEMPOTENCY=PASS`, `EXPECTED_SECOND_EXECUTION_DELTA=0`.

---

## 5. Authority deltas

| Delta | Result |
|-------|--------|
| PLATFORM_ADMIN assignment | 0 |
| Customer authority | 0 |
| Tenant authority | 0 |
| Request ownership | 0 |
| Auth metadata | 0 |

Business counts preserved: `implementation_requests=7`, `tenant_memberships=3`, `client_organization_members=0`, `platform_provider_identities=4`.

Final internal authority: `PLATFORM_ADMIN=1`, `IMPLEMENTER=1`, total active internal assignments `2`.

---

## 6. Runtime authority

```text
IMPLEMENTER_RUNTIME_AUTHORITY=PASS
IMPLEMENTER_AUTHORITY_SOURCE=DATABASE_INTERNAL_ROLE_ASSIGNMENT
PLATFORM_ADMIN_ONLY_CAPABILITIES=DENIED
IMPLEMENTER_CUSTOMER_AUTHORITY=DENIED
IMPLEMENTER_TENANT_AUTHORITY=DENIED
```

Implementation workspace permissions (`platform.requests.manage`, `platform.admin.view`) resolve from database assignment; metadata alone does not authorize.

---

## 7. Negative boundaries (preserved)

| Identity | Internal roles | Notes |
|----------|---------------|-------|
| Platform Admin | 1 × `PLATFORM_ADMIN` | unchanged |
| Retained requester | 0 | ownership-based customer access only |
| Candidate IMPLEMENTER | 1 × `IMPLEMENTER` | no customer/tenant authority |

```text
METADATA_ONLY_CLIENT_AUTHORITY=DENIED
METADATA_ONLY_INTERNAL_AUTHORITY=DENIED
METADATA_ONLY_TENANT_AUTHORITY=DENIED
```

---

## 8. Security re-verification

Full gate suite via `npm run cloud-1h-preview:verify`: Preview protection **PASS**, Data API containment **PASS**, typecheck/lint/build **PASS**.

Post-grant expected internal assignment count: `FTGP_EXPECTED_ACTIVE_INTERNAL_ASSIGNMENTS=2`.

---

## 9. Manifest status (gitignored)

`.ftgp-implementer-grant-manifest` records execution succeeded, `grantExecuted: true`, assignment and audit verified.

---

## 10. Rollback readiness

`IMPLEMENTER_ROLLBACK_RUNBOOK=READY` — revoke via `revokeInternalPlatformRole` by active Platform Admin; not executed after successful proof.

---

## Related

- `FTGP_0F2_PLATFORM_ADMIN_BOOTSTRAP_EXECUTION.md`
- `scripts/ftgp-implementer-grant-execute.ts`
- `scripts/verify-ftgp-implementer-grant-idempotency.ts`
- `scripts/verify-ftgp-implementer-runtime-authority.ts`
