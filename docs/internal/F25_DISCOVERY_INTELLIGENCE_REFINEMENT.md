# F25 — Discovery intelligence refinement (no paid infra)

**Date:** 25 May 2026  
**Status:** **PASSED**  
**Constraint:** No paid infrastructure, no external AI/LLM APIs, no production launch changes, no fake AI claims.

**Related:** [F24_TENANT_RUNTIME_UX_DEPTH.md](F24_TENANT_RUNTIME_UX_DEPTH.md) · [PROJECT_STATUS.md](PROJECT_STATUS.md) · [MILESTONES.md](MILESTONES.md)

---

## Objective

Refine Discovery Intelligence as an **advisory system**:

Request -> sector understanding -> module clarity -> structure/roles/workflows/security guidance -> org-model review -> blueprint readiness.

No autonomous AI claims. Recommendations are explicit, editable, and confidence-labeled.

---

## Part 1 — Discovery audit

Audited discovery routes and supporting logic:

- `/discovery/[requestId]` layout + step nav
- `/summary`, `/modules`, `/organization`, `/departments`, `/roles`, `/workflows`, `/security`, `/identity`, `/experience`, `/organization-model`
- sector template constants and resolver
- discovery completion gate service
- discovery->blueprint bridge behavior
- verification scripts (`request:pipeline:verify`, `request:e2e:dry`)

### Strengths found

- Existing sector template model already robust (logistics/construction/aviation/healthcare/retail).
- Discovery completion gate already protects against obvious handoff gaps.
- Organization model panel already supports accept/customized lifecycle and plan-aware trimming.

### Gaps found

- No unified completeness/readiness panel on discovery pages.
- Sector confidence/reasoning not surfaced clearly for operators.
- Organization model page copy was too “intelligence” branded and less explicit about advisory mode.
- Discovery -> Blueprint bridge context was fragmented.
- Admin request page lacked compact discovery intelligence context.

---

## Part 2 — Sector template refinement (existing sectors only)

Implemented explicit sector guidance metadata for:

- logistics
- construction
- aviation
- healthcare
- retail (default)

Added per-sector advisory content:

- department hints
- role/workflow examples
- security posture hints
- SAREA persona hints
- CyberCrow baseline hints
- blueprint review notes

No new sectors added. No module catalog expansion.

---

## Part 3 — Discovery completeness/readiness model

Added `computeDiscoveryCompleteness` with:

- essentials percentage (existing core discovery completion)
- required vs optional section state
- missing-input list
- confidence labels:
  - sector confidence
  - module confidence
  - org-model confidence
- readiness labels:
  - Ready for blueprint
  - Needs review
  - Missing critical inputs
  - Draft only

Model remains advisory and does not alter existing idempotent blueprint behavior.

---

## Part 4 — Question/copy clarity

Improved discovery step copy for clearer operator guidance:

- organization step now explains what inputs shape sector suggestion and blueprint path
- modules step now clarifies module selection impact on org-intelligence suggestions
- org-model header language shifted to advisory wording

Copy stays concise and avoids fake AI wording.

---

## Part 5 — Recommendation panels

Added recommendation UX blocks:

- Sector guidance panel
- Suggested structure panel (departments, roles, workflows, CyberCrow/SAREA baselines)
- Discovery completeness panel (compact rail)

All recommendations are framed as “suggested/advisory/editable”.

---

## Part 6 — Organization model review clarity

Enhanced `/discovery/[requestId]/organization-model` with:

- sector guidance context
- recommendation panel
- blueprint bridge panel
- improved review-oriented page framing

Retained existing org intelligence accept/customize actions and plan-aware trim behavior.

---

## Part 7 — Discovery -> Blueprint readiness bridge

Added shared bridge panel showing:

- carry-over scope to blueprint
- advisory-only elements
- essentials score
- blocker summary
- direct links to summary, org-model review, and existing blueprint (if present)

No duplicate blueprint creation logic introduced.

---

## Part 8 — Admin request discovery context

Added admin panel in request detail:

- discovery readiness title and essentials %
- sector template + org model status
- compact confidence and gate status chips
- missing inputs summary
- direct links to discovery summary/org-model/blueprint

No full admin redesign.

---

## Part 9 — Verification script improvement

Updated `scripts/verify-discovery-pipeline.ts` to include low-risk checks for:

- sector guidance resolution by request
- discovery completeness/readiness output
- existing MEEM/Rimal sector and isolation checks retained

Read-only validation only.

---

## Part 10 — MEEM / Rimal / Najm validation

Validated using required scripts:

- `npm run meem:ids:staging` ?
- `npm run tenant:verify:rimal` ?
- `npm run request:pipeline:verify` ?
- `npm run request:e2e:dry` ?

Observed in pipeline verify output:

- MEEM: logistics guidance loaded; completeness surfaced as advisory “Needs review” with missing count
- Rimal: construction guidance loaded; completeness “Ready for blueprint”

No tenant provisioning or paid infra required.

---

## Part 11 — Files changed (F25 scope)

### New

- `src/lib/discovery-intelligence/sector-guidance.ts`
- `src/lib/discovery-intelligence/completeness.ts`
- `src/lib/discovery-intelligence/recommendations.ts`
- `src/lib/services/discovery-intelligence.service.ts`
- `src/components/discovery/discovery-completeness-panel.tsx`
- `src/components/discovery/discovery-intelligence-rail.tsx`
- `src/components/discovery/discovery-sector-guidance-panel.tsx`
- `src/components/discovery/discovery-advisory-recommendations.tsx`
- `src/components/discovery/discovery-blueprint-bridge-panel.tsx`
- `src/components/admin/admin-discovery-intelligence-panel.tsx`
- `docs/internal/F25_DISCOVERY_INTELLIGENCE_REFINEMENT.md`

### Updated

- `src/app/discovery/[requestId]/layout.tsx`
- `src/app/discovery/[requestId]/organization/page.tsx`
- `src/app/discovery/[requestId]/modules/page.tsx`
- `src/app/discovery/[requestId]/organization-model/page.tsx`
- `src/app/discovery/[requestId]/summary/page.tsx`
- `src/components/discovery/organization-model-panel.tsx`
- `src/app/admin/requests/[requestId]/page.tsx`
- `scripts/verify-discovery-pipeline.ts`
- `docs/internal/PROJECT_STATUS.md`
- `docs/internal/MILESTONES.md`

---

## Validation results

Executed:

- `npm run typecheck` ?
- `npm run lint` ?
- `npm run build` ?
- `npm run public:mirror-manifest` ?
- `npm run meem:ids:staging` ?
- `npm run tenant:verify:rimal` ?
- `npm run request:pipeline:verify` ?
- `npm run request:e2e:dry` ?

Optional `simulate:vercel-build:staging` not required for F25 pass in this run.

---

## Deferred / not implemented

- No paid AI integrations
- No external LLM calls
- No new paid services
- No production launch/provisioning changes
- No billing/payment activation
- No SCIM/Entra sync expansion
- No schema migrations

---

## Acceptance decision

**F25 PASSED** against requested criteria:

1. Discovery audit documented ?
2. Sector guidance refined ?
3. Completeness/readiness model improved ?
4. Discovery wording clarity improved ?
5. Recommendation panels added/improved ?
6. Organization model review clarity improved ?
7. Discovery?Blueprint bridge improved ?
8. Admin discovery context improved ?
9. Verification checks improved safely ?
10. MEEM validation pass ?
11. Rimal validation pass ?
12. typecheck/lint/build pass ?
13. public mirror pass ?
14. No forbidden paid scope added ?
