# GHURAVIA Architecture Program — Index

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-INDEX |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN LOCKED** (1A outcomes only) |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A |
| **Last updated** | 2026-07-21 |
| **Limitations** | Technical Validation **NOT RUN** · Spikes **NOT RUN** · Architecture Baseline **NOT LOCKED** · Product Code **BLOCKED** · Stack / identity / runtime choices **DECISION PENDING** (1B–1D) |

```text
1A OUTCOMES: VALIDATION PLAN LOCKED
NOT TECHNICALLY VALIDATED
NOT PRODUCTION READY
NOT STACK LOCKED
NOT IMPLEMENTED
```

## Program sequence

| Gate | Scope | Status (this repo) |
|------|-------|--------------------|
| **GHV.ARCHITECTURE.1A** | Core Technical Validation Plan | **CURRENT** — plan artifacts in this tree |
| **GHV.ARCHITECTURE.1B** | Platform architecture and stack decisions | **NOT STARTED** · DECISION PENDING |
| **GHV.ARCHITECTURE.1C** | Identity, security, data, Evidence architecture | **NOT STARTED** · DECISION PENDING |
| **GHV.ARCHITECTURE.1D** | Runtime, realtime, integration, operations | **NOT STARTED** · DECISION PENDING |
| **GHV.ARCHITECTURE.1E** | Spikes, reconciliation, architecture baseline lock | **NOT STARTED** · NOT RUN |

`1A` defines the candidate decision space and validation questions. It does **not** perform 1B–1E work or claim feasibility proven.

## Baseline inputs (accepted, not reopened here)

| Baseline | Status |
|----------|--------|
| Product Definition / 7 shells / 92 screens (CR-002 alias-safe) | LOCKED · preflight PASS |
| Learning Design Baseline v1.0.0 | LOCKED AS GOVERNED DESIGN BASELINE |
| Progression Design Baseline v1.0.0 | LOCKED AS GOVERNED DESIGN BASELINE |
| ACT-004 | HISTORICAL appendix only — does **not** count |
| ACT-013 Accept Account Risk | ACTIVE governed screen |
| Product Code | BLOCKED |
| Technical Validation / Spikes | NOT RUN |

## Folder map — 1A core (this deliverable set)

| Path | Role |
|------|------|
| [inventory/REPOSITORY-TECHNOLOGY-INVENTORY.md](./inventory/REPOSITORY-TECHNOLOGY-INVENTORY.md) | Discovered / inherited tech — **not** approval |
| [principles/ARCHITECTURE-PRINCIPLES.md](./principles/ARCHITECTURE-PRINCIPLES.md) | 25 architecture principles (Gate §8) |
| [context/GHURAVIA-SYSTEM-CONTEXT.md](./context/GHURAVIA-SYSTEM-CONTEXT.md) | Actors, externals, trust boundaries |
| [domains/TECHNICAL-DOMAIN-CATALOGUE.md](./domains/TECHNICAL-DOMAIN-CATALOGUE.md) | Domain catalogue (no DB tables) |
| [options/PLATFORM-ARCHITECTURE-SHAPE-OPTIONS.md](./options/PLATFORM-ARCHITECTURE-SHAPE-OPTIONS.md) | Shape options A–D · recommend for validation |
| [quality/QUALITY-ATTRIBUTE-BASELINE.md](./quality/QUALITY-ATTRIBUTE-BASELINE.md) | Draft quality attributes · not SLOs |
| [quality/CRITICAL-QUALITY-SCENARIOS.md](./quality/CRITICAL-QUALITY-SCENARIOS.md) | QAS-001…020 |
| [validation/SCREEN-BASELINE-ARCHITECTURE-PREFLIGHT.md](./validation/SCREEN-BASELINE-ARCHITECTURE-PREFLIGHT.md) | 92-screen preflight PASS |

## Folder map — extended 1A validation plans (same Gate; deeper packages)

Additional VALIDATION PLAN docs under this tree (frontend, backend, data, identity, learning, progression, evidence, community, live, commercial, search, notifications, localization, accessibility, runtime, spikes, governance ADRs). All remain **NOT RUN** / **DECISION PENDING** for stack and runtime. They do **not** advance 1B–1E decision locks.

## Repository posture (docs-first)

```text
NO package.json · NO src/ · NO apps/ · NO Prisma/runtime Product Code
Inherited: vercel.json (deploy guard) · infrastructure/ stubs · analysis/progression-simulation/
Historical CyberCrow: archive tag + docs placeholders — NOT GHURAVIA stack approval
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | Initial 1A index · VALIDATION PLAN LOCKED for 1A outcomes only |
