# Final ADR Registry — GHURAVIA Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARC-GOV-ADR-FINAL-001 |
| **Version** | 2.0.0 |
| **Status** | **ACTIVE — GHURAVIA ARCHITECTURE DESIGN BASELINE v1.0.0** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1E |
| **Branch HEAD** | `6f01d1fd2b7f570e712037a5c4f035861a68063d` |
| **Framework** | [ARCHITECTURE-DECISION-FRAMEWORK.md](./ARCHITECTURE-DECISION-FRAMEWORK.md) |

## Programme roll-up

| Metric | Count |
|--------|------:|
| ADRs recorded | **38** (ADR-ARC-001…038) |
| Conflicting active ADRs | **0** |
| Duplicate ADR IDs | **0** |
| Accepted without spike or architectural evidence | **0** |
| RETURN TO SPIKE | **0** |

```text
Product Code: BLOCKED
External validation: NOT COMPLETE
```

## Full register

| ADR | Title | Status | Recording Gate | Related spike(s) | Conditions / provider deps |
|-----|-------|--------|----------------|-------------------|----------------------------|
| ADR-ARC-001 | Platform architecture shape | **ACCEPTED** | 1B | 001, 021 | — |
| ADR-ARC-002 | Frontend stack | **ACCEPTED WITH CONDITIONS** | 1B | 001 | RTL/a11y user validation retained |
| ADR-ARC-003 | Backend stack | **ACCEPTED WITH CONDITIONS** | 1B | 001, 003, 010 | Hono extraction deferred; Route Handler audit |
| ADR-ARC-004 | API and internal interaction model | **ACCEPTED** | 1B | 003, 010, 011 | — |
| ADR-ARC-005 | Primary datastore | **ACCEPTED** | 1B | 005, 010, 011 | Provider host deferred |
| ADR-ARC-006 | Data access strategy | **ACCEPTED WITH CONDITIONS** | 1B | 005, 010, 011 | Sensitive projection hygiene; raw SQL governance |
| ADR-ARC-007 | Learning Graph representation | **ACCEPTED** | 1B | 005 | — |
| ADR-ARC-008 | Progression event ledger pattern | **ACCEPTED** | 1B | 010, 011 | — |
| ADR-ARC-009 | Background jobs and event publication | **ACCEPTED** | 1B | 010, 021 | External broker deferred |
| ADR-ARC-010 | Cache boundary | **ACCEPTED** | 1B | 005, 010, 021 | Shared distributed cache deferred |
| ADR-ARC-011 | Core testing toolchain | **ACCEPTED** | 1B | 001, 005, 010, 011, 021 | — |
| ADR-ARC-012 | Core language and type safety | **ACCEPTED** | 1B | 001, 003, 005, 010, 011 | Validator brand deferred |
| ADR-ARC-013 | Identity provider boundary | **DEFERRED WITH ADAPTER LOCKED** | 1C | 003 | IdP sandbox required |
| ADR-ARC-014 | Authentication and sessions | **ACCEPTED WITH CONDITIONS** | 1C | 003 | Session timeout UX; CSRF boundary |
| ADR-ARC-015 | Authorization policy model | **ACCEPTED** | 1C | — | Deny by default locked |
| ADR-ARC-016 | Contact verification boundary | **DEFERRED WITH ADAPTER LOCKED** | 1C | 003 | Email/mobile vendor TBD |
| ADR-ARC-017 | Data retention and deletion | **ACCEPTED WITH LEGAL CONDITIONS** | 1C | — | Legal review of retention durations |
| ADR-ARC-018 | Encryption boundaries | **ACCEPTED WITH CONDITIONS** | 1C | — | KMS provider TBD |
| ADR-ARC-019 | Evidence upload pattern | **ACCEPTED** | 1C | 007 | — |
| ADR-ARC-020 | Evidence object storage | **DEFERRED WITH S3-COMPATIBLE ADAPTER LOCKED** | 1C | 007 | Storage provider TBD |
| ADR-ARC-021 | Evidence scanning pipeline | **PIPELINE ACCEPTED · PROVIDER DEFERRED** | 1C | 008 | Fail-closed locked; AV vendor TBD |
| ADR-ARC-022 | Audit and sensitive corrections | **ACCEPTED** | 1C | 019 | — |
| ADR-ARC-023 | Minor identity privacy | **ACCEPTED WITH LEGAL CONDITIONS** | 1C | 025 | Legal validation required |
| ADR-ARC-024 | Runtime process topology | **ACCEPTED** | 1D | 004, 021 | Worker boundary planned |
| ADR-ARC-025 | Localization runtime model | **ACCEPTED WITH CONDITIONS** | 1D | 002 | Arabic typography user validation NOT RUN |
| ADR-ARC-026 | Accessibility runtime requirements | **ACCEPTED WITH USER-VALIDATION CONDITIONS** | 1D | 017 | Manual/user a11y review required |
| ADR-ARC-027 | Save/resume conflict model | **ACCEPTED** | 1D | 006 | — |
| ADR-ARC-028 | Skyboard composition and caching | **ACCEPTED WITH PERFORMANCE CONDITIONS** | 1D | 023 | DRAFT perf target · local spike only |
| ADR-ARC-029 | Payment webhook and entitlement reconciliation | **ACCEPTED** | 1D | 012 | Commercial ↛ progression locked |
| ADR-ARC-030 | Live Sky realtime pattern | **ACCEPTED WITH CONDITIONS** | 1D | 014, 015 | Realtime provider DEFERRED WITH ADAPTER |
| ADR-ARC-031 | Search and discovery pattern | **ACCEPTED PATTERN · PROVIDER DEFERRED** | 1D | 016 | Relational FTS first |
| ADR-ARC-032 | Notification delivery pattern | **ACCEPTED · PROVIDER DEFERRED** | 1D | 018 | Failure ↛ business state locked |
| ADR-ARC-033 | Leaderboard publication and snapshot model | **ACCEPTED** | 1D | 024 | Population threshold locked |
| ADR-ARC-034 | Observability and diagnostics | **ACCEPTED WITH CONDITIONS · PROVIDER DEFERRED** | 1D | 022 | PII redaction locked |
| ADR-ARC-035 | Backup restore and continuity | **ACCEPTED WITH OPERATIONAL CONDITIONS** | 1D | 020 | DRAFT RPO/RTO · drill not operational |
| ADR-ARC-036 | Environment and deployment topology | **ACCEPTED CONCEPTUALLY** | 1D | 021 | External infra validation open |
| ADR-ARC-037 | Release and migration governance | **ACCEPTED** | 1D | 021 | — |
| ADR-ARC-038 | Integration adapter and webhook model | **ACCEPTED** | 1D | 012 | Saudi **OFFICIAL ACCESS NOT VERIFIED** |

## Status summary

| Status class | Count |
|--------------|------:|
| ACCEPTED (plain) | 14 |
| ACCEPTED WITH CONDITIONS / variants | 16 |
| DEFERRED WITH ADAPTER LOCKED | 4 |
| PIPELINE ACCEPTED · PROVIDER DEFERRED | 1 |
| ACCEPTED CONCEPTUALLY | 1 |
| ACCEPTED PATTERN · PROVIDER DEFERRED | 2 |

## Explicit non-claims

```text
ADR acceptance ≠ provider selected
ADR acceptance ≠ compliance certification
ADR acceptance ≠ Product Code authorized
ADR acceptance ≠ production deployment
```

## Supersedes

- [ADR-REGISTER.md](./ADR-REGISTER.md) v1.1.0 (1B partial register) — retained for history; **this document is authoritative for 1E lock**

## Change history

| Version | Date | Change |
|---------|------|--------|
| 2.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1E — full ADR-ARC-001…038 final registry |
| 1.1.0 | 2026-07-21 | GHV.ARCHITECTURE.1B — ADR-001…012 only |
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A — proposed/deferred only |
