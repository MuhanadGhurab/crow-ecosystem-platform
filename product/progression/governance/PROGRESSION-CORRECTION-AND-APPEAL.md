# Progression Correction and Appeal

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-COR-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [../events/PROGRESSION-EVENT-VALIDITY.md](../events/PROGRESSION-EVENT-VALIDITY.md) · [../architecture/PROGRESSION-INVARIANTS.md](../architecture/PROGRESSION-INVARIANTS.md) · [../architecture/PROGRESSION-LEDGER-MODEL.md](../architecture/PROGRESSION-LEDGER-MODEL.md) · [../integrity/PROGRESSION-ANTI-GAMING-ARCHITECTURE.md](../integrity/PROGRESSION-ANTI-GAMING-ARCHITECTURE.md) · [../experience/PROGRESSION-EXPLAINABILITY.md](../experience/PROGRESSION-EXPLAINABILITY.md) · [../README.md](../README.md) |
| **Authoritative inputs** | GHV.PROGRESSION.1A §27 · Event Validity · System Separation · Product Constitution integrity principles |
| **Unresolved formula dependencies** | Correction magnitudes, refresh windows, and recalculation order → **GHV.PROGRESSION.1B** |
| **Unresolved technical dependencies** | Correction workflow Product Code, appeal queue tooling, audit export → later technical gates |
| **Privacy classification** | Restricted operational / integrity; user-facing explanations may be redacted |
| **Decision sensitivity** | HIGH for Prestige, Title, Trust, and integrity-linked corrections |
| **Appealability** | YES — tracked appeal states required for high-impact outcomes |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 (2026-07-21) — GHV.PROGRESSION.1A Corrections, Reversals and Appeals |

---

## Purpose

Define how progression outcomes are **corrected, reversed, and appealed** without silently rewriting history, collapsing system boundaries, or hiding high-impact authority behind automation.

This document is **architecture only**. It does not define Product Code, numeric formulas, thresholds, or automated adjudication rules.

```text
STATUS: ARCHITECTURE RECOMMENDED
FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED
```

---

## Binding principles

1. **Corrections are records.** Every correction creates a new governed record; prior history remains auditable.
2. **History is not silently deleted.** Reversal withdraws current standing influence; it does not erase the past event trail.
3. **System identity is mandatory.** Each correction must name the affected progression system (XP, Momentum, Maturity, Mastery, Breadth, Trust, Titles, Prestige, Achievements/Crests, Leaderboards).
4. **Unrelated systems stay untouched.** A correction must not cascade into systems that were not affected by the cause.
5. **Explainability with redaction.** Users receive an explanation where permitted; sensitive detection detail may remain restricted.
6. **Appeals are first-class.** Appeals have tracked status; high-impact changes may require separation of duties.

---

## Correction causes

Exact total locked in this section: **10** cause classes.

| Cause ID | Cause | Typical trigger | Notes |
|----------|-------|-----------------|-------|
| `COR-CAUSE-DUP` | Duplicate event | Same activity applied more than once | Pair with idempotency / event validity |
| `COR-CAUSE-INV` | Invalid event | Failed authority, subject, or policy validation after application | May supersede prior VALID standing influence |
| `COR-CAUSE-EVD-REV` | Evidence revocation | Approved Evidence later withdrawn | Mastery / Route-Proven reevaluation may follow |
| `COR-CAUSE-ASM` | Assessment correction | Score, outcome, or rubric application corrected | Limited to assessment-linked systems |
| `COR-CAUSE-MOD` | Moderation reversal | Prior moderation action overturned | Trust / role eligibility may recalculate later |
| `COR-CAUSE-SKY` | Live Sky result correction | Live Sky outcome corrected after review | Team vs individual contribution remain separate |
| `COR-CAUSE-MAN` | Mistaken manual adjustment | Human administrative error | Requires audit identity of actor |
| `COR-CAUSE-INT` | Integrity finding | Confirmed or provisional integrity determination | May restrict Trust / Prestige authority |
| `COR-CAUSE-DEF` | System defect | Platform defect produced incorrect standing | Defect record linked; no silent wipe |
| `COR-CAUSE-APL` | Successful appeal | Appeal resolves in learner’s favor | Produces APPLIED / APPEAL_RESOLVED trail |

---

## Correction and appeal states

Every correction or appeal case occupies exactly one primary state at a time:

| State | Meaning |
|-------|---------|
| `CORRECTION_REQUESTED` | A correction or reversal has been requested; not yet under active review |
| `UNDER_REVIEW` | Human and/or governed automation review in progress |
| `APPROVED` | Correction authorized; not yet written as applied standing change |
| `REJECTED` | Correction or appeal request denied; prior standing remains unless separately changed |
| `APPLIED` | Authorized correction written as a new ledger / standing record |
| `REVERSED` | A previously applied correction (or original effect) is withdrawn by a later governed reversal |
| `APPEALED` | Learner or authorized party has opened an appeal against a decision |
| `APPEAL_RESOLVED` | Appeal concluded (uphold, overturn, or partial); resolution linked to resulting records |

