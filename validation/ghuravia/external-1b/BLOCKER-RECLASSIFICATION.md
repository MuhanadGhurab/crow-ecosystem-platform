# Blocker Reclassification — Local-First Policy

| Field | Value |
|-------|-------|
| **Document ID** | GHV-VAL-1B-BLK-RECLASS-001 |
| **Gate ID** | GHV.VALIDATION.1B |
| **Version** | 1.0.0 |
| **Date** | 2026-07-21 |
| **Owner** | Founder (RAVEN) |
| **Branch HEAD** | `4544463efdce67f03f15e8e4939d71b3af2776f6` |
| **Source register** | [IMPLEMENTATION-BLOCKER-REGISTER.md](../external-1a/governance/IMPLEMENTATION-BLOCKER-REGISTER.md) @ GHV.VALIDATION.1A |
| **Policy** | Evidence-based **local-first** reclassification |

## Purpose

Validation.1A classified **BLK-VAL-001..017** uniformly as **BLOCKS PRODUCT CODE AUTHORIZATION**. Validation.1B reclassifies blockers by **what they actually block** under a local-first implementation-entry policy:

- **Local implementation entry** may use local PostgreSQL, local secrets, and mocked provider adapters.
- **Preview deployment**, **public or paid feature activation**, and **controlled launch** retain stricter gates.

```text
Product Code: BLOCKED (NOT GRANTED BY VALIDATION.1B)
Implementation Authorization: NOT GRANTED BY VALIDATION.1B
Reclassification ≠ waiver of external validation requirements
NOT AVAILABLE ≠ FAIL
```

## Classification key (Validation.1B)

| Class | Meaning |
|-------|---------|
| **BLOCKS PREVIEW DEPLOYMENT** | Cloud Preview runtime, Preview DB, Preview secrets, Preview/prod isolation, cloud KMS for Preview |
| **BLOCKS PUBLIC OR PAID FEATURE ACTIVATION** | Real IdP login, email deliverability, evidence upload/scan, payment, Live Sky, managed search at scale, notification deliverability |
| **BLOCKS CONTROLLED LAUNCH** | Prod APM, Skyboard load, pen-test, DR drill, legal/privacy approval, user a11y/Arabic UX validation |
| **PENDING LOCAL REHEARSAL RESULT** | Closure depends on local migration/rollback rehearsal PASS — expected **SATISFIED BY VALIDATION.1B** if rehearsal PASS |
| **SATISFIED** | Blocker closed with filed evidence |
| **NON-BLOCKING** | Tracked; does not block local implementation entry |

Secondary classifications are noted where a blocker also affects a downstream tier (e.g., real IdP also blocks Preview).

## Imported blockers @ Validation.1A (source)

| ID | Blocker (from 1A) | Severity @ 1A | Class @ 1A | Condition / tracking | Status @ 1A |
|----|-------------------|---------------|------------|----------------------|-------------|
| BLK-VAL-001 | Preview database absent (`DATABASE_URL` / `DIRECT_URL`) | **CRITICAL** | **BLOCKS PRODUCT CODE** · **BLOCKS PREVIEW** | TECH-018 · COND-022 · COND-032 | **OPEN** |
| BLK-VAL-002 | Governed Preview secrets injection path undefined | **HIGH** | **BLOCKS PRODUCT CODE** · **BLOCKS PREVIEW** | TECH-018 | **OPEN** |
| BLK-VAL-003 | Preview/Production external infra isolation unproven | **HIGH** | **BLOCKS PRODUCT CODE** · **BLOCKS PREVIEW** | COND-022 · ADR-036 | **OPEN** |
| BLK-VAL-004 | IdP provider sandbox NOT AVAILABLE | **HIGH** | **BLOCKS PRODUCT CODE** | COND-009 | **OPEN** |
| BLK-VAL-005 | Email / contact deliverability sandbox NOT AVAILABLE | **HIGH** | **BLOCKS PRODUCT CODE** | COND-010 | **OPEN** |
| BLK-VAL-006 | Object storage isolation proof NOT AVAILABLE | **HIGH** | **BLOCKS PRODUCT CODE** | COND-011 | **OPEN** |
| BLK-VAL-007 | Scanner vendor benchmark NOT AVAILABLE | **HIGH** | **BLOCKS PRODUCT CODE** | COND-012 | **OPEN** |
| BLK-VAL-008 | Payment processor sandbox NOT AVAILABLE | **HIGH** | **BLOCKS PRODUCT CODE** | ADR-029 | **OPEN** |
| BLK-VAL-009 | Realtime provider sandbox NOT AVAILABLE | **MEDIUM** | **BLOCKS PRODUCT CODE** | COND-016 | **OPEN** |
| BLK-VAL-010 | KMS / encryption provider NOT AVAILABLE | **HIGH** | **BLOCKS PRODUCT CODE** | COND-015 | **OPEN** |
| BLK-VAL-011 | Search at scale NOT AVAILABLE | **MEDIUM** | **BLOCKS PRODUCT CODE** | COND-017 | **OPEN** |
| BLK-VAL-012 | Notification deliverability sandbox NOT AVAILABLE | **MEDIUM** | **BLOCKS PRODUCT CODE** | COND-018 | **OPEN** |
| BLK-VAL-013 | Observability provider + cost validation NOT AVAILABLE | **MEDIUM** | **BLOCKS PRODUCT CODE** | COND-019 | **OPEN** |
| BLK-VAL-014 | Skyboard load budget NOT AVAILABLE | **MEDIUM** | **BLOCKS PRODUCT CODE** | COND-021 | **OPEN** |
| BLK-VAL-015 | Migration rehearsal NOT AVAILABLE | **HIGH** | **BLOCKS PRODUCT CODE** | COND-026 | **OPEN** |
| BLK-VAL-016 | Rollback rehearsal NOT AVAILABLE | **HIGH** | **BLOCKS PRODUCT CODE** | COND-026 | **OPEN** |
| BLK-VAL-017 | Penetration test NOT RUN | **HIGH** | **BLOCKS PRODUCT CODE** | COND-028 | **OPEN** |

