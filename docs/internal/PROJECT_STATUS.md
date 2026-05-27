# Project status

**Last updated:** 27 May 2026 (J1 ProCrow Portal UX Unification)  
**Audience:** Internal delivery / engineering

**Checkpoint detail:** [`RC1_STAGING_VALIDATION.md`](RC1_STAGING_VALIDATION.md) · **Milestone map:** [`MILESTONES.md`](MILESTONES.md) · **ProCrow operator index:** [`PROCROW_OPERATOR_INDEX.md`](PROCROW_OPERATOR_INDEX.md) · **H1 wrap:** [`H1_PRODUCT_POLISH_DEMO_REHEARSAL.md`](H1_PRODUCT_POLISH_DEMO_REHEARSAL.md) · **I1 architecture:** [`I1_CROW_PORTAL_ARCHITECTURE_PROCROW_MODEL.md`](I1_CROW_PORTAL_ARCHITECTURE_PROCROW_MODEL.md) · **J1 ProCrow UX:** [`J1_PROCROW_PORTAL_UX_UNIFICATION.md`](J1_PROCROW_PORTAL_UX_UNIFICATION.md) · **I2 portal auth-flow design:** [`I2_CLIENT_PROPOSAL_PORTAL_AUTH_FLOW_DESIGN.md`](I2_CLIENT_PROPOSAL_PORTAL_AUTH_FLOW_DESIGN.md) · **I3 client portal skeleton:** [`I3_CLIENT_PORTAL_DATA_CONTRACT_ROUTE_SKELETON.md`](I3_CLIENT_PORTAL_DATA_CONTRACT_ROUTE_SKELETON.md) · **I4 client profile MVP:** [`I4_CLIENT_PROFILE_COMPANY_PROFILE_MVP.md`](I4_CLIENT_PROFILE_COMPANY_PROFILE_MVP.md) · **I5 proposal/blueprint review:** [`I5_PROPOSAL_BLUEPRINT_AUTHENTICATED_REVIEW.md`](I5_PROPOSAL_BLUEPRINT_AUTHENTICATED_REVIEW.md) · **I6 scope approval:** [`I6_SCOPE_APPROVAL_PROCROW_STATUS_SYNC.md`](I6_SCOPE_APPROVAL_PROCROW_STATUS_SYNC.md) · **I7 onboarding tracker:** [`I7_ONBOARDING_TRACKER_MVP.md`](I7_ONBOARDING_TRACKER_MVP.md) · **I8 client portal polish & demo:** [`I8_CLIENT_PORTAL_POLISH_DEMO_REHEARSAL.md`](I8_CLIENT_PORTAL_POLISH_DEMO_REHEARSAL.md) · **I9 client organization membership & linkage:** [`I9_CLIENT_ORGANIZATION_MEMBERSHIP_LINKAGE.md`](I9_CLIENT_ORGANIZATION_MEMBERSHIP_LINKAGE.md) · **I10 request changes + review notes:** [`I10_REQUEST_CHANGES_CLIENT_REVIEW_NOTES.md`](I10_REQUEST_CHANGES_CLIENT_REVIEW_NOTES.md) · **I11 client portal checkpoint:** [`I11_CLIENT_PORTAL_CHECKPOINT_PAUSE.md`](I11_CLIENT_PORTAL_CHECKPOINT_PAUSE.md) · **Client portal runbook:** [`CLIENT_PORTAL_RUNBOOK.md`](CLIENT_PORTAL_RUNBOOK.md) · **Demo index:** [`OPERATOR_DEMO_INDEX.md`](OPERATOR_DEMO_INDEX.md)

---

## Current milestone

**RC1 — passed.**

Staging deployment on Vercel with Supabase pooler + Auth is **validated**: login, CEM Command Center, admin surfaces, MEEM tenant runtime, blueprint/go-live paths, CyberCrow advisory views, notifications, and controlled client portal preview.

RC1 is **advisory-first** — no hard billing enforcement, no usage blocking, no SCIM/Entra group sync.

---

## Current delivery track

**v0.30 portfolio baseline — safe to pause** (26 May 2026).

