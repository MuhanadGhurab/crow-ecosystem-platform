# Progression State Registry

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-ST-REG-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-DECISION-REGISTRY.md](./PROGRESSION-DECISION-REGISTRY.md) · [../events/PROGRESSION-EVENT-VALIDITY.md](../events/PROGRESSION-EVENT-VALIDITY.md) · [../momentum/MOMENTUM-LEAGUE-ARCHITECTURE.md](../momentum/MOMENTUM-LEAGUE-ARCHITECTURE.md) · [../mastery/ROUTE-MASTERY-ARCHITECTURE.md](../mastery/ROUTE-MASTERY-ARCHITECTURE.md) · [../mastery/MASTERY-FRESHNESS-ARCHITECTURE.md](../mastery/MASTERY-FRESHNESS-ARCHITECTURE.md) · [../maturity/MATURITY-RANK-ARCHITECTURE.md](../maturity/MATURITY-RANK-ARCHITECTURE.md) · [../governance/AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md](../governance/AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md) · [../README.md](../README.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **TOTAL STATE COUNT** | **78** |
| **Change history** | 1.0.0 — GHV.PROGRESSION.1A: register canonical progression states |

---

## Purpose

Register exact canonical state values across progression systems with stable State IDs (`ST-PRG-xxx`). States are architectural vocabulary — not Product Code and not numeric formulas.

```text
TOTAL STATE COUNT = 78
No approximate totals
Transition thresholds PENDING (GHV.PROGRESSION.1B)
```

---

## Count breakdown (exact)

| Domain | States | ID range |
|--------|-------:|----------|
| Event validity | **7** | ST-PRG-001 … ST-PRG-007 |
| Momentum | **9** | ST-PRG-008 … ST-PRG-016 |
| Mastery | **11** | ST-PRG-017 … ST-PRG-027 |
| Trust | **8** | ST-PRG-028 … ST-PRG-035 |
| Titles | **9** | ST-PRG-036 … ST-PRG-044 |
| Prestige | **11** | ST-PRG-045 … ST-PRG-055 |
| Leaderboards | **9** | ST-PRG-056 … ST-PRG-064 |
| Corrections | **8** | ST-PRG-065 … ST-PRG-072 |
| Freshness overlays | **2** | ST-PRG-073 … ST-PRG-074 |
| Maturity advancement process | **4** | ST-PRG-075 … ST-PRG-078 |
| **TOTAL** | **78** | |

### Freshness note (no double-count)

Mastery states **REFRESH_RECOMMENDED** (`ST-PRG-024`) and **REEVALUATION_REQUIRED** (`ST-PRG-025`) are registered **once** under Mastery. Freshness architecture treats them as dual-use standing labels.

Freshness also defines interpretive overlays **HISTORICAL_ACHIEVEMENT** and **CURRENT_DEMONSTRATION**, registered separately below (2 states). They are not additional Mastery machine states.

Breadth does not yet have a locked separate state machine in 1A architecture files; Breadth standing changes are expressed via decisions (`BREADTH_UPDATE`) and Mastery/Evidence sources until a Breadth-specific state doc locks vocabulary. XP recognition uses Event validity states rather than a parallel XP state machine.

---

## Field legend

| Field | Meaning |
|-------|---------|
| **User-visible** | Whether learners may see this state (possibly scoped) |
| **Appealable** | Whether standing in this state can enter appeal/correction |
| **Provisional** | Whether the state is non-final by design |
| **Sensitive** | Whether access/display is restricted or high-impact |

---

## A. Event validity (7)

Source: [PROGRESSION-EVENT-VALIDITY.md](../events/PROGRESSION-EVENT-VALIDITY.md)

### ST-PRG-001 — RECEIVED

| Field | Value |
|-------|-------|
| **System** | Event validity |
| **Meaning** | Event payload accepted into the progression boundary; not yet evaluated |
| **Entry events** | Ingress of a registry event instance |
| **Exit events** | Transition to VALIDATING |
| **User-visible** | Rarely (ops/audit); not a standing claim |
| **Appealable** | No (pre-decision) |
| **Provisional** | Yes |
| **Sensitive** | Per event privacy class |
| **Related source doc** | PROGRESSION-EVENT-VALIDITY.md |

### ST-PRG-002 — VALIDATING

| Field | Value |
|-------|-------|
| **System** | Event validity |
| **Meaning** | Structural, authority, subject, source-record, and policy checks in progress |
| **Entry events** | From RECEIVED |
| **Exit events** | VALID, REJECTED, or UNDER_INTEGRITY_REVIEW |
| **User-visible** | Optional “processing” |
| **Appealable** | No (until outcome) |
| **Provisional** | Yes |
| **Sensitive** | Per event privacy class |
| **Related source doc** | PROGRESSION-EVENT-VALIDITY.md |

### ST-PRG-003 — VALID

| Field | Value |
|-------|-------|
| **System** | Event validity |
| **Meaning** | Accepted for **current standing** influence |
| **Entry events** | Successful validation |
| **Exit events** | REVERSED or SUPERSEDED (governed) |
| **User-visible** | Via resulting standing explanations |
| **Appealable** | Effects appealable via correction |
| **Provisional** | No (for current influence) |
| **Sensitive** | Per event privacy class |
| **Related source doc** | PROGRESSION-EVENT-VALIDITY.md |

### ST-PRG-004 — REJECTED

| Field | Value |
|-------|-------|
| **System** | Event validity |
| **Meaning** | Failed validation; must not influence current standing |
| **Entry events** | Failed checks / duplicate policy |
| **Exit events** | Terminal for this instance (new event may be submitted) |
| **User-visible** | When rejection affects the learner |
| **Appealable** | Yes (mis-rejection) |
| **Provisional** | No |
| **Sensitive** | Per event privacy class |
| **Related source doc** | PROGRESSION-EVENT-VALIDITY.md |

### ST-PRG-005 — REVERSED

| Field | Value |
|-------|-------|
| **System** | Event validity |
| **Meaning** | Previously influential effect withdrawn; history retained |
| **Entry events** | Governed reversal / void |
| **Exit events** | Terminal for influence; history remains |
| **User-visible** | Yes when standing changes |
| **Appealable** | Yes |
| **Provisional** | No |
| **Sensitive** | Often elevated |
| **Related source doc** | PROGRESSION-EVENT-VALIDITY.md |

### ST-PRG-006 — SUPERSEDED

| Field | Value |
|-------|-------|
| **System** | Event validity |
| **Meaning** | Replaced by a later authoritative event or correction for the same subject matter |
| **Entry events** | Later authoritative replacement |
| **Exit events** | Terminal for influence; history retained |
| **User-visible** | Via corrected standing |
| **Appealable** | Yes (dispute of supersession) |
| **Provisional** | No |
| **Sensitive** | Per case |
| **Related source doc** | PROGRESSION-EVENT-VALIDITY.md |

### ST-PRG-007 — UNDER_INTEGRITY_REVIEW

| Field | Value |
|-------|-------|
| **System** | Event validity |
| **Meaning** | Held pending integrity adjudication; must not silently harden into permanent standing |
| **Entry events** | Integrity hold / serious contest |
| **Exit events** | VALID, REJECTED, REVERSED, or SUPERSEDED per outcome |
| **User-visible** | Yes (hold notice; detail may be scoped) |
| **Appealable** | Yes |
| **Provisional** | Yes |
| **Sensitive** | High |
| **Related source doc** | PROGRESSION-EVENT-VALIDITY.md |

---

## B. Momentum (9)

Source: [MOMENTUM-LEAGUE-ARCHITECTURE.md](../momentum/MOMENTUM-LEAGUE-ARCHITECTURE.md)

### ST-PRG-008 — UNRANKED

| Field | Value |
|-------|-------|
| **System** | Momentum |
| **Meaning** | Not participating in active league evaluation |
| **Entry events** | Season opt-out / ineligibility / pre-season |
| **Exit events** | Enter PLACEMENT or remain UNRANKED |
| **User-visible** | Yes |
| **Appealable** | Eligibility disputes yes |
| **Provisional** | No |
| **Sensitive** | No |
| **Related source doc** | MOMENTUM-LEAGUE-ARCHITECTURE.md |

### ST-PRG-009 — PLACEMENT

| Field | Value |
|-------|-------|
| **System** | Momentum |
| **Meaning** | Being placed into an initial league for the season |
| **Entry events** | Season join / placement window |
| **Exit events** | ACTIVE (or UNRANKED if ineligible) |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Yes |
| **Sensitive** | No |
| **Related source doc** | MOMENTUM-LEAGUE-ARCHITECTURE.md |

### ST-PRG-010 — ACTIVE

| Field | Value |
|-------|-------|
| **System** | Momentum |
| **Meaning** | Participating with standing in a league |
| **Entry events** | Placement complete; return from PROMOTED/DEMOTED/MAINTAINED |
| **Exit events** | AT_RISK, PROMOTED, MAINTAINED, DEMOTED, SEASON_CLOSED, RECOVERING |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | No (live season standing may still finalize later) |
| **Sensitive** | No |
| **Related source doc** | MOMENTUM-LEAGUE-ARCHITECTURE.md |

### ST-PRG-011 — AT_RISK

| Field | Value |
|-------|-------|
| **System** | Momentum |
| **Meaning** | Below maintenance expectations; demotion risk if unrecovered |
| **Entry events** | Maintenance shortfall signals (thresholds PENDING) |
| **Exit events** | RECOVERING, ACTIVE, DEMOTED, SEASON_CLOSED |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Yes (warning band) |
| **Sensitive** | No |
| **Related source doc** | MOMENTUM-LEAGUE-ARCHITECTURE.md |

### ST-PRG-012 — RECOVERING

| Field | Value |
|-------|-------|
| **System** | Momentum |
| **Meaning** | Supported return/recovery path after leave, gap, or demotion risk |
| **Entry events** | Return / recovery path start |
| **Exit events** | ACTIVE, AT_RISK, DEMOTED, SEASON_CLOSED |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Yes |
| **Sensitive** | No |
| **Related source doc** | MOMENTUM-LEAGUE-ARCHITECTURE.md |

### ST-PRG-013 — PROMOTED

| Field | Value |
|-------|-------|
| **System** | Momentum |
| **Meaning** | Recently promoted; may transition back to ACTIVE |
| **Entry events** | MOMENTUM_PROMOTION |
| **Exit events** | ACTIVE, SEASON_CLOSED |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Transient marker |
| **Sensitive** | No |
| **Related source doc** | MOMENTUM-LEAGUE-ARCHITECTURE.md |

### ST-PRG-014 — MAINTAINED

| Field | Value |
|-------|-------|
| **System** | Momentum |
| **Meaning** | Met maintenance for the evaluation period |
| **Entry events** | Maintenance success (thresholds PENDING) |
| **Exit events** | ACTIVE, SEASON_CLOSED |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Period marker |
| **Sensitive** | No |
| **Related source doc** | MOMENTUM-LEAGUE-ARCHITECTURE.md |

### ST-PRG-015 — DEMOTED

| Field | Value |
|-------|-------|
| **System** | Momentum |
| **Meaning** | Recently demoted; may transition to ACTIVE/RECOVERING |
| **Entry events** | MOMENTUM_DEMOTION |
| **Exit events** | ACTIVE, RECOVERING, SEASON_CLOSED |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Transient marker |
| **Sensitive** | No |
| **Related source doc** | MOMENTUM-LEAGUE-ARCHITECTURE.md |

### ST-PRG-016 — SEASON_CLOSED

| Field | Value |
|-------|-------|
| **System** | Momentum |
| **Meaning** | Season ended; live evaluation paused pending next season |
| **Entry events** | Season close |
| **Exit events** | Next-season UNRANKED/PLACEMENT |
| **User-visible** | Yes |
| **Appealable** | Post-season corrections yes |
| **Provisional** | No (season closed); boards may still be provisional elsewhere |
| **Sensitive** | No |
| **Related source doc** | MOMENTUM-LEAGUE-ARCHITECTURE.md |

---

## C. Mastery (11)

Source: [ROUTE-MASTERY-ARCHITECTURE.md](../mastery/ROUTE-MASTERY-ARCHITECTURE.md)

### ST-PRG-017 — NOT_ASSESSED

| Field | Value |
|-------|-------|
| **System** | Mastery |
| **Meaning** | No meaningful Mastery evaluation yet |
| **Entry events** | Default / new scope |
| **Exit events** | EVIDENCE_IN_PROGRESS or later assessed states |
| **User-visible** | Yes |
| **Appealable** | N/A |
| **Provisional** | No |
| **Sensitive** | No |
| **Related source doc** | ROUTE-MASTERY-ARCHITECTURE.md |

### ST-PRG-018 — EVIDENCE_IN_PROGRESS

| Field | Value |
|-------|-------|
| **System** | Mastery |
| **Meaning** | Learner is producing Evidence / working toward demonstration |
| **Entry events** | Evidence work started |
| **Exit events** | EVIDENCE_UNDER_REVIEW, DEVELOPING, NOT_ASSESSED |
| **User-visible** | Yes |
| **Appealable** | Limited |
| **Provisional** | Yes |
| **Sensitive** | No |
| **Related source doc** | ROUTE-MASTERY-ARCHITECTURE.md |

### ST-PRG-019 — EVIDENCE_UNDER_REVIEW

| Field | Value |
|-------|-------|
| **System** | Mastery |
| **Meaning** | Submitted Evidence or Capstone is in review |
| **Entry events** | Evidence/Capstone submission |
| **Exit events** | DEVELOPING, STANDARD_DEMONSTRATED+, SUSPENDED_PENDING_INTEGRITY |
| **User-visible** | Yes |
| **Appealable** | After outcome |
| **Provisional** | Yes |
| **Sensitive** | Review materials restricted |
| **Related source doc** | ROUTE-MASTERY-ARCHITECTURE.md |

### ST-PRG-020 — DEVELOPING

| Field | Value |
|-------|-------|
| **System** | Mastery |
| **Meaning** | Demonstrations exist but do not yet meet standard aggregation for claimed standing |
| **Entry events** | Partial / below-standard outcomes |
| **Exit events** | STANDARD_DEMONSTRATED+, EVIDENCE_IN_PROGRESS, REFRESH_RECOMMENDED |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | No |
| **Sensitive** | No |
| **Related source doc** | ROUTE-MASTERY-ARCHITECTURE.md |

### ST-PRG-021 — STANDARD_DEMONSTRATED

| Field | Value |
|-------|-------|
| **System** | Mastery |
| **Meaning** | Governed standard demonstration achieved for the scoped claim (aggregation PENDING 1B) |
| **Entry events** | MASTERY_UPDATE at standard band |
| **Exit events** | STRONG/ADVANCED bands, REFRESH_RECOMMENDED, REEVALUATION_REQUIRED, SUSPENDED, REVOKED |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | No |
| **Sensitive** | Elevated for some domains |
| **Related source doc** | ROUTE-MASTERY-ARCHITECTURE.md |

### ST-PRG-022 — STRONG_DEMONSTRATION

| Field | Value |
|-------|-------|
| **System** | Mastery |
| **Meaning** | Sustained / strong demonstration beyond baseline for the scoped claim (aggregation PENDING 1B) |
| **Entry events** | MASTERY_UPDATE at strong band |
| **Exit events** | ADVANCED, REFRESH_RECOMMENDED, REEVALUATION_REQUIRED, SUSPENDED, REVOKED |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | No |
| **Sensitive** | Elevated |
| **Related source doc** | ROUTE-MASTERY-ARCHITECTURE.md |

### ST-PRG-023 — ADVANCED_DEMONSTRATION

| Field | Value |
|-------|-------|
| **System** | Mastery |
| **Meaning** | Advanced demonstration band for the scoped claim (aggregation PENDING 1B) — still not employment certification |
| **Entry events** | MASTERY_UPDATE at advanced band |
| **Exit events** | REFRESH_RECOMMENDED, REEVALUATION_REQUIRED, SUSPENDED, REVOKED |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | No |
| **Sensitive** | Elevated |
| **Related source doc** | ROUTE-MASTERY-ARCHITECTURE.md |

### ST-PRG-024 — REFRESH_RECOMMENDED

| Field | Value |
|-------|-------|
| **System** | Mastery (dual-use with Freshness) |
| **Meaning** | Historical Achievement remains; Current Demonstration should be refreshed |
| **Entry events** | Freshness triggers (tech change, etc.); timers PENDING |
| **Exit events** | Restored demonstration bands after refresh, or REEVALUATION_REQUIRED |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Advisory (not revocation) |
| **Sensitive** | No–elevated |
| **Related source doc** | ROUTE-MASTERY-ARCHITECTURE.md · MASTERY-FRESHNESS-ARCHITECTURE.md |

### ST-PRG-025 — REEVALUATION_REQUIRED

| Field | Value |
|-------|-------|
| **System** | Mastery (dual-use with Freshness) |
| **Meaning** | Standing must be reevaluated before dependent claims may rely on it |
| **Entry events** | MASTERY_REEVALUATION; regulatory/integrity/major shift triggers |
| **Exit events** | Restored bands, SUSPENDED, REVOKED |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Hold on dependent claims |
| **Sensitive** | Elevated–high |
| **Related source doc** | ROUTE-MASTERY-ARCHITECTURE.md · MASTERY-FRESHNESS-ARCHITECTURE.md |

### ST-PRG-026 — SUSPENDED_PENDING_INTEGRITY

| Field | Value |
|-------|-------|
| **System** | Mastery |
| **Meaning** | Mastery claims paused while integrity review is open |
| **Entry events** | Integrity hold on supporting Evidence/events |
| **Exit events** | Restored bands, REEVALUATION_REQUIRED, REVOKED |
| **User-visible** | Yes (scoped detail) |
| **Appealable** | Yes |
| **Provisional** | Yes |
| **Sensitive** | High |
| **Related source doc** | ROUTE-MASTERY-ARCHITECTURE.md |

### ST-PRG-027 — REVOKED

| Field | Value |
|-------|-------|
| **System** | Mastery |
| **Meaning** | Prior standing revoked for governed cause; history retained for audit |
| **Entry events** | Revocation after integrity / voided Evidence |
| **Exit events** | New assessment path may start at NOT_ASSESSED/DEVELOPING; history remains |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | No |
| **Sensitive** | High |
| **Related source doc** | ROUTE-MASTERY-ARCHITECTURE.md |

---

## D. Trust (8)

Source: Trust Standing architecture (`PGS-TRU`); aligned with system separation and automation boundary.

### ST-PRG-028 — UNESTABLISHED

| Field | Value |
|-------|-------|
| **System** | Trust |
| **Meaning** | Trust Standing not yet established for the subject |
| **Entry events** | New account / Crow subject |
| **Exit events** | NORMAL or REVIEW_REQUIRED |
| **User-visible** | Limited |
| **Appealable** | Limited |
| **Provisional** | Yes |
| **Sensitive** | Age/identity aspects may be sensitive |
| **Related source doc** | PROGRESSION-SYSTEM-SEPARATION.md · AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md |

### ST-PRG-029 — NORMAL

| Field | Value |
|-------|-------|
| **System** | Trust |
| **Meaning** | Default good-standing participation Trust |
| **Entry events** | Establishment / restoration to baseline |
| **Exit events** | POSITIVE_STANDING, REVIEW_REQUIRED, RESTRICTED |
| **User-visible** | Yes |
| **Appealable** | Yes if wrongly restricted later |
| **Provisional** | No |
| **Sensitive** | No |
| **Related source doc** | PROGRESSION-SYSTEM-SEPARATION.md |

### ST-PRG-030 — POSITIVE_STANDING

| Field | Value |
|-------|-------|
| **System** | Trust |
| **Meaning** | Positive reliability standing above baseline (not Skill, not Prestige) |
| **Entry events** | Sustained integrity-positive signals (rules PENDING) |
| **Exit events** | NORMAL, ELEVATED_RESPONSIBILITY_ELIGIBLE, REVIEW_REQUIRED |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | No |
| **Sensitive** | No–elevated |
| **Related source doc** | PROGRESSION-SYSTEM-SEPARATION.md |

### ST-PRG-031 — ELEVATED_RESPONSIBILITY_ELIGIBLE

| Field | Value |
|-------|-------|
| **System** | Trust |
| **Meaning** | Eligible for elevated responsibility / authority roles under policy |
| **Entry events** | Eligibility assessment; **human required for minors** |
| **Exit events** | POSITIVE_STANDING, REVIEW_REQUIRED, RESTRICTED, REVOKED_AUTHORITY |
| **User-visible** | Yes (role surfaces) |
| **Appealable** | Yes |
| **Provisional** | Eligibility ≠ grant of every privilege |
| **Sensitive** | High (especially minors) |
| **Related source doc** | AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md |

### ST-PRG-032 — REVIEW_REQUIRED

| Field | Value |
|-------|-------|
| **System** | Trust |
| **Meaning** | Trust subject to active review; privileges may be limited pending outcome |
| **Entry events** | Integrity flags / contested cases |
| **Exit events** | NORMAL, POSITIVE_STANDING, RESTRICTED, SUSPENDED, restored bands |
| **User-visible** | Yes (scoped) |
| **Appealable** | Yes |
| **Provisional** | Yes |
| **Sensitive** | High |
| **Related source doc** | AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md |

### ST-PRG-033 — RESTRICTED

| Field | Value |
|-------|-------|
| **System** | Trust |
| **Meaning** | Participation restricted under Trust policy |
| **Entry events** | TRUST_RESTRICTION |
| **Exit events** | TRUST_RESTORATION → NORMAL/POSITIVE; or SUSPENDED / REVOKED_AUTHORITY |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | No (unless marked provisional restriction) |
| **Sensitive** | High |
| **Related source doc** | PROGRESSION-DECISION-REGISTRY.md (DEC-PRG-009) |

### ST-PRG-034 — SUSPENDED

| Field | Value |
|-------|-------|
| **System** | Trust |
| **Meaning** | Trust suspension of participation privileges |
| **Entry events** | Serious integrity outcome |
| **Exit events** | Restoration path or REVOKED_AUTHORITY |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | No |
| **Sensitive** | High |
| **Related source doc** | AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md |

### ST-PRG-035 — REVOKED_AUTHORITY

| Field | Value |
|-------|-------|
| **System** | Trust |
| **Meaning** | Elevated authority / responsibility permanently or durably revoked |
| **Entry events** | Human irreversible Trust decision |
| **Exit events** | Only via exceptional Founder-governed restoration policy |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | No |
| **Sensitive** | High |
| **Related source doc** | AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md |

---

## E. Titles (9)

### ST-PRG-036 — NOT_ELIGIBLE

| Field | Value |
|-------|-------|
| **System** | Titles |
| **Meaning** | Not eligible for the Title scope |
| **Entry events** | Default / prerequisites unmet |
| **Exit events** | PROGRESS_VISIBLE |
| **User-visible** | Yes |
| **Appealable** | Eligibility disputes yes |
| **Provisional** | No |
| **Sensitive** | No |
| **Related source doc** | PROGRESSION-DECISION-REGISTRY.md (TITLE_*) |

### ST-PRG-037 — PROGRESS_VISIBLE

| Field | Value |
|-------|-------|
| **System** | Titles |
| **Meaning** | Progress toward Title eligibility is visible |
| **Entry events** | Partial prerequisites met |
| **Exit events** | ELIGIBLE_FOR_REVIEW, NOT_ELIGIBLE |
| **User-visible** | Yes |
| **Appealable** | Limited |
| **Provisional** | Yes |
| **Sensitive** | No |
| **Related source doc** | PROGRESSION-DECISION-REGISTRY.md |

### ST-PRG-038 — ELIGIBLE_FOR_REVIEW

| Field | Value |
|-------|-------|
| **System** | Titles |
| **Meaning** | TITLE_ELIGIBILITY satisfied; awaiting review/grant path |
| **Entry events** | TITLE_ELIGIBILITY |
| **Exit events** | UNDER_REVIEW, GRANTED, NOT_ELIGIBLE |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Yes |
| **Sensitive** | Elevated |
| **Related source doc** | DEC-PRG-011 |

### ST-PRG-039 — UNDER_REVIEW

| Field | Value |
|-------|-------|
| **System** | Titles |
| **Meaning** | Human Title review in progress |
| **Entry events** | Review opened |
| **Exit events** | GRANTED, ELIGIBLE_FOR_REVIEW, NOT_ELIGIBLE |
| **User-visible** | Yes |
| **Appealable** | After outcome |
| **Provisional** | Yes |
| **Sensitive** | Elevated–high |
| **Related source doc** | DEC-PRG-012 |

### ST-PRG-040 — GRANTED

| Field | Value |
|-------|-------|
| **System** | Titles |
| **Meaning** | Title granted under policy |
| **Entry events** | TITLE_GRANT |
| **Exit events** | REFRESH_RECOMMENDED, SUSPENDED, REVOKED, RETIRED |
| **User-visible** | Yes (public only if approved field) |
| **Appealable** | Revocation appealable |
| **Provisional** | No |
| **Sensitive** | High for professional Titles |
| **Related source doc** | DEC-PRG-012 |

### ST-PRG-041 — REFRESH_RECOMMENDED

| Field | Value |
|-------|-------|
| **System** | Titles |
| **Meaning** | Granted Title remains, but refresh of supporting demonstration is recommended |
| **Entry events** | Freshness / policy refresh signal |
| **Exit events** | GRANTED (after refresh), SUSPENDED, REVOKED |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Advisory |
| **Sensitive** | Elevated |
| **Related source doc** | MASTERY-FRESHNESS-ARCHITECTURE.md (Title application) |

### ST-PRG-042 — SUSPENDED

| Field | Value |
|-------|-------|
| **System** | Titles |
| **Meaning** | Title privileges suspended pending resolution |
| **Entry events** | Integrity / policy suspension |
| **Exit events** | GRANTED, REVOKED |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Yes |
| **Sensitive** | High |
| **Related source doc** | DEC-PRG-013 |

### ST-PRG-043 — REVOKED

| Field | Value |
|-------|-------|
| **System** | Titles |
| **Meaning** | Title revoked; history retained |
| **Entry events** | TITLE_REVOCATION |
| **Exit events** | NOT_ELIGIBLE / new eligibility path |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | No |
| **Sensitive** | High |
| **Related source doc** | DEC-PRG-013 |

### ST-PRG-044 — RETIRED

| Field | Value |
|-------|-------|
| **System** | Titles |
| **Meaning** | Title retired from active catalogue or subject retirement; historical grant may remain labeled retired |
| **Entry events** | Catalogue retirement / governed retirement |
| **Exit events** | Terminal for that Title version |
| **User-visible** | Yes (historical) |
| **Appealable** | Limited |
| **Provisional** | No |
| **Sensitive** | Elevated |
| **Related source doc** | Titles architecture (1A vocabulary lock) |

---

## F. Prestige (11)

### ST-PRG-045 — NOT_ELIGIBLE

| Field | Value |
|-------|-------|
| **System** | Prestige |
| **Meaning** | Not eligible for Prestige Class consideration |
| **Entry events** | Default |
| **Exit events** | PROGRESS_VISIBLE |
| **User-visible** | Yes |
| **Appealable** | Eligibility disputes yes |
| **Provisional** | No |
| **Sensitive** | No |
| **Related source doc** | DEC-PRG-014 |

### ST-PRG-046 — PROGRESS_VISIBLE

| Field | Value |
|-------|-------|
| **System** | Prestige |
| **Meaning** | Progress toward Prestige eligibility is visible |
| **Entry events** | Partial prerequisites |
| **Exit events** | ELIGIBLE_FOR_NOMINATION, NOT_ELIGIBLE |
| **User-visible** | Yes |
| **Appealable** | Limited |
| **Provisional** | Yes |
| **Sensitive** | Elevated |
| **Related source doc** | DEC-PRG-014 |

### ST-PRG-047 — ELIGIBLE_FOR_NOMINATION

| Field | Value |
|-------|-------|
| **System** | Prestige |
| **Meaning** | PRESTIGE_ELIGIBILITY satisfied; nomination may proceed |
| **Entry events** | PRESTIGE_ELIGIBILITY |
| **Exit events** | NOMINATED, PROGRESS_VISIBLE |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Yes |
| **Sensitive** | High |
| **Related source doc** | DEC-PRG-014 |

### ST-PRG-048 — NOMINATED

| Field | Value |
|-------|-------|
| **System** | Prestige |
| **Meaning** | Nominated for Prestige review |
| **Entry events** | Nomination recorded |
| **Exit events** | UNDER_REVIEW, ELIGIBLE_FOR_NOMINATION |
| **User-visible** | Yes |
| **Appealable** | Limited until review outcome |
| **Provisional** | Yes |
| **Sensitive** | High |
| **Related source doc** | DEC-PRG-015 |

### ST-PRG-049 — UNDER_REVIEW

| Field | Value |
|-------|-------|
| **System** | Prestige |
| **Meaning** | Human Prestige review in progress |
| **Entry events** | Review opened (**human only** for grant path) |
| **Exit events** | ADDITIONAL_EVIDENCE_REQUIRED, GRANTED, ELIGIBLE_FOR_NOMINATION |
| **User-visible** | Yes |
| **Appealable** | After outcome |
| **Provisional** | Yes |
| **Sensitive** | High |
| **Related source doc** | DEC-PRG-015 · AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md |

### ST-PRG-050 — ADDITIONAL_EVIDENCE_REQUIRED

| Field | Value |
|-------|-------|
| **System** | Prestige |
| **Meaning** | Review paused pending additional Evidence |
| **Entry events** | Reviewer request |
| **Exit events** | UNDER_REVIEW, ELIGIBLE_FOR_NOMINATION |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Yes |
| **Sensitive** | High |
| **Related source doc** | DEC-PRG-015 |

### ST-PRG-051 — GRANTED

| Field | Value |
|-------|-------|
| **System** | Prestige |
| **Meaning** | Prestige Class granted by human decision |
| **Entry events** | PRESTIGE_GRANT |
| **Exit events** | SUSPENDED, REEVALUATION_REQUIRED, REVOKED, RETIRED_WITH_HISTORY |
| **User-visible** | Yes (approved public fields only) |
| **Appealable** | Suspension/revocation appealable |
| **Provisional** | No |
| **Sensitive** | High |
| **Related source doc** | DEC-PRG-015 |

### ST-PRG-052 — SUSPENDED

| Field | Value |
|-------|-------|
| **System** | Prestige |
| **Meaning** | Prestige suspended pending resolution |
| **Entry events** | PRESTIGE_SUSPENSION |
| **Exit events** | GRANTED, REEVALUATION_REQUIRED, REVOKED |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Yes |
| **Sensitive** | High |
| **Related source doc** | DEC-PRG-016 |

### ST-PRG-053 — REEVALUATION_REQUIRED

| Field | Value |
|-------|-------|
| **System** | Prestige |
| **Meaning** | Granted Prestige cannot be relied on until reevaluation completes |
| **Entry events** | Integrity / policy reevaluation trigger |
| **Exit events** | GRANTED, SUSPENDED, REVOKED |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Hold |
| **Sensitive** | High |
| **Related source doc** | DEC-PRG-016 |

### ST-PRG-054 — REVOKED

| Field | Value |
|-------|-------|
| **System** | Prestige |
| **Meaning** | Prestige revoked; permanent revocation is human-only |
| **Entry events** | Human permanent revocation |
| **Exit events** | RETIRED_WITH_HISTORY / NOT_ELIGIBLE |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | No |
| **Sensitive** | High |
| **Related source doc** | AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md |

### ST-PRG-055 — RETIRED_WITH_HISTORY

| Field | Value |
|-------|-------|
| **System** | Prestige |
| **Meaning** | Prestige Class or grant retired; historical record retained |
| **Entry events** | Catalogue/subject retirement |
| **Exit events** | Terminal for that Class version |
| **User-visible** | Historical |
| **Appealable** | Limited |
| **Provisional** | No |
| **Sensitive** | High |
| **Related source doc** | Prestige architecture (1A vocabulary lock) |

---

## G. Leaderboards (9)

### ST-PRG-056 — NOT_ELIGIBLE

| Field | Value |
|-------|-------|
| **System** | Leaderboards |
| **Meaning** | Not eligible for the board |
| **Entry events** | Default / filtered out |
| **Exit events** | ELIGIBLE |
| **User-visible** | Often implicit |
| **Appealable** | Eligibility yes |
| **Provisional** | No |
| **Sensitive** | No |
| **Related source doc** | DEC-PRG-019 |

### ST-PRG-057 — ELIGIBLE

| Field | Value |
|-------|-------|
| **System** | Leaderboards |
| **Meaning** | Eligible but not yet placed |
| **Entry events** | Eligibility satisfied |
| **Exit events** | PLACED, PROVISIONAL, NOT_ELIGIBLE |
| **User-visible** | Optional |
| **Appealable** | Yes |
| **Provisional** | Yes |
| **Sensitive** | No |
| **Related source doc** | DEC-PRG-019 |

### ST-PRG-058 — PLACED

| Field | Value |
|-------|-------|
| **System** | Leaderboards |
| **Meaning** | Placed on the board (pre-final semantics depend on board) |
| **Entry events** | LEADERBOARD_PLACEMENT |
| **Exit events** | PROVISIONAL, FINAL, UNDER_REVIEW, REMOVED |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Board-dependent |
| **Sensitive** | No–elevated |
| **Related source doc** | DEC-PRG-019 |

### ST-PRG-059 — PROVISIONAL

| Field | Value |
|-------|-------|
| **System** | Leaderboards |
| **Meaning** | Provisional placement; explicitly non-final |
| **Entry events** | Automated provisional compute |
| **Exit events** | FINAL, UNDER_REVIEW, CORRECTED, REMOVED |
| **User-visible** | Yes (must be labeled provisional) |
| **Appealable** | Yes |
| **Provisional** | Yes |
| **Sensitive** | No |
| **Related source doc** | AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md |

### ST-PRG-060 — FINAL

| Field | Value |
|-------|-------|
| **System** | Leaderboards |
| **Meaning** | Finalized placement for the board period |
| **Entry events** | Season/board finalization |
| **Exit events** | CORRECTED, UNDER_REVIEW, SEASON_ARCHIVED |
| **User-visible** | Yes |
| **Appealable** | Yes (correction path) |
| **Provisional** | No |
| **Sensitive** | Elevated for public boards |
| **Related source doc** | DEC-PRG-019 |

### ST-PRG-061 — UNDER_REVIEW

| Field | Value |
|-------|-------|
| **System** | Leaderboards |
| **Meaning** | Placement under integrity/correction review |
| **Entry events** | Contest / integrity hold |
| **Exit events** | FINAL, CORRECTED, REMOVED, PROVISIONAL |
| **User-visible** | Yes |
| **Appealable** | In progress |
| **Provisional** | Yes |
| **Sensitive** | Elevated–high |
| **Related source doc** | DEC-PRG-020 |

### ST-PRG-062 — CORRECTED

| Field | Value |
|-------|-------|
| **System** | Leaderboards |
| **Meaning** | Placement amended after correction; prior snapshot auditable |
| **Entry events** | LEADERBOARD_CORRECTION |
| **Exit events** | FINAL, SEASON_ARCHIVED, UNDER_REVIEW |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | No |
| **Sensitive** | Elevated |
| **Related source doc** | DEC-PRG-020 |

### ST-PRG-063 — REMOVED

| Field | Value |
|-------|-------|
| **System** | Leaderboards |
| **Meaning** | Removed from board display/standing |
| **Entry events** | Ineligibility, integrity, or correction removal |
| **Exit events** | ELIGIBLE / NOT_ELIGIBLE; archive retains audit |
| **User-visible** | Yes when formerly placed |
| **Appealable** | Yes |
| **Provisional** | No |
| **Sensitive** | Elevated–high |
| **Related source doc** | DEC-PRG-020 |

### ST-PRG-064 — SEASON_ARCHIVED

| Field | Value |
|-------|-------|
| **System** | Leaderboards |
| **Meaning** | Board/season archived; historical snapshot retained |
| **Entry events** | Season archive |
| **Exit events** | Terminal for live board; history queryable |
| **User-visible** | Historical |
| **Appealable** | Within policy windows |
| **Provisional** | No |
| **Sensitive** | Per board privacy |
| **Related source doc** | PROGRESSION-DATA-MINIMIZATION.md |

---

## H. Corrections (8)

### ST-PRG-065 — CORRECTION_REQUESTED

| Field | Value |
|-------|-------|
| **System** | Corrections |
| **Meaning** | Correction case opened |
| **Entry events** | Learner/ops/system request |
| **Exit events** | UNDER_REVIEW, REJECTED |
| **User-visible** | Yes to requester |
| **Appealable** | N/A (is the request) |
| **Provisional** | Yes |
| **Sensitive** | Case-dependent |
| **Related source doc** | PROGRESSION-LEDGER-MODEL.md (correction ledger) |

### ST-PRG-066 — UNDER_REVIEW

| Field | Value |
|-------|-------|
| **System** | Corrections |
| **Meaning** | Correction under review |
| **Entry events** | From CORRECTION_REQUESTED |
| **Exit events** | APPROVED, REJECTED |
| **User-visible** | Yes to parties |
| **Appealable** | After outcome |
| **Provisional** | Yes |
| **Sensitive** | Elevated–high for major reputation |
| **Related source doc** | AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md |

### ST-PRG-067 — APPROVED

| Field | Value |
|-------|-------|
| **System** | Corrections |
| **Meaning** | Correction approved; not yet applied |
| **Entry events** | Review approval (human for major cases) |
| **Exit events** | APPLIED |
| **User-visible** | Yes |
| **Appealable** | Opponent appeal paths per policy |
| **Provisional** | Pre-apply |
| **Sensitive** | Elevated |
| **Related source doc** | DEC-PRG-020 |

### ST-PRG-068 — REJECTED

| Field | Value |
|-------|-------|
| **System** | Corrections |
| **Meaning** | Correction request rejected |
| **Entry events** | Review rejection |
| **Exit events** | APPEALED or terminal |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | No |
| **Sensitive** | Case-dependent |
| **Related source doc** | Corrections vocabulary (1A) |

### ST-PRG-069 — APPLIED

| Field | Value |
|-------|-------|
| **System** | Corrections |
| **Meaning** | Approved correction applied to standing/ledgers |
| **Entry events** | Apply step after APPROVED |
| **Exit events** | REVERSED, APPEALED |
| **User-visible** | Yes via standing change |
| **Appealable** | Yes |
| **Provisional** | No |
| **Sensitive** | Elevated |
| **Related source doc** | PROGRESSION-LEDGER-MODEL.md |

### ST-PRG-070 — REVERSED

| Field | Value |
|-------|-------|
| **System** | Corrections |
| **Meaning** | Applied correction itself reversed |
| **Entry events** | Further correction / appeal overturn |
| **Exit events** | APPEAL_RESOLVED or new correction cycle |
| **User-visible** | Yes |
| **Appealable** | Limited |
| **Provisional** | No |
| **Sensitive** | Elevated |
| **Related source doc** | PROGRESSION-LEDGER-MODEL.md |

### ST-PRG-071 — APPEALED

| Field | Value |
|-------|-------|
| **System** | Corrections |
| **Meaning** | Appeal filed against a correction outcome |
| **Entry events** | Appeal submission |
| **Exit events** | APPEAL_RESOLVED |
| **User-visible** | Yes to parties |
| **Appealable** | In progress |
| **Provisional** | Yes |
| **Sensitive** | High |
| **Related source doc** | AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md |

### ST-PRG-072 — APPEAL_RESOLVED

| Field | Value |
|-------|-------|
| **System** | Corrections |
| **Meaning** | Appeal resolved; automation must not override approved appeal |
| **Entry events** | Human appeal resolution |
| **Exit events** | Terminal for that appeal; may spawn APPLIED/REVERSED effects |
| **User-visible** | Yes |
| **Appealable** | Further appeal only if policy allows |
| **Provisional** | No |
| **Sensitive** | High |
| **Related source doc** | AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md |

---

## I. Freshness overlays (2)

Source: [MASTERY-FRESHNESS-ARCHITECTURE.md](../mastery/MASTERY-FRESHNESS-ARCHITECTURE.md)

These are **interpretive overlays**, not a second Mastery machine. `REFRESH_RECOMMENDED` / `REEVALUATION_REQUIRED` remain Mastery states ST-PRG-024 / ST-PRG-025 (counted once above).

### ST-PRG-073 — HISTORICAL_ACHIEVEMENT

| Field | Value |
|-------|-------|
| **System** | Freshness overlay (Mastery-related) |
| **Meaning** | Durable record that a demonstration / Proven / Mastery-related event occurred in the past |
| **Entry events** | Historical grant / Proven / Mastery achievement recorded |
| **Exit events** | Overlay persists even if Current Demonstration weakens; not deleted by ordinary refresh |
| **User-visible** | Yes (Flight Log / history) |
| **Appealable** | Integrity disputes yes |
| **Provisional** | No |
| **Sensitive** | Case-dependent |
| **Related source doc** | MASTERY-FRESHNESS-ARCHITECTURE.md |

### ST-PRG-074 — CURRENT_DEMONSTRATION

| Field | Value |
|-------|-------|
| **System** | Freshness overlay (Mastery-related) |
| **Meaning** | Whether standing is considered presently representative for currency-dependent claims |
| **Entry events** | Fresh demonstration / successful refresh |
| **Exit events** | Weakens into Mastery REFRESH_RECOMMENDED / REEVALUATION_REQUIRED without erasing HISTORICAL_ACHIEVEMENT |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Currency is evaluative |
| **Sensitive** | Elevated for regulated domains |
| **Related source doc** | MASTERY-FRESHNESS-ARCHITECTURE.md |

---

## J. Maturity advancement process (4)

Ranks remain `MAT-*` identities in [MATURITY-RANK-ARCHITECTURE.md](../maturity/MATURITY-RANK-ARCHITECTURE.md). These states describe advancement **process**, not the Rank ladder itself.

### ST-PRG-075 — HOLDING_RANK

| Field | Value |
|-------|-------|
| **System** | Maturity |
| **Meaning** | Stable at current Maturity Rank |
| **Entry events** | Default after Rank assignment / advancement settles |
| **Exit events** | ADVANCEMENT_CANDIDATE, ADVANCEMENT_HELD |
| **User-visible** | Yes (as current Rank) |
| **Appealable** | Limited |
| **Provisional** | No |
| **Sensitive** | No |
| **Related source doc** | MATURITY-RANK-ARCHITECTURE.md |

### ST-PRG-076 — ADVANCEMENT_CANDIDATE

| Field | Value |
|-------|-------|
| **System** | Maturity |
| **Meaning** | Surfaced as candidate for Rank advancement (thresholds PENDING) |
| **Entry events** | Progress signals / eligibility surfacing |
| **Exit events** | ADVANCEMENT_UNDER_REVIEW, HOLDING_RANK, ADVANCEMENT_HELD |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Yes |
| **Sensitive** | Elevated |
| **Related source doc** | DEC-PRG-005 |

### ST-PRG-077 — ADVANCEMENT_UNDER_REVIEW

| Field | Value |
|-------|-------|
| **System** | Maturity |
| **Meaning** | Advancement under review where policy requires judgment |
| **Entry events** | Review opened |
| **Exit events** | HOLDING_RANK (advanced or not), ADVANCEMENT_HELD |
| **User-visible** | Yes |
| **Appealable** | After outcome |
| **Provisional** | Yes |
| **Sensitive** | Elevated |
| **Related source doc** | DEC-PRG-005 |

### ST-PRG-078 — ADVANCEMENT_HELD

| Field | Value |
|-------|-------|
| **System** | Maturity |
| **Meaning** | Advancement blocked pending integrity / Trust / Evidence holds |
| **Entry events** | Integrity hold affecting Maturity path |
| **Exit events** | HOLDING_RANK, ADVANCEMENT_CANDIDATE |
| **User-visible** | Yes |
| **Appealable** | Yes |
| **Provisional** | Yes |
| **Sensitive** | High |
| **Related source doc** | MATURITY-RANK-ARCHITECTURE.md · Trust states |

---

## Exact total verification

| Domain | Count |
|--------|------:|
| Event validity | 7 |
| Momentum | 9 |
| Mastery | 11 |
| Trust | 8 |
| Titles | 9 |
| Prestige | 11 |
| Leaderboards | 9 |
| Corrections | 8 |
| Freshness overlays | 2 |
| Maturity advancement process | 4 |
| **TOTAL STATE COUNT** | **78** |

ID span: **ST-PRG-001** through **ST-PRG-078** inclusive = **78** states.

```text
ARCHITECTURE RECOMMENDED
TOTAL STATE COUNT = 78
FORMULA PENDING · Product Code BLOCKED
```
