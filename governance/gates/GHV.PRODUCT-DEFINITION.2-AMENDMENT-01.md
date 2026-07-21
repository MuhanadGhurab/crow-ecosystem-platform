# GHV.PRODUCT-DEFINITION.2 — Amendment 01

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PD2-AMD-01 |
| **Version** | 1.0.0 |
| **Status** | **LOCKED AS CORRECTED BASELINE AMENDMENT** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.BASELINE-CORRECTION.1 §11 |
| **Change Request** | **CR-001** |
| **Decision** | **DEC-152** |
| **Amends** | GHV.PRODUCT-DEFINITION.2 — Screen and State Architecture |
| **Date** | 2026-07-21 |

## Original Gate

| Field | Value |
|-------|-------|
| **Original Gate** | GHV.PRODUCT-DEFINITION.2 |
| **Original verdict** | **PASS — SCREEN AND STATE ARCHITECTURE LOCKED** |
| **Originally recorded active count** | **90** |
| **Seven interface shells** | Unchanged (7) |

## Amendment statement

```text
Original Gate verdict remains PASS.
Amendment does NOT rerun the Gate.
Amendment does NOT invalidate PD.2 architecture.
Seven shells remain unchanged.
Corrected active baseline is 92.
```

The original active count of **90** was later found inconsistent with the approved activation journey (Pending vs Result conflation; missing Activation Recovery). This amendment records the controlled correction only.

## Corrected distinctions (net +2)

| Distinction | Screen ID | Treatment |
|-------------|-----------|-----------|
| Email Verification Pending | **ACT-003** | Retained / renamed |
| Email Verification Result | **ACT-011** | **NEW** |
| Activation Recovery | **ACT-012** | **NEW** |

- Existing non-ACT canonical IDs **preserved**.
- ACT-004 retained as **SUPERSEDED_ALIAS** (not deleted).
- Net count change: **+2** → total **92**.

## Affected documents

| Document | Role |
|----------|------|
| [MASTER-SCREEN-REGISTRY.md](../../product/screens/MASTER-SCREEN-REGISTRY.md) | Authoritative inventory v1.1.0 |
| [SCREEN-ID-CORRECTION-MAP.md](../../product/screens/SCREEN-ID-CORRECTION-MAP.md) | Old→new map |
| [SEVEN-SHELL-SCREEN-COUNT-RECONCILIATION.md](../../product/screens/SEVEN-SHELL-SCREEN-COUNT-RECONCILIATION.md) | Shell totals |
| [CR-001-SCREEN-BASELINE-CORRECTION.md](../changes/CR-001-SCREEN-BASELINE-CORRECTION.md) | Change Record |
| [GHV.BASELINE-CORRECTION.1.md](./GHV.BASELINE-CORRECTION.1.md) | Correction Gate |

## Validation result

See [SCREEN-BASELINE-VALIDATION-REPORT.md](../corrections/SCREEN-BASELINE-VALIDATION-REPORT.md) and [SCREEN-BASELINE-CONSISTENCY-MATRIX.md](../corrections/SCREEN-BASELINE-CONSISTENCY-MATRIX.md) — **PASS**.

## Approval authority

Founder (RAVEN) via **CR-001** under **GHV.BASELINE-CORRECTION.1**.

## Historical treatment

```text
AMENDMENT NOTE
Do not rewrite history to suggest PD.2 originally reported 92.
Original reported count of 90 is preserved as historical.
Current authoritative count is 92.
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.BASELINE-CORRECTION.1 §11 — PD.2 Amendment 01 |
