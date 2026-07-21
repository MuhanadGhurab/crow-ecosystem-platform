# Learning Unlock Registry

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-ULK-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Review date** | Before GHV.LEARNING.1D |
| **Related** | [LEARNING-IDENTIFIER-STANDARD.md](./LEARNING-IDENTIFIER-STANDARD.md) · [LEARNING-ELIGIBILITY-OVERLAY.md](./LEARNING-ELIGIBILITY-OVERLAY.md) · [REMEDIATION-ARCHITECTURE.md](./REMEDIATION-ARCHITECTURE.md) · [LAUNCH-LEARNING-GRAPH-CONCEPT.md](../graph/LAUNCH-LEARNING-GRAPH-CONCEPT.md) · [ROLE-AND-TITLE-BOUNDARIES.md](../research/ROLE-AND-TITLE-BOUNDARIES.md) |
| **Limitations** | Unlock definitions only — no Mission content; no Product Codes; no entitlement SKUs |
| **Unresolved** | Per-Route ULK instance catalogue (1C/1D) · title-review workflow depth · Horizon-Proven awarding (deferred) |
| **Change history** | 1.0.0 (2026-07-21) — Learning Unlock Registry for GHV.LEARNING.1B |

## Purpose

Register **learning Unlocks** (`ULK-*`): content and review eligibility enabled by graph progress — never commercial or prestige awards.

Graph edge type: `UNLOCKS` (content unlock — not commercial entitlement).

## Hard prohibition

Unlocks **must not** directly award:

| Forbidden award | Controlled by |
|-----------------|---------------|
| Paid entitlement / plan capacity | Entitlement / commercial systems |
| XP values | Progression (GHV.PROGRESSION.1) |
| Prestige | Prestige systems |
| Trust | Trust / moderation |
| Professional titles | Title governance (later; review eligibility only here) |

Money must never purchase Unlocks that imply competence (Constitution).

## Exact launch Unlock count

| Metric | Count |
|--------|------:|
| Launch Unlock types (`ULK-*`) | **9** |

---

## Registry

### ULK-STG-001 — Next Stage

| Field | Content |
|-------|---------|
| **ID** | ULK-STG-001 |
| **Unlock type** | Next Stage |
| **What becomes available** | Entry to the next sequential Stage on the same Route / CXW / SEX |
| **Typical trigger** | Exit requirements of prior Stage met; no blocking remediation / integrity hold |
| **Eligibility overlay** | Target Stage evaluates to `ELIGIBLE` |
| **Does not award** | Route-Proven · XP · Prestige · titles · paid capacity |

### ULK-MSN-001 — Next Mission category

| Field | Content |
|-------|---------|
| **ID** | ULK-MSN-001 |
| **Unlock type** | Next Mission category |
| **What becomes available** | Access to a governed Mission category previously gated (e.g. LABORATORY after GUIDED_PRACTICE; CAPSTONE after EVIDENCE_PREPARATION) |
| **Typical trigger** | Stage progress + category prerequisites |
| **Eligibility overlay** | `ELIGIBLE` or `BRIDGE_AVAILABLE` resolved |
| **Does not award** | Mastery · Evidence approval · entitlement |

### ULK-CAP-001 — Capstone eligibility

| Field | Content |
|-------|---------|
| **ID** | ULK-CAP-001 |
| **Unlock type** | Capstone eligibility |
| **What becomes available** | Permission to start Capstone Mission / Capstone Evidence path |
| **Typical trigger** | Mandatory Stages complete (or policy-equivalent); assessments at governed standard; no open integrity issue |
| **Eligibility overlay** | Not `PREREQUISITE_MISSING` / `REMEDIATION_REQUIRED` / `INTEGRITY_REVIEW` |
| **Does not award** | Capstone approval · Route-Proven · titles |

### ULK-PRV-001 — Route-Proven review eligibility

