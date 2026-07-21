# Trust Standing Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-TRU-STD-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related** | [PROGRESSION-SYSTEM-SEPARATION.md](../architecture/PROGRESSION-SYSTEM-SEPARATION.md) · [PROGRESSION-INVARIANTS.md](../architecture/PROGRESSION-INVARIANTS.md) · [PROFESSIONAL-TITLE-ARCHITECTURE.md](../titles/PROFESSIONAL-TITLE-ARCHITECTURE.md) · [PRESTIGE-ARCHITECTURE.md](../prestige/PRESTIGE-ARCHITECTURE.md) · [LEADERBOARD-ARCHITECTURE.md](../leaderboards/LEADERBOARD-ARCHITECTURE.md) · Learning integrity / Evidence review models |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Unresolved** | Sanction durations, dimension blends, assurance tiers → **GHV.PROGRESSION.1B** / integrity & fairness gates |
| **Change history** | 1.0.0 (2026-07-21) — GHV.PROGRESSION.1A Trust Standing Architecture |

## Purpose

Define **Trust Standing** as **platform integrity and community reliability** — **not** as technical Skill, Mastery, Flight XP, popularity, or payment loyalty.

```text
STATUS: ARCHITECTURE RECOMMENDED
Trust = platform integrity and community reliability
Trust ≠ technical Skill · ≠ popularity · ≠ payment
No required public numerical Trust score
No Product Code · No numeric formulas
```

## Binding definition

| Principle | Statement |
|-----------|-----------|
| **What Trust is** | A governed standing reflecting how reliably and responsibly a participant acts on the platform and in community contexts that affect integrity, safety, and collaboration. |
| **What Trust is not** | A Skill meter, Mastery substitute, Prestige Class, employer reference, or public popularity score. |
| **System ID** | `PGS-TRU` |
| **Record IDs** | `TRU-REC-<NUMBER>` for Trust Standing / Trust case records. |
| **Values** | Dimension blends, sanction durations, and restoration intervals are **FORMULA PENDING** (1B / integrity gates). This Gate defines dimensions, states, and binding rules only. |

---

## Trust dimensions

Exact totals for dimension IDs in this Gate: **7**.

| Dimension ID | Meaning |
|--------------|---------|
| **IDENTITY_RELIABILITY** | Consistency and honesty of identity claims relevant to platform participation (including support for Crow identities and age-appropriate rules). |
| **EVIDENCE_INTEGRITY** | Honesty and authenticity of Evidence, assessments, and related demonstration materials. |
| **COMMUNITY_CONDUCT** | Respectful, policy-aligned behavior in community spaces. |
| **COLLABORATION_RELIABILITY** | Dependable, attributable participation in team and collaborative work. |
| **REVIEWER_RELIABILITY** | Fairness, diligence, and integrity when acting in reviewer or evaluation roles. |
| **SECURITY_RESPONSIBILITY** | Responsible handling of security-sensitive participation, disclosures, and privileges. |
| **MODERATION_HISTORY** | Record of moderation outcomes, sanctions, restorations, and related case history (often private). |

Dimensions may be affected independently. A confirmed issue in one dimension does **not** automatically rewrite unrelated dimensions.

---

## Trust states

Exact totals for Trust states in this Gate: **8**.

| State | Meaning |
|-------|---------|
| **UNESTABLISHED** | Insufficient interaction history to treat Trust as established. |
| **NORMAL** | Baseline good standing without elevated responsibility or active restriction. |
| **POSITIVE_STANDING** | Sustained reliability signals beyond baseline (qualitative; no numeric score required). |
| **ELEVATED_RESPONSIBILITY_ELIGIBLE** | Eligible to be considered for sensitive roles that require Trust + additional assurance — not automatic appointment. |
| **REVIEW_REQUIRED** | Trust-relevant matters under review; sensitive privileges may pause pending outcome. |
| **RESTRICTED** | Specific privileges or participation paths limited for governed cause; restrictions are reasoned. |
| **SUSPENDED** | Broader participation or authority suspended pending or following serious Trust incident handling. |
| **REVOKED_AUTHORITY** | Previously granted sensitive authority revoked; history retained for audit. |

