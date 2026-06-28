# Certification Loading & Error Matrix (CROW.CERT.1)

**Status:** PASS

## Loading (`MISSING_REQUIRED_LOADING_STATE_COUNT=0`)

All required routes have route-level or inherited `loading.tsx` using `ClientRouteLoading` with `role="status"` and `aria-live="polite"`.

Added in CERT.1: `(public)/loading`, `onboarding/legal/loading`, `register/legal/loading`, `admin/loading`, `admin/tenant-studio/loading`, `client/requests/[requestId]/blueprint/loading`.

## Pending states

`PendingButton`, sign-in pending, wizard submit labels — verified by `client-loading-feedback:test`.

## Error handling

| Scenario | Safe action |
|----------|-------------|
| Auth / OAuth failure | Retry, Back to Home |
| Verification failure | Resend, Go Back |
| Agreement failure | Retry, exit |
| Request draft corruption | Discard draft, restart |
| Request denied | View My Requests, Home |
| Catalog failure | Retry search, custom field path |
| Network / server error | Retry, Home (no stack traces) |

`UNHANDLED_CLIENT_ERROR_STATE_COUNT=0` · `RAW_INTERNAL_ERROR_EXPOSURE_COUNT=0`
