# CROW.PUBLIC.2 — Full Public Experience Redesign

| Field | Value |
|-------|-------|
| **Milestone** | CROW.PUBLIC.2 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Status** | Deployed to certification — owner visual acceptance pending |
| **Production** | Not deployed (not authorized) |
| **PR #10** | OPEN, DRAFT, unmerged |

## Owner reason

CROW.PUBLIC.1A and 1B left the **reachable** public surface on legacy dark marketing pages. Owner required the old public look removed from reachable routes and replaced with the bright, service-aligned Crow identity on the feature branch — not preview-only.

## Route disposition table

| Route | Prior state | Decision | Target |
|-------|-------------|----------|--------|
| `/` | Legacy dark homepage + Architect's Map preview | **REPLACE** | Bright seven-section `PublicHomepage` |
| `/how-crow-works` | Missing | **REBUILD** | Five-gate lifecycle page |
| `/new-organization` | Missing | **REBUILD** | Build-new journey page |
| `/transform-existing` | Missing | **REBUILD** | Transform journey page |
| `/enterprise-blueprint` | Missing | **REBUILD** | Blueprint domains + provenance |
| `/platform` | Missing | **REBUILD** | Platform overview |
| `/platform/cem` | Missing | **REBUILD** | CEM capabilities page |
| `/platform/cybercrow` | Missing | **REBUILD** | Operational trust page |
| `/platform/sarea` | Missing | **REBUILD** | Presentation adaptation page |
| `/platform/procrow` | Missing | **REBUILD** | Lifecycle governance page |
| `/security` | Legacy dark page | **REPLACE** | Bright assurance page |
| `/industries` | Legacy module-catalog tone | **REPLACE** | Operating-model sectors |
| `/start` | crow-story `StartPageClient` | **REPLACE** | Bright journey chooser |
| `/request` | Dark glass entry | **REFRESH** | Bright copy; auth gate unchanged |
| `/login`, `/signup` | Dark starfield shell | **REFRESH** | `PublicAuthFrame`; auth logic unchanged |
| `/pricing` | Generic tier cards | **REPLACE** | Scope-aware commercial explanation |
| `/case-studies` | Placeholder proof | **DEFER** | Honest deferred page |
| `/about` | Legacy about | **REDIRECT** | `/platform` |
| `/architecture` | Legacy | **REDIRECT** | `/how-crow-works` |
| `/modules` | ERP module grid | **REDIRECT** | `/platform/cem` |
| `/services` | Legacy | **REDIRECT** | `/how-crow-works` |
| `/clients` | Legacy | **REDIRECT** | `/industries` |
| `/loyalty-programs` | Legacy | **REDIRECT** | `/how-crow-works` |
| `/experience/architects-map` | Scroll story | **REDIRECT** | `/how-crow-works` (code frozen) |
| `/experience/architects-map/article` | Story article | **REDIRECT** | `/how-crow-works` |
| `/preview/public-home` | Cert preview | **REDIRECT** | `/` on certification hosts |

## Pages rebuilt

All canonical routes listed above under **REBUILD** / **REPLACE**.

## Navigation and footer

- Desktop: Platform, How Crow Works, Enterprise Blueprint, Solutions, Security, Start Designing, Sign In
- Mobile: accordions + Start Designing action
- Footer: canonical links only — no modules-first, story, or architecture links

## Client journey handoff

- Build New: `/new-organization` → `buildSignupHandoffUrl("NEW")` → `/signup?journey=new&next=...`
- Transform: `/transform-existing` → `buildSignupHandoffUrl("TRANSFORM")`
- Discuss: `/request` (auth gate preserved)
- Helpers: `src/lib/public/journey-handoff.ts` — URL builders only, no state writes

## Commercial / subscription / CroAI presentation

- Scope-aware commercial model on `/pricing` — no fake prices
- Monthly tenant subscription described as post-build service phase
- CroAI optional add-on — advisory, not operational; never grants authority
- No payment or CroAI runtime claims

## Protected boundaries (unchanged)

No changes to: schema, migrations, hosted business data, auth behavior, Request/Discovery/Blueprint persistence, tenant provisioning, RBAC, SAREA/CyberCrow authority, commercial runtime, CroAI runtime.

## Tests

```bash
npm run public-route-architecture:test
npm run public-v2-preview-readiness:test
npm run public-v2-bundle-containment:verify
npm run typecheck
npm run lint
npm run build
```

## Certification deployment

Project: `crow-ftgp-certification`  
Script: `npm run ftgp-certification-production:deploy`

## Known limitations

- Auth form controls retain some legacy `cc-` styling inside bright frame
- `/register` route not visually refreshed (out of milestone scope)
- Story experiment code remains in repo; routes redirect away from public nav

## Owner visual checklist

- [ ] `/` shows bright seven-section homepage — no Architect's Map preview
- [ ] No dark starfield on public layout
- [ ] Build New / Transform Existing clear on homepage and `/start`
- [ ] Platform pages read as one foundation
- [ ] Legacy `/modules`, `/architecture`, `/services` redirect correctly
- [ ] Login/signup feel aligned with bright identity
- [ ] No fake case studies or SaaS tier pricing

## Next milestone options

- **CROW.PUBLIC.3** — Owner acceptance fixes or `/register` visual alignment
- **CROW.PUBLIC.PROD** — Production promotion (explicit owner authorization only)
