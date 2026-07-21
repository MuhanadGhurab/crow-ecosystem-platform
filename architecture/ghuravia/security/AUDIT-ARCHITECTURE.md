# Audit Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-SEC-AUD-001 |
| **Version** | 1.0.0 |
| **Status** | **ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **ADR** | ADR-ARC-022 |
| **Evidence** | SPK-ARC-019 |

## 1. Purpose

Define append-only audit for sensitive state changes, privileged corrections, and security events.

## 2. Audit record schema (minimum)

| Field | Required |
|-------|----------|
| `actorId` | Yes |
| `reason` | Yes |
| `authority` | Yes |
| `action` | Yes |
| `recordedAt` | Yes |
| `priorStateRef` | When state change |
| `resultingStateRef` | When state change |
| `sensitivity` | For restricted events |

## 3. Prohibited in audit payloads

- Evidence object bodies
- Raw secrets or private keys
- Full email/SMS message bodies
- Trust numeric scores (prohibited by design)

SPK-ARC-019 enforces rejection of `evidenceContent` and secret patterns in audit append.

## 4. Privileged correction flow

```text
correction request → policy + dual control (if break-glass) → append audit → apply change → post-action review flag
```

Reversal creates correlating audit entry (`CORRECTION_REVERSAL`) referencing original id.

## 5. Retention

**DRAFT RETENTION CLASS / LEGAL VALIDATION REQUIRED** — see DATA-LIFECYCLE-RETENTION-ARCHITECTURE.md.

## 6. Access

- Audit read: admin + compliance roles only.
- No public or learner access to audit trail.

## 7. Non-claims

```text
Central SIEM integration not validated
Tamper-evident storage (WORM) deferred to ops gate
```
