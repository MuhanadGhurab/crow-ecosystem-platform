# Advisory operations (Phase E)

Platform notifications are **advisory visibility only** — they inform platform staff about subscription posture, usage bands, go-live milestones, and pipeline email delivery. They do **not** enforce billing, block tenants, trigger Stripe checkout, or gate features.

## Data model

Table: `platform_notifications` (Prisma `PlatformNotification`)

| Field | Role |
|-------|------|
| `eventType` | Machine key (see below) |
| `subject` / `body` | Email or inbox copy |
| `deliveryStatus` | Email / pipeline: `logged` \| `sent` \| `skipped` \| `failed` |
| `inboxStatus` | Admin triage: `open` \| `reviewed` \| `dismissed` |
| `severity` | Stored `high` \| `medium` \| `low` (set at write; filter prefers stored, else computed) |
| `dedupeKey` | Optional unique `tenantId:eventType:YYYY-MM-DD` for cross-instance dedupe |
| `status` | **Legacy** — mirrors inbox triage or delivery for old readers; new code uses split fields |
| `updatedAt` | Touched on review/dismiss (`@updatedAt`) |
| `metadata` | JSON — tenant/blueprint/request links |
| `recipientEmail` | Pipeline email target; advisories use `platform-advisory@internal.crow` |

Migration: `20260525120000_phase_e_notification_stabilization` backfills split fields and severity from legacy `status` + event rules.

## Categories and event types

Mapped in `platform-notification.service.ts` → `categorizeNotificationEvent()`.

| Category | Event types | Emitter |
|----------|-------------|---------|
| `subscription` | `subscription_missing`, `plan_mismatch_detected`, `enterprise_capability_detected`, `upgrade_recommended` | `subscription-notification.service` |
| `usage` | `tenant_near_plan_limit`, `tenant_over_recommended_limit` | `subscription-notification.service` |
| `go_live` | `blueprint_ready`, `tenant_provisioned` | `notification.service` (pipeline) |
| `pipeline` | `request_received`, `discovery_started` | `notification.service` |

## Severity

Stored on `severity` at emit time (`subscription-notification.service`, `notification.service`, digest log). Inbox UI and filters use stored value when present; otherwise `severityForNotification()` from `deliveryStatus` + `eventType` + metadata.

| Level | Typical triggers |
|-------|------------------|
| `high` | `deliveryStatus=failed`, `subscription_missing`, `plan_mismatch_detected`, `tenant_over_recommended_limit` |
| `medium` | `upgrade_recommended`, `enterprise_capability_detected`, `tenant_near_plan_limit`, `metadata.advisory` |
| `low` | Routine pipeline email log |

## Status semantics (split)

**Delivery** (`deliveryStatus`): `logged` → `sent` \| `skipped` \| `failed` — pipeline / Resend only.

**Inbox** (`inboxStatus`): `open` (default) → `reviewed` \| `dismissed` via `platform-notifications` server actions (updates `updatedAt`).

Filter **open** = `inboxStatus=open` (any delivery state). Filter `sent` / `failed` etc. = `deliveryStatus`. Filter `reviewed` / `dismissed` = `inboxStatus`.

**Digest rows** (`advisory_digest`): use `deliveryStatus` for send outcome; `inboxStatus` stays `open` — digest logs do not use reviewed/dismissed inbox semantics.

## Metadata shape

Emitters should populate:

```json
{
  "tenantId": "cuid",
  "tenantSlug": "meem-global",
  "displayName": "MEEM Holding Logistics",
  "blueprintId": "cuid",
  "requestId": "cuid",
  "referenceCode": "CROW-2026-MEEM",
  "advisory": true,
  "planKey": "enterprise",
  "dedupeWindowHours": 24
}
```

UI links: `resolveNotificationActionLinks()` in `platform-notification.service.ts`.

