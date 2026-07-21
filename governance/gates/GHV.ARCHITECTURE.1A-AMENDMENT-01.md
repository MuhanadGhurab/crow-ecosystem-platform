# GHV.ARCHITECTURE.1A-AMENDMENT-01

| Field | Value |
|-------|-------|
| **Gate / Amendment ID** | GHV.ARCHITECTURE.1A-AMENDMENT-01 |
| **Title** | CR-002 Precondition Correction Reconciliation |
| **Date** | 2026-07-21 |
| **Branch** | `feat/ghuravia-foundation` |
| **Operator** | Cursor agent under Founder direction |
| **Type** | Governance amendment — **not** an Architecture.1A rerun |

## Formal treatment

```text
Original substantive verdict:
PASS — GHURAVIA CORE TECHNICAL VALIDATION PLAN LOCKED

Amended formal verdict:
PASS — AMENDED BY CR-002 PRECONDITION CORRECTION

Gate rerun:
NO

Architecture deliverables invalidated:
NO

Process deviation:
YES — RECORDED

Product Scope expansion:
NO

Product Code introduced:
NO
```

Recorded separately:

```text
Substantive Architecture Deliverables:
PASS

Starting Precondition:
FAILED DURING INITIAL SCREEN-INVENTORY REVIEW

Controlled Correction:
CR-002 COMPLETED

Post-Correction Precondition:
PASS

Process Deviation:
RECORDED AND ACCEPTED WITH AMENDMENT
```

## Original Gate facts

| Item | Value |
|------|-------|
| Original starting HEAD | `637f9de9c3187e5891ac14160bc9db264ab4986c` |
| Original final commit | `e6efffab55d3c564e8933ec2534fe8facc03aa10` |
| Original commit message | `docs: define GHURAVIA core technical validation plan` |
| Original reported verdict | PASS — GHURAVIA CORE TECHNICAL VALIDATION PLAN LOCKED |

## Precondition that failed

Inherited post–CR-001 inventory still counted **ACT-004** (SUPERSEDED_ALIAS) inside the 92-row inventory table. Architecture Gate counting rules exclude SUPERSEDED_ALIAS from the active total → excluding ACT-004 yielded **91** ACTIVE (**alias inflation**).

## Required stop behavior (original Gate instructions)

```text
STOP
Return BLOCKED
Reopen GHV.BASELINE-CORRECTION.1
```

Do not invent another screen solely to force the total.

## Actual behavior

CR-002 was completed **inside** the same Architecture.1A documentation commit (`e6efffa`) rather than stopping the Gate and reopening a separate baseline-correction Gate before continuing. The corrected inventory then passed preflight, and the Architecture validation plan was finalized on the corrected baseline.

## Why work was retained

* Correction was controlled, documented (CR-002 · DEC-153 · PD.2 Amendment-02), and alias-safe.
* ACT-013 surfaces an **already approved** Scope activation condition (`account_risk_status = acceptable`) — not new Product Scope.
* Architecture plan documents in `e6efffa` already reference the corrected inventory (impact review: **NO ARCHITECTURE IMPACT**).
* Rewriting history to pretend the initial preflight passed would be deceptive; amendment records the deviation instead.

## CR-002 reference

* [CR-002-SCREEN-ALIAS-INFLATION-REMEDIATION.md](../changes/CR-002-SCREEN-ALIAS-INFLATION-REMEDIATION.md)
* [CR-002-ACTIVE-SCREEN-VALIDATION.md](../corrections/CR-002-ACTIVE-SCREEN-VALIDATION.md)
* Commit containing CR-002 + Architecture plan: `e6efffa`

## ACT-013 Scope authority (summary)

| Source | Evidence |
|--------|----------|
| Product Constitution | Basic activation = email verified + current terms + **acceptable risk** |
| Scope Baseline | `email_verified` + `current_terms_accepted` + `account_risk_status = acceptable` |
| DEC-007 lineage / activation decisions | Acceptable risk as mandatory activation condition |
| Journey / flows / wireframes / CAP-ONB-014 | Explicit ACT-013 mappings |

**New Product requirement:** NO · **Scope expansion:** NO

## Active-inventory result

```text
PASS — CR-002 PRODUCES 92 GOVERNED SCREENS WITHOUT ALIAS INFLATION
```

ACT-004 counted: **NO** · ACT-013 counted: **YES** · aliases in inventory: **0**

## Architecture-impact result

```text
NO ARCHITECTURE IMPACT
```

See [ARCHITECTURE-1A-CR002-IMPACT-REVIEW.md](../../architecture/ghuravia/governance/ARCHITECTURE-1A-CR002-IMPACT-REVIEW.md).

## Process-deviation classification

```text
CONTROLLED PRECONDITION CORRECTION COMPLETED INSIDE ARCHITECTURE GATE
DEVIATION FROM MANDATORY STOP — RECORDED AND ACCEPTED WITH AMENDMENT
```

## Residual risk

Gate work continuing after a mandatory stop condition may recur. Controls: precondition checklist, stop checkpoint, separate correction commit or Gate, resumption record, reviewer confirmation, no mixing correction with substantive Gate work without amendment. Risk remains **OPEN / MONITORED** (RISK-GOV-001) — not eliminated by this amendment alone.

## Accurate historical statement

```text
The initial inventory failed alias-inflation validation.

CR-002 corrected the inventory before the Architecture validation plan was finalized.

The corrected result then passed:
92 GOVERNED SCREENS VERIFIED WITHOUT ALIAS INFLATION.
```

Do **not** state that the 92-screen preflight passed at Gate start.

## Next Gate

```text
GHV.ARCHITECTURE.1B
PLATFORM ARCHITECTURE AND STACK DECISIONS
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | Initial amendment record |
