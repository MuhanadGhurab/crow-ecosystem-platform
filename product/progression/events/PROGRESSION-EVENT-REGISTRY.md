# Progression Event Registry

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-EVT-REG-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **TOTAL EVENT COUNT** | **53** |
| **Related** | [PROGRESSION-EVENT-VALIDITY.md](./PROGRESSION-EVENT-VALIDITY.md) · [../README.md](../README.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 (2026-07-21) — Initial ARCHITECTURE RECOMMENDED registry for GHV.PROGRESSION.1A |

## Purpose

Define the governed catalogue of **progression events** that may influence learner standing, recognition, Trust, titles, Prestige, seasons, and related progression systems.

This registry is **architecture only**. It does not define Product Code, numeric formulas, thresholds, award magnitudes, season lengths, or Mastery percentages.

```text
Only events listed here are eligible to enter progression processing.
Only events in VALID validation state may influence current standing
(see PROGRESSION-EVENT-VALIDITY.md).
```

---

## Field definitions (all events)

Every event definition uses these fields:

| Field | Meaning |
|-------|---------|
| **Event ID** | Stable identifier `EVT-PRG-xxx` |
| **Event name** | Canonical machine name |
| **Source system** | Originating domain system that emits the event |
| **Actor** | Who or what caused the event |
| **Subject** | Whose progression record the event concerns |
| **Source record** | Authoritative originating record type |
| **Timestamp** | When the event was recorded by the platform |
| **Effective timestamp** | When the event is considered to have occurred for progression ordering |
| **Validation state** | Lifecycle of acceptance for progression influence |
| **Reversibility** | Whether a governed reversal path exists |
| **Reversal event** | Event that undoes or supersedes current effect, if any |
| **Progression systems affected** | Conceptual systems that may react when VALID |
| **Prohibited effects** | Effects this event must never produce |
| **Audit requirement** | Whether durable audit trail is mandatory |
| **Idempotency requirement** | Duplicate handling expectation |
| **Privacy classification** | Sensitivity class for storage, display, and export |

### Shared vocabulary

**Validation states:** see [PROGRESSION-EVENT-VALIDITY.md](./PROGRESSION-EVENT-VALIDITY.md) — `RECEIVED`, `VALIDATING`, `VALID`, `REJECTED`, `REVERSED`, `SUPERSEDED`, `UNDER_INTEGRITY_REVIEW`.

**Privacy classes (qualitative):**

| Class | Use |
|-------|-----|
| `LEARNING_ACTIVITY` | Ordinary Mission / Stage / Route activity |
| `ASSESSMENT_SENSITIVE` | Assessment attempts and outcome labels |
| `EVIDENCE_CONTENT` | Evidence artifacts and review outcomes |
| `CAPSTONE_SENSITIVE` | Capstone submission and Route-Proven decisions |
| `COMMUNITY_MODERATION` | Community recognition, reports, moderation |
| `TEAM_OPERATIONAL` | Team contribution records |
| `LIVE_SKY_OPERATIONAL` | Live Sky flight and result records |
| `TRUST_RESTRICTED` | Trust signals, restrictions, assurance changes |
| `ADMINISTRATIVE_AUDIT` | Corrections, seasons, titles, Prestige administration |

**Progression systems (conceptual):** Flight XP recognition · Rank eligibility signals · Mastery eligibility signals · Route-Proven standing · Trust standing · Prestige standing · Title standing · Season participation · Remediation standing · Integrity hold state.

---

## Count by family

| Family | Count |
|--------|------:|
| Learning Activity | 7 |
| Assessment | 5 |
| Evidence | 8 |
| Capstone and Proven | 6 |
| Community | 6 |
| Team and Live Sky | 5 |
| Trust and Identity | 5 |
| Progression Administration | 11 |
| **TOTAL** | **53** |

---

## Index

| Event ID | Event name | Family |
|----------|------------|--------|
| EVT-PRG-001 | MISSION_STARTED | Learning Activity |
| EVT-PRG-002 | MISSION_RESUMED | Learning Activity |
| EVT-PRG-003 | MISSION_COMPLETED | Learning Activity |
| EVT-PRG-004 | MISSION_REMEDIATION_ASSIGNED | Learning Activity |
| EVT-PRG-005 | MISSION_REMEDIATION_COMPLETED | Learning Activity |
| EVT-PRG-006 | STAGE_COMPLETED | Learning Activity |
| EVT-PRG-007 | ROUTE_COMPLETED | Learning Activity |
| EVT-PRG-008 | ASSESSMENT_SUBMITTED | Assessment |
| EVT-PRG-009 | ASSESSMENT_STANDARD_MET | Assessment |
| EVT-PRG-010 | ASSESSMENT_STANDARD_NOT_YET_MET | Assessment |
| EVT-PRG-011 | ASSESSMENT_VOIDED | Assessment |
| EVT-PRG-012 | ASSESSMENT_INTEGRITY_REVIEWED | Assessment |
| EVT-PRG-013 | EVIDENCE_DRAFTED | Evidence |
| EVT-PRG-014 | EVIDENCE_SUBMITTED | Evidence |
| EVT-PRG-015 | EVIDENCE_REVISION_REQUESTED | Evidence |
| EVT-PRG-016 | EVIDENCE_APPROVED | Evidence |
| EVT-PRG-017 | EVIDENCE_NOT_APPROVED | Evidence |
| EVT-PRG-018 | EVIDENCE_REVOKED | Evidence |
| EVT-PRG-019 | EVIDENCE_RESTORED | Evidence |
| EVT-PRG-020 | EVIDENCE_APPEAL_RESOLVED | Evidence |
| EVT-PRG-021 | CAPSTONE_SUBMITTED | Capstone and Proven |
| EVT-PRG-022 | CAPSTONE_APPROVED | Capstone and Proven |
| EVT-PRG-023 | CAPSTONE_REVISION_REQUIRED | Capstone and Proven |
| EVT-PRG-024 | ROUTE_PROVEN_GRANTED | Capstone and Proven |
| EVT-PRG-025 | ROUTE_PROVEN_REEVALUATION_REQUIRED | Capstone and Proven |
| EVT-PRG-026 | ROUTE_PROVEN_RESTORED | Capstone and Proven |
| EVT-PRG-027 | COMMUNITY_CONTRIBUTION_RECOGNIZED | Community |
| EVT-PRG-028 | COMMUNITY_CONTRIBUTION_REVERSED | Community |
| EVT-PRG-029 | REPORT_CONFIRMED | Community |
| EVT-PRG-030 | REPORT_OVERTURNED | Community |
| EVT-PRG-031 | MODERATION_ACTION_APPLIED | Community |
| EVT-PRG-032 | MODERATION_ACTION_REVERSED | Community |
| EVT-PRG-033 | TEAM_CONTRIBUTION_APPROVED | Team and Live Sky |
| EVT-PRG-034 | TEAM_CONTRIBUTION_REVISED | Team and Live Sky |
| EVT-PRG-035 | LIVE_FLIGHT_COMPLETED | Team and Live Sky |
| EVT-PRG-036 | LIVE_RESULT_FINALIZED | Team and Live Sky |
| EVT-PRG-037 | LIVE_RESULT_REVOKED | Team and Live Sky |
| EVT-PRG-038 | TRUST_POSITIVE_SIGNAL | Trust and Identity |
| EVT-PRG-039 | TRUST_CONCERN_RECORDED | Trust and Identity |
| EVT-PRG-040 | TRUST_RESTRICTION_APPLIED | Trust and Identity |
| EVT-PRG-041 | TRUST_RESTRICTION_REMOVED | Trust and Identity |
| EVT-PRG-042 | ASSURANCE_LEVEL_CHANGED | Trust and Identity |
| EVT-PRG-043 | PROGRESSION_CORRECTION_APPLIED | Progression Administration |
| EVT-PRG-044 | PROGRESSION_CORRECTION_REVERSED | Progression Administration |
| EVT-PRG-045 | SEASON_OPENED | Progression Administration |
| EVT-PRG-046 | SEASON_CLOSED | Progression Administration |
| EVT-PRG-047 | TITLE_REVIEW_OPENED | Progression Administration |
| EVT-PRG-048 | TITLE_GRANTED | Progression Administration |
| EVT-PRG-049 | TITLE_REVOKED | Progression Administration |
| EVT-PRG-050 | PRESTIGE_REVIEW_OPENED | Progression Administration |
| EVT-PRG-051 | PRESTIGE_GRANTED | Progression Administration |
| EVT-PRG-052 | PRESTIGE_SUSPENDED | Progression Administration |
| EVT-PRG-053 | PRESTIGE_REVOKED | Progression Administration |

---

# Learning Activity

## EVT-PRG-001 — MISSION_STARTED

| Field | Value |
|-------|-------|
| **Source system** | Learning Mission runtime |
| **Actor** | Learner (authenticated) |
| **Subject** | Learner Mission attempt |
| **Source record** | Mission attempt / enrollment record |
| **Timestamp** | Recorded when start is accepted |
| **Effective timestamp** | Same as recorded unless late reconciliation applies |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID` or `REJECTED` |
| **Reversibility** | Not directly reversible; superseded by later Mission lifecycle events |
| **Reversal event** | None (supersession via later Mission events) |
| **Progression systems affected** | Activity presence; Season participation visibility (if applicable) |
| **Prohibited effects** | Must not grant Mastery, Route-Proven, Trust elevation, Prestige, titles, or commercial entitlement |
| **Audit requirement** | Required |
| **Idempotency requirement** | Duplicate start for same open attempt must not create double progression |
| **Privacy classification** | `LEARNING_ACTIVITY` |

## EVT-PRG-002 — MISSION_RESUMED

| Field | Value |
|-------|-------|
| **Source system** | Learning Mission runtime |
| **Actor** | Learner (authenticated) |
| **Subject** | Existing open Mission attempt |
| **Source record** | Mission attempt resume marker |
| **Timestamp** | Recorded when resume is accepted |
| **Effective timestamp** | Same as recorded unless late reconciliation applies |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID` or `REJECTED` |
| **Reversibility** | Not directly reversible |
| **Reversal event** | None |
| **Progression systems affected** | Activity continuity only |
| **Prohibited effects** | Must not treat resume as completion, Mastery, or awardable contribution |
| **Audit requirement** | Required |
| **Idempotency requirement** | Repeated resume signals for the same open attempt must not double-count |
| **Privacy classification** | `LEARNING_ACTIVITY` |

## EVT-PRG-003 — MISSION_COMPLETED

| Field | Value |
|-------|-------|
| **Source system** | Learning Mission runtime |
| **Actor** | Learning system (completion adjudication) |
| **Subject** | Learner Mission attempt |
| **Source record** | Mission completion record |
| **Timestamp** | Recorded when completion is accepted |
| **Effective timestamp** | Completion effective time (may differ if corrected) |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, or `UNDER_INTEGRITY_REVIEW` |
| **Reversibility** | Reversible via governed correction / integrity path |
| **Reversal event** | `PROGRESSION_CORRECTION_APPLIED` (and optional `PROGRESSION_CORRECTION_REVERSED`); integrity may void related outcomes |
| **Progression systems affected** | Flight XP recognition eligibility; Stage / Route completion prerequisites; remediation clearance signals |
| **Prohibited effects** | Must not alone grant Route-Proven, Prestige, titles, or paid entitlement |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same Mission attempt completion must process once for progression |
| **Privacy classification** | `LEARNING_ACTIVITY` |

## EVT-PRG-004 — MISSION_REMEDIATION_ASSIGNED

| Field | Value |
|-------|-------|
| **Source system** | Remediation / Learning integrity subsystem |
| **Actor** | System or authorized reviewer |
| **Subject** | Learner Mission or Stage remediation obligation |
| **Source record** | Remediation assignment record |
| **Timestamp** | Recorded when assignment is issued |
| **Effective timestamp** | Assignment effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID` or `REJECTED` |
| **Reversibility** | Reversible when assignment was erroneous |
| **Reversal event** | `PROGRESSION_CORRECTION_APPLIED` (clear erroneous assignment) |
| **Progression systems affected** | Remediation standing; may hold related completion claims until remediations clear |
| **Prohibited effects** | Must not permanently mark incompetence; must not revoke unrelated Route-Proven silently |
| **Audit requirement** | Required |
| **Idempotency requirement** | Duplicate assignment for the same obligation key must not create parallel remediations |
| **Privacy classification** | `LEARNING_ACTIVITY` |

## EVT-PRG-005 — MISSION_REMEDIATION_COMPLETED

| Field | Value |
|-------|-------|
| **Source system** | Remediation / Learning Mission runtime |
| **Actor** | Learner with system confirmation, or authorized reviewer |
| **Subject** | Open remediation obligation |
| **Source record** | Remediation completion record |
| **Timestamp** | Recorded when remediation is accepted complete |
| **Effective timestamp** | Completion effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, or `UNDER_INTEGRITY_REVIEW` |
| **Reversibility** | Reversible via correction if completion was invalid |
| **Reversal event** | `PROGRESSION_CORRECTION_APPLIED` |
| **Progression systems affected** | Remediation standing clearance; may unblock held completion effects |
| **Prohibited effects** | Must not invent Mastery beyond what the remediated Mission already allows |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same remediation obligation completion must process once |
| **Privacy classification** | `LEARNING_ACTIVITY` |

## EVT-PRG-006 — STAGE_COMPLETED

| Field | Value |
|-------|-------|
| **Source system** | Learning Stage aggregation |
| **Actor** | Learning system |
| **Subject** | Learner Stage progression record |
| **Source record** | Stage completion aggregate |
| **Timestamp** | Recorded when Stage criteria are satisfied under governed rules |
| **Effective timestamp** | Stage completion effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, or `UNDER_INTEGRITY_REVIEW` |
| **Reversibility** | Reversible if underlying Mission / Evidence basis is reversed |
| **Reversal event** | `PROGRESSION_CORRECTION_APPLIED`; may be superseded when basis events reverse |
| **Progression systems affected** | Flight XP recognition eligibility; Route completion prerequisites; Rank eligibility signals |
| **Prohibited effects** | Must not grant Route-Proven or commercial access |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same Stage for same learner season/context must complete once for progression |
| **Privacy classification** | `LEARNING_ACTIVITY` |

## EVT-PRG-007 — ROUTE_COMPLETED

| Field | Value |
|-------|-------|
| **Source system** | Learning Route aggregation |
| **Actor** | Learning system |
| **Subject** | Learner Route progression record |
| **Source record** | Route completion aggregate |
| **Timestamp** | Recorded when Route completion criteria are satisfied |
| **Effective timestamp** | Route completion effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, or `UNDER_INTEGRITY_REVIEW` |
| **Reversibility** | Reversible if underlying basis is reversed |
| **Reversal event** | `PROGRESSION_CORRECTION_APPLIED`; related Proven events remain separately governed |
| **Progression systems affected** | Flight XP recognition eligibility; Rank eligibility signals; Capstone readiness signals |
| **Prohibited effects** | Must not equate Route completion with Route-Proven; must not grant Prestige or titles alone |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same Route completion context must process once |
| **Privacy classification** | `LEARNING_ACTIVITY` |

---

# Assessment

## EVT-PRG-008 — ASSESSMENT_SUBMITTED

| Field | Value |
|-------|-------|
| **Source system** | Assessment service |
| **Actor** | Learner |
| **Subject** | Assessment attempt |
| **Source record** | Assessment submission record |
| **Timestamp** | Recorded on accepted submit |
| **Effective timestamp** | Submission time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, or `UNDER_INTEGRITY_REVIEW` |
| **Reversibility** | May be voided |
| **Reversal event** | `ASSESSMENT_VOIDED` |
| **Progression systems affected** | Assessment attempt standing only (pending outcome events) |
| **Prohibited effects** | Must not grant Mastery, Route-Proven, or Trust elevation from submit alone |
| **Audit requirement** | Required |
| **Idempotency requirement** | Duplicate submit for same attempt key must not create parallel attempts |
| **Privacy classification** | `ASSESSMENT_SENSITIVE` |

## EVT-PRG-009 — ASSESSMENT_STANDARD_MET

| Field | Value |
|-------|-------|
| **Source system** | Assessment adjudication |
| **Actor** | Assessment system or authorized adjudicator |
| **Subject** | Assessment attempt |
| **Source record** | Standard-met outcome record |
| **Timestamp** | Recorded when outcome is finalized as met |
| **Effective timestamp** | Outcome effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, `SUPERSEDED`, or `UNDER_INTEGRITY_REVIEW` |
| **Reversibility** | Voidable; may be superseded by integrity or correction |
| **Reversal event** | `ASSESSMENT_VOIDED`; integrity path via `ASSESSMENT_INTEGRITY_REVIEWED` |
| **Progression systems affected** | Mastery eligibility signals; Stage / Route prerequisite satisfaction; remediation clearance where assessment-gated |
| **Prohibited effects** | Must not rewrite commercial entitlement; must not silently become Route-Proven |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same attempt outcome must apply once |
| **Privacy classification** | `ASSESSMENT_SENSITIVE` |

## EVT-PRG-010 — ASSESSMENT_STANDARD_NOT_YET_MET

| Field | Value |
|-------|-------|
| **Source system** | Assessment adjudication |
| **Actor** | Assessment system or authorized adjudicator |
| **Subject** | Assessment attempt |
| **Source record** | Standard-not-yet-met outcome record |
| **Timestamp** | Recorded when outcome is finalized as not yet met |
| **Effective timestamp** | Outcome effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, `SUPERSEDED`, or `UNDER_INTEGRITY_REVIEW` |
| **Reversibility** | Voidable; may be superseded by later valid attempt or correction |
| **Reversal event** | `ASSESSMENT_VOIDED`; later valid `ASSESSMENT_STANDARD_MET` may supersede standing effect |
| **Progression systems affected** | May open remediation standing; holds Mastery claims dependent on this assessment |
| **Prohibited effects** | Must not permanently bar the learner; must not apply punitive Prestige or Trust penalties by itself |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same attempt outcome must apply once |
| **Privacy classification** | `ASSESSMENT_SENSITIVE` |

## EVT-PRG-011 — ASSESSMENT_VOIDED

| Field | Value |
|-------|-------|
| **Source system** | Assessment governance |
| **Actor** | Authorized adjudicator or integrity authority |
| **Subject** | Prior assessment attempt / outcome |
| **Source record** | Assessment void record with reason |
| **Timestamp** | Recorded when void is accepted |
| **Effective timestamp** | Void effective time (may align to original attempt for standing recalculation) |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID` or `REJECTED`; marks prior related events `REVERSED` or `SUPERSEDED` as governed |
| **Reversibility** | Further correction only via progression correction path |
| **Reversal event** | `PROGRESSION_CORRECTION_APPLIED` / `PROGRESSION_CORRECTION_REVERSED` if void itself was erroneous |
| **Progression systems affected** | Removes or holds effects of voided assessment outcomes |
| **Prohibited effects** | Must not delete audit history of the voided attempt |
| **Audit requirement** | Required with reason |
| **Idempotency requirement** | Void of same attempt must apply once |
| **Privacy classification** | `ASSESSMENT_SENSITIVE` |

## EVT-PRG-012 — ASSESSMENT_INTEGRITY_REVIEWED

| Field | Value |
|-------|-------|
| **Source system** | Assessment integrity review |
| **Actor** | Integrity reviewer / authority |
| **Subject** | Assessment attempt under review |
| **Source record** | Integrity review decision record |
| **Timestamp** | Recorded when review decision is filed |
| **Effective timestamp** | Decision effective time |
| **Validation state** | May move related events into / out of `UNDER_INTEGRITY_REVIEW`; outcome must not silently become permanent standing without explicit VALID outcome events |
| **Reversibility** | Decision may be superseded by later governed review |
| **Reversal event** | Later integrity decision or `PROGRESSION_CORRECTION_APPLIED` |
| **Progression systems affected** | Integrity hold state; may authorize voiding or restoration paths |
| **Prohibited effects** | Must not silently produce permanent Mastery, Rank, Route-Proven, Prestige, or title standing |
| **Audit requirement** | Required with rationale |
| **Idempotency requirement** | Concurrent reviews for same attempt must resolve to a single authoritative decision chain |
| **Privacy classification** | `ASSESSMENT_SENSITIVE` |

---

# Evidence

## EVT-PRG-013 — EVIDENCE_DRAFTED

| Field | Value |
|-------|-------|
| **Source system** | Evidence workspace |
| **Actor** | Learner |
| **Subject** | Evidence draft artifact |
| **Source record** | Evidence draft record |
| **Timestamp** | Recorded on draft create / significant draft save as defined by Evidence system |
| **Effective timestamp** | Draft time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID` or `REJECTED` |
| **Reversibility** | Draft may be abandoned; no standing reversal required |
| **Reversal event** | None (drafts do not create standing) |
| **Progression systems affected** | None for current standing |
| **Prohibited effects** | Must not influence XP, Mastery, Proven, Trust, Prestige, or titles |
| **Audit requirement** | Required for provenance |
| **Idempotency requirement** | Duplicate draft create keys must not fork the same Evidence identity |
| **Privacy classification** | `EVIDENCE_CONTENT` |

## EVT-PRG-014 — EVIDENCE_SUBMITTED

| Field | Value |
|-------|-------|
| **Source system** | Evidence review pipeline |
| **Actor** | Learner |
| **Subject** | Evidence submission |
| **Source record** | Evidence submission record |
| **Timestamp** | Recorded on submit |
| **Effective timestamp** | Submission time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, or `UNDER_INTEGRITY_REVIEW` |
| **Reversibility** | May be withdrawn only under governed rules before approval; after approval use revoke / appeal paths |
| **Reversal event** | `EVIDENCE_REVOKED` (post-approval); pre-approval withdrawal is Evidence-system governed, not a progression award event |
| **Progression systems affected** | Review queue presence only |
| **Prohibited effects** | Must not grant Mastery or Proven on submit alone |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same submission key must not double-enter review |
| **Privacy classification** | `EVIDENCE_CONTENT` |

## EVT-PRG-015 — EVIDENCE_REVISION_REQUESTED

| Field | Value |
|-------|-------|
| **Source system** | Evidence review |
| **Actor** | Authorized Evidence reviewer |
| **Subject** | Submitted Evidence |
| **Source record** | Revision request record |
| **Timestamp** | Recorded when revision is requested |
| **Effective timestamp** | Request time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID` or `REJECTED` |
| **Reversibility** | Superseded by later approval / not-approved / revoke outcomes |
| **Reversal event** | None dedicated; later Evidence outcome events supersede |
| **Progression systems affected** | Holds approval-dependent effects |
| **Prohibited effects** | Must not permanently deny; must not apply Trust punishment alone |
| **Audit requirement** | Required |
| **Idempotency requirement** | Concurrent revision requests for same submission must coalesce under one open revision cycle |
| **Privacy classification** | `EVIDENCE_CONTENT` |

## EVT-PRG-016 — EVIDENCE_APPROVED

| Field | Value |
|-------|-------|
| **Source system** | Evidence review |
| **Actor** | Authorized Evidence reviewer |
| **Subject** | Evidence submission |
| **Source record** | Evidence approval record |
| **Timestamp** | Recorded when approval is finalized |
| **Effective timestamp** | Approval effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, `SUPERSEDED`, or `UNDER_INTEGRITY_REVIEW` |
| **Reversibility** | Reversible |
| **Reversal event** | `EVIDENCE_REVOKED` |
| **Progression systems affected** | Mastery eligibility signals; Flight XP recognition eligibility; Capstone / Proven readiness signals |
| **Prohibited effects** | Must not grant Prestige or titles alone; must not create commercial entitlement |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same Evidence identity approval must apply once until revoked |
| **Privacy classification** | `EVIDENCE_CONTENT` |

## EVT-PRG-017 — EVIDENCE_NOT_APPROVED

| Field | Value |
|-------|-------|
| **Source system** | Evidence review |
| **Actor** | Authorized Evidence reviewer |
| **Subject** | Evidence submission |
| **Source record** | Not-approved decision record |
| **Timestamp** | Recorded when decision is finalized |
| **Effective timestamp** | Decision effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, or `SUPERSEDED` |
| **Reversibility** | May be superseded by appeal or new submission cycle |
| **Reversal event** | `EVIDENCE_APPEAL_RESOLVED` (when appeal overturns); new submit cycle for fresh Evidence |
| **Progression systems affected** | Blocks approval-dependent Mastery / Proven pathways for this Evidence identity |
| **Prohibited effects** | Must not permanently ban the learner; must not auto-apply Prestige or Trust penalties |
| **Audit requirement** | Required with rationale |
| **Idempotency requirement** | Same decision cycle must finalize once |
| **Privacy classification** | `EVIDENCE_CONTENT` |

## EVT-PRG-018 — EVIDENCE_REVOKED

| Field | Value |
|-------|-------|
| **Source system** | Evidence governance |
| **Actor** | Authorized reviewer / integrity authority |
| **Subject** | Previously approved Evidence |
| **Source record** | Evidence revocation record with reason |
| **Timestamp** | Recorded when revoke is accepted |
| **Effective timestamp** | Revocation effective time |
| **Validation state** | Marks prior `EVIDENCE_APPROVED` as `REVERSED` or `SUPERSEDED` for standing |
| **Reversibility** | Restorable |
| **Reversal event** | `EVIDENCE_RESTORED` |
| **Progression systems affected** | Withdraws approval-dependent Mastery / XP recognition / Proven readiness derived from this Evidence |
| **Prohibited effects** | Must not erase audit history |
| **Audit requirement** | Required with reason |
| **Idempotency requirement** | Revoke of same Evidence approval must apply once until restored |
| **Privacy classification** | `EVIDENCE_CONTENT` |

## EVT-PRG-019 — EVIDENCE_RESTORED

| Field | Value |
|-------|-------|
| **Source system** | Evidence governance |
| **Actor** | Authorized reviewer / integrity authority |
| **Subject** | Previously revoked Evidence |
| **Source record** | Evidence restoration record with reason |
| **Timestamp** | Recorded when restore is accepted |
| **Effective timestamp** | Restoration effective time |
| **Validation state** | Restores standing influence subject to VALID rules |
| **Reversibility** | May be revoked again |
| **Reversal event** | `EVIDENCE_REVOKED` |
| **Progression systems affected** | Re-enables approval-dependent effects under current rules |
| **Prohibited effects** | Must not invent new Evidence content; must not bypass privacy classification |
| **Audit requirement** | Required with reason |
| **Idempotency requirement** | Restore of same revocation cycle must apply once |
| **Privacy classification** | `EVIDENCE_CONTENT` |

## EVT-PRG-020 — EVIDENCE_APPEAL_RESOLVED

| Field | Value |
|-------|-------|
| **Source system** | Evidence appeal process |
| **Actor** | Appeal authority |
| **Subject** | Evidence under appeal |
| **Source record** | Appeal resolution record |
| **Timestamp** | Recorded when appeal is resolved |
| **Effective timestamp** | Resolution effective time |
| **Validation state** | May supersede prior not-approved / revoke standing effects when resolution so directs |
| **Reversibility** | Further correction via governance only |
| **Reversal event** | `PROGRESSION_CORRECTION_APPLIED` if resolution itself erroneous |
| **Progression systems affected** | Evidence standing; dependent Mastery / Proven readiness as directed by resolution |
| **Prohibited effects** | Must not silently grant Route-Proven without Capstone / Proven events |
| **Audit requirement** | Required with rationale |
| **Idempotency requirement** | Same appeal case must resolve once |
| **Privacy classification** | `EVIDENCE_CONTENT` |

---

# Capstone and Proven

## EVT-PRG-021 — CAPSTONE_SUBMITTED

| Field | Value |
|-------|-------|
| **Source system** | Capstone review pipeline |
| **Actor** | Learner |
| **Subject** | Capstone submission |
| **Source record** | Capstone submission record |
| **Timestamp** | Recorded on submit |
| **Effective timestamp** | Submission time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, or `UNDER_INTEGRITY_REVIEW` |
| **Reversibility** | Pre-decision withdrawal governed by Capstone rules; post-decision uses revision / Proven paths |
| **Reversal event** | None dedicated for submit; outcomes govern standing |
| **Progression systems affected** | Capstone review presence only |
| **Prohibited effects** | Must not grant Route-Proven on submit alone |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same Capstone cycle submit must not fork duplicate reviews |
| **Privacy classification** | `CAPSTONE_SENSITIVE` |

## EVT-PRG-022 — CAPSTONE_APPROVED

| Field | Value |
|-------|-------|
| **Source system** | Capstone review |
| **Actor** | Authorized Capstone reviewer / panel |
| **Subject** | Capstone submission |
| **Source record** | Capstone approval record |
| **Timestamp** | Recorded when Capstone approval is finalized |
| **Effective timestamp** | Approval effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, `SUPERSEDED`, or `UNDER_INTEGRITY_REVIEW` |
| **Reversibility** | May require revision or Proven reevaluation paths |
| **Reversal event** | `CAPSTONE_REVISION_REQUIRED`; Proven impacts via `ROUTE_PROVEN_REEVALUATION_REQUIRED` / revoke-related Proven events |
| **Progression systems affected** | Route-Proven eligibility signals; Mastery eligibility signals; recognition eligibility |
| **Prohibited effects** | Must not alone grant Prestige or titles; must not create commercial entitlement |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same Capstone cycle approval must apply once until superseded |
| **Privacy classification** | `CAPSTONE_SENSITIVE` |

## EVT-PRG-023 — CAPSTONE_REVISION_REQUIRED

| Field | Value |
|-------|-------|
| **Source system** | Capstone review |
| **Actor** | Authorized Capstone reviewer / panel |
| **Subject** | Capstone submission |
| **Source record** | Capstone revision requirement record |
| **Timestamp** | Recorded when revision is required |
| **Effective timestamp** | Requirement effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID` or `REJECTED` |
| **Reversibility** | Superseded by later Capstone outcome |
| **Reversal event** | Later `CAPSTONE_APPROVED` or governed withdrawal / correction |
| **Progression systems affected** | Holds Route-Proven grant eligibility for this Capstone cycle |
| **Prohibited effects** | Must not permanently close the Route; must not auto-revoke unrelated Proven |
| **Audit requirement** | Required with rationale |
| **Idempotency requirement** | Open revision cycle must not multiply conflicting requirements without supersession |
| **Privacy classification** | `CAPSTONE_SENSITIVE` |

## EVT-PRG-024 — ROUTE_PROVEN_GRANTED

| Field | Value |
|-------|-------|
| **Source system** | Route-Proven adjudication |
| **Actor** | Proven authority / governed panel |
| **Subject** | Learner Route-Proven standing for a Route |
| **Source record** | Route-Proven grant record |
| **Timestamp** | Recorded when Proven is granted |
| **Effective timestamp** | Grant effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, `SUPERSEDED`, or `UNDER_INTEGRITY_REVIEW` |
| **Reversibility** | Reevaluation and restoration paths exist; revocation of basis Evidence / Capstone may force reevaluation |
| **Reversal event** | `ROUTE_PROVEN_REEVALUATION_REQUIRED` (hold / reconsider); restoration via `ROUTE_PROVEN_RESTORED` after successful reevaluation |
| **Progression systems affected** | Route-Proven standing; Rank eligibility signals; public Proven display eligibility |
| **Prohibited effects** | Must not be sold; must not be granted by commercial plan alone; must not auto-grant Prestige or titles |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same Route Proven grant context must apply once until reevaluation changes standing |
| **Privacy classification** | `CAPSTONE_SENSITIVE` |

## EVT-PRG-025 — ROUTE_PROVEN_REEVALUATION_REQUIRED

| Field | Value |
|-------|-------|
| **Source system** | Route-Proven governance |
| **Actor** | Proven authority / integrity authority |
| **Subject** | Existing or pending Route-Proven standing |
| **Source record** | Reevaluation requirement record with reason |
| **Timestamp** | Recorded when reevaluation is opened |
| **Effective timestamp** | Hold effective time |
| **Validation state** | Places Proven standing under review; must not silently finalize permanent standing |
| **Reversibility** | Resolved by restore, continued hold, or other governed Proven outcome |
| **Reversal event** | `ROUTE_PROVEN_RESTORED` when reevaluation affirms; otherwise further governed correction |
| **Progression systems affected** | Route-Proven standing hold; public Proven display may be suppressed while under reevaluation |
| **Prohibited effects** | Must not silently convert into permanent revocation without an explicit governed outcome |
| **Audit requirement** | Required with reason |
| **Idempotency requirement** | Open reevaluation for same Proven grant must remain a single case |
| **Privacy classification** | `CAPSTONE_SENSITIVE` |

## EVT-PRG-026 — ROUTE_PROVEN_RESTORED

| Field | Value |
|-------|-------|
| **Source system** | Route-Proven governance |
| **Actor** | Proven authority |
| **Subject** | Route-Proven standing after reevaluation |
| **Source record** | Route-Proven restoration record |
| **Timestamp** | Recorded when restoration is finalized |
| **Effective timestamp** | Restoration effective time |
| **Validation state** | Restores VALID Proven standing subject to validity rules |
| **Reversibility** | May enter reevaluation again |
| **Reversal event** | `ROUTE_PROVEN_REEVALUATION_REQUIRED` |
| **Progression systems affected** | Route-Proven standing; related display eligibility |
| **Prohibited effects** | Must not invent Capstone approval that does not exist |
| **Audit requirement** | Required with rationale |
| **Idempotency requirement** | Same reevaluation case restore must apply once |
| **Privacy classification** | `CAPSTONE_SENSITIVE` |

---

# Community

## EVT-PRG-027 — COMMUNITY_CONTRIBUTION_RECOGNIZED

| Field | Value |
|-------|-------|
| **Source system** | Community recognition |
| **Actor** | Authorized community moderator / recognition authority |
| **Subject** | Learner contribution artifact or act |
| **Source record** | Community contribution recognition record |
| **Timestamp** | Recorded when recognition is accepted |
| **Effective timestamp** | Recognition effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, or `UNDER_INTEGRITY_REVIEW` |
| **Reversibility** | Reversible |
| **Reversal event** | `COMMUNITY_CONTRIBUTION_REVERSED` |
| **Progression systems affected** | Flight XP recognition eligibility (contribution); Trust positive pathway eligibility; Season contribution visibility |
| **Prohibited effects** | Must not grant Mastery or Route-Proven; must not be purchased |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same contribution recognition key must apply once until reversed |
| **Privacy classification** | `COMMUNITY_MODERATION` |

## EVT-PRG-028 — COMMUNITY_CONTRIBUTION_REVERSED

| Field | Value |
|-------|-------|
| **Source system** | Community recognition governance |
| **Actor** | Authorized community moderator / recognition authority |
| **Subject** | Previously recognized contribution |
| **Source record** | Recognition reversal record with reason |
| **Timestamp** | Recorded when reversal is accepted |
| **Effective timestamp** | Reversal effective time |
| **Validation state** | Marks prior recognition `REVERSED` for standing |
| **Reversibility** | Further correction via progression correction if needed |
| **Reversal event** | `PROGRESSION_CORRECTION_APPLIED` if this reversal was erroneous |
| **Progression systems affected** | Withdraws contribution recognition effects |
| **Prohibited effects** | Must not delete audit history of the original recognition |
| **Audit requirement** | Required with reason |
| **Idempotency requirement** | Reverse of same recognition must apply once |
| **Privacy classification** | `COMMUNITY_MODERATION` |

## EVT-PRG-029 — REPORT_CONFIRMED

| Field | Value |
|-------|-------|
| **Source system** | Community safety / reporting |
| **Actor** | Authorized moderator |
| **Subject** | Reported learner or content, and reporting case |
| **Source record** | Confirmed report case record |
| **Timestamp** | Recorded when report confirmation is finalized |
| **Effective timestamp** | Confirmation effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, or `SUPERSEDED` |
| **Reversibility** | Overturnable |
| **Reversal event** | `REPORT_OVERTURNED` |
| **Progression systems affected** | Trust concern pathway; may authorize moderation action events |
| **Prohibited effects** | Must not alone revoke Route-Proven or Mastery without their own governed events |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same report case confirmation must apply once until overturned |
| **Privacy classification** | `COMMUNITY_MODERATION` |

## EVT-PRG-030 — REPORT_OVERTURNED

| Field | Value |
|-------|-------|
| **Source system** | Community safety / reporting |
| **Actor** | Authorized moderator / appeal authority |
| **Subject** | Previously confirmed report case |
| **Source record** | Report overturn record with reason |
| **Timestamp** | Recorded when overturn is finalized |
| **Effective timestamp** | Overturn effective time |
| **Validation state** | Supersedes confirmed report standing effects |
| **Reversibility** | Further correction via governance |
| **Reversal event** | `PROGRESSION_CORRECTION_APPLIED` if overturn erroneous |
| **Progression systems affected** | Clears or adjusts Trust concern derived solely from the overturned confirmation |
| **Prohibited effects** | Must not silently erase moderation audit history |
| **Audit requirement** | Required with reason |
| **Idempotency requirement** | Overturn of same confirmation must apply once |
| **Privacy classification** | `COMMUNITY_MODERATION` |

## EVT-PRG-031 — MODERATION_ACTION_APPLIED

| Field | Value |
|-------|-------|
| **Source system** | Community moderation |
| **Actor** | Authorized moderator |
| **Subject** | Learner / content under moderation |
| **Source record** | Moderation action record |
| **Timestamp** | Recorded when action is applied |
| **Effective timestamp** | Action effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, or `SUPERSEDED` |
| **Reversibility** | Reversible |
| **Reversal event** | `MODERATION_ACTION_REVERSED` |
| **Progression systems affected** | Trust restriction pathway eligibility; community participation standing |
| **Prohibited effects** | Must not rewrite Learning Graph prerequisites; must not grant paid entitlement; must not silently reclassify commercial actions as learning outcomes |
| **Audit requirement** | Required with reason |
| **Idempotency requirement** | Same moderation action identity must apply once until reversed |
| **Privacy classification** | `COMMUNITY_MODERATION` |

## EVT-PRG-032 — MODERATION_ACTION_REVERSED

| Field | Value |
|-------|-------|
| **Source system** | Community moderation governance |
| **Actor** | Authorized moderator / appeal authority |
| **Subject** | Previously applied moderation action |
| **Source record** | Moderation reversal record with reason |
| **Timestamp** | Recorded when reversal is accepted |
| **Effective timestamp** | Reversal effective time |
| **Validation state** | Marks prior moderation action `REVERSED` for standing |
| **Reversibility** | Further correction via governance |
| **Reversal event** | `PROGRESSION_CORRECTION_APPLIED` if this reversal erroneous |
| **Progression systems affected** | Clears standing effects of the reversed moderation action |
| **Prohibited effects** | Must not delete audit of the original action |
| **Audit requirement** | Required with reason |
| **Idempotency requirement** | Reverse of same action must apply once |
| **Privacy classification** | `COMMUNITY_MODERATION` |

---

# Team and Live Sky

## EVT-PRG-033 — TEAM_CONTRIBUTION_APPROVED

| Field | Value |
|-------|-------|
| **Source system** | Team Evidence / contribution review |
| **Actor** | Authorized team reviewer |
| **Subject** | Learner team contribution |
| **Source record** | Team contribution approval record |
| **Timestamp** | Recorded when approval is finalized |
| **Effective timestamp** | Approval effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, or `UNDER_INTEGRITY_REVIEW` |
| **Reversibility** | Revisable |
| **Reversal event** | `TEAM_CONTRIBUTION_REVISED` (when revision withdraws or alters standing effect) |
| **Progression systems affected** | Flight XP recognition eligibility (team); Mastery eligibility only where team Evidence is approved under Evidence rules |
| **Prohibited effects** | Must not grant Route-Proven alone; must not credit teammates who did not contribute |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same contribution approval key must apply once until revised |
| **Privacy classification** | `TEAM_OPERATIONAL` |

## EVT-PRG-034 — TEAM_CONTRIBUTION_REVISED

| Field | Value |
|-------|-------|
| **Source system** | Team Evidence / contribution review |
| **Actor** | Authorized team reviewer |
| **Subject** | Previously approved or pending team contribution |
| **Source record** | Team contribution revision record |
| **Timestamp** | Recorded when revision is finalized |
| **Effective timestamp** | Revision effective time |
| **Validation state** | Supersedes prior team contribution standing effects as directed |
| **Reversibility** | Further revision allowed under governance |
| **Reversal event** | Later `TEAM_CONTRIBUTION_APPROVED` / further `TEAM_CONTRIBUTION_REVISED` |
| **Progression systems affected** | Adjusts team recognition and any dependent eligibility signals |
| **Prohibited effects** | Must not silently transfer credit across unrelated learners |
| **Audit requirement** | Required with reason |
| **Idempotency requirement** | Same revision cycle must apply once |
| **Privacy classification** | `TEAM_OPERATIONAL` |

## EVT-PRG-035 — LIVE_FLIGHT_COMPLETED

| Field | Value |
|-------|-------|
| **Source system** | Live Sky runtime |
| **Actor** | Live Sky system with learner / team participation |
| **Subject** | Live flight session |
| **Source record** | Live flight completion record |
| **Timestamp** | Recorded when flight session completes |
| **Effective timestamp** | Flight completion time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, or `UNDER_INTEGRITY_REVIEW` |
| **Reversibility** | Results may be revoked after finalization; completion itself may be corrected |
| **Reversal event** | `LIVE_RESULT_REVOKED` (for finalized results); `PROGRESSION_CORRECTION_APPLIED` for erroneous completion |
| **Progression systems affected** | Live recognition eligibility pending finalization |
| **Prohibited effects** | Must not finalize awards before `LIVE_RESULT_FINALIZED` |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same flight session completion must process once |
| **Privacy classification** | `LIVE_SKY_OPERATIONAL` |

## EVT-PRG-036 — LIVE_RESULT_FINALIZED

| Field | Value |
|-------|-------|
| **Source system** | Live Sky adjudication |
| **Actor** | Live Sky adjudicator / system under governed rules |
| **Subject** | Live flight result set |
| **Source record** | Live result finalization record |
| **Timestamp** | Recorded when results are finalized |
| **Effective timestamp** | Finalization effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, `SUPERSEDED`, or `UNDER_INTEGRITY_REVIEW` |
| **Reversibility** | Revocable |
| **Reversal event** | `LIVE_RESULT_REVOKED` |
| **Progression systems affected** | Flight XP recognition eligibility (live); Season live standing; Trust signals only via separate Trust events if warranted |
| **Prohibited effects** | Must not grant Route-Proven or Mastery unless separate Evidence / Capstone events exist |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same flight result set finalization must apply once until revoked |
| **Privacy classification** | `LIVE_SKY_OPERATIONAL` |

## EVT-PRG-037 — LIVE_RESULT_REVOKED

| Field | Value |
|-------|-------|
| **Source system** | Live Sky governance |
| **Actor** | Live Sky authority / integrity authority |
| **Subject** | Previously finalized live results |
| **Source record** | Live result revocation record with reason |
| **Timestamp** | Recorded when revoke is accepted |
| **Effective timestamp** | Revocation effective time |
| **Validation state** | Marks prior finalization `REVERSED` for standing |
| **Reversibility** | Further correction via progression correction |
| **Reversal event** | `PROGRESSION_CORRECTION_APPLIED` if revoke erroneous |
| **Progression systems affected** | Withdraws live recognition effects from the revoked finalization |
| **Prohibited effects** | Must not erase flight audit history |
| **Audit requirement** | Required with reason |
| **Idempotency requirement** | Revoke of same finalization must apply once |
| **Privacy classification** | `LIVE_SKY_OPERATIONAL` |

---

# Trust and Identity

## EVT-PRG-038 — TRUST_POSITIVE_SIGNAL

| Field | Value |
|-------|-------|
| **Source system** | Trust engine |
| **Actor** | Trust system or authorized Trust authority |
| **Subject** | Learner Trust profile |
| **Source record** | Positive Trust signal record |
| **Timestamp** | Recorded when signal is accepted |
| **Effective timestamp** | Signal effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, or `UNDER_INTEGRITY_REVIEW` |
| **Reversibility** | May be superseded by later Trust events; correction path available |
| **Reversal event** | `PROGRESSION_CORRECTION_APPLIED` or later opposing Trust events as governed |
| **Progression systems affected** | Trust standing |
| **Prohibited effects** | Must not grant Mastery, Route-Proven, XP, Prestige, or titles by itself |
| **Audit requirement** | Required |
| **Idempotency requirement** | Duplicate identical signal keys must not double-apply |
| **Privacy classification** | `TRUST_RESTRICTED` |

## EVT-PRG-039 — TRUST_CONCERN_RECORDED

| Field | Value |
|-------|-------|
| **Source system** | Trust engine |
| **Actor** | Trust system, moderator, or integrity authority |
| **Subject** | Learner Trust profile |
| **Source record** | Trust concern record |
| **Timestamp** | Recorded when concern is filed |
| **Effective timestamp** | Concern effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, or `UNDER_INTEGRITY_REVIEW` |
| **Reversibility** | May be cleared via restriction removal / correction / overturned report paths |
| **Reversal event** | `TRUST_RESTRICTION_REMOVED` (when concern drove a restriction); `PROGRESSION_CORRECTION_APPLIED`; related `REPORT_OVERTURNED` |
| **Progression systems affected** | Trust standing; may authorize restriction events |
| **Prohibited effects** | Must not silently revoke Mastery or Proven without their events |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same concern case must record once as authoritative |
| **Privacy classification** | `TRUST_RESTRICTED` |

## EVT-PRG-040 — TRUST_RESTRICTION_APPLIED

| Field | Value |
|-------|-------|
| **Source system** | Trust / access governance |
| **Actor** | Trust authority |
| **Subject** | Learner Trust profile and participation rights |
| **Source record** | Trust restriction record with reason |
| **Timestamp** | Recorded when restriction is applied |
| **Effective timestamp** | Restriction effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID` or `REJECTED` |
| **Reversibility** | Removable |
| **Reversal event** | `TRUST_RESTRICTION_REMOVED` |
| **Progression systems affected** | Trust standing; community / Live / contribution participation eligibility |
| **Prohibited effects** | Must not rewrite educational prerequisites; must not reclassify commercial denial as learning failure |
| **Audit requirement** | Required with reason |
| **Idempotency requirement** | Same restriction identity must apply once until removed |
| **Privacy classification** | `TRUST_RESTRICTED` |

## EVT-PRG-041 — TRUST_RESTRICTION_REMOVED

| Field | Value |
|-------|-------|
| **Source system** | Trust / access governance |
| **Actor** | Trust authority |
| **Subject** | Active Trust restriction |
| **Source record** | Restriction removal record with reason |
| **Timestamp** | Recorded when removal is accepted |
| **Effective timestamp** | Removal effective time |
| **Validation state** | Marks prior restriction `REVERSED` or `SUPERSEDED` for standing |
| **Reversibility** | New restrictions may be applied later |
| **Reversal event** | `TRUST_RESTRICTION_APPLIED` |
| **Progression systems affected** | Trust standing; restores participation eligibility limited by the removed restriction |
| **Prohibited effects** | Must not invent positive Trust history that did not occur |
| **Audit requirement** | Required with reason |
| **Idempotency requirement** | Removal of same restriction must apply once |
| **Privacy classification** | `TRUST_RESTRICTED` |

## EVT-PRG-042 — ASSURANCE_LEVEL_CHANGED

| Field | Value |
|-------|-------|
| **Source system** | Identity / assurance service |
| **Actor** | Identity system or assurance authority |
| **Subject** | Learner identity assurance profile |
| **Source record** | Assurance level change record |
| **Timestamp** | Recorded when assurance change is accepted |
| **Effective timestamp** | Change effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID` or `REJECTED` |
| **Reversibility** | Further assurance changes supersede |
| **Reversal event** | Later `ASSURANCE_LEVEL_CHANGED`; correction via `PROGRESSION_CORRECTION_APPLIED` if erroneous |
| **Progression systems affected** | Eligibility for Trust-sensitive and high-assurance progression actions |
| **Prohibited effects** | Must not grant XP, Mastery, Proven, Prestige, or titles |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same assurance transition key must apply once |
| **Privacy classification** | `TRUST_RESTRICTED` |

---

# Progression Administration

## EVT-PRG-043 — PROGRESSION_CORRECTION_APPLIED

| Field | Value |
|-------|-------|
| **Source system** | Progression administration |
| **Actor** | Privileged progression administrator (manual / governed) |
| **Subject** | Targeted progression standing and related events |
| **Source record** | Correction record **with mandatory reason** |
| **Timestamp** | Recorded when correction is applied |
| **Effective timestamp** | Correction effective time (may differ from recorded time for late reconciliation) |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID` or `REJECTED`; may mark prior events `REVERSED` / `SUPERSEDED` without deleting audit |
| **Reversibility** | Reversible |
| **Reversal event** | `PROGRESSION_CORRECTION_REVERSED` |
| **Progression systems affected** | Any progression systems named in the correction scope |
| **Prohibited effects** | Must not delete audit history; must not reclassify commercial transactions as learning outcomes; privileged manual actions without reason are invalid |
| **Audit requirement** | Required with reason (privileged) |
| **Idempotency requirement** | Same correction identity must apply once until reversed |
| **Privacy classification** | `ADMINISTRATIVE_AUDIT` |

## EVT-PRG-044 — PROGRESSION_CORRECTION_REVERSED

| Field | Value |
|-------|-------|
| **Source system** | Progression administration |
| **Actor** | Privileged progression administrator |
| **Subject** | Previously applied correction |
| **Source record** | Correction reversal record with reason |
| **Timestamp** | Recorded when reversal is accepted |
| **Effective timestamp** | Reversal effective time |
| **Validation state** | Marks prior correction `REVERSED`; restores prior standing calculation basis without deleting history |
| **Reversibility** | Further corrections may reapply |
| **Reversal event** | Later `PROGRESSION_CORRECTION_APPLIED` |
| **Progression systems affected** | Systems previously affected by the reversed correction |
| **Prohibited effects** | Must not purge audit of either correction or its reversal |
| **Audit requirement** | Required with reason |
| **Idempotency requirement** | Reverse of same correction must apply once |
| **Privacy classification** | `ADMINISTRATIVE_AUDIT` |

## EVT-PRG-045 — SEASON_OPENED

| Field | Value |
|-------|-------|
| **Source system** | Season administration |
| **Actor** | Season authority / system under schedule governance |
| **Subject** | Season instance |
| **Source record** | Season open record |
| **Timestamp** | Recorded when season opens |
| **Effective timestamp** | Season open effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID` or `REJECTED` |
| **Reversibility** | Closed by season close; erroneous open corrected via progression correction |
| **Reversal event** | `SEASON_CLOSED`; `PROGRESSION_CORRECTION_APPLIED` if open was erroneous |
| **Progression systems affected** | Season participation; seasonal recognition windows |
| **Prohibited effects** | Must not reset lifetime Mastery or Route-Proven by opening alone |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same season instance open must apply once |
| **Privacy classification** | `ADMINISTRATIVE_AUDIT` |

## EVT-PRG-046 — SEASON_CLOSED

| Field | Value |
|-------|-------|
| **Source system** | Season administration |
| **Actor** | Season authority / system under schedule governance |
| **Subject** | Open season instance |
| **Source record** | Season close record |
| **Timestamp** | Recorded when season closes |
| **Effective timestamp** | Season close effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID` or `REJECTED` |
| **Reversibility** | Erroneous close corrected via progression correction; seasons do not reopen casually |
| **Reversal event** | `PROGRESSION_CORRECTION_APPLIED` |
| **Progression systems affected** | Season participation freeze; seasonal leaderboard / recognition freeze as governed |
| **Prohibited effects** | Must not revoke lifetime Proven / Mastery solely by closing |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same season instance close must apply once |
| **Privacy classification** | `ADMINISTRATIVE_AUDIT` |

## EVT-PRG-047 — TITLE_REVIEW_OPENED

| Field | Value |
|-------|-------|
| **Source system** | Title administration |
| **Actor** | Title authority |
| **Subject** | Title candidacy for a learner |
| **Source record** | Title review open record |
| **Timestamp** | Recorded when review opens |
| **Effective timestamp** | Review open time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID` or `REJECTED` |
| **Reversibility** | Superseded by grant / revoke / correction |
| **Reversal event** | `TITLE_GRANTED` / `TITLE_REVOKED` outcomes; `PROGRESSION_CORRECTION_APPLIED` |
| **Progression systems affected** | Title candidacy standing only |
| **Prohibited effects** | Must not grant the title by opening review |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same title candidacy review must open once per cycle |
| **Privacy classification** | `ADMINISTRATIVE_AUDIT` |

## EVT-PRG-048 — TITLE_GRANTED

| Field | Value |
|-------|-------|
| **Source system** | Title administration |
| **Actor** | Title authority |
| **Subject** | Learner title standing |
| **Source record** | Title grant record |
| **Timestamp** | Recorded when title is granted |
| **Effective timestamp** | Grant effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, or `SUPERSEDED` |
| **Reversibility** | Revocable |
| **Reversal event** | `TITLE_REVOKED` |
| **Progression systems affected** | Title standing; display eligibility |
| **Prohibited effects** | Must not be sold; must not grant Mastery or Route-Proven |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same title grant context must apply once until revoked |
| **Privacy classification** | `ADMINISTRATIVE_AUDIT` |

## EVT-PRG-049 — TITLE_REVOKED

| Field | Value |
|-------|-------|
| **Source system** | Title administration |
| **Actor** | Title authority |
| **Subject** | Previously granted title |
| **Source record** | Title revocation record with reason |
| **Timestamp** | Recorded when revoke is accepted |
| **Effective timestamp** | Revocation effective time |
| **Validation state** | Marks prior grant `REVERSED` for standing |
| **Reversibility** | May be re-granted via new grant event after governed review |
| **Reversal event** | Later `TITLE_GRANTED`; erroneous revoke via `PROGRESSION_CORRECTION_APPLIED` |
| **Progression systems affected** | Title standing |
| **Prohibited effects** | Must not delete grant audit history |
| **Audit requirement** | Required with reason |
| **Idempotency requirement** | Revoke of same grant must apply once |
| **Privacy classification** | `ADMINISTRATIVE_AUDIT` |

## EVT-PRG-050 — PRESTIGE_REVIEW_OPENED

| Field | Value |
|-------|-------|
| **Source system** | Prestige administration |
| **Actor** | Prestige authority |
| **Subject** | Prestige candidacy for a learner |
| **Source record** | Prestige review open record |
| **Timestamp** | Recorded when review opens |
| **Effective timestamp** | Review open time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID` or `REJECTED` |
| **Reversibility** | Superseded by grant / suspend / revoke / correction |
| **Reversal event** | Prestige outcome events; `PROGRESSION_CORRECTION_APPLIED` |
| **Progression systems affected** | Prestige candidacy standing only |
| **Prohibited effects** | Must not grant Prestige by opening review |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same Prestige candidacy review must open once per cycle |
| **Privacy classification** | `ADMINISTRATIVE_AUDIT` |

## EVT-PRG-051 — PRESTIGE_GRANTED

| Field | Value |
|-------|-------|
| **Source system** | Prestige administration |
| **Actor** | Prestige authority |
| **Subject** | Learner Prestige standing |
| **Source record** | Prestige grant record |
| **Timestamp** | Recorded when Prestige is granted |
| **Effective timestamp** | Grant effective time |
| **Validation state** | Enters `RECEIVED` → `VALIDATING` → `VALID`, `REJECTED`, or `SUPERSEDED` |
| **Reversibility** | Suspendable and revocable |
| **Reversal event** | `PRESTIGE_SUSPENDED`; `PRESTIGE_REVOKED` |
| **Progression systems affected** | Prestige standing; distinction display eligibility |
| **Prohibited effects** | Must not be purchased; must not rewrite Mastery or Proven |
| **Audit requirement** | Required |
| **Idempotency requirement** | Same Prestige grant context must apply once until suspended/revoked |
| **Privacy classification** | `ADMINISTRATIVE_AUDIT` |

## EVT-PRG-052 — PRESTIGE_SUSPENDED

| Field | Value |
|-------|-------|
| **Source system** | Prestige administration |
| **Actor** | Prestige authority |
| **Subject** | Active Prestige standing |
| **Source record** | Prestige suspension record with reason |
| **Timestamp** | Recorded when suspension is applied |
| **Effective timestamp** | Suspension effective time |
| **Validation state** | Holds Prestige standing without necessarily revoking permanently |
| **Reversibility** | May restore via correction / later grant affirmation, or escalate to revoke |
| **Reversal event** | `PRESTIGE_REVOKED`; restoration via `PROGRESSION_CORRECTION_APPLIED` or later governed `PRESTIGE_GRANTED` affirmation |
| **Progression systems affected** | Prestige standing hold; display suppression while suspended |
| **Prohibited effects** | Must not silently become permanent revoke without `PRESTIGE_REVOKED` |
| **Audit requirement** | Required with reason |
| **Idempotency requirement** | Same suspension case must apply once until lifted or revoked |
| **Privacy classification** | `ADMINISTRATIVE_AUDIT` |

## EVT-PRG-053 — PRESTIGE_REVOKED

| Field | Value |
|-------|-------|
| **Source system** | Prestige administration |
| **Actor** | Prestige authority |
| **Subject** | Prestige standing |
| **Source record** | Prestige revocation record with reason |
| **Timestamp** | Recorded when revoke is accepted |
| **Effective timestamp** | Revocation effective time |
| **Validation state** | Marks prior Prestige grant `REVERSED` for standing |
| **Reversibility** | May be re-granted only through new governed grant after review |
| **Reversal event** | Later `PRESTIGE_GRANTED`; erroneous revoke via `PROGRESSION_CORRECTION_APPLIED` |
| **Progression systems affected** | Prestige standing |
| **Prohibited effects** | Must not delete Prestige audit history |
| **Audit requirement** | Required with reason |
| **Idempotency requirement** | Revoke of same grant must apply once |
| **Privacy classification** | `ADMINISTRATIVE_AUDIT` |

---

## Registry invariants

1. **Catalogue closed for silent invention** — Unlisted event names must not influence progression standing.
2. **No Product Code in this Gate** — Runtime schemas and handlers remain out of scope.
3. **No numeric formulas here** — Award magnitudes, thresholds, and season lengths are FORMULA PENDING.
4. **Commercial separation** — Commercial / entitlement events are not progression learning events and must not be reclassified as such.
5. **Audit durability** — Reversal and correction change standing influence; they do not erase history.
6. **Validity gate** — Standing influence requires `VALID` per [PROGRESSION-EVENT-VALIDITY.md](./PROGRESSION-EVENT-VALIDITY.md).

---

## Verification

```text
Learning Activity:           7
Assessment:                  5
Evidence:                    8
Capstone and Proven:         6
Community:                   6
Team and Live Sky:           5
Trust and Identity:          5
Progression Administration: 11
--------------------------------
TOTAL EVENT COUNT:          53
Event IDs: EVT-PRG-001 … EVT-PRG-053
```
