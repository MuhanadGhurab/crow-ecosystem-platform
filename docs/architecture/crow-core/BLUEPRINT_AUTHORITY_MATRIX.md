# Blueprint Authority Matrix

> **Status:** PROPOSED — NOT APPLIED — OWNER REVIEW REQUIRED

## Authoritative sources

| Concern | Source |
| ------- | ------ |
| Identity authentication | Auth provider (Supabase) |
| Internal account | `PlatformAccount` |
| PLATFORM_ADMIN / IMPLEMENTER | `PlatformInternalRoleAssignment` |
| Request ownership | `ImplementationRequest.submittedByUserId` → `PlatformAccount` |
| Tenant access | Tenant membership tables |
| **Non-authoritative** | `crow_role` metadata, email-only match |

No `CLIENT` platform role is introduced.

## Actor classes

Implementation: `src/lib/crow-core/blueprint-engine/authority-matrix.ts`

| Actor | Blueprint persistence (BLUEPRINT.1) |
| ----- | ----------------------------------- |
| PLATFORM_ADMIN | Full lifecycle except client-only actions |
| IMPLEMENTER | **DENIED** (explicit policy) |
| REQUEST_OWNER | Client review actions on shared exact version only |
| TENANT_MEMBER (no ownership) | DENIED |
| UNRELATED_CLIENT | DENIED |
| Metadata-only admin claim | DENIED (treated as UNRELATED_CLIENT) |
| Email-only match | DENIED |

## PLATFORM_ADMIN may

- Compile validated preview → create immutable version
- Internal review transitions
- Share exact version with client
- Platform-finalize accepted version
- Withdraw / supersede per policy
- View full provenance and internal notes

## REQUEST_OWNER may

- View shared exact version (client projection)
- Comment, request changes, accept exact version
- **May not:** edit content, finalize, create versions, view internal notes

## Client decision binding

Must match:

- `blueprintId`
- `versionNumber`
- `contentHash`
- open `reviewCycleId`
- current `submittedByUserId` ownership

Reject on: stale version, closed cycle, ownership change, hash mismatch.

## Legacy note

Existing `blueprint-action-guard.ts` uses permission-based staff checks. BLUEPRINT.1B must align guards with `PlatformInternalRoleAssignment` PLATFORM_ADMIN policy without expanding IMPLEMENTER silently.
