# CYBERCROW UX review — Phase 2 exit / Phase 3 entry

**Date:** May 2026  
**Context:** UI-only demo (`AUTH_DISABLED=true`, `USE_MOCK_DATA=true`) after commercial pipeline styling pass.

---

## Scores (1–10)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **User-centered design** | **8** | Clear Request → Discovery → Blueprint → Proposal story; three engines (CEM / CyberCrow / SAREA) visible via entity blocks, dept chips, and lifecycle strip. Role affordances are implied (Crow admin vs client proposal) but not enforced in UI-only mode. |
| **Visual design consistency** | **8** | `cc-glass-card`, entity tints, and `PublicPageHeader` patterns align with [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md). Minor drift: some discovery sub-pages still plain before entity-header pass; blueprint engine tabs now aligned. |
| **Navigation & information architecture** | **7** | EntityHub and area shells separate public / admin / discovery / blueprint well. Discovery sidebar was missing identity/integrations/experience (fixed). Pipeline jump from `mock-req-001` to blueprint requires knowing `mock-req-003` unless admin links are used. |
| **Accessibility basics** | **6** | Progress bar has `role="progressbar"` and chip nav has `aria-label`. Spot-check: contrast on slate-500 helper text is borderline on deep background; focus rings exist on primary controls but not uniformly on all custom chips. Form labels present on discovery forms; proposal page is readable. |
| **Content clarity** | **8** | [`PRODUCT_NARRATIVE.md`](PRODUCT_NARRATIVE.md) keeps 3-engine story on public pages; no 10-layer leak on `/` or `/architecture`. Commercial copy distinguishes catalog `/pricing` vs deal SOoR on blueprint pricing. |
| **Commercial flow** | **8** | Request list → detail estimate → blueprint pricing rail → full pricing workspace → proposal CTA works with mocks. Send-proposal action still needs DB; demo uses pre-seeded `mock-proposal-demo`. |
| **Empty / loading / error states** | **6** | Mock fallbacks avoid hard 404s on pipeline URLs. Tenant-dependent blueprint tabs show honest “provision first” copy. Discovery save failures without DB are not surfaced with a dedicated banner (forms may error opaquely). |
| **Overall usability (demo without DB)** | **8** | End-to-end walkthrough viable with documented mock IDs; health endpoint confirms `mockData`. |

**Overall weighted usability for demo:** **7.6 / 10** (rounded **8** for stakeholder demos).

---

## Strengths

1. **Entity-colored commercial story** — Pricing hero, proposal page, and blueprint engine tabs make CEM / CyberCrow / SAREA costs and scope legible without opening internal architecture docs.
2. **Pipeline affordances** — Lifecycle strip, dept chips, filter chips on `/admin/requests`, and sticky pricing rail on blueprint overview support Crow Admin narrative.
3. **North-star alignment** — Public homepage bento and architecture page reinforce Request → Go-live without overwhelming module matrix.
4. **Mock layer maturity** — `mock-bp-001`, discovery context, and proposal token allow repeatable demos when Supabase/Postgres is paused.
5. **Discovery handoff** — Summary page CTA to blueprint overview/pricing closes the loop from discovery to commercial control room.

---

## Improvements

1. **Single demo entry card** — On `/admin/overview` or requests list, one “Start UI-only demo” panel linking the full mock path would reduce doc dependency.
2. **Discovery write path without DB** — Read-only mocks work; adding `?demo=1` toast (“changes not saved — connect Postgres”) on form submit would set expectations.
3. **Accessibility pass** — Increase helper text contrast (`text-slate-400` minimum on `cc-deep`), ensure visible `:focus-visible` on `cc-discovery-step-chip` and filter chips.
4. **Blueprint tab identity/integrations shells** — Still thin vs engine tabs; Phase 3 todo to mirror discovery summary read-only.
5. **Proposal actions in mock mode** — Approve/decline client actions call DB; disable or stub with banner in `USE_MOCK_DATA` mode.

---

## Priority fixes before Phase 3 (DB-optional first)

| Priority | Item | Status |
|----------|------|--------|
| P0 | Document + wire mock blueprint/pricing/proposal URLs | Done — see [`BASELINE.md`](BASELINE.md) |
| P0 | Discovery sidebar: identity, integrations, experience | Done |
| P1 | Summary → blueprint handoff CTA | Done |
| P1 | Entity headers on discovery + blueprint engine tabs | Done |
| P2 | Mock save UX banner on discovery forms | Open |
| P2 | Persist SAREA line on live `pricing.service` refresh | Blocked on DB |
| P2 | Discovery Postgres save/load for all steps | Blocked on DB |

---

## DB blockers (Phase 3 remainder)

- Discovery form mutations (`upsertDiscoveryAnswer`, departments, experience, etc.) require Postgres.
- `refreshRequestPricingEstimate()` persisting SAREA from discovery experience tier.
- `sendCommercialProposal` / client approve-decline on live tokens.
- Blueprint `identity` / `integrations` read-only pages pulling live discovery aggregates.

---

*Review based on code inspection, design system docs, and mock demo path verification. Re-score after Phase 4 go-live tenant demos.*
