# Encryption and Key Management Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-SEC-ENC-001 |
| **Version** | 1.0.0 |
| **Status** | **ACCEPTED WITH CONDITIONS** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **ADR** | ADR-ARC-018 |

## 1. Purpose

Define encryption boundaries for data at rest, in transit, and application-level field encryption.

## 2. Boundaries

| Layer | Requirement |
|-------|-------------|
| In transit | TLS 1.2+ for all external and inter-service (future) |
| At rest — DB | Provider-managed encryption (when provider selected) |
| At rest — object store | Server-side encryption on Evidence buckets |
| Application | Field-level encryption for highly restricted identity fields |

## 3. Key hierarchy (conceptual)

```text
Root/KMS ──► Data encryption keys (DEK) ──► per-tenant or per-field envelopes
```

| Key type | Rotation | Access |
|----------|----------|--------|
| TLS certs | Automated | Platform |
| DB TDE keys | Provider policy | Ops only |
| DEK / field keys | **90 days** candidate | App service identity only |
| Signing keys (audit) | **Annual** candidate | Restricted service |

```text
CANDIDATE SECURITY VALUE PENDING USABILITY — rotation cadence subject to ops validation
```

## 4. Evidence isolation

- Object store credentials not exposed to admin list APIs (SPK-ARC-007).
- Presigned URLs short-lived; no long-lived public Evidence URLs.

## 5. Conditions

- KMS provider selection deferred with cloud deployment gate.
- Key custody and regional residency: **LEGAL VALIDATION REQUIRED**.

## 6. Non-claims

```text
No specific cloud KMS chosen
No FIPS/compliance certification claimed
```
