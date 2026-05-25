# F15 — CyberCrow SOC workflow depth

**Date:** 25 May 2026  
**Status:** Acceptance gate (see validation section)

## Goal

Deepen the operational SOC/GRC chain without fake AI, SIEM claims, schema churn, or destructive workflows:

**Security event → review → escalate → incident → status → evidence → audit trail → risk posture → recommended action**

## Part 1 — SOC audit (findings)

| Surface | DB-backed | Advisory / read-only | Mutations |
|--------|-----------|----------------------|-----------|
| Dashboard | Counts, risk, compliance % | Twin-engine copy (MEEM), philosophy banner | None |
| Security events | `SecurityEvent` rows | Recommended actions (copy) | Review, dismiss (info/low), escalate |
| Incidents | `Incident` rows | Owner assignment (not in schema) | Status transitions only |
| Audit logs | `CybercrowAuditLog` | Full SIEM | None (append-only via actions) |
| Risk | Derived score + stored `RiskScore` rows | Not predictive / not AI | None |
| Evidence | `ComplianceEvidence` + controls | Upload vault | None |
| Identity / sessions | Login/session/access events when recorded | Not live Entra inventory | None |
| GRC | Controls, findings | Auto-remediation | Finding status where permitted |

**Review state** lives in `SecurityEvent.payload` JSON (`reviewStatus`, timestamps, `escalatedIncidentId`) — not separate columns.

**Escalation** sets `escalatedIncidentId` and blocks duplicate escalation server-side.

**Incident model** has no owner field — UI states assignment workflow is not enabled.

**Evidence** is a read-only catalog linked to compliance controls; no file upload in this phase.

**Risk score** is rule-based in `cybercrow-dashboard.service.ts` (baseline 85, −12 per open/reopened incident, −4 per medium+ event capped at −24, compliance average blended).

**Notifications:** Incident/status and event actions already write audit logs. Dedicated high-risk push notifications are **future work** (no digest or email changes in F15).

## Part 2 — Security event → incident chain

- Enriched list via `listSecurityEventsEnriched()` in `cybercrow-soc-workflow.service.ts`
- Filters: `?review=pending|reviewed|dismissed|escalated`
- UI shows review state, linked incident title, recommended action, escalation link
- Duplicate escalation prevented in `escalateSecurityEventToIncident` (existing + surfaced in UI)
- Dismissed events remain visible unless filtered

## Part 3 — Incident workflow depth

- `IncidentWorkflowPanel`: status timeline from `INCIDENT_STATUS_CHANGED` audit entries, linked security event, related audit count, evidence hints, recommended action
- Status actions: open → under_review → resolved → reopened (existing server actions)
- No destructive delete; no case-management assignment

## Part 4 — Evidence readiness

- `getEvidenceReadiness()`: gaps (controls without evidence), guidance list, open incident hints
- Evidence page explains advisory/readiness posture
- No schema change; no upload workflow

## Part 5 — Risk posture

- `getRiskPostureDetail()`: explainable contributors and recommended actions
- Risk page labels formula as **rule-based**, not AI

## Part 6 — Audit trail

- `CybercrowAuditLogList`: actor id prefix, category from metadata, SOC links for incident/security_event entities
- Existing category/severity filters retained where present

## Part 7 — Dashboard SOC view

- Philosophy banner + SOC workflow strip (counts on events, incidents, evidence, GRC)
- Stat cards: events needing review, open/under-review incidents, evidence gaps hint, escalated/resolved counts
- `CybercrowRecommendedActions` includes pending review and evidence gap prompts

## Part 8 — Tenant / role context

- MEEM: logistics-oriented copy unchanged on twin-engine strip
- Rimal: construction tenant — no logistics leakage in CyberCrow pages (validated via `tenant:verify:rimal`)
- Najm: organic onboarding only — no tenant CyberCrow until provisioned
- Copy: “CyberCrow supplies security posture. SAREA adapts the analyst experience. RBAC controls access.”
- Admin tenant **CyberCrow** tab: pending review count + SOC chain note

## Part 9 — Notifications / advisories

- **No new notification spam** in F15
- Audit trail remains source of truth for workflow mutations
- Future: optional advisory when high-severity event stays pending > N days

## Part 10 — Permissions

Unchanged:

- `cybercrow.incidents.manage` required for review/dismiss/escalate/status changes
- Platform admin paths unchanged
- Auditor read-only: view without mutation controls (existing RBAC)

## Part 11 — MEEM / Rimal validation

Run at acceptance (PowerShell, repo root):

```powershell
Set-Location D:\CYBERCROW
npm run typecheck
npm run lint
npm run build
npm run public:mirror-manifest
npm run meem:ids:staging
npm run sarea:meem-verify
npm run tenant:verify:rimal
npm run request:pipeline:verify
```

Optional: `npm run simulate:vercel-build:staging` — if Windows Prisma EPERM only, note build passed.

## Part 12 — Key files (F15)

| Area | Files |
|------|--------|
| Service | `src/lib/services/cybercrow-soc-workflow.service.ts` |
| UI | `cybercrow-soc-philosophy-banner.tsx`, `cybercrow-soc-workflow-strip.tsx`, `incident-workflow-panel.tsx` |
| Pages | `cybercrow/dashboard`, `security-events`, `incidents`, `risk`, `evidence` |
| Actions | `src/lib/actions/cybercrow.ts` (revalidate risk/evidence/grc) |
| Admin | `admin/tenants/[tenantId]/page.tsx` (SOC counts on CyberCrow tab) |

## Advisory / read-only (explicit)

- Risk score is **indicative**, rule-based
- Evidence is **readiness catalog**, not attestation workflow
- Identity/session counts depend on recorded auth telemetry
- No autonomous detection, no NCA certification guarantee, no SIEM replacement

## Future work (out of scope)

- Fake AI / SIEM marketing
- SCIM / Entra sync
- Stripe enforcement
- Full case assignment and SLA
- Evidence file upload vault
- Scheduled digest emails for every SOC state change
- Destructive incident/event deletion

## Acceptance

**F15 — PASSED** (25 May 2026): audit documented; SOC chain UX shipped; permissions preserved; `typecheck` / `lint` / `build` / `public:mirror-manifest` / `meem:ids:staging` / `sarea:meem-verify` / `tenant:verify:rimal` / `request:pipeline:verify` all green. No forbidden scope added.
