# GHV.PRODUCT-DEFINITION.3 — Amendment 01

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PD3-AMD-01 |
| **Version** | 1.0.0 |
| **Status** | **LOCKED AS CORRECTED BASELINE AMENDMENT** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.BASELINE-CORRECTION.1 §11 |
| **Change Request** | **CR-001** |
| **Decision** | **DEC-152** |
| **Amends** | GHV.PRODUCT-DEFINITION.3 — Interaction and Wireframe Specification |
| **Date** | 2026-07-21 |

## Original Gate

| Field | Value |
|-------|-------|
| **Original Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Original verdict** | **PASS — GHURAVIA INTERACTIONS AND LOW-FIDELITY WIREFRAMES LOCKED** |
| **Originally recorded screen references** | **90**-screen wireframe statuses (DEC-051 count clause) |
| **Critical flows** | FLOW-001–016 (retained) |

## Amendment statement

```text
Original PD.3 verdict remains PASS.
Interaction and low-fidelity architecture remain valid.
Amendment does NOT rerun the Gate.
Amendment does NOT invalidate PD.3 interaction grammar.
Existing 90-screen references are SUPERSEDED by the 92-screen baseline.
No user-tested validation is claimed.
No Product Code is created.
No existing Critical Flow is removed.
```

## Activation records

| Screen | Low-fidelity specification |
|--------|----------------------------|
| ACT-003 Email Verification Pending | Inherited / amended in ACTIVATION-WIREFRAMES v1.1.0 |
| ACT-011 Email Verification Result | Governed DETAILED low-fi under BASELINE-CORRECTION.1 |
| ACT-012 Activation Recovery | Governed DETAILED low-fi under BASELINE-CORRECTION.1 |
| ACT-004 Email Verified (alias) | SUPERSEDED_ALIAS — redirect to ACT-011; not a launch destination |

## Affected documents

| Document | Role |
|----------|------|
| [WIREFRAME-REGISTRY.md](../../product/wireframes/WIREFRAME-REGISTRY.md) | v1.1.0 — 92 coverage |
| [ACTIVATION-WIREFRAMES.md](../../product/wireframes/activation/ACTIVATION-WIREFRAMES.md) | v1.1.0 |
| [CRITICAL-FLOWS.md](../../product/interactions/CRITICAL-FLOWS.md) | v1.1.0 — ACT-011/012 |
| [GHV.PRODUCT-DEFINITION.3.md](./GHV.PRODUCT-DEFINITION.3.md) | Historical report + SUPERSEDED COUNT NOTICE |
| [CR-001-SCREEN-BASELINE-CORRECTION.md](../changes/CR-001-SCREEN-BASELINE-CORRECTION.md) | Change Record |

## DEC-051 disposition

Count clause (“90-screen wireframe statuses”) marked **SUPERSEDED IN COUNT ONLY**. Low-fidelity lock intent and interaction architecture otherwise **retained**.

## Validation result

See [SCREEN-BASELINE-VALIDATION-REPORT.md](../corrections/SCREEN-BASELINE-VALIDATION-REPORT.md) — new screens have low-fi specs; usability remains **NOT RUN**.

## Approval authority

Founder (RAVEN) via **CR-001** under **GHV.BASELINE-CORRECTION.1**.

## Historical treatment

```text
SUPERSEDED COUNT NOTICE
Do not rewrite history to suggest PD.3 originally reported 92.
Original Gate date, result, and 90-count language are preserved.
Current authoritative count is 92.
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.BASELINE-CORRECTION.1 §11 — PD.3 Amendment 01 |
