# Discovery Engine — Adaptive Organizational Intelligence

The **Discovery Engine** is the structured intelligence layer of the Crow Ecosystem Platform. It captures how an organization actually works—org structure, roles, workflows, security posture, integrations, and experience expectations—using **predictive templates** (sensible defaults and sector-aware starting points) that the **client validates** step by step.

Discovery is not a black-box “AI audit.” It is a guided, transparent process: suggested answers and patterns accelerate data entry, while stakeholders remain in control of what is recorded. Outputs feed the **Enterprise Blueprint**, which in turn drives provisioning, CyberCrow initialization, SAREA experience setup, and go-live readiness.

## What discovery produces

| Output | Used by |
|--------|---------|
| `modules.confirmedKeys` | Blueprint modules, tenant `OrganizationModule`, ERP ops seed (`tenant-ops-seed.service`) |
| Departments, branches, roles | CEM org structure via `seedTenantCemFromDiscovery` |
| Workflows (names + descriptions) | Blueprint workflows → tenant workflows at provision |
| Identity / security answers | Readiness checks, CyberCrow baseline |
| `experience.sareaPackageKey` + personas | SAREA profiles and navigation |
| `experience.aiExtras` | Logistics hub feature flags, pricing line items |
| Industry (`request.industry`) | Industry pack selection (`logistics`, `retail`, …) |

## Industry templates

`discovery-template.service` and packs under `src/lib/erp/industry-packs/` provide sector-aware defaults. MEEM uses the **logistics** pack as the lighthouse; additional packs (e.g. retail) extend the same `enrichTenantOps(tenantId, { industryKey, moduleKeys })` path without customer-specific code.

## CLI and provision hooks

| Command / env | Behavior |
|---------------|----------|
| Discovery UI | `/discovery/[requestId]/*` — persists answers; read-only after blueprint build |
| `TENANT_OPS_SEED=true` | After go-live, `enrichTenantFromBlueprint` seeds ERP sample rows |
| `npm run db:seed:tenant:ops -- --tenant=<slug>` | Idempotent ops enrichment for any live tenant |
| `npm run db:seed:meem` | Full MEEM pipeline + module alignment (`MEEM_MODULE_KEYS`) |

## Golden rule

**Discovery understands. Blueprint defines. CEM runs. CyberCrow protects. SAREA adapts.**

For product vocabulary shared with implementation pipelines, see `src/lib/constants/lifecycle-states.ts` and `docs/ARCHITECTURE_DOMAINS.md`. ERP module registry and backlog: [`ERP_ROADMAP.md`](ERP_ROADMAP.md).
