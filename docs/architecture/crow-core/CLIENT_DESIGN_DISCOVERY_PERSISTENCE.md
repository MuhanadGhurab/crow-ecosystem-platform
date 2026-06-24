# Client Design Discovery Persistence

> **Status:** CURRENT — CROW.DISCOVERY.2  
> **Audit result:** `EXISTING_DISCOVERY_PERSISTENCE_SUITABLE_WITH_SAFE_EXTENSION`

## Approach

No new Prisma models. Client enterprise design persists through existing `DiscoveryAnswer` rows:

| Section | Keys |
| ------- | ---- |
| `client_enterprise_design` | `v1.draft_snapshot`, `v1.design_status`, `v1.submitted_at`, `v1.snapshot_hash` |

Registered in `ftgp-discovery-question-catalog.ts`. Writes use `writeDiscoveryAnswerAudited` with:

- `provenance: client_owner`
- Request owner authority (`submittedByUserId`)
- Optimistic concurrency via `expectedProfileUpdatedAt`
- No full answer content in audit payloads

## Authority

- Only request owner may write `CLIENT_PROVIDED` design answers.
- PLATFORM_ADMIN and IMPLEMENTER cannot impersonate client answer source for this section.
- ProCrow review reads design snapshot; Model Forge handoff is read-only.

## States

`DRAFT` → `READY_FOR_REVIEW` (optional) → `SUBMITTED` within design snapshot.  
Does not auto-complete entire Discovery profile unless separate lifecycle rules apply.
