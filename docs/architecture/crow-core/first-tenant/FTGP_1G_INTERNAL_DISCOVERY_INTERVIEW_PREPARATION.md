# FTGP 1G — Internal Discovery Interview Preparation

**Phase:** FTGP.1G  
**Date:** 2026-06-23  
**Branch:** `feat/first-tenant-golden-path`  
**PR:** `#10` (draft, unmerged)  
**Production:** unchanged  
**Verdict:** `READY — INTERNAL DISCOVERY INTERVIEW PREPARED; AUTHENTICATED CLIENT OWNER PROOF REQUIRED BEFORE ANSWER CAPTURE`

---

## 1. Scope

Internal Discovery interview preparation, question-catalog audit, answer-provenance enforcement, owner-session proof gate, zero-write dry runs, and separate future mutation manifests. **No hosted Discovery writes** — no client answers, IMPLEMENTER observations, completion, Blueprint, tenant, memberships, Auth metadata, or role changes.

---

## 2. Question catalog

| Field | Value |
|-------|-------|
| Catalog version | `ftgp-first-tenant-discovery-v1.0.0` |
| Total groups | `17` |
| Required groups (for completion) | `14` |
| Optional groups (for completion) | `3` |
| Required questions | `17` |
| Optional questions | `13` |
| Total questions | `30` |

### Group reconciliation (1F → 1G)

FTGP.1F listed **16** groups with constraints/risks/timeline folded into optional tail groups. FTGP.1G promotes **constraints, risks, budget, and timeline** to a distinct **group 17** without duplicating company-size fields (`employeeBand` remains in group 05; `goLiveTarget`, `constraintsAndRisks`, and `notes` anchor group 17).

All seventeen groups are present in the catalog; optional-vs-required applies at **group completion weight** and **per-question** `required` flags, not catalog presence.

### Stable keys and versioning

```text
DISCOVERY_QUESTION_KEYS_STABLE=PASS
DISCOVERY_QUESTION_VERSIONING=PASS
DISCOVERY_REQUIRED_OPTIONAL_CLASSIFICATION=PASS
DISCOVERY_SENSITIVE_DATA_CLASSIFICATION=PASS
```

Source: `src/lib/ftgp/ftgp-discovery-question-catalog.ts`

---

## 3. Answer provenance model

| Canonical type | Write provenance | Section | Actor |
|----------------|------------------|---------|-------|
| `CLIENT_PROVIDED` | `client_owner` | `client_discovery` | Client owner session |
| `IMPLEMENTER_OBSERVATION` | `implementer_internal` | `implementer_discovery` | IMPLEMENTER |
| `SYSTEM_DERIVED` | `system_derived` | `org_intelligence`, etc. | Audited services |
| `SYSTEM_LIFECYCLE_MARKER` | `system_derived` | `ftgp_lifecycle_audit` | Transition plumbing |

```text
DISCOVERY_ANSWER_PROVENANCE_MODEL=PASS
DISCOVERY_CLIENT_INTERNAL_CONTENT_SEPARATION=PASS
SYSTEM_MARKERS_SATISFY_CLIENT_REQUIREMENTS=false
```

Enforcement in `planDiscoveryAnswerWrite()`:

- Internal-role actors cannot create `CLIENT_PROVIDED` answers (`internal_actor_cannot_client_provide`).
- `owner_browser_proof_required` when `CLIENT_OWNER_PROOF_REQUIRED_FOR_ANSWER_CAPTURE=true`.
- Catalog `questionVersion` and provenance/actor alignment required.
- Provenance stored immutably in answer `valueJson` with actor and timestamp.

---

## 4. System-marker namespace isolation

Reserved sections: `ftgp_lifecycle_audit`, `org_intelligence`, and `ftgp_*` prefixes.

```text
SYSTEM_MARKER_NAMESPACE_RESERVED=PASS
SYSTEM_MARKERS_EXCLUDED_FROM_CLIENT_COMPLETION=PASS
SYSTEM_MARKERS_CLIENT_EDITABLE=false
```

Existing markers (unchanged):

| Section | Key | Role |
|---------|-----|------|
| `ftgp_lifecycle_audit` | `procrow_review_transition` | Lifecycle audit |
| `org_intelligence` | `sectorTemplateKey` | System-derived sector |

---

## 5. Client-owner access boundary

Routes: `/client/requests/[requestId]/discovery` gated by `requireClientAccess`; request scope via `clientCanAccessRequestAuthoritative`.

```text
DISCOVERY_OWNER_REQUEST_SCOPE=PASS
DISCOVERY_OWNER_UNRELATED_REQUEST_ACCESS=DENIED
DISCOVERY_OWNER_INTERNAL_NOTES_ACCESS=DENIED
DISCOVERY_OWNER_LIFECYCLE_MUTATION=DENIED
DISCOVERY_OWNER_TENANT_AUTHORITY=DENIED
```

---

## 6. Owner authentication proof

