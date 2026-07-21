# Validation Evidence Index

| Field | Value |
|-------|-------|
| **Gate ID** | GHV.VALIDATION.1B |
| **Date** | 2026-07-21 |
| **Owner** | Founder (RAVEN) |
| **Branch HEAD** | `4544463efdce67f03f15e8e4939d71b3af2776f6` |
| **Prior gate** | GHV.VALIDATION.1A — **PARTIAL** |

## Index purpose

Master index of **Validation.1B artefacts** filed under `validation/ghuravia/external-1b/`. This gate adds **local-first implementation-entry validation** layer documentation. External/provider domain reports remain under `validation/ghuravia/external-1a/` and are referenced, not duplicated.

```text
Documentation-only entries are marked [DOC-ONLY].
Executable local rehearsal evidence must be attached before IMP-ENTRY PASS claims.
Product Code: BLOCKED
Implementation Authorization: NOT GRANTED BY VALIDATION.1B
Preview deployment: BLOCKED
Production deployment: BLOCKED
Providers: MOCKED for local entry path only
```

## Workspace-level reports (this directory)

| Report | Path | Status | Notes |
|--------|------|--------|-------|
| Workspace README | [README.md](./README.md) | **ACTIVE** | NON-PRODUCT CODE · safety rules |
| Baseline entry verification | [BASELINE-ENTRY-VERIFICATION.md](./BASELINE-ENTRY-VERIFICATION.md) | **PASS** | Governed baselines available for implementation-entry validation |
| Blocker reclassification | [BLOCKER-RECLASSIFICATION.md](./BLOCKER-RECLASSIFICATION.md) | **FILED** | BLK-VAL-001..021 reclassified · **Unclassified: 0** |
| Implementation entry minimum criteria | [IMPLEMENTATION-ENTRY-MINIMUM-CRITERIA.md](./IMPLEMENTATION-ENTRY-MINIMUM-CRITERIA.md) | **READY WITH CONDITIONS** | 5 PASS · 15 PWC · 0 FAIL · 0 NOT AVAILABLE |
| Implementation authorization recommendation | [IMPLEMENTATION-AUTHORIZATION-RECOMMENDATION.md](./IMPLEMENTATION-AUTHORIZATION-RECOMMENDATION.md) | **RECOMMENDATION** | Recommend GHV.IMPLEMENTATION.0A for local entry only |

## Upstream Validation.1A artefacts (reference — preserved)

| Report | Path | Status @ 1A | Role @ 1B |
|--------|------|-------------|-----------|
| Validation.1A README | [../external-1a/README.md](../external-1a/README.md) | **ACTIVE** | External validation workspace · preserved |
| Validation.1A baseline entry | [../external-1a/BASELINE-ENTRY-VERIFICATION.md](../external-1a/BASELINE-ENTRY-VERIFICATION.md) | **PASS** | External validation entry · superseded for entry scope by 1B BEV |
| Validation.1A evidence index | [../external-1a/VALIDATION-EVIDENCE-INDEX.md](../external-1a/VALIDATION-EVIDENCE-INDEX.md) | **ACTIVE** | Domain report master index |
| Environment availability matrix | [../external-1a/ENVIRONMENT-AVAILABILITY-MATRIX.md](../external-1a/ENVIRONMENT-AVAILABILITY-MATRIX.md) | **ACTIVE** | Preview NOT ESTABLISHED |
| Provider access matrix | [../external-1a/PROVIDER-ACCESS-MATRIX.md](../external-1a/PROVIDER-ACCESS-MATRIX.md) | **ACTIVE** | Credentials NOT AVAILABLE |
| Implementation blocker register @ 1A | [../external-1a/governance/IMPLEMENTATION-BLOCKER-REGISTER.md](../external-1a/governance/IMPLEMENTATION-BLOCKER-REGISTER.md) | **FILED** | Source definitions · reclassified in 1B |
| Implementation readiness criteria @ 1A | [../external-1a/governance/IMPLEMENTATION-READINESS-CRITERIA.md](../external-1a/governance/IMPLEMENTATION-READINESS-CRITERIA.md) | **FILED** | IRC-001..020 · external readiness |
| Gate report Validation.1A | [../../../governance/gates/GHV.VALIDATION.1A.md](../../../governance/gates/GHV.VALIDATION.1A.md) | **PARTIAL** | Authoritative prior validation verdict |

## Domain reports (external — Validation.1A)

Domain validation reports under `validation/ghuravia/external-1a/` remain authoritative for **external/provider** disposition. Validation.1B does not re-run or override honest NOT AVAILABLE findings.

