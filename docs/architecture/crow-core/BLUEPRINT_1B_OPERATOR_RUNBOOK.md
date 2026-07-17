# BLUEPRINT.1B Operator Runbook

> Certification manual acceptance — Cursor does not execute OAuth or create business Blueprint rows.

## Prerequisites

1. Deploy latest `feat/first-tenant-golden-path` commit to `crow-ftgp-certification`
2. Add Supabase redirect URLs for protected host:
   - `https://<host>/auth/callback`
   - `https://<host>/auth/resolving`

## URLs

| Route | Purpose |
| ----- | ------- |
| `/login` | Sign in |
| `/admin/blueprint-studio` | Compile ephemeral preview; **Save as Internal Draft** |
| `/admin/blueprints` | Persistent Blueprint list |
| `/admin/blueprints/[blueprintId]` | Lifecycle detail |
| `/client/requests/<requestId>/blueprint` | Client-safe projection (after share) |

## Manual flow

1. Sign in as ProCrow Platform Admin
2. Open Blueprint Studio — compile preview
3. Select Candidate 07 request **explicitly** (do not auto-select)
4. Confirm: INTERNAL visibility, NONE side effects, content hash
5. Save as Internal Draft
6. Internal review → ready to share → share exact version
7. Sign in as request owner — client Blueprint route
8. Comment / request changes / accept exact version
9. Return as admin — platform finalize
10. Confirm: no tenant provisioned, IMPLEMENTER denied, stale version rejected after v2

## Authority

- Internal lifecycle: **PLATFORM_ADMIN** only (`PlatformInternalRoleAssignment`)
- Client review: **request owner** via `submittedByUserId`
- IMPLEMENTER: denied for Blueprint persistence
