# FTGP 1A — Request Selection and Review Readiness

**Phase:** FTGP.1A  
**Date:** 2026-06-23  
**Branch:** `feat/first-tenant-golden-path`  
**Hosted database fingerprint:** `0355c17692e2a90d`  
**Protected Preview:** `dpl_28xNJNkpdHPX7qyUVZXZqKupQEq2`  
**Verdict:** `BLOCKED — OPERATOR MUST DESIGNATE EXACTLY ONE IMPLEMENTATION REQUEST` (superseded by FTGP.1B — see [FTGP_1B_FIRST_REQUEST_DESIGNATION.md](./FTGP_1B_FIRST_REQUEST_DESIGNATION.md))

> **FTGP.1B correction:** After hardening proof-requester resolution, `ELIGIBLE_FIRST_REQUEST_COUNT=0`. The sole `PENDING_REVIEW` request (`FTGP-REQUEST-CANDIDATE-07`, fingerprint `9439dd8cc806696e`) is **not** owned by the retained C3 proof requester. Operator designation of that request is blocked by `REQUEST_OWNER_COLLISION=true`.

---

## 1. Scope

Read-only merge-readiness audit, request inventory, boundary verification, ProCrow review transition implementation audit, and zero-write dry-run. No hosted business-state mutation, no merge, no Production promotion.

**Authorized:** Draft PR, candidate matrix (gitignored), transition service and verifiers, documentation, feature-branch commits.

**Not authorized:** merge, Production deploy, request status change, Discovery, Blueprint, tenant provisioning, role grants, migrations, Legal v1.1 publication.

---

## 2. Pre-task hosted baseline

| Metric | Value |
|--------|-------|
| `implementation_requests` | 7 |
| `tenant_memberships` | 3 |
| `platform_accounts` | 11 |
| `client_organization_members` | 0 |
| `platform_provider_identities` | 4 |
| Active `PLATFORM_ADMIN` assignments | 1 (fingerprint `b3ee2ec185cf9893`) |
| Active `IMPLEMENTER` assignments | 1 (fingerprint `f82bef0cddd75238`) |
| Active internal assignments total | 2 |
| Other active internal roles | 0 |
| Internal role grant audit events | 2 |
| Legal acceptances | 33 |
| Migration inventory (CLOUD.1E) | 23 applied, 0 failed, 0 pending |

### Request status distribution

| Status | Count |
|--------|-------|
| `GO_LIVE` | 2 |
| `REJECTED` | 1 |
| `BLUEPRINT_BUILD` | 3 |
| `PENDING_REVIEW` | 1 |

---

## 3. Request candidate matrix

Operator-local file: `.ftgp-first-request-candidates.local.json` (gitignored, untracked).

| Label | Fingerprint | Status | Eligibility |
|-------|-------------|--------|-------------|
| FTGP-REQUEST-CANDIDATE-01 | `71acd2759d78b661` | `GO_LIVE` | rejected |
| FTGP-REQUEST-CANDIDATE-02 | `4764720633cc35c7` | `REJECTED` | rejected |
| FTGP-REQUEST-CANDIDATE-03 | `0b009c10ac8dcbf4` | `GO_LIVE` | rejected |
| FTGP-REQUEST-CANDIDATE-04 | `bd688c1334d8b42b` | `BLUEPRINT_BUILD` | rejected |
| FTGP-REQUEST-CANDIDATE-05 | `9f82f88d4a7607a3` | `BLUEPRINT_BUILD` | rejected |
| FTGP-REQUEST-CANDIDATE-06 | `89aaff9d0d1eb632` | `BLUEPRINT_BUILD` | rejected |
| FTGP-REQUEST-CANDIDATE-07 | `9439dd8cc806696e` | `PENDING_REVIEW` | rejected (owner is not retained requester) |

```text
ELIGIBLE_FIRST_REQUEST_COUNT=0
REQUEST_SELECTION_MODE=EXPLICIT_IMMUTABLE_REQUEST_ID
EXPLICIT_REQUEST_DESIGNATED=false
```

The sole eligible candidate has owner fingerprint `876863fe8c15c5c3`, owner lifecycle `ACTIVE`, owner legal state `current`, no tenant, no Discovery, no Blueprint, no pricing proposal.

**Operator action required:** create gitignored `.env.ftgp-first-request.operator`:

```env
FTGP_FIRST_REQUEST_ID=<immutable request ID for FTGP-REQUEST-CANDIDATE-07>
FTGP_FIRST_REQUEST_PURPOSE=FIRST_TENANT_GOLDEN_PATH
```

Do not use email, company name, row order, or timestamps as selectors.

---

## 4. Eligibility rules (authoritative)

A request is eligible only when all hold:

- Owner is the retained requester with authoritative `submittedByUserId`
- Owner `PlatformAccount` is `ACTIVE` with current legal acceptance
- Status is exactly `PENDING_REVIEW` (pre–ProCrow review gate)
- Not archived or cancelled (`REJECTED` excluded)
- No tenant link
- No completed Discovery
- No approved Blueprint or non-`DRAFT` proposal
- Not already in `UNDER_DISCOVERY` or later lifecycle stage

