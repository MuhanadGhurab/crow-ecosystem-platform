# FTGP 1C — Request Ownership Provenance

**Phase:** FTGP.1C  
**Date:** 2026-06-23  
**Branch:** `feat/first-tenant-golden-path`  
**Verdict:** `READY — AUTHORITATIVE CLIENT OWNER VERIFIED; CANDIDATE 07 REVIEW TRANSITION MAY BE AUTHORIZED`

---

## 1. Architectural decision

The retained C3 proof requester (`faf26007ce4a55b9`) is an identity and role-neutrality **fixture**. It is not the required FTGP customer actor.

Corrected rule:

```text
The selected request must have one authoritative, eligible, explicitly designated client owner.
```

Not:

```text
The selected request must be owned by the retained C3 proof requester.
```

```text
FTGP_CLIENT_POLICY=EXPLICIT_AUTHORITATIVE_OWNER
C3_RETAINED_REQUESTER_FIXTURE_DECOUPLED=true
REQUEST_OWNERSHIP_ENFORCEMENT_WEAKENED=false
```

---

## 2. Candidate and owner fingerprints

| Field | Value |
|-------|-------|
| Request label | `FTGP-REQUEST-CANDIDATE-07` |
| Request fingerprint | `9439dd8cc806696e` |
| Owner fingerprint | `876863fe8c15c5c3` |
| Retained requester fingerprint | `faf26007ce4a55b9` |
| Retained requester owned requests | 0 |
| Owner differs from retained fixture | true (`REQUEST_OWNER_COLLISION_WITH_RETAINED_FIXTURE=true`) |
| `HOSTED_REQUEST_OWNERSHIP_CHANGED` | false |

---

## 3. Ownership provenance

**Classification:** `LEGITIMATE_AUTHORITATIVE_OWNER`

**Evidence summary (read-only):**

- `submittedByUserId` present on request at creation (authenticated intake path).
- Owner `PlatformAccount` links to the same `supabaseUserId` (consistent ownership chain).
- No duplicate PlatformAccounts for owner email.
- No foreign Google provider-identity collision.
- Owner not Platform Admin, IMPLEMENTER, or internal operator.
- Platform account materialized after request submission (C3 deferred account pattern); not treated as misattribution without convergence evidence.
- Eight platform-account audit events on owner (registration, activation, legal, provider linkage).

Operator artifact: `.ftgp-request-owner-provenance.local.json` (gitignored).

---

## 4. Owner eligibility

| Check | Result |
|-------|--------|
| `CANDIDATE_07_OWNER_CLIENT_ELIGIBLE` | PASS |
| Status | ACTIVE |
| Legal | current |
| Verified provider | true (google) |
| Active internal roles | 0 |
| Request ownership count | 1 |
| ClientOrganizationMember | 0 |
| TenantMembership | 0 |
| `OWNER_PLATFORM_ADMIN_COLLISION` | false |
| `OWNER_IMPLEMENTER_COLLISION` | false |
| `OWNER_TENANT_COLLISION` | false |

---

## 5. Explicit designation

| Mode | Value |
|------|-------|
| Request selection | `EXPLICIT_IMMUTABLE_REQUEST_ID` (`.env.ftgp-first-request.operator`) |
| Client selection | `EXPLICIT_IMMUTABLE_PLATFORM_ACCOUNT_ID` (`.env.ftgp-first-client.operator`) |
| `DESIGNATED_CLIENT_MATCHES_REQUEST_OWNER` | true |
| Execution authorized | false |

---

## 6. Protected Preview owner session

```text
CANDIDATE_07_OWNER_AUTHENTICATED_CLIENT_PROOF=UNAVAILABLE
CANDIDATE_07_OWNER_ACCESS_SOURCE=AUTHORITATIVE_REQUEST_OWNERSHIP
```

No authorized browser session exists for the designated client owner in operator env. Database-backed ownership and customer-access scoping were verified; impersonation and credential reset were not performed.

Recommend protected Preview owner-session proof before transition **execution** (separate authorization).

---

## 7. Transition readiness

| Gate | Result |
|------|--------|
| `FIRST_TENANT_REQUEST_TARGET` | READY |
| `PROCROW_REVIEW_ACTOR_ELIGIBLE` | PASS |
| `DESIGNATED_CLIENT_IMPLEMENTER_COLLISION` | false |
| `PROCROW_REVIEW_TRANSITION_DRY_RUN` | PASS |
| `REQUEST_TRANSITION_WRITES_EXECUTED` | false |
| `OWNERSHIP_RECONCILIATION_WRITES_EXECUTED` | false |

Intended transition: `PENDING_REVIEW` → `UNDER_DISCOVERY`  
Expected deltas on authorized execution: status +1, lifecycle audit +1; ownership/membership/Auth metadata 0.

`ELIGIBLE_FIRST_REQUEST_COUNT=1` under corrected client-owner policy.

---

## 8. Retained requester invariants (unchanged)

- Retained requester remains role-neutral.
- Retained requester owns zero requests.
- Unrelated-request access remains denied for retained requester fixture tests.

---

## 9. Hosted-state preservation

All read-only audits confirmed: 7 requests, Candidate 07 `PENDING_REVIEW`, owner fingerprint unchanged, internal assignments 2, no ownership or lifecycle mutations.

---

## 10. Next authorization

1. Optional: protected Preview authenticated session for owner fingerprint `876863fe8c15c5c3`.
2. Separate authorization for `transitionImplementationRequestToProCrowReview` execution (not merge, not Production).
3. PR #10 remains draft and unmerged.
