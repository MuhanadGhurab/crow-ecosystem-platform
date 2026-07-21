# Change Request — CR-001 Screen Baseline Correction

| Field | Value |
|-------|-------|
| **Change ID** | **CR-001** |
| **Title** | Master Screen Registry 92-screen baseline correction |
| **Status** | **Approved** |
| **Date** | 2026-07-21 |
| **Effective date** | **2026-07-21** |
| **Requester** | Founder (RAVEN) |
| **Owner / Approver** | Founder (RAVEN) |
| **Related gates** | **GHV.BASELINE-CORRECTION.1** · amends GHV.PRODUCT-DEFINITION.2 · amends GHV.PRODUCT-DEFINITION.3 |
| **Related Decision** | **DEC-152** |
| **Discovery source** | Cross-baseline defect recorded in GHV.PROGRESSION.1D (DEC-151 · RISK-PRG-057 · DEP-075 · CROSS-BASELINE-SCREEN-COUNT-DEFECT) |

## Classification

```text
CONTROLLED BASELINE CORRECTION
NO PRODUCT SCOPE EXPANSION
NO PRODUCT CODE
```

Not a cosmetic typo. Not a Product Enhancement. Not a Foundational rebaseline of Pillars, shells, or journey model.

## Summary

Reconcile the Master Screen Registry and dependent product documents from a defective active count of **90** to the authoritative **92 screens across seven interface shells**, without silent ID deletion, without global renumbering, and without Product Code.

## Motivation

Authoritative product decision already required **7 shells / 92 screens**, including distinct Email Verification Pending, Email Verification Result, and Activation Recovery. Registry v1.0.0 undercounted at 90 by conflating Pending/Result and omitting Activation Recovery. The defect blocked **GHV.ARCHITECTURE.1A**.

## Previous baseline

| Item | Value |
|------|-------|
| Registry version | MASTER-SCREEN-REGISTRY **v1.0.0** |
| Active screen count | **90** |
| Shell count | 7 (unchanged) |
| Activation family | ACT-001…ACT-010 (10 records; ACT-003/004 conflated Pending/Verified) |

## Corrected baseline

| Item | Value |
|------|-------|
| Registry version | MASTER-SCREEN-REGISTRY **v1.1.0** |
| Active screen count | **92** |
| Shell count | **7** |
| Net change | **+2** (ACT-011, ACT-012) |
| ACT-003 | **RETAINED** — Email Verification Pending |
| ACT-004 | **SUPERSEDED_ALIAS** → redirect to ACT-011 (ID preserved) |
| ACT-011 | **NEW** — Email Verification Result |
| ACT-012 | **NEW** — Activation Recovery |

## Reason

Close Defect A (Pending vs Result conflation) and Defect B (missing Activation Recovery) so the registry matches the approved activation journey and the authoritative 92-screen decision, unblocking Architecture Gate planning.

## Seven-question answers

1. **Pillar** — Trust / Identity (activation assurance); supports Learning access without expanding Scope.
2. **Verified problem** — Registry listed 90 while authoritative inventory required 92; Architecture Gate blocked.
3. **Required now** — ARCHITECTURE.1A must not proceed on a defective screen inventory.
4. **Delays / replaces** — Delays nothing material; replaces defective 90-count claims; does not replace Progression or Learning baselines.
5. **Data / security / privacy** — Documentation only; no schema, runtime, or PII-handling change. Assurance semantics clarified (Verified email ≠ tenant auth ≠ elevated assurance).
6. **Architecture / learning / state / scoring** — Screen/state architecture count corrected; Learning and Progression design baselines **unchanged**; no formula or score change.
7. **Success / reverse** — Success = all active docs agree on 7/92; validation + consistency matrix PASS. Rollback meaning = restore prior registry version only via new CR (not silent revert); historical 90 remains marked superseded.

## Scope

### In scope

- Master Screen Registry correction (90 → 92)
- Screen ID correction map and seven-shell reconciliation
- Activation wireframes / critical flows / master journey amendments
- PD.2 and PD.3 controlled amendments (PASS retained, not rerun)
- Governance registers, baseline manifest, authoritative source map
- Capability / traceability updates for new activation screens
- Screen-baseline validation report, consistency matrix, freeze policy

