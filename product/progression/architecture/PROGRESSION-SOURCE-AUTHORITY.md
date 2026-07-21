# Progression Source Authority

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-SRC-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-INVARIANTS.md](./PROGRESSION-INVARIANTS.md) · [PROGRESSION-SYSTEM-SEPARATION.md](./PROGRESSION-SYSTEM-SEPARATION.md) · [PROGRESSION-LEDGER-MODEL.md](./PROGRESSION-LEDGER-MODEL.md) · [MERIT-PROGRESSION-BOUNDARY.md](./MERIT-PROGRESSION-BOUNDARY.md) · [../../learning/evidence/EVIDENCE-CLASSIFICATION.md](../../learning/evidence/EVIDENCE-CLASSIFICATION.md) · [../../learning/integrity/LEARNING-INTEGRITY-MODEL.md](../../learning/integrity/LEARNING-INTEGRITY-MODEL.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 — GHV.PROGRESSION.1A: define authoritative source classes |

---

## Purpose

Define which **source classes** may authoritatively inform which progression systems — and which effects are prohibited. Source authority prevents commercial events, popularity, or raw activity from writing Mastery, Trust, Titles, or Prestige incorrectly.

Exact total: **10** source classes.

---

## Source class catalogue

| Source class | Primary domain | May produce progression value? |
|--------------|----------------|--------------------------------|
| `LEARNING_EVENT` | Learning activity | Yes — limited (XP / Momentum / Maturity signals) |
| `EVIDENCE_EVENT` | Evidence lifecycle | Yes — Mastery / Proven / Breadth / Titles / Prestige eligibility |
| `ASSESSMENT_EVENT` | Assessment outcomes | Yes — same family as Evidence for proof pathways |
| `INTEGRITY_EVENT` | Integrity / moderation | Yes — validity, Trust, eligibility, authority |
| `COMMUNITY_EVENT` | Community participation | Limited — contribution XP / Trust / achievements; **not** technical Mastery |
| `LIVE_SKY_EVENT` | Live Sky participation | Limited — contribution / team / selected Prestige Evidence pathways |
| `TEAM_CONTRIBUTION_EVENT` | Team contribution | Limited — contribution XP / Trust / Team achievements / selected Prestige Evidence |
| `REVIEW_EVENT` | Human review outcomes | Yes — Evidence approval, Title/Prestige reviews |
| `ADMINISTRATIVE_CORRECTION` | Privileged correction | Yes — audited repair only |
| `COMMERCIAL_EVENT` | Billing / entitlement | **No** progression value — entitlement/capacity/access/Merit availability only |

---

## COMMERCIAL_EVENT

Commercial events may affect:

- Entitlement
- Capacity
- Access duration
- Merit Grant availability (as entitlement outcomes)

Commercial events may **not** directly produce progression value, including:

- Flight XP
- Momentum points or League placement
- Maturity Rank advancement
- Mastery / Route-Proven / Horizon-Proven
- Breadth
- Trust Standing
- Professional Titles
- Prestige Classes
- Achievement worth that implies skill purchased
- Leaderboard placement purchased

Access Plan changes must route through entitlement ledgers, not progression ledgers.

---

## LEARNING_EVENT

May inform:

- Flight XP
- Momentum season signals
- Maturity progress signals

Must **not** independently prove Mastery, Route-Proven, Horizon-Proven, Titles, or Prestige. Learning activity without Evidence/assessment pathways remains Activity, not Proof.

---

## EVIDENCE_EVENT and ASSESSMENT_EVENT

May inform:

- Capability / Route Mastery
- Route-Proven eligibility and standing (with Learning qualitative conditions)
- Breadth
- Professional Title eligibility
- Prestige eligibility

Must respect Evidence validity, integrity state, and review outcomes. Voided or revoked Evidence must not continue to support current Mastery standing.

Assessment events alone do not sell Rank; they feed proof pathways under governed rules.

---

## INTEGRITY_EVENT

May affect:

- Evidence validity
- Trust Standing
- Reviewer authority
- Progression eligibility (participation gates)

Must **not**:

- Erase valid historical learning Evidence as if it never existed (see invariants)
- Create Mastery from punishment or reward theater
- Clear Trust via payment

---

## COMMUNITY_EVENT, LIVE_SKY_EVENT, TEAM_CONTRIBUTION_EVENT

May affect:

- Contribution XP (where policy allows)
- Trust (where integrity/community reliability is implicated)
- Team achievements / Crests
- Selected Prestige-impact Evidence pathways (only when Evidence is properly classified and reviewed)

Must **not** directly create **technical Mastery**. Popularity metrics must not write Mastery or Route-Proven.

---

## REVIEW_EVENT

Human review outcomes are authoritative for:

- Evidence approval / revision / rejection pathways
- Title review
- Prestige review
- Selected high-value Merit consideration (entitlement outcome, not score)

AI assistance may inform reviewers; AI is not final assessment authority (Constitution).

---

## ADMINISTRATIVE_CORRECTION

Administrative corrections must be:

1. **Reasoned** — documented rationale linked to source records
2. **Audited** — privileged actor, timestamp, before/after state
3. **Reversible where possible** — prefer compensating correction events
4. **Separated from ordinary user activity** — never look like farmable events
5. **Protected by privileged authorization** — not available to ordinary roles

Corrections may repair wrongful grants/denials across ledgers but must not create pay-to-win exceptions or silent meaning overwrites between systems.

---

## Authority matrix (summary)

| Source class | XP | Momentum | Maturity signals | Mastery / Proven | Breadth | Trust | Titles | Prestige eligibility | Entitlement |
|--------------|:--:|:--------:|:----------------:|:----------------:|:------:|:----:|:------:|:--------------------:|:-----------:|
| LEARNING_EVENT | ● | ● | ● | — | — | — | — | — | — |
| EVIDENCE_EVENT | ○ | ○ | ○ | ● | ● | ○ | ● | ● | — |
| ASSESSMENT_EVENT | ○ | ○ | ○ | ● | ● | ○ | ● | ● | — |
| INTEGRITY_EVENT | ○ | ○ | — | ○ (validity) | ○ | ● | ○ | ○ | — |
| COMMUNITY_EVENT | ○ | ○ | — | — | — | ○ | — | ○ (selected) | — |
| LIVE_SKY_EVENT | ○ | ○ | — | — | — | ○ | — | ○ (selected) | — |
| TEAM_CONTRIBUTION_EVENT | ○ | ○ | — | — | — | ○ | — | ○ (selected) | — |
| REVIEW_EVENT | ○ | — | — | ● | ● | ○ | ● | ● | ○ (Merit) |
| ADMINISTRATIVE_CORRECTION | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| COMMERCIAL_EVENT | — | — | — | — | — | — | — | — | ● |

Legend: **●** primary authority · **○** limited/conditional · **—** prohibited as direct producer of that meaning.

Formulas that quantify “limited/conditional” remain **PENDING**.

---

## Exact totals

| Item | Exact total |
|------|------------:|
| Source classes | **10** |
| Classes prohibited from producing progression value | **1** (`COMMERCIAL_EVENT`) |
| Classes that must not independently prove Mastery | **1** (`LEARNING_EVENT`) plus community/team/Live Sky for technical Mastery |
