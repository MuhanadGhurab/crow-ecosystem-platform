# Hybrid H1 — Component Grammar

| Field | Value |
|-------|-------|
| **Status** | FOUNDER-DIRECTED HYBRID — READY FOR FINAL VISUAL REVIEW |
| **Note** | Spec only — **do not** create Product Code component files in this task |

For each component: purpose · required content · variants · forbidden · a11y · responsive · state deps · A/B/C informing.

## GHVWorldShell
Purpose: outermost public/authenticated experience frame. Content: landmark regions. Variants: public · protected-preview. Forbidden: admin chrome. A11y: `role=main` / banner / nav. Responsive: full bleed → stacked. State: locale. Informed by: A shell atmosphere · B landmarks.

## GHVWorldHeader
Purpose: minimal chrome (language, sign-in). Forbidden: dense menus, pills. A11y: `banner`. Responsive: collapse secondary. Informed by: B.

## GHVAtmospherePlane
Purpose: full-bleed sky/depth plane. Forbidden: card collage. A11y: decorative or labeled background. Responsive: crop carefully. Informed by: A · selective C entry.

## GHVHorizonMap
Purpose: five Horizons as world regions. Content: Operate/Build/Analyze/Protect/Lead labels. Variants: silhouette · constellation. Forbidden: course cards, pricing. A11y: list/nav. Responsive: wrap. Informed by: A+B+C.

## GHVThresholdAction
Purpose: primary world-entry CTA. Variants: claim-wings · continue. Forbidden: pill sprawl. A11y: button. Informed by: A+C threshold · B clarity.

## GHVRavenPresence
Purpose: calm guide/narrator. Variants: distant · briefing · edge · reflective. Forbidden: mascot spam, chat-on-every-page, destiny authority. A11y: complementary / note. Informed by: A.

## GHVMissionStage
Purpose: Mission scene container. Content: scene identity, progress-without-stepper. Informed by: A stage · B structure.

## GHVTopologyDistrict
Purpose: state-coupled district map. Content: nodes, edges, text summary. Variants: initial · evidence-first · shortcut. Forbidden: decoration-only. A11y: img+figcaption or region with live text. Informed by: A living map · B captions · C environment moments.

## GHVSignalRibbon
Purpose: incoming events. Forbidden: SOC wall of alerts. A11y: log/list. Responsive: drawer on mobile. Informed by: B · A restraint.

## GHVDecisionConsole
Purpose: consequential interventions. Content: choices + expected stakes. Forbidden: quiz styling. A11y: group of buttons, skip link target. Informed by: B.

## GHVConsequenceSummary
Purpose: after-decision readout. A11y: `aria-live=polite`. Informed by: B · A tension.

## GHVWorldStateBand
Purpose: continuity / evidence / risk / debt / trust. Encoding: label + icon/shape + color. Informed by: B.

## GHVSaveState
Purpose: idle · saving · synced · conflict. A11y: status. Informed by: B.

## GHVCrowprintReveal
Purpose: private provisional seal ceremony. Forbidden: quiz scorecard, loot-box, rank-up. Informed by: A ceremony · B boundaries.

## GHVObservedSignals / GHVSuggestedLineage
Purpose: evidence signals and provisional lineage. Informed by: B · A emotional weight.

## GHVFlightLog
Purpose: chronological consequential record. Informed by: B.

## GHVEchoDivergence
Purpose: branch from canonical without rewriting it. Informed by: C spatial · B controls.

## GHVRouteRecommendation
Purpose: advisory next Route + override. Informed by: B.

## GHVExplainableBoundary
Purpose: private/provisional/not-Mastery/not-permanent/not-certificate/not-hiring/not-Earned-Lineage. A11y: note/status. Informed by: B · A gravity.

## GHVLanguageControl
Purpose: AR/EN toggle. Informed by: B.

## GHVAccessibleDrawer
Purpose: mobile signal/RAVEN panels. Focus trap · Esc · restore. Informed by: B.
