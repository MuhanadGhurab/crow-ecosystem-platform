# Progression Event Validity

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-EVT-VAL-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related** | [PROGRESSION-EVENT-REGISTRY.md](./PROGRESSION-EVENT-REGISTRY.md) · [../README.md](../README.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 (2026-07-21) — Initial ARCHITECTURE RECOMMENDED validity model for GHV.PROGRESSION.1A |

## Purpose

Define the **validation lifecycle** for progression events listed in the Event Registry, and the standing rules that prevent double application, silent permanence, audit erasure, and commercial / learning confusion.

This document is **architecture only**. It does not define Product Code, numeric formulas, thresholds, or award magnitudes.

```text
SIMULATION NOT RUN.
CALIBRATION NOT RUN.
TECHNICAL VALIDATION NOT RUN.
FORMULA PENDING.
Product Code BLOCKED.
```

---

## Validation states

Every progression event instance occupies exactly one of the following states at any time:

| State | Meaning |
|-------|---------|
| `RECEIVED` | Event payload accepted into the progression boundary; not yet evaluated |
| `VALIDATING` | Structural, authority, subject, source-record, and policy checks in progress |
| `VALID` | Accepted for **current standing** influence |
| `REJECTED` | Failed validation; must not influence current standing |
| `REVERSED` | Previously influential effect withdrawn by a governed reversal; remains in history |
| `SUPERSEDED` | Replaced by a later authoritative event or correction for the same subject matter |
| `UNDER_INTEGRITY_REVIEW` | Held pending integrity adjudication; must not silently harden into permanent standing |

### State intent (architecture)

```text
RECEIVED          → ingress only
VALIDATING        → evaluation only
VALID             → may influence current standing
REJECTED          → no standing influence
REVERSED          → history retained; standing influence withdrawn
SUPERSEDED        → history retained; standing influence replaced
UNDER_INTEGRITY_REVIEW → hold; no silent permanent standing
```

---

## Core standing rules

### 1. Only VALID influences current state

Only event instances in state `VALID` may change **current** progression standing (XP recognition eligibility, Mastery eligibility signals, Route-Proven standing, Trust standing, titles, Prestige, season participation effects, remediation standing, and related conceptual systems named in the registry).

States other than `VALID` may be visible for audit, review queues, or holds, but must not apply as active standing truth.

### 2. Duplicates must not double progression

Idempotent processing is mandatory for registry events that declare an idempotency requirement.

If a duplicate event is received for the same authoritative source-record / idempotency key:

- It must not create a second standing effect.
- It may resolve as `REJECTED` (duplicate) or attach to the existing instance without additional influence.
- History may note the duplicate receipt; standing must not double-count.

### 3. Reversed remains in history

When an effect is reversed:

- The original event remains in the audit trail.
- Its standing influence is withdrawn by moving it to `REVERSED` (or marking standing application reversed) per governance.
- A reversal event (as named in the registry) becomes the auditable cause of withdrawal.

Reversal is **not** deletion.

### 4. Corrections do not delete audit

`PROGRESSION_CORRECTION_APPLIED` and `PROGRESSION_CORRECTION_REVERSED`:

- May mark prior events `REVERSED` or `SUPERSEDED` for standing.
- Must retain full audit of original events, corrections, actors, reasons, and timestamps.
- Must never purge history to “clean” a learner profile.

### 5. Late events use effective time and recorded time

Every event carries:

| Time field | Role |
|------------|------|
| **Recorded timestamp** | When the platform accepted the event |
| **Effective timestamp** | When the event is considered to have occurred for progression ordering and standing recalculation |

Late-arriving events:

- Keep both times.
- Use **effective timestamp** for ordering relative to other progression facts.
- Use **recorded timestamp** for operational audit and latency analysis.
- Must not pretend they arrived earlier than recorded.

### 6. Privileged manual actions need reason

Any privileged / manual progression administration event (especially corrections, voids, revocations, title / Prestige decisions, and Trust restrictions) **requires an explicit reason** as part of the source record.

An otherwise well-formed privileged event without reason must not become `VALID`.

### 7. Commercial cannot reclassify as learning

Commercial, payment, plan, entitlement, or billing outcomes:

- Are not Learning Activity, Assessment, Evidence, Capstone, or Proven events.
- Must not be rewritten, aliased, or reclassified into registry learning events to manufacture standing.
- Payment may control access and capacity elsewhere; it must not create Mastery, Route-Proven, Trust elevation, Prestige, titles, or XP recognition by reclassification.

### 8. Integrity review must not silently produce permanent standing

While an event (or dependent chain) is `UNDER_INTEGRITY_REVIEW`:

- Current standing must not quietly treat the contested claim as permanently earned.
- Resolution must emit explicit governed outcomes (for example void, revoke, restore, overturn, correction, or a new `VALID` outcome event).
- Closing a review without an explicit outcome must not invent Mastery, Rank, Route-Proven, Prestige, or title standing.

---

## Allowed transitions (conceptual)

```text
RECEIVED
  → VALIDATING
  → REJECTED          (ingress failure)

VALIDATING
  → VALID
  → REJECTED
  → UNDER_INTEGRITY_REVIEW

VALID
  → REVERSED          (governed reversal)
  → SUPERSEDED        (later authoritative replacement)
  → UNDER_INTEGRITY_REVIEW

UNDER_INTEGRITY_REVIEW
  → VALID             (explicit clearance / affirmation)
  → REJECTED
  → REVERSED
  → SUPERSEDED

REVERSED            → terminal for that instance’s standing influence
SUPERSEDED          → terminal for that instance’s standing influence
REJECTED            → terminal for that instance’s standing influence
```

Notes:

- Terminal states remain queryable in history.
- A new event instance may be created for restoration or re-grant; it does not rewrite the terminal instance into a different past.

---

## Relationship to registry fields

For each event type in [PROGRESSION-EVENT-REGISTRY.md](./PROGRESSION-EVENT-REGISTRY.md):

| Registry field | Validity implication |
|----------------|----------------------|
| **Validation state** | Follows this lifecycle |
| **Reversibility / reversal event** | Defines lawful paths into `REVERSED` / restoration |
| **Idempotency requirement** | Enforces no double progression |
| **Audit requirement** | Mandatory retention even after `REVERSED` / `SUPERSEDED` |
| **Prohibited effects** | Remain prohibited even if `VALID` |
| **Privacy classification** | Applies in all states, including rejected and reversed |

---

## Standing recalculation principle

When events become `VALID`, `REVERSED`, or `SUPERSEDED`, progression standing for the subject may be recalculated from the authoritative history of `VALID` effects and active holds.

Recalculation:

- Uses effective timestamps for order.
- Honors integrity holds.
- Does not invent numeric formulas in this Gate (FORMULA PENDING).
- Does not require deleting historical events.

---

## Non-goals (this Gate)

- Product Code and storage schemas
- Numeric XP / Rank / Mastery / season formulas
- Simulation of double-submit races
- Calibration of integrity review SLAs
- Commercial entitlement event catalogues

---

## Invariants summary

```text
1. Only VALID influences current standing.
2. Duplicates must not double progression.
3. REVERSED remains in history.
4. Corrections do not delete audit.
5. Late events keep effective + recorded time.
6. Privileged manual actions require reason.
7. Commercial cannot reclassify as learning.
8. Integrity review must not silently produce permanent standing.
```
