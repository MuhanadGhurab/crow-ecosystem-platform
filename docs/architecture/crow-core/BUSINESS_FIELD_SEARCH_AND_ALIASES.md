# Business Field Search and Aliases

## Search features

- English and Arabic aliases
- Partial-word matching on precomputed tokens
- Minor misspelling tolerance (Levenshtein ≤ 2 on names)
- Category browse filter
- Bounded result sets (default 24)
- Local in-memory search — no per-keystroke database queries

## Result display

Each result shows: name, description, category, example businesses. Classification codes only in expandable advanced details.

## Custom fallback

`I cannot find my business` → plain description → optional suggested matches → continue without forced catalog match.

## Hybrid businesses

Primary + secondary field keys supported; secondary industries and specialist domains derived from selections.

Implementation: `src/lib/business-field-catalog/search.ts`, `src/components/client-enterprise-design/business-field-finder.tsx`
