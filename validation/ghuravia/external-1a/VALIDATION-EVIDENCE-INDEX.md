# Validation Evidence Index

| Field | Value |
|-------|-------|
| **Gate ID** | GHV.VALIDATION.1A |
| **Date** | 2026-07-21 |
| **Owner** | Founder (RAVEN) |
| **Branch HEAD** | `6845688c0fd97680075f1d83ae1cd87b5a2d1352` |

## Index purpose

Master index of **domain validation reports** filed under `validation/ghuravia/external-1a/`. Reports cite real evidence paths or explicitly state **NOT AVAILABLE** / **NOT RUN** / **DOCUMENTATION-ONLY**. No **SANDBOX VERIFIED** entries @ 2026-07-21.

```text
Documentation-only entries are marked [DOC-ONLY].
No sandbox PASS may be inferred without filed evidence.
Product Code: BLOCKED
```

## Workspace-level reports (this directory)

| Report | Path | Status | Notes |
|--------|------|--------|-------|
| Baseline entry verification | [BASELINE-ENTRY-VERIFICATION.md](./BASELINE-ENTRY-VERIFICATION.md) | **PASS** | Locked baselines available for external validation |
| Official source register | [OFFICIAL-SOURCE-REGISTER.md](./OFFICIAL-SOURCE-REGISTER.md) | **ACTIVE [DOC-ONLY]** | Retrieval 2026-07-21; no sandbox evidence |
| Environment availability matrix | [ENVIRONMENT-AVAILABILITY-MATRIX.md](./ENVIRONMENT-AVAILABILITY-MATRIX.md) | **ACTIVE** | Preview NOT ESTABLISHED; TECH-018 OPEN |
| Provider access matrix | [PROVIDER-ACCESS-MATRIX.md](./PROVIDER-ACCESS-MATRIX.md) | **ACTIVE** | Credentials NOT AVAILABLE for all categories |
| External validation condition register | [EXTERNAL-VALIDATION-CONDITION-REGISTER.md](./EXTERNAL-VALIDATION-CONDITION-REGISTER.md) | **ACTIVE** | COND-001…032 mapped @ Validation.1A |
| External evidence architecture impact | [governance/EXTERNAL-EVIDENCE-ARCHITECTURE-IMPACT-REVIEW.md](./governance/EXTERNAL-EVIDENCE-ARCHITECTURE-IMPACT-REVIEW.md) | **FILED** | 0 contradictions · 0 rebaseline |
| Implementation readiness criteria | [governance/IMPLEMENTATION-READINESS-CRITERIA.md](./governance/IMPLEMENTATION-READINESS-CRITERIA.md) | **FILED** | 20 criteria scored · NOT READY |
| Implementation blocker register | [governance/IMPLEMENTATION-BLOCKER-REGISTER.md](./governance/IMPLEMENTATION-BLOCKER-REGISTER.md) | **FILED** | 17 Product Code path blockers |
| Implementation readiness assessment | [governance/IMPLEMENTATION-READINESS-ASSESSMENT.md](./governance/IMPLEMENTATION-READINESS-ASSESSMENT.md) | **FILED** | NOT READY |
| External validation acceptance matrix | [governance/EXTERNAL-VALIDATION-ACCEPTANCE-MATRIX.md](./governance/EXTERNAL-VALIDATION-ACCEPTANCE-MATRIX.md) | **FILED** | Domains mostly NOT AVAILABLE |
| External validation baseline v0.1.0 | [governance/EXTERNAL-TECHNICAL-VALIDATION-BASELINE.md](./governance/EXTERNAL-TECHNICAL-VALIDATION-BASELINE.md) | **PARTIAL** | Gate close artefact |
| Architecture condition reconciliation | [governance/ARCHITECTURE-CONDITION-VALIDATION-RECONCILIATION.md](./governance/ARCHITECTURE-CONDITION-VALIDATION-RECONCILIATION.md) | **FILED** | Before/after COND-001..032 |
| Gate report | [GHV.VALIDATION.1A.md](../../../governance/gates/GHV.VALIDATION.1A.md) | **PARTIAL** | Authoritative gate verdict |
| Final provider validation matrix | [FINAL-PROVIDER-VALIDATION-MATRIX.md](./FINAL-PROVIDER-VALIDATION-MATRIX.md) | **FILED** | All categories NOT AVAILABLE or DOC-ONLY |

