# Hybrid H1 — Arabic Typography and Copy Hierarchy

| Field | Value |
|-------|-------|
| **Status** | FOUNDER-DIRECTED HYBRID — READY FOR FINAL VISUAL REVIEW |
| **Primary locale** | Arabic (RTL) |
| **Target family** | IBM Plex Sans Arabic |
| **Fallbacks** | `"Segoe UI", Tahoma, "Noto Sans Arabic", sans-serif` |
| **Font binaries** | **Not committed** — loading is implementation debt |

## Hierarchy (demonstrate in prototype)

| Level | Use |
|-------|-----|
| Arabic display | Brand / Portal hero |
| Page title | Screen `h1` |
| Section title | Regions |
| Body | Narrative, RAVEN |
| Decision text | Choice labels — slightly emphasized |
| Signal text | Event ribbon |
| Metadata | Save state, timestamps |
| English secondary | Optional subtitle under Arabic — smaller, lower contrast |
| Numerical / technical islands | LTR spans for numbers only |

## Rules

- Avoid mixing Arabic and English hierarchy inside the same copy block.  
- Logical properties (`margin-inline`, `padding-inline`, `inset-inline`).  
- No learner-facing internal IDs (`ACT-*`, `ONB-*`, `IDN-*`, `CAP-*`, `GHV.*`, `DEC-*`, `RISK-*`, `DEP-*`).  
- Product copy remains separately controlled; prototype strings are illustrative.