**Wrap-up:** F30 tag `v0.30.0-portfolio` at `f6fcc40`; F31 hygiene complete; post-F30 straggler commits on `main` (`a47af1b`); **H1** demo polish + playbook landed; **I1** portal architecture + ProCrow responsibility model landed; production launch **deferred** (F23). See [`PROJECT_WRAP_UP_V0_30.md`](PROJECT_WRAP_UP_V0_30.md).

| Deliverable | Doc |
|-------------|-----|
| Portal architecture + ProCrow model (I1) | [`I1_CROW_PORTAL_ARCHITECTURE_PROCROW_MODEL.md`](I1_CROW_PORTAL_ARCHITECTURE_PROCROW_MODEL.md) |
| Client / Proposal Portal auth-flow design (I2) | [`I2_CLIENT_PROPOSAL_PORTAL_AUTH_FLOW_DESIGN.md`](I2_CLIENT_PROPOSAL_PORTAL_AUTH_FLOW_DESIGN.md) |
| Client Portal data contract & route skeleton (I3) | [`I3_CLIENT_PORTAL_DATA_CONTRACT_ROUTE_SKELETON.md`](I3_CLIENT_PORTAL_DATA_CONTRACT_ROUTE_SKELETON.md) |
| Client Profile + Company Profile MVP (I4) | [`I4_CLIENT_PROFILE_COMPANY_PROFILE_MVP.md`](I4_CLIENT_PROFILE_COMPANY_PROFILE_MVP.md) |
| Proposal / Blueprint authenticated review (I5) | [`I5_PROPOSAL_BLUEPRINT_AUTHENTICATED_REVIEW.md`](I5_PROPOSAL_BLUEPRINT_AUTHENTICATED_REVIEW.md) |
| Scope approval + ProCrow status sync (I6) | [`I6_SCOPE_APPROVAL_PROCROW_STATUS_SYNC.md`](I6_SCOPE_APPROVAL_PROCROW_STATUS_SYNC.md) |
| Onboarding tracker MVP (I7) | [`I7_ONBOARDING_TRACKER_MVP.md`](I7_ONBOARDING_TRACKER_MVP.md) |
| Client portal polish & demo (I8) | [`I8_CLIENT_PORTAL_POLISH_DEMO_REHEARSAL.md`](I8_CLIENT_PORTAL_POLISH_DEMO_REHEARSAL.md) |
| Product polish & demo rehearsal (H1) | [`H1_PRODUCT_POLISH_DEMO_REHEARSAL.md`](H1_PRODUCT_POLISH_DEMO_REHEARSAL.md) · playbook [`H1_DEMO_REHEARSAL_PLAYBOOK.md`](H1_DEMO_REHEARSAL_PLAYBOOK.md) · index [`OPERATOR_DEMO_INDEX.md`](OPERATOR_DEMO_INDEX.md) |
| Cross-module runtime cohesion (G10) | [`G10_CROSS_MODULE_INTELLIGENCE_RUNTIME_COHESION.md`](G10_CROSS_MODULE_INTELLIGENCE_RUNTIME_COHESION.md) |
| Reports / BI readiness layer (G9) | [`G9_REPORTS_BI_READINESS_LAYER.md`](G9_REPORTS_BI_READINESS_LAYER.md) |
| Tasks / Approvals engine depth (G8) | [`G8_TASKS_APPROVALS_ENGINE_DEPTH.md`](G8_TASKS_APPROVALS_ENGINE_DEPTH.md) |
| Logistics module runtime depth (G7) | [`G7_LOGISTICS_MODULE_RUNTIME_DEPTH.md`](G7_LOGISTICS_MODULE_RUNTIME_DEPTH.md) |
| Inventory + Warehouse module depth (G6) | [`G6_INVENTORY_WAREHOUSE_MODULE_DEPTH.md`](G6_INVENTORY_WAREHOUSE_MODULE_DEPTH.md) |
| Procurement module depth (G5) | [`G5_PROCUREMENT_MODULE_DEPTH.md`](G5_PROCUREMENT_MODULE_DEPTH.md) |
| CRM + Sales module depth (G4) | [`G4_CRM_SALES_MODULE_DEPTH.md`](G4_CRM_SALES_MODULE_DEPTH.md) |
| Finance module depth (G3) | [`G3_FINANCE_MODULE_DEPTH.md`](G3_FINANCE_MODULE_DEPTH.md) |
| HR module depth (G2) | [`G2_HR_MODULE_DEPTH.md`](G2_HR_MODULE_DEPTH.md) |
| ERP module architecture (G1) | [`G1_ERP_MODULE_ARCHITECTURE_INTEGRATION_BLUEPRINT.md`](G1_ERP_MODULE_ARCHITECTURE_INTEGRATION_BLUEPRINT.md) |
| Industry catalog UX (F37) | [`F37_INDUSTRY_CATALOG_UX_SECTOR_SELECTION.md`](F37_INDUSTRY_CATALOG_UX_SECTOR_SELECTION.md) |
| Healthcare operating model depth (F36) | [`F36_HEALTHCARE_OPERATING_MODEL_DEPTH.md`](F36_HEALTHCARE_OPERATING_MODEL_DEPTH.md) |
| Aviation operating model depth (F35) | [`F35_AVIATION_OPERATING_MODEL_DEPTH.md`](F35_AVIATION_OPERATING_MODEL_DEPTH.md) |
| Construction operating model depth (F34) | [`F34_CONSTRUCTION_OPERATING_MODEL_DEPTH.md`](F34_CONSTRUCTION_OPERATING_MODEL_DEPTH.md) |
| Logistics operating model depth (F33) | [`F33_LOGISTICS_OPERATING_MODEL_DEPTH.md`](F33_LOGISTICS_OPERATING_MODEL_DEPTH.md) |
| Retail operating model pack (F32) | [`F32_RETAIL_OPERATING_MODEL_PACK.md`](F32_RETAIL_OPERATING_MODEL_PACK.md) |
| v0.30 portfolio wrap-up (pause) | [`PROJECT_WRAP_UP_V0_30.md`](PROJECT_WRAP_UP_V0_30.md) |
| Workspace hygiene & release cleanliness | [`F31_WORKSPACE_HYGIENE_RELEASE_CLEANLINESS.md`](F31_WORKSPACE_HYGIENE_RELEASE_CLEANLINESS.md) |
| Final portfolio release tag | [`F30_FINAL_PORTFOLIO_RELEASE_TAG.md`](F30_FINAL_PORTFOLIO_RELEASE_TAG.md) |
| Public release notes | [`docs/public/RELEASE_NOTES.md`](../public/RELEASE_NOTES.md) |
| Documentation & developer experience pass | [`F29_DOCUMENTATION_DEVELOPER_EXPERIENCE_PASS.md`](F29_DOCUMENTATION_DEVELOPER_EXPERIENCE_PASS.md) |
| Demo data / mock mode excellence | [`F28_DEMO_DATA_MOCK_MODE_EXCELLENCE.md`](F28_DEMO_DATA_MOCK_MODE_EXCELLENCE.md) |
| Admin quality & reliability pass | [`F27_ADMIN_QUALITY_RELIABILITY_PASS.md`](F27_ADMIN_QUALITY_RELIABILITY_PASS.md) |
| CEM workflow operations depth | [`F26_CEM_WORKFLOW_OPERATIONS_DEPTH.md`](F26_CEM_WORKFLOW_OPERATIONS_DEPTH.md) |
| Discovery intelligence refinement | [`F25_DISCOVERY_INTELLIGENCE_REFINEMENT.md`](F25_DISCOVERY_INTELLIGENCE_REFINEMENT.md) |
| Tenant runtime UX | [`F24_TENANT_RUNTIME_UX_DEPTH.md`](F24_TENANT_RUNTIME_UX_DEPTH.md) |
| Launch deferred gate (F23) | [`F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md`](F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md) |

