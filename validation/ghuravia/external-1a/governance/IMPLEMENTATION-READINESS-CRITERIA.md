# Implementation Readiness Criteria

| Field | Value |
|-------|-------|
| **Document ID** | GHV-VAL-1A-IRC-001 |
| **Gate ID** | GHV.VALIDATION.1A |
| **Version** | 1.0.0 |
| **Date** | 2026-07-21 |
| **Owner** | Founder (RAVEN) |
| **Branch HEAD** | `6845688c0fd97680075f1d83ae1cd87b5a2d1352` |
| **Overall readiness** | **NOT READY** |
| **Related** | [IMPLEMENTATION-READINESS-ASSESSMENT.md](./IMPLEMENTATION-READINESS-ASSESSMENT.md) · [IMPLEMENTATION-BLOCKER-REGISTER.md](./IMPLEMENTATION-BLOCKER-REGISTER.md) |

## Scoring key

| Score | Meaning @ Validation.1A |
|-------|-------------------------|
| **PASS** | External or operational proof filed and accepted |
| **PARTIAL** | Documentation verified only; live proof incomplete |
| **FAIL** | Mandatory proof absent and blocking |
| **NOT RUN** | Programme not executed |
| **NOT AVAILABLE** | Required environment, credentials, or sandbox absent |

```text
Product Code Authorization: NOT GRANTED BY THIS GATE
Implementation Authorization: NOT GRANTED
Architecture Design Baseline: LOCKED — criteria below are external/operational readiness only
```

## Criteria register (20)

| ID | Criterion | Primary blockers | Score @ 1A | Notes |
|----|-----------|------------------|:----------:|-------|
| IRC-001 | Preview environment established with governed runtime | TECH-018 · COND-022 | **FAIL** | Preview **NOT ESTABLISHED** |
| IRC-002 | Relational datastore host selection validated on live infra | COND-032 · TECH-018 | **FAIL** | `DATABASE_URL` / `DIRECT_URL` **ABSENT** |
| IRC-003 | Governed secrets injection path for Preview | TECH-018 · undefined secrets path | **FAIL** | No Preview secret path filed |
| IRC-004 | IdP provider sandbox PASS | COND-009 | **NOT AVAILABLE** | Credentials/sandbox absent |
| IRC-005 | Email / contact deliverability sandbox PASS | COND-010 | **NOT AVAILABLE** | Sandbox absent |
| IRC-006 | Object storage isolation proof PASS | COND-011 | **NOT AVAILABLE** | Required for evidence path |
| IRC-007 | Scanner vendor detection benchmark PASS | COND-012 | **NOT AVAILABLE** | Fail-closed pipeline unproven externally |
| IRC-008 | KMS / encryption provider selection PASS | COND-015 | **NOT AVAILABLE** | Provider not exercised |
| IRC-009 | Payment processor sandbox PASS | ADR-029 · launch-critical | **NOT AVAILABLE** | Controlled launch path blocked |
| IRC-010 | Realtime provider sandbox PASS (Live Sky) | COND-016 | **NOT AVAILABLE** | Adapter locked; sandbox absent |
| IRC-011 | Search corpus quality at scale PASS | COND-017 | **NOT AVAILABLE** | Scale proof absent |
| IRC-012 | Notification deliverability sandbox PASS | COND-018 | **NOT AVAILABLE** | Outbox pattern only at design level |
| IRC-013 | Observability provider + cost validation PASS | COND-019 | **NOT AVAILABLE** | Provider not exercised |
| IRC-014 | Skyboard performance budget under load PASS | COND-021 | **NOT AVAILABLE** | Load test not run |
| IRC-015 | Migration rehearsal on Preview PASS | COND-026 · TECH-018 | **NOT AVAILABLE** | **BLOCKING** — no Preview DB |
| IRC-016 | Rollback procedure rehearsal PASS | COND-026 · TECH-018 | **NOT AVAILABLE** | **BLOCKING** — no Preview DB |
| IRC-017 | DR restore drill with measured RPO/RTO PASS | COND-020 | **NOT RUN** | **BLOCKING** for controlled launch |
| IRC-018 | Penetration test completed with remediation plan | COND-028 | **NOT RUN** | Pre-production programme |
| IRC-019 | Legal / privacy clearance (retention, minor, PDPL) | COND-013/014/023/029 | **NOT AVAILABLE / IN REVIEW** | Counsel clearance pending |
| IRC-020 | Accessibility + Arabic UX user validation PASS | COND-007/008 | **NOT RUN** | User studies not scheduled |

## Roll-up

| Metric | Count |
|--------|------:|
| Total criteria | **20** |
| PASS | **0** |
| PARTIAL (documentation only) | **0** |
| FAIL | **3** (Preview / DB / secrets — IRC-001..003) |
| NOT AVAILABLE | **12** (IRC-004..014, IRC-015..016, IRC-019 partial) |
| NOT RUN | **5** (IRC-017, IRC-018, IRC-020; IRC-019 legal in review) |

## Dominant failure themes

```text
1. Preview DB ABSENT (TECH-018 OPEN) — blocks IRC-001..003, IRC-015..016
2. Provider sandboxes NOT AVAILABLE — blocks IRC-004..014
3. Migration / rollback / DR drills NOT AVAILABLE — blocks IRC-015..017
4. Legal / privacy NOT APPROVED — IRC-019 open
5. User validation NOT RUN — IRC-020 open
```

## Controlled launch minimum (identity + storage + scanning + payment)

| Capability | Criterion | @ 1A |
|------------|-----------|------|
| Identity | IRC-004 | **NOT AVAILABLE** |
| Storage | IRC-006 | **NOT AVAILABLE** |
| Scanning | IRC-007 | **NOT AVAILABLE** |
| Payment | IRC-009 | **NOT AVAILABLE** |

**Controlled launch path: NOT READY.**

## Explicit non-claims

```text
Architecture spike PASS ≠ IRC PASS
DOCUMENTATION VERIFIED ONLY ≠ sandbox PASS
This register does NOT grant Product Code or Implementation Authorization
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.VALIDATION.1A — 20 implementation readiness criteria scored |
