# BLUEPRINT.1B Migration Application

> **Status:** APPLIED — CERTIFICATION ONLY (`wbwnsndcxrgyqwppurms`)  
> **NOT APPLIED** to live Production

## Migration

| Field | Value |
| ----- | ----- |
| Name | `20260624120000_blueprint_persistent_review_lifecycle` |
| Pre-apply fingerprint | `0355c17692e2a90d` |
| Post-apply fingerprint | `0355c17692e2a90d` (schema additive; fingerprint unchanged per existing tooling) |
| Applied migrations | 23 (including this migration) |
| Failed | 0 |
| Pending | 0 |

## Owner decisions applied

- `tenantId` nullable on `EnterpriseBlueprintVersion` and `BlueprintTraceEvent`
- No sentinel tenant
- Full UPDATE/DELETE block on versions via `blueprint_version_no_update` trigger
- Canonical review model: `BlueprintReviewCycle`, `BlueprintReviewAction`, `BlueprintTraceEvent`
- Legacy `BlueprintApproval` / `BlueprintChangeRequest` preserved (read adapters only)

## Business data

- **No Blueprint business rows created by Cursor**
- First persistent Blueprint: manual owner acceptance after deployment

## Rollback

See `proposals/BLUEPRINT_1A_PROPOSED_ROLLBACK.sql` — extended in 1B for `currentVersionId`. Restricted after business data exists.

## Verification

- `npm run cloud-1e-post-apply:verify` — PASS
- `npm run cloud-data-api-containment:verify` — run after deploy
- `docs/architecture/crow-core/proposals/BLUEPRINT_1A_VERIFICATION.sql` — manual read-only queries