States are architectural labels — not a required public numeric score.

---

## Binding rules

| ID | Rule |
|----|------|
| TRU-R1 | **No required public numerical Trust score.** Architecture does not mandate publishing a Trust number. |
| TRU-R2 | **Moderation details may be private.** Public surfaces must not expose sensitive case detail by default. |
| TRU-R3 | **Popularity / reactions ≠ Trust.** Likes, followers, and viral reach do not establish Trust Standing. |
| TRU-R4 | **A confirmed report affects relevant dimensions only** — scoped impact, not blanket silent rewriting of all Trust dimensions. |
| TRU-R5 | **An overturned report is reversible** along the affected Trust dimensions and related restrictions where policy permits. |
| TRU-R6 | **Valid Evidence is not auto-deleted by conduct outcomes.** Integrity/Trust actions do not erase valid historical learning Evidence; Mastery/Proven may still require reevaluation where Evidence authenticity is implicated. |
| TRU-R7 | **Sensitive roles need Trust + assurance.** Elevated responsibility eligibility alone is insufficient without the role’s additional assurance requirements. |
| TRU-R8 | **Restrictions are reasoned and appealable where permitted.** |
| TRU-R9 | **High Trust ≠ immunity.** Positive or elevated standing does not block investigation or future sanctions. |
| TRU-R10 | **Payment cannot repair Trust.** Access Plan, purchases, or subscriptions never buy Trust restoration. |
| TRU-R11 | **Inactivity alone ≠ Trust reduction.** Temporary absence does not by itself degrade Trust Standing. |
| TRU-R12 | **Serious incidents may suspend authority** (reviewer, mentor, Live Sky roles, or other governed authority) pending or following process. |
| TRU-R13 | **Support minors and pseudonymous Crow identities** under fairness, age, and privacy architecture — real legal names are not required for Trust Standing itself. |

---

## Relationship to other systems

| System | Boundary |
|--------|----------|
| **Route Mastery / Evidence** | Trust gates whether Evidence can support Mastery claims when authenticity is in question; Trust is not Skill. |
| **Professional Titles / Prestige** | May require Trust eligibility; Trust alone is not a Title or Prestige Class. |
| **Leaderboards** | Trust is not a public popularity score and must not be presented as one. |
| **Achievements / Crests** | Integrity-linked Crests may reference Trust outcomes; Crests do not redefine Trust. |
| **Flight XP / Momentum / Maturity** | Activity and development systems; none substitute for Trust. |
| **Access Plan** | Commercial entitlement; never a Trust repair path. |

---

## Visibility, privacy, and appeal

| Concept | Architecture |
|---------|--------------|
| **Learner-facing copy** | Must describe Trust as integrity and reliability — not Skill or fame. |
| **Public badges** | Optional and limited; must not imply employment or technical Mastery. |
| **Staff / moderation** | Full case history available under access control for governance. |
| **Minors** | Extra privacy controls; Trust processes must respect age-appropriate disclosure. |
| **Crow identities** | Pseudonymous public identity is supported; Trust evaluation uses platform identity reliability rules, not a demand for public real names. |
| **Appeals** | Trust decisions are first-class appealable progression/integrity decisions where policy permits. |

---

## Explicit non-goals

- No mandatory public Trust number or formula lock in this Gate.
- No payment-based Trust repair.
- No popularity-as-Trust.
- No automatic deletion of valid Evidence solely due to unrelated conduct.
- No Product Code, simulation, calibration, or technical validation claims.

## Handoff

| Gate | Receives |
|------|----------|
| **GHV.PROGRESSION.1B** / integrity & fairness gates | Dimension model + states + rules; must supply sanction durations, restoration paths, and assurance-tier policy without inventing a required public numeric Trust score |
| **Calibration / simulation** | Must run before any numeric or duration lock that requires simulation |
| **Product Code / implementation** | BLOCKED until later governed gates |

```text
FORMULA PENDING
SIMULATION NOT RUN
CALIBRATION NOT RUN
TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED
```
