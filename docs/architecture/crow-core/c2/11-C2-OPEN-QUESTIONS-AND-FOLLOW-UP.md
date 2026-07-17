# C2 — Open questions and follow-up

## Open

1. **Partial unique race windows** — DB partial indexes + service checks; monitor for rare duplicate draft under extreme concurrency.
2. **Legacy tenant backfill** — Records without `tenantId` need operator classification before `--apply`.
3. **Studio ROI/SOW persist-on-action** — Repositories exist; full UI action wiring may continue in C2.1 if smoke gaps remain.
4. **Configuration proposal workflow** — `BlueprintConfigurationProposal` model present; full operator UI deferred.
5. **Hosted migration timing** — Product owner sets Preview window after PR #6 review.

## Follow-up (post-C2)

- C2.1: Complete approval/review/ROI/SOW Studio actions against persisted stores
- Preview migration + monitored backfill
- Deprecation plan for legacy-only fields (no drops until usage = 0)
