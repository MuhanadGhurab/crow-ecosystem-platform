# 10 — C1 Open Questions and Future Migration

## Open questions

1. **Client-visible version history** — Should approved snapshot hashes appear on proposal PDFs before Path C ships?
2. **ROI assumption approval workflow** — Separate commercial sign-off table or reuse proposal status?
3. **Studio vs legacy overview** — Redirect `/blueprints/[id]/overview` to Studio Overview tab after C2?
4. **Audit log ingestion** — Which `cybercrow_audit_logs` event types map to `blueprint_version` stage?

## C2 preview (after migration approval)

- Execute Path C: `BlueprintVersion`, `BlueprintTraceEvent`, `BlueprintCommercialSnapshot`
- Wire Studio `captureBlueprintSnapshotAction` to DB persistence
- Client approval evidence with content hash
- Configuration release proposal (advisory only — still no auto-deploy)

## Migration approval checklist

- [ ] Product approves Path C schema in [`C1_BLUEPRINT_PERSISTENCE_MIGRATION_PROPOSAL.md`](./C1_BLUEPRINT_PERSISTENCE_MIGRATION_PROPOSAL.md)
- [ ] DBA review indexes and tenant isolation
- [ ] Rollback plan documented
- [ ] Backfill strategy for existing blueprints (single v1 snapshot from adapter)

## C1 gate outcome

**CONDITIONAL PASS — MIGRATION APPROVAL REQUIRED**

Prototype Studio, ROI, SOW, and version compare are shippable on fixtures and live adapter reads. Production-grade immutable version history requires approved migration.