## Reclassified blockers @ Validation.1B

| ID | Blocker | Primary class @ 1B | Secondary class | Local-entry mitigation | Status @ 1B |
|----|---------|-------------------|-----------------|------------------------|-------------|
| BLK-VAL-001 | Preview database absent | **BLOCKS PREVIEW DEPLOYMENT** | — | Local PostgreSQL alternative exists for local DB work | **OPEN** |
| BLK-VAL-002 | Governed Preview secrets injection path undefined | **BLOCKS PREVIEW DEPLOYMENT** | — | Local secrets path separate from Preview; no committed credentials | **OPEN** |
| BLK-VAL-003 | Preview/Production external infra isolation unproven | **BLOCKS PREVIEW DEPLOYMENT** | — | Local dev does not claim Preview/prod isolation | **OPEN** |
| BLK-VAL-004 | IdP provider sandbox NOT AVAILABLE | **BLOCKS PUBLIC OR PAID FEATURE ACTIVATION** | **BLOCKS PREVIEW DEPLOYMENT** (real IdP) | Mock auth adapter sufficient for local auth adapter work | **OPEN** |
| BLK-VAL-005 | Email / contact deliverability sandbox NOT AVAILABLE | **BLOCKS PUBLIC OR PAID FEATURE ACTIVATION** | **BLOCKS PREVIEW DEPLOYMENT** (real deliverability) | Mock contact path for local adapter work | **OPEN** |
| BLK-VAL-006 | Object storage isolation proof NOT AVAILABLE | **BLOCKS PUBLIC OR PAID FEATURE ACTIVATION** | — | Mock storage for local; real Evidence uploads blocked | **OPEN** |
| BLK-VAL-007 | Scanner vendor benchmark NOT AVAILABLE | **BLOCKS PUBLIC OR PAID FEATURE ACTIVATION** | — | Mock fail-closed scanner for local; real Evidence scan blocked | **OPEN** |
| BLK-VAL-008 | Payment processor sandbox NOT AVAILABLE | **BLOCKS PUBLIC OR PAID FEATURE ACTIVATION** | — | Mock payment adapter for local | **OPEN** |
| BLK-VAL-009 | Realtime provider sandbox NOT AVAILABLE | **BLOCKS PUBLIC OR PAID FEATURE ACTIVATION** | — | Mock transport for local; Live Sky activation blocked | **OPEN** |
| BLK-VAL-010 | KMS / encryption provider NOT AVAILABLE | **BLOCKS PREVIEW DEPLOYMENT** | **BLOCKS CONTROLLED LAUNCH** (cloud KMS at launch) | Local crypto/secrets for local entry; cloud KMS for Preview/launch | **OPEN** |
| BLK-VAL-011 | Search at scale NOT AVAILABLE | **BLOCKS PUBLIC OR PAID FEATURE ACTIVATION** | — | Relational FTS mock/local OK for local entry | **OPEN** |
| BLK-VAL-012 | Notification deliverability sandbox NOT AVAILABLE | **BLOCKS PUBLIC OR PAID FEATURE ACTIVATION** | — | Mock notification adapter for local | **OPEN** |
| BLK-VAL-013 | Observability provider + cost validation NOT AVAILABLE | **BLOCKS CONTROLLED LAUNCH** | — | Local observability mock OK for local entry | **OPEN** |
| BLK-VAL-014 | Skyboard load budget NOT AVAILABLE | **BLOCKS CONTROLLED LAUNCH** | — | No local substitute for load budget proof | **OPEN** |
| BLK-VAL-015 | Migration rehearsal | **SATISFIED** | — | Local rehearsal PASS: [migration-rollback/RESULT.md](./migration-rollback/RESULT.md) | **SATISFIED BY VALIDATION.1B** |
| BLK-VAL-016 | Rollback rehearsal | **SATISFIED** | — | Local rollback PASS: [migration-rollback/RESULT.md](./migration-rollback/RESULT.md) | **SATISFIED BY VALIDATION.1B** |
| BLK-VAL-017 | Penetration test NOT RUN | **BLOCKS CONTROLLED LAUNCH** | — | Pre-production security programme | **OPEN** |

