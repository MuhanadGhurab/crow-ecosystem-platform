# C2.2 — Legacy blueprint ownership resolution

**Purpose:** Track tenant ownership gaps blocking C2 backfill authorization  
**Source:** C2.1 backfill dry-run (`C2_1_BACKFILL_DRY_RUN_REPORT.md`)

## Summary counts

| Metric | Count |
|--------|-------|
| Blueprints audited | 5 |
| Would create version row (dry-run) | 2 |
| Unresolved tenant ownership | 3 |

## Policy

- Backfill uses **`LEGACY_IMPORT`** provenance only
- Dry-run does not invent approvals or approved snapshots
- **`--apply` is blocked** until all ownership records are resolved

## Record worksheet (local only)

Detailed per-blueprint mapping (masked IDs, proposed `tenantId`, resolver notes) belongs in:

```text
docs/architecture/crow-core/c2/.c22-legacy-blueprint-ownership.local.json
```

This file is **gitignored**. Committed docs reference counts and classifications only — never raw tenant IDs or customer names in repo.

### Worksheet schema (operator-maintained)

```json
{
  "generatedAt": "ISO-8601",
  "records": [
    {
      "blueprintIdMasked": "abcd…wxyz",
      "status": "resolved | unresolved",
      "proposedTenantIdMasked": "optional",
      "resolutionNotes": "operator text"
    }
  ]
}
```

## Resolution criteria

Before authorizing Preview backfill or apply:

1. Every blueprint has an unambiguous `tenantId` (or documented platform-internal exception approved by PO)
2. Dry-run reports 0 unresolved ownership rows
3. C2.1/C2.2 isolation and fingerprint checks pass on target Preview DB

## Related

- [C2_1_BACKFILL_DRY_RUN_REPORT.md](./C2_1_BACKFILL_DRY_RUN_REPORT.md)
- [C2_1_PREVIEW_MIGRATION_READINESS.md](./C2_1_PREVIEW_MIGRATION_READINESS.md)
