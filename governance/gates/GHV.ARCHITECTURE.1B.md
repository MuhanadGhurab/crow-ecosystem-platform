# GHV.ARCHITECTURE.1B — Gate Report

| Field | Value |
|-------|-------|
| **Gate ID** | GHV.ARCHITECTURE.1B |
| **Title** | Platform Architecture and Stack Decisions |
| **Date** | 2026-07-21 |
| **Branch** | `feat/ghuravia-foundation` |
| **Operator** | Cursor agent under Founder direction |
| **Preflight** | [SCREEN-BASELINE-1B-PREFLIGHT.md](../../architecture/ghuravia/validation/SCREEN-BASELINE-1B-PREFLIGHT.md) · **PASS** (alias-safe 92) |
| **Verdict** | **PARTIAL — GHURAVIA CORE STACK ACCEPTED WITH NON-BLOCKING CONDITIONS** |

## AMENDMENT NOTICE — Verdict label preservation

```text
The original committed GHV.ARCHITECTURE.1B report incorrectly labeled the
Gate verdict as PASS while the body already established PARTIAL semantics
(conditions retained, P1–P3 NOT RUN, Technical Validation PARTIAL,
Product Code BLOCKED).

Authoritative Gate verdict (restored):

PARTIAL — GHURAVIA CORE STACK ACCEPTED
WITH NON-BLOCKING CONDITIONS

No formal GHV.ARCHITECTURE.1B amendment upgraded PARTIAL to PASS.
See GHV.ARCHITECTURE.1E-AMENDMENT-01 and ARCHITECTURE-1B-VERDICT-PRESERVATION-REVIEW.md.
```

## Meaning of PARTIAL

```text
CORE PLATFORM STACK BASELINE v1.0.0 ACTIVE
ADR-ARC-001..012 ACCEPTED (some WITH CONDITIONS)
P0 SPIKES COMPLETE — 6/6 PASS
P1–P3 SPIKES NOT RUN (at Gate close)
Technical Validation PARTIAL — P0 CORE SPIKES COMPLETE
Product Code BLOCKED
≠ Full technical validation
≠ Domain closure (identity provider, evidence, Live Sky, etc.)
≠ Production Ready
≠ Unconditional PASS
```

## Outcomes

- **GHURAVIA Core Platform Architecture and Stack Baseline v1.0.0** ACTIVE.
- P0 spike set **6/6 PASS**: SPK-ARC-001 · 003 · 005 · 010 · 011 · 021 — evidence under [spikes/ghuravia/architecture-1b/](../../spikes/ghuravia/architecture-1b/).
- ADR-ARC-001..012 recorded **ACCEPTED** (ADR-002 · ADR-003 · ADR-006 **WITH CONDITIONS**).
- [PLATFORM-STACK-BASELINE.md](../../architecture/ghuravia/governance/PLATFORM-STACK-BASELINE.md) · [TECHNOLOGY-DECISION-SUMMARY.md](../../architecture/ghuravia/governance/TECHNOLOGY-DECISION-SUMMARY.md) · [ARCHITECTURE-1B-DEFERRED-DECISIONS.md](../../architecture/ghuravia/governance/ARCHITECTURE-1B-DEFERRED-DECISIONS.md) published.
- Learning Design Baseline v1.0.0 **unchanged**.
- Progression Design Baseline v1.0.0 **unchanged**.
- Real-user calibration / usability validation: **NOT RUN**.
- Product Code / implementation: **BLOCKED**.

## Explicit non-claims

```text
≠ Technically Validated (full programme)
≠ P1–P3 spike closure
≠ Identity provider selected
≠ Evidence object-storage provider selected
≠ Product Code authorized
≠ Production Ready
```

## Authoritative pointers

| Area | Location |
|------|----------|
| Platform stack baseline | [PLATFORM-STACK-BASELINE.md](../../architecture/ghuravia/governance/PLATFORM-STACK-BASELINE.md) |
| ADR register | [ADR-REGISTER.md](../../architecture/ghuravia/governance/ADR-REGISTER.md) |
| P0 spike set | [ARCHITECTURE-1B-P0-SPIKE-SET.md](../../architecture/ghuravia/validation/ARCHITECTURE-1B-P0-SPIKE-SET.md) |
| Spike evidence index | [SPIKE-EVIDENCE-INDEX.md](../../spikes/ghuravia/architecture-1b/SPIKE-EVIDENCE-INDEX.md) |
| Readiness matrix | [ARCHITECTURE-READINESS-MATRIX.md](../../architecture/ghuravia/governance/ARCHITECTURE-READINESS-MATRIX.md) |
| Deferred decisions | [ARCHITECTURE-1B-DEFERRED-DECISIONS.md](../../architecture/ghuravia/governance/ARCHITECTURE-1B-DEFERRED-DECISIONS.md) |

## Next

```text
GHV.ARCHITECTURE.1C
IDENTITY, SECURITY, DATA AND EVIDENCE ARCHITECTURE
```

## Following

```text
GHV.ARCHITECTURE.1D — Runtime, Realtime, Integration and Operational Architecture
GHV.ARCHITECTURE.1E — Technical Spikes, Architecture Reconciliation and Baseline Lock
```
