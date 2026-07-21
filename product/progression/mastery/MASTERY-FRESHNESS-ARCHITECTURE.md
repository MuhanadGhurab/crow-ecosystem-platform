# Mastery Freshness Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-MST-FRH-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related** | [ROUTE-MASTERY-ARCHITECTURE.md](./ROUTE-MASTERY-ARCHITECTURE.md) · [CAPABILITY-ROUTE-MASTERY-SEPARATION.md](./CAPABILITY-ROUTE-MASTERY-SEPARATION.md) · [ROUTE-PROVEN-STANDARD.md](../../learning/proven/ROUTE-PROVEN-STANDARD.md) · [CONTENT-FRESHNESS-AND-LIFECYCLE.md](../../learning/content/CONTENT-FRESHNESS-AND-LIFECYCLE.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Unresolved** | Refresh / reevaluation intervals → pending simulation in later Progression gates |
| **Change history** | 1.0.0 (2026-07-21) — GHV.PROGRESSION.1A Mastery Freshness Architecture |

## Purpose

Define how CyberCrow distinguishes **what was achieved historically** from **what is currently demonstrated**, and when the system should recommend refresh or require reevaluation — without erasing honest Flight Log history through ordinary updates.

```text
STATUS: ARCHITECTURE RECOMMENDED
Historical Achievement ≠ Current Demonstration
Ordinary updates do not erase history
Intervals pending simulation
No Product Code · No numeric formulas
```

---

## Freshness vocabulary

| Concept | Meaning |
|---------|---------|
| **Historical Achievement** | Durable record that a demonstration / Proven / Mastery-related event occurred in the past. Retained in Flight Log and audit history. |
| **Current Demonstration** | Whether the learner’s standing is considered presently representative for claims that depend on up-to-date practice (tooling, threats, regulations, etc.). |
| **Refresh Recommended** | Standing is not revoked; learner is advised to produce updated Evidence / practice because the claim’s currency has weakened. |
| **Reevaluation Required** | Standing cannot be relied on for dependent claims until governed reevaluation completes (stronger than refresh recommendation). |

These map to Mastery states **REFRESH_RECOMMENDED** and **REEVALUATION_REQUIRED** in [ROUTE-MASTERY-ARCHITECTURE.md](./ROUTE-MASTERY-ARCHITECTURE.md) without inventing timers here.

---

## Binding rules

| ID | Rule |
|----|------|
| FRH-R1 | **Flight Log history is retained.** Freshness changes adjust current standing labels; they do not silently delete Historical Achievement records. |
| FRH-R2 | **Technology change may trigger refresh** of Current Demonstration (e.g. major platform/tooling shifts in a Route) without wiping historical Achievement. |
| FRH-R3 | **Regulatory or compliance-sensitive change may require reevaluation** (stronger path than optional refresh). |
| FRH-R4 | **Ordinary content updates do not erase** Historical Achievement or automatically strip Route-Proven history (aligned with Learning Proven: content updates do not automatically erase historical Route-Proven). |
| FRH-R5 | **Revoked or fraudulent Evidence affects standing** — may move claims to SUSPENDED_PENDING_INTEGRITY, REEVALUATION_REQUIRED, or REVOKED — while preserving audit history of what was claimed and why it changed. |
| FRH-R6 | **Refresh is capability-specific** where possible. Expiry pressure on one capability does not blanket-invalidate unrelated Capability Mastery. |
| FRH-R7 | **Stable foundations are not aggressively expired.** Foundational concepts with slow change should not receive the same refresh pressure as fast-moving specialist tooling. |
| FRH-R8 | **Specialist domains may refresh faster** than stable foundations when tooling / threat / practice landscapes move quickly — still without numeric intervals in this Gate. |
| FRH-R9 | **Expired subscription has no freshness effect.** Lapsed payment does not decay Mastery Freshness, revoke Historical Achievement, or invent “stale because unpaid” states. |
| FRH-R10 | **The learner is told why** refresh or reevaluation is recommended/required — explainable, scoped reasons (tech change, regulation, integrity, Evidence revocation), not opaque score drops. |
| FRH-R11 | **Intervals pending simulation.** No freshness half-lives, percentages, or calendar durations are locked in this document. |

---

## Relationship matrix

| Trigger | Typical freshness outcome | History |
|---------|---------------------------|---------|
| Ordinary catalogue / lesson edit | No automatic erase; maybe no action | Preserved |
| Major tooling / platform shift in scope | Refresh Recommended (capability/Route scoped) | Preserved |
| Regulatory / mandated standard change | Reevaluation Required | Preserved |
| Evidence revoked (integrity / fraud) | Standing affected; reevaluation or revoke path | Audit preserved |
| Weak new artifact on unrelated claim | No blanket invalidation | Preserved |
| Subscription lapse | No freshness effect | Preserved |
| Protected leave / inactivity alone | No automatic Mastery erase from ordinary inactivity | Preserved |

---

## UX and communication principles

| Principle | Requirement |
|-----------|-------------|
| **Explainability** | Messages must state *what* is stale or under reevaluation and *why*. |
| **Non-punitive framing for honest refresh** | Refresh Recommended is maintenance of currency, not a moral failure. |
| **Integrity framing for fraud** | Revocation / reevaluation from integrity is distinct from tech-refresh. |
| **No paywall framing** | Never imply that paying restores freshness; payment is irrelevant to Freshness. |
| **Separation of labels** | Show Historical Achievement and Current Demonstration as distinct concepts when claims could mislead. |

---

## Alignment notes

| Baseline | Alignment |
|----------|-----------|
| Route-Proven content-update rule | Historical Proven not silently wiped by catalogue edits; new claims may need new Evidence |
| Route-Proven Evidence revocation | Triggers governed re-evaluation — maps to Reevaluation Required / integrity suspension |
| Horizon-Proven deferred | Freshness architecture does not invent Horizon awarding shortcuts |

---

## Explicit non-goals

- No locked refresh calendars or Mastery percentages.
- No subscription-driven staleness.
- No mass erase of Flight Log on content publish.
- No Product Codes.

## Handoff

| Gate | Receives |
|------|----------|
| **Simulation / calibration gates** | Must propose and test intervals before any numeric lock |
| **GHV.PROGRESSION.1B** | May draft candidate intervals only as provisional pending simulation |
| **Product Code / implementation** | BLOCKED |

```text
FORMULA PENDING
SIMULATION NOT RUN
CALIBRATION NOT RUN
TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED
Intervals pending simulation
```
