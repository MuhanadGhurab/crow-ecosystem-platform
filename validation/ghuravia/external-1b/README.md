# GHV.VALIDATION.1B — Local-First Implementation-Entry Validation Workspace

| Field | Value |
|-------|-------|
| **Gate ID** | GHV.VALIDATION.1B |
| **Workspace path** | `validation/ghuravia/external-1b/` |
| **Date** | 2026-07-21 |
| **Owner** | Founder (RAVEN) |
| **Branch HEAD** | `4544463efdce67f03f15e8e4939d71b3af2776f6` |
| **Upstream baseline** | GHURAVIA Architecture Design Baseline **v1.0.0 — LOCKED** |
| **Prior validation gate** | GHV.VALIDATION.1A — **PARTIAL** |

## Purpose

This directory is the **governed validation workspace** for Gate **GHV.VALIDATION.1B**. It holds documentation, evidence indexes, blocker reclassification, and implementation-entry criteria for **local-first implementation-entry validation** — separating what blocks **local Product Code scaffold work** from what blocks **Preview deployment**, **public or paid feature activation**, and **controlled launch**.

This workspace is **NOT Product Code**. It does not implement GHURAVIA features, runtime services, or production configuration.

## NON-PRODUCT CODE declaration

```text
┌─────────────────────────────────────────────────────────────────┐
│  THIS WORKSPACE IS VALIDATION DOCUMENTATION ONLY                │
│                                                                 │
│  ✗ No Product Code (apps/, src/ product implementation)         │
│  ✗ No root package.json for GHURAVIA product                    │
│  ✗ No Product schemas, migrations, or database DDL               │
│  ✗ No .env files or committed credentials                       │
│  ✗ No fabricated sandbox PASS or rehearsal PASS results         │
│                                                                 │
│  ✓ Architecture Design Baseline v1.0.0 remains LOCKED           │
│  ✓ Product Code Authorization: NOT GRANTED BY VALIDATION.1B      │
│  ✓ Local Implementation Readiness: READY WITH CONDITIONS          │
│  ✓ Preview deployment: BLOCKED                                  │
│  ✓ Production deployment: BLOCKED                               │
│  ✓ Validation-only local DDL/harnesses: permitted and cleaned    │
│  ✓ External providers: MOCKED for local entry path only          │
└─────────────────────────────────────────────────────────────────┘
```

## Policy shift from Validation.1A

Validation.1A scored all blockers **BLK-VAL-001..017** as **BLOCKS PRODUCT CODE AUTHORIZATION**. Validation.1B applies an **evidence-based local-first policy**:

| Deployment tier | Meaning |
|-----------------|---------|
| **Local implementation entry** | Governed scaffold work with local PostgreSQL, local secrets path, and mocked provider adapters — **may proceed** if IMP-ENTRY criteria pass |
| **Preview deployment** | Cloud Preview runtime — **BLOCKED** until Preview DB, secrets, isolation, and cloud KMS paths are proven |
| **Public or paid feature activation** | Real IdP, email, evidence upload/scan, payment, Live Sky, managed search, notifications — **BLOCKED** until provider sandboxes PASS |
| **Controlled launch** | Prod APM, Skyboard load, pen-test, DR, legal, user validation — **BLOCKED** until respective programmes complete |

This reclassification **does not** grant Product Code. It defines the **minimum evidence** required before recommending **GHV.IMPLEMENTATION.0A** (local entry authorization) versus **GHV.VALIDATION.1C** (continued validation-only).

## Safety rules

