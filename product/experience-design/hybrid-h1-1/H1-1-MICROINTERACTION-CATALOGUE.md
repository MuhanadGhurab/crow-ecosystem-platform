# H1.1 — Microinteraction Catalogue

| Field | Value |
|-------|-------|
| **Status** | FOUNDER-REQUESTED REVISION |

| Interaction | Purpose | Trigger | Duration | Reduced-motion | Keyboard / SR |
|-------------|---------|---------|----------|----------------|---------------|
| hover | affordance | pointer | 120ms | instant border | n/a |
| focus | location | Tab | 120ms | ring only | visible ring |
| active | press | pointer/key | 100ms | opacity | Space/Enter |
| disabled | unavailable | state | — | — | `aria-disabled` |
| loading | wait | async | pulse 1.2s | static label | live polite |
| saving | persist | write | chip 280ms | instant synced | status |
| saved / synced | confirm | after save | — | — | status |
| conflict | conflict | version | — | — | assertive optional |
| new / unread signal | attention | feed | 150ms | badge only | live polite |
| drawer open/close | panel | click/Esc | 220ms | instant | trap + restore |
| modal open/close | overlay | action/Esc | 220ms | instant | trap |
| Horizon focus | explore | focus/hover | 180ms | show desc | focusable |
| decision select | choose | click/key | 150ms | pressed | button |
| decision confirm | commit | confirm | 200ms | instant apply | announce |
| topology update | consequence | decision | 300–600ms | instant + text | live polite |
| risk escalation | warn | state | toast + band | band only | live |
| Crowprint reveal | ceremony | enter | ≤1200ms skip | staged static | skip control |
| Echo split | divergence | action | 400–800ms | instant fork | labeled |
| Route unlock | advisory | debrief | 220ms | show actions | focusable |
| return to world | exit | CTA | 320ms skip | navigate | link |

No infinite animation on primary controls.
