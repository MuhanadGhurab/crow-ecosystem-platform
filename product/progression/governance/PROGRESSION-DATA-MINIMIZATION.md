# Progression Data Minimization

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-PDM-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md](./AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md) · [../architecture/PROGRESSION-LEDGER-MODEL.md](../architecture/PROGRESSION-LEDGER-MODEL.md) · [../architecture/PROGRESSION-SOURCE-AUTHORITY.md](../architecture/PROGRESSION-SOURCE-AUTHORITY.md) · [../events/PROGRESSION-EVENT-REGISTRY.md](../events/PROGRESSION-EVENT-REGISTRY.md) · [../README.md](../README.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED · Legal retention pending validation |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 — GHV.PROGRESSION.1A: progression data-minimization architecture |

---

## Purpose

Define **data-minimization and retention concepts** for progression ledgers, events, Evidence references, public profiles, identity separation, corrections, leaderboards, seasons, export/deletion, analytics, and legal hold. This is architecture policy — not a database schema or Product Code design.

```text
STATUS: ARCHITECTURE RECOMMENDED
Necessary metadata only · Evidence referenced, not copied unnecessarily
Legal retention PENDING VALIDATION
```

---

## Binding rules

### 1. Necessary event metadata only

Progression events store only the metadata required to validate, apply, reverse, audit, and explain standing effects: subject, source class, source-record pointer, event type, timestamps, validity state, idempotency key, and privacy classification.

Events must not become a second copy of full learning payloads (Mission bodies, assessment answer dumps, raw Evidence files, chat transcripts, or media binaries).

### 2. Do not duplicate raw learning into ledgers

Conceptual ledgers ([PROGRESSION-LEDGER-MODEL.md](../architecture/PROGRESSION-LEDGER-MODEL.md)) record **standing outcomes and recognized effects**, not raw learning content.

| Learning artifact | Progression ledger practice |
|-------------------|----------------------------|
| Mission / node content | Reference learning IDs only |
| Assessment responses | Store outcome / eligibility signals only as needed |
| Evidence artifacts | Reference Evidence IDs; do not copy artifact bodies into XP/Mastery/Trust ledgers |
| Capstone packages | Reference Capstone / review outcome IDs |

### 3. Evidence referenced, not copied unnecessarily

Approved Evidence influences Mastery, Breadth, Titles, and Prestige through **references** to learning Evidence records and review outcomes. Progression systems must not maintain unnecessary duplicate copies of Evidence content.

Where a review dossier temporarily needs excerpts, those excerpts are review-scoped, access-restricted, and subject to deletion / minimization after the review purpose ends (exact retention windows pending legal validation).

### 4. Sensitive moderation restricted

Integrity, Trust, and moderation case materials are **restricted**. Access is limited to authorized reviewers, auditors, and Founder-governed roles. Automation may detect and queue; it must not broadly expose moderation content into learner-facing or public surfaces.

### 5. Public profiles: approved fields only

Public / community-visible profile surfaces may show only **approved fields** (for example: Crow display identity, granted Titles that are public by policy, non-sensitive Achievements/Crests, provisional or final leaderboard placement where the board itself is public).

Private Evidence, integrity notes, Trust case detail, appeal dossiers, payment records, and minor-sensitive status are not public profile fields.

### 6. Personal identity separate from Crow identity

Legal / personal identity (account identity, age assurance artifacts, payment identity, contact data) is **architecturally separate** from Crow identity (in-world learner persona and progression standing).

Progression ledgers key on Crow / learner subject IDs appropriate to progression. Personal identity linkage is governed by account/Trust architecture and must not leak into Skill Evidence interpretation.

### 7. Correction history retained

Correction and appeal history is retained for audit and explainability even when standing is reversed or corrected. Soft-erasure of correction dossiers must not silently destroy the ability to explain why standing changed (see correction states in [PROGRESSION-STATE-REGISTRY.md](../architecture/PROGRESSION-STATE-REGISTRY.md)).

### 8. Leaderboard snapshot retention (conceptual)

Leaderboard systems retain:

| Retention concept | Meaning |
|-------------------|---------|
| **Live / provisional snapshot** | Current season working placement; clearly provisional when not final |
| **Final season snapshot** | Closed-season authoritative placement for that board |
| **Correction overlay** | Post-final corrections that amend display without erasing audit of prior final |

Exact calendar retention periods are **not locked in 1A** (legal retention pending validation). Architecturally, seasons are snapshotable and archiveable.

### 9. Inactive seasons archiveable

Closed and inactive seasons may be **archived**: removed from live evaluation surfaces while remaining queryable for history, appeals within policy windows, and audit. Archival is not deletion of correction/audit truth.

### 10. Export / deletion represented

Progression architecture must represent:

| Concept | Intent |
|---------|--------|
| **Export** | Learner-accessible export of their progression standing summaries and event/ledger references they are entitled to receive |
| **Deletion / erasure request** | Governed handling that respects legal obligations, audit needs, and integrity cases |

Exact fulfillment mechanics and exceptions (e.g. ongoing integrity investigation) are **pending legal validation** and later technical validation. 1A requires the concepts to exist as first-class policy objects, not Product Code.

### 11. Legal retention pending validation

Statutory and contractual retention periods for progression, moderation, Evidence references, and financial-adjacent records are **PENDING VALIDATION**. No 1A document invents jurisdiction-specific durations.

### 12. Analytics must not expose private Evidence

Analytics, telemetry, and aggregate dashboards may use minimized, aggregated, or de-identified signals. They must **not** expose private Evidence content, moderation case bodies, or personal identity in analytics products accessible outside authorized roles.

---

## Explicit non-goals

- No database schema, column lists, or storage engine choices.
- No claim that legal retention durations are locked.
- No Product Code for export/deletion workflows.
- No numeric progression formulas.

```text
ARCHITECTURE RECOMMENDED
FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED · Legal retention PENDING VALIDATION
```
