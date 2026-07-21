# Graph Invariants

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-INV-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Review date** | 2027-01-21 |
| **Related** | [NODE-TYPE-REGISTRY.md](./NODE-TYPE-REGISTRY.md) · [EDGE-TYPE-RULES.md](./EDGE-TYPE-RULES.md) · [GRAPH-LAYER-SEPARATION.md](./GRAPH-LAYER-SEPARATION.md) · [LAUNCH-LEARNING-GRAPH-CONCEPT.md](./LAUNCH-LEARNING-GRAPH-CONCEPT.md) · [NEST-DEPENDENCY-MAP.md](../nest/NEST-DEPENDENCY-MAP.md) · [LEARNING-IDENTIFIER-STANDARD.md](../architecture/LEARNING-IDENTIFIER-STANDARD.md) · [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.7 |
| **Limitations** | Conceptual invariants only — **no executable validator** in this Gate; portfolio remains **RECOMMENDED — NOT YET LOCKED**; no Product Code; no numeric XP / Mastery formulas |
| **Unresolved** | Automated validation Spike (post-1D / platform); full Stage instance binding (1C); expert review **NOT RUN** |
| **Change history** | 1.0.0 (2026-07-21) — Initial ARCHITECTURE RECOMMENDED invariants + manual PREREQUISITE acyclicity review for GHV.LEARNING.1B |

## Purpose

Lock the twenty-five conceptual Learning Graph invariants required by GHV.LEARNING.1B. Each invariant is **CONFIRMED** as an architecture rule for the launch recommendation. Catalogue elements are not finally `LOCKED` until GHV.LEARNING.1D.

---

## Invariant register

| # | Invariant | Status |
|---|-----------|--------|
| 1 | Mandatory prerequisite edges form a directed acyclic graph. | **CONFIRMED** |
| 2 | Every launch Route belongs to exactly one primary Horizon. | **CONFIRMED** |
| 3 | A Cross-Wing Route references at least two Horizon sources. | **CONFIRMED** |
| 4 | A Secure Extension references at least one source Route or capability. | **CONFIRMED** |
| 5 | A Secure Extension does not become a complete PROTECT Route. | **CONFIRMED** |
| 6 | Every Route has one defined entry condition. | **CONFIRMED** |
| 7 | Every Route has one defined exit condition. | **CONFIRMED** |
| 8 | Every Route contains at least three Stages. | **CONFIRMED** |
| 9 | Every Route contains at least one practical Evidence anchor. | **CONFIRMED** |
| 10 | Every Route contains one capstone position. | **CONFIRMED** |
| 11 | Every Stage maps to one or more capability outcomes. | **CONFIRMED** |
| 12 | Every mandatory Stage contributes to Route-Proven eligibility. | **CONFIRMED** |
| 13 | Every capstone maps to one or more Route capabilities. | **CONFIRMED** |
| 14 | Every Cross-Wing contains an Integration Mission position. | **CONFIRMED** |
| 15 | Every Cross-Wing contains independent integrated Evidence. | **CONFIRMED** |
| 16 | Every remediation path targets an identified gap. | **CONFIRMED** |
| 17 | Every locked node has an explainable user-facing reason. | **CONFIRMED** |
| 18 | Learning Graph edges do not contain payment-plan decisions. | **CONFIRMED** |
| 19 | Learning Graph edges do not contain subscription tiers. | **CONFIRMED** |
| 20 | Entitlement does not modify educational truth. | **CONFIRMED** |
| 21 | Progress does not rewrite prerequisites. | **CONFIRMED** |
| 22 | Deprecated content retains historical Evidence traceability. | **CONFIRMED** |
| 23 | A display-name change does not change a canonical ID. | **CONFIRMED** |
| 24 | Optional recommended learning does not silently become mandatory. | **CONFIRMED** |
| 25 | One foundation Route cannot produce Horizon-Proven status by itself. | **CONFIRMED** |

### Notes on selected invariants

- **Invariant 17:** “Locked” here means *learner-facing gated / unavailable UI state*, not catalogue status `LOCKED`. No Route is finally catalogue-`LOCKED` in 1B.
- **Invariants 18–20:** Entitlement Graph is separate; paid plans never satisfy `PREREQUISITE`.
- **Invariant 21:** Progress Graph may *satisfy* prerequisites only through governed recognition / Evidence rules — it must not mutate Learning Graph educational structure.
- **Invariant 25:** Horizon-Proven requires multi-Route / multi-Evidence architecture beyond a single foundation Route (see Horizon-Proven Architecture docs in 1B set).

---

## Manual validation evidence

**Scope of review:** Mandatory `PREREQUISITE` edges in the launch Learning Graph concept (GHV.LEARNING.1A map refined under 1B IDs).  
**Method:** Manual directed-edge walk and topological ordering.  
**Executable validator:** **Not created** (Gate prohibition).  
**Review date:** 2026-07-21 · **Reviewer role:** Founder-directed architecture review (RAVEN) · **Expert review:** NOT RUN.

### Mandatory PREREQUISITE spine reviewed

Canonical IDs per [LEARNING-IDENTIFIER-STANDARD.md](../architecture/LEARNING-IDENTIFIER-STANDARD.md):

```text
Nest (FOUNDATION_LAYER)
  ├─ PREREQUISITE → RT-OPR-001
  ├─ PREREQUISITE → RT-BLD-001
  ├─ PREREQUISITE → RT-PRT-001
  ├─ PREREQUISITE → RT-LED-001
  └─ PREREQUISITE → RT-ANL-001 (capacity-conditional reserve)

RT-BLD-001  ──PREREQUISITE──►  CXW-001
RT-PRT-001  ──PREREQUISITE──►  CXW-001

RT-OPR-001  ──PREREQUISITE──►  SEX-001
```

Attachment edge `SECURE_EXTENSION` (OPR → SEX) is **not** a `PREREQUISITE` cycle contributor; it is directional host→extension only.

### Acyclicity check (Nest → Routes → CXW / SEX)

| Check | Result |
|-------|--------|
| Nest → any launch Route | Forward only; no Route → Nest mandatory `PREREQUISITE` | **Pass** |
| Routes → sibling Routes as mandatory prereqs | None required for P0 spine (LEAD/others use `RECOMMENDED` / `BRIDGE`, not mandatory cycles) | **Pass** |
| RT-BLD-001 + RT-PRT-001 → CXW-001 | Both feed CXW; CXW has **no** mandatory `PREREQUISITE` back to BLD or PRT | **Pass** |
| RT-OPR-001 → SEX-001 | Forward only; SEX has **no** mandatory `PREREQUISITE` back to OPR | **Pass** |
| CXW-001 ↔ SEX-001 mandatory `PREREQUISITE` | **None** (distinct outcomes; no mutual hard gate) | **Pass** |
| CONVERGENCE BLD/PRT → CXW | Does not invent reverse hard prerequisites into both sources | **Pass** |

### Topological order (mandatory PREREQUISITE only)

```text
1. Nest (FOUNDATION_LAYER)
2. RT-OPR-001 · RT-BLD-001 · RT-PRT-001 · RT-LED-001 · (RT-ANL-001 reserve)
3. CXW-001  (after BLD + PRT)
   SEX-001  (after OPR)
```

No node appears both before and after itself on any mandatory `PREREQUISITE` path. **Verdict: acyclic.**

### Out of scope for this manual check

- Optional `RECOMMENDED` / `BRIDGE` cycles (non-blocking by rule).
- Full Stage-to-Stage prerequisite matrices inside each Route (bound in Route architecture docs; must remain DAGs when authored).
- Progress or Entitlement overlays.
- Runtime enforcement.

### Re-validation trigger

Re-run this manual review when mandatory `PREREQUISITE` instances change, before GHV.LEARNING.1D lock, and before any future executable validator is introduced.

---

## Explicit non-goals

- No Product Code.
- No executable graph validator.
- No Route / CXW / SEX marked catalogue-`LOCKED`.
- No numeric XP / Mastery / Trust formulas.

## Next Gates

| Gate | Expected work |
|------|----------------|
| GHV.LEARNING.1C | Instance-level Stage / Mission / Evidence checks against invariants 8–15 |
| GHV.LEARNING.1D | Catalogue lock; reconfirm invariant compliance |
| Platform Spike | Optional automated DAG checker (post-architecture) |