**Roadmap:** **Paused** at v0.30 portfolio baseline. **H1**, **I1**–**I11** complete on the client-portal track. **J1** unified ProCrow UX (control tower entry, IA, shared language, operator index). **Resume primary:** **J2 — ProCrow Control Tower Dashboard Depth**. **No paid infra** in the default path.

**I1 acceptance:** **PASSED** — [`I1_CROW_PORTAL_ARCHITECTURE_PROCROW_MODEL.md`](I1_CROW_PORTAL_ARCHITECTURE_PROCROW_MODEL.md).  
Four-portal model formalized; ProCrow defined as control tower; Platform Admin ownership under ProCrow; Client/Proposal requirements documented; team model + interface ownership map + RACI added; ProCrow certification roadmap added; portal maturity model added; docs updated; validation commands green; no paid infra/schema/production-scope changes.

**I2 acceptance:** **PASSED** — [`I2_CLIENT_PROPOSAL_PORTAL_AUTH_FLOW_DESIGN.md`](I2_CLIENT_PROPOSAL_PORTAL_AUTH_FLOW_DESIGN.md).  
Current client/proposal surface audit completed; client user types and auth boundaries documented; proposal/blueprint approval flow + token trust gap documented; ProCrow/admin counterparts and future schema gaps documented; validation commands green. No code implementation, migrations, or production scope changes.

