# Notification digest (Phase D+8 / D+9)

Read-only **advisory** summary for platform staff. Manual dry-run and optional email only — no cron, no automatic schedules, no billing enforcement.

## Commands

| Command | Effect |
|---------|--------|
| `npm run notifications:digest:dry` | Daily window (24h); print summary + full text to console; **no email**, **no inbox mutation** |
| `npm run notifications:digest:send` | Same digest; send via Resend when configured; log `advisory_digest` row |
| `npm run notifications:digest:weekly:dry` | 7-day window; console only |
| `npm run notifications:digest:weekly:send` | 7-day window; optional send |
| `npm run notifications:digest:meem:dry` | Weekly window, `tenant=meem-global` only (dry-run shortcut) |
| `npm run notifications:digest:high:dry` | Daily window, `severity=high` only (dry-run shortcut) |

All use `--env-file=.env.staging` (same as backfill / `meem:ids:staging`).

**No tenant-specific send shortcuts** — scoped digests are dry-run / manual send with explicit flags only.

### CLI filters (optional)

Pass after the npm script (via `npx tsx …` args in `package.json` or direct script invocation):

| Flag | Example | Effect |
|------|---------|--------|
| `--tenant=` | `--tenant=meem-global` | Metadata `tenantSlug` filter |
| `--severity=` | `--severity=high` | `high`, `medium`, or `low` |
| `--category=` | `--category=go-live` | `subscription`, `usage`, or `go-live` / `go_live` |
| `--from=` | `--from=2026-05-01` | Custom window start (ISO date) |
| `--to=` | `--to=2026-05-25` | Custom window end (end of day UTC-local parse) |
| `--days=` | `--days=7` | Rolling window ending now (overrides daily default when no `--from`/`--to`) |
| `--weekly` | (flag) | 7-day window when no `--days` / custom dates |

Examples:

```powershell
Set-Location D:\CYBERCROW
npm run notifications:digest:dry -- --tenant=meem-global --severity=high
npm run notifications:digest:weekly:dry -- --category=subscription
npx tsx --env-file=.env.staging scripts/send-notification-digest.ts --from=2026-05-01 --to=2026-05-25
npm run notifications:digest:meem:dry
```

### Pre-check (before first digest in an environment)

```powershell
Set-Location D:\CYBERCROW
npm run notifications:backfill:dry
```

If **Repairable > 0**, run `npm run notifications:backfill`, then dry again.

## What is included

**Advisory event types only** (see `DIGEST_ADVISORY_EVENT_TYPES` in `notification-digest-core.ts`):

- Subscription advisories from `subscription-notification.service.ts`
- Usage warnings (`tenant_near_plan_limit`, `tenant_over_recommended_limit`)
- Go-live signals (`blueprint_ready`, `tenant_provisioned`)

**Excluded:** routine pipeline email log (`request_received`, `discovery_started`).

**Status semantics:**

- **Open** = `logged`, `sent`, `skipped`, `failed` (delivery states not triaged)
- **Reviewed** / **Dismissed** counted separately in the digest totals

## Digest content

- Totals: advisories in period, open, reviewed, dismissed, high-priority open, tenants needing review
- Counts by category: subscription, usage, go-live, plan mismatch, missing subscription, enterprise capability
- Top tenants by open/high advisories
- Latest important open items with primary action links (`resolveNotificationActionLinks`)
- MEEM block via dynamic DB lookup by slug `meem-global` (no hardcoded live tenant/request/blueprint IDs)
- Staff action links: notification center, overview, MEEM inbox / plan / logistics audit

## Email / Resend

Recipient resolution (first match):

1. `PIPELINE_NOTIFY_EMAIL_OVERRIDE`
2. `PLATFORM_NOTIFY_EMAIL`
3. `PLATFORM_ADMIN_EMAIL`
4. `NOTIFICATION_TEST_EMAIL`

From address: `NOTIFICATION_FROM_EMAIL` (same as pipeline notifications).

If `RESEND_API_KEY` is missing: console message **"Resend not configured. Digest generated in dry/log-only mode."** and a `platform_notifications` row with `eventType=advisory_digest`, `status=skipped`.

Send mode never mutates advisory inbox rows — only appends a digest delivery log row.

## Admin UI

`/admin/notifications` includes a **Digest preview** section (read-only, no send button).

When URL query params match the inbox filters, the preview uses the same scope:

- `tenant`, `category`, `severity` → applied to daily + weekly digest generation
- `from` / `to` → single **Filtered digest** card for that date range (instead of fixed 24h / 7d cards)

Example: `/admin/notifications?tenant=meem-global&severity=high`

## Code map

| File | Role |
|------|------|
| `src/lib/services/notification-digest-core.ts` | Generate, format, CLI parse helpers (`parseDigestCliArgs`) |
| `src/lib/services/notification-digest.service.ts` | App wrapper using `@/lib/db` prisma |
| `scripts/send-notification-digest.ts` | CLI dry / send + filters |
| `src/components/admin/notification-digest-preview.tsx` | Admin preview cards |
| `platform-notification-links.ts` | Categories, severity, action links (reused) |

## Boundaries (explicit)

- No hard billing enforcement, tenant blocking, Stripe checkout, SCIM/Entra
- No public site redesign
- No notification spam (digest is manual; advisories remain 24h deduped on emit)
- No cron or scheduled digest jobs
- No hardcoded personal email addresses in code

## Recommended next phase

- Separate `deliveryStatus` vs `inboxStatus` if digest rows should not share the triage column with advisories
- Multi-category CLI (`--category` repeated) if operators need OR filters
- Cross-instance dedupe store if multi-instance advisory emit becomes an issue
