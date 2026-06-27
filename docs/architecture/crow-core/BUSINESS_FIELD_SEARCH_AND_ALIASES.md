# Business Field Search and Aliases

## Search implementation

- Precomputed normalized token index (`buildBusinessFieldSearchIndex`)
- Local search only — no database queries per keystroke
- Debounced input (120ms) in UI
- Bounded result sets (default limit 24)

## Supported matching

- English and Arabic aliases
- Common business phrases and example businesses
- Partial-word and prefix matching
- Minor misspellings (Levenshtein distance ≤ 2 on names; explicit misspelling list)

## Custom-field fallback

**I cannot find my business** opens a plain-language description field. Client may continue without accepting a catalog match. Suggested matches are optional.

## Hybrid fields

One primary field plus optional secondary fields via checkbox on result cards.

## Tests

`npm run business-field-catalog:test`
