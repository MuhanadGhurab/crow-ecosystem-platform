# FTGP 1B — First Request Designation

**Phase:** FTGP.1B  
**Date:** 2026-06-23  
**Branch:** `feat/first-tenant-golden-path`  
**Verdict:** `SUPERSEDED — see FTGP.1C` ([FTGP_1B_FIRST_REQUEST_DESIGNATION.md](./FTGP_1B_FIRST_REQUEST_DESIGNATION.md))

> FTGP.1B blocked designation due to retained-requester coupling (since corrected in FTGP.1C). Owner fingerprint `876863fe8c15c5c3` is the legitimate authoritative client actor for Candidate 07.

---

## 1. Operator designation

| Field | Value |
|-------|-------|
| Selection mode | `EXPLICIT_IMMUTABLE_REQUEST_ID` |
| Candidate label | `FTGP-REQUEST-CANDIDATE-07` |
| Request fingerprint | `9439dd8cc806696e` |
| Purpose | `FIRST_TENANT_GOLDEN_PATH` |
| Operator env | `.env.ftgp-first-request.operator` (gitignored) |
| Execution authorized | false |

The immutable request ID is configured locally only. It is not recorded in committed documentation.

---

## 2. Target verification result

```bash
npm run ftgp-first-request-target:verify
```

```text
FIRST_TENANT_REQUEST_TARGET=BLOCKED
REQUEST_OWNER_COLLISION=true
reason: owner is not retained requester
```

### Selected request state (read-only)

| Check | Result |
|-------|--------|
| Request exists | true |
| Fingerprint | `9439dd8cc806696e` |
| Current status | `PENDING_REVIEW` |
| Intended target status | `UNDER_DISCOVERY` |
| Archived / cancelled | false |
| Tenant links | 0 |
| Completed Discovery | 0 |
| Approved Blueprint | 0 |
| Approved pricing/proposal | 0 |
| **Authoritative owner = retained C3 proof requester** | **false** |

### Collision matrix

| Flag | Result |
|------|--------|
| `REQUEST_OWNER_COLLISION` | **true** |
| `REQUEST_ALREADY_IN_REVIEW_OR_LATER` | false |
| `REQUEST_TENANT_COLLISION` | false |
| `REQUEST_DISCOVERY_COLLISION` | false |
| `REQUEST_BLUEPRINT_COLLISION` | false |
| `REQUEST_PRICING_COLLISION` | false |

### Corrected candidate inventory

After hardening owner resolution via `resolveProofRequesterPlatformAccount()`:

```text
ELIGIBLE_FIRST_REQUEST_COUNT=0
```

The retained C3 proof requester (`ACTIVE_GOOGLE_REQUESTER`, account fingerprint `faf26007ce4a55b9`) owns **zero** implementation requests. `FTGP-REQUEST-CANDIDATE-07` (owner fingerprint `876863fe8c15c5c3`) is the sole `PENDING_REVIEW` request but belongs to a different PlatformAccount.

FTGP.1A reported `ELIGIBLE_FIRST_REQUEST_COUNT=1` because the candidate list script did not resolve the proof requester when `C3_PRESERVED_DISPOSABLE_ACCOUNT_ID` was unset; owner comparison was skipped. FTGP.1B corrects this.

---

## 3. Transition dry-run

```bash
npm run ftgp-request-review-transition:dry-run
```

```text
PROCROW_REVIEW_TRANSITION_DRY_RUN=BLOCKED
REQUEST_TRANSITION_WRITES_EXECUTED=false
reason: request owner is not retained requester
```

No transition manifest was committed. Any prior local manifest from a pre-hardening dry run was removed.

---

## 4. Implementation audit (unchanged)

```text
PROCROW_REVIEW_TRANSITION_FAIL_CLOSED=PASS
PROCROW_REVIEW_TRANSITION_IDEMPOTENT=PASS
PROCROW_REVIEW_TRANSITION_AUDITED=PASS
AUTOMATIC_REQUEST_TRANSITION=false
```

Lifecycle model: `PENDING_REVIEW` → `UNDER_DISCOVERY` with one `ftgp_lifecycle_audit` / `procrow_review_transition` audit record on authorized execution.

---

## 5. Recovery runbook (prepared, not executed)

`PROCROW_REVIEW_TRANSITION_RECOVERY_RUNBOOK=READY`

Direct reversal from `UNDER_DISCOVERY` to `PENDING_REVIEW` is **not** part of the audited FTGP transition service. Recovery policy:

| Scenario | Policy |
|----------|--------|
| Erroneous transition | Controlled forward corrective transition by authorized IMPLEMENTER; do not delete audit history |
| Duplicate correlation | Idempotent re-invocation returns existing audit evidence without duplicate status change |
| Manual SQL status edits | **Forbidden** — breaks optimistic locking and audit chain |
| Actor permission | `platform.requests.manage` from database internal-role assignment only |

---

## 6. Authority and hosted state (unchanged)

| Metric | Value |
|--------|-------|
| Active `PLATFORM_ADMIN` | 1 |
| Active `IMPLEMENTER` | 1 |
| `implementation_requests` | 7 |
| Selected request status | `PENDING_REVIEW` (unchanged) |
| Grant/revoke audit delta | 0 |
| `HOSTED_BUSINESS_STATE_UNCHANGED` | true |

---

## 7. Draft PR and Production

- [PR #10](https://github.com/MuhanadGhurab/crow-ecosystem-platform/pull/10) remains **open, draft, unmerged**
- Production alias unchanged: `dpl_8NeFiYQ4TSumt9kQSMGfv1WTiDM4`
- Production deployment **not authorized**

---

## 8. Next authorization

FTGP.1C resolved owner policy; FTGP.1D executed the ProCrow review transition for Candidate 07 (`9439dd8cc806696e`). See `FTGP_1D_PROCROW_REVIEW_TRANSITION_EXECUTION.md`. Client owner browser proof remains pending. PR #10 remains draft and unmerged.
