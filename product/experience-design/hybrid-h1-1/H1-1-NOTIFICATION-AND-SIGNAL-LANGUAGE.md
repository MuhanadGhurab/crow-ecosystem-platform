# H1.1 — Notification and Signal Language

| Field | Value |
|-------|-------|
| **Status** | FOUNDER-REQUESTED REVISION |
| **Max transient visible** | **2** |

## Classes

| Class | Position | Duration | Persist after dismiss |
|-------|----------|----------|------------------------|
| World Signal | edge band / sky | 5–8s | log / story strip |
| Mission Signal | ribbon | 4–6s | ribbon history |
| RAVEN Guidance | edge panel | until dismiss | note region |
| Save / Sync | chip | state-bound | chip always |
| Risk Escalation | high priority stack | until ack | world-state band |
| Evidence Observation | console-adjacent | 5s | signals list |
| Route Availability | debrief | until action | panel |
| Echo Availability | debrief | until action | panel |

## Policies

- No sound by default · never autoplay audio  
- `aria-live=polite` (assertive only for risk ack)  
- Mobile: stack from top; max 2; swipe/Esc dismiss  
- Reduced-motion: instant appear/fade; no bounce  
- Prototype data must be labeled **بيانات نموذجية / prototype data**  
- Critical info remains in persistent UI after toast vanishes
