# LINEAGE DECISION PROVENANCE AND REASON CODES

| Field | Value |
|-------|-------|
| **Document** | Lineage Decision Provenance and Reason Codes |
| **Gate** | GHV.CROW-IDENTITY.1C |
| **Starting HEAD** | `e098440661ba023a1e523a9cf7b4ae46e0533d27` |
| **Date** | 2026-07-23 |
| **Implementation authority** | **NONE** |
| **Status** | **LOCKED (design)** |

## Provenance record (every material decision)

| Field | Required |
|-------|----------|
| subject reference | Yes |
| Lineage ID (`CRW-*`) | Yes (when Lineage-scoped) |
| lifecycle type (Chosen / Suggested / Earned) | Yes |
| prior state | Yes |
| resulting state | Yes |
| taxonomy version | Yes |
| Evidence reference IDs | When applicable |
| Mastery reference IDs | When applicable |
| decision authority | Yes |
| reason code | Yes |
| timestamp | Yes |
| correlation / decision reference | Yes |
| review date | When applicable |
| appeal state | When applicable |
| correction reference | When applicable |
| public-projection consequence | Yes |

## Reason-code families

```text
CHOICE
SUGGESTION
EVIDENCE
MASTERY
FRESHNESS
INTEGRITY
TAXONOMY
CORRECTION
APPEAL
PRIVACY
PUBLIC_PROJECTION
```

## Representative reason codes (stable identifiers)

| Code | Family | Typical use |
|------|--------|-------------|
| `USER_SELECTED` | CHOICE | Chosen NONE→ACTIVE |
| `USER_CHANGED_SELECTION` | CHOICE | Chosen ACTIVE→ACTIVE other |
| `USER_WITHDREW_SELECTION` | CHOICE | Chosen → WITHDRAWN |
| `SYSTEM_SUGGESTED` | SUGGESTION | Suggestion GENERATED/PRESENTED |
| `USER_ACCEPTED_SUGGESTION_AS_CHOICE` | SUGGESTION | Suggestion → ACCEPTED_AS_CHOICE |
| `USER_DISMISSED_SUGGESTION` | SUGGESTION | Suggestion DISMISSED |
| `SUGGESTION_EXPIRED` | SUGGESTION | Suggestion EXPIRED |
| `EVIDENCE_INSUFFICIENT` | EVIDENCE | Earned blocked / denied |
| `EVIDENCE_PENDING` | EVIDENCE | Evidence building |
| `EVIDENCE_APPROVED` | EVIDENCE | Approved opaque reference attached |
| `EVIDENCE_REVOKED` | EVIDENCE | Evidence reference invalidated |
| `MASTERY_REQUIREMENT_NOT_MET` | MASTERY | Earned blocked |
| `MASTERY_REQUIREMENT_MET` | MASTERY | Coverage satisfied |
| `FRESHNESS_REVIEW_DUE` | FRESHNESS | → REVALIDATION_DUE |
| `FRESHNESS_LAPSED` | FRESHNESS | → LAPSED |
| `INTEGRITY_HOLD_OPENED` | INTEGRITY | → SUSPENDED |
| `INTEGRITY_HOLD_CLEARED` | INTEGRITY | Hold released |
| `TAXONOMY_RENAMED` | TAXONOMY | Label/history update |
| `TAXONOMY_DEPRECATED` | TAXONOMY | No new activation |
| `TAXONOMY_SUPERSEDED` | TAXONOMY | Mapping without auto-award |
| `DECISION_CORRECTED` | CORRECTION | Privileged correction |
| `APPEAL_OPENED` | APPEAL | → UNDER_APPEAL |
| `APPEAL_UPHELD` | APPEAL | Prior decision stands |
| `APPEAL_DENIED` | APPEAL | Challenge rejected |
| `PUBLIC_PROJECTION_ENABLED` | PUBLIC_PROJECTION | User opt-in |
| `PUBLIC_PROJECTION_DISABLED` | PUBLIC_PROJECTION | Opt-out / hold |

## Decision authority matrix

| Authority class | Role |
|-----------------|------|
| `USER` | Chosen selection/withdrawal; suggestion accept/dismiss; public opt-in/out |
| `RULE_EVALUATION` | Suggestion generation; earned **candidate** identification; freshness signalling |
| `QUALIFIED_REVIEWER` | Evidence-class review; earned activation when policy requires human review |
| `REVIEW_PANEL` | Complex/high-impact earned or integrity decisions |
| `PRIVILEGED_CORRECTION_AUTHORITY` | Corrections; certain suspensions/revocations |

| Decision type | Primary authority | Automation assist |
|---------------|-------------------|-------------------|
| Chosen | USER | May assist UX only |
| Suggested generate/expire | RULE_EVALUATION | Allowed |
| Suggested accept/dismiss | USER | N/A |
| Earned candidate | RULE_EVALUATION | Allowed |
| Earned activation | Governed decision per Evidence class / review policy (RULE_EVALUATION and/or QUALIFIED_REVIEWER / REVIEW_PANEL) | Assist; final authority governed |
| Suspension / revocation | QUALIFIED_REVIEWER / REVIEW_PANEL / PRIVILEGED_CORRECTION_AUTHORITY | Assist detection only |
| Correction | PRIVILEGED_CORRECTION_AUTHORITY | Assist |
| Appeal | Authority **independent** from original decision where practical | Assist |

Not every decision is fully automated. Not every decision requires a human panel.

## Public exposure

Internal reason codes are **not** all user-visible. Public copy uses sanitized state labels (see privacy policy).
