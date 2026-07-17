# Public Experience Direction

| Field | Value |
|-------|-------|
| **Title** | Public Experience Direction |
| **Status** | CANONICAL |
| **Authority** | Owner decision — CROW.GOVERNANCE.1 |
| **Last reviewed** | 2026-07-04 |
| **Supersedes** | Scroll-story as approved future direction |
| **Related decisions** | [ADR-011](decisions/ADR-011-public-scroll-story-frozen.md) |
| **Implementation state** | Current homepage PARTIAL; approved v2 NOT implemented |

## Frozen: cinematic scroll-story

| Attribute | Value |
|-----------|-------|
| Status | **FROZEN** — RESEARCH REFERENCE |
| Retirement | Planned after replacement validation |
| Routes | `/experience/architects-map`, homepage preview component |
| Code | `src/lib/crow-story/`, `src/components/crow-story/` |

**Do not remove** in documentation-only milestones. **Do not** treat as the approved future public website.

## Approved public direction

Professional interactive enterprise SaaS website. **The product itself is the visual proof.**

### Presentation order

1. The organizational problem
2. Crow's promise
3. Build New or Transform Existing
4. Understand → Blueprint → Build → Operate
5. Operating Model, Enterprise Blueprint, Operational Tenant
6. Interactive product demonstrations
7. Trust and governance
8. Start the journey

### Approved demonstrations

- New versus Transform selector
- Enterprise Blueprint Explorer
- SAREA Role Lens
- Runtime Work Preview
- Governed Foundation diagram

### Do not lead with

ERP modules, pricing tiers, AI claims, technical architecture, ProCrow internal controls, CyberCrow package names, compliance lists, fake dashboards.

## Brand mark usage

**May use as:** logo, watermark, section identifier, CyberCrow trust glyph, empty-state illustration.

**Must not use as:** flying guide, page protagonist, form mascot, constant animated character.

## Approved homepage structure (not yet implemented)

1. Hero
2. Crow Begins Differently
3. How Crow Works
4. Build New or Transform Existing
5. From Blueprint to Workspace
6. One Governed Foundation
7. Final CTA

**CROW.GOVERNANCE.1 does not implement this homepage.**

## Current public homepage

`src/app/(public)/page.tsx` — hero, architects-map preview (frozen story link), how-it-works, three workspaces, runtime engines, trust, discovery/blueprint, roadmap, CTA. Partial alignment with approved direction.

## Related documents

- [`CROW_STORY_P1A_ARCHITECTURE.md`](../architecture/crow-core/CROW_STORY_P1A_ARCHITECTURE.md) (frozen reference)
- [`CROW_PUBLIC_WEB_1A_VISUAL_ACCEPTANCE.md`](../architecture/crow-core/CROW_PUBLIC_WEB_1A_VISUAL_ACCEPTANCE.md)
- [`09-PUBLIC-EXPERIENCE.md`](09-PUBLIC-EXPERIENCE.md) — this document
