# GHURAVIA Architecture Baseline Manifest

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARC-GOV-MAN-001 |
| **Version** | 1.0.0 |
| **Baseline name** | **GHURAVIA Architecture Design Baseline v1.0.0** |
| **Status** | **ACTIVE — LOCKED AS GOVERNED ARCHITECTURE DESIGN BASELINE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1E |
| **Branch HEAD** | `6f01d1fd2b7f570e712037a5c4f035861a68063d` |
| **Lock Gate** | GHV.ARCHITECTURE.1E |

## Baseline identity

```text
GHURAVIA Architecture Design Baseline v1.0.0
LOCKED AS GOVERNED ARCHITECTURE DESIGN BASELINE
WITH NON-BLOCKING EXTERNAL / LEGAL / USER VALIDATION CONDITIONS
```

## Programme state at lock

| Dimension | State |
|-----------|-------|
| Architecture gates 1A→1E | **1A PASS — AMENDED · 1B PARTIAL · 1C PARTIAL · 1D PARTIAL · 1E PARTIAL — AMENDED (1E-AMENDMENT-01)** · Programme **COMPLETE AT GOVERNED DESIGN LEVEL** (programme completion ≠ every Gate PASS) |
| ADRs | **38** (ADR-ARC-001…038) · conflicting **0** |
| Technical spikes | **25/25 COMPLETE** · FAIL **0** · INCONCLUSIVE **0** |
| Screen baseline | **7 shells · 92 ACTIVE · 0 aliases** |
| ACT-004 | **NO** (historical appendix) |
| ACT-013 | **YES** (Accept Account Risk) |
| Learning Design Baseline v1.0.0 | **UNCHANGED** — locked separately |
| Progression Design Baseline v1.0.0 | **UNCHANGED** — locked separately |
| External technical validation | **NOT COMPLETE** |
| Product Code | **BLOCKED** |
| Implementation | **NOT GRANTED** |

## Locked separations

```text
Auth ≠ Activation ≠ Authorization ≠ Entitlement ≠ Progression
Crow ≠ Private Legal Identity
Evidence Object ↛ Progression Ledger
Commercial ↛ Progression
Notification fail ↛ Business state
Spectator ↛ Participant mutation
Trust non-public non-numeric
Scanning fail-closed
Deny by default
```

## Authoritative artefact set (1E lock package)

| # | Document | Role |
|---|----------|------|
| 1 | [FINAL-SCREEN-ARCHITECTURE-RECONCILIATION.md](./FINAL-SCREEN-ARCHITECTURE-RECONCILIATION.md) | Product ↔ architecture screen reconciliation |
| 2 | [FINAL-TECHNICAL-SPIKE-RECONCILIATION.md](./FINAL-TECHNICAL-SPIKE-RECONCILIATION.md) | Spike programme lock |
| 3 | [SPIKE-EVIDENCE-INTEGRITY-REPORT.md](./SPIKE-EVIDENCE-INTEGRITY-REPORT.md) | Evidence package integrity |
| 4 | [FINAL-ADR-REGISTRY.md](./FINAL-ADR-REGISTRY.md) | ADR lock register |
| 5 | [ADR-CROSS-CONSISTENCY-REVIEW.md](./ADR-CROSS-CONSISTENCY-REVIEW.md) | ADR chain consistency |
| 6 | [ARCHITECTURE-BASELINE-RECONCILIATION.md](./ARCHITECTURE-BASELINE-RECONCILIATION.md) | Cross-layer reconciliation |
| 7 | [FINAL-ARCHITECTURE-CONDITION-REGISTER.md](./FINAL-ARCHITECTURE-CONDITION-REGISTER.md) | Condition dispositions |
| 8 | [FINAL-PROVIDER-DEFERRAL-REGISTER.md](./FINAL-PROVIDER-DEFERRAL-REGISTER.md) | Provider deferral integrity |
| 9 | [FINAL-ARCHITECTURE-ACCEPTANCE-MATRIX.md](./FINAL-ARCHITECTURE-ACCEPTANCE-MATRIX.md) | Gate acceptance roll-up |
| 10 | [ARCHITECTURE-KNOWN-LIMITATIONS.md](./ARCHITECTURE-KNOWN-LIMITATIONS.md) | Visible limitations (§29) |
| 11 | [ARCHITECTURE-CHANGE-FREEZE-POLICY.md](./ARCHITECTURE-CHANGE-FREEZE-POLICY.md) | Change classes after lock |
| 12 | [IMPLEMENTATION-AUTHORIZATION-BOUNDARY.md](./IMPLEMENTATION-AUTHORIZATION-BOUNDARY.md) | Product Code boundary |
| 13 | [EXTERNAL-TECHNICAL-VALIDATION-HANDOFF.md](./EXTERNAL-TECHNICAL-VALIDATION-HANDOFF.md) | Next programme handoff |
| 14 | [GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md](./GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md) | This manifest |
| 15 | [GHV.ARCHITECTURE.1E.md](../../../governance/gates/GHV.ARCHITECTURE.1E.md) | Gate verdict record |

## Supporting baselines (prior gates — retained)

| Baseline | Version | Status |
|----------|---------|--------|
| Platform Stack | v1.0.0 | ACTIVE (1B) |
| Identity Security Data Evidence | v1.0.0 | ACTIVE (1C) |
| Runtime Realtime Integration Operations | v1.0.0 | ACTIVE (1D) |
| Learning Design | v1.0.0 | LOCKED (separate programme) |
| Progression Design | v1.0.0 | LOCKED (separate programme) |
| Product screen inventory | v1.2.0 CR-002 | LOCKED (separate programme) |

## Next recommended programme

**GHV.VALIDATION.1A** — external technical validation (providers, Preview, load, a11y, Arabic UX, legal, DR, pen-test). **Not started** by this Gate.

## Explicit non-claims

```text
≠ Production Ready
≠ Implementation Authorized
≠ Providers Selected
≠ Compliance Certified
≠ Learning/Progression Formula Rebaseline
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1E — initial architecture baseline manifest |
