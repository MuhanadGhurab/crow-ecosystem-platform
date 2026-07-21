# Provider Access Matrix

| Field | Value |
|-------|-------|
| **Gate ID** | GHV.VALIDATION.1A |
| **Document ID** | GHV-VAL-1A-PAM-001 |
| **Date** | 2026-07-21 |
| **Owner** | Founder (RAVEN) |
| **Branch HEAD** | `6845688c0fd97680075f1d83ae1cd87b5a2d1352` |
| **Source register** | [FINAL-PROVIDER-DEFERRAL-REGISTER.md](../../architecture/ghuravia/governance/FINAL-PROVIDER-DEFERRAL-REGISTER.md) |

## Verdict @ Validation.1A open

```text
CREDENTIALS: NOT AVAILABLE (all categories)
SANDBOX:     NOT AVAILABLE (all categories)
ADAPTERS:    RETAINED (architecture ports locked)
DEFERRAL INTEGRITY: PASS (0 falsely accepted @ 1E lock)
```

No provider category may be marked **ACCEPTED** or **SELECTED** until sandbox evidence is filed in the relevant domain report.

## Provider category matrix

| Category | Architecture pattern | ADR | Adapter locked | Credentials @ 1A | Sandbox @ 1A | Falsely accepted? | Primary condition |
|----------|---------------------|-----|:--------------:|:----------------:|:------------:|:-----------------:|-------------------|
| Identity provider (IdP) | App-owned sessions + IdP adapter port | ADR-013 | ✓ | **NOT AVAILABLE** | **NOT AVAILABLE** | **NO** | COND-009 |
| Email / contact verification | Adapter port | ADR-016 | ✓ | **NOT AVAILABLE** | **NOT AVAILABLE** | **NO** | COND-010 |
| Mobile verification | Adapter port | ADR-016 | ✓ | **NOT AVAILABLE** | **NOT AVAILABLE** | **NO** | COND-010 |
| Primary relational datastore host | PostgreSQL-family | ADR-005 | — | **NOT AVAILABLE** | **NOT AVAILABLE** | **NO** | COND-032 |
| Object storage (Evidence) | S3-compatible adapter | ADR-020 | ✓ | **NOT AVAILABLE** | **NOT AVAILABLE** | **NO** | COND-011 |
| Malware / secret scanner | Fail-closed pipeline | ADR-021 | ✓ | **NOT AVAILABLE** | **NOT AVAILABLE** | **NO** | COND-012 |
| KMS / encryption | Boundary defined | ADR-018 | — | **NOT AVAILABLE** | **NOT AVAILABLE** | **NO** | COND-015 |
| Realtime transport (Live Sky) | Channel separation + adapter | ADR-030 | ✓ | **NOT AVAILABLE** | **NOT AVAILABLE** | **NO** | COND-016 |
| Search index (beyond relational FTS) | Relational FTS first | ADR-031 | ✓ | **NOT AVAILABLE** | **NOT AVAILABLE** | **NO** | COND-017 |
| Notification delivery | Outbox + adapter | ADR-032 | ✓ | **NOT AVAILABLE** | **NOT AVAILABLE** | **NO** | COND-018 |
| Observability / APM | Privacy-safe telemetry | ADR-034 | ✓ | **NOT AVAILABLE** | **NOT AVAILABLE** | **NO** | COND-019 |
| Payment processor | Webhook + entitlement reconcile | ADR-029 | ✓ | **NOT AVAILABLE** | **NOT AVAILABLE** | **NO** | — (pattern locked) |
| External message broker | Outbox-first; broker optional | ADR-009 | — | **NOT AVAILABLE** | **NOT AVAILABLE** | **NO** | — |
| Shared distributed cache | Not required at launch | ADR-010 | — | **NOT AVAILABLE** | **NOT AVAILABLE** | **NO** | — |
| Deployment / hosting platform | Conceptual topology only | ADR-036 | — | **NOT AVAILABLE** | **NOT AVAILABLE** | **NO** | COND-022 |
| Saudi national identity (Nafath etc.) | Integration port only | ADR-038 | ✓ | **NOT AVAILABLE** | **NOT AVAILABLE** | **NO** | COND-023 |

## Adapter retention statement

Architecture **adapter ports remain RETAINED** per FINAL-PROVIDER-DEFERRAL-REGISTER:

```text
Adapter locked  = interface contract defined in architecture
Vendor chosen   = requires sandbox PASS + governed selection record
Credentials     = operator-provisioned; NOT AVAILABLE in validation workspace
```

Product Code implementation of adapters remains **BLOCKED** until Implementation Authorization is granted **and** blocking external conditions are addressed.

## Patterns accepted without provider (reference)

These patterns were validated at architecture level via spikes; **vendor/host remains deferred**:

| Pattern | ADR | Spike | Sandbox @ 1A |
|---------|-----|-------|:--------------:|
| Evidence upload quarantine | ADR-019 | SPK-ARC-007 | **NOT AVAILABLE** |
| Scanning fail-closed pipeline | ADR-021 | SPK-ARC-008 | **NOT AVAILABLE** |
| Notification failure isolation | ADR-032 | SPK-ARC-018 | **NOT AVAILABLE** |
| Commercial entitlement reconciliation | ADR-029 | SPK-ARC-012 | **NOT AVAILABLE** |
| Live Sky channel separation | ADR-030 | SPK-ARC-014/015 | **NOT AVAILABLE** |
| Relational FTS + authZ filters | ADR-031 | SPK-ARC-016 | **NOT AVAILABLE** |
| Privacy-safe observability shape | ADR-034 | SPK-ARC-022 | **NOT AVAILABLE** |

## Integrity checks @ Validation.1A

| Check | Result |
|-------|--------|
| Any category marked ACCEPTED without sandbox? | **NO** |
| Any spike PASS treated as provider selection? | **NO** |
| Credentials present in validation workspace? | **NO** |
| Adapter contracts withdrawn? | **NO — RETAINED** |

## Next actions (when authorized)

1. Provision sandbox credentials per category under governed secrets path (undefined for Preview @ workspace open).
2. Execute domain validation plans; file reports under respective subdirectories.
3. Update [VALIDATION-EVIDENCE-INDEX.md](./VALIDATION-EVIDENCE-INDEX.md) and [EXTERNAL-VALIDATION-CONDITION-REGISTER.md](./EXTERNAL-VALIDATION-CONDITION-REGISTER.md).

## Explicit non-claims

```text
Adapter RETAINED ≠ sandbox PASS
Deferral integrity PASS @ 1E ≠ provider access @ Validation.1A
Product Code: BLOCKED
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | Initial matrix @ GHV.VALIDATION.1A |
