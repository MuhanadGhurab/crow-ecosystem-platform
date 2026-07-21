# Capability Mastery vs Route Mastery vs Route-Proven Separation

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-MST-SEP-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related** | [ROUTE-MASTERY-ARCHITECTURE.md](./ROUTE-MASTERY-ARCHITECTURE.md) · [ROUTE-PROVEN-STANDARD.md](../../learning/proven/ROUTE-PROVEN-STANDARD.md) · [HORIZON-PROVEN-STANDARD.md](../../learning/proven/HORIZON-PROVEN-STANDARD.md) · [SHARED-CAPABILITY-REGISTRY.md](../../learning/architecture/SHARED-CAPABILITY-REGISTRY.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Unresolved** | Crosswalk scoring between Capability Mastery and Route Mastery → **GHV.PROGRESSION.1B** |
| **Change history** | 1.0.0 (2026-07-21) — GHV.PROGRESSION.1A Capability / Route Mastery / Route-Proven Separation |

## Purpose

Separate three constructs that must never be collapsed in product language, UX, or future formulas:

1. **Capability Mastery**
2. **Route Mastery**
3. **Route-Proven**

```text
STATUS: ARCHITECTURE RECOMMENDED
Capability Mastery ≠ Route Mastery ≠ Route-Proven ≠ Horizon-Proven
One Route-Proven ≠ Horizon-Proven (awarding deferred)
No Product Code · No numeric formulas
```

---

## Construct definitions

### Capability Mastery

| Aspect | Statement |
|--------|-----------|
| **Scope** | A single capability (or tightly scoped capability claim) from the shared capability model. |
| **Meaning** | The learner has demonstrated that capability via Evidence / assessment signals scoped to that capability. |
| **Independence** | **May exist without Route-Proven.** A learner can demonstrate a capability through Evidence without completing an entire Route’s governed Proven bundle. |
| **Non-claim** | Capability Mastery is not employment readiness and not Horizon-Proven. |

### Route Mastery

| Aspect | Statement |
|--------|-----------|
| **Scope** | Aggregated demonstrated standing across a Route’s governed capability / Evidence scope. |
| **Meaning** | The learner has demonstrated Route-scoped capability claims under Mastery architecture rules. |
| **Relationship to completion** | **Route completion may exist without Route-Proven** and without full Route Mastery. Completing Stages alone is insufficient for Proven and is not automatic Mastery. |
| **Relationship to Capability Mastery** | Route Mastery typically draws on multiple Capability Mastery signals, but holding several capabilities does not automatically equal Route-Proven. |
| **Non-claim** | Route Mastery is not a Title, not Prestige, and not Horizon-Proven. |

### Route-Proven

| Aspect | Statement |
|--------|-----------|
| **Scope** | Route-level achievement under the Learning Design Baseline. |
| **Meaning** | Learner met the **complete governed bundle** for Proven eligibility and award pathway. |
| **Required bundle (qualitative)** | All of the following, consistent with [ROUTE-PROVEN-STANDARD.md](../../learning/proven/ROUTE-PROVEN-STANDARD.md): |
| | • All **mandatory Stages** completed |
| | • All **mandatory assessments** meet governed standard |
| | • Required **Evidence** approved |
| | • **Capstone** approved |
| | • Required **remediation** complete |
| | • **No unresolved integrity** issue on the Route Evidence pack |
| | • Applicable **Trust** conditions satisfied (thresholds pending Progression — placeholder only) |
| | • **Reviewer** / review pathway satisfied for award (submit-for-review; not auto-award from completion telemetry alone) |
| **Independence** | Route-Proven requires the governed bundle; it is stricter than Stage completion and stricter than isolated Capability Mastery. |
| **Non-claim** | Route-Proven is not a subscription benefit and not Horizon-Proven. |

---

## Allowed coexistence patterns

| Pattern | Allowed? | Notes |
|---------|----------|-------|
| Capability Mastery **without** Route-Proven | **Yes** | Capability can be demonstrated early or outside full Route bundle. |
| Route completion **without** Route-Proven | **Yes** | Completion ≠ Proven (Learning Baseline). |
| Route Mastery signals **without** Route-Proven | **Possible** | Mastery aggregation may progress while Proven bundle incomplete (e.g. Capstone pending). Must not display as Proven. |
| Route-Proven **without** every optional capability | **Possible** | Proven follows mandatory governed bundle, not optional catalogue expansion. |
| Route-Proven **implies** some Route-scoped demonstration | **Yes (qualitative)** | Proven requires approved Evidence + Capstone + assessments — demonstration exists — but UX must still respect Freshness and integrity states. |
| One Route-Proven → Horizon-Proven | **No** | Horizon-Proven awarding is **deferred**; one Route is insufficient. |

---

## Separation diagram

```text
Capability Mastery (scoped skill demonstration)
        │ may accumulate into
        ▼
Route Mastery (Route-scoped demonstration standing)
        │ necessary signals, but not sufficient alone for
        ▼
Route-Proven (complete governed bundle + review pathway)
        │ contributes progress toward (does not award)
        ▼
Horizon-Proven (AWARDING DEFERRED)
```

---

## Binding rules

| ID | Rule |
|----|------|
| SEP-R1 | **Capability Mastery may exist without Route-Proven.** |
| SEP-R2 | **Route completion may exist without Route-Proven.** |
| SEP-R3 | **Route-Proven requires the complete governed bundle** (mandatory Stages, assessments, Evidence, Capstone, remediation, integrity clear, reviewer pathway, Trust placeholder). |
| SEP-R4 | **One Route-Proven ≠ Horizon-Proven.** Horizon-Proven awarding remains deferred per Learning Baseline. |
| SEP-R5 | UX and docs must use distinct labels — never show “Proven” for Capability Mastery or Stage completion alone. |
| SEP-R6 | Payment never bridges these separations. |
| SEP-R7 | Numeric crosswalks between constructs are **FORMULA PENDING** (1B). |

---

## Explicit non-goals

- No automatic Horizon-Proven.
- No collapsing Capability Mastery into Route-Proven badges.
- No Product Codes or paid Proven.
- No invented Trust scores in this Gate.

## Handoff

| Gate | Receives |
|------|----------|
| **GHV.PROGRESSION.1B** | Separation invariants; may define aggregation crosswalks without violating Learning Proven conditions |
| **Learning Proven / Horizon Proven baselines** | Remain authoritative for Proven definitions and Horizon awarding deferral |
| **Product Code / implementation** | BLOCKED |

```text
FORMULA PENDING
SIMULATION NOT RUN
CALIBRATION NOT RUN
TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED
```
