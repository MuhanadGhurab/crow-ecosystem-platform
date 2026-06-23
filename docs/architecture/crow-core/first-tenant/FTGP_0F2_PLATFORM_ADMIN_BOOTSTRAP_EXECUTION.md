# FTGP 0F.2 — Platform Admin Bootstrap Execution

**Phase:** FTGP.0F.4  
**Date:** 2026-06-22  
**Branch:** `feat/first-tenant-golden-path`  
**Verdict:** `PASSED — FIRST AUTHORITATIVE PLATFORM ADMIN BOOTSTRAPPED AND VERIFIED`

---

## 1. Scope

One-time audited `PLATFORM_ADMIN` bootstrap on shared Supabase `wbwnsndcxrgyqwppurms` (fingerprint `0355c17692e2a90d`) via the designated immutable target in `.env.platform-bootstrap.operator`.

**Authorized:** preflight, single grant, audit event, post-execution verification, documentation, feature-branch commits.

**Not authorized:** second Platform Admin, additional internal roles beyond documented FTGP path, customer/tenant authority, Auth metadata changes, migrations, Production promotion, merge to `main`.

IMPLEMENTER grant completed in FTGP.0G — see `FTGP_0G_IMPLEMENTER_GRANT_EXECUTION.md`.

---

## 2. Execution entrypoint

```bash
npm run ftgp-platform-admin-bootstrap:execute
```

Audited service: `grantInitialPlatformAdminBootstrap()` in `src/lib/platform/platform-internal-role-bootstrap-grant.ts`.

| Field | Value |
|-------|-------|
| Target fingerprint | `b3ee2ec185cf9893` |
| Selected label | `FTGP-PA-CANDIDATE-02` |
| Role | `PLATFORM_ADMIN` |
| Source | `initial_system_bootstrap` |
| Reason | initial authoritative Crow platform-owner bootstrap |
| Correlation ID | `ftgp-first-platform-admin-abac3f9b-9032-4412-a0c5-6f6f786e3312` |

---

## 3. Preflight (pre-execute)

```text
DEDICATED_PLATFORM_ADMIN_TARGET=READY
PLATFORM_ADMIN_BOOTSTRAP_DRY_RUN=PASS
BOOTSTRAP_WRITES_EXECUTED=false
active internal assignments = 0
```

Implementation audit: `FIRST_ADMIN_BOOTSTRAP_FAIL_CLOSED=PASS`, `FIRST_ADMIN_BOOTSTRAP_IDEMPOTENT=PASS`, `FIRST_ADMIN_BOOTSTRAP_AUDITED=PASS`, `AUTOMATIC_BOOTSTRAP_ON_DEPLOY=false`.

---

## 4. Execution result

```text
PLATFORM_ADMIN_ASSIGNMENT_CREATED=PASS
ACTIVE_PLATFORM_ADMIN_COUNT=1
UNAUTHORIZED_INTERNAL_ASSIGNMENT_COUNT=0
GRANT_AUDIT_EVENT_DELTA=1
BOOTSTRAP_WRITES_EXECUTED=true
```

Assignment fingerprint (opaque): `53a4b334ed8278f6`  
Idempotent re-invocation: `PLATFORM_ADMIN_BOOTSTRAP_IDEMPOTENCY=PASS`, `EXPECTED_SECOND_EXECUTION_DELTA=0`.

---

## 5. Authority deltas

| Delta | Result |
|-------|--------|
| Customer authority | 0 |
| Tenant authority | 0 |
| Request ownership | 0 |
| `ClientOrganizationMember` | 0 |
| `TenantMembership` | 0 |
| Auth metadata | 0 |
| Legal acceptance | 0 |

Business counts preserved: `implementation_requests=7`, `tenant_memberships=3`, `client_organization_members=0`, `platform_provider_identities=4`.

---

## 6. Runtime authority (protected Preview)

```text
PLATFORM_ADMIN_RUNTIME_AUTHORITY=PASS
PLATFORM_ADMIN_ADMIN_ROUTE_ACCESS=PASS
PLATFORM_ADMIN_AUTHORITY_SOURCE=DATABASE_INTERNAL_ROLE_ASSIGNMENT
```

Designated account uses Google OAuth (`C3_GOOGLE_PROOF_EMAIL` matches operator-certified session). `/admin` access corroborated via database assignment + permission surface; no additional assignment created during login.

---

## 7. Negative authority (preserved)

| Identity | Internal roles | /admin | Notes |
|----------|---------------|--------|-------|
| Retained requester | 0 | denied | ownership-based customer access unchanged |
| Candidate IMPLEMENTER | 0 | denied | metadata non-authoritative |

```text
METADATA_ONLY_CLIENT_AUTHORITY=DENIED
METADATA_ONLY_INTERNAL_AUTHORITY=DENIED
METADATA_ONLY_TENANT_AUTHORITY=DENIED
```

---

## 8. Security re-verification

Full gate suite via `npm run cloud-1h-preview:verify`: Preview protection **PASS**, Data API containment **PASS**, typecheck/lint/build **PASS**.

Post-bootstrap expected internal assignment count: `FTGP_EXPECTED_ACTIVE_INTERNAL_ASSIGNMENTS=1`.

---

## 9. Manifest status (gitignored)

`.ftgp-platform-admin-bootstrap-manifest` records:

```text
Execution authorized: true
Execution attempted: true
Execution succeeded: true
Grant executed: true
Assignment verified: true
Audit event verified: true
Active PLATFORM_ADMIN count: 1
Rollback executed: false
```

---

## 10. Rollback readiness

Rollback **not** executed. Revocation path remains `revokeInternalPlatformRole` with audit preservation.

---

## Related

- `FTGP_0F_PLATFORM_ADMIN_BOOTSTRAP_READINESS.md`
- `FTGP_0F1_PLATFORM_ADMIN_TARGET_DESIGNATION.md`
- `scripts/ftgp-platform-admin-bootstrap-execute.ts`
- `scripts/verify-ftgp-platform-admin-bootstrap-idempotency.ts`
- `scripts/verify-ftgp-platform-admin-runtime-authority.ts`
