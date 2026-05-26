# F21 — CyberCrow evidence / GRC depth (no paid infra)

**Date:** 25 May 2026  
**Status:** **Passed** (validation section below)

## Goal

Deepen CyberCrow’s **evidence readiness** and **GRC posture visibility** without pretending to be a full compliance platform, without paid GRC tools, and without schema changes.

**Philosophy:** advisory posture, operator-managed, readiness language — not certification or SIEM replacement.

## Part 1 — Evidence / GRC audit (pre-change)

| Route | DB-backed | Advisory | F15 baseline | F21 improvement |
|-------|-----------|----------|--------------|-----------------|
| `/[tenant]/cybercrow/evidence` | `ComplianceEvidence`, controls | No upload vault | `getEvidenceReadiness()` gaps list | Full catalog + gaps panel + report readiness |
| `/[tenant]/cybercrow/grc` | Controls, findings, evidence counts | No auto-remediation | Summary cards | Domain readiness + control→evidence mapping |
| `/[tenant]/cybercrow/compliance` | NCA control register | Not certified | Static register | Readiness labels + mapping panel |
| `/[tenant]/cybercrow/risk` | Rule-based score | Not AI | `getRiskPostureDetail()` | Evidence & GRC signals block |
| `/[tenant]/cybercrow/incidents` | `Incident`, audit linkage | No owner field | Workflow panel | Expanded evidence-ready checklist + links |
| `/[tenant]/cybercrow/security-events` | `SecurityEvent`, review JSON | No SIEM | Enriched list + escalate | Per-event evidence hints |
| `/[tenant]/cybercrow/audit-logs` | `CybercrowAuditLog` | Append-only | Unchanged | Linked from gaps/hints |
| `/[tenant]/cybercrow/dashboard` | SOC strip counts | Twin-engine (MEEM) | SOC workflow strip | Evidence gap count on Evidence stat |

**Schema (unchanged):** `ComplianceEvidence` has `id`, `controlId`, `title`, `storageKey?`, `createdAt` — no owner column, no attestation workflow. `storageKey` present ⇒ file-backed hint only; no upload UI.

**Data sources:** `cybercrow-tenant.service.ts`, `cybercrow-soc-workflow.service.ts`, `nca-compliance-controls.ts`, `cybercrow-evidence-grc.service.ts` (new, derived views only).

## Part 2 — Evidence catalog depth

**Service:** `getEvidenceCatalog(tenantId)` in `cybercrow-evidence-grc.service.ts`

Each row includes:

- Category / domain (from NCA control definition)
- Related control key
- Source: incident, event, audit, identity, workflow, policy, manual, catalog (inferred from title + control)
- Status: `available` (has `storageKey`), `needs_review`, `recommended`
- Owner: **Not assigned** (honest — no owner in schema)
- Last updated (`createdAt`)
- File-backed flag

**UI:** `src/app/[tenant]/cybercrow/evidence/page.tsx` — catalog table, advisory banner:

> Evidence readiness catalog — file upload / attestation workflow not enabled yet.

No destructive delete. No fake uploaded documents.

## Part 3 — Evidence gap model

**Service:** `getEvidenceGaps(tenantId, tenantSlug)`

Advisory gaps (rule-based, no synthetic evidence):

| Gap type | Trigger |
|----------|---------|
| Control without evidence | Compliance control with zero linked evidence |
| Open incident | Status open/reopened without review evidence narrative |
| Pending medium+ event | Unreviewed event severity medium/high/critical |
| Open GRC finding | Open tenant GRC finding |
| Identity telemetry | No recent identity/session signals when telemetry empty |
| Empty catalog | Zero evidence rows (onboarding hint) |

Each gap: title, severity (`advisory` / `medium` / `high`), why it matters, suggested evidence, related route link.

**UI:** `CybercrowEvidenceGapPanel` on evidence, GRC, and referenced from dashboard stat hint.

## Part 4 — GRC control readiness

**Service:** `getGrcControlReadiness(tenantId)` — domain groups with readiness labels:

- `ready_for_review` — evidence present, control active
- `needs_evidence` — active control, zero evidence
- `needs_owner` — reserved for future owner field
- `not_enabled` — inactive / disabled control
- `advisory_only` — informational mapping

Domains align to NCA baseline keys: access control, audit logging, data protection, incident response (+ derived labels).

**UI:** `CybercrowControlReadinessPanel` on `/grc` and `/compliance`.

No compliance certification claims.

## Part 5 — Control-to-evidence mapping

**Service:** `getControlEvidenceMapping(tenantId)`

Per control:

