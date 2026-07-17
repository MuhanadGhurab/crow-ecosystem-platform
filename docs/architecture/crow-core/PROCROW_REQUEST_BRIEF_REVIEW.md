# ProCrow Request Brief Review (CROW.REQUEST.2)

## Route

`/admin/requests/{requestId}` — `AdminRequestBriefPanel` when modern brief present in notes.

## Display sections

| Section | Source label |
|---------|--------------|
| Client field, purpose, team, growth, mode, goal | Client provided |
| Preliminary capabilities / summary | Crow preliminary recommendation |
| Custom field description | Immutable client statement |

## Actions (existing admin surfaces)

- Review Request Brief
- Open Discovery / client enterprise design when present
- Open Model Forge session
- Resolve custom field internally (preserve original client wording + reviewer provenance — panel shows immutable statement today)

## Access

`PLATFORM_ADMIN` via existing ProCrow request review policy. Unrelated clients denied via `clientCanAccessRequestAuthoritative`.
