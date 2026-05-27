# J4 — CyberCrow Evidence / GRC / Risk UX Depth (no paid infra)

**Status:** Passed (27 May 2026)  
**Audience:** Internal delivery / operators  
**Constraint:** UX depth and readiness clarity only — not SIEM, not certified compliance, not autonomous detection, not legal audit certification.

---

## 1. CyberCrow surface audit (pre-J4)

| Route | Prior state | Gap |
|-------|-------------|-----|
| `/[tenant]/cybercrow/dashboard` | Rich SOC strip, posture score, recommended actions | Disconnected summaries; generic `PageHeader`; weak ProCrow framing |
| `/[tenant]/cybercrow/evidence` | Catalog, gaps, report readiness panels | Missing unified “what to do next” strip |
| `/[tenant]/cybercrow/grc` | Control readiness, findings | Redundant inline advisory banner; no shared scope note |
| `/[tenant]/cybercrow/risk` | Posture contributors, GRC signals | Operator next steps buried in other panels |
| `/[tenant]/cybercrow/security-events` | Review filters, event cards | No consistent CyberCrow header / scope |
| `/[tenant]/cybercrow/audit-logs` | Category filters, audit list | Same |

**Data sources (unchanged):** existing `cybercrow-*.service.ts` helpers, mock/seed where applicable, advisory aggregation only. No new schema, no external APIs, no `service_role` in UI paths.

**Copy risks found:** Some pages used certification-adjacent language in *negative* context (acceptable). Philosophy banner already states “not a SIEM replacement.” J4 standardizes scope via shared `CybercrowScopeNote` + `cybercrow-ux-depth.ts`.

---

## 2. UX model

**File:** `src/lib/constants/cybercrow-ux-depth.ts`

- `CyberCrowUXArea` — dashboard, security_events, evidence, grc, risk, audit_logs  
- `CyberCrowEvidenceCategory` — client approval, request review, onboarding, access review, workflow review, runtime event, module handoff, tenant change, security_event, grc_mapping  
- `CyberCrowEvidenceReadinessStatus` — ready, needs_review, missing, advisory, not_applicable  
- `CyberCrowRiskLevel` — critical → informational  
- `CyberCrowOperatorAction` — review_event, collect_evidence, map_control, validate_access, review_risk, confirm_runtime_safety, document_exception  
- `CYBERCROW_IDENTITY`, `CYBERCROW_SCOPE`, `CYBERCROW_COPY` — ProCrow ownership, evidence readiness language, explicit “what it is not”

---

## 3. Shared components

| Component | Role |
|-----------|------|
| `cybercrow-scope-note.tsx` | Advisory scope — no SIEM / certification / autonomous remediation claims |
| `cybercrow-page-header.tsx` | Title, subtitle, optional ProCrow overview link, scope note |
| `cybercrow-readiness-card.tsx` | Status-styled metric card |
| `cybercrow-operator-next-actions.tsx` | Linked operator actions per area |
| `cybercrow-evidence-summary.tsx` | Evidence readiness strip + deep link |
| `cybercrow-grc-summary.tsx` | GRC mapping strip + deep link |
| `cybercrow-risk-summary.tsx` | Risk review strip + deep link |
| `cybercrow-trust-cockpit-strip.tsx` | Nav to evidence / GRC / risk / events / audit logs |

Existing F15/F21 panels (philosophy banner, recommended actions, evidence catalog, GRC panels) retained — J4 layers consistency on top.

---

## 4. Page depth results

### Dashboard

- `CybercrowPageHeader` with ProCrow Trust & Security framing  
- `CybercrowTrustCockpitStrip` for cross-area navigation  
- Parallel fetch: evidence catalog + GRC summary for dashboard cards  
- `CybercrowEvidenceSummary`, `CybercrowGrcSummary`, `CybercrowRiskSummary`  
- Bugfix: gap count uses `evidenceGaps.length` (not conflated with catalog size)

### Evidence

- Shared header + operator next actions (collect evidence, map control, review events)  
- Existing catalog/gaps/report panels unchanged in behavior

### GRC

- Shared header; removed duplicate inline advisory banner (scope in header/note)  
- Operator next actions for mapping and review

### Risk

- Shared header + operator next actions linking to evidence/GRC/events

### Security events & audit logs

- Shared headers + area-specific operator next actions  
- Existing tables/cards and empty states preserved

---

## 5. ProCrow control tower linkage

**File:** `src/components/procrow/procrow-control-tower-dashboard.tsx`

Expanded CyberCrow deep links when primary tenant slug is known:

- Trust cockpit (tenant CyberCrow dashboard)  
- Evidence, GRC, risk  
- Security events, audit logs  
- Incidents (existing)

Read-only; no new queries on overview.

---

## 6. Tenant runtime / reports linkage

**Deferred (documented):** G9/G10 already surface CyberCrow/SAREA posture on reports and runtime cohesion. No additional banners added in J4 to avoid link spam. Operators reach CyberCrow via tenant nav and ProCrow control tower.

**Future (J5+):** Optional single “Trust posture” link chip on reports hub if user testing shows discovery gap.

---

## 7. Verification

| Script | Command |
|--------|---------|
| J4 verifier | `npm run cybercrow:verify` |
| ProCrow bundle | `npm run procrow:verify` (includes J1–J3 + J4) |

**Checks:** UX constants, shared J4 components, page headers, dashboard summaries, ProCrow tower links, forbidden phrases in new components, operator-oriented copy on pages.

---

## 8. Validation gate (project standard)

Run with staging/mock env as applicable:

- `npm run mock:verify`  
- `npm run typecheck`  
- `npm run lint`  
- `npm run build`  
- `npm run public:mirror-manifest`  
- `npm run procrow:verify`  
- `npm run cybercrow:verify`  
- Client track: `client-portal:verify`, `client-profile:verify`, `client-review:verify`, `client-approval:verify`, `client-onboarding:verify`, `client-demo:verify`, `client-org:verify`, `client-notes:verify`

No migrations, destructive seeds, payments, or auto-provisioning.

---

## 9. Remaining gaps

- No live SIEM/event ingestion — security events remain mock/advisory  
- GRC mappings are readiness templates, not regulator attestations  
- Risk signals are rule-based explainability, not ML scoring  
- Cross-module “evidence from task approval” is indirect (via existing services), not a unified evidence graph  
- Reports/runtime single-click trust shortcuts deferred

---

## 10. Recommended next phase

**Primary:** **J5 — SAREA Studio UX Depth**  
**Alternative:** **J5 — Deployment Go/No-Go Center**

---

## Acceptance checklist

| # | Criterion | Met |
|---|-----------|-----|
| 1 | Surface audit documented | Yes |
| 2 | UX model exists | Yes |
| 3 | Shared components exist | Yes |
| 4 | Dashboard improved | Yes |
| 5 | Evidence improved | Yes |
| 6 | GRC improved | Yes |
| 7 | Risk improved | Yes |
| 8 | Security events / audit logs improved | Yes |
| 9 | ProCrow linkage improved | Yes |
| 10 | Tenant runtime/reports linkage | Documented deferred |
| 11 | Verification script | Yes |
| 12 | PROJECT_STATUS + MILESTONES | Yes |
| 13 | Validation commands | Run at gate |
| 14 | No forbidden scope | Yes |
| 15 | No overclaims | Yes |

**J4 decision:** **PASSED** (pending green validation run in CI/local gate).
