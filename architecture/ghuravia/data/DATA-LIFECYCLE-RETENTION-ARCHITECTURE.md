# Data Lifecycle and Retention Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-DATA-RET-001 |
| **Version** | 1.0.0 |
| **Status** | **DRAFT RETENTION CLASS / LEGAL VALIDATION REQUIRED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **ADR** | ADR-ARC-017 |

```text
DRAFT RETENTION CLASS — NOT LEGAL ADVICE
Product Code: BLOCKED
```

## 1. Lifecycle stages

```text
collect → use → store → archive → delete/anonymize
```

## 2. Draft retention classes

| Category | Active retention (draft) | Deletion trigger |
|----------|-------------------------|------------------|
| Account & activation | Account life + 30d grace | Deletion request / inactivity policy |
| Session tokens | TTL only | Expiry |
| Evidence objects | Account life + 7y candidate | Revoke + policy — **LEGAL VALIDATION** |
| Progression events | Indefinite append-only | Anonymize on account delete |
| Audit | 7y candidate | Legal hold overrides |
| Trust/moderation | 3y candidate | Case closure + appeal window |
| Telemetry | 90d | Rolling delete |
| Quarantined failed uploads | 30d | Auto purge |

## 3. Deletion cascades

Account deletion triggers:

1. Revoke sessions and tokens.
2. Delete or anonymize Crow profile.
3. Delete private identity fields.
4. Evidence: legal hold check → delete objects + metadata or anonymize refs.
5. Progression: retain events with pseudonymous id or anonymize per legal advice.

## 4. Evidence revocation

See EVIDENCE-REVOCATION-TECHNICAL-ARCHITECTURE.md — revocation updates progression via events, not object deletion alone.

## 5. Conditions

All durations subject to legal review (ADR-ARC-017 ACCEPTED WITH LEGAL CONDITIONS).

## 6. Non-claims

```text
No regulatory retention compliance claimed
Exact periods not production-locked
```
