# C2 — Persistent Blueprint Versioning & Traceability Runtime

**Phase:** C2 (implementation)  
**Base branch:** `feat/c1-1-blueprint-persistence-gate`  
**Work branch:** `feat/c2-blueprint-persistence-runtime`  
**Upstream decision:** APPROVE PATH C — READY FOR C2 MIGRATION IMPLEMENTATION (C1.1)

## Mission

Implement the approved Hybrid Path C persistence architecture and connect Enterprise Blueprint Studio to tenant-safe, versioned, traceable runtime storage — without deploying runtime configuration or applying migrations to hosted Preview/Production databases in this phase.

## Deliverables

- Additive Prisma migration `20260614120000_blueprint_versioning_traceability` (14th migration)
- Blueprint identity + version separation on `EnterpriseBlueprint` / `EnterpriseBlueprintVersion`
- Immutable approved snapshots, evidence-bound approvals, persistent trace events
- Reproducible ROI assumptions/revisions/snapshots and SOW document/version/section persistence
- Explicit Blueprint Studio action authorization and server-side client projection
- Legacy dual-read adapter and dry-run-first backfill tooling
- Verifier: `npm run c2-blueprint-runtime:verify`

## Out of scope (C2)

- Hosted database migration apply
- Destructive legacy cleanup
- Runtime configuration deployment
- Production backfill `--apply`
- M4D / PR #2 changes

## Related

- C1.1 gate: `docs/architecture/crow-core/c1/C1_1_MIGRATION_APPROVAL_GATE.md`
- Internal status: `docs/internal/C2_BLUEPRINT_PERSISTENCE_RUNTIME.md`
