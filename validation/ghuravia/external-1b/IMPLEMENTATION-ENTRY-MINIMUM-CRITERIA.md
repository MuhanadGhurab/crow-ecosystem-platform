# Implementation Entry Minimum Criteria

| Field | Value |
|-------|-------|
| **Document ID** | GHV-VAL-1B-IMP-ENTRY-001 |
| **Gate ID** | GHV.VALIDATION.1B |
| **Version** | 1.0.0 |
| **Date** | 2026-07-21 |
| **Overall entry readiness** | **READY WITH CONDITIONS** |

## Scoring key

Only these scores are used: **PASS**, **PASS WITH CONDITIONS**, **FAIL**, and **NOT AVAILABLE**.

## Criteria register

| ID | Exact criterion | Evidence | Score | Notes |
|---|---|---|:---:|---|
| IMP-ENTRY-001 | Exact Product Code repository boundary approved | [PRODUCT-CODE-BOUNDARY-SPECIFICATION.md](./implementation-boundary/PRODUCT-CODE-BOUNDARY-SPECIFICATION.md) | **PASS** | Validation boundary is explicit. |
| IMP-ENTRY-002 | Root workspace bootstrap plan approved but not executed | [REPOSITORY-BOOTSTRAP-PLAN.md](./implementation-boundary/REPOSITORY-BOOTSTRAP-PLAN.md) | **PASS** | Plan only; Product workspace **NOT CREATED**. |
| IMP-ENTRY-003 | Supported Node and package-manager versions verified | [RUNTIME-PACKAGE-MANAGER-VALIDATION.md](./local-runtime/RUNTIME-PACKAGE-MANAGER-VALIDATION.md) | **PASS WITH CONDITIONS** | Node 24.15.0 and npm 11.12.1 verified; pnpm not installed; ADR baselines recorded. |
| IMP-ENTRY-004 | Local development topology reproducible | [RESULT.md](./local-workspace/RESULT.md) · [LOCAL-WORKSPACE-STRATEGY-VALIDATION.md](./local-workspace/LOCAL-WORKSPACE-STRATEGY-VALIDATION.md) | **PASS** | Isolated validation topology reproduced. |
| IMP-ENTRY-005 | Disposable local PostgreSQL strategy available | [RESULT.md](./local-database/RESULT.md) | **PASS** | Ephemeral Docker PostgreSQL 18.4. |
| IMP-ENTRY-006 | Validation-only migration and rollback rehearsal passes | [RESULT.md](./migration-rollback/RESULT.md) | **PASS** | Migration, rollback, and reset passed. |
| IMP-ENTRY-007 | Secure secrets-injection strategy passes | [RESULT.md](./secrets/RESULT.md) | **PASS** | Synthetic injection/redaction; no tracked secrets. |
| IMP-ENTRY-008 | Synthetic test-data policy approved | [SYNTHETIC-TEST-DATA-POLICY.md](./test-data/SYNTHETIC-TEST-DATA-POLICY.md) | **PASS** | Synthetic-only policy approved. |
| IMP-ENTRY-009 | Provider-mock contracts cover unavailable providers | [PROVIDER-MOCK-CONTRACT-VALIDATION.md](./provider-mocks/PROVIDER-MOCK-CONTRACT-VALIDATION.md) · provider mock tests | **PASS WITH CONDITIONS** | Covers local adapter work; real provider validation remains unavailable. |
| IMP-ENTRY-010 | Architecture adapters remain replaceable | [PROVIDER-MOCK-ADEQUACY-MATRIX.md](./provider-mocks/PROVIDER-MOCK-ADEQUACY-MATRIX.md) · boundary documents | **PASS WITH CONDITIONS** | Replaceability is validated at the local mock boundary only. |
| IMP-ENTRY-011 | CI and quality-gate policy defined | [CI-QUALITY-GATE-READINESS.md](./ci-quality/CI-QUALITY-GATE-READINESS.md) | **PASS WITH CONDITIONS** | Documentation-defined; no Production deployment workflow. |
| IMP-ENTRY-012 | Deployment remains impossible by default | [RESULT.md](./deployment-guard/RESULT.md) | **PASS** | Guard rejects deployment paths. |
| IMP-ENTRY-013 | Branch and commit policy defined | [IMPLEMENTATION-OPERATOR-RESPONSIBILITY-MODEL.md](./governance/IMPLEMENTATION-OPERATOR-RESPONSIBILITY-MODEL.md) · [REPOSITORY-BOOTSTRAP-PLAN.md](./implementation-boundary/REPOSITORY-BOOTSTRAP-PLAN.md) | **PASS WITH CONDITIONS** | Defined for future Product workspace execution. |
| IMP-ENTRY-014 | Initial implementation slice is bounded | [INITIAL-IMPLEMENTATION-SLICE-PLAN.md](./initial-slice/INITIAL-IMPLEMENTATION-SLICE-PLAN.md) | **PASS** | 0A scope is bounded. |
| IMP-ENTRY-015 | Implementation acceptance criteria defined | [IMPLEMENTATION-0A-ACCEPTANCE-CRITERIA.md](./initial-slice/IMPLEMENTATION-0A-ACCEPTANCE-CRITERIA.md) | **PASS** | Acceptance criteria filed. |
| IMP-ENTRY-016 | Operator and approval authority defined | [IMPLEMENTATION-OPERATOR-RESPONSIBILITY-MODEL.md](./governance/IMPLEMENTATION-OPERATOR-RESPONSIBILITY-MODEL.md) | **PASS** | Authority model filed. |
| IMP-ENTRY-017 | No unresolved material Architecture contradiction | [IMPLEMENTATION-ENTRY-ARCHITECTURE-IMPACT-REVIEW.md](./governance/IMPLEMENTATION-ENTRY-ARCHITECTURE-IMPACT-REVIEW.md) | **PASS** | **NO ARCHITECTURE CHANGE / IMPLEMENTATION CONDITION only**. |
| IMP-ENTRY-018 | No Production access required for implementation | [PREVIEW-VS-LOCAL-IMPLEMENTATION-READINESS.md](./governance/PREVIEW-VS-LOCAL-IMPLEMENTATION-READINESS.md) | **PASS** | Local entry remains separate from Preview and Production. |
| IMP-ENTRY-019 | Reset and cleanup strategy exists | [RESULT.md](./migration-rollback/RESULT.md) | **PASS** | Reset rehearsal passed. |
| IMP-ENTRY-020 | Implementation Authorization remains a separate Gate | [IMPLEMENTATION-AUTHORIZATION-RECOMMENDATION.md](./IMPLEMENTATION-AUTHORIZATION-RECOMMENDATION.md) | **PASS** | Recommendation is not authorization. |

## Roll-up

| Score | Count |
|---|---:|
| **PASS** | **14** |
| **PASS WITH CONDITIONS** | **6** |
| **FAIL** | **0** |
| **NOT AVAILABLE** | **0** |

**GHV.IMPLEMENTATION.0A recommendation requirement:** **FAIL = 0** and **NOT AVAILABLE = 0**. This register meets that requirement; the overall result is **READY WITH CONDITIONS**.

```text
Product Code Authorization: NOT GRANTED BY VALIDATION.1B
Implementation Authorization: remains a separate governed Gate
Preview and Controlled Launch: NOT AUTHORIZED
```

## Change history

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-21 | Rebased IMP-ENTRY-001..020 on the Gate brief evidence map. |
