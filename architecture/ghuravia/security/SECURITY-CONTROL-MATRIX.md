# Security Control Matrix

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-SEC-MAT-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

```text
Architectural controls — not compliance certification
Product Code: BLOCKED
```

## Control matrix

| ID | Domain | Control | Implementation status | Evidence |
|----|--------|---------|----------------------|----------|
| SC-01 | Identity | Server-authoritative activation | ACCEPTED | SPK-ARC-003 |
| SC-02 | Identity | Deny by default authz | ACCEPTED | ADR-ARC-015 |
| SC-03 | Session | Rotation + revocation | ACCEPTED WITH CONDITIONS | ADR-ARC-014 |
| SC-04 | Evidence | Quarantine before review | ACCEPTED | SPK-ARC-007 |
| SC-05 | Evidence | Scanning fail-closed | ACCEPTED | SPK-ARC-008 |
| SC-06 | Evidence | Raw object ↛ progression ledger | ACCEPTED | SPK-ARC-009 |
| SC-07 | Trust | Non-public, non-numeric | ACCEPTED | SPK-ARC-013 |
| SC-08 | Admin | Privileged correction audit | ACCEPTED | SPK-ARC-019 |
| SC-09 | Admin | Break-glass dual control | ACCEPTED | SPK-ARC-019 |
| SC-10 | Privacy | Minor public profile sanitization | ACCEPTED WITH LEGAL CONDITIONS | SPK-ARC-025 |
| SC-11 | Crypto | Encryption boundaries defined | ACCEPTED WITH CONDITIONS | ADR-ARC-018 |
| SC-12 | Secrets | No secrets in repo | ACCEPTED | Governance |
| SC-13 | Recovery | Rate-limited recovery | ARCHITECTURE ONLY | ACT-012 |
| SC-14 | Scanning | No release on scanner outage | ACCEPTED | SPK-ARC-008 |
| SC-15 | Audit | No evidence bodies in audit | ACCEPTED | SPK-ARC-019 |

## Residual gaps

| Gap | Owner gate |
|-----|------------|
| Production IdP | Provider validation |
| Email/SMS provider | Adapter sandbox |
| Object storage provider | ADR-ARC-020 |
| Scanner vendor | ADR-ARC-021 |
| Penetration test | SECURITY-TESTING-PLAN |
| Legal retention | Legal review |

## Non-claims

```text
Matrix does not assert ISO/SOC/PCI compliance
Controls marked ARCHITECTURE ONLY lack spike evidence
```
