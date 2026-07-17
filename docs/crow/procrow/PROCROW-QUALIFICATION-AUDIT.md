# ProCrow Qualification Audit

| Field | Value |
|-------|-------|
| **Title** | ProCrow qualification outcome — current-state audit |
| **Status** | CANONICAL audit — CROW.PROCROW.1 |
| **Date** | 2026-07-18 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Issue** | [#19](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/19) |
| **Milestone** | [`milestones/CROW-PROCROW-1.md`](../milestones/CROW-PROCROW-1.md) |

## Scope inspected

| Surface | Path / module |
|---------|----------------|
| Admin requests list | `/admin/requests` |
| Admin request workspace | `/admin/requests/[requestId]` |
| Operator queue | `/admin/queue` · `procrow-operator-queue.service.ts` |
| Pipeline actions | `RequestAdminActions` · `admin-pipeline.ts` |
| Brief / field review | `AdminRequestBriefPanel` · `admin-request-brief.ts` |
| Status mapping | `request-status-product-mapping.ts` |
| Auth | `admin/layout.tsx` → `requirePlatformConsole` |

## Findings (pre → post CROW.PROCROW.1)

| Area | Before | After |
|------|--------|-------|
| Product outcomes | Labels only (REQUEST.2) | Outcomes persisted in brief `procrowQualification` |
| Discovery start | Any `PENDING_REVIEW` | Requires `qualified_for_discovery` (UI + server) |
| Decline | Could overwrite brief notes with raw reason | Merges decline into brief JSON; preserves record |
| Queue language | Submitted / needs review | Qualification-oriented titles + product labels |
| Authority | Submit path certified | Qualification path certified (static tests) |

## Product outcomes (no DB enum migration)

| Outcome | Persistence | DB status effect |
|---------|-------------|------------------|
| `needs_qualification_review` | Brief JSON | Remains `PENDING_REVIEW` |
| `needs_more_information` | Brief JSON | Remains `PENDING_REVIEW` |
| `qualified_for_discovery` | Brief JSON | Remains `PENDING_REVIEW` until Discovery start |
| `declined` | Brief JSON | Sets `REJECTED` (record retained) |
| Converted to Discovery | Derived | `UNDER_DISCOVERY` after controlled start |

## Authority boundaries verified

- Qualification does **not** create tenant membership, platform internal role, tenant, Blueprint, or payment
- Decline does **not** delete the request
- More-info does **not** grant authority
- Discovery does **not** auto-start from submission
- Admin routes remain `requirePlatformConsole`-gated

## Gaps remaining

| Item | Status |
|------|--------|
| GAP-004 Preview/Production DB isolation | Open / blocked |
| GAP-015 Production auto-deploy policy | Open |
| Hosted Preview certification of qualification UX | Deferred |
| Full product status as Prisma enum | Not preferred — product-layer mapping retained |
| Closed / needs_more_information client messaging | Later Client Portal polish |

## Non-claims

This audit does not claim owner acceptance, Production readiness, or Discovery MVP completion.
