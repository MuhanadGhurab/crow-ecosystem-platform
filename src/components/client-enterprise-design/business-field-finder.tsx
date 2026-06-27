"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BUSINESS_FIELD_CATEGORIES } from "@/lib/business-field-catalog/categories";
import { searchBusinessFields, suggestMatchesForCustomDescription } from "@/lib/business-field-catalog/search";
import type { BusinessFieldSearchResult } from "@/lib/business-field-catalog/types";

type BusinessFieldFinderProps = {
  selectedPrimaryKey: string | null;
  selectedSecondaryKeys: string[];
  customDescription: string | null;
  showCustomFallback: boolean;
  onSelectPrimary: (fieldKey: string) => void;
  onToggleSecondary: (fieldKey: string) => void;
  onCustomFallback: (description: string, suggestedKeys: string[]) => void;
  onClearCustom: () => void;
};

export function BusinessFieldFinder({
  selectedPrimaryKey,
  selectedSecondaryKeys,
  customDescription,
  showCustomFallback,
  onSelectPrimary,
  onToggleSecondary,
  onCustomFallback,
  onClearCustom,
}: BusinessFieldFinderProps) {
  const [query, setQuery] = useState("");
  const [categoryKey, setCategoryKey] = useState<string | null>(null);
  const [customOpen, setCustomOpen] = useState(showCustomFallback);
  const [customText, setCustomText] = useState(customDescription ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query), 120);
    return () => window.clearTimeout(t);
  }, [query]);

  const results = useMemo(
    () => searchBusinessFields(debouncedQuery, { categoryKey: categoryKey ?? undefined, limit: 24 }),
    [debouncedQuery, categoryKey],
  );

  const customSuggestions = useMemo(() => {
    if (!customText.trim()) return [];
    return suggestMatchesForCustomDescription(customText, 5);
  }, [customText]);

  const handleCustomSubmit = useCallback(() => {
    const desc = customText.trim();
    if (!desc) return;
    onCustomFallback(
      desc,
      customSuggestions.map((s) => s.field.key),
    );
    setCustomOpen(false);
  }, [customText, customSuggestions, onCustomFallback]);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="field-search" className="sr-only">
          Search business fields
        </label>
        <input
          id="field-search"
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by business type, alias, or phrase…"
          className="input-cc w-full"
          autoComplete="off"
          aria-describedby="field-search-hint"
        />
        <p id="field-search-hint" className="mt-1 text-xs text-slate-500">
          Try English or Arabic terms — partial matches and common misspellings work.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="list" aria-label="Browse by category">
        <button
          type="button"
          onClick={() => setCategoryKey(null)}
          className={`rounded-full px-3 py-1 text-xs ${!categoryKey ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-300"}`}
        >
          All categories
        </button>
        {BUSINESS_FIELD_CATEGORIES.slice(0, 12).map((cat) => (
          <button
            key={cat.key}
            type="button"
            role="listitem"
            onClick={() => setCategoryKey(cat.key)}
            className={`rounded-full px-3 py-1 text-xs ${
              categoryKey === cat.key ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-300"
            }`}
          >
            {cat.displayNameEn}
          </button>
        ))}
        <details className="w-full">
          <summary className="cursor-pointer text-xs text-cyan-400">More categories…</summary>
          <div className="mt-2 flex flex-wrap gap-2">
            {BUSINESS_FIELD_CATEGORIES.slice(12).map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategoryKey(cat.key)}
                className={`rounded-full px-3 py-1 text-xs ${
                  categoryKey === cat.key ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-300"
                }`}
              >
                {cat.displayNameEn}
              </button>
            ))}
          </div>
        </details>
      </div>

      <div
        className="grid max-h-[28rem] gap-2 overflow-y-auto sm:grid-cols-2"
        role="listbox"
        aria-label="Business field results"
        aria-busy={query !== debouncedQuery}
      >
        {results.map((r) => (
          <FieldResultCard
            key={r.field.key}
            result={r}
            isPrimary={selectedPrimaryKey === r.field.key}
            isSecondary={selectedSecondaryKeys.includes(r.field.key)}
            onSelectPrimary={() => onSelectPrimary(r.field.key)}
            onToggleSecondary={() => onToggleSecondary(r.field.key)}
          />
        ))}
        {results.length === 0 && (
          <p className="col-span-full text-sm text-slate-400">No matches — try a different phrase or use the fallback below.</p>
        )}
      </div>

      <div className="border-t border-slate-800 pt-4">
        {!customOpen ? (
          <button
            type="button"
            onClick={() => setCustomOpen(true)}
            className="text-sm font-medium text-amber-400 hover:text-amber-300"
          >
            I cannot find my business
          </button>
        ) : (
          <div className="space-y-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
            <p className="text-sm font-medium text-amber-200">Describe what your business does</p>
            <textarea
              className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm"
              rows={3}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="In one or two sentences, what does your business do?"
            />
            {customSuggestions.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Suggested catalog matches (optional):</p>
                {customSuggestions.map((s) => (
                  <button
                    key={s.field.key}
                    type="button"
                    className="block text-left text-xs text-cyan-400 hover:underline"
                    onClick={() => onSelectPrimary(s.field.key)}
                  >
                    {s.field.displayNameEn}
                  </button>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleCustomSubmit} className="cc-btn-primary text-sm">
                Continue with my description
              </button>
              <button type="button" onClick={() => setCustomOpen(false)} className="cc-btn-secondary text-sm">
                Cancel
              </button>
              {customDescription && (
                <button type="button" onClick={onClearCustom} className="cc-btn-secondary text-sm">
                  Clear custom field
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500">
              You can continue without accepting a catalog match. ProCrow will review your description.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldResultCard({
  result,
  isPrimary,
  isSecondary,
  onSelectPrimary,
  onToggleSecondary,
}: {
  result: BusinessFieldSearchResult;
  isPrimary: boolean;
  isSecondary: boolean;
  onSelectPrimary: () => void;
  onToggleSecondary: () => void;
}) {
  const { field, category } = result;
  return (
    <article
      className={`rounded-xl border p-3 text-left motion-safe:transition-colors ${
        isPrimary ? "border-violet-500 bg-violet-950/40" : "border-slate-700 hover:border-slate-500"
      }`}
    >
      <button type="button" onClick={onSelectPrimary} className="w-full text-left">
        <p className="font-medium text-white">{field.displayNameEn}</p>
        {field.displayNameAr && <p className="text-xs text-slate-500">{field.displayNameAr}</p>}
        <p className="mt-1 text-xs text-slate-400 line-clamp-2">{field.description}</p>
        <p className="mt-1 text-xs text-slate-600">{category.displayNameEn}</p>
        {field.exampleBusinesses[0] && (
          <p className="mt-1 text-xs text-slate-500">e.g. {field.exampleBusinesses.slice(0, 2).join(", ")}</p>
        )}
      </button>
      <label className="mt-2 flex items-center gap-2 text-xs text-slate-400">
        <input type="checkbox" checked={isSecondary} onChange={onToggleSecondary} disabled={isPrimary} />
        Also a secondary field
      </label>
      <details className="mt-1">
        <summary className="cursor-pointer text-xs text-slate-600">Advanced details</summary>
        <p className="mt-1 text-xs text-slate-600">
          {field.crosswalk.ssic && `SSIC ${field.crosswalk.ssic}`}
          {field.crosswalk.isic && ` · ISIC ${field.crosswalk.isic}`}
        </p>
      </details>
    </article>
  );
}
