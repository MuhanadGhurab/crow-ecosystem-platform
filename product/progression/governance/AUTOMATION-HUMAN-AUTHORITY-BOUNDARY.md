# Automation / Human Authority Boundary

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-AHB-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-DATA-MINIMIZATION.md](./PROGRESSION-DATA-MINIMIZATION.md) · [../architecture/PROGRESSION-DECISION-REGISTRY.md](../architecture/PROGRESSION-DECISION-REGISTRY.md) · [../architecture/PROGRESSION-SOURCE-AUTHORITY.md](../architecture/PROGRESSION-SOURCE-AUTHORITY.md) · [../architecture/PROGRESSION-INVARIANTS.md](../architecture/PROGRESSION-INVARIANTS.md) · [../README.md](../README.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 — GHV.PROGRESSION.1A: lock automation vs human authority boundary |

---

## Purpose

Define what **automation MAY** do in the progression ecosystem, what it **MAY NOT** do independently, and where **human review is required**. This is an authority boundary — not a runtime implementation, database schema, or numeric formula set.

```text
STATUS: ARCHITECTURE RECOMMENDED
Automation assists; humans retain high-impact authority
FORMULA PENDING · Product Code BLOCKED
```

---

## Binding principle

Automation may **validate, calculate (when rules are approved), aggregate, detect, recommend, explain, and provisionally surface**. Automation must not independently finalize sensitive reputation, Prestige, irreversible Trust, or payment-as-Skill outcomes.

Human review is mandatory wherever specialized Evidence, contested integrity, sensitive Titles, Prestige, conflicts of interest, major reputation corrections, or elevated authority for minors are at stake.

---

## Automation MAY

Automation is permitted to perform the following classes of work (subject to approved policy and later formula lock in GHV.PROGRESSION.1B where calculation is involved):

| # | Allowed class | Intent |
|---|---------------|--------|
| 1 | **Validate events** | Structural, authority, subject, source-record, and policy checks against the Event Registry and Validity model. |
| 2 | **Apply approved XP rules later** | Once XP recognition rules are approved and formula-locked, apply them to VALID events. Magnitudes remain FORMULA PENDING in 1A. |
| 3 | **Calculate Momentum later** | Once Momentum season rules are approved and formula-locked, compute provisional/season standing. Thresholds remain FORMULA PENDING in 1A. |
| 4 | **Surface Maturity progress** | Show qualitative progress toward Rank expectations and advancement eligibility signals — not invent Rank thresholds. |
| 5 | **Aggregate approved Evidence** | Roll up Evidence that is already approved under learning review policy into Mastery / Breadth eligibility signals. |
| 6 | **Detect inconsistencies** | Flag conflicts between ledgers, events, freshness claims, and integrity holds for review queues. |
| 7 | **Provisional leaderboards** | Compute and display provisional placements clearly labeled as non-final. |
| 8 | **Identify Title / Prestige eligibility** | Surface eligibility and nomination readiness; do not independently grant high-impact outcomes. |
| 9 | **Recommend reviews** | Queue human review with reasons, priority hints, and source pointers. |
| 10 | **Explain sources** | Present explainable “why” copy from source events, decisions, and ledgers without inventing competence claims. |

---

## Automation MAY NOT (independently)

Automation must not, on its own authority, finalize the following:

| # | Prohibited independent act | Why |
|---|----------------------------|-----|
| 1 | **Approve sensitive Evidence** | Specialized or high-stakes Evidence approval remains a human / governed review outcome. |
| 2 | **Resolve serious integrity** | Contested fraud, abuse, or serious integrity cases require human adjudication. |
| 3 | **Grant high-impact Titles without policy** | Title grants that confer professional standing require human review under approved Title policy. |
| 4 | **Grant Prestige** | Prestige Class grants are human-governed distinction outcomes. |
| 5 | **Permanently revoke Prestige** | Permanent Prestige revocation is a sensitive human decision with full audit. |
| 6 | **Irreversible Trust decisions** | Trust restriction / suspension / authority revocation that is treated as irreversible requires human authority. |
| 7 | **Override an approved appeal** | Automation must not silently reverse or ignore a resolved appeal outcome. |
| 8 | **Use payment as Skill evidence** | Commercial payment, plan, or purchase must never be treated as Skill, Mastery, or competence Evidence. |

---

## Human review required where

Human review (or equivalent governed multi-party review under Founder policy) is required in at least these situations:

| # | Trigger | Typical decision classes |
|---|---------|--------------------------|
| 1 | **Specialized Evidence** | Evidence approval / Mastery update paths depending on specialist judgment |
| 2 | **Contested integrity** | Trust restriction/restoration; integrity holds; Achievement / Title / Prestige effects |
| 3 | **Sensitive Title** | Title eligibility confirmation, grant, or revocation |
| 4 | **Prestige** | Nomination review, grant, suspension, reevaluation, revocation |
| 5 | **Reviewer conflict** | Any case where the assigned reviewer has a conflict of interest |
| 6 | **Major reputation correction** | Large standing corrections, leaderboard removals, multi-ledger patches |
| 7 | **Minor elevated authority** | Any elevation of responsibility / authority affecting a minor (age-sensitive Trust / Title / Prestige paths) |

---

## Decision-registry alignment

Authoritative decision types, automation vs human flags, sensitivity, appealability, and audit requirements are registered in [PROGRESSION-DECISION-REGISTRY.md](../architecture/PROGRESSION-DECISION-REGISTRY.md). This boundary document governs **who may act**; the decision registry names **what decisions exist**.

---

## Explicit non-goals

- No Product Code or workflow engine design.
- No numeric XP / Momentum / Rank / Mastery formulas.
- No claim that automation is blocked from all calculation forever — only that calculation depends on later approved rules (1B+) and that sensitive finals remain human.
- No substitution of payment, popularity, or activity volume for Evidence-backed Skill.

```text
ARCHITECTURE RECOMMENDED
FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED · Expert review N/A for architecture
```
