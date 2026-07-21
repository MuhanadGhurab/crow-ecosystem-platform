# Platform Architecture Shape Options

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-SHAPE |
| **Version** | 0.1.0 |
| **Status** | **VALIDATION PLAN** · **DECISION PENDING** (GHV.ARCHITECTURE.1B) |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §11 |
| **Last updated** | 2026-07-21 |
| **Limitations** | Scoring is candidate judgment · **NOT** stack lock · **NOT** TECHNICALLY VALIDATED · modular monolith recommended **FOR VALIDATION only** |

```text
RECOMMENDED FOR VALIDATION: Option B (Modular monolith)
NOT SELECTED / NOT LOCKED
Option D: REJECTED FOR LAUNCH
Final choice: DECISION PENDING → 1B
```

## Options

| ID | Shape |
|----|-------|
| **A** | Single deployable monolith (minimal internal boundaries) |
| **B** | Modular monolith with explicit domain boundaries |
| **C** | Frontend plus modular backend (separate deployables, shared domain modules conceptually) |
| **D** | Early distributed services |

Score scale: **1** weak · **3** adequate · **5** strong for GHURAVIA controlled launch (founder-operable, integrity-heavy).

## Score matrix

| Criterion | A | B | C | D |
|-----------|--:|--:|--:|--:|
| Founder operability | 5 | 5 | 3 | 1 |
| Development speed (pre-team) | 5 | 4 | 3 | 1 |
| Boundary clarity | 2 | 5 | 4 | 5 |
| Transactional integrity | 4 | 5 | 3 | 2 |
| Deployment complexity | 5 | 5 | 3 | 1 |
| Observability | 3 | 4 | 3 | 2 |
| Testing | 3 | 5 | 4 | 2 |
| Scaling | 2 | 3 | 4 | 5 |
| Live Sky needs | 2 | 3 | 4 | 4 |
| Evidence pipeline needs | 3 | 4 | 4 | 3 |
| Progression recalculation | 4 | 5 | 3 | 2 |
| Security isolation | 2 | 3 | 4 | 5 |
| Vendor lock-in risk | 3 | 4 | 3 | 2 |
| Cost (launch) | 5 | 5 | 3 | 1 |
| Recovery | 4 | 5 | 3 | 2 |
| Future team growth | 2 | 4 | 5 | 5 |
| **Total** | **54** | **69** | **56** | **43** |

## Option narratives

### Option A — Single deployable monolith

* **Strengths:** Fastest path; simplest ops.
* **Weaknesses:** Boundary erosion risk; harder to enforce Evidence≠Entitlement≠Progression separations in code ownership.
* **Verdict:** **ALTERNATIVE** if modular packaging overhead proves too high in spikes — still requires logical modules.

### Option B — Modular monolith with explicit domain boundaries

* **Strengths:** Matches P-09/P-22/P-23; preserves transactional integrity for activation/Evidence/progression; extraction triggers documented per domain.
* **Weaknesses:** Requires discipline (lint/ownership) without network boundaries.
* **Verdict:** **RECOMMENDED FOR VALIDATION** (candidate for 1B confirmation — **not locked**).

### Option C — Frontend plus modular backend

* **Strengths:** Clear UI/API split; can align with future separate scaling of Live Sky/Evidence upload.
* **Weaknesses:** Two deployables early; more auth/CORS/versioning surface for a founder launch.
* **Verdict:** **ALTERNATIVE** — validate if frontend hosting constraints demand split; do not assume.

### Option D — Early distributed services

* **Strengths:** Isolation and independent scale.
* **Weaknesses:** Saga/complexity, dual writes, operability collapse for single founder; weak for progression recalculation and transactional activation.
* **Verdict:** **REJECTED FOR LAUNCH**. Reconsider only after extraction triggers fire and 1E evidence exists.

## Recommendation (non-locking)

```text
RECOMMENDED FOR VALIDATION: Option B — Modular monolith
ALTERNATIVE: Option C (if deploy split forced) · Option A (if modular packaging fails spikes)
REJECTED FOR LAUNCH: Option D — Early distributed services
DEFERRED: Final selection and stack mapping → GHV.ARCHITECTURE.1B
```

Validation hypotheses for 1B/1E:

1. Domain modules can compile/test in one deployable without cyclic ownership.
2. Sensitive decisions remain single-transaction or outbox-safe inside one process.
3. Live Sky and Evidence upload adapters can harden later without rewriting ledgers.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Score options A–D; recommend B for validation only |
