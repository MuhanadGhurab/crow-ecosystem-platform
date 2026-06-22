# FTGP 0F — Platform Admin Bootstrap Readiness (CLOUD.1H)

**Phase:** CLOUD.1H / FTGP.0F.4 (post-execute)  
**Date:** 2026-06-22  
**Branch:** `feat/first-tenant-golden-path`  
**Verdict:** `PASSED — FIRST AUTHORITATIVE PLATFORM ADMIN BOOTSTRAPPED AND VERIFIED`

See `FTGP_0F2_PLATFORM_ADMIN_BOOTSTRAP_EXECUTION.md` for execution record.

---

## 1. Scope

Read-only verification and bootstrap **preparation** on protected Vercel Preview against shared Supabase `wbwnsndcxrgyqwppurms` (fingerprint `0355c17692e2a90d`).

**Authorized:** protected access proof, session separation proof, implementation audit, zero-write dry-run, documentation.

**Not authorized:** second Platform Admin, IMPLEMENTER grant, migrations, Production changes, merge to `main`.

---

## 2. Protected Preview access

| Check | Result |
|-------|--------|
| Unauthenticated HTTP | **401** on Preview hosts |
| `PREVIEW_REMAINS_PUBLICLY_BLOCKED` | **PASS** |
| Operator `npx vercel curl` | **PASS** (`VERCEL_PROTECTED_BROWSER_ACCESS`) |
| `x-vercel-protection-bypass` | **Not used** |

Protected deployment: `dpl_28xNJNkpdHPX7qyUVZXZqKupQEq2`.

---

## 3. Database baseline (pre/post unchanged)

| Metric | Count |
|--------|------:|
| `implementation_requests` | 7 |
| `tenant_memberships` | 3 |
| `platform_accounts` | 11 |
| `client_organization_members` | 0 |
| `platform_provider_identities` | 4 |
| Active internal role assignments | 1 |
| Internal-role grant audit events | 1 |

No grant audit event created. Aggregate counts unchanged pre/post.

---

## 4. Authenticated session proof

| Session | Result |
|---------|--------|
| Retained Google requester | Post-auth `/account`; internal/tenant authority **denied**; role-neutral |
| Candidate IMPLEMENTER operator (pre-grant) | Post-auth `/account`; internal/tenant authority **denied** |
| Cross-account leakage | **ABSENT** |

---

## 5. Dedicated Platform Admin target

```text
DEDICATED_PLATFORM_ADMIN_TARGET=READY
SELECTED_CANDIDATE_LABEL=FTGP-PA-CANDIDATE-02
TARGET_LABEL=momoghurab
TARGET_FINGERPRINT=b3ee2ec185cf9893
TARGET_REQUESTER_COLLISION=false
TARGET_IMPLEMENTER_COLLISION=false
```

Operator designated immutable `PlatformAccount.id` via `.env.platform-bootstrap.operator`. Prior disposable-account designation (fingerprint `5ab2108ab5a1ba7a`) was rejected in FTGP.0F.2.

See `FTGP_0F1_PLATFORM_ADMIN_TARGET_DESIGNATION.md` for full eligibility and dry-run results.

---

## 6. Bootstrap implementation audit

```text
FIRST_ADMIN_BOOTSTRAP_FAIL_CLOSED=PASS
FIRST_ADMIN_BOOTSTRAP_IDEMPOTENT=PASS
FIRST_ADMIN_BOOTSTRAP_AUDITED=PASS
AUTOMATIC_BOOTSTRAP_ON_DEPLOY=false
```

Verifier: `npm run ftgp-bootstrap-implementation:audit`

Execute gates completed (`grantExecuted: true`). Post-bootstrap dry-run is idempotent (no second write).

---

## 7. Bootstrap dry-run / idempotency (post-execute)

```text
PLATFORM_ADMIN_BOOTSTRAP_DRY_RUN=PASS
BOOTSTRAP_WRITES_EXECUTED=true
INTERNAL_ASSIGNMENTS=1
PLATFORM_ADMIN_BOOTSTRAP_IDEMPOTENCY=PASS
EXPECTED_SECOND_EXECUTION_DELTA=0
```

---

## 8. Rollback procedure (design only — not executed)

1. Revoke via `revokeInternalPlatformRole` with correlation provenance.
2. Assignment `ACTIVE` → `REVOKED`; set `revokedAt`, `revokedByPlatformAccountId`.
3. One `platform_internal_role_revoked` audit event.
4. Verify zero active Platform Admin assignments.

Safer replacement: grant replacement → verify → revoke original.

---

## 9. Security gates

Re-run via `npm run cloud-1h-preview:verify` includes full FTGP/C3/C2 gate suite.

---

## 10. Explicit non-actions

No second bootstrap execute, no IMPLEMENTER grant, no Production promotion, no migrations, no session cookies in git.

---

## Related

- `docs/architecture/crow-core/first-tenant/FTGP_0F2_PLATFORM_ADMIN_BOOTSTRAP_EXECUTION.md`

- `docs/architecture/crow-core/first-tenant/FTGP_0F1_PLATFORM_ADMIN_TARGET_DESIGNATION.md`
- `docs/architecture/cloud/CROW_PREVIEW_PROTECTION_AND_ALIAS_RECONCILIATION.md`
- `scripts/list-ftgp-platform-admin-candidates.ts`
- `scripts/verify-ftgp-platform-admin-target-designation.ts`
- `scripts/verify-ftgp-platform-admin-bootstrap-dry-run.ts`
- `scripts/verify-ftgp-bootstrap-implementation-audit.ts`