| Advisory type | Primary link |
|---------------|--------------|
| Subscription / usage | `/admin/tenants/[tenantId]?tab=plan` |
| Go-live | `/blueprints/[id]/go-live` |
| Blueprint ready | `/blueprints/[id]/overview` |
| Tenant audit | `/admin/audit?tenant=[slug]` |
| MEEM logistics | `/admin/audit?category=logistics&tenant=meem-global` |
| Request pipeline | `/admin/requests/[requestId]` |

Tenant self-serve plan (demo): `/[tenantSlug]/settings/plan` — not used in admin inbox rows.

## Subscription advisories

**Evaluate on load (deduped):**

1. **Admin overview** — `emitSubscriptionAdvisoriesFromPlatformSummary()` once per overview render when subscription summary is available.
2. **Tenant plan tab** — `evaluateTenantSubscriptionAdvisories()` when `/admin/tenants/[id]?tab=plan` loads.

**Dedupe:** 24 hours per `tenantId` + `eventType`, enforced via unique `dedupeKey` (`tenantId:eventType:YYYY-MM-DD`) with metadata+time fallback for legacy rows. Applies regardless of `inboxStatus`, so triage does not cause immediate re-emit on the next page load. After 24h (new date bucket), a new advisory may be logged if conditions still apply.

**CyberCrow audit:** Optional `SUBSCRIPTION_ADVISORY` row in `cybercrow_audit_log` (best-effort, non-blocking).

## Pipeline notifications

`notifyPipelineEvent()` in `notification.service.ts` logs every event and sends via Resend when `RESEND_API_KEY` is set. Pipeline emit sites must pass `requestId`, `blueprintId`, and tenant fields when known (`pipeline.service.ts`, `implementation-request.service.ts`).

## Admin surfaces

| Route | Purpose |
|-------|---------|
| `/admin/notifications` | Full inbox, filters (category, severity, status, tenant, date range) |
| `/admin/overview` | Summary strip + latest rows |
| `/admin/tenants/[id]?tab=plan` | Tenant advisories panel |

## What is NOT enforced

- No Stripe checkout or payment gates from notifications
- No tenant suspension or module lockout from advisory status
- No SCIM/Entra or public site changes from this phase
- No workflow approval chains beyond Mark reviewed / Dismiss
- `skipped` / `failed` email status does not change tenant access

## MEEM demo (staging)

| Item | Value |
|------|-------|
| Tenant slug | `meem-global` |
| Staging tenant id | `cmpi2w8os0020vhqsm33i0gk1` (verify with `npm run meem:ids:staging`) |
| Inbox filter | `/admin/notifications?tenant=meem-global` |
| Plan tab | `/admin/tenants/cmpi2w8os0020vhqsm33i0gk1?tab=plan` |
| Tenant plan settings | `/meem-global/settings/plan` |

Resolve live IDs: `resolveMeemLiveIds()` in `src/lib/mock/meem-global.ts` — returns `source: live` or `unavailable` with **null** IDs (never stale hardcoded CUIDs). Offline mock IDs (`MEEM_MOCK_ONLY_FALLBACK_*`) are for demo cards only. Staff UI shows a clear message when unavailable; run `npm run meem:ids:staging`.

## Code map

| File | Responsibility |
|------|----------------|
| `platform-notification.service.ts` | Inbox queries, severity, links, triage update |
| `subscription-notification.service.ts` | Advisory emit + dedupe |
| `notification.service.ts` | Pipeline email + log |
| `notification-inbox-row.tsx` | Row UI + action links |
| `platform-notifications.ts` | Review / dismiss actions |

## Metadata backfill (Phase D+7)

Historical pipeline rows may lack `tenantId`, `tenantSlug`, `blueprintId`, or `displayName` in `metadata`. Before digest emails or stricter inbox filters, run the idempotent backfill against staging (then production when approved).

| Command | Effect |
|---------|--------|
| `npm run notifications:backfill:dry` | Scan all rows; report missing/repairable/unrepairable; sample before/after; link reliability + MEEM validation — **no writes** |
| `npm run notifications:backfill` | Apply repairs to rows where DB lookups can fill **blank** fields only — safe to re-run |

