# Phase 6 — Operations & platform hygiene

**Status:** Done (May 2026)

Phase 6 hardens production operations and completes platform shells while closing Phase 5 gaps (CRM inline edit).

---

## Delivered

### P0 — Migrations & notifications

| Item | Details |
|------|---------|
| **Migrations** | `prisma/migrations/20260519120000_phase5_hr_crm_phase6_notifications/` — HR, CRM, `platform_notifications` |
| **`PlatformNotification` model** | Logs every pipeline email (sent / skipped / failed) |
| **`notification.service.ts`** | Templates for 4 pipeline events; sends via [Resend](https://resend.com) when `RESEND_API_KEY` set |
| **Hooks** | Request created, discovery started, blueprint ready, tenant provisioned |
| **Scripts** | `npm run db:migrate:deploy`, `cybercrow:backfill-seed` |

**Env:** `RESEND_API_KEY`, `NOTIFICATION_FROM_EMAIL`, `PLATFORM_NOTIFY_EMAIL`, `NEXT_PUBLIC_SITE_URL` — see `.env.example`.

### P1 — Admin & discovery shells

| Route | Live data |
|-------|-----------|
| `/admin/domains` | `PLATFORM_ENGINES` catalog |
| `/admin/audit` | CyberCrow audit log + notification log |
| `/admin/integrations` | `integration_connections` |
| `/admin/subscriptions` | Plans + tenant subscriptions |
| `/admin/security-baselines` | Security package catalog |
| `/discovery/[id]/identity` | IdP / MFA answers |
| `/discovery/[id]/integrations` | CRUD integrations |
| `/discovery/[id]/experience` | SAREA persona requirements |

### P2 — CyberCrow & CEM

| Route | Live data |
|-------|-----------|
| `/[tenant]/branches` | Discovery-seeded branches |
| `/[tenant]/cybercrow/incidents` | Tenant incidents |
| `/[tenant]/cybercrow/risk` | Risk scores |
| `/[tenant]/cybercrow/compliance` | Compliance controls |
| `/[tenant]/cybercrow/grc` | GRC findings |
| `/[tenant]/cybercrow/audit-logs` | Tenant audit log |

**CyberCrow seed** on go-live: risk score, incident, compliance controls, GRC finding.

### Phase 5 completion

- **`/[tenant]/crm`** — inline edit for accounts and contacts

---

## Apply schema

```powershell
npx prisma db push
# or production:
npm run db:migrate:deploy
npm run db:seed
```

Backfill CyberCrow for existing tenants:

```powershell
npm run cybercrow:backfill-seed
```

---

## Verify

```powershell
npm run typecheck
npm run build
```

1. Submit `/request` → check `/admin/audit` for `request_received` notification (status `skipped` without Resend key is OK)
2. Start discovery → notification `discovery_started`
3. Complete discovery → `blueprint_ready`
4. Go-live → `tenant_provisioned` + CyberCrow pages show data
5. `/discovery/[id]/identity` → save preferences
6. `/admin/domains`, `/subscriptions`

---

## Next (Phase 7)

See [`ROADMAP.md`](ROADMAP.md): SAREA runtime, CyberCrow enforcement, billing, SSO, CI/CD.