## Domain reports

| Domain | Directory | Primary conditions | Status | Primary evidence | Result |
|--------|-----------|-------------------|--------|------------------|--------|
| Database / datastore host | [database/](./database/) | COND-032 · TECH-018 | **FILED** | [PREVIEW-DATABASE-READINESS-REPORT.md](./database/PREVIEW-DATABASE-READINESS-REPORT.md) · [DATABASE-CONTRACT-VALIDATION.md](./database/DATABASE-CONTRACT-VALIDATION.md) | **NOT AVAILABLE** · TECH-018 OPEN · **BLOCKING** |
| Migration / rollback | [migration-rollback/](./migration-rollback/) | COND-026 | **FILED** | [MIGRATION-ROLLBACK-REHEARSAL.md](./migration-rollback/MIGRATION-ROLLBACK-REHEARSAL.md) | **NOT AVAILABLE** · **BLOCKING** |
| Identity (IdP) | [identity/](./identity/) | COND-009 | **FILED** | [IDENTITY-PROVIDER-VALIDATION.md](./identity/IDENTITY-PROVIDER-VALIDATION.md) · [SESSION-SECURITY-VALIDATION.md](./identity/SESSION-SECURITY-VALIDATION.md) | **DOC-ONLY** / **NOT AVAILABLE** · **DEFERRED WITH ADAPTER** |
| Contact / email / mobile | [contact/](./contact/) | COND-010 | **FILED** | [CONTACT-VERIFICATION-VALIDATION.md](./contact/CONTACT-VERIFICATION-VALIDATION.md) | **NOT AVAILABLE** · Delivery≠Verified **RETAINED** |
| Payments | [payments/](./payments/) | ADR-029 · SPK-012 | **FILED** | [PAYMENT-PROVIDER-VALIDATION.md](./payments/PAYMENT-PROVIDER-VALIDATION.md) | **NOT AVAILABLE** · HMAC **DOC-ONLY** |
| Evidence storage | [evidence-storage/](./evidence-storage/) | COND-011 | **FILED** | [OBJECT-STORAGE-VALIDATION.md](./evidence-storage/OBJECT-STORAGE-VALIDATION.md) | **NOT AVAILABLE** · adapter **RETAINED** |
| Evidence scanning | [evidence-scanning/](./evidence-scanning/) | COND-012 | **FILED** | [EVIDENCE-SCANNING-VALIDATION.md](./evidence-scanning/EVIDENCE-SCANNING-VALIDATION.md) | **NOT AVAILABLE** · fail-closed **RETAINED** |
| Realtime (Live Sky) | [realtime/](./realtime/) | COND-016 | **FILED** | [REALTIME-PROVIDER-VALIDATION.md](./realtime/REALTIME-PROVIDER-VALIDATION.md) | **NOT AVAILABLE** · Fan-out **NOT VALIDATED** |
| Search | [search/](./search/) | COND-017 | **FILED** | [ARABIC-SEARCH-VALIDATION.md](./search/ARABIC-SEARCH-VALIDATION.md) | **DOC-ONLY** / SPK-016 · user **NOT RUN** |
| Notifications | [notifications/](./notifications/) | COND-018 | **FILED** | [NOTIFICATION-PROVIDER-VALIDATION.md](./notifications/NOTIFICATION-PROVIDER-VALIDATION.md) | **NOT AVAILABLE** · failure↛state **RETAINED** |
| Observability | [observability/](./observability/) | COND-019 | **FILED** | [OBSERVABILITY-PROVIDER-VALIDATION.md](./observability/OBSERVABILITY-PROVIDER-VALIDATION.md) | **NOT AVAILABLE** · telemetry≠audit **RETAINED** |
| Hosting / deployment | [hosting/](./hosting/) | COND-022 | **FILED** | [HOSTING-WORKER-COMPATIBILITY-VALIDATION.md](./hosting/HOSTING-WORKER-COMPATIBILITY-VALIDATION.md) | **DOC-ONLY** · no deploy executed |
| Security programme | [security/](./security/) | COND-028 | **FILED** | [SECURITY-VALIDATION-REPORT.md](./security/SECURITY-VALIDATION-REPORT.md) | Pen test **NOT RUN** · not a pen-test report |
| Accessibility | [accessibility/](./accessibility/) | COND-008 | **FILED** | [ACCESSIBILITY-VALIDATION-REPORT.md](./accessibility/ACCESSIBILITY-VALIDATION-REPORT.md) | SPK-017 spike only · user **NOT RUN** |
| Localization / Arabic UX | [localization/](./localization/) | COND-007 | **FILED** | [ARABIC-UX-VALIDATION-REPORT.md](./localization/ARABIC-UX-VALIDATION-REPORT.md) | SPK-002 spike only · native/user **NOT RUN** |
| Performance / Skyboard | [performance/](./performance/) | COND-021 | **FILED** | [LOAD-CAPACITY-VALIDATION.md](./performance/LOAD-CAPACITY-VALIDATION.md) | **NOT RUN** · SPK-023 **DRAFT** |
| Backup / restore / DR | [backup-restore/](./backup-restore/) | COND-020 | **FILED** | [BACKUP-RESTORE-DRILL.md](./backup-restore/BACKUP-RESTORE-DRILL.md) | **NOT AVAILABLE** · launch gate **RETAINED** |
| Privacy / legal | [privacy-legal/](./privacy-legal/) | COND-013,014,023,029 | **FILED** | [PRIVACY-LEGAL-READINESS-ASSESSMENT.md](./privacy-legal/PRIVACY-LEGAL-READINESS-ASSESSMENT.md) | **NOT LEGALLY APPROVED** |
| Governance | [governance/](./governance/) | Programme tracking | **PLACEHOLDER** | — | Gate artefacts index pending |