Both use `--env-file=.env.staging` (same as `meem:ids:staging`, `db:test`).

### What the script repairs

- `tenantSlug` from `tenantId` (and reverse) via `Tenant`
- `displayName` from tenant organization, `organizationName`, or request org name
- `requestId` from `referenceCode` or blueprint reverse lookup
- `blueprintId` from `requestId` or tenant `blueprintId`
- `tenantId` / `tenantSlug` from blueprint → tenant when provisioned
- MEEM hints (`organizationName` / `meem-global`) via **dynamic** `resolveMeemLiveIds()` — never hardcoded live IDs in the script

### What it does not repair

- Rows with no resolvable tenant, request, or blueprint in Postgres (reported as **unrepairable**)
- Invalid or stale IDs that do not match any row (not overwritten)
- `deliveryStatus`, `inboxStatus`, `severity`, `dedupeKey`, email delivery, or billing — metadata JSON only (Phase E fields backfilled in same script when `--apply`)

### Link reliability report (dry-run and apply)

After scan, output includes counts aligned with `resolveNotificationActionLinks()`:

- **Valid tenant** — `tenantId` present and tenant plan tab link
- **Valid blueprint** — `blueprintId` present and blueprint / go-live link
- **Valid request** — `requestId` present and admin request link
- **Audit-only** — links fall back to `/admin/audit?tenant=…` (or slug-only plan fallback) with no primary entity link
- **None** — no actionable admin destination

Run dry-run first; compare MEEM block (`meem-global` slug) with `npm run meem:ids:staging`.

### When to use

1. After importing legacy notification data or before enabling notification digests
2. When inbox MEEM / pipeline filters show sparse rows
3. After staging DB reset — re-run dry-run, then apply once IDs exist in Postgres

## Known risks

- Legacy pipeline rows may lack `tenantId` / `blueprintId` in metadata — run backfill dry-run; links otherwise fall back to audit-by-slug or request only.
- Staging may have zero advisory rows until overview or plan tab is opened once.
- Severity filter still fetches extra rows then filters in memory when many rows lack stored `severity` (run backfill apply after migration).
- `dedupeKey` unique constraint: duplicate emit same day same tenant+event fails insert — intentional; check logs if emit returns false unexpectedly.
- Legacy `status` column retained for compatibility — prefer `deliveryStatus` + `inboxStatus` in new code.

## Notification digest (Phase D+8 / D+9)

Manual read-only summary and optional email. See **`docs/internal/NOTIFICATION_DIGEST.md`** for full runbook.

| Command | Effect |
|---------|--------|
| `npm run notifications:digest:dry` | Daily advisory digest to console (no email, no inbox mutation) |
| `npm run notifications:digest:send` | Optional Resend send + `advisory_digest` log row |
| `npm run notifications:digest:weekly:dry` | 7-day window, console only |
| `npm run notifications:digest:meem:dry` | Weekly MEEM-scoped dry-run (`--tenant=meem-global`) |
| `npm run notifications:digest:high:dry` | Daily high-severity dry-run |

**CLI filters:** `--tenant=`, `--severity=`, `--category=`, `--from=`, `--to=`, `--days=`, `--weekly`. No scheduling — run manually in PowerShell:

```powershell
Set-Location D:\CYBERCROW
npm run notifications:digest:meem:dry
npm run notifications:digest:dry -- --tenant=meem-global --category=usage
```

Admin preview: `/admin/notifications` → **Digest preview** respects URL `tenant`, `category`, `severity`, and `from`/`to` (read-only, no send button).

Run `notifications:backfill:dry` first when link metadata may be sparse.

## Recommended next phase

- Drop legacy `status` column after all external readers migrate
- Index `severity` + `metadata` tenant paths if inbox volume grows
- Optional Redis `lastEmittedAt` for sub-day dedupe tuning (date bucket is day-level today)
- Digest inbox filter preset to hide `advisory_digest` from default open triage view
