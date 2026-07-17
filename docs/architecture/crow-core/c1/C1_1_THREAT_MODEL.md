# C1.1 — Blueprint Persistence Threat Model

**Scope:** Enterprise Blueprint Studio persistence architecture (C2 target)  
**Method:** STRIDE + tenant isolation review  
**Status:** Pre-migration — mitigations are design requirements for C2

---

## Assets

| Asset | Sensitivity |
|-------|-------------|
| Blueprint version snapshots | High — architecture + security design |
| ROI assumptions & snapshots | High — commercial |
| SOW versions | High — contractual advisory content |
| Approval evidence | Critical — audit/compliance |
| Trace events | High — forensic chain |
| Client-safe projections | Medium — still confidential |

---

## Threat catalog

| ID | Threat | STRIDE | Likelihood | Impact | Mitigation (C2) |
|----|--------|--------|------------|--------|----------------|
| T1 | Cross-tenant IDOR via blueprintId | I | High (current list unscoped) | Critical | Mandatory `tenantId` on all queries; fix `listEnterpriseBlueprints` |
| T2 | Unauthorized Blueprint read by client | I | Medium | High | Server-side client-safe projection |
| T3 | ROI/SOW leakage to wrong tenant | I | Medium | Critical | FK chain to tenant-scoped blueprint; integration tests |
| T4 | Client sees internal security material | I | Medium | Critical | Projection deny-list; no raw snapshot to client |
| T5 | Auditor mutates approved version | T | Low | Critical | Immutable approved rows; auditor_readonly role |
| T6 | Sales overrides security controls | E | Medium | High | Deny security slice edit for sales; no override permission |
| T7 | Approval spoofing (fake approver) | S | Medium | Critical | Bind to authenticated session; `BlueprintApproval` with assurance level |
| T8 | Version tampering post-approval | T | Medium | Critical | DB + service immutability; hash mismatch detection |
| T9 | Actor impersonation | S | Medium | High | Use server session identity only; never trust client actorId |
| T10 | AI recorded as human approver | S | Medium | High | `actorType` required; AI blocked from approve mutations |
| T11 | Trace deletion | T | Medium | High | Append-only service; no DELETE on trace; archive only |
| T12 | Hash replacement | T | Low | Critical | Approval stores hash at decision; recalc on read detects drift |
| T13 | Concurrent approval race | E | Medium | High | Transaction + expected hash + version status lock |
| T14 | Stale-version approval | E | Medium | Critical | Approve requires `pending_review` + matching `contentHash` |
| T15 | Malicious JSON payloads | D | Medium | Medium | Zod/JSON schema validation; depth/size limits |
| T16 | Oversized snapshots DoS | D | Medium | Medium | 2 MB cap; reject at API |
| T17 | Cross-tenant FK via requestId | I | Medium | Critical | Validate request belongs to same tenant as blueprint |
| T18 | Indirect reference via discoveryId | I | Medium | High | Join validation on discovery → request → tenant |
| T19 | SOW regen overwrites manual edits | T | High (if not persisted) | High | Section provenance + lock flags |
| T20 | Mass export / enumeration | I | Low | Medium | Rate limits (C2+); pagination; auth on list |
| T21 | Trace flooding | D | Low | Medium | Pagination; per-tenant rate limit; alert thresholds |
| T22 | Configuration proposal → runtime deploy | E | Low | Critical | C0 invariant: proposal ≠ deployment (preserve) |

---

## Trust boundaries

```text
[Browser Client] ──HTTPS──▶ [Next.js Server Actions]
                              │
                    ┌─────────┴─────────┐
                    │ Auth session      │
                    │ Tenant scope      │
                    │ Role matrix       │
                    │ Snapshot validate │
                    └─────────┬─────────┘
                              ▼
                    [PostgreSQL via Prisma]
                    - EnterpriseBlueprint (identity)
                    - EnterpriseBlueprintVersion (snapshots)
                    - BlueprintApproval (evidence)
                    - BlueprintTraceEvent (append-only)
                    - RoiSnapshot / SowVersion
```

**Assurance boundary:** Database does not enforce append-only trace or approved-row immutability without triggers/RLS — **service layer + C2 integration tests** required. Document honestly in ops runbook.

---

## Hash threat notes

SHA-256 content hash proves **normalized snapshot integrity** at hash time. It does **not** prove:

- Legal signature or non-repudiation without PKI/digital signature phase
- Human intent without approval evidence row
- External counsel review of SOW

---

## AI-specific threats

| Risk | Control |
|------|---------|
| AI-generated slice presented as human-authored | Trace `actorType: ai`; UI disclosure |
| AI approves on behalf of user | Block `actorType: ai` on approve |
| AI hallucination in SOW/ROI persisted as fact | Advisory labels; assumption `source` + `confidence` |

---

## Residual risks (accept with monitoring)

1. **Insider platform_admin** — full access by design; audit trace + approval evidence.
2. **DBA direct SQL** — outside app threat model; legal hold + backup controls.
3. **JWT/session theft** — standard session hygiene; short TTL; MFA for approvers (future).

---

## Security test plan (C2)

- [ ] Cross-tenant read/write integration tests per blueprintId
- [ ] Client projection fuzz (no internal field leakage)
- [ ] Approve stale hash rejection
- [ ] Concurrent save conflict (409)
- [ ] SOW regen preserves locked sections
- [ ] AI actor cannot call approve mutation
