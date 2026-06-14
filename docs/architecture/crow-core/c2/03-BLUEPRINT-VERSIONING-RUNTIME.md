# C2 — Blueprint versioning runtime

## Services

- `blueprint-versioning.service.ts` — initial draft, save draft, create next version
- `blueprint-runtime.service.ts` — load identity, active draft, current approved, trace timeline
- `blueprint-dual-read.service.ts` — `c2_version` vs `legacy_unversioned`

## Invariants

1. One active draft per Blueprint (`BLUEPRINT_DRAFT` lifecycle)
2. One current approved version per Blueprint
3. Approved / superseded / archived versions are immutable
4. Post-approval edits require a new version

## Optimistic concurrency

Draft saves require `expectedRevision` (and hash verification on approval). Conflicts return typed `409 CONFLICT` with current revision and hash — no last-write-wins.

## Schema version

Snapshot envelope uses `schemaVersion: "1.0.0"` with max size 2 MB, depth and array limits in `snapshot-validation.ts`.