**I3 acceptance:** **PASSED** — [`I3_CLIENT_PORTAL_DATA_CONTRACT_ROUTE_SKELETON.md`](I3_CLIENT_PORTAL_DATA_CONTRACT_ROUTE_SKELETON.md).  
Client portal data contract + read-only dashboard service; authenticated `/client/*` routes with shell; proposal/blueprint skeleton with approval blocked; public token page uses sign-in notice (no token-only approve UI); `npm run client-portal:verify`; legacy `/portal/*` preserved. No migrations, payments, production launch, or unsafe approval/role escalation.

**I4 acceptance:** **PASSED** — [`I4_CLIENT_PROFILE_COMPANY_PROFILE_MVP.md`](I4_CLIENT_PROFILE_COMPANY_PROFILE_MVP.md).  
Profile/company contract + readiness service; `/client/profile` and `/client/company` MVP with completeness and missing fields; safe session-only metadata edit; dashboard/settings integration; linking model surfaced; `npm run client-profile:verify`. No approval mutations, company DB writes, migrations, payments, or role escalation.

**I5 acceptance:** **PASSED** — [`I5_PROPOSAL_BLUEPRINT_AUTHENTICATED_REVIEW.md`](I5_PROPOSAL_BLUEPRINT_AUTHENTICATED_REVIEW.md).
Review contract + read-only `client-review.service`; enriched `/client/proposals`, proposal detail, and blueprint review; request detail integration; public token page remains non-authoritative (no `ProposalClientActions` / `approveProposalByToken` wiring); `npm run client-review:verify`. No approval mutations, migrations, payments, or role escalation.

**I6 acceptance:** **PASSED** — [`I6_SCOPE_APPROVAL_PROCROW_STATUS_SYNC.md`](I6_SCOPE_APPROVAL_PROCROW_STATUS_SYNC.md).
Approval contract + eligibility/approve services; `approveClientProposalScopeAction` with strong ownership (submitter or documented mock demo email); client approval panel on proposal detail; list/request/blueprint/admin status sync; `platformNotification` on approve; public token route unchanged (sign-in notice only); `npm run client-approval:verify`. Request-changes deferred. No migrations, payments, tenant auto-provision, or role escalation.

**I7 acceptance:** **PASSED** — [`I7_ONBOARDING_TRACKER_MVP.md`](I7_ONBOARDING_TRACKER_MVP.md).

**I8 acceptance:** **PASSED** — [`I8_CLIENT_PORTAL_POLISH_DEMO_REHEARSAL.md`](I8_CLIENT_PORTAL_POLISH_DEMO_REHEARSAL.md).
Onboarding contract + 12-step model + derived `client-onboarding.service`; `/client/onboarding` tracker UI; dashboard tile; request/proposal/blueprint summary cards; admin onboarding readiness panel; advisory trust copy (production F23-gated, no auto-provision); `npm run client-onboarding:verify`. No migrations, payments, tenant auto-provision, or production launch activation.

