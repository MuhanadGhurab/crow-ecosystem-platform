# Hybrid H1 — Implementation Handoff

| Field | Value |
|-------|-------|
| **Status** | FOUNDER-DIRECTED HYBRID — READY FOR FINAL VISUAL REVIEW |
| **Authorization** | **NOT AUTHORIZED** — handoff prepared only |

No Product Code changes in Hybrid H1 materialization. After Founder final visual approval, a **new Founder-authorized Gate** is required (do not invent Gate ID here).

## Future waves (recommended)

| Wave | Focus | Preserve | Tests | Rollback | Exclude |
|------|-------|----------|-------|----------|---------|
| **0** | Remove internal-ID leakage + legacy “LOCAL DEVELOPMENT ONLY” copy | APIs, `data-*` | Locale/copy validations | Revert copy commit | Visual redesign |
| **1** | H1 tokens, typography load, shell, language | Contracts | A11y smoke | Token CSS revert | Mission UX |
| **2** | World Portal + protected Founder entry chrome | Auth rules | Portal a11y | Route/UI revert | Pricing, Live Sky runtime |
| **3** | Activation / Origin / authenticated world chrome | Activation formula | Activation e2e | Screen shell revert | Mission |
| **4** | Black Signal Mission workspace redesign | Mission engine/APIs | Black Signal e2e + `data-*` | UI-only revert | Kernel changes |
| **5** | Crowprint / Lineage / Flight Log / Echo presentation | Crowprint rules | Debrief e2e | UI-only revert | Scoring formula changes |
| **6** | Founder acceptance Preview evidence | Preview isolation | Hosted smoke | Redeploy prior Preview | Production |

Each wave requires: Scope Traceability · Change Request when LOCKED baselines alter · Preview evidence · accessibility acceptance · no Production without separate authorization.

## Styling approach (evidence)

**CSS variables + CSS modules / styled-jsx.** Tailwind and component libraries remain **NOT AUTHORIZED** unless a later Founder Gate says otherwise.