| Domain | Directory | Primary conditions | Status @ 1A | Local-entry note @ 1B |
|--------|-----------|-------------------|-------------|----------------------|
| Database / datastore host | [../external-1a/database/](../external-1a/database/) | COND-032 · TECH-018 | **NOT AVAILABLE** | Local PG alternative path documented · Preview **BLOCKED** |
| Migration / rollback | [../external-1a/migration-rollback/](../external-1a/migration-rollback/) | COND-026 | **NOT AVAILABLE** | Local rehearsal **PENDING** · BLK-VAL-015/016 |
| Identity (IdP) | [../external-1a/identity/](../external-1a/identity/) | COND-009 | **NOT AVAILABLE** | Mock adapter OK for local · real IdP **BLOCKED** |
| Contact / email | [../external-1a/contact/](../external-1a/contact/) | COND-010 | **NOT AVAILABLE** | Mock OK · deliverability **BLOCKED** |
| Payments | [../external-1a/payments/](../external-1a/payments/) | ADR-029 | **NOT AVAILABLE** | Mock OK · paid activation **BLOCKED** |
| Evidence storage | [../external-1a/evidence-storage/](../external-1a/evidence-storage/) | COND-011 | **NOT AVAILABLE** | Mock OK · real uploads **BLOCKED** |
| Evidence scanning | [../external-1a/evidence-scanning/](../external-1a/evidence-scanning/) | COND-012 | **NOT AVAILABLE** | Mock fail-closed OK · real scan **BLOCKED** |
| Realtime (Live Sky) | [../external-1a/realtime/](../external-1a/realtime/) | COND-016 | **NOT AVAILABLE** | Mock OK · Live Sky **BLOCKED** |
| Search | [../external-1a/search/](../external-1a/search/) | COND-017 | **NOT AVAILABLE** | Relational FTS/local OK · scale **BLOCKED** |
| Notifications | [../external-1a/notifications/](../external-1a/notifications/) | COND-018 | **NOT AVAILABLE** | Mock OK · deliverability **BLOCKED** |
| Observability | [../external-1a/observability/](../external-1a/observability/) | COND-019 | **NOT AVAILABLE** | Local mock OK · prod APM **BLOCKED** |
| Performance / Skyboard | [../external-1a/performance/](../external-1a/performance/) | COND-021 | **NOT RUN** | Load budget **BLOCKS CONTROLLED LAUNCH** |
| Security programme | [../external-1a/security/](../external-1a/security/) | COND-028 | **NOT RUN** | Pen-test **BLOCKS CONTROLLED LAUNCH** |
| Backup / restore / DR | [../external-1a/backup-restore/](../external-1a/backup-restore/) | COND-020 | **NOT AVAILABLE** | **BLOCKS CONTROLLED LAUNCH** |
| Privacy / legal | [../external-1a/privacy-legal/](../external-1a/privacy-legal/) | COND-013,014,023,029 | **NOT APPROVED** | **BLOCKS CONTROLLED LAUNCH** |
| Accessibility | [../external-1a/accessibility/](../external-1a/accessibility/) | COND-008 | **NOT RUN** | **BLOCKS CONTROLLED LAUNCH** |
| Localization / Arabic UX | [../external-1a/localization/](../external-1a/localization/) | COND-007 | **NOT RUN** | **BLOCKS CONTROLLED LAUNCH** |
| Hosting / deployment | [../external-1a/hosting/](../external-1a/hosting/) | COND-022 | **DOC-ONLY** | Preview isolation **BLOCKS PREVIEW DEPLOYMENT** |

Full domain index: [../external-1a/VALIDATION-EVIDENCE-INDEX.md](../external-1a/VALIDATION-EVIDENCE-INDEX.md).

## Executable evidence pending @ Validation.1B

| Evidence class | Expected attachment location | Status |
|----------------|------------------------------|--------|
| Local PostgreSQL connectivity proof | [local-database/RESULT.md](./local-database/RESULT.md) | **PASS** |
| Local secrets path proof (no committed credentials) | [secrets/RESULT.md](./secrets/RESULT.md) | **PASS** |
| Local migration rehearsal log | [migration-rollback/RESULT.md](./migration-rollback/RESULT.md) | **PASS** |
| Local rollback rehearsal log | [migration-rollback/RESULT.md](./migration-rollback/RESULT.md) | **PASS** |
| Local workspace scaffold verification | [local-workspace/RESULT.md](./local-workspace/RESULT.md) | **PASS** |

## Upstream architecture evidence (reference only)

| Artefact | Path | Role |
|----------|------|------|
| Final spike reconciliation | [FINAL-TECHNICAL-SPIKE-RECONCILIATION.md](../../architecture/ghuravia/governance/FINAL-TECHNICAL-SPIKE-RECONCILIATION.md) | 25/25 complete · 17 PASS · 8 PWC |
| Architecture condition register | [FINAL-ARCHITECTURE-CONDITION-REGISTER.md](../../architecture/ghuravia/governance/FINAL-ARCHITECTURE-CONDITION-REGISTER.md) | Source dispositions @ 1E lock |
| Implementation authorization boundary | [IMPLEMENTATION-AUTHORIZATION-BOUNDARY.md](../../architecture/ghuravia/governance/IMPLEMENTATION-AUTHORIZATION-BOUNDARY.md) | Product Code gate boundary |

## Evidence filing rules

1. Validation.1B artefacts must not contain Product Code, root `package.json`, `apps/`, `.env`, or credentials.
2. Update this index when IMP-ENTRY criteria move disposition or when local rehearsal evidence is attached.
3. Never mark **SANDBOX VERIFIED** or **REHEARSAL PASS** without filed executable proof.
4. Preserve Validation.1A NOT AVAILABLE dispositions for external domains unless superseded by a later governed gate with real evidence.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial index @ GHV.VALIDATION.1B workspace open |
| 1.0.0 | 2026-07-21 | Core Validation.1B artefacts filed · upstream 1A references indexed |
