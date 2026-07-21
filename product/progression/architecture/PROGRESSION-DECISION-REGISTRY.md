# Progression Decision Registry

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-DEC-REG-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-STATE-REGISTRY.md](./PROGRESSION-STATE-REGISTRY.md) · [PROGRESSION-SOURCE-AUTHORITY.md](./PROGRESSION-SOURCE-AUTHORITY.md) · [PROGRESSION-INVARIANTS.md](./PROGRESSION-INVARIANTS.md) · [../governance/AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md](../governance/AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md) · [../README.md](../README.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING (all decisions) |
| **EXACT DECISION COUNT** | **21** |
| **Change history** | 1.0.0 — GHV.PROGRESSION.1A: register all progression decision types |

---

## Purpose

Register every progression **decision type** with a stable Decision ID (`DEC-PRG-xxx`). Decisions are architectural outcomes — not Product Code, not numeric formulas.

```text
EXACT DECISION COUNT = 21
Final formula dependency for ALL decisions = PENDING (GHV.PROGRESSION.1B+)
```

---

## Field legend

| Field | Meaning |
|-------|---------|
| **Required sources** | Source classes / records that must exist before the decision may finalize |
| **Automated or human** | Who may finalize under [AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md](../governance/AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md) |
| **Explainability** | Whether the learner/reviewer must receive a source-backed “why” |
| **Appealability** | Whether an appeal path is architecturally required |
| **Sensitivity** | Ordinary / elevated / high |
| **Audit** | Whether full before/after audit is mandatory |
| **Reversibility** | Whether a later governed decision may undo standing effects |
| **Final formula dependency** | Always **PENDING** in 1A |

---

## Decision catalog

### DEC-PRG-001 — XP_RECOGNITION

| Field | Value |
|-------|-------|
| **Decision type** | XP_RECOGNITION |
| **System** | Flight XP (`PGS-XP`) |
| **Required sources** | VALID progression-eligible activity/contribution event; approved XP category rules (when locked) |
| **Automated or human** | Automated (after approved rules); human for integrity-linked void/restore paths |
| **Explainability** | Required |
| **Appealability** | Yes (misapplication / integrity) |
| **Sensitivity** | Ordinary (elevated when integrity-linked) |
| **Audit** | Required |
| **Reversibility** | Yes (governed reversal) |
| **Final formula dependency** | PENDING |

### DEC-PRG-002 — MOMENTUM_PLACEMENT

| Field | Value |
|-------|-------|
| **Decision type** | MOMENTUM_PLACEMENT |
| **System** | Momentum League (`PGS-MOM`) |
| **Required sources** | Season participation eligibility; VALID season-activity signals |
| **Automated or human** | Automated (after approved season rules); human if integrity hold blocks placement |
| **Explainability** | Required |
| **Appealability** | Yes |
| **Sensitivity** | Ordinary |
| **Audit** | Required |
| **Reversibility** | Yes (season correction) |
| **Final formula dependency** | PENDING |

### DEC-PRG-003 — MOMENTUM_PROMOTION

| Field | Value |
|-------|-------|
| **Decision type** | MOMENTUM_PROMOTION |
| **System** | Momentum League (`PGS-MOM`) |
| **Required sources** | VALID season standing inputs; approved promotion rules (when locked) |
| **Automated or human** | Automated (after approved rules) |
| **Explainability** | Required |
| **Appealability** | Yes |
| **Sensitivity** | Ordinary |
| **Audit** | Required |
| **Reversibility** | Yes (correction / integrity) |
| **Final formula dependency** | PENDING |

### DEC-PRG-004 — MOMENTUM_DEMOTION

| Field | Value |
|-------|-------|
| **Decision type** | MOMENTUM_DEMOTION |
| **System** | Momentum League (`PGS-MOM`) |
| **Required sources** | VALID maintenance-failure signals; approved demotion rules (when locked) |
| **Automated or human** | Automated (after approved rules); human review if contested integrity caused the standing drop |
| **Explainability** | Required |
| **Appealability** | Yes |
| **Sensitivity** | Ordinary–elevated |
| **Audit** | Required |
| **Reversibility** | Yes |
| **Final formula dependency** | PENDING |

### DEC-PRG-005 — MATURITY_ADVANCEMENT

| Field | Value |
|-------|-------|
| **Decision type** | MATURITY_ADVANCEMENT |
| **System** | Maturity Rank (`PGS-MAT`) |
| **Required sources** | Long-term developmental signals; Evidence quality habits / reflection as Maturity architecture requires; approved Rank rules (when locked) |
| **Automated or human** | Automated eligibility surfacing; human review when Rank policy requires judgment bands |
| **Explainability** | Required |
| **Appealability** | Yes |
| **Sensitivity** | Elevated |
| **Audit** | Required |
| **Reversibility** | Limited (correction / integrity; not casual churn) |
| **Final formula dependency** | PENDING |

### DEC-PRG-006 — MASTERY_UPDATE

| Field | Value |
|-------|-------|
| **Decision type** | MASTERY_UPDATE |
| **System** | Mastery (`PGS-MST`) |
| **Required sources** | Approved Evidence / Capstone / assessment outcomes as scoped; integrity clear |
| **Automated or human** | Automation may aggregate approved Evidence; specialized Evidence paths require human |
| **Explainability** | Required |
| **Appealability** | Yes |
| **Sensitivity** | Elevated–high (domain-dependent) |
| **Audit** | Required |
| **Reversibility** | Yes (reevaluation / revocation paths) |
| **Final formula dependency** | PENDING |

### DEC-PRG-007 — MASTERY_REEVALUATION

| Field | Value |
|-------|-------|
| **Decision type** | MASTERY_REEVALUATION |
| **System** | Mastery (`PGS-MST`) / Freshness overlay |
| **Required sources** | Triggering cause (tech/regulatory/integrity/Evidence revocation); prior Mastery standing record |
| **Automated or human** | Automation may recommend; human required for serious integrity or sensitive claims |
| **Explainability** | Required |
| **Appealability** | Yes |
| **Sensitivity** | Elevated–high |
| **Audit** | Required |
| **Reversibility** | Outcome-dependent (reevaluation may restore, refresh, or revoke) |
| **Final formula dependency** | PENDING |

### DEC-PRG-008 — BREADTH_UPDATE

| Field | Value |
|-------|-------|
| **Decision type** | BREADTH_UPDATE |
| **System** | Breadth (`PGS-BRD`) |
| **Required sources** | Multi-path / Horizon demonstration sources as Breadth architecture defines; approved Evidence where required |
| **Automated or human** | Automation may aggregate approved sources; human for contested / specialized paths |
| **Explainability** | Required |
| **Appealability** | Yes |
| **Sensitivity** | Elevated |
| **Audit** | Required |
| **Reversibility** | Yes |
| **Final formula dependency** | PENDING |

### DEC-PRG-009 — TRUST_RESTRICTION

| Field | Value |
|-------|-------|
| **Decision type** | TRUST_RESTRICTION |
| **System** | Trust Standing (`PGS-TRU`) |
| **Required sources** | Integrity / moderation case records; policy basis |
| **Automated or human** | Automation may apply provisional holds; serious / irreversible restriction requires human |
| **Explainability** | Required (scoped; may withhold investigative detail) |
| **Appealability** | Yes |
| **Sensitivity** | High |
| **Audit** | Required |
| **Reversibility** | Yes via TRUST_RESTORATION (except where policy marks irreversible — human only) |
| **Final formula dependency** | PENDING |

### DEC-PRG-010 — TRUST_RESTORATION

| Field | Value |
|-------|-------|
| **Decision type** | TRUST_RESTORATION |
| **System** | Trust Standing (`PGS-TRU`) |
| **Required sources** | Prior restriction record; resolution / remediation evidence; policy clearance |
| **Automated or human** | Human for serious cases; automation only for explicitly approved low-risk restorations |
| **Explainability** | Required |
| **Appealability** | Yes (if restoration denied) |
| **Sensitivity** | High |
| **Audit** | Required |
| **Reversibility** | N/A (itself a restorative decision; may be re-restricted on new cause) |
| **Final formula dependency** | PENDING |

### DEC-PRG-011 — TITLE_ELIGIBILITY

| Field | Value |
|-------|-------|
| **Decision type** | TITLE_ELIGIBILITY |
| **System** | Titles (`PGS-TTL`) |
| **Required sources** | Mastery / Evidence / Maturity prerequisites per Title policy (when locked) |
| **Automated or human** | Automated identification allowed; does not grant |
| **Explainability** | Required |
| **Appealability** | Yes |
| **Sensitivity** | Elevated |
| **Audit** | Required |
| **Reversibility** | Yes (eligibility may be withdrawn on source change) |
| **Final formula dependency** | PENDING |

### DEC-PRG-012 — TITLE_GRANT

| Field | Value |
|-------|-------|
| **Decision type** | TITLE_GRANT |
| **System** | Titles (`PGS-TTL`) |
| **Required sources** | TITLE_ELIGIBILITY outcome; review dossier for high-impact Titles |
| **Automated or human** | Human required for high-impact Titles; no grant without approved Title policy |
| **Explainability** | Required |
| **Appealability** | Yes (denial / grant dispute paths) |
| **Sensitivity** | High |
| **Audit** | Required |
| **Reversibility** | Via TITLE_REVOCATION |
| **Final formula dependency** | PENDING |

### DEC-PRG-013 — TITLE_REVOCATION

| Field | Value |
|-------|-------|
| **Decision type** | TITLE_REVOCATION |
| **System** | Titles (`PGS-TTL`) |
| **Required sources** | Cause record (integrity, Evidence revocation, policy breach); prior grant |
| **Automated or human** | Human required for sensitive revocation |
| **Explainability** | Required |
| **Appealability** | Yes |
| **Sensitivity** | High |
| **Audit** | Required |
| **Reversibility** | Limited (re-grant only via new TITLE_GRANT) |
| **Final formula dependency** | PENDING |

### DEC-PRG-014 — PRESTIGE_ELIGIBILITY

| Field | Value |
|-------|-------|
| **Decision type** | PRESTIGE_ELIGIBILITY |
| **System** | Prestige (`PGS-PRS`) |
| **Required sources** | Distinction prerequisites per Prestige architecture; Evidence / Trust clear as required |
| **Automated or human** | Automated identification allowed; does not grant |
| **Explainability** | Required |
| **Appealability** | Yes |
| **Sensitivity** | High |
| **Audit** | Required |
| **Reversibility** | Yes (eligibility may lapse) |
| **Final formula dependency** | PENDING |

### DEC-PRG-015 — PRESTIGE_GRANT

| Field | Value |
|-------|-------|
| **Decision type** | PRESTIGE_GRANT |
| **System** | Prestige (`PGS-PRS`) |
| **Required sources** | Nomination / eligibility; human review dossier |
| **Automated or human** | **Human only** — automation MUST NOT independently grant Prestige |
| **Explainability** | Required |
| **Appealability** | Denial appealable per policy |
| **Sensitivity** | High |
| **Audit** | Required |
| **Reversibility** | Via suspension / revocation decisions |
| **Final formula dependency** | PENDING |

### DEC-PRG-016 — PRESTIGE_SUSPENSION

| Field | Value |
|-------|-------|
| **Decision type** | PRESTIGE_SUSPENSION |
| **System** | Prestige (`PGS-PRS`) |
| **Required sources** | Integrity / cause record; prior Prestige grant |
| **Automated or human** | Human required |
| **Explainability** | Required |
| **Appealability** | Yes |
| **Sensitivity** | High |
| **Audit** | Required |
| **Reversibility** | Yes (restore after reevaluation) |
| **Final formula dependency** | PENDING |

### DEC-PRG-017 — ACHIEVEMENT_GRANT

| Field | Value |
|-------|-------|
| **Decision type** | ACHIEVEMENT_GRANT |
| **System** | Achievements / Crests (`PGS-ACH`) |
| **Required sources** | Achievement definition; VALID triggering event(s); not payment-as-Skill |
| **Automated or human** | Automated for ordinary commemorative grants after approved rules; human for sensitive / integrity-linked |
| **Explainability** | Required |
| **Appealability** | Yes |
| **Sensitivity** | Ordinary–elevated |
| **Audit** | Required |
| **Reversibility** | Via ACHIEVEMENT_REVOCATION |
| **Final formula dependency** | PENDING |

### DEC-PRG-018 — ACHIEVEMENT_REVOCATION

| Field | Value |
|-------|-------|
| **Decision type** | ACHIEVEMENT_REVOCATION |
| **System** | Achievements / Crests (`PGS-ACH`) |
| **Required sources** | Cause (fraud, voided trigger, policy); prior grant |
| **Automated or human** | Automation may revoke when trigger event is REVERSED under policy; human for contested cases |
| **Explainability** | Required |
| **Appealability** | Yes |
| **Sensitivity** | Elevated |
| **Audit** | Required |
| **Reversibility** | Limited (re-grant via new ACHIEVEMENT_GRANT) |
| **Final formula dependency** | PENDING |

### DEC-PRG-019 — LEADERBOARD_PLACEMENT

| Field | Value |
|-------|-------|
| **Decision type** | LEADERBOARD_PLACEMENT |
| **System** | Leaderboards (`PGS-LBR`) |
| **Required sources** | Board definition; VALID scoring inputs for that board; eligibility |
| **Automated or human** | Automated provisional/final per approved board rules; human for sensitive corrections |
| **Explainability** | Required (including provisional vs final) |
| **Appealability** | Yes |
| **Sensitivity** | Ordinary–elevated |
| **Audit** | Required |
| **Reversibility** | Via LEADERBOARD_CORRECTION |
| **Final formula dependency** | PENDING |

### DEC-PRG-020 — LEADERBOARD_CORRECTION

| Field | Value |
|-------|-------|
| **Decision type** | LEADERBOARD_CORRECTION |
| **System** | Leaderboards (`PGS-LBR`) |
| **Required sources** | Correction case; prior placement snapshot; authorizing cause |
| **Automated or human** | Automation may apply routine source-reversal corrections; major reputation correction requires human |
| **Explainability** | Required |
| **Appealability** | Yes |
| **Sensitivity** | Elevated–high |
| **Audit** | Required |
| **Reversibility** | Yes (further correction / appeal resolution) |
| **Final formula dependency** | PENDING |

### DEC-PRG-021 — MERIT_ELIGIBILITY_REFERRAL

| Field | Value |
|-------|-------|
| **Decision type** | MERIT_ELIGIBILITY_REFERRAL |
| **System** | Merit boundary (entitlement outcome; not a progression score) — see [MERIT-PROGRESSION-BOUNDARY.md](./MERIT-PROGRESSION-BOUNDARY.md) |
| **Required sources** | Merit program eligibility inputs; progression standing only as **referral signal**, never as payment-bought Skill |
| **Automated or human** | Automated referral allowed; Merit grant itself remains entitlement/commercial process outside progression scoring |
| **Explainability** | Required |
| **Appealability** | Yes (eligibility referral disputes) |
| **Sensitivity** | Elevated |
| **Audit** | Required |
| **Reversibility** | Referral may be withdrawn; Merit grant governed by Merit's own entitlement rules |
| **Final formula dependency** | PENDING |

---

## Exact count verification

| Decision ID | Type |
|-------------|------|
| DEC-PRG-001 | XP_RECOGNITION |
| DEC-PRG-002 | MOMENTUM_PLACEMENT |
| DEC-PRG-003 | MOMENTUM_PROMOTION |
| DEC-PRG-004 | MOMENTUM_DEMOTION |
| DEC-PRG-005 | MATURITY_ADVANCEMENT |
| DEC-PRG-006 | MASTERY_UPDATE |
| DEC-PRG-007 | MASTERY_REEVALUATION |
| DEC-PRG-008 | BREADTH_UPDATE |
| DEC-PRG-009 | TRUST_RESTRICTION |
| DEC-PRG-010 | TRUST_RESTORATION |
| DEC-PRG-011 | TITLE_ELIGIBILITY |
| DEC-PRG-012 | TITLE_GRANT |
| DEC-PRG-013 | TITLE_REVOCATION |
| DEC-PRG-014 | PRESTIGE_ELIGIBILITY |
| DEC-PRG-015 | PRESTIGE_GRANT |
| DEC-PRG-016 | PRESTIGE_SUSPENSION |
| DEC-PRG-017 | ACHIEVEMENT_GRANT |
| DEC-PRG-018 | ACHIEVEMENT_REVOCATION |
| DEC-PRG-019 | LEADERBOARD_PLACEMENT |
| DEC-PRG-020 | LEADERBOARD_CORRECTION |
| DEC-PRG-021 | MERIT_ELIGIBILITY_REFERRAL |

**EXACT DECISION COUNT = 21**

All **21** decisions carry **Final formula dependency = PENDING**.

```text
ARCHITECTURE RECOMMENDED
EXACT DECISION COUNT = 21
FORMULA PENDING for all · Product Code BLOCKED
```