## Per-domain standard artefacts

Each filed domain directory contains:

| Artefact | Purpose |
|----------|---------|
| `README.md` | Domain index and disposition summary |
| `VALIDATION-QUESTION.md` | Governed validation question |
| `TEST-PLAN.md` | Planned external test steps |
| `RESULT.md` | Honest roll-up disposition |
| `commands.txt` | Command log (`NO EXTERNAL COMMANDS EXECUTED — access unavailable`) |

## Upstream architecture evidence (reference only)

These artefacts support validation planning but **do not close** external conditions:

| Artefact | Path | Role |
|----------|------|------|
| Final spike reconciliation | [FINAL-TECHNICAL-SPIKE-RECONCILIATION.md](../../architecture/ghuravia/governance/FINAL-TECHNICAL-SPIKE-RECONCILIATION.md) | 25/25 complete · 17 PASS · 8 PWC |
| Spike evidence integrity | [SPIKE-EVIDENCE-INTEGRITY-REPORT.md](../../architecture/ghuravia/governance/SPIKE-EVIDENCE-INTEGRITY-REPORT.md) | Harness evidence package |
| Provider deferral register | [FINAL-PROVIDER-DEFERRAL-REGISTER.md](../../architecture/ghuravia/governance/FINAL-PROVIDER-DEFERRAL-REGISTER.md) | Deferral integrity PASS |
| Architecture condition register | [FINAL-ARCHITECTURE-CONDITION-REGISTER.md](../../architecture/ghuravia/governance/FINAL-ARCHITECTURE-CONDITION-REGISTER.md) | Source dispositions @ 1E lock |

## Evidence filing rules

1. Domain reports must be named per domain convention or `RESULT.md` within each subdirectory.
2. Update this index when a report moves disposition — never mark **SANDBOX VERIFIED** without real proof.
3. Attach evidence paths relative to repository root; never commit secrets.
4. Mark `[DOC-ONLY]` when the report cites official documentation without live sandbox execution.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial index @ GHV.VALIDATION.1A workspace open |
| 0.2.0 | 2026-07-21 | Validation.1A governance artefacts filed · gate PARTIAL |
| 1.0.0 | 2026-07-21 | Domain reports filed — honest NOT AVAILABLE / DOC-ONLY dispositions |
