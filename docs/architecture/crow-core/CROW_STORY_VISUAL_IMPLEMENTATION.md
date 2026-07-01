# CROW.STORY.VISUAL.1 — Visual Implementation Evidence

**Status:** Seven-chapter scroll-scrubbed visual story  
**Route:** `/experience/architects-map`

## Root cause of P1A visual failure

1. **foreignObject Crow** — HTML inside SVG failed to render visibly in the operating map.
2. **Crow off viewBox** — entrance position `x=1280` clipped outside `0–1200`.
3. **Chapters 3–7 placeholder** — preview boundary instead of animated sections.
4. **CSS transitions on scroll** — fought native scroll scrubbing.
5. **Single-chapter projection** — map did not accumulate chapter state.

## Architecture

| Layer | File |
|-------|------|
| Scroll engine | `use-story-scroll-engine.ts` — IO + rAF + passive scroll |
| Interpolation | `interpolation.ts` |
| Projection | `projection.ts` — `projectFullStoryState()` |
| Crow actor | `crow-story-crow-svg.tsx` — native SVG from `CROW_ARMOR_PLATES` |
| Stage | `crow-story-operating-map.tsx` — layered continuous world |

## Certification database

`CERTIFICATION_RUNTIME_DATABASE` = `wbwnsndcxrgyqwppurms` (verified; prior `snds` typo in report was incorrect).

## Owner review

Use certification visual review panel on story route for chapter jump, progress scrub, and pose inspection.
