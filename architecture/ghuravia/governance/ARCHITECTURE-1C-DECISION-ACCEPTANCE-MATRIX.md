# Architecture 1C Decision Acceptance Matrix

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-GOV-ACC-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

```text
Product Code: BLOCKED
Conflicting ADRs: 0
RETURN TO SPIKE (1C-owned): 0
```

## Acceptance matrix

| Decision | ADR | Status | Spike | Conditions |
|----------|-----|--------|-------|------------|
| IdP boundary | ADR-013 | DEFERRED WITH ADAPTER LOCKED | 003 | Sandbox required |
| Authentication/sessions | ADR-014 | ACCEPTED WITH CONDITIONS | 003 | Timeouts pending UX |
| Authorization model | ADR-015 | ACCEPTED | — | — |
| Contact verification | ADR-016 | DEFERRED WITH ADAPTER LOCKED | 003 | Email vendor TBD |
| Data retention | ADR-017 | ACCEPTED WITH LEGAL CONDITIONS | — | Legal review |
| Encryption boundaries | ADR-018 | ACCEPTED WITH CONDITIONS | — | KMS TBD |
| Evidence upload pattern | ADR-019 | ACCEPTED | 007 | — |
| Evidence object storage | ADR-020 | DEFERRED WITH ADAPTER LOCKED | 007 | Provider TBD |
| Evidence scanning | ADR-021 | PIPELINE ACCEPTED; PROVIDER DEFERRED | 008 | Fail-closed locked |
| Audit/sensitive corrections | ADR-022 | ACCEPTED | 019 | — |
| Minor identity privacy | ADR-023 | ACCEPTED WITH LEGAL CONDITIONS | 025 | Legal review |

## Domain architecture bundles

| Bundle | Status |
|--------|--------|
| Identity domain | ACCEPTED |
| Security controls + threat models | ACCEPTED |
| Data/privacy classification | ACCEPTED WITH LEGAL CONDITIONS |
| Evidence domain | ACCEPTED (providers deferred) |

## Gate verdict inputs

| Check | Result |
|-------|--------|
| 1C spikes executed | 6/6 |
| Screen baseline preflight | PASS |
| Locked separations documented | Yes |
| Threat models for 1C scope | 7/7 |
| Product Code introduced | No |

## Non-claims

Acceptance does not authorize production deployment or compliance certification.