1. **Do not fabricate evidence.** Local migration/rollback rehearsal results must be filed as executable evidence before BLK-VAL-015/016 may move to **SATISFIED**. Until then they remain **PENDING LOCAL REHEARSAL RESULT**.
2. **Do not mutate the Architecture Design Baseline** without a governed change class under [ARCHITECTURE-CHANGE-FREEZE-POLICY.md](../../architecture/ghuravia/governance/ARCHITECTURE-CHANGE-FREEZE-POLICY.md).
3. **Do not authorize Product Code from this Gate.** Validation.1B may recommend **GHV.IMPLEMENTATION.0A** for local entry only; Product Code Authorization remains a separate governed gate.
4. **Do not run validation against Production** for exploratory purposes. Production **EXISTS** but **VALIDATION PROHIBITED** unless explicitly authorized.
5. **Mock adapters ≠ provider selection closed.** Provider deferrals from Architecture 1E remain deferrals until external sandbox evidence is filed under Validation.1A artefacts or successor gates.
6. **Validation.1A verdict preserved.** GHV.VALIDATION.1A **PARTIAL** and its honest NOT AVAILABLE dispositions remain authoritative for external/provider domains.

## Authoritative inputs

| Document | Role |
|----------|------|
| [GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md](../../architecture/ghuravia/governance/GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md) | Locked baseline identity |
| [FINAL-ARCHITECTURE-CONDITION-REGISTER.md](../../architecture/ghuravia/governance/FINAL-ARCHITECTURE-CONDITION-REGISTER.md) | Conditions COND-001…032 |
| [IMPLEMENTATION-AUTHORIZATION-BOUNDARY.md](../../architecture/ghuravia/governance/IMPLEMENTATION-AUTHORIZATION-BOUNDARY.md) | Product Code boundary |
| [GHV.VALIDATION.1A.md](../../../governance/gates/GHV.VALIDATION.1A.md) | Prior validation gate verdict |
| [IMPLEMENTATION-BLOCKER-REGISTER.md](../external-1a/governance/IMPLEMENTATION-BLOCKER-REGISTER.md) | Source blocker definitions @ 1A |

## Structure map

```text
validation/ghuravia/external-1b/
├── README.md                                    ← This file
├── VALIDATION-EVIDENCE-INDEX.md                 ← Master index @ Validation.1B
├── BASELINE-ENTRY-VERIFICATION.md               ← Entry gate: baseline availability for implementation-entry validation
├── BLOCKER-RECLASSIFICATION.md                  ← BLK-VAL-001..021 local-first reclassification
├── IMPLEMENTATION-ENTRY-MINIMUM-CRITERIA.md     ← IMP-ENTRY-001..020
└── IMPLEMENTATION-AUTHORIZATION-RECOMMENDATION.md ← Draft recommendation: IMPLEMENTATION.0A vs VALIDATION.1C
```

Upstream domain reports from `validation/ghuravia/external-1a/` remain the authoritative external/provider evidence base. Validation.1B adds **local-entry layer** artefacts only.

## Programme state at workspace open

| Dimension | State |
|-----------|-------|
| Architecture Design Baseline | **LOCKED v1.0.0** |
| GHV.VALIDATION.1A | **PARTIAL** — external domains mostly NOT AVAILABLE |
| Local implementation entry validation | **IN PROGRESS** — IMP-ENTRY criteria scored; executable evidence pending |
| Preview environment | **NOT ESTABLISHED** — Preview deployment **BLOCKED** |
| Provider sandboxes | **NOT AVAILABLE** — providers **MOCKED** for local entry |
| Product Code | **BLOCKED** |
| Implementation Authorization | **NOT GRANTED BY VALIDATION.1B** |

## Final evidence status

| Validation harness | Result |
|---|---|
| Local runtime/package manager | **PASS WITH CONDITIONS** |
| Isolated workspace/typecheck/node:test | **PASS** |
| Local PostgreSQL contract | **PASS** |
| Local migration + rollback/reset | **PASS** |
| Synthetic secrets injection/redaction | **PASS** |
| Provider mock contract | **PASS WITH CONDITIONS** |
| Deployment guard | **PASS** |

The resulting recommendation is **GHV.IMPLEMENTATION.0A for local entry only**. Product Code authorization is **not granted by Validation.1B**; Preview is **not ready** and controlled launch is **not ready**.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | GHV.VALIDATION.1B — local-first implementation-entry validation workspace scaffold |
