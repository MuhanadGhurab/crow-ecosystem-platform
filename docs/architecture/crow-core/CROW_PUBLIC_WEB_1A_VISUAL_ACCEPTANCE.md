# CROW.PUBLIC.WEB.1A — Public Homepage Visual Acceptance Evidence

**Milestone:** Coded homepage vertical slice for owner visual acceptance  
**Preview route:** `/preview/public-home` (certification-only)  
**Branch:** `feat/first-tenant-golden-path`

## Scope delivered

- Seven-section enterprise homepage prototype in `src/components/public-v2/`
- Certification-gated preview at `src/app/preview/public-home/`
- Isolated preview navigation (does not replace global public header)
- Representative static data only — no database writes
- `noindex, nofollow` metadata on preview route

## Sections

1. Hero — four-stage operating model diagram
2. Crow Begins Differently — balanced comparison
3. How Crow Works — six-step click lifecycle explorer
4. Build New or Transform Existing — JourneyKind NEW / TRANSFORM cards
5. From Blueprint to Workspace — Blueprint (5 tabs) + SAREA (5 roles) + Runtime (5 areas)
6. One Governed Foundation — CEM, CyberCrow, SAREA, ProCrow layered diagram
7. Final CTA — Discuss Your Organization → `/request`

## Verification gates

```bash
npm run public-v2-preview-readiness:test
npm run public-v2-bundle-containment:verify
npm run typecheck
npm run lint
npm run build:certification
```

## Owner visual checklist

- [ ] Hero readable within one desktop viewport
- [ ] Operating model diagram understandable in ~3 seconds
- [ ] Lifecycle explorer active state obvious beyond color
- [ ] Blueprint / SAREA / Runtime feel like one product progression
- [ ] Foundation diagram shows one organization, four coordinated responsibilities
- [ ] No flying Crow, scroll storytelling, or generic ERP module cards
- [ ] Mobile layout stacks without horizontal overflow

## Pending canonical routes

- `/new-organization` — not yet implemented; preview uses in-page journey anchors
- `/transform-existing` — not yet implemented; preview uses in-page journey anchors

## Owner acceptance

Visual acceptance remains with the product owner. This document records implementation evidence only.
