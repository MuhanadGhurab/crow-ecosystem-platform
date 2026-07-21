# Final Provider Deferral Register

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARC-GOV-PROV-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1E |
| **Branch HEAD** | `6f01d1fd2b7f570e712037a5c4f035861a68063d` |

## Verdict

```text
DEFERRAL INTEGRITY PASS
Deferred providers falsely represented as accepted: 0
```

## Provider category register

| Category | Architecture pattern | Provider status | ADR | Adapter locked | Evidence | Falsely accepted? |
|----------|---------------------|-----------------|-----|:--------------:|----------|:-----------------:|
| Identity provider (IdP) | App-owned sessions + IdP adapter port | **DEFERRED** | ADR-013 | ✓ | SPK-003 | **NO** |
| Email / contact verification | Adapter port | **DEFERRED** | ADR-016 | ✓ | SPK-003 | **NO** |
| Mobile verification | Adapter port | **DEFERRED** | ADR-016 | ✓ | — | **NO** |
| Primary relational datastore host | PostgreSQL-family | **DEFERRED** (host) | ADR-005 | — | SPK-005 | **NO** |
| Object storage (Evidence) | S3-compatible adapter | **DEFERRED** | ADR-020 | ✓ | SPK-007 | **NO** |
| Malware / secret scanner | Fail-closed pipeline | **DEFERRED** (vendor) | ADR-021 | ✓ | SPK-008 | **NO** |
| KMS / encryption | Boundary defined | **DEFERRED** | ADR-018 | — | — | **NO** |
| Realtime transport (Live Sky) | Channel separation + adapter | **DEFERRED** | ADR-030 | ✓ | SPK-014/015 | **NO** |
| Search index (beyond relational FTS) | Relational FTS first | **DEFERRED** | ADR-031 | ✓ | SPK-016 | **NO** |
| Notification delivery | Outbox + adapter | **DEFERRED** | ADR-032 | ✓ | SPK-018 | **NO** |
| Observability / APM | Privacy-safe telemetry | **DEFERRED** | ADR-034 | ✓ | SPK-022 | **NO** |
| Payment processor | Webhook + entitlement reconcile | Pattern locked; processor TBD | ADR-029 | ✓ | SPK-012 | **NO** |
| External message broker | Outbox-first; broker optional | **DEFERRED** | ADR-009 | — | SPK-010 | **NO** |
| Shared distributed cache | Not required at launch | **DEFERRED** | ADR-010 | — | — | **NO** |
| Deployment / hosting platform | Conceptual topology only | **DEFERRED** (external proof) | ADR-036 | — | SPK-021 | **NO** |
| Saudi national identity (Nafath etc.) | Integration port only | **NOT VERIFIED** | ADR-038 | ✓ | — | **NO** |

## Accepted-without-provider (pattern locked)

These categories have **accepted architecture patterns** while the **vendor/host remains explicitly deferred**:

| Pattern | ADR | Spike |
|---------|-----|-------|
| Evidence upload quarantine | ADR-019 | SPK-007 |
| Scanning fail-closed pipeline | ADR-021 | SPK-008 |
| Notification failure isolation | ADR-032 | SPK-018 |
| Commercial entitlement reconciliation | ADR-029 | SPK-012 |
| Live Sky channel separation | ADR-030 | SPK-014/015 |
| Relational FTS + authZ filters | ADR-031 | SPK-016 |
| Privacy-safe observability shape | ADR-034 | SPK-022 |

## Integrity checks

| Check | Result |
|-------|--------|
| Any DEFERRED provider marked ACCEPTED without adapter? | **NO** |
| Any spike PASS treated as provider selection? | **NO** |
| Provider comparison docs claim final selection? | **NO** — comparisons are decision support only |
| ADR status vocabulary consistent with deferral? | **YES** |

## Next programme

Provider sandbox validation, Preview environment proof, and operational DR are assigned to **GHV.VALIDATION.1A** (recommended — **not started** in this Gate).

## Explicit non-claims

```text
Adapter locked ≠ vendor chosen
Pattern accepted ≠ production configured
Product Code: BLOCKED
```

## Related

- [IDENTITY-EVIDENCE-PROVIDER-DECISION-MATRIX.md](./IDENTITY-EVIDENCE-PROVIDER-DECISION-MATRIX.md)
- [ARCHITECTURE-1B-DEFERRED-DECISIONS.md](./ARCHITECTURE-1B-DEFERRED-DECISIONS.md)

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1E — final provider deferral register |