## Launch blockers unchanged (imported @ 1A)

| ID | Blocker | Class @ 1B | Condition / tracking | Status @ 1B |
|----|---------|------------|----------------------|-------------|
| BLK-VAL-018 | DR restore drill NOT RUN | **BLOCKS CONTROLLED LAUNCH** | COND-020 | **OPEN** |
| BLK-VAL-019 | Legal / privacy NOT APPROVED | **BLOCKS CONTROLLED LAUNCH** | COND-013/014/023/029 | **OPEN** |
| BLK-VAL-020 | Accessibility user validation NOT RUN | **BLOCKS CONTROLLED LAUNCH** | COND-008 | **OPEN** |
| BLK-VAL-021 | Arabic UX user validation NOT RUN | **BLOCKS CONTROLLED LAUNCH** | COND-007 | **OPEN** |

## Summary by Gate class @ Validation.1B

| Gate class | Count | IDs |
|---------------|------:|-----|
| **Blocks Product Code Authorization** | **0** | — |
| **Blocks Preview** | **4** | BLK-VAL-001, 002, 003, 010 |
| **Blocks Controlled Launch** | **7** | BLK-VAL-013, 014, 017, 018, 019, 020, 021 |
| **Blocks Feature Activation** | **8** | BLK-VAL-004, 005, 006, 007, 008, 009, 011, 012 |
| **Non-Blocking Implementation Conditions / Satisfied** | **2** | BLK-VAL-015, 016 satisfied |
| **Unclassified** | **0** | — |

**Total blockers tracked:** **21** (BLK-VAL-001..021)

**Local Product Code blocker count:** **0**. Remaining open blockers are lifecycle-gated for Preview, public/paid activation, or controlled launch; they are not waived.

## Secondary class overlay (non-exclusive)

| Secondary class | Additional IDs |
|-----------------|----------------|
| **BLOCKS PREVIEW DEPLOYMENT** (secondary) | BLK-VAL-004 (real IdP), BLK-VAL-005 (real deliverability) |
| **BLOCKS CONTROLLED LAUNCH** (secondary) | BLK-VAL-010 (cloud KMS at launch) |

## Comparison to Validation.1A summary

| Class @ 1A | Count @ 1A | Class @ 1B | Count @ 1B |
|------------|----------:|------------|----------:|
| BLOCKS PRODUCT CODE AUTHORIZATION | **17** | *(retired as uniform class)* | — |
| BLOCKS PREVIEW | **3** | BLOCKS PREVIEW DEPLOYMENT (primary) | **4** |
| BLOCKS LAUNCH | **4** | BLOCKS CONTROLLED LAUNCH | **7** |
| — | — | BLOCKS PUBLIC OR PAID FEATURE ACTIVATION | **8** |
| — | — | SATISFIED BY VALIDATION.1B | **2** |

## BLK-VAL-015 / BLK-VAL-016 closure path

```text
Current status: SATISFIED BY VALIDATION.1B
Local migration rehearsal PASS  → BLK-VAL-015 → SATISFIED
Local rollback rehearsal PASS   → BLK-VAL-016 → SATISFIED
Evidence: migration-rollback/RESULT.md
```

Executable rehearsal evidence must be attached to IMP-ENTRY-013 and IMP-ENTRY-014 before status may move from **PENDING**.

## Controlled launch minimum (unchanged requirement)

Identity + storage + scanning + payment real provider proof still required for controlled launch:

| Capability | Blocker | @ 1B |
|------------|---------|------|
| Identity (real IdP) | BLK-VAL-004 | **OPEN** · **BLOCKS PUBLIC OR PAID FEATURE ACTIVATION** |
| Storage (real isolation) | BLK-VAL-006 | **OPEN** |
| Scanning (real benchmark) | BLK-VAL-007 | **OPEN** |
| Payment (real sandbox) | BLK-VAL-008 | **OPEN** |

**Controlled launch path: NOT READY.**

## Explicit non-claims

```text
Reclassification ≠ Product Code authorized
Reclassification ≠ Preview deployment authorized
Reclassification ≠ provider sandboxes available
Mock adapter work permitted ≠ public feature activation permitted
PENDING LOCAL REHEARSAL ≠ SATISFIED until executable evidence filed
```

## Related

- [IMPLEMENTATION-ENTRY-MINIMUM-CRITERIA.md](./IMPLEMENTATION-ENTRY-MINIMUM-CRITERIA.md)
- [IMPLEMENTATION-AUTHORIZATION-RECOMMENDATION.md](./IMPLEMENTATION-AUTHORIZATION-RECOMMENDATION.md)
- [IMPLEMENTATION-BLOCKER-REGISTER.md](../external-1a/governance/IMPLEMENTATION-BLOCKER-REGISTER.md)

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.VALIDATION.1B — BLK-VAL-001..021 local-first reclassification · Unclassified: 0 |