```text
CANDIDATE_07_OWNER_AUTHENTICATED_CLIENT_PROOF=UNAVAILABLE
CLIENT_OWNER_PROOF_REQUIRED_FOR_ANSWER_CAPTURE=true
```

Artifact-backed proof gate: [FTGP_1H_CLIENT_OWNER_BROWSER_PROOF.md](./FTGP_1H_CLIENT_OWNER_BROWSER_PROOF.md) (`ftgp-client-owner-browser-proof:execute` / `:verify`).

---

## 7. Answer-write and completion boundaries

```text
DISCOVERY_ANSWER_WRITE_FAIL_CLOSED=PASS
DISCOVERY_ANSWER_WRITE_AUDITED=PASS
DISCOVERY_ANSWER_WRITE_IDEMPOTENT=PASS
AUTOMATIC_DISCOVERY_COMPLETION=false
DISCOVERY_COMPLETION_RULES_EXPLICIT=PASS
DISCOVERY_AUTO_COMPLETION_ON_SAVE=false
DISCOVERY_COMPLETION_REQUIRES_CLIENT_PROOF=true
DISCOVERY_COMPLETION_AUTHORIZED=false
```

---

## 8. Internal role boundaries

### IMPLEMENTER

```text
IMPLEMENTER_DISCOVERY_PREPARATION_ACCESS=PASS
IMPLEMENTER_DISCOVERY_PREPARATION_READ_ONLY=true
IMPLEMENTER_CLIENT_IMPERSONATION=DENIED
IMPLEMENTER_PLATFORM_ADMIN_ONLY_CONTROLS=DENIED
IMPLEMENTER_CAN_CREATE_CLIENT_PROVIDED_ANSWER=false
IMPLEMENTER_OBSERVATION_CAPTURE_AUTHORIZED=false
```

### Platform Admin

```text
PLATFORM_ADMIN_DISCOVERY_OVERSIGHT=PASS
PLATFORM_ADMIN_CLIENT_IMPERSONATION=DENIED
PLATFORM_ADMIN_CAN_CREATE_CLIENT_PROVIDED_ANSWER=false
PLATFORM_ADMIN_ACTIVE_ROLE_COUNT=1
```

---

## 9. Zero-write session dry run

```text
DISCOVERY_SESSION_DRY_RUN=PASS
DISCOVERY_WRITES_EXECUTED=false
CLIENT_ANSWER_CAPTURE_AUTHORIZED=false
```

---

## 10. Operator artifacts (gitignored)

| Artifact | Purpose |
|----------|---------|
| `.ftgp-discovery-interview-plan.local.json` | Facilitator packet — no real answers |
| `.ftgp-discovery-client-answer-manifest` | Future single client-answer template |
| `.ftgp-discovery-implementer-observation-manifest` | Future single observation template |

All manifests: `Execution authorized: false`, `Writes executed: false`.

Generate: `npm run ftgp-discovery-interview-packet:generate`

---

## 11. FTGP.1D contract preservation

```text
FTGP_1D_CONTRACT_DEFECT_DOCUMENTED=true
DISCOVERY_SHELL_ROLLBACK_REQUIRED=false
FUTURE_TRANSITION_TEMPLATES_INCLUDE_ATOMIC_SHELL=true
```

Logical vs physical row accounting unchanged from FTGP.1E §6.

---

## 12. Hosted state preservation

Post-1G verification — unchanged from FTGP.1E baseline:

| Metric | Value |
|--------|-------|
| Candidate 07 status | `UNDER_DISCOVERY` |
| Owner fingerprint | `876863fe8c15c5c3` |
| DiscoveryProfile count | `1` (`IN_PROGRESS`) |
| System markers | `2` |
| Client-provided answers | `0` |
| Blueprints | `0` |
| Tenants | `0` |

```text
HOSTED_BUSINESS_STATE_UNCHANGED=true
```

---

## 13. Gate commands

```bash
npm run ftgp-discovery-shell:analyze
npm run ftgp-discovery-invariant:audit
npm run ftgp-discovery-question-catalog:audit
npm run ftgp-discovery-answer-write:audit
npm run ftgp-discovery-completion:audit
npm run ftgp-discovery-readiness:test
npm run ftgp-discovery-interview-preparation:test
npm run ftgp-discovery-interview-preparation:verify
npm run ftgp-discovery-owner-proof:verify
npm run ftgp-discovery-session:dry-run
npm run ftgp-discovery-interview-packet:generate
```

---

## 14. Next authorization

1. Obtain **authenticated client owner browser proof** (`CANDIDATE_07_OWNER_AUTHENTICATED_CLIENT_PROOF=PASS`).
2. Authorize **first client answer capture** via `.ftgp-discovery-client-answer-manifest` (single question, single `CLIENT_PROVIDED` row).
3. Keep IMPLEMENTER observations on separate manifest — never combine mutation types.
4. PR `#10` remains draft; Production unchanged.
