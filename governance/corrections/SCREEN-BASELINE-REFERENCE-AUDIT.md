# Screen Baseline Reference Audit

| Field | Value |
|-------|-------|
| **Document ID** | GHV-CORR-SCR-AUDIT-001 |
| **Version** | 1.1.0 |
| **Status** | **RESOLVED / HISTORICAL** — GHV.BASELINE-CORRECTION.1 PASS |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.BASELINE-CORRECTION.1 |
| **Last updated** | 2026-07-21 |
| **Change Request** | CR-001 |
| **Related** | [SCREEN-BASELINE-VALIDATION-REPORT.md](./SCREEN-BASELINE-VALIDATION-REPORT.md) · [SCREEN-BASELINE-CONSISTENCY-MATRIX.md](./SCREEN-BASELINE-CONSISTENCY-MATRIX.md) · [SCREEN-BASELINE-FREEZE-POLICY.md](./SCREEN-BASELINE-FREEZE-POLICY.md) · [CROSS-BASELINE-SCREEN-COUNT-DEFECT.md](../../product/progression/governance/CROSS-BASELINE-SCREEN-COUNT-DEFECT.md) · [GATE-REGISTER.md](../gates/GATE-REGISTER.md) · [DEC-152](../decisions/DECISION-REGISTER.md) · [MASTER-SCREEN-REGISTRY.md](../../product/screens/MASTER-SCREEN-REGISTRY.md) · [WIREFRAME-REGISTRY.md](../../product/wireframes/WIREFRAME-REGISTRY.md) |

## Purpose

Mental audit of known references to screen counts (90 vs **92**), Activation email screens, and related baseline claims. Classifies each match so correction work does not silently rewrite historical Gate records or chase false positives (prices, scorecards).

## Authoritative ID model (this Gate)

| Screen ID | Name / role | Disposition |
|-----------|-------------|-------------|
| **ACT-003** | Email Verification Pending | **ACTIVE** — renamed from Verify Email Prompt |
| **ACT-004** | (former Email Verified) | **SUPERSEDED_ALIAS** → **ACT-011**; keep ID in docs as superseded |
| **ACT-011** | Email Verification Result | **NEW — ACTIVE** |
| **ACT-012** | Activation Recovery | **NEW — ACTIVE** |
| **Totals** | **92** screens · **7** interface shells | Authoritative product decision (DEC-151) |

```text
Verified email ≠ tenant auth ≠ elevated assurance
No mandatory activation step may be bypassed via recovery UX.
```

## Classification vocabulary

| Class | Meaning |
|-------|---------|
| **ACTIVE AUTHORITATIVE** | Current authority for the definition; must align to 92 / 7 and the ID model |
| **ACTIVE SUPPORTING** | Live operational / inventory docs that cite counts or screens; update when authority changes |
| **HISTORICAL GATE RECORD** | Passed Gate report; preserve verdict text; annotate defect / correction, do not rewrite history as if 92 was always claimed |
| **SUPERSEDED REFERENCE** | Prior claim superseded by DEC-151 / this Gate; retain for traceability |
| **FALSE POSITIVE** | Numeric “90” (or similar) is **not** a screen-count claim |

---

## Audit table

