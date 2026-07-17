# Blueprint Audit Model

> **Status:** PROPOSED — NOT APPLIED — OWNER REVIEW REQUIRED

## Recommendation

**Extend `BlueprintTraceEvent`** — dedicated append-only Blueprint audit table already exists. Do **not** force events into `PlatformAccountAuditEvent`.

| Store | Use |
| ----- | --- |
| `BlueprintReviewAction` | Human review decisions with reason/comment |
| `BlueprintTraceEvent` | Immutable lifecycle evidence |
| `BlueprintApproval` | Legacy approval records — map or migrate in 1B |

## Event types (proposed `action` values)

- `BLUEPRINT_CREATED`
- `BLUEPRINT_VERSION_CREATED`
- `BLUEPRINT_INTERNAL_REVIEW_OPENED`
- `BLUEPRINT_INTERNAL_CHANGES_REQUESTED`
- `BLUEPRINT_MARKED_READY_TO_SHARE`
- `BLUEPRINT_SHARED_WITH_CLIENT`
- `BLUEPRINT_CLIENT_COMMENTED`
- `BLUEPRINT_CLIENT_CHANGES_REQUESTED`
- `BLUEPRINT_CLIENT_ACCEPTED`
- `BLUEPRINT_PLATFORM_FINALIZED`
- `BLUEPRINT_VERSION_SUPERSEDED`
- `BLUEPRINT_WITHDRAWN`
- `BLUEPRINT_ACCESS_DENIED`

## Safe payload rules

**May include:** version number, content-hash prefix, state transition, review-cycle number, reason code, actor authority class.

**Must not include:** full emails, Auth IDs, tokens, complete Blueprint snapshot, sensitive operator notes.

## Duplication policy

Review actions capture **who decided what** on an exact version. Trace events capture **lifecycle evidence** for compliance. Overlap is acceptable when payloads differ (action detail vs transition fingerprint).

Domain contract: `BlueprintAuditRepository` in `repository-contracts.ts`.
