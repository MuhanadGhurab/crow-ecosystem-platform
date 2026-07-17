# Client Route Performance Audit (DISCOVERY.2B)

## Findings

| Area | Issue | Mitigation |
|------|-------|------------|
| Field search | Would query DB per keystroke | Precomputed in-memory catalog index |
| Design journey | Large step bundle | Mode-gated steps reduce normal-path render |
| Client pages | No loading boundary | Added `loading.tsx` segments |
| Catalog init | Cold tokenization | `buildBusinessFieldSearchIndex()` memoized |

## Not changed

Authority checks remain sequential and authoritative — not weakened for speed.

## Measurements

Catalog index build: in-process, <50ms for ~100 fields on dev hardware (not a production SLA).

Bundle impact: business-field-catalog added as static module; search runs client-side after hydration.