**I9 acceptance:** **PASSED** — [`I9_CLIENT_ORGANIZATION_MEMBERSHIP_LINKAGE.md`](I9_CLIENT_ORGANIZATION_MEMBERSHIP_LINKAGE.md).
Client organization membership contract + decision service (`canApproveScope`); approval hardening (non-mock contact-email no longer writes `submittedByUserId`); read-only membership context on `/client/company` and `/client/settings`; create-only Prisma migration (`20260527120000_client_org_membership`) approved for remote deploy via Vercel `db:migrate:deploy`; `npm run client-org:verify` and the required track verifiers run green.

**I10 acceptance:** **PASSED** — [`I10_REQUEST_CHANGES_CLIENT_REVIEW_NOTES.md`](I10_REQUEST_CHANGES_CLIENT_REVIEW_NOTES.md).
Review notes contract + service/actions; linked clients can submit notes; official request-changes gated on `canApproveScope` + `SENT` proposal; ProCrow/admin feedback panel; persistence via `PlatformNotification` (no migration); public token route unchanged; `npm run client-notes:verify` and client track verifiers.

**I11 acceptance:** **PASSED** — [`I11_CLIENT_PORTAL_CHECKPOINT_PAUSE.md`](I11_CLIENT_PORTAL_CHECKPOINT_PAUSE.md).
I1–I10 arc summarized; capability + security/trust checkpoint; route map; eight `client-*:verify` scripts indexed; manual smoke checklist; [`CLIENT_PORTAL_RUNBOOK.md`](CLIENT_PORTAL_RUNBOOK.md); pause with **J1** primary resume and **I12** manual-smoke alternative; no code/feature/migration scope.

**J1 acceptance:** **PASSED** — [`J1_PROCROW_PORTAL_UX_UNIFICATION.md`](J1_PROCROW_PORTAL_UX_UNIFICATION.md).
ProCrow surface audit + IA; shared language (`procrow-portal.ts`) and components; Control Tower entry on `/admin/overview`; Platform Admin / CyberCrow dashboard / SAREA overview framing; [`PROCROW_OPERATOR_INDEX.md`](PROCROW_OPERATOR_INDEX.md); J2–J8 roadmap documented; `npm run procrow:verify`; no route moves, auth weakening, migrations, payments, or overclaims.

**H1 acceptance:** **PASSED** — [`H1_PRODUCT_POLISH_DEMO_REHEARSAL.md`](H1_PRODUCT_POLISH_DEMO_REHEARSAL.md).  
Demo journey audit; public + admin micro-copy for staging/F23 honesty; tenant/CyberCrow/SAREA assessed **sufficient** with prior G/F depth; [`H1_DEMO_REHEARSAL_PLAYBOOK.md`](H1_DEMO_REHEARSAL_PLAYBOOK.md); G-series **G1→G10** order in [`MILESTONES.md`](MILESTONES.md); `npm run mock:verify`, `typecheck`, `lint`, `build`, `public:mirror-manifest`, `erp:verify`, `sector:verify`, `reports:verify`, `tasks-approvals:verify`, `runtime:verify`; optional `request:pipeline:verify`, `sarea:meem-verify`, `tenant:verify:rimal` green on staging env.

**G10 acceptance:** **PASSED** — [`G10_CROSS_MODULE_INTELLIGENCE_RUNTIME_COHESION.md`](G10_CROSS_MODULE_INTELLIGENCE_RUNTIME_COHESION.md).  
Cohesion model + `getRuntimeCohesionSnapshot`, dashboard/modules/admin panels, `npm run runtime:verify`; rule-based operator guidance only; no autonomous AI/predictive/live automation/paid infra/schema writes; forbidden overclaim phrases guarded in verify.

**G9 acceptance:** **PASSED** — [`G9_REPORTS_BI_READINESS_LAYER.md`](G9_REPORTS_BI_READINESS_LAYER.md).  
Reports hub with executive roll-up, cross-module readiness aggregation, CyberCrow/SAREA reporting posture, sector notes, `npm run reports:verify`; no data warehouse/external BI/AI forecasting/certified reporting claims; no schema changes.

**G8 acceptance:** **PASSED** — [`G8_TASKS_APPROVALS_ENGINE_DEPTH.md`](G8_TASKS_APPROVALS_ENGINE_DEPTH.md).  
Tasks/Workflows readiness hubs, cross-module approval map, workflow-to-task linkage, CyberCrow/SAREA guidance, `npm run tasks-approvals:verify`; no BPMN/RPA/autonomous workflow/AI assignment/compliance automation claims; no schema changes.