### Lifecycle (conceptual)

```text
CORRECTION_REQUESTED → UNDER_REVIEW → APPROVED → APPLIED
                                      ↘ REJECTED
APPLIED → (optional) APPEALED → APPEAL_RESOLVED → (may yield) APPLIED / REVERSED
APPLIED → REVERSED (when a later governed reversal withdraws the correction effect)
```

---

## Operating rules

### R1 — New records only

Corrections append **new** progression administration records. They do not overwrite or delete the original event payload or prior standing snapshots required for audit.

### R2 — History preserved

Event and ledger history remain visible to authorized reviewers. “REVERSED” means current standing influence is withdrawn, not that the past did not occur.

### R3 — Identify the affected system

Every correction record must declare:

* affected system ID(s)
* subject Crow / learner identity
* source event or Evidence / assessment / moderation reference
* cause class
* whether standing is provisional pending further review

### R4 — Do not modify unrelated systems

Examples of prohibited silent cascades:

* XP correction must **not** automatically change Mastery
* Trust reversal must **not** automatically award Mastery
* Title revocation must **not** erase unrelated Achievement history
* Momentum season adjustment must **not** rewrite lifetime XP

Allowed **targeted** follow-ons must be explicit (e.g., Evidence revocation → Mastery reevaluation request), recorded separately, and limited to systems that depend on the revoked source.

### R5 — User explanation where permitted

User-facing copy should state:

* what changed
* which system was affected
* whether the result is provisional
* whether appeal remains available

Sensitive detection methods, informant identity, and internal integrity tooling details may remain restricted.

### R6 — Sensitive detection restricted

Integrity and anti-gaming signals used to justify a correction may be summarized for the user without revealing production detection algorithms or surveillance detail (see Anti-Gaming Architecture).

### R7 — Appeals tracked

Appeals must carry status (`APPEALED` → `APPEAL_RESOLVED`), timestamps, decision outcome, and linkage to resulting correction records. Untracked informal reversals are non-compliant.

### R8 — High-impact separation of duties

High-impact changes (Trust sanctions, Prestige / Title revocation, integrity permanent standing, irreversible entitlement interactions) may require:

* requester ≠ approver
* second reviewer for Prestige / Title revocation
* recorded rationale

Exact staffing thresholds are operational policy; the architecture requires that the capability exist.

### R9 — Prestige and Title revocations — stronger review

Revoking Prestige Class standing or a Professional Title requires stronger review than routine XP or Momentum corrections. Casual admin override is prohibited.

### R10 — XP corrections do not auto-change Mastery

Flight XP ledger adjustments never, by themselves, create, increase, decrease, or erase Capability Mastery, Route Mastery, or Route-Proven.

### R11 — Trust reversals do not auto-award Mastery

Clearing or reversing a Trust restriction restores Trust standing eligibility paths only. It does not grant Mastery or Route-Proven.

### R12 — Evidence restoration may trigger later recalculation

If revoked Evidence is restored after appeal or correction, Mastery / Route-Proven / Breadth / Title eligibility may enter **later recalculation**. Recalculation is a subsequent governed process; restoration alone is not an instant silent full restore of all derived standings without review rules (formulas PENDING 1B).

---

## Cross-system effect matrix (architecture)

| Cause | May affect | Must not silently affect |
|-------|------------|---------------------------|
| Duplicate / invalid event | The system(s) that consumed the event | Unrelated Mastery / Prestige / Title |
| Evidence revocation | Mastery, Route-Proven, Breadth, Title eligibility | Unrelated XP history; unrelated valid Evidence |
| Assessment correction | Assessment-linked Mastery / eligibility | Popularity, payment, Momentum-only grind |
| Moderation reversal | Trust, role / leaderboard eligibility | Unrelated Mastery awards |
| Live Sky correction | Team / contribution records linked to that event | Full capability credit without individual review |
| Integrity finding | Trust, Prestige authority, contested Evidence | Blanket wipe of valid learning history |
| Successful appeal | Systems named in the appeal resolution | Systems outside the resolution scope |

---

## Appeal surface (conceptual)

Appeals are available at least for:

* Trust restrictions and integrity-linked standing
* Prestige and Title denial / revocation
* Evidence revocation affecting Mastery or Route-Proven
* High-impact manual adjustments

Appeals are **not** a vehicle to purchase standing, convert payment into Mastery, or demand formula disclosure beyond explainability requirements.

---

## Explicit non-goals

* No Product Code workflows or API contracts
* No numeric correction magnitudes or SLA timers
* No production detection algorithms
* No silent hard-delete of progression history
* No claim that simulation, calibration, or technical validation is complete

```text
ARCHITECTURE RECOMMENDED
FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED · Expert review N/A for architecture
```
