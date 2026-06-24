# Blueprint Review Lifecycle

> **Status:** PROPOSED — NOT APPLIED — OWNER REVIEW REQUIRED

## Lifecycle states (minimal set)

| State | Meaning |
| ----- | ------- |
| `DRAFT_INTERNAL` | Platform compiling / iterating |
| `READY_FOR_INTERNAL_REVIEW` | Submitted for internal review |
| `CHANGES_REQUESTED_INTERNAL` | Internal reviewer requested changes |
| `READY_TO_SHARE` | Approved internally for client share |
| `SHARED_WITH_CLIENT` | Exact version shared with request owner |
| `CLIENT_REVIEWING` | Client has opened review (comments) |
| `CLIENT_CHANGES_REQUESTED` | Client requested changes |
| `CLIENT_ACCEPTED` | Request owner accepted exact version |
| `PLATFORM_FINALIZED` | Platform recorded finalization — **no provisioning** |
| `SUPERSEDED` | Replaced by newer version root state |
| `WITHDRAWN` | Withdrawn from client review |

## Distinction: client accepted vs platform finalized

- **CLIENT_ACCEPTED** — request owner binding to `versionNumber` + `contentHash` + open review cycle
- **PLATFORM_FINALIZED** — platform operator records governance closure; does not activate tenant or authority

## Review cycle model

`BlueprintReviewCycle` binds to **one exact version**:

- `blueprintVersionId`, `versionNumber`, `cycleNumber`
- `audience`: `INTERNAL` | `CLIENT`
- States: `OPEN`, `CHANGES_REQUESTED`, `ACCEPTED`, `CLOSED`, `SUPERSEDED`

A new Blueprint version requires a **new review cycle** (or explicit supersession of prior cycle).

## Transition matrix (summary)

| From | Action | Actor | To |
| ---- | ------ | ----- | -- |
| DRAFT_INTERNAL | SUBMIT_FOR_INTERNAL_REVIEW | PLATFORM_ADMIN | READY_FOR_INTERNAL_REVIEW |
| READY_FOR_INTERNAL_REVIEW | REQUEST_INTERNAL_CHANGES | PLATFORM_ADMIN | CHANGES_REQUESTED_INTERNAL |
| READY_FOR_INTERNAL_REVIEW | MARK_READY_TO_SHARE | PLATFORM_ADMIN | READY_TO_SHARE |
| READY_TO_SHARE | SHARE_WITH_CLIENT | PLATFORM_ADMIN | SHARED_WITH_CLIENT |
| SHARED_WITH_CLIENT | CLIENT_ACCEPT | REQUEST_OWNER | CLIENT_ACCEPTED |
| SHARED_WITH_CLIENT | CLIENT_REQUEST_CHANGES | REQUEST_OWNER | CLIENT_CHANGES_REQUESTED |
| CLIENT_ACCEPTED | PLATFORM_FINALIZE | PLATFORM_ADMIN | PLATFORM_FINALIZED |

Full implementation: `src/lib/crow-core/blueprint-engine/lifecycle-service.ts`

## Rejected transitions

- Client action on unshared version → `BLUEPRINT_REVIEW_VERSION_MISMATCH`
- Action when newer version exists → `BLUEPRINT_VERSION_STALE`
- Hash mismatch → `BLUEPRINT_CONTENT_HASH_MISMATCH`
- Closed cycle → `BLUEPRINT_REVIEW_CYCLE_CLOSED`
- Finalize without client acceptance (when required) → `BLUEPRINT_INVALID_TRANSITION`

## Review actions

Recorded in `BlueprintReviewAction` (proposed) with:

- `actorPlatformAccountId` (never email)
- `contentHashAtAction`
- `action`, `reason`