**Lifecycle transition (when authorized):** `PENDING_REVIEW` → `UNDER_DISCOVERY` via `transitionImplementationRequestToProCrowReview()` with actor permission `platform.requests.manage` (IMPLEMENTER or equivalent internal role from database assignment).

---

## 5. Boundary verification

### Requester (retained Google requester)

| Check | Result |
|-------|--------|
| `REQUESTER_OWN_REQUEST_ACCESS` | PASS |
| `REQUESTER_UNRELATED_REQUEST_ACCESS` | DENIED (ownership-scoped) |
| `REQUESTER_INTERNAL_REVIEW_AUTHORITY` | DENIED |
| `REQUESTER_TENANT_AUTHORITY` | DENIED |

Protected Preview browser proof (CLOUD.1H): post-auth landing `/account`, role-neutral, internal and tenant authority denied.

### IMPLEMENTER

| Check | Result |
|-------|--------|
| `IMPLEMENTER_REQUEST_REVIEW_ACCESS` | PASS |
| Authority source | `DATABASE_INTERNAL_ROLE_ASSIGNMENT` |
| `IMPLEMENTER_PLATFORM_ADMIN_ONLY_AUTHORITY` | DENIED |
| `IMPLEMENTER_ROLE_MANAGEMENT_AUTHORITY` | DENIED |
| `IMPLEMENTER_TENANT_AUTHORITY` | DENIED |

### Platform Admin

| Check | Result |
|-------|--------|
| `PLATFORM_ADMIN_AUTHORITY_PRESERVED` | PASS |
| `PLATFORM_ADMIN_ACTIVE_ROLE_COUNT` | 1 |

Metadata-only client, internal, and tenant authority: DENIED.

---

## 6. ProCrow review transition implementation

Service: `src/lib/ftgp/ftgp-procrow-review-transition.service.ts`

| Audit | Result |
|-------|--------|
| `PROCROW_REVIEW_TRANSITION_FAIL_CLOSED` | PASS |
| `PROCROW_REVIEW_TRANSITION_IDEMPOTENT` | PASS |
| `PROCROW_REVIEW_TRANSITION_AUDITED` | PASS |
| `AUTOMATIC_REQUEST_TRANSITION` | false |

Properties: explicit request ID and actor ID, database role resolution, transaction with conditional status check, correlation-based idempotency, lifecycle audit in `ftgp_lifecycle_audit` / `procrow_review_transition`, no Auth metadata mutation, no tenant or client membership creation.

---

## 7. Zero-write dry-run

```bash
npm run ftgp-request-review-transition:dry-run
```

```text
PROCROW_REVIEW_TRANSITION_DRY_RUN=BLOCKED
REQUEST_TRANSITION_WRITES_EXECUTED=false
reason: OPERATOR MUST DESIGNATE EXACTLY ONE IMPLEMENTATION REQUEST
```

After operator designation, dry-run will verify eligibility and expected deltas without executing writes.

---

## 8. Authority and business-data preservation (post-task)

| Check | Result |
|-------|--------|
| Active `PLATFORM_ADMIN` | 1 |
| Active `IMPLEMENTER` | 1 |
| Other active internal roles | 0 |
| Retained requester internal roles | 0 |
| Grant/revoke audit delta | 0 |
| Request status changes | 0 |
| Customer/tenant membership delta | 0 |

---

## 9. Verification gates

| Gate | Result |
|------|--------|
| `cloud-1h-preview:verify` | PASS |
| `cloud-1g-preview:verify` | PASS |
| `cloud-1e-post-apply:verify` | PASS (23 applied / 0 failed / 0 pending) |
| `cloud-data-api-containment:verify` | PASS |
| `cloud-containment-smoke:verify` | PASS |
| `ftgp-authority-boundaries:test` | PASS |
| `ftgp-request-review-transition:test` | PASS |
| `ftgp-request-review-boundaries:verify` | PASS |
| `ftgp-procrow-review-transition:audit` | PASS |
| C3 / C2 verifiers | PASS |
| `typecheck` / `lint` | PASS |
| `build` | PASS (via CLOUD.1H orchestration; local runner may need heap headroom) |

`FTGP_EXPECTED_ACTIVE_INTERNAL_ASSIGNMENTS=2`

---

## 10. Shared Production-backend limitation

Preview and Production share Supabase `wbwnsndcxrgyqwppurms`. Schema and authority changes on the feature branch affect the shared hosted database when migrations or grants are applied; application code on Production (`dpl_8NeFiYQ4TSumt9kQSMGfv1WTiDM4`) does not yet include FTGP runtime paths until a separate Production deployment is authorized.

---

## 11. Next authorization

1. Operator designates `FTGP_FIRST_REQUEST_ID` for `FTGP-REQUEST-CANDIDATE-07` in `.env.ftgp-first-request.operator`.
2. Re-run `npm run ftgp-request-review-transition:dry-run` until `PROCROW_REVIEW_TRANSITION_DRY_RUN=PASS`.
3. Separate Production deployment and rollback plan approval before merging Draft PR to `main`.
