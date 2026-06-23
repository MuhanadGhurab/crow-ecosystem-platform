# FTGP 1E — Discovery Shell Reconciliation

**Phase:** FTGP.1E  
**Date:** 2026-06-23  
**Branch:** `feat/first-tenant-golden-path`  
**Verdict:** `READY — DISCOVERY INITIALIZATION RECONCILED; INTERNAL INTERVIEW PREPARATION MAY PROCEED`

---

## 1. Scope

Read-only reconciliation of the FTGP.1D Discovery shell, invariant audit, answer-write boundary design, and zero-write session dry run. No hosted Discovery mutations.

---

## 2. Request and Discovery shell

| Field | Value |
|-------|-------|
| Request label | `FTGP-REQUEST-CANDIDATE-07` |
| Request fingerprint | `9439dd8cc806696e` |
| Owner fingerprint | `876863fe8c15c5c3` |
| Request status | `UNDER_DISCOVERY` |
| DiscoveryProfile fingerprint | `383de76e7e784e22` |
| Profile status | `IN_PROGRESS` |
| Profile created (UTC) | `2026-06-23T03:23:28.573Z` |
| Profile completedAt | `null` |
| Answer count | `2` (system markers only) |

---

## 3. Shell provenance

```text
DISCOVERY_SHELL_PROVENANCE=AUTHORIZED_ATOMIC_DISCOVERY_INITIALIZATION
```

Evidence:

- FTGP.1A–1C pre-transition dry runs reported `Discovery collision = false` and `pre_lifecycle_audit_events=0`.
- Profile `createdAt` aligns with FTGP.1D lifecycle audit `at` timestamp (`2026-06-23T03:23:28.820Z`).
- Transition correlation `ftgp-first-procrow-review-a9098cd7-3032-4082-b658-795aa50c7d77` present on lifecycle marker.
- `transitionImplementationRequestToProCrowReview()` upserts profile inside `prismaTransaction` with status update.

Not `PREEXISTING_DISCOVERY_SHELL` — no profile before authorized transition.

---

## 4. Lifecycle audit answer classification

| Answer fingerprint | Section | Key | Classification |
|--------------------|---------|-----|----------------|
| `ced8c4c4fe0b20f9` | `ftgp_lifecycle_audit` | `procrow_review_transition` | `SYSTEM_LIFECYCLE_MARKER` |
| `21f1a59446932fd2` | `org_intelligence` | `sectorTemplateKey` | `SYSTEM_LIFECYCLE_MARKER` |

```text
LIFECYCLE_AUDIT_ANSWER_CLASSIFICATION=SYSTEM_LIFECYCLE_MARKER
CLIENT_DISCOVERY_CONTENT_CAPTURED=false
```

Records are stored in `discovery_answers` but contain transition metadata and system-derived sector key only — no client free text.

---

## 5. UNDER_DISCOVERY invariant

```text
UNDER_DISCOVERY_PROFILE_INVARIANT=UNDER_DISCOVERY_REQUIRES_ONE_IN_PROGRESS_PROFILE
```

The audited transition service atomically sets request status and upserts exactly one `IN_PROGRESS` profile. Candidate 07: profile count `1`, duplicate profiles `0`.

---

## 6. FTGP.1D mutation contract reconciliation

| Metric | Value |
|--------|-------|
| Reviewed logical mutations | `2` (status + lifecycle audit event) |
| Actual DB row operations in transaction | `4` (status, profile upsert, lifecycle marker, sector template marker) |
| `FTGP_1D_SCOPE_MATCH` | `false` (authorization text said `0 Discovery records`; implementation requires atomic profile shell) |

**Contract defect:** Future authorization templates should state `+1 IN_PROGRESS DiscoveryProfile shell` and `+N system DiscoveryAnswer markers` when `UNDER_DISCOVERY_REQUIRES_ONE_IN_PROGRESS_PROFILE` is the domain invariant.

No rollback executed. Shell is required plumbing, not unauthorized client Discovery.

---

## 7. Transactional integrity

```text
REQUEST_STATUS_AND_DISCOVERY_SHELL_TRANSACTIONAL=true
PARTIAL_INITIALIZATION_RISK=ABSENT
DISCOVERY_INITIALIZATION_IDEMPOTENT=PASS
```

Status update, profile upsert, and audit markers share `prismaTransaction`. Idempotent re-transition returns without duplicate events.

---

## 8. Security

```text
DISCOVERY_PROFILE_DATA_API_EXPOSURE=BLOCKED
DISCOVERY_PROFILE_REQUEST_ISOLATION=PASS
DISCOVERY_PROFILE_AUTHORITY_DELTA=0
```

Server-authoritative paths only; `clientCanAccessRequest` scopes client portal; platform staff use permission matrix.

---

## 9. Answer-write service (prepared, not executed)

`planDiscoveryAnswerWrite()` / `writeDiscoveryAnswerAudited()` in `src/lib/ftgp/ftgp-discovery-answer-write.service.ts`:

```text
DISCOVERY_ANSWER_WRITE_FAIL_CLOSED=PASS
DISCOVERY_ANSWER_WRITE_AUDITED=PASS
DISCOVERY_ANSWER_WRITE_IDEMPOTENT=PASS
AUTOMATIC_DISCOVERY_COMPLETION=false
```

---

## 10. Zero-write session dry run

```bash
npm run ftgp-discovery-session:dry-run
```

```text
DISCOVERY_SESSION_DRY_RUN=PASS
DISCOVERY_WRITES_EXECUTED=false
CLIENT_ANSWER_CAPTURE_AUTHORIZED=false
DISCOVERY_COMPLETION_AUTHORIZED=false
```

---

## 11. Hosted-state preservation

```text
HOSTED_BUSINESS_STATE_UNCHANGED=true
implementation_requests=7
Candidate 07=UNDER_DISCOVERY
owner fingerprint unchanged
Active PLATFORM_ADMIN=1
Active IMPLEMENTER=1
```

Operator manifest: `.ftgp-discovery-readiness-manifest` (gitignored).

---

## 12. Merge and Production

PR #10 remains open, draft, unmerged. Production unchanged.

---

## 13. Next authorization

FTGP.1G completed internal interview preparation (catalog, provenance gates, zero-write dry runs). See [FTGP_1G_INTERNAL_DISCOVERY_INTERVIEW_PREPARATION.md](./FTGP_1G_INTERNAL_DISCOVERY_INTERVIEW_PREPARATION.md).

**Authenticated client owner browser proof** required before client answer capture or Discovery completion.

```text
FTGP_1D_CONTRACT_DEFECT_DOCUMENTED=true
DISCOVERY_SHELL_ROLLBACK_REQUIRED=false
FUTURE_TRANSITION_TEMPLATES_INCLUDE_ATOMIC_SHELL=true
```
