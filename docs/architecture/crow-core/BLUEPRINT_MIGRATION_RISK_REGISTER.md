# Blueprint Migration Risk Register

> **Status:** PROPOSED — NOT APPLIED — OWNER REVIEW REQUIRED

| Risk | Likelihood | Impact | Mitigation | Verification | Rollback implication | Owner decision |
| ---- | ---------- | ------ | ---------- | ------------ | -------------------- | -------------- |
| Schema conflict with C1 tables | Medium | High | Evolutionary migration only; no duplicate roots | `BLUEPRINT_1A_VERIFICATION.sql` | Drop new columns/tables only | Confirm dual-read strategy |
| `tenantId` required on versions pre-provision | High | High | Platform sentinel tenant OR nullable `tenantId` on versions | Insert dry-run in 1B staging | Column alter reversible pre-data | **Required** |
| Circular FK on current-version pointers | Medium | Medium | Defer FK or use application-level pointer updates | FK existence queries | Drop FK before column | Choose pointer model |
| JSON content size | Medium | Medium | Compress/archive policy; monitor row size | `pg_column_size` query | N/A | Set size alert threshold |
| Hash uniqueness false collision | Low | High | Use full hash + version unique constraint | Unit tests | N/A | Accept djb2 for preview parity |
| Concurrent version creation | Medium | Medium | Transaction + unique `(blueprintId, versionNumber)` | Concurrency test in 1B | N/A | Repository transaction scope |
| Stale client approval | High | High | Exact-version + hash binding in lifecycle service | Domain tests | N/A | Policy confirmed in 1A |
| Review-cycle supersession gaps | Medium | Medium | Close/supersede cycles on new version | Lifecycle tests | N/A | Use `BlueprintReviewCycle` |
| Audit duplication | Low | Low | Separate review action vs trace event payloads | Audit tests | N/A | Documented |
| Public Data API exposure | High | Critical | No grants to `anon`/`authenticated`; verify containment script | `cloud-data-api-containment:verify` | Revoke grants in rollback | **Required** confirmation |
| Rollback after real Blueprint data | Low | High | Document restricted rollback | Owner sign-off | Manual data migration | **Required** before prod apply |
| Legacy `blueprint-action-guard` vs PLATFORM_ADMIN | Medium | Medium | Align in 1B without IMPLEMENTER expansion | `ftgp-authority-boundaries:test` | Revert guard changes | 1B task |
| Prisma relation ambiguity (dual version pointers) | Medium | Medium | Clear naming in proposal schema | Prisma validate | N/A | Review proposal |

## Supabase AI advisory review

When used read-only: reviewed proposed SQL for transaction safety, index coverage, and FK naming. Cursor reconciled against live schema fingerprint `0355c17692e2a90d`. **No migration executed.**

## Stop conditions observed

- No migration applied
- No hosted mutations
- Migration count unchanged (23 applied)
