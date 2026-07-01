# CROW.STORY.P1A — Architecture

**Status:** P1A vertical slice (Chapters 1–2 animated)  
**Story route:** `/experience/architects-map`  
**Article:** `/experience/architects-map/article`  
**Start:** `/start`

## Story data model

- `src/lib/crow-story/definition.ts` — authoritative seven-chapter copy
- `src/lib/crow-story/projection.ts` — pure `projectCrowStoryState()`
- `src/lib/crow-story/journey-state.ts` — URL-first `JourneyKind` persistence

## Routes

| Route | Role |
|-------|------|
| `/experience/architects-map` | Lazy-loaded interactive story (Ch 1–2 live; 3–7 preview boundary) |
| `/experience/architects-map/article` | SSR article, same copy source |
| `/start` | Skip-story / direct path selection |

## Journey precedence

1. URL `?journey=new|transform`
2. `sessionStorage` (`crow-client-scoped-v1:story-journey`)
3. Request `organizationContext` only after explicit submit

## State cleanup

Cleared on sign-out, successful Request submit, and **Change path** / reset.

## Bundle isolation

Homepage imports only `homepage-architects-map-preview.tsx` (inline SVG). Full story via `next/dynamic`.

## P1A limitations

Chapters 3–7 copy defined but not animated. Owner visual gate required before P1B.
