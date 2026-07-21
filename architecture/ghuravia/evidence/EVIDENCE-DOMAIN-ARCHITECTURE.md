# Evidence Domain Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-EV-DOM-001 |
| **Version** | 1.0.0 |
| **Status** | **DOMAIN ARCHITECTURE ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

```text
Raw Evidence Object ↛ Progression Ledger
Product Code: BLOCKED
```

## 1. Domain boundaries

| Component | Role |
|-----------|------|
| Upload service | Resumable ingest, quarantine |
| Scanning pipeline | Malware + secret detection, fail-closed |
| Metadata store | Ownership, status, scan results |
| Object store | Binary via S3-compatible adapter (deferred provider) |
| Review service | Access after scan pass |
| Approval bridge | Emits progression events (opaque ref) |
| Revocation service | Reverses approval impact |

## 2. State machine

```text
UPLOAD_PENDING → UPLOADED/QUARANTINED → SCAN_PENDING → SCAN_PASSED|FAILED
  → (if passed) RELEASED_FOR_REVIEW → APPROVED|REJECTED → (optional) REVOKED
```

## 3. Locked separations

- Evidence ≠ Progression storage.
- Approval writes **event + objectRef** only (SPK-ARC-009).
- Public surfaces receive **sanitized derivatives** only.

## 4. Related ADRs

ADR-ARC-019 (upload), ADR-ARC-020 (storage), ADR-ARC-021 (scanning).

## 5. Non-claims

Production storage and scanner vendors not selected.