### Out of scope

- Product Code / implementation / runtime configuration
- Learning Design Baseline content under `product/learning/`
- Progression formulas, thresholds, or design baseline rewrite
- Scope prices (including Wing Pass **SAR 90**)
- Product Constitution principles
- Usability / external / technical implementation validation execution
- Global screen renumbering or deletion of ACT-004

## Affected capabilities

- CAP-ONB-003 Email verification (matured)
- CAP-ONB-011 Verification result handling (new/matured)
- CAP-ONB-012 Activation recovery / interrupted activation (new)
- CAP-ONB-013 Safe activation support escalation (new)
- CAP-EBUX-009 Explainable Locks (matured for activation assurance)

## Affected screens

ACT-003 · ACT-004 (alias) · ACT-011 · ACT-012 · Activation shell total 12 · Global total 92

## Affected journeys / flows

Master User Journey activation sequence · FLOW-001 and activation extensions (pending, result, recovery, interrupted)

## Affected Gates

| Gate | Effect |
|------|--------|
| GHV.BASELINE-CORRECTION.1 | Executing Gate — PASS target |
| GHV.PRODUCT-DEFINITION.2 | PASS — AMENDED (not rerun) |
| GHV.PRODUCT-DEFINITION.3 | PASS — AMENDED (not rerun) |
| GHV.ARCHITECTURE.1A | Unblocked for screen-count dependency |
| GHV.PROGRESSION.1D / LEARNING.1D | Unchanged baselines |

## Affected downstream baselines

Screen registry · Wireframe registry · Critical flows · Capability registry · Scope traceability · Authoritative source map · Baseline manifest

## Impact analysis

| Area | Impact |
|------|--------|
| Product / Scope | **None** — no Pillar, price, Nest, or MLGW expansion |
| Architecture | Screen inventory corrected; seven shells unchanged; activation assurance distinctions clarified |
| Security / authority | Docs only; Verified email still does not grant A1 / tenant membership / elevated assurance alone |
| Privacy | Docs only |
| Accessibility | New screens inherit a11y/RTL requirements; external a11y review still NOT RUN |
| Localization | Arabic terminology clarifications allowed under freeze; no content rewrite |
| Implementation | **No Product Code**; future implementation must use ACT-011/012 |
| Migration | No database migration; future code must redirect ACT-004 → ACT-011 |
| Database | **None** |
| Deployment | **None** |

## Risk

| Risk | Treatment |
|------|-----------|
| RISK-PRG-057 count defect | Resolved by this CR when Gate closes |
| Residual registry drift | Tracked; freeze policy + optional DEP-078 |
| RISK-OPS-014 UX sprawl | Remains Open; inventory reframed to 92 |

## Rollback meaning

Rollback is **not** a silent git rewrite of history. To undo the corrected baseline would require a new Controlled Change Request restoring a prior registry version and re-blocking ARCH.1A. Historical Gate reports that stated 90 remain as historical records with amendment notes.

## Approval

- [x] Owner approval recorded — Founder (RAVEN) · 2026-07-21
- [x] Gate linkage recorded — GHV.BASELINE-CORRECTION.1
- [x] Evidence attached — MASTER-SCREEN-REGISTRY v1.1.0 · SCREEN-ID-CORRECTION-MAP · SEVEN-SHELL-SCREEN-COUNT-RECONCILIATION · PD.2/PD.3 Amendment-01 · SCREEN-BASELINE-VALIDATION-REPORT · SCREEN-BASELINE-CONSISTENCY-MATRIX

## Version changes

| Document | Prior → Corrected |
|----------|-------------------|
| MASTER-SCREEN-REGISTRY | 1.0.0 (90) → **1.1.0 (92)** |
| WIREFRAME-REGISTRY | 1.0.0 → **1.1.0** |
| CRITICAL-FLOWS | 1.0.0 → **1.1.0** |
| MASTER-USER-JOURNEY | 1.0.0 → **1.1.0** |
| ACTIVATION-WIREFRAMES | 1.0.0 → **1.1.0** |

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | CR-001 approved — GHV.BASELINE-CORRECTION.1 |
