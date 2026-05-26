# CyberCrow operational completion (Phase F4 + F5)

Last updated: 2026-05-25

## Scope

Tenant console under `/{tenant}/cybercrow/*`, identity telemetry surfaces, incident and security-event workflows (non-destructive), and platform admin surfaces. **No Prisma schema changes** in F4/F5 — incident status uses existing `Incident.status`; security event review state lives in `SecurityEvent.payload` JSON.

## Phase F5 (MEEM validation)

- Validated MEEM CyberCrow routes: dashboard, incidents, security-events, identity, sessions
- Confirmed F4 workflows unchanged: no incident delete, escalate-once, honest empty states
- Cross-linked SAREA analyst/tenant_admin materialization for MEEM (`F5_CYBERCROW_SAREA_VALIDATION.md`)
- TwinEngine / connection copy unchanged; RBAC still source of access

## Route status

| Route | Data source | Mode |
| --- | --- | --- |
| `/[tenant]/cybercrow/dashboard` | Metrics, identity telemetry summary, audit samples | DB-backed |
| `/[tenant]/cybercrow/identity` | Discovery MFA/IdP + `LoginEvent`, `AccessAttempt`, `DeviceTrustRecord` | DB-backed when writers exist; honest empty states |
| `/[tenant]/cybercrow/sessions` | `SessionEvent`, session-related audit, telemetry summary | DB-backed when present |
| `/[tenant]/cybercrow/incidents` | `listTenantIncidents` + status actions | DB-backed; `cybercrow.incidents.manage` for mutations |
| `/[tenant]/cybercrow/security-events` | `listTenantSecurityEvents` + review actions | DB-backed; review/dismiss/escalate via payload |
| `/[tenant]/cybercrow/audit-logs` | `listTenantAuditLogs` | DB-backed |
| `/[tenant]/cybercrow/risk` | Risk scores + metrics | DB-backed |
| `/[tenant]/cybercrow/compliance` | Compliance controls | DB-backed, NCA ECC advisory |
| `/[tenant]/cybercrow/evidence` | Evidence + GRC | DB-backed |
| `/[tenant]/cybercrow/grc` | GRC summary | DB-backed |

## Identity telemetry (F4)

- Service: `getCybercrowIdentityTelemetrySummary`, list helpers in `cybercrow-identity-telemetry.service.ts`
- UI: `IdentityTelemetrySummary` on identity, sessions, dashboard
- Wording: identity posture, session trust, access signals — **not** live Entra sync, SIEM, or AI analysis
- Suspicious indicators derived from stored rows only (failed access, untrusted devices, etc.)

## Incident workflow (F4)

- Statuses: `open`, `under_review`, `resolved`, `reopened` (`cybercrow-incident-status.ts`)
- Server action: `updateIncidentStatusAction` → `CybercrowAuditLog` (`INCIDENT_STATUS_CHANGED`)
- Permission: `cybercrow.incidents.manage` (auditor read-only excluded)
- **No incident deletion**

## Security event review (F4)

- Review fields in event `payload`: `reviewStatus`, `reviewedAt`, `escalatedIncidentId`, etc.
- Actions: mark reviewed, dismiss (informational/low severity only), escalate to new incident (one-time)
- Audit: `SECURITY_EVENT_REVIEWED`, `SECURITY_EVENT_DISMISSED`, `SECURITY_EVENT_ESCALATED`
- **No destructive deletes**

## Cleanup (F4)

- Removed unused `cybercrow-mock-console.tsx` (zero imports)
- `MOCK_CYBERCROW_DASHBOARD` and public preview mock paths **retained** where still referenced

## MEEM lighthouse

- `npm run meem:ids:staging` → dynamic tenant/request/blueprint IDs
- `/meem-global/cybercrow/dashboard` with TwinEngineStrip + connection copy

## Connection copy (SAREA / CEM)

- `CybercrowConnectionPanel` — analyst vs tenant admin vs executive/manager roles
- `TwinEngineStrip` on MEEM CyberCrow dashboard and tenant dashboard

## Explicit non-goals (F4)

- No Stripe / billing gates / SCIM / Entra group sync
- No fake identity telemetry or AI security analysis
- No public website redesign or new ERP modules
- No complex SOC assignment or destructive incident deletion

## Future work

- Auth pipeline writers for `LoginEvent` / `SessionEvent` at sign-in
- Live session inventory from IdP (when integrated)
- External ticketing sync for incidents
- Server-side severity/metadata filters on audit logs