- Required evidence examples (`REQUIRED_EVIDENCE_BY_CONTROL` + NCA definition)
- Available evidence titles (DB)
- Missing count
- Recommended next action (advisory copy)
- Related CyberCrow surfaces (incidents, events, audit, identity)

Generated from existing DB counts — **advisory/readiness mapping**, not a formal GRC engine.

## Part 6 — Incident / event evidence linkage

**Incidents:** `incident-workflow-panel.tsx` — evidence-ready checklist (review record, linked event, audit trail, control mapping link) + hrefs to evidence/GRC/audit.

**Events:** `getEventEvidenceContext()` + `CybercrowEventEvidenceHints` on `security-events/page.tsx` — recommended artifacts, review state, link to evidence catalog.

No file upload. No fake attachments.

## Part 7 — Risk + evidence connection

**Service:** `getRiskGrcSignals(tenantId, tenantSlug)` — open incidents, pending events, evidence gap count, controls without evidence, compliance readiness summary, identity telemetry note.

**UI:** `risk/page.tsx` — “Evidence & GRC signals” section above existing rule-based posture detail.

Scoring remains in `cybercrow-dashboard.service.ts` — explainable, not AI.

## Part 8 — Export / report readiness

**Service:** `getReportReadiness(tenantSlug)` — bullets on what could be exported later; deferred: evidence pack PDF, audit export, GRC readiness report.

**UI:** `CybercrowReportReadinessPanel` on evidence page — copyable summary text only (client-side copy via `<details>` / pre block). No new dependencies. No PDF pipeline.

## Part 9 — Permission boundaries

Unchanged:

- CyberCrow manage permission for mutations (incidents, events) — existing server actions
- Auditor read-only on advisory pages
- Platform staff rules unchanged
- Tenant scoping on all Prisma queries
- No client portal access to CyberCrow GRC surfaces
- No unauthorized evidence mutation (catalog remains read-only)

## Part 10 — MEEM / Rimal validation

| Script | Result (25 May 2026) |
|--------|----------------------|
| `npm run meem:ids:staging` | PASS — MEEM tenant GO_LIVE, blueprint ids |
| `npm run tenant:verify:rimal` | PASS — construction isolation, CyberCrow audit logs, no logistics bleed |
| `npm run request:pipeline:verify` | PASS — MEEM + Rimal pipeline |

Manual smoke: CyberCrow evidence, GRC, compliance, risk, incidents, security-events, audit-logs, dashboard — routes build and render under tenant layout.

## Part 11 — Files touched (F21)

| Area | Files |
|------|-------|
| Service | `src/lib/services/cybercrow-evidence-grc.service.ts` (new) |
| Components | `cybercrow-evidence-gap-panel.tsx`, `cybercrow-control-readiness-panel.tsx`, `cybercrow-report-readiness-panel.tsx`, `cybercrow-event-evidence-hints.tsx` |
| Pages | `evidence/page.tsx`, `grc/page.tsx`, `compliance/page.tsx`, `risk/page.tsx`, `security-events/page.tsx`, `dashboard/page.tsx` (CyberCrow) |
| Incident UX | `incident-workflow-panel.tsx` |

## Validation (25 May 2026)

| Command | Result |
|---------|--------|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS |
| `npm run public:mirror-manifest` | PASS |
| `npm run meem:ids:staging` | PASS |
| `npm run tenant:verify:rimal` | PASS |
| `npm run request:pipeline:verify` | PASS |
| `npm run simulate:vercel-build:staging` | PASS (prior run, exit 0) |

## Deferred (F22+)

- Evidence file upload / attestation workflow
- Evidence owner assignment (schema + UI)
- PDF / evidence pack export
- Dedicated `CybercrowAuditLog` immutability chain for compliance packs
- Paid GRC integrations (ServiceNow, Vanta, etc.)
- AI risk or compliance scoring
- NCA/ISO certification badges or auto-compliance scores

## F21 acceptance

All acceptance criteria met:

1. Evidence/GRC audit documented (Part 1).
2. Evidence catalog depth improved (Part 2).
3. Evidence gap model improved (Part 3).
4. GRC/control readiness clearer (Part 4).
5. Control-to-evidence mapping improved (Part 5).
6. Incident/event evidence linkage improved (Part 6).
7. Risk/evidence connection improved (Part 7).
8. Permission boundaries preserved (Part 9).
9. MEEM validation passes.
10. Rimal validation passes.
11. typecheck / lint / build pass.
12. public mirror passes.
13. No paid infrastructure or forbidden scope added.

**Decision:** **F21 PASSED**
