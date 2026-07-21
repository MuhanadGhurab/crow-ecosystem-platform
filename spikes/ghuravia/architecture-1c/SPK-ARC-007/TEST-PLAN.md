# SPK-ARC-007 — Test Plan

| # | Test | Expected |
|---|------|----------|
| 1 | Resumable chunk upload finalizes to quarantine | `status=QUARANTINED`, `reviewAccess=false`, SHA-256 hash |
| 2 | Reject disallowed media type | Throw `MEDIA_TYPE_REJECTED` |
| 3 | Reject wrong upload token | Throw `UNAUTHORIZED` |
| 4 | Admin list keys | No storage credentials in response |
| 5 | Review gate | `canReview=false` until `scanStatus=SCAN_PASSED` and grant |

**Environment:** Local temp directory. Synthetic bytes only.