| Source | Match / claim | Classification | Required treatment | Final treatment |
|--------|---------------|----------------|--------------------|-----------------|
| [MASTER-SCREEN-REGISTRY.md](../../product/screens/MASTER-SCREEN-REGISTRY.md) | Count **90**; ACT-003 “Verify Email Prompt”; ACT-004 “Email Verified”; no ACT-011/012 | **ACTIVE AUTHORITATIVE** (defective pending correction) | Reconcile inventory to **92 / 7 shells**; rename ACT-003; mark ACT-004 `SUPERSEDED_ALIAS` → ACT-011; add ACT-011, ACT-012; update exits/entries | **ACTIVE AUTHORITATIVE** after registry reconciliation under this Gate |
| [WIREFRAME-REGISTRY.md](../../product/wireframes/WIREFRAME-REGISTRY.md) | Screens covered **90 / 90**; ACT-003/004 names; Activation (10) | **ACTIVE AUTHORITATIVE** (wireframe status map; inherits count defect) | Cover **92 / 92**; rename ACT-003; supersede ACT-004; add ACT-011/012 DETAILED · CONTROLLED LAUNCH · P0; amendment 90→92 | **ACTIVE AUTHORITATIVE** — amended under this Gate (product wireframes pack) |
| [AUTHORITATIVE-SOURCE-MAP.md](../releases/AUTHORITATIVE-SOURCE-MAP.md) | Screen IDs → registry; notes defective **90** vs **92** | **ACTIVE AUTHORITATIVE** (authority map) | Keep hierarchy; when registry corrected, clear “defective 90” wording and point to corrected registry + this audit | Remains **ACTIVE AUTHORITATIVE**; notes track correction completion |
| [BASELINE-MANIFEST.md](../releases/BASELINE-MANIFEST.md) | Screen registry **DEFECTIVE PENDING CORRECTION** (90 vs 92) | **ACTIVE AUTHORITATIVE** (baseline set) | Flip screen-registry row to corrected **92 / 7** when Master Screen Registry closes | Remains **ACTIVE AUTHORITATIVE**; status row updated at Gate close |
| [GATE-REGISTER.md](../gates/GATE-REGISTER.md) | GHV.BASELINE-CORRECTION.1 **Next**; blocks ARCH.1A | **ACTIVE AUTHORITATIVE** (Gate schedule) | Execute Gate; set verdict when done; unblock ARCH.1A only after 92 reconcile | **ACTIVE AUTHORITATIVE** |
| [GHV.PRODUCT-DEFINITION.3.md](../gates/GHV.PRODUCT-DEFINITION.3.md) | “All **90** screens registered with wireframe status” | **HISTORICAL GATE RECORD** | Do **not** rewrite PASS as if 92; optional forward-pointer note to this Gate / defect doc | **HISTORICAL GATE RECORD** (preserved) |
| [DEC-051](../decisions/DECISION-REGISTER.md) — PD.3 interaction and wireframe lock | “**90**-screen wireframe statuses… locked” | **SUPERSEDED REFERENCE** (count clause) · decision otherwise still Accepted for low-fi lock | Retain DEC; note count clause superseded by **DEC-151** + BASELINE-CORRECTION.1; low-fi lock remains | **SUPERSEDED REFERENCE** for count; lock intent retained |
| [DEC-151](../decisions/DECISION-REGISTER.md) — Screen-count defect | Authoritative **7 shells / 92 screens**; defect blocks ARCH.1A | **ACTIVE AUTHORITATIVE** | Drive correction Gate; do not silently rewrite inside Progression | **ACTIVE AUTHORITATIVE** |
| [RISK-OPS-014](../risks/RISK-REGISTER.md) | “**90**-screen overcommitment” | **ACTIVE SUPPORTING** | Reframe residual UX sprawl risk to **92**-screen inventory after correction; do not treat as screen-count authority | **ACTIVE SUPPORTING** (reword on Gate close) |
| [RISK-PRG-057](../risks/RISK-REGISTER.md) | 90 listed vs 92 authoritative | **ACTIVE AUTHORITATIVE** (defect risk) | Close / reduce when MASTER-SCREEN-REGISTRY + dependents reconciled | Open until Gate close → then update status |
| [DEP-075](../dependencies/DEPENDENCY-REGISTER.md) | BASELINE-CORRECTION.1 — 92-screen reconciliation | **ACTIVE AUTHORITATIVE** (dependency) | Satisfy before ARCHITECTURE.1A | Open until Gate close |
| [CROSS-BASELINE-SCREEN-COUNT-DEFECT.md](../../product/progression/governance/CROSS-BASELINE-SCREEN-COUNT-DEFECT.md) | Defect record; Pending / Result / Recovery must be preserved | **ACTIVE AUTHORITATIVE** (defect dossier) | Mark resolved when 92 reconcile complete; do not alter Progression formula baselines | Remains authoritative dossier; status → resolved at Gate close |
| [PROJECT_STATUS.md](../../PROJECT_STATUS.md) | Next Gate BASELINE-CORRECTION.1; reconcile required | **ACTIVE SUPPORTING** | Update next/following Gate when correction completes | **ACTIVE SUPPORTING** |
| [SCOPE-TRACEABILITY-MATRIX.md](../../product/SCOPE-TRACEABILITY-MATRIX.md) | Authoritative 92 vs registry 90 defective | **ACTIVE SUPPORTING** | Align matrix counts after registry correction | **ACTIVE SUPPORTING** |
| [CAPABILITY-REGISTRY.md](../../product/CAPABILITY-REGISTRY.md) | Status notes screen-count defect recorded | **ACTIVE SUPPORTING** | Confirm CAP-ONB email/activation map to ACT-003 → ACT-011 (+ ACT-012 recovery); clear defect note when closed | **ACTIVE SUPPORTING** |
| Scope / commercial **Wing Pass SAR 90** ([SCOPE-BASELINE.md](../scope/SCOPE-BASELINE.md) §3.19 · commercial wireframes) | Price **SAR 90** | **FALSE POSITIVE** | No screen-count action | Leave unchanged |
| [PROGRESSION-ARCHITECTURE-REVIEW-SCORECARD.md](../../product/progression/governance/PROGRESSION-ARCHITECTURE-REVIEW-SCORECARD.md) (and related score totals **90**) | Architecture-review **scores**, not screen inventory | **FALSE POSITIVE** | No screen-count action | Leave unchanged |
| [MASTER-USER-JOURNEY.md](../../product/journeys/MASTER-USER-JOURNEY.md) | “Verify Email” step; no ACT-011/012 | **ACTIVE SUPPORTING** (journey authority under Source Map) | Activation sequence: Claimed/Create → **ACT-003** → **ACT-011** → Terms…; document **ACT-012** recovery; no step bypass | Amended under this Gate |
| [CRITICAL-FLOWS.md](../../product/interactions/CRITICAL-FLOWS.md) | FLOW-001 uses ACT-003 → **ACT-004** | **ACTIVE SUPPORTING** | FLOW-001 + activation paths use ACT-003 → **ACT-011**; ACT-004 alias note only; extend pending/result/resend/expired/change/interrupt/recovery | Amended under this Gate |
| [ACTIVATION-WIREFRAMES.md](../../product/wireframes/activation/ACTIVATION-WIREFRAMES.md) | ACT-003 Prompt; ACT-004 Verified; happy path via ACT-004 | **ACTIVE AUTHORITATIVE** (activation low-fi pack) | Rename ACT-003; supersede ACT-004 → ACT-011; add ACT-011/012 DETAILED; happy path ACT-003 → ACT-011 → ACT-005; Source Gate include BASELINE-CORRECTION.1 | Amended under this Gate |
| [GHV.PROGRESSION.1D.md](../gates/GHV.PROGRESSION.1D.md) | Records 90 vs 92 defect; next Gate correction | **HISTORICAL GATE RECORD** | Preserve; optional pointer to this audit | **HISTORICAL GATE RECORD** |
| Progression / Learning manifests citing defect only | Cross-ref to RISK-PRG-057 / DEP-075 | **ACTIVE SUPPORTING** | No formula or Learning baseline edits in this Gate | Unchanged content; follow defect closure |

---

## Explicit non-actions

* No Product Code.
* No Learning Design Baseline changes.
* No Progression formula / scorecard rewrites for numeric “90”.
* No silent deletion of ACT-004 ID (retain as **SUPERSEDED_ALIAS**).
* Do not treat commercial **SAR 90** or scorecard **90** as screen inventory.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.BASELINE-CORRECTION.1 — initial screen-baseline reference audit |
| 1.1.0 | 2026-07-21 | Marked RESOLVED / HISTORICAL after Gate PASS · CR-001 · DEC-152 |
