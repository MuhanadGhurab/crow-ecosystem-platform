# CyberCrow operational completion (Phase F3)

Last updated: 2026-05-25

## Scope

Tenant console under `/{tenant}/cybercrow/*` and platform admin surfaces (`/admin/overview`, `/admin/audit`, tenant control room **CyberCrow** tab). No schema changes in this phase.

## Route status

| Route | Data source | Mode |
| --- | --- | --- |
| `/[tenant]/cybercrow/dashboard` | `getCybercrowDashboardMetrics`, `safeWorkspaceSummary`, audit samples | DB-backed |
| `/[tenant]/cybercrow/audit-logs` | `listTenantAuditLogs` (+ logistics category filter) | DB-backed |
| `/[tenant]/cybercrow/security-events` | `listTenantSecurityEvents` | DB-backed, read-only (status: recorded) |
| `/[tenant]/cybercrow/risk` | `listTenantRiskScores`, live metrics contributors | DB-backed, transparent scoring |
| `/[tenant]/cybercrow/incidents` | `listTenantIncidents` | DB-backed, read-only status changes |
| `/[tenant]/cybercrow/compliance` | `listTenantComplianceControls` | DB-backed, NCA ECC advisory |
| `/[tenant]/cybercrow/evidence` | `listTenantComplianceEvidence`, GRC summary | DB-backed |
| `/[tenant]/cybercrow/identity` | Discovery-backed security settings | Advisory / discovery |
| `/[tenant]/cybercrow/sessions` | MFA/IdP settings + session-related audit filter | Telemetry via audit; no live session inventory |
| `/[tenant]/cybercrow/grc` | GRC summary, controls, findings | DB-backed, advisory |

## MEEM lighthouse (`meem-global`)

- Tenant slug constant: `MEEM_TENANT_SLUG` in `src/lib/constants/meem.ts`
- Resolve live IDs: `npm run meem:ids:staging` → `scripts/print-meem-ids.mjs`
- Dashboard: `/meem-global/cybercrow/dashboard` (TwinEngineStrip + logistics audit when module enabled)
- Admin tenant tab: `/admin/tenants/{tenantId}?tab=cybercrow` (use ID from meem:ids script, not hardcoded)

## Connection copy (SAREA / CEM)

- `CybercrowConnectionPanel` on CyberCrow dashboard and tenant dashboard
- `TwinEngineStrip` on MEEM CyberCrow dashboard and tenant dashboard (SAREA variant)
- Admin tenant **cybercrow** tab one-liner linking protect vs adapt

## Explicit non-goals (this phase)

- No Stripe / payment gates / capability blocking
- No SCIM / Entra session sync
- No fake AI risk narratives or automated incident resolution
- No full NCA certification claims

## Future work

- Live session inventory (Entra / Supabase session events)
- Security event resolution workflows and playbooks
- Incident status mutations with external ticketing
- Severity filter on audit logs (server-side metadata index)
