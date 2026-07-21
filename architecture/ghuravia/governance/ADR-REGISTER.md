# ADR Register - GHURAVIA Architecture

| Field | Value |
|-------|-------|
| Document ID | GHV-ARC-GOV-ADR-REG-001 |
| Version | 1.1.0 |
| Status | ACTIVE - ARCHITECTURE 1B CORE DECISIONS RECORDED |
| Owner | Founder (RAVEN) |
| Source Gate | GHV.ARCHITECTURE.1B |
| Last updated | 2026-07-21 |
| Framework | [ARCHITECTURE-DECISION-FRAMEWORK.md](./ARCHITECTURE-DECISION-FRAMEWORK.md) |

```text
Core stack ADRs recorded in 1B: 12
Remaining RETURN TO SPIKE: 0
Conflicting ADRs: 0
Product Code: BLOCKED
```

## Register

| ADR ID | Title | Status | Related spike | Notes |
|--------|-------|--------|---------------|-------|
| ADR-ARC-001 | Platform architecture shape | ACCEPTED | SPK-ARC-001,021 | Modular monolith with explicit domain packages |
| ADR-ARC-002 | Frontend stack | ACCEPTED WITH CONDITIONS | SPK-ARC-001 | Next.js App Router + React 19 + TypeScript |
| ADR-ARC-003 | Backend stack | ACCEPTED WITH CONDITIONS | SPK-ARC-001,003,010 | Next.js Route Handlers initially; Hono optional later |
| ADR-ARC-004 | API and internal interaction model | ACCEPTED | SPK-ARC-003,010,011 | Command-oriented writes, in-process modules, outbox |
| ADR-ARC-005 | Primary datastore | ACCEPTED | SPK-ARC-005,010,011 | PostgreSQL-family relational primary |
| ADR-ARC-006 | Data access strategy | ACCEPTED WITH CONDITIONS | SPK-ARC-005,010,011 | Drizzle default; raw SQL exceptions allowed |
| ADR-ARC-007 | Learning Graph representation | ACCEPTED | SPK-ARC-005 | Relational adjacency as source of truth |
| ADR-ARC-008 | Progression event ledger pattern | ACCEPTED | SPK-ARC-010,011 | Append-only event ledger with formula versioning |
| ADR-ARC-009 | Background jobs and event publication | ACCEPTED | SPK-ARC-010,021 | Transactional outbox + local/worker jobs |
| ADR-ARC-010 | Cache boundary | ACCEPTED | SPK-ARC-005,010,021 | No shared distributed cache required at launch |
| ADR-ARC-011 | Core testing toolchain | ACCEPTED | SPK-ARC-001,005,010,011,021 | node:test for spikes; Vitest future baseline |
| ADR-ARC-012 | Core language and type safety | ACCEPTED | SPK-ARC-001,003,005,010,011 | TypeScript + shared contracts + schema validators |

## Explicit non-claims

```text
Accepted architecture decisions do not authorize Product Code
Accepted architecture decisions do not close P1-P3 validation work
Accepted architecture decisions do not claim full security, compliance, or accessibility closure
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.1.0 | 2026-07-21 | GHV.ARCHITECTURE.1B - core ADR set recorded |
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A - proposed/deferred ADRs only; zero accepted stack |
