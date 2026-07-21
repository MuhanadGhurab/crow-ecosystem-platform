# Change Request — CR-002 Screen Alias Inflation Remediation

| Field | Value |
|-------|-------|
| **Change ID** | **CR-002** |
| **Title** | Screen-baseline alias inflation remediation (ACT-004 appendix · ACT-013 risk accept) |
| **Status** | **Approved** |
| **Date** | 2026-07-21 |
| **Effective date** | **2026-07-21** |
| **Requester** | Founder (RAVEN) |
| **Owner / Approver** | Founder (RAVEN) |
| **Related gates** | Reopens / amends **GHV.BASELINE-CORRECTION.1** · amends GHV.PRODUCT-DEFINITION.2 (Amendment-02) · unblocks ARCHITECTURE.1A preflight |
| **Related Decision** | **DEC-153** (alias-safe counting; addendum to DEC-152) |
| **Discovery source** | **GHV.ARCHITECTURE.1A** preflight — SUPERSEDED_ALIAS counted in inventory → 91 ACTIVE when ACT-004 excluded |

## Classification

```text
CONTROLLED PRECONDITION CORRECTION
CONTROLLED BASELINE CORRECTION
NO PRODUCT SCOPE EXPANSION
NO PRODUCT CODE
NO EMAIL-VERIFICATION DUPLICATE
```

Not a Product Enhancement. Not a Foundational rebaseline of Pillars, shells, or journey model. Does not invent a second email-verification screen. Not merely an editorial correction.

## Process context (Amendment-01)

| Field | Value |
|-------|-------|
| **Discovery Gate** | GHV.ARCHITECTURE.1A preflight (starting HEAD `637f9de`) |
| **Required stop** | BLOCKED · reopen GHV.BASELINE-CORRECTION.1 |
| **Actual path** | CR-002 completed inside Architecture.1A documentation commit |
| **Governing amendment** | [GHV.ARCHITECTURE.1A-AMENDMENT-01.md](../gates/GHV.ARCHITECTURE.1A-AMENDMENT-01.md) |
| **Commit reference** | `e6efffab55d3c564e8933ec2534fe8facc03aa10` (`docs: define GHURAVIA core technical validation plan`) |
| **Active-inventory validation** | [CR-002-ACTIVE-SCREEN-VALIDATION.md](../corrections/CR-002-ACTIVE-SCREEN-VALIDATION.md) |

```text
CONTROLLED PRECONDITION CORRECTION
NO PRODUCT SCOPE EXPANSION
NO PRODUCT CODE
```

## Summary

Remove **ACT-004** from the governed inventory count table (retain as **Historical Alias Appendix** only) and add **ACT-013 Accept Account Risk** as an ACTIVE Activation screen required by the Scope activation formula (`email_verified` + `current_terms_accepted` + `account_risk_status = acceptable`). Net governed count remains **92** with **0 aliases** in the inventory table.

## Motivation

Architecture Gate counting rules: **SUPERSEDED_ALIAS must NOT count toward the governed 92**. Registry v1.1.0 listed 92 table rows including ACT-004 as SUPERSEDED_ALIAS. Excluding ACT-004 yielded **91** → alias inflation. The risk-accept gate was previously underspecified (folded into ACT-006 entry) and is required by Scope — not invented solely to pad the count.

## Previous baseline (CR-001 / v1.1.0)

| Item | Value |
|------|-------|
| Registry version | MASTER-SCREEN-REGISTRY **v1.1.0** |
| Inventory table rows | **92** including ACT-004 SUPERSEDED_ALIAS |
| ACTIVE / governed when alias excluded | **91** (defect) |
| Activation family in table | ACT-001…012 (12 rows; 1 alias) |

## Corrected baseline (CR-002 / v1.2.0)

| Item | Value |
|------|-------|
| Registry version | MASTER-SCREEN-REGISTRY **v1.2.0** |
| Governed inventory table | **92** unique ACTIVE IDs · **0 aliases** |
| ACT-004 | **HISTORICAL_REFERENCE / SUPERSEDED_ALIAS** — appendix only; does **NOT** count |
| ACT-013 | **NEW ACTIVE** — Accept Account Risk |
| Activation in inventory | ACT-001…003, 005…013 = **12** ACTIVE |
| Shell totals | Public 8 · Activation 12 · Onboarding 14 · Core 39 · Commercial 6 · Trust 6 · Admin 7 = **92** |