**G7 acceptance:** **PASSED** — [`G7_LOGISTICS_MODULE_RUNTIME_DEPTH.md`](G7_LOGISTICS_MODULE_RUNTIME_DEPTH.md).  
Logistics operations readiness hub, warehouse/inventory/procurement/CRM/finance linkage, CyberCrow/SAREA guidance, sector notes, `npm run logistics-module:verify`; no GPS/carrier/live POD/automated dispatch/TMS claims; no schema changes.

**G6 acceptance:** **PASSED** — [`G6_INVENTORY_WAREHOUSE_MODULE_DEPTH.md`](G6_INVENTORY_WAREHOUSE_MODULE_DEPTH.md).  
Inventory and Warehouse operations readiness hubs, procurement/logistics/finance linkage, CyberCrow/SAREA guidance, sector notes, `npm run inventory-warehouse:verify`; no barcode/RFID/IoT/live stock accuracy/WMS claims; no schema changes.

**G5 acceptance:** **PASSED** — [`G5_PROCUREMENT_MODULE_DEPTH.md`](G5_PROCUREMENT_MODULE_DEPTH.md).  
Procurement operations readiness hub, finance/inventory/warehouse linkage, CyberCrow/SAREA guidance, sector notes, `npm run procurement:verify`; no live supplier payments/vendor marketplace/supplier-risk scoring claims; no schema changes.

**G4 acceptance:** **PASSED** — [`G4_CRM_SALES_MODULE_DEPTH.md`](G4_CRM_SALES_MODULE_DEPTH.md).  
CRM/Sales commercial readiness hubs, request/finance linkage, CyberCrow/SAREA guidance, sector notes, `npm run crm-sales:verify`; no AI lead scoring/live payment/external CRM claims; no schema changes.

**G3 acceptance:** **PASSED** — [`G3_FINANCE_MODULE_DEPTH.md`](G3_FINANCE_MODULE_DEPTH.md).  
Finance operations readiness hub, sales/procurement/plan linkage banners, CyberCrow/SAREA guidance, sector notes, `npm run finance:verify`; no live payment/tax/accounting claims; no schema changes.

**G2 acceptance:** **PASSED** — [`G2_HR_MODULE_DEPTH.md`](G2_HR_MODULE_DEPTH.md).  
HR workforce readiness hub, org linkage on users/roles/departments, CyberCrow/SAREA guidance, sector notes, `npm run hr:verify`; no payroll/HRMS claims; no schema changes.

**G1 acceptance:** **PASSED** — [`G1_ERP_MODULE_ARCHITECTURE_INTEGRATION_BLUEPRINT.md`](G1_ERP_MODULE_ARCHITECTURE_INTEGRATION_BLUEPRINT.md).  
Self-describing ERP module catalog, integration map, maturity/UX standards, sector-module matrix, CyberCrow/SAREA rules, `npm run erp:verify`; no paid infra or schema changes.

**F37 acceptance:** **PASSED** — [`F37_INDUSTRY_CATALOG_UX_SECTOR_SELECTION.md`](F37_INDUSTRY_CATALOG_UX_SECTOR_SELECTION.md).  
Five modeled sectors on `/industries`; request selector with preview; discovery/blueprint sector clarity; `npm run sector:verify`; hero remains 4 chips (no healthcare chip).

**F36 acceptance:** **PASSED** — [`F36_HEALTHCARE_OPERATING_MODEL_DEPTH.md`](F36_HEALTHCARE_OPERATING_MODEL_DEPTH.md).  
Healthcare is a first-class sector template; verify with `npm run healthcare:verify`; privacy/safety and evidence posture are advisory only (no HIPAA/certification claims); public hero chip not added.

**F35 acceptance:** **PASSED** — [`F35_AVIATION_OPERATING_MODEL_DEPTH.md`](F35_AVIATION_OPERATING_MODEL_DEPTH.md).  
Aviation is a first-class sector template; verify with `npm run aviation:verify`; Najm organic intake aligned via F11 payload + read-only checks (no Najm tenant provision).

