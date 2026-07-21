# Identity, Evidence, and Provider Decision Matrix

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-GOV-IDM-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

## Decision matrix

| Area | Architecture pattern | Provider | Spike | ADR | Gate to lock provider |
|------|---------------------|----------|-------|-----|----------------------|
| Identity sessions | App-owned + IdP adapter | **DEFERRED** | 003 (1B) | ADR-013 | Pre-prod + sandbox |
| Email verify | Adapter port | **DEFERRED** | 003 (1B) | ADR-016 | Deliverability test |
| Mobile verify | Adapter port | **DEFERRED** | — | ADR-016 | Future gate |
| Evidence upload | Direct quarantine upload | Pattern locked | 007 | ADR-019 | — |
| Object storage | S3-compatible adapter | **DEFERRED** | 007 | ADR-020 | Deployment gate |
| Scanning | Fail-closed pipeline | **DEFERRED** | 008 | ADR-021 | Security gate |
| Progression link | Event + objectRef | Locked | 009 | — | — |
| Trust privacy | Non-public categorical | Locked | 013 | — | — |
| Audit/privileged | Append-only + dual control | Locked | 019 | ADR-022 | — |
| Minor profile | Sanitized projection | Locked | 025 | ADR-023 | Legal review |
| Saudi identity | Port only | **NOT VERIFIED** | — | — | Official access |

## Acceptance summary

| Category | Count |
|----------|-------|
| Pattern accepted | 8 |
| Provider deferred | 5 |
| Legal conditions | 3 |

## Non-claims

```text
Provider cells marked DEFERRED are not selected
Product Code: BLOCKED
```
