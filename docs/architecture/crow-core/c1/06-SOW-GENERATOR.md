# 06 — SOW Generator

**Package:** `src/lib/crow-core/commercial-intelligence/sow-generator.ts`

## Contract

- **22 sections** aligned with `SOW_SECTION_KEYS` in `commercial/index.ts`
- Input: normalized `EnterpriseBlueprintDocument` + commercial assumptions
- Output: `{ draft: SowDraft, warnings: string[] }`

## Behavior

- Missing slice data → section omitted or warning — **no invented legal text**
- Manual-edit markers preserved via `sow-validation.ts`
- Source references tie sections to blueprint slice IDs where available

## Advisory

All SOW drafts are **advisory drafts** — human legal review required before client delivery.

## Distinction from proposal flow

Existing `commercial.service` / proposal token flow remains authoritative for client approval. C1 SOW generator prepares internal drafts only.
