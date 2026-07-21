# Secrets Management Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-SEC-SEC-001 |
| **Version** | 1.0.0 |
| **Status** | **ACCEPTED WITH CONDITIONS** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

## 1. Purpose

Define how secrets (API keys, adapter credentials, signing keys) are stored, rotated, and accessed.

## 2. Principles

| Principle | Implementation |
|-----------|----------------|
| No secrets in repo | `.env` local only; never committed |
| Least privilege | Per-adapter scoped credentials |
| Rotation | Documented cadence per secret class |
| Audit | Secret access via platform logs; no secret values in audit |

## 3. Secret classes

| Class | Examples | Storage (target) |
|-------|----------|------------------|
| Platform | DB URL, session signing key | Secret manager / env inject |
| Integration | Email, storage, scanner API keys | Secret manager |
| Ephemeral | Upload tokens, presign secrets | Memory + short TTL |

## 4. Adapter pattern

Security-sensitive adapters (see SECURITY-SENSITIVE-PROVIDER-ADAPTERS.md) receive credentials via injection at runtime, not from application admin APIs.

## 5. Developer access

- Founders/operators use separate credentials from production.
- No shared production passwords in documentation or spikes.

## 6. Conditions

- Secret manager product deferred to deployment gate.
- Rotation automation not validated in 1C spikes.

## 7. Non-claims

```text
No HashiCorp/Vault/cloud secret manager selected
No SOC2 control attestation
```
