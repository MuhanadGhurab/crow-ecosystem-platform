# Business Field Search Relevance (CROW.UAT.1)

Ranking priority in `search.ts`:

1. Exact field name
2. Exact English/Arabic alias (score 150)
3. First-word name match
4. Partial alias / token / fuzzy match
5. Generic field deprioritization when specialist query signals present

Fixtures: `search-relevance-fixtures.ts` — exercised by `npm run business-field-search-relevance:test`.

**Aliases after UAT.1:** 412 searchable (was 328). **Arabic terms:** 117 (was 101).