| Field | Content |
|-------|---------|
| **ID** | ULK-PRV-001 |
| **Unlock type** | Route-Proven review eligibility |
| **What becomes available** | Submit for Route-Proven review (completion ≠ automatic Proven) |
| **Typical trigger** | Mandatory Stages · assessments · approved Evidence · approved Capstone · remediation complete · no unresolved integrity issue · applicable Trust conditions (signal only) |
| **Eligibility overlay** | `EVIDENCE_REQUIRED` cleared; not `INTEGRITY_REVIEW` |
| **Does not award** | Route-Proven status itself · subscription benefits · Horizon-Proven |

### ULK-CXW-001 — Cross-Wing eligibility

| Field | Content |
|-------|---------|
| **ID** | ULK-CXW-001 |
| **Unlock type** | Cross-Wing eligibility (learning readiness signal) |
| **What becomes available** | Learning-side clearance to attempt CXW entry checks (still subject to Final Access Decision) |
| **Typical trigger** | Required source Route Stages / capabilities; Nest/CW Nest caps; Integration Readiness signal |
| **Eligibility overlay** | Source prereqs `ELIGIBLE`; Nest band rules observed |
| **Does not award** | CXW completion · commercial entitlement · Merit Grant · Trust |

### ULK-SEX-001 — Secure Extension eligibility

| Field | Content |
|-------|---------|
| **ID** | ULK-SEX-001 |
| **Unlock type** | Secure Extension eligibility |
| **What becomes available** | Learning-side clearance to enter SEX path on host Route rules |
| **Typical trigger** | Host RT-OPR-001 core Stages (or equivalents) in progress/complete; elevated Nest security Micro-Missions if required |
| **Eligibility overlay** | Not Nest-only unlock; host prereqs required |
| **Does not award** | Full PROTECT Route · paid Extension SKU · Prestige |

### ULK-RMD-001 — Remediation exit

| Field | Content |
|-------|---------|
| **ID** | ULK-RMD-001 |
| **Unlock type** | Remediation exit |
| **What becomes available** | Return to the correct graph position after remediation complete |
| **Typical trigger** | Targeted Micro-Mission / Bridge / revision / retest passed |
| **Eligibility overlay** | Prior `REMEDIATION_REQUIRED` clears → re-evaluate target |
| **Does not award** | Retroactive Mastery · XP catch-up packages · title |

### ULK-EVD-001 — Evidence portfolio visibility

| Field | Content |
|-------|---------|
| **ID** | ULK-EVD-001 |
| **Unlock type** | Evidence portfolio visibility |
| **What becomes available** | Learner-controlled visibility of approved Evidence in portfolio surfaces (privacy-respecting) |
| **Typical trigger** | Evidence approved; privacy classification allows; learner consent for public fields |
| **Eligibility overlay** | Not blocked by `INTEGRITY_REVIEW` |
| **Does not award** | External certification · employment · Prestige |

### ULK-TTL-001 — Future professional-title review eligibility

| Field | Content |
|-------|---------|
| **ID** | ULK-TTL-001 |
| **Unlock type** | Future professional-title **review** eligibility |
| **What becomes available** | Queue for future title review when title systems exist — **not** a title grant |
| **Typical trigger** | Route-Proven (or governed bundle) + Evidence + policy window (POST-LAUNCH depth) |
| **Eligibility overlay** | Review eligibility only; awarding deferred |
| **Does not award** | Professional titles · Prestige Class · paid “title unlock” |

---

## Instance pattern (later Gates)

Per-Route instances follow `ULK-{DOMAIN}-NNN` (e.g. `ULK-OPR-001` for a specific OPR Stage unlock). This registry defines **types**; 1C/1D bind instances to Stages.

## Celebration UX

Unlock Celebration (LRN-009) may celebrate learning Unlocks. Copy must not imply purchase of skill, Prestige, Trust, or titles.

## Explicit non-goals

- No XP formulas or Prestige economy.
- No plan-gated “premium Unlocks” that fake competence.
- No automatic Horizon-Proven or Wing Key from these ULK types at launch.

## Next Gates

| Gate | Expected work |
|------|----------------|
| GHV.LEARNING.1C | Bind ULK instances to Stages / Capstones |
| GHV.LEARNING.1D | Lock unlock catalogue for launch |
| GHV.PROGRESSION.1 | Separate XP / Prestige / Trust systems |