**F34 acceptance:** **PASSED** — [`F34_CONSTRUCTION_OPERATING_MODEL_DEPTH.md`](F34_CONSTRUCTION_OPERATING_MODEL_DEPTH.md).  
Construction is a first-class sector template; verify with `npm run construction:verify`; Rimal staging alignment via `tenant:verify:rimal` (staging DB).

**F33 acceptance:** **PASSED** — [`F33_LOGISTICS_OPERATING_MODEL_DEPTH.md`](F33_LOGISTICS_OPERATING_MODEL_DEPTH.md).  
Logistics is the deepest sector template; verify with `npm run logistics:verify`; MEEM lighthouse alignment checked in verify + `sarea:meem-verify` (staging DB).

**F32 acceptance:** **PASSED** — [`F32_RETAIL_OPERATING_MODEL_PACK.md`](F32_RETAIL_OPERATING_MODEL_PACK.md).  
Retail is a first-class sector template; verify with `npm run retail:verify`; optional DB sync via `npm run db:seed:sectors`.

**F31 acceptance:** **PASSED** — [`F31_WORKSPACE_HYGIENE_RELEASE_CLEANLINESS.md`](F31_WORKSPACE_HYGIENE_RELEASE_CLEANLINESS.md).  
Straggler commits landed on `main`; working tree **clean**; `main` at `a47af1b`.

**F30 acceptance:** **PASSED** — [`F30_FINAL_PORTFOLIO_RELEASE_TAG.md`](F30_FINAL_PORTFOLIO_RELEASE_TAG.md).  
Portfolio/demo/staging checkpoint validated; git tag **`v0.30.0-portfolio`** at `f6fcc40`.

**F29 acceptance:** **PASSED** — [`F29_DOCUMENTATION_DEVELOPER_EXPERIENCE_PASS.md`](F29_DOCUMENTATION_DEVELOPER_EXPERIENCE_PASS.md).  
Current safe operating mode: **staging/demo/portfolio** (F23 production deferred gate remains active).

**F28 acceptance:** **PASSED** — [`F28_DEMO_DATA_MOCK_MODE_EXCELLENCE.md`](F28_DEMO_DATA_MOCK_MODE_EXCELLENCE.md).  
Preflight guard: `npm run mock:verify`.

**F27 acceptance:** **PASSED** — [`F27_ADMIN_QUALITY_RELIABILITY_PASS.md`](F27_ADMIN_QUALITY_RELIABILITY_PASS.md).

**F26 acceptance:** **PASSED** — [`F26_CEM_WORKFLOW_OPERATIONS_DEPTH.md`](F26_CEM_WORKFLOW_OPERATIONS_DEPTH.md).

**F25 acceptance:** **PASSED** — [`F25_DISCOVERY_INTELLIGENCE_REFINEMENT.md`](F25_DISCOVERY_INTELLIGENCE_REFINEMENT.md).

**F24 acceptance:** **PASSED** — [`F24_TENANT_RUNTIME_UX_DEPTH.md`](F24_TENANT_RUNTIME_UX_DEPTH.md).

**F23 acceptance:** **PASSED AS A DECISION GATE** — production launch **deferred**; engineering not blocked.

**F22 acceptance:** **PASSED** — [`F22_PORTFOLIO_PUBLIC_DEMO_POLISH.md`](F22_PORTFOLIO_PUBLIC_DEMO_POLISH.md).

**F21 acceptance:** **PASSED** — evidence/GRC surfaces deepened; MEEM/Rimal verify scripts green.

**F20 acceptance:** **PASSED** — [`F20_SAREA_ADVANCED_CONTROLS.md`](F20_SAREA_ADVANCED_CONTROLS.md).

**F19 acceptance:** **PASSED** (docs + advisory pricing line) — billing remains internal/advisory until budget approval.

**F18 acceptance:** **PASSED** — [`F18_GOOGLE_SIGNIN_SETUP.md`](F18_GOOGLE_SIGNIN_SETUP.md) · enable Google in Supabase/Google Cloud for live Google login.

