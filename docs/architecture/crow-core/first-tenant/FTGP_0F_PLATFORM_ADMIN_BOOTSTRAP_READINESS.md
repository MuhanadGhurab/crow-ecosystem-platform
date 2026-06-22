# FTGP 0F — Platform Admin Bootstrap Readiness (CLOUD.1H)

**Phase:** CLOUD.1H  
**Date:** 2026-06-22  
**Branch:** `feat/first-tenant-golden-path`  
**Verdict:** `BLOCKED — DEDICATED PLATFORM ADMIN TARGET REQUIRED`

---

## 1. Scope

Read-only verification and bootstrap **preparation** on protected Vercel Preview against shared Supabase `wbwnsndcxrgyqwppurms` (fingerprint `0355c17692e2a90d`).

**Authorized:** protected access proof, session separation proof, implementation audit, zero-write dry-run plan (when target is unambiguous), security gate re-run.

**Not authorized:** bootstrap execute, internal role grant, migrations, Production changes, merge to `main`.

---

## 2. Protected Preview access

| Check | Result |
|-------|--------|
| Unauthenticated HTTP | **401** on Preview hosts |
| `PREVIEW_REMAINS_PUBLICLY_BLOCKED` | **PASS** |
| Operator `npx vercel curl` | **PASS** (`VERCEL_PROTECTED_BROWSER_ACCESS`) |
| `x-vercel-protection-bypass` | **Not used** (redirect loops under Vercel Authentication) |

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
| Active internal role assignments | 0 |
| Internal-role grant audit events | 0 |

No grant audit event created during CLOUD.1H. Aggregate counts unchanged pre/post.

---

## 4. Authenticated session proof

Operator path: `C3_MANUAL_BROWSER_SESSION_CERTIFIED=true` (no cookies stored in repo).

| Session | Result |
|---------|--------|
| Retained Google requester | Post-auth `/account`; internal/tenant authority **denied**; role-neutral |
| Candidate IMPLEMENTER operator (pre-grant) | Post-auth `/account`; internal/tenant authority **denied**; no automatic assignment |
| Cross-account leakage | **ABSENT** |
| Identity resolution | **PASS** |

Automated Playwright path remains available when `C3_CANDIDATE_OPERATOR_FIXTURE_PASSWORD` is set and operator certification is absent.

---

## 5. Dedicated Platform Admin target

```text
DEDICATED_PLATFORM_ADMIN_TARGET=AMBIGUOUS
```

Resolution found **more than one** eligible `PlatformAccount` after excluding:

- retained proof requester
- pre-grant IMPLEMENTER candidate operator

Eligibility criteria: `ACTIVE`, onboarding generation ≥ 2, email verified, mandatory legal acceptances (≥ 3), zero implementation requests / client org / tenant memberships / active internal roles, ≥ 1 `platform_provider_identity`.

**Operator action required:** designate exactly one immutable `PlatformAccount.id` via `PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID` after product-owner disambiguation. Re-run `npm run cloud-1h-preview:verify` or `npm run ftgp-platform-admin-bootstrap:dry-run` once status is `READY`.

Bootstrap dry-run (§10) was **skipped** because target was not `READY`.

---

## 6. Bootstrap implementation audit

```text
FIRST_ADMIN_BOOTSTRAP_FAIL_CLOSED=PASS
FIRST_ADMIN_BOOTSTRAP_IDEMPOTENT=PASS
FIRST_ADMIN_BOOTSTRAP_AUDITED=PASS
AUTOMATIC_BOOTSTRAP_ON_DEPLOY=false
```

Verifier: `npm run ftgp-bootstrap-implementation:audit`

Authoritative path: `platform_internal_role_assignments` + `grantInternalPlatformRole` / `revokeInternalPlatformRole`. Legacy `scripts/bootstrap-platform-admin.ts` (Supabase metadata only) is **not** the FTGP execute path.

Execute gates remain disabled (`executeAuthorized: false`).

---

## 7. Bootstrap dry-run (zero writes)

When `DEDICATED_PLATFORM_ADMIN_TARGET=READY`:

```bash
npm run ftgp-platform-admin-bootstrap:dry-run
```

Expect:

```text
PLATFORM_ADMIN_BOOTSTRAP_DRY_RUN=PASS
BOOTSTRAP_WRITES_EXECUTED=false
```

Validates target ≠ requester ≠ candidate, assignment table empty, plan allowed, expected role `PLATFORM_ADMIN`, expected post-execute active assignments = 1, expected grant audit delta = 1.

---

## 8. Rollback procedure (design only — not executed)

If a future authorized bootstrap grant must be reversed:

1. **Revoke assignment** — call `revokeInternalPlatformRole` with operator `platformAccountId`, target assignment id, and `revokedByPlatformAccountId` (grantor or designated revoker).
2. **State transition** — assignment `status`: `ACTIVE` → `REVOKED`; set `revokedAt`, `revokedByPlatformAccountId`.
3. **Audit** — expect `platform_internal_role_revoked` audit event with correlation provenance.
4. **Verify** — `countActivePlatformAdmins()` returns 0; authoritative guards deny `/admin` for former grantee.
5. **No Auth metadata mutation** — do not rely on Supabase `app_metadata` for authority; FTGP table is source of truth.

Re-grant after revoke requires a new authorized bootstrap execute with fresh correlation id (idempotent re-grant only when no conflicting ACTIVE row exists).

---

## 9. Security gates (§12)

Re-run via `npm run cloud-1h-preview:verify` includes:

`cloud-1g-preview:verify`, `cloud-1e-post-apply:verify`, `cloud-data-api-containment:verify`, `cloud-containment-smoke:verify`, `ftgp-authority-boundaries:test`, `c3-role-neutral-onboarding:test`, `c3-legacy-metadata-authorization:verify`, `c3-account:verify`, `c3-auth-convergence:verify`, `c3-10j:preserved-identity:verify`, `c2-database-isolation:verify`, `ftgp-bootstrap-implementation:audit`, `typecheck`, `lint`, `build`.

---

## 10. Explicit non-actions

CLOUD.1H did **not**:

- execute Platform Admin bootstrap
- insert into `platform_internal_role_assignments`
- change Vercel Production alias or promote Preview
- apply migrations or mutate legacy users
- store session cookies or bypass secrets in git

---

## Related

- `docs/architecture/cloud/CROW_PREVIEW_PROTECTION_AND_ALIAS_RECONCILIATION.md`
- `scripts/verify-cloud-1h-protected-authenticated-session.ts`
- `scripts/verify-ftgp-platform-admin-bootstrap-dry-run.ts`
- `scripts/verify-ftgp-bootstrap-implementation-audit.ts`
- `src/lib/platform/platform-internal-role-bootstrap.ts`
- `src/lib/auth/platform-internal-role.service.ts`
