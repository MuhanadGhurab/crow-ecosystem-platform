# Client Intake Simplification (CROW.DISCOVERY.2B)

## Problem

Real user testing found excessive questions, poor field discovery, forced inaccurate field selection, and missing navigation/loading feedback.

## Solution

Lean quick intake separates essential client questions from ProCrow Discovery:

1. Business field (search-first universal catalog)
2. Business purpose
3. Team size and growth intention
4. Configuration mode (Recommend / Guide / Expert)
5. Crow recommendations (read-only in normal mode)
6. Review and submit

## Question classification

| Class | Examples |
|-------|----------|
| ESSENTIAL_INITIAL | field, purpose, team, mode |
| OPTIONAL_INITIAL | client notes |
| GUIDED_ONLY | capability checkboxes |
| EXPERT_ONLY | priority, compare, customize |
| PROCROW_DISCOVERY | branches, security packs, integrations |
| REMOVE | legacy 10-step always-visible ERP builder |
| DEFERRED | approval depth, SAREA, CyberCrow policy packs |

Normal mode: **6 steps**. Expert mode adds controlled/advanced steps.

## Custom field fallback

"I cannot find my business" stores plain-language description, suggested matches, and `requiresProcrowFieldReview` without blocking progress.

## No side effects

Initial submission does not create Blueprint, tenant, membership, or authority grants.