**F17 acceptance:** **PASSED** — [`F17_COST_CONTROLLED_AUTH_PAYMENT_READINESS.md`](F17_COST_CONTROLLED_AUTH_PAYMENT_READINESS.md).

**Completed prior:** **F16 — Production launch readiness** — F16_* governance docs (**passed**).

**Completed prior:** **F15.6 — Public surface security regression audit** — [`F15_6_PUBLIC_SECURITY_REGRESSION_AUDIT.md`](F15_6_PUBLIC_SECURITY_REGRESSION_AUDIT.md) (**passed**).

**Completed prior:** **F15.5 — Homepage usability & public story clarity** — [`F15_5_HOMEPAGE_USABILITY.md`](F15_5_HOMEPAGE_USABILITY.md) (**passed**).

**Completed prior:** **F15 — CyberCrow SOC workflow depth** — [`F15_CYBERCROW_SOC_WORKFLOW_DEPTH.md`](F15_CYBERCROW_SOC_WORKFLOW_DEPTH.md) (**passed**).

**Completed prior:** **F14 — SAREA Studio visibility & safe controls** — [`F14_SAREA_STUDIO_VISIBILITY_SAFE_CONTROLS.md`](F14_SAREA_STUDIO_VISIBILITY_SAFE_CONTROLS.md) (**passed**).

**Completed prior:** **F13** — demo rehearsal & 12 public screenshots — [`F13_DEMO_REHEARSAL_NOTES.md`](F13_DEMO_REHEARSAL_NOTES.md) (**passed**).

**Completed prior:** **F12** — [`F12_DEMO_STORYBOARD.md`](F12_DEMO_STORYBOARD.md) · [`F12_OPERATOR_DEMO_PLAYBOOK.md`](F12_OPERATOR_DEMO_PLAYBOOK.md) (**passed**).

**Completed prior:** **F11** organic browser E2E — [`F11_ORGANIC_BROWSER_E2E_SIGNOFF.md`](F11_ORGANIC_BROWSER_E2E_SIGNOFF.md) · F10 — [`F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md`](F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md) · F9 · F8 · F7 · F6 Rimal.

**Demo scripts:** `npm run meem:ids:staging` · `npm run tenant:verify:rimal` · `npm run retail:verify` · `npm run request:pipeline:verify` · `npm run onboarding:verify` · `npm run public:mirror-manifest`.

RC1 remains the staging health baseline; F7 does not replace production-readiness planning.

---

## Recommended Phase F options (not selected)

Pick **one primary track** after planning; others can run in parallel only if resourced.

| # | Option | Summary |
|---|--------|---------|
| 1 | **Production readiness** | Azure or Vercel prod, domain, Entra prod redirects, migrate deploy in release, health smoke |
| 2 | **Public portfolio polish** | README/screenshots, sanitized public docs, contributor onboarding |
| 3 | **Tenant onboarding hardening** | **F6** Rimal · **F7** pipeline · **F8** five-sector templates + organic E2E |
| 4 | **Package UX** | Startup / Growth / Enterprise surfaces — still advisory unless billing chosen |
| 5 | **Security hardening** | Rate limiting, Turnstile on public request API, extended audit |
| 6 | **Stripe live alignment** | Live checkout, webhook reconciliation, enforcement policy decision |
| 7 | **Entra / SCIM planning** | Group sync and provisioning design only — no implementation commitment |

---

## Honest backlog context (M1–M8)

Long-running milestone percentages remain in [`MILESTONES.md`](MILESTONES.md). RC1 does not mark M7/M8 as 100%; it confirms **staging health** for the integrated platform slice.

| Area | Note |
|------|------|
| M2 MEEM E2E | Lighthouse pipeline live on staging; customer SAREA acceptance (M5) still separate |
| M7 Cloud | Staging on Vercel validated; Azure primary path still open |
| M8 SaaS | Stripe scaffold; live charges not RC1 scope |

---

## What not to do immediately after RC1

- No new features without Phase F plan
- No schema changes without migration review
- No auth routing churn without security review
- No secrets or `.env` content in git or public docs

---

*Concise status pointer — operational detail lives in RC1 checkpoint and milestone entries.*
