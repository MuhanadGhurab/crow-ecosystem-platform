# Evidence Access Control Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-EV-ACC-001 |
| **Version** | 1.0.0 |
| **Status** | **ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **Evidence** | SPK-ARC-007 |

## Access matrix

| Actor | Quarantine | Post-scan pre-release | Released for review |
|-------|------------|----------------------|---------------------|
| Owner | Upload only | Metadata read | Read via presign if owner |
| Reviewer | Deny | Deny | Read via presign + `reviewAccess` |
| Admin (app) | Policy | Policy | Audit logged |
| Public | Deny | Deny | Deny |

## Presigned read pattern

- TTL **60 seconds** default (spike candidate).
- Re-check AuthZ at sign time.
- Reviewer denied if `reviewAccess === false`.

## Deny by default

Any undefined role or missing scan pass → deny.

## Non-claims

Object-level ACL sync with storage provider deferred to adapter implementation.