## Reason

Satisfy Architecture Gate alias-safe counting while closing the underspecified `account_risk_status = acceptable` surface required by Scope activation.

## Seven-question answers

1. **Pillar** — Trust / Identity (activation assurance); supports Learning access without expanding Scope.
2. **Verified problem** — Alias inflation (91 ACTIVE) blocked ARCHITECTURE.1A preflight; risk accept underspecified.
3. **Required now** — ARCHITECTURE.1A must not proceed on an alias-inflated or incomplete activation inventory.
4. **Delays / replaces** — Reopens BASELINE-CORRECTION counting model only; does not replace Progression or Learning baselines; does not duplicate email verification.
5. **Data / security / privacy** — Documentation only; risk acceptance remains server-authorized; no entitlement/XP/Mastery/tenant grant on ACT-013.
6. **Architecture / learning / state / scoring** — Screen inventory counting corrected; Learning and Progression design baselines **unchanged**; no formula or score change.
7. **Success / reverse** — Success = 92 ACTIVE in inventory, 0 aliases in table, ACT-004 appendix-only, ACT-013 present, preflight PASS. Rollback via new CR only.

## Scope

### In scope

- Master Screen Registry v1.2.0 (appendix ACT-004; add ACT-013)
- Screen ID correction map and seven-shell reconciliation
- Activation wireframes / critical flows / master journey (ACT-005 → ACT-013 → ACT-006)
- PD.2 Amendment-02 (PASS retained, not rerun)
- Capability / scope traceability for risk-accept
- Architecture preflight validation artifact
- Governance registers, baseline manifest, authoritative source map

### Out of scope

- Product Code / implementation / runtime configuration
- Learning Design Baseline under `product/learning/`
- Progression formulas, thresholds, or design baseline rewrite
- Scope prices / Product Constitution principles
- Inventing email-verification duplicate screens
- Deleting the ACT-004 ID (preserved in appendix)

## Affected capabilities

- CAP-ONB-014 Account risk acceptance (new / matured to ACT-013)
- CAP-ONB-004 Terms acceptance (exit now → ACT-013; risk no longer folded into ACT-006 alone)
- CAP-ONB-003 / 011 / 012 / 013 unchanged for email Pending / Result / Recovery

## Affected screens

ACT-004 (appendix only) · ACT-005 (exit → ACT-013) · ACT-006 (entry from ACT-013) · ACT-012 (resume risk incomplete → ACT-013) · **ACT-013 NEW** · Activation shell still **12** ACTIVE · Global **92** ACTIVE

## Affected journeys / flows

Master User Journey · FLOW-001 · FLOW-001-DONE · ACT-012 recovery reasons · Activation wireframes GHV-WF-ACT-013

## Affected Gates

| Gate | Effect |
|------|--------|
| GHV.BASELINE-CORRECTION.1 | PASS retained · **amended by CR-002** (alias-safe recount) |
| GHV.PRODUCT-DEFINITION.2 | PASS — AMENDED again (Amendment-02; not rerun) |
| GHV.ARCHITECTURE.1A | Preflight unblocked for alias-inflation defect |

## Impact analysis

| Area | Impact |
|------|--------|
| Product / Scope | **None** — fulfills existing activation formula; no Pillar/price expansion |
| Architecture | Governed 92 without alias inflation; risk-accept screen explicit |
| Security / authority | Docs only; ACT-013 does not grant A1 alone (still terms + risk + email formula at ACT-006) |
| Learning / Progression | **Unchanged** |
| Product Code | **Not authorized** |

## Approval

```text
APPROVED — CONTROLLED BASELINE CORRECTION
Founder (RAVEN) · 2026-07-21 · CR-002 · DEC-153
```

## Validation result

```text
PASS — CR-002 PRODUCES 92 GOVERNED SCREENS WITHOUT ALIAS INFLATION
```

Post-correction: ACT-004 **not** counted · ACT-013 **counted** · shells **7** · ACTIVE **92** · aliases in inventory **0**.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | Initial CR-002 — alias inflation remediation |
| 1.1.0 | 2026-07-21 | Amendment-01: process context, commit ref, precondition-correction classification |
