# Identity, Security, Data, and Evidence Baseline

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-GOV-BASE-001 |
| **Version** | **1.0.0** |
| **Status** | **ACTIVE — DOMAIN ARCHITECTURE ACCEPTED; PROVIDER AND EXTERNAL VALIDATION CONDITIONS REMAIN; PRODUCT CODE BLOCKED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

```text
v1.0.0 ACTIVE
DOMAIN ARCHITECTURE ACCEPTED
PROVIDER AND EXTERNAL VALIDATION CONDITIONS REMAIN
PRODUCT CODE BLOCKED
NO compliance claims
```

## 1. Baseline scope

This baseline captures accepted domain architecture for Identity, Security, Data/Privacy, and Evidence from Gate GHV.ARCHITECTURE.1C.

## 2. Locked separations (mandatory)

```text
Auth ≠ Activation ≠ Authorization ≠ Entitlement ≠ Learning Eligibility ≠ Trust Eligibility
Crow Identity ≠ Private Legal Identity
Raw Evidence Object ↛ Progression Ledger
Trust non-public, non-numeric
Scanning fail-closed
Deny by default
```

## 3. Accepted domain patterns

| Domain | Pattern | Evidence |
|--------|---------|----------|
| Activation | Server formula: email + terms + risk | SPK-ARC-003 |
| Sessions | App-owned + IdP adapter | ADR-014 |
| AuthZ | Hybrid RBAC + context | ADR-015 |
| Evidence upload | Quarantine + short-lived token | SPK-ARC-007 |
| Scanning | Fail-closed pipeline | SPK-ARC-008 |
| Progression link | Opaque ref events only | SPK-ARC-009 |
| Trust | Categorical, restricted | SPK-ARC-013 |
| Audit | Append-only privileged corrections | SPK-ARC-019 |
| Minor public profile | Sanitized projection | SPK-ARC-025 |

## 4. Remaining conditions

| Condition | Owner |
|-----------|-------|
| IdP provider sandbox | Founder |
| Email provider deliverability | Founder |
| Object storage provider | Deployment gate |
| Scanner vendor | Security gate |
| Retention legal review | Legal |
| Saudi/Nafath access | **OFFICIAL ACCESS NOT VERIFIED** |
| Session timeout usability | UX validation |
| Penetration testing | Pre-production |

## 5. Explicit blocks

- **Product Code: BLOCKED** until downstream gate authorizes.
- No compliance or certification claims from this baseline.
- Learning/Progression baselines from 1B unchanged.

## 6. Spike summary

```text
1C-owned spikes executed: 6
1C-owned spikes skipped: 0
All verdicts: PASS or PASS WITH CONDITIONS
```

## 7. Document index

See IDENTITY-EVIDENCE-PROVIDER-DECISION-MATRIX.md and ARCHITECTURE-1C-DECISION-ACCEPTANCE-MATRIX.md.

## 8. Revision history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | 1C baseline active — domain accepted, providers deferred |
