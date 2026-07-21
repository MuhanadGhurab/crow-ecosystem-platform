# Node-Type Registry

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-NODE-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Review date** | 2027-01-21 |
| **Related** | [EDGE-TYPE-RULES.md](./EDGE-TYPE-RULES.md) · [GRAPH-INVARIANTS.md](./GRAPH-INVARIANTS.md) · [GRAPH-LAYER-SEPARATION.md](./GRAPH-LAYER-SEPARATION.md) · [LAUNCH-LEARNING-GRAPH-CONCEPT.md](./LAUNCH-LEARNING-GRAPH-CONCEPT.md) · [LEARNING-IDENTIFIER-STANDARD.md](../architecture/LEARNING-IDENTIFIER-STANDARD.md) · [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.7 |
| **Limitations** | Conceptual registry only — no Product Code, no database schema, no runtime graph; Route / CW / SE remain **RECOMMENDED — NOT YET LOCKED**; Mission catalogues deferred to GHV.LEARNING.1C; no numeric XP / Mastery formulas |
| **Unresolved** | Final display names (1D); Mission expansion (1C); EQUIVALENT recognition policy detail; bilingual node labeling; executable validator deferred |
| **Change history** | 1.0.0 (2026-07-21) — Initial ARCHITECTURE RECOMMENDED registry for GHV.LEARNING.1B |

## Purpose

Define every conceptual Learning Graph node type used by the launch architecture. Edge types referenced here are exhaustive for launch: `PREREQUISITE`, `COREQUISITE`, `RECOMMENDED`, `EQUIVALENT`, `BRIDGE`, `SECURE_EXTENSION`, `CONVERGENCE`, `UNLOCKS`, `EVIDENCE_FOR`, `REMEDIATES`.

**Hard rule:** every node type below has **May contain entitlement? = NO**. Entitlement lives only in the Entitlement Graph ([GRAPH-LAYER-SEPARATION.md](./GRAPH-LAYER-SEPARATION.md)).

---

## Legend

| Column | Meaning |
|--------|---------|
| Launch-visible? | Shown in learner-facing navigation / Atlas at Controlled Launch when published |
| Carries progress? | Learning node may be *referenced* by Progress Graph state; the node itself does not store progress payloads |
| Versionable? | Content / structure may receive a governed version bump without changing canonical ID |
| Deprecatable? | May be marked deprecated while retaining historical Evidence traceability (Invariant 22) |
| May contain entitlement? | Always **NO** |

---

## WORLD

| Aspect | Definition |
|--------|------------|
| **Purpose** | Top-level container for the GHURAVIA learning world (Horizons, Nest foundation, Routes). |
| **Required attributes** | Canonical ID (`WRLD-*`); display name; status; locale policy; owned Horizon set |
| **Parent / owner** | Product Scope (no Learning parent) |
| **Allowed incoming edges** | None (root) |
| **Allowed outgoing edges** | `RECOMMENDED` → HORIZON / FOUNDATION_LAYER (orientation only) |
| **Launch-visible?** | Yes |
| **Carries progress?** | No |
| **Versionable?** | Yes (structure metadata) |
| **Deprecatable?** | No at launch (single world) |
| **May contain entitlement?** | **NO** |

---

## FOUNDATION_LAYER

| Aspect | Definition |
|--------|------------|
| **Purpose** | Nest Digital Foundations as a single foundation layer before / alongside Horizon entry. |
| **Required attributes** | Canonical ID / label (Nest); readiness-band reference (Scope §3.5 — thresholds not redefined here); status |
| **Parent / owner** | WORLD |
| **Allowed incoming edges** | `EQUIVALENT` ← recognition declarations (policy-gated); `RECOMMENDED` ← WORLD |
| **Allowed outgoing edges** | `PREREQUISITE` → ROUTE / CROSS_WING_ROUTE / SECURE_EXTENSION (readiness); `REMEDIATES` → REMEDIATION; `RECOMMENDED` → ROUTE / FOUNDATION_CAPABILITY; `BRIDGE` → BRIDGE; `UNLOCKS` → UNLOCK |
| **Launch-visible?** | Yes |
| **Carries progress?** | No (Progress Graph records Nest readiness separately) |
| **Versionable?** | Yes |
| **Deprecatable?** | No at launch (replace via version, not soft-delete) |
| **May contain entitlement?** | **NO** |

---

## FOUNDATION_CAPABILITY

| Aspect | Definition |
|--------|------------|
| **Purpose** | Discrete Nest capability (e.g., account/device, passwords/MFA) for readiness targeting and Micro-Mission insertion. |
| **Required attributes** | Canonical ID (`NST-CAP-*`); capability statement; Nest owner; assessment-anchor reference (optional at 1B) |
| **Parent / owner** | FOUNDATION_LAYER |
| **Allowed incoming edges** | `REMEDIATES` ← REMEDIATION; `RECOMMENDED` ← FOUNDATION_LAYER / BRIDGE; `EQUIVALENT` ← prior-learning declarations |
| **Allowed outgoing edges** | `PREREQUISITE` → ROUTE / STAGE (weak-cap gates); `RECOMMENDED` → ROUTE / STAGE; `BRIDGE` → BRIDGE; `EVIDENCE_FOR` ← from EVIDENCE_ANCHOR (incoming); `UNLOCKS` → UNLOCK |
| **Launch-visible?** | Yes (as Nest topics / weakness reviews) |
| **Carries progress?** | No |
| **Versionable?** | Yes |
| **Deprecatable?** | Yes |
| **May contain entitlement?** | **NO** |

---

## HORIZON

| Aspect | Definition |
|--------|------------|
| **Purpose** | One of five career-domain pillars: OPERATE, BUILD, ANALYZE, PROTECT, LEAD. |
| **Required attributes** | Canonical ID (`HRZ-{OPR\|BLD\|ANL\|PRT\|LED}`); display name; primary capability theme |
| **Parent / owner** | WORLD |
| **Allowed incoming edges** | `RECOMMENDED` ← WORLD / ROUTE (orientation) |
| **Allowed outgoing edges** | `RECOMMENDED` → ROUTE; no hard `PREREQUISITE` from Horizon alone to grant Horizon-Proven |
| **Launch-visible?** | Yes (World Map) |
| **Carries progress?** | No |
| **Versionable?** | Yes (labels) |
| **Deprecatable?** | No at launch (five Horizons fixed) |
| **May contain entitlement?** | **NO** |

---

## ROUTE

| Aspect | Definition |
|--------|------------|
| **Purpose** | Foundation learning path within one primary Horizon (P0 launch Routes and capacity-conditional reserve). |
| **Required attributes** | Canonical ID (`RT-*`); working title; primary Horizon; entry / exit conditions; status (**not LOCKED** until 1D); Stage sequence reference |
| **Parent / owner** | HORIZON (primary); WORLD indirectly |
| **Allowed incoming edges** | `PREREQUISITE` ← FOUNDATION_LAYER / FOUNDATION_CAPABILITY / ROUTE / STAGE / BRIDGE / CAPABILITY; `COREQUISITE` ← ROUTE / CAPABILITY / STAGE; `RECOMMENDED` ← any learning prep node; `EQUIVALENT` ← recognition; `BRIDGE` ← BRIDGE; `CONVERGENCE` (rare — Route as sink only if justified); `UNLOCKS` ← UNLOCK / EVIDENCE_ANCHOR / CAPSTONE; `REMEDIATES` ← REMEDIATION |
| **Allowed outgoing edges** | `PREREQUISITE` → CROSS_WING_ROUTE / SECURE_EXTENSION / STAGE / CAPSTONE; `COREQUISITE` → ROUTE / STAGE / CAPABILITY; `RECOMMENDED` → ROUTE / CROSS_WING_ROUTE / SECURE_EXTENSION / CAPABILITY; `BRIDGE` → BRIDGE; `SECURE_EXTENSION` → SECURE_EXTENSION; `CONVERGENCE` → CROSS_WING_ROUTE; `UNLOCKS` → UNLOCK / STAGE; `EVIDENCE_FOR` (via owned anchors); `REMEDIATES` → REMEDIATION |
| **Launch-visible?** | Yes when published in catalogue |
| **Carries progress?** | No |
| **Versionable?** | Yes |
| **Deprecatable?** | Yes |
| **May contain entitlement?** | **NO** |

---

## CROSS_WING_ROUTE

| Aspect | Definition |
|--------|------------|
| **Purpose** | Integrative path requiring ≥2 Horizon sources; hosts Integration Mission and independent integrated Evidence. |
| **Required attributes** | Canonical ID (`CXW-*`); source Horizons (≥2); Integration Mission placeholder; Evidence / Capstone positions; status (**not LOCKED** until 1D) |
| **Parent / owner** | WORLD (multi-Horizon); not a single Horizon child |
| **Allowed incoming edges** | `PREREQUISITE` ← ROUTE / STAGE / CAPABILITY; `COREQUISITE` ← CAPABILITY / STAGE; `RECOMMENDED` ← ROUTE / CAPABILITY; `CONVERGENCE` ← ROUTE / CAPABILITY / STAGE; `BRIDGE` ← BRIDGE; `UNLOCKS` ← UNLOCK / EVIDENCE_ANCHOR; `REMEDIATES` ← REMEDIATION |
| **Allowed outgoing edges** | `UNLOCKS` → UNLOCK / ROUTE (further depth — content unlock only); `EVIDENCE_FOR` (via owned anchors); `RECOMMENDED` → ROUTE / CAPABILITY; `REMEDIATES` → REMEDIATION; `BRIDGE` → BRIDGE |
| **Launch-visible?** | Yes when published |
| **Carries progress?** | No |
| **Versionable?** | Yes |
| **Deprecatable?** | Yes |
| **May contain entitlement?** | **NO** |

---

## SECURE_EXTENSION

| Aspect | Definition |
|--------|------------|
| **Purpose** | Governed security deepening of a host capability / Route — **not** a complete PROTECT Route. |
| **Required attributes** | Canonical ID (`SEX-*`); host Route or CAPABILITY reference; attachment rationale; Evidence / Capstone positions; status (**not LOCKED** until 1D) |
| **Parent / owner** | Host ROUTE or CAPABILITY (attachment); WORLD for catalogue listing |
| **Allowed incoming edges** | `PREREQUISITE` ← ROUTE / STAGE / CAPABILITY / FOUNDATION_LAYER; `SECURE_EXTENSION` ← ROUTE / CAPABILITY (required attachment type); `COREQUISITE` ← CAPABILITY / STAGE; `RECOMMENDED` ← ROUTE / CAPABILITY; `BRIDGE` ← BRIDGE; `UNLOCKS` ← UNLOCK; `REMEDIATES` ← REMEDIATION |
| **Allowed outgoing edges** | `UNLOCKS` → UNLOCK; `EVIDENCE_FOR` (via owned anchors); `REMEDIATES` → REMEDIATION; `RECOMMENDED` → ROUTE / CAPABILITY (further study — not entitlement) |
| **Launch-visible?** | Yes when published |
| **Carries progress?** | No |
| **Versionable?** | Yes |
| **Deprecatable?** | Yes |
| **May contain entitlement?** | **NO** |

---

## STAGE

| Aspect | Definition |
|--------|------------|
| **Purpose** | Ordered learning block inside a Route / CXW / SEX; maps to one or more capability outcomes. |
| **Required attributes** | Canonical ID (`*-STG-*`); owner Route/CXW/SEX; sequence index; capability outcome refs; mandatory vs optional flag |
| **Parent / owner** | ROUTE, CROSS_WING_ROUTE, or SECURE_EXTENSION |
| **Allowed incoming edges** | `PREREQUISITE` ← STAGE / FOUNDATION_CAPABILITY / BRIDGE / CAPABILITY; `COREQUISITE` ← STAGE / CAPABILITY; `RECOMMENDED` ← STAGE / CAPABILITY / BRIDGE; `UNLOCKS` ← UNLOCK / MISSION_PLACEHOLDER / EVIDENCE_ANCHOR; `REMEDIATES` ← REMEDIATION; `BRIDGE` ← BRIDGE |
| **Allowed outgoing edges** | `PREREQUISITE` → STAGE / CAPSTONE / CROSS_WING_ROUTE / SECURE_EXTENSION; `COREQUISITE` → STAGE / CAPABILITY; `RECOMMENDED` → STAGE / CAPABILITY; `CONVERGENCE` → CROSS_WING_ROUTE / CAPSTONE; `UNLOCKS` → UNLOCK / MISSION_PLACEHOLDER; `BRIDGE` → BRIDGE; `REMEDIATES` → REMEDIATION |
| **Launch-visible?** | Yes within owned path |
| **Carries progress?** | No |
| **Versionable?** | Yes |
| **Deprecatable?** | Yes |
| **May contain entitlement?** | **NO** |

---

## MISSION_PLACEHOLDER

| Aspect | Definition |
|--------|------------|
| **Purpose** | Named Mission slot without full lesson content (1C expands). Includes Integration Mission positions on Cross-Wing. |
| **Required attributes** | Canonical ID (`*-MSN-*`); owner Stage; Mission category; practical vs assessment flag |
| **Parent / owner** | STAGE (or CAPSTONE when Integration Mission is capstone-adjacent) |
| **Allowed incoming edges** | `PREREQUISITE` ← STAGE / MISSION_PLACEHOLDER / BRIDGE; `COREQUISITE` ← MISSION_PLACEHOLDER / CAPABILITY; `RECOMMENDED` ← MISSION_PLACEHOLDER; `UNLOCKS` ← UNLOCK; `REMEDIATES` ← REMEDIATION |
| **Allowed outgoing edges** | `UNLOCKS` → UNLOCK / ASSESSMENT_ANCHOR / EVIDENCE_ANCHOR; `EVIDENCE_FOR` (via produced Evidence); `CONVERGENCE` → CAPSTONE / CROSS_WING_ROUTE; `REMEDIATES` → REMEDIATION; `PREREQUISITE` → CAPSTONE / ASSESSMENT_ANCHOR |
| **Launch-visible?** | Partial (title / category; content deferred) |
| **Carries progress?** | No |
| **Versionable?** | Yes |
| **Deprecatable?** | Yes |
| **May contain entitlement?** | **NO** |

---

## ASSESSMENT_ANCHOR

| Aspect | Definition |
|--------|------------|
| **Purpose** | Declares where governed assessment occurs (Nest readiness, Stage checks, Route-Proven review eligibility) without scoring formulas. |
| **Required attributes** | Canonical ID; owner Stage / FOUNDATION_LAYER / ROUTE; assessment kind (qualitative label only); integrity-review flag |
| **Parent / owner** | STAGE, FOUNDATION_LAYER, ROUTE, CROSS_WING_ROUTE, or SECURE_EXTENSION |
| **Allowed incoming edges** | `PREREQUISITE` ← STAGE / MISSION_PLACEHOLDER; `UNLOCKS` ← UNLOCK / MISSION_PLACEHOLDER; `REMEDIATES` ← REMEDIATION |
| **Allowed outgoing edges** | `UNLOCKS` → UNLOCK / EVIDENCE_ANCHOR / CAPSTONE; `EVIDENCE_FOR` → CAPABILITY / STAGE / ROUTE; `REMEDIATES` → REMEDIATION |
| **Launch-visible?** | Yes as checkpoint labels |
| **Carries progress?** | No |
| **Versionable?** | Yes |
| **Deprecatable?** | Yes |
| **May contain entitlement?** | **NO** |

---

## EVIDENCE_ANCHOR

| Aspect | Definition |
|--------|------------|
| **Purpose** | First-class claim point for practical Evidence supporting a capability / Stage / Route / CXW / SEX outcome. |
| **Required attributes** | Canonical ID (`*-EVD-*`); owner construct; capability claim refs; visibility / defensibility intent |
| **Parent / owner** | ROUTE, CROSS_WING_ROUTE, SECURE_EXTENSION, STAGE, or CAPSTONE |
| **Allowed incoming edges** | `UNLOCKS` ← MISSION_PLACEHOLDER / ASSESSMENT_ANCHOR / CAPSTONE; `REMEDIATES` ← REMEDIATION (revision Evidence) |
| **Allowed outgoing edges** | `EVIDENCE_FOR` → CAPABILITY / STAGE / ROUTE / CROSS_WING_ROUTE / SECURE_EXTENSION / CAPSTONE; `UNLOCKS` → UNLOCK; `REMEDIATES` → REMEDIATION |
| **Launch-visible?** | Yes (portfolio / claim surfaces) |
| **Carries progress?** | No (approval state is Progress Graph) |
| **Versionable?** | Yes |
| **Deprecatable?** | Yes (retain historical traceability) |
| **May contain entitlement?** | **NO** |

---

## CAPSTONE

| Aspect | Definition |
|--------|------------|
| **Purpose** | Culminating integrative position for a Route / CXW / SEX; maps to one or more Route capabilities. |
| **Required attributes** | Canonical ID (`*-CAP-*`); owner path; capability outcome refs; Evidence-anchor linkage |
| **Parent / owner** | ROUTE, CROSS_WING_ROUTE, or SECURE_EXTENSION |
| **Allowed incoming edges** | `PREREQUISITE` ← STAGE / MISSION_PLACEHOLDER / ASSESSMENT_ANCHOR; `COREQUISITE` ← STAGE / CAPABILITY; `CONVERGENCE` ← STAGE / CAPABILITY / ROUTE; `UNLOCKS` ← UNLOCK; `RECOMMENDED` ← STAGE; `REMEDIATES` ← REMEDIATION |
| **Allowed outgoing edges** | `EVIDENCE_FOR` → CAPABILITY / ROUTE / CROSS_WING_ROUTE; `UNLOCKS` → UNLOCK; `REMEDIATES` → REMEDIATION |
| **Launch-visible?** | Yes |
| **Carries progress?** | No |
| **Versionable?** | Yes |
| **Deprecatable?** | Yes |
| **May contain entitlement?** | **NO** |

---

## BRIDGE

| Aspect | Definition |
|--------|------------|
| **Purpose** | Short connector smaller than a complete Route; closes a known capability gap (may host Micro-Missions or a focused Evidence check). |
| **Required attributes** | Canonical ID (`BRG-*`); source / target capability or Horizon refs; size bound (not a Route); gap statement |
| **Parent / owner** | FOUNDATION_LAYER, ROUTE, or HORIZON (hosting) |
| **Allowed incoming edges** | `BRIDGE` ← ROUTE / STAGE / FOUNDATION_CAPABILITY / CAPABILITY; `RECOMMENDED` ← ROUTE / FOUNDATION_CAPABILITY; `REMEDIATES` ← REMEDIATION |
| **Allowed outgoing edges** | `BRIDGE` → ROUTE / STAGE / CAPABILITY / CROSS_WING_ROUTE / SECURE_EXTENSION; `PREREQUISITE` → STAGE / ROUTE (only when Bridge completion is a true eligibility gate); `RECOMMENDED` → ROUTE / STAGE; `UNLOCKS` → UNLOCK; `EVIDENCE_FOR` (if Bridge produces Evidence) |
| **Launch-visible?** | Yes when inserted into Flight Plan |
| **Carries progress?** | No |
| **Versionable?** | Yes |
| **Deprecatable?** | Yes |
| **May contain entitlement?** | **NO** |

---

## REMEDIATION

| Aspect | Definition |
|--------|------------|
| **Purpose** | Recovery path targeting an identified readiness or mastery gap (Micro-Mission, revision Mission, misconfig fix pattern). |
| **Required attributes** | Canonical ID (`RMD-*`); targeted gap ID / capability; trigger source (assessment, Evidence failure, Guided Skip); exit condition |
| **Parent / owner** | FOUNDATION_LAYER, ROUTE, STAGE, or SECURE_EXTENSION (host) |
| **Allowed incoming edges** | `REMEDIATES` ← FOUNDATION_CAPABILITY / STAGE / ROUTE / ASSESSMENT_ANCHOR / EVIDENCE_ANCHOR / CAPSTONE / SECURE_EXTENSION (gap detectors point to remediation **or** remediation points to gap — see EDGE rules); `RECOMMENDED` ← STAGE |
| **Allowed outgoing edges** | `REMEDIATES` → FOUNDATION_CAPABILITY / STAGE / CAPABILITY / MISSION_PLACEHOLDER; `UNLOCKS` → UNLOCK (remediation exit); `PREREQUISITE` → STAGE (re-entry gate after remediation, if mandatory); `EVIDENCE_FOR` → CAPABILITY (remediation Evidence) |
| **Launch-visible?** | Yes when triggered |
| **Carries progress?** | No |
| **Versionable?** | Yes |
| **Deprecatable?** | Yes |
| **May contain entitlement?** | **NO** |

---

## UNLOCK

| Aspect | Definition |
|--------|------------|
| **Purpose** | Declares a learning or progression *opportunity* enabled by prior completion (next Stage, capstone eligibility, CXW/SEX eligibility, portfolio visibility). **Does not grant commercial entitlement, XP, Prestige, Trust, or titles.** |
| **Required attributes** | Canonical ID (`ULK-*`); unlock kind (qualitative); source completion refs; target opportunity refs |
| **Parent / owner** | Owning ROUTE / CXW / SEX / FOUNDATION_LAYER catalogue |
| **Allowed incoming edges** | `UNLOCKS` ← STAGE / MISSION_PLACEHOLDER / EVIDENCE_ANCHOR / CAPSTONE / ASSESSMENT_ANCHOR / REMEDIATION / ROUTE |
| **Allowed outgoing edges** | `UNLOCKS` → STAGE / MISSION_PLACEHOLDER / CAPSTONE / CROSS_WING_ROUTE / SECURE_EXTENSION / ASSESSMENT_ANCHOR / EVIDENCE_ANCHOR (opportunity targets); never subscription / plan nodes |
| **Launch-visible?** | Yes as explainable unlock reasons |
| **Carries progress?** | No |
| **Versionable?** | Yes |
| **Deprecatable?** | Yes |
| **May contain entitlement?** | **NO** |

---

## CAPABILITY

| Aspect | Definition |
|--------|------------|
| **Purpose** | Shared or Route-local capability outcome statement (prevents duplicated learning; used by Evidence and Stage mapping). Distinct from FOUNDATION_CAPABILITY (Nest-only). |
| **Required attributes** | Canonical ID (`SHC-*` for shared; Route-scoped IDs when local); statement; authoritative location Route/Stage; freshness class |
| **Parent / owner** | Authoritative ROUTE / STAGE (shared caps declared once) |
| **Allowed incoming edges** | `EVIDENCE_FOR` ← EVIDENCE_ANCHOR; `PREREQUISITE` ← CAPABILITY / STAGE / FOUNDATION_CAPABILITY; `COREQUISITE` ← CAPABILITY / STAGE; `RECOMMENDED` ← ROUTE / STAGE; `EQUIVALENT` ← recognition; `BRIDGE` ← BRIDGE; `REMEDIATES` ← REMEDIATION; `CONVERGENCE` (as source into CXW) |
| **Allowed outgoing edges** | `PREREQUISITE` → STAGE / ROUTE / CROSS_WING_ROUTE / SECURE_EXTENSION / CAPSTONE; `COREQUISITE` → STAGE / CAPABILITY; `RECOMMENDED` → ROUTE / STAGE / CROSS_WING_ROUTE / SECURE_EXTENSION; `SECURE_EXTENSION` → SECURE_EXTENSION; `CONVERGENCE` → CROSS_WING_ROUTE / CAPSTONE; `BRIDGE` → BRIDGE; `UNLOCKS` → UNLOCK |
| **Launch-visible?** | Yes in capability / Atlas views |
| **Carries progress?** | No |
| **Versionable?** | Yes |
| **Deprecatable?** | Yes |
| **May contain entitlement?** | **NO** |

---

## Entitlement prohibition (summary)

| Rule | Enforcement |
|------|-------------|
| No subscription tier on any node | Architecture review; 1D lock checklist |
| No Merit Grant / scholarship fields on Learning nodes | Entitlement Graph only |
| No paid-plan prerequisite | Edge rules + Invariant 18–20 |
| `UNLOCKS` ≠ commercial unlock | Unlock Architecture boundary |

## Explicit non-goals

- No Product Code or runtime validators.
- No LOCKED Route / CXW / SEX status in this document.
- No numeric XP / Mastery / Trust formulas.
- No payment or concurrency-slot data on Learning nodes.

## Next Gates

| Gate | Expected work |
|------|----------------|
| GHV.LEARNING.1C | Bind Mission / Evidence / Capstone instances to these types |
| GHV.LEARNING.1D | Catalogue lock; deprecate provisional working titles without ID churn |
| GHV.PROGRESSION.1 | Progress Graph payloads referencing these IDs |
