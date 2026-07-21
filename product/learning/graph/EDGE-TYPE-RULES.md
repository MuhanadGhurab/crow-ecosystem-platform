# Edge-Type Rules

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-EDGE-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Review date** | 2027-01-21 |
| **Related** | [NODE-TYPE-REGISTRY.md](./NODE-TYPE-REGISTRY.md) · [GRAPH-INVARIANTS.md](./GRAPH-INVARIANTS.md) · [GRAPH-LAYER-SEPARATION.md](./GRAPH-LAYER-SEPARATION.md) · [LAUNCH-LEARNING-GRAPH-CONCEPT.md](./LAUNCH-LEARNING-GRAPH-CONCEPT.md) · [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.7 |
| **Limitations** | Conceptual edge semantics only — no Product Code, no executable validator, no runtime edge store; edge *instances* remain architecture-recommended until 1D; no numeric XP / Mastery formulas |
| **Unresolved** | EQUIVALENT recognition evidence policy; COREQUISITE hard-gate vs soft-nudge at Capstone; multi-host SECURE_EXTENSION cardinality post-launch; bilingual edge labels |
| **Change history** | 1.0.0 (2026-07-21) — Initial ARCHITECTURE RECOMMENDED edge rules for GHV.LEARNING.1B |

## Purpose

Govern the **ten** Scope-approved Learning Graph edge types. Do not introduce other edge type names at launch. Edges never encode payment plans, subscription tiers, or Merit Grants.

**Affects eligibility** = used by Learning Eligibility overlay.  
**Affects recommendation only** = Flight Plan / UI guidance; does not alone block entry.

---

## Exhaustive launch edge set

```text
PREREQUISITE
COREQUISITE
RECOMMENDED
EQUIVALENT
BRIDGE
SECURE_EXTENSION
CONVERGENCE
UNLOCKS
EVIDENCE_FOR
REMEDIATES
```

---

## PREREQUISITE

| Aspect | Rule |
|--------|------|
| **Meaning** | Source must be satisfied before the target becomes learning-eligible. |
| **Valid sources** | FOUNDATION_LAYER, FOUNDATION_CAPABILITY, ROUTE, STAGE, CAPABILITY, BRIDGE, MISSION_PLACEHOLDER, ASSESSMENT_ANCHOR |
| **Valid targets** | ROUTE, CROSS_WING_ROUTE, SECURE_EXTENSION, STAGE, MISSION_PLACEHOLDER, ASSESSMENT_ANCHOR, CAPSTONE, CAPABILITY |
| **Mandatory / optional** | **Mandatory** when marked as hard gate on entry / Stage / Capstone; optional soft prerequisites are modeled as `RECOMMENDED` instead |
| **Affects eligibility?** | **Yes** |
| **Affects recommendation only?** | No |
| **Cycle rules** | **Mandatory prerequisite subgraph must be a directed acyclic graph (DAG).** No directed cycles among mandatory `PREREQUISITE` edges. |
| **Cardinality** | Target may have many sources; source may gate many targets. Prefer explicit Stage/capability sources over vague Route-to-Route webs. |
| **User-facing explanation** | “Complete *X* before you can start *Y*.” Always explainable (Invariant 17). |
| **Deprecation** | Deprecated edge remains visible historically; new learners follow replacement gate; Evidence tied to old path retains traceability. |

### Mandatory gate rules (PREREQUISITE)

1. Creates eligibility dependency.
2. Mandatory prerequisite subgraph must be **acyclic**.
3. A **subscription cannot** satisfy it.
4. **XP alone cannot** satisfy it.
5. May be satisfied by equivalent governed Evidence **only** through a separate recognition policy (`EQUIVALENT` + formal review) — never by name similarity or payment.

---

## COREQUISITE

| Aspect | Rule |
|--------|------|
| **Meaning** | Source should progress in parallel with the target; the target outcome is incomplete until the corequisite is satisfied by a declared latest point. |
| **Valid sources** | ROUTE, STAGE, CAPABILITY, FOUNDATION_CAPABILITY, MISSION_PLACEHOLDER |
| **Valid targets** | ROUTE, STAGE, CAPABILITY, CROSS_WING_ROUTE, SECURE_EXTENSION, CAPSTONE, MISSION_PLACEHOLDER |
| **Mandatory / optional** | **Mandatory** when Capstone / Route-Proven / Integration Mission requires it; otherwise optional parallel support |
| **Affects eligibility?** | **Yes** at the declared latest satisfaction point (may allow entry before that point) |
| **Affects recommendation only?** | No when marked mandatory; soft parallel work uses `RECOMMENDED` |
| **Cycle rules** | Mutual `COREQUISITE` pairs allowed (A↔B) if both declare the same latest satisfaction point; must not invent a mandatory `PREREQUISITE` cycle |
| **Cardinality** | Target may list multiple corequisites; each must declare **latest satisfaction point** (Stage index, Capstone, or Integration Mission) |
| **User-facing explanation** | “Work on *X* alongside *Y*; finish *X* by *checkpoint*.” |
| **Deprecation** | Same as PREREQUISITE — historical retain; replacement corequisite published explicitly |

### Mandatory gate rules (COREQUISITE)

1. May be completed in parallel.
2. Must define the **latest point** by which it must be satisfied.

---

## RECOMMENDED

| Aspect | Rule |
|--------|------|
| **Meaning** | Strengthens outcomes and may change Flight Plan ordering; does not block entry by itself. |
| **Valid sources** | Any Learning node type that prepares another (WORLD, FOUNDATION_*, HORIZON, ROUTE, STAGE, CAPABILITY, BRIDGE, CROSS_WING_ROUTE, SECURE_EXTENSION) |
| **Valid targets** | ROUTE, STAGE, CAPABILITY, CROSS_WING_ROUTE, SECURE_EXTENSION, BRIDGE, FOUNDATION_CAPABILITY, CAPSTONE, MISSION_PLACEHOLDER |
| **Mandatory / optional** | **Optional** always |
| **Affects eligibility?** | **No** |
| **Affects recommendation only?** | **Yes** |
| **Cycle rules** | Cycles allowed among recommendations (non-blocking); must not be silently promoted to mandatory (Invariant 24) |
| **Cardinality** | Unbounded; prefer sparse high-signal recommendations |
| **User-facing explanation** | “Recommended before *Y* — optional, improves readiness.” |
| **Deprecation** | Remove from Flight Plan; no eligibility change |

### Mandatory gate rules (RECOMMENDED)

1. Does not block entry.
2. May change the Flight Plan recommendation.

---

## EQUIVALENT

| Aspect | Rule |
|--------|------|
| **Meaning** | Declared alternate path or prior-learning recognition for a node — not automatic from similar titles. |
| **Valid sources** | FOUNDATION_LAYER, FOUNDATION_CAPABILITY, CAPABILITY, STAGE, ROUTE, EVIDENCE_ANCHOR (as proof artifact reference in policy, not payment) |
| **Valid targets** | FOUNDATION_LAYER, FOUNDATION_CAPABILITY, CAPABILITY, STAGE, ROUTE |
| **Mandatory / optional** | Optional edge; recognition **requires formal review** |
| **Affects eligibility?** | **Yes**, only after approved recognition policy application |
| **Affects recommendation only?** | No (once approved, it is eligibility substitution under policy) |
| **Cycle rules** | Symmetric declaration A≡B allowed; must not create Mastery inflation loops with `UNLOCKS`; must not grant advanced Mastery from Nest skip alone (Scope §3.5) |
| **Cardinality** | Many-to-one recognition possible; each requires review record |
| **User-facing explanation** | “Your prior Evidence was reviewed as equivalent to *X*.” |
| **Deprecation** | Revoke recognition via policy; retain audit of prior equivalence |

### Mandatory gate rules (EQUIVALENT)

1. Requires formal review.
2. Cannot be assumed from similar names.

---

## BRIDGE

| Aspect | Rule |
|--------|------|
| **Meaning** | Connects a known gap between capabilities; smaller than a complete Route; may contain Micro-Missions or a focused Evidence check. |
| **Valid sources** | ROUTE, STAGE, CAPABILITY, FOUNDATION_CAPABILITY, FOUNDATION_LAYER, HORIZON |
| **Valid targets** | BRIDGE node, or directly ROUTE / STAGE / CAPABILITY / CROSS_WING_ROUTE / SECURE_EXTENSION when the Bridge content is the edge payload host |
| **Mandatory / optional** | Optional by default; becomes eligibility-relevant only if paired with a `PREREQUISITE` that cites Bridge completion |
| **Affects eligibility?** | Only when explicitly gated; otherwise recommendation / insertion |
| **Affects recommendation only?** | Yes by default |
| **Cycle rules** | No Bridge chain that recreates a mandatory prerequisite cycle |
| **Cardinality** | Prefer one Bridge per declared gap; Bridge node must remain **smaller than a Route** |
| **User-facing explanation** | “Short bridge from *A* to *B* to close a specific gap.” |
| **Deprecation** | Retire Bridge content; reroute learners to replacement Bridge or Stage |

### Mandatory gate rules (BRIDGE)

1. Connects a known gap between capabilities.
2. Must be smaller than a complete Route.
3. May contain Micro-Missions or a focused Evidence check.

---

## SECURE_EXTENSION

| Aspect | Rule |
|--------|------|
| **Meaning** | Links a source capability / Route to its governed security extension. Does **not** imply full PROTECT Mastery. |
| **Valid sources** | ROUTE, CAPABILITY, STAGE (host slices) |
| **Valid targets** | SECURE_EXTENSION only |
| **Mandatory / optional** | **Mandatory attachment edge** for every SECURE_EXTENSION node (host must be explicit) |
| **Affects eligibility?** | Combined with `PREREQUISITE` for host readiness; the `SECURE_EXTENSION` edge itself declares attachment, not commercial access |
| **Affects recommendation only?** | No |
| **Cycle rules** | Direction **host → Extension only** (no reverse attachment). No cycle with mandatory `PREREQUISITE` back into host that forces mutual hard locks |
| **Cardinality** | Launch: **one primary host Route** per Extension; multi-host deferred post-launch |
| **User-facing explanation** | “*Extension* deepens security practice for *host* — not a full PROTECT Route.” |
| **Deprecation** | Detach via governed replace; retain Evidence on Extension |

### Mandatory gate rules (SECURE_EXTENSION)

1. Links a source capability to its governed security extension.
2. Does not imply full PROTECT Mastery.

---

## CONVERGENCE

| Aspect | Rule |
|--------|------|
| **Meaning** | Multiple sources meet in an integrative outcome (typically Cross-Wing Integration Mission / Capstone). |
| **Valid sources** | ROUTE, STAGE, CAPABILITY, MISSION_PLACEHOLDER |
| **Valid targets** | CROSS_WING_ROUTE, CAPSTONE, MISSION_PLACEHOLDER (Integration Mission) |
| **Mandatory / optional** | **Mandatory** for launch Cross-Wing architecture (sources must converge) |
| **Affects eligibility?** | Yes for Integration Mission / Capstone readiness when marked mandatory |
| **Affects recommendation only?** | No when mandatory |
| **Cycle rules** | Convergence targets are sinks or Integration Missions — **must not** create new hard `PREREQUISITE` edges back into both sources without an explicit Bridge node |
| **Cardinality** | ≥2 distinct Horizon-sourced inputs for Cross-Wing (Invariant 3) |
| **User-facing explanation** | “Bring *A* and *B* together in an integrated practice.” |
| **Deprecation** | Replace convergence set via architecture change request; retain historical Capstone Evidence |

### Mandatory gate rules (CONVERGENCE)

1. Joins capabilities into a new Cross-Wing outcome.
2. Requires an Integration Mission and capstone.

---

## UNLOCKS

| Aspect | Rule |
|--------|------|
| **Meaning** | Successful completion enables a next **learning** opportunity (Stage, Capstone eligibility, CXW/SEX eligibility, portfolio visibility). |
| **Valid sources** | STAGE, MISSION_PLACEHOLDER, EVIDENCE_ANCHOR, CAPSTONE, ASSESSMENT_ANCHOR, REMEDIATION, ROUTE, FOUNDATION_LAYER |
| **Valid targets** | UNLOCK, STAGE, MISSION_PLACEHOLDER, CAPSTONE, CROSS_WING_ROUTE, SECURE_EXTENSION, ASSESSMENT_ANCHOR, EVIDENCE_ANCHOR, ROUTE |
| **Mandatory / optional** | Optional structurally; when present, must be explainable |
| **Affects eligibility?** | May contribute to learning eligibility for the unlocked opportunity — **never** commercial entitlement |
| **Affects recommendation only?** | Sometimes (soft unlocks); hard unlocks affect eligibility for learning targets only |
| **Cycle rules** | No unlock loop that re-grants the same Capstone / Evidence claim; must not inflate Mastery with `EQUIVALENT` |
| **Cardinality** | Source may unlock many opportunities; each UNLOCK node should state a single primary opportunity kind |
| **User-facing explanation** | “Completing *X* unlocks *Y* (learning opportunity).” |
| **Deprecation** | Remove unlock opportunity; do not revoke commercial plans via this edge |

### Mandatory gate rules (UNLOCKS)

1. Describes a learning or progression opportunity.
2. Does **not** itself grant entitlement.

---

## EVIDENCE_FOR

| Aspect | Rule |
|--------|------|
| **Meaning** | Evidence artifact / anchor supports a capability, Stage, Route, CXW, or SEX claim. |
| **Valid sources** | EVIDENCE_ANCHOR (primary); CAPSTONE / MISSION_PLACEHOLDER when they emit Evidence |
| **Valid targets** | CAPABILITY, STAGE, ROUTE, CROSS_WING_ROUTE, SECURE_EXTENSION, CAPSTONE, FOUNDATION_CAPABILITY |
| **Mandatory / optional** | **Mandatory** that every launch Route / CXW / SEX has ≥1 practical Evidence linkage (Invariants 9, 15) |
| **Affects eligibility?** | Indirectly — Progress Graph approval of Evidence may satisfy learning requirements **only through governed rules** |
| **Affects recommendation only?** | No |
| **Cycle rules** | Evidence→claim is acyclic in claim direction; revocation traverses without rewriting educational prerequisites |
| **Cardinality** | Many Evidence items may support one capability; one Evidence may support multiple claims if declared |
| **User-facing explanation** | “This Evidence supports your claim for *capability*.” |
| **Deprecation** | Deprecated claim retains historical Evidence link (Invariant 22) |

### Mandatory gate rules (EVIDENCE_FOR)

1. Links Evidence to the capability it supports.

---

## REMEDIATES

| Aspect | Rule |
|--------|------|
| **Meaning** | Links a detected gap to an appropriate recovery path (or recovery path to the gap it addresses). |
| **Valid sources** | REMEDIATION, FOUNDATION_CAPABILITY, STAGE, ROUTE, ASSESSMENT_ANCHOR, EVIDENCE_ANCHOR, CAPSTONE, SECURE_EXTENSION, MISSION_PLACEHOLDER |
| **Valid targets** | REMEDIATION, FOUNDATION_CAPABILITY, STAGE, CAPABILITY, MISSION_PLACEHOLDER, ASSESSMENT_ANCHOR |
| **Mandatory / optional** | Mandatory that every remediation path targets an identified gap (Invariant 16) |
| **Affects eligibility?** | May restore eligibility after gap closure; does not waive unrelated prerequisites |
| **Affects recommendation only?** | Insertion under Guided Skip may be recommendation-led; hard re-entry gates use paired `PREREQUISITE` |
| **Cycle rules** | May point “backward” to gaps **without** creating unlock / prerequisite cycles |
| **Cardinality** | One remediation → one primary gap; multiple remediations may address the same gap |
| **User-facing explanation** | “This recovery path addresses *gap*.” |
| **Deprecation** | Retire remediation content; keep gap taxonomy IDs stable where possible |

### Mandatory gate rules (REMEDIATES)

1. Links a detected gap to an appropriate recovery path.

---

## Cross-cutting prohibitions

| Prohibition | Rationale |
|-------------|-----------|
| No subscription / plan edges | Invariants 18–19; Entitlement Graph owns commerce |
| No Merit Grant edges in Learning Graph | Entitlement Graph |
| No XP-threshold edges | Progression formulas deferred; XP ≠ eligibility |
| No inventing eleventh edge type | Scope §3.7 exhaustive list |
| Optional must not silently become mandatory | Invariant 24 |

## Explicit non-goals

- No Product Code or executable cycle checker in this Gate.
- No LOCKED edge catalogue until GHV.LEARNING.1D.
- No numeric Mastery / XP formulas on any edge.

## Next Gates

| Gate | Expected work |
|------|----------------|
| GHV.LEARNING.1C | Authoritative edge instances for Missions / Evidence / Capstones |
| GHV.LEARNING.1D | Lock edge catalogue; expert review of EQUIVALENT policy |
| GHV.PROGRESSION.1 | How Progress satisfaction maps through governed rules only |
