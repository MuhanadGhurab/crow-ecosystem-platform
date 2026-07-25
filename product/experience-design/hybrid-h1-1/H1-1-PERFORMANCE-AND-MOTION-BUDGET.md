# H1.1 — Performance and Motion Budget

| Field | Value |
|-------|-------|
| **Status** | FOUNDER-REQUESTED REVISION |

## Duration budget

| Tier | Range |
|------|-------|
| Micro | 100–180ms |
| Functional panel | 180–320ms |
| Topology consequence | 300–600ms |
| Ceremonial | 600–1200ms max · skippable |
| Ambient loop | slow · low contrast |

## Concurrency

- Max **3** simultaneous purposeful motions  
- Max **2** continuous ambient animations per viewport  
- No animation blocking interaction > **300ms**  
- Prefer `transform` / `opacity` · avoid layout thrash  

## Prototype / future Product Code targets

No animation framework · no large libs · no uncompressed hero video · lazy non-critical media · pause off-screen · pause when `document.hidden` · Save-Data / mobile / static / reduced-motion fallbacks.

Static prototypes **do not** claim measured production performance.
