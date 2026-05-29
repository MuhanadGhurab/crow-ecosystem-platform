# Operator & demo documentation index

**Purpose:** One-page map of **internal** artifacts for staging/portfolio demos — no production runbook.

| Topic | Doc |
|-------|-----|
| v0.30 release baseline | [`F30_FINAL_PORTFOLIO_RELEASE_TAG.md`](F30_FINAL_PORTFOLIO_RELEASE_TAG.md) · wrap-up [`PROJECT_WRAP_UP_V0_30.md`](PROJECT_WRAP_UP_V0_30.md) |
| Workspace hygiene | [`F31_WORKSPACE_HYGIENE_RELEASE_CLEANLINESS.md`](F31_WORKSPACE_HYGIENE_RELEASE_CLEANLINESS.md) |
| Industry depth (F32–F37) | [`F32_RETAIL_OPERATING_MODEL_PACK.md`](F32_RETAIL_OPERATING_MODEL_PACK.md) → [`F37_INDUSTRY_CATALOG_UX_SECTOR_SELECTION.md`](F37_INDUSTRY_CATALOG_UX_SECTOR_SELECTION.md) |
| ERP module depth (G1–G10) | [`MILESTONES.md`](MILESTONES.md) (G1→G10 order) · G1 [`G1_ERP_MODULE_ARCHITECTURE_INTEGRATION_BLUEPRINT.md`](G1_ERP_MODULE_ARCHITECTURE_INTEGRATION_BLUEPRINT.md) … G10 [`G10_CROSS_MODULE_INTELLIGENCE_RUNTIME_COHESION.md`](G10_CROSS_MODULE_INTELLIGENCE_RUNTIME_COHESION.md) |
| H1 polish & rehearsal | [`H1_PRODUCT_POLISH_DEMO_REHEARSAL.md`](H1_PRODUCT_POLISH_DEMO_REHEARSAL.md) · playbook [`H1_DEMO_REHEARSAL_PLAYBOOK.md`](H1_DEMO_REHEARSAL_PLAYBOOK.md) |
| **J8 ProCrow demo rehearsal** | [`J8_PROCROW_DEMO_REHEARSAL.md`](J8_PROCROW_DEMO_REHEARSAL.md) · playbook [`J8_PROCROW_DEMO_REHEARSAL_PLAYBOOK.md`](J8_PROCROW_DEMO_REHEARSAL_PLAYBOOK.md) · routes [`J8_PROCROW_DEMO_ROUTE_AUDIT.md`](J8_PROCROW_DEMO_ROUTE_AUDIT.md) · screenshots [`J8_PROCROW_SCREENSHOT_CHECKLIST.md`](J8_PROCROW_SCREENSHOT_CHECKLIST.md) · runbook [`PROCROW_DEMO_RUNBOOK.md`](PROCROW_DEMO_RUNBOOK.md) |
| **K1 Tenant Runtime demo** | [`K1_TENANT_RUNTIME_DEMO_REHEARSAL.md`](K1_TENANT_RUNTIME_DEMO_REHEARSAL.md) · playbook [`K1_TENANT_RUNTIME_DEMO_REHEARSAL_PLAYBOOK.md`](K1_TENANT_RUNTIME_DEMO_REHEARSAL_PLAYBOOK.md) · screenshots [`K1_TENANT_RUNTIME_SCREENSHOT_CHECKLIST.md`](K1_TENANT_RUNTIME_SCREENSHOT_CHECKLIST.md) · runbook [`TENANT_RUNTIME_DEMO_RUNBOOK.md`](TENANT_RUNTIME_DEMO_RUNBOOK.md) |
| **K2 Manual browser smoke** | [`K2_MANUAL_BROWSER_SMOKE.md`](K2_MANUAL_BROWSER_SMOKE.md) · production https://crow-ecosystem-platform.vercel.app |
| Production deferred gate | [`F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md`](F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md) |
| Staging validation | [`RC1_STAGING_VALIDATION.md`](RC1_STAGING_VALIDATION.md) |
| Validation commands | [`VALIDATION_PLAYBOOK.md`](VALIDATION_PLAYBOOK.md) |
| Git safety | [`GIT_SAFETY_GUIDE.md`](GIT_SAFETY_GUIDE.md) |
| Mock / demo integrity | [`F28_DEMO_DATA_MOCK_MODE_EXCELLENCE.md`](F28_DEMO_DATA_MOCK_MODE_EXCELLENCE.md) |

**Verify (common):** `npm run mock:verify` · `npm run typecheck` · `npm run lint` · `npm run build` · sector/ERP/reports/tasks/runtime verifies as in [`H1_PRODUCT_POLISH_DEMO_REHEARSAL.md`](H1_PRODUCT_POLISH_DEMO_REHEARSAL.md).

**ProCrow demo (J8):** `npm run procrow-demo:verify` · `npm run procrow:verify` · full batch in [`PROCROW_DEMO_RUNBOOK.md`](PROCROW_DEMO_RUNBOOK.md).

**Tenant Runtime demo (K1):** `npm run tenant-demo:verify` · `npm run runtime:verify` · full batch in [`TENANT_RUNTIME_DEMO_RUNBOOK.md`](TENANT_RUNTIME_DEMO_RUNBOOK.md).
