# GHV.PRODUCT-DEFINITION.2 — Amendment 02

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PD2-AMD-02 |
| **Version** | 1.0.0 |
| **Status** | **LOCKED AS CORRECTED BASELINE AMENDMENT** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.BASELINE-CORRECTION.1 (reopened counting / amended by **CR-002**) |
| **Change Request** | **CR-002** |
| **Decision** | **DEC-153** |
| **Amends** | GHV.PRODUCT-DEFINITION.2 — Screen and State Architecture (after Amendment-01) |
| **Prior amendment** | [GHV.PRODUCT-DEFINITION.2-AMENDMENT-01.md](./GHV.PRODUCT-DEFINITION.2-AMENDMENT-01.md) |
| **Date** | 2026-07-21 |

## Original Gate

| Field | Value |
|-------|-------|
| **Original Gate** | GHV.PRODUCT-DEFINITION.2 |
| **Original verdict** | **PASS — SCREEN AND STATE ARCHITECTURE LOCKED** |
| **Amendment-01** | PASS retained · corrected count **92** (included ACT-004 SUPERSEDED_ALIAS in inventory table) |
| **Seven interface shells** | Unchanged (7) |

## Amendment statement

```text
Original Gate verdict remains PASS.
Amendment-01 remains historical record of 90→92 correction.
Amendment-02 does NOT rerun the Gate.
Amendment-02 does NOT invalidate PD.2 architecture.
Seven shells remain unchanged.
Corrected active baseline remains 92 — alias-safe.
SUPERSEDED_ALIAS must NOT count toward the governed 92.
```

Architecture Gate preflight discovered that counting ACT-004 (SUPERSEDED_ALIAS) inside the inventory table produced alias inflation: excluding the alias yielded **91** ACTIVE IDs. This amendment records the controlled alias-safe recount and the addition of **ACT-013 Accept Account Risk** required by Scope activation.

## Corrected distinctions (CR-002)

| Distinction | Screen ID | Treatment |
|-------------|-----------|-----------|
| Email Verification Pending | **ACT-003** | ACTIVE — unchanged |
| Email Verification Result | **ACT-011** | ACTIVE — unchanged |
| Activation Recovery | **ACT-012** | ACTIVE — unchanged |
| Email Verified (historical) | **ACT-004** | **HISTORICAL_REFERENCE / SUPERSEDED_ALIAS** — appendix only; **does NOT count** |
| Accept Account Risk | **ACT-013** | **NEW ACTIVE** — `account_risk_status = acceptable` |

- Net governed inventory: remove alias from count table (−0 ACTIVE effect vs true ACTIVE set) + add ACT-013 → **92 ACTIVE**.
- Activation family ACTIVE in table: ACT-001…003, 005…013 = **12**.
- No email-verification duplicate invented.
- Learning / Progression baselines **unchanged**. Product Code **not** authorized.

## Counting rule (locked)

```text
Governed 92 = unique ACTIVE screen IDs in the inventory table.
SUPERSEDED_ALIAS / HISTORICAL_REFERENCE rows live in appendices only.
Alias rows do NOT contribute to 92.
```

## Affected documents

| Document | Role |
|----------|------|
| [MASTER-SCREEN-REGISTRY.md](../../product/screens/MASTER-SCREEN-REGISTRY.md) | Authoritative inventory **v1.2.0** |
| [SCREEN-ID-CORRECTION-MAP.md](../../product/screens/SCREEN-ID-CORRECTION-MAP.md) | Alias appendix + ACT-013 |
| [SEVEN-SHELL-SCREEN-COUNT-RECONCILIATION.md](../../product/screens/SEVEN-SHELL-SCREEN-COUNT-RECONCILIATION.md) | Alias-safe shell totals |
| [CR-002-SCREEN-ALIAS-INFLATION-REMEDIATION.md](../changes/CR-002-SCREEN-ALIAS-INFLATION-REMEDIATION.md) | Change Record |
| [SCREEN-BASELINE-ARCHITECTURE-PREFLIGHT.md](../../architecture/ghuravia/validation/SCREEN-BASELINE-ARCHITECTURE-PREFLIGHT.md) | ARCH.1A preflight |

## Validation result

Architecture preflight: **PASS — 92 GOVERNED SCREENS VERIFIED WITHOUT ALIAS INFLATION**.

## Approval authority

Founder (RAVEN) via **CR-002** / **DEC-153** under amended **GHV.BASELINE-CORRECTION.1**.

## Historical treatment

```text
AMENDMENT NOTE
Do not rewrite history to suggest Amendment-01 already excluded aliases from the count.
Original PD.2 and Amendment-01 records are preserved.
Current authoritative governed count is 92 ACTIVE with 0 aliases in inventory.
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | CR-002 / DEC-153 — PD.2 Amendment 02 (alias-safe 92) |
