# Evidence Revocation — Technical Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-EV-REV-001 |
| **Version** | 1.0.0 |
| **Status** | **ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **Evidence** | SPK-ARC-009 |

## Flow

```text
revokeEvidence → append EVIDENCE_REVOKED event → targeted recalc affected capabilities/routes → audit
```

## Rules

| Rule | Detail |
|------|--------|
| Historical preservation | Prior approval event retained |
| Recalculation scope | **Targeted** — affected capability/route only |
| Ledger content | No object body; refs only |
| Restore path | `restoreEvidence` re-approves with audit |
| Public artifacts | Remove sanitized public copies on revoke |

## Separation

Revocation affects **progression eligibility** derived from that Evidence id; does not delete object immediately (retention policy applies separately).

## Authorization

Revocation requires reviewer/admin role; self-revoke not allowed for approved peer evidence.

## Non-claims

Legal defensibility of revocation notices — **LEGAL VALIDATION REQUIRED**.
