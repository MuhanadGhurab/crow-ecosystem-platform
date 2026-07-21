# ADR Register — GHURAVIA Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARC-GOV-ADR-REG-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE — EMPTY OF ACCEPTED STACK ADRs** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §40 |
| **Last updated** | 2026-07-21 |
| **Framework** | [ARCHITECTURE-DECISION-FRAMEWORK.md](./ARCHITECTURE-DECISION-FRAMEWORK.md) |

```text
ACCEPTED stack ADRs in 1A: 0
Technical Decisions: NOT LOCKED
Technical Spikes Run: 0
Product Code: BLOCKED
```

## Register

| ADR ID | Title | Status | Related spike | Notes |
|--------|-------|--------|---------------|-------|
| ADR-ARC-001 | Platform architecture shape (monolith vs modular vs services) | **PROPOSED** | SPK-ARC-001 | Options evaluated in 1A plans; decision deferred to **1B** |
| ADR-ARC-002 | Application framework / runtime candidate | **PROPOSED** | SPK-ARC-001 | No ACCEPTED selection |
| ADR-ARC-003 | Primary datastore approach (relational-first) | **VALIDATION REQUIRED** | SPK-ARC-005 · 010 · 011 | No graph-DB-by-name; evidence pending |
| ADR-ARC-004 | Identity provider candidate | **PROPOSED** | SPK-ARC-003 | TECH-001 still NOT RUN |
| ADR-ARC-005 | Object-storage provider for Evidence | **PROPOSED** | SPK-ARC-007 · 008 | Isolation unproven |
| ADR-ARC-006 | Realtime transport for Live Sky | **DEFERRED** | SPK-ARC-014 · 015 | After stack + channel model |
| ADR-ARC-007 | Search backend for Arabic/mixed discovery | **DEFERRED** | SPK-ARC-016 | After stack |
| ADR-ARC-008 | Observability stack | **DEFERRED** | SPK-ARC-022 | After env isolation |
| ADR-ARC-009 | Payment provider adapter | **PROPOSED** | SPK-ARC-012 | Adapter principle only (DEC-163) |
| ADR-ARC-010 | Preview vs Production isolation mechanism | **VALIDATION REQUIRED** | SPK-ARC-021 | TECH-018 debt |

## Explicit non-claims

```text
None of the above are ACCEPTED for stack lock
None authorize Product Code
None claim technical validation complete
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A — proposed/deferred ADRs only; zero ACCEPTED stack |
