# Security-Sensitive Provider Adapters

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-INT-SEC-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

## Adapter inventory

| Port | Implementations (future) | Secret class | Fail mode |
|------|-------------------------|--------------|-----------|
| `IdentityProviderPort` | Clerk, Auth0, Keycloak, native | HIGH | Deny login |
| `ContactVerificationPort` | Resend, SES, Twilio | HIGH | Deny send; no bypass verify |
| `ObjectStoragePort` | S3, R2, MinIO | HIGH | Deny upload finalize |
| `ScannerPort` | ClamAV, SaaS AV | MEDIUM | **Fail-closed** — deny release |
| `AuditSinkPort` | DB, SIEM | MEDIUM | Block privileged action if sink down |

## Adapter rules

1. Credentials injected at runtime only (SECRETS-MANAGEMENT-ARCHITECTURE.md).
2. No adapter reference from domain logic — ports only.
3. Contract tests per adapter in sandbox before production acceptance.
4. Adapters must not return storage credentials to callers.
5. All outbound calls carry correlation id for audit.

## Mock/sandbox

1C spikes use in-process mocks — not production adapters.

## Non-claims

Individual adapter implementations not built — Product Code BLOCKED.
