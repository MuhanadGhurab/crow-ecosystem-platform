import { CATEGORY_BY_KEY } from "./categories";
import { BUSINESS_FIELD_CATALOG } from "./fields";
import type { BusinessFieldDefinition, BusinessFieldSearchResult } from "./types";

export type NormalizedFieldIndex = {
  field: BusinessFieldDefinition;
  tokens: string[];
  normalizedName: string;
};

let cachedIndex: NormalizedFieldIndex[] | null = null;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  const n = normalize(text);
  if (!n) return [];
  const words = n.split(" ").filter(Boolean);
  const tokens = new Set<string>(words);
  for (const w of words) {
    if (w.length > 3) tokens.add(w.slice(0, 4));
  }
  return [...tokens];
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }
  return row[b.length]!;
}

export function buildBusinessFieldSearchIndex(): NormalizedFieldIndex[] {
  if (cachedIndex) return cachedIndex;
  cachedIndex = BUSINESS_FIELD_CATALOG.map((field) => {
    const parts = [
      field.displayNameEn,
      field.displayNameAr ?? "",
      field.description,
      ...field.aliasesEn,
      ...field.aliasesAr,
      ...field.misspellings,
      ...field.searchKeywords,
      ...field.exampleBusinesses,
    ];
    const tokens = [...new Set(parts.flatMap(tokenize))];
    return { field, tokens, normalizedName: normalize(field.displayNameEn) };
  });
  return cachedIndex;
}

export function resetBusinessFieldSearchIndexCache(): void {
  cachedIndex = null;
}

function scoreField(
  entry: NormalizedFieldIndex,
  queryTokens: string[],
  normalizedQuery: string,
): { score: number; reason: string } | null {
  let score = 0;
  let reason = "keyword match";
  const { field, tokens, normalizedName } = entry;

  if (normalizedQuery && normalizedName === normalizedQuery) {
    return { score: 100, reason: "exact name match" };
  }
  if (normalizedQuery && field.aliasesEn.some((a) => normalize(a) === normalizedQuery)) {
    return { score: 150, reason: "exact English alias" };
  }
  if (normalizedQuery && field.aliasesAr.some((a) => normalize(a) === normalizedQuery)) {
    return { score: 150, reason: "exact Arabic alias" };
  }
  const firstWord = normalizedName.split(" ")[0] ?? "";
  if (normalizedQuery && firstWord === normalizedQuery) {
    score += 75;
    reason = "first word match";
  } else if (normalizedQuery && normalizedName.includes(normalizedQuery)) {
    score += 35;
    reason = "name contains query";
  }

  for (const alias of [...field.aliasesEn, ...field.aliasesAr, ...field.misspellings]) {
    const na = normalize(alias);
    if (na === normalizedQuery) return { score: 95, reason: "exact alias match" };
    if (normalizedQuery && na.includes(normalizedQuery)) {
      score += 45;
      reason = "alias contains query";
    }
  }

  for (const kw of field.searchKeywords) {
    const nk = normalize(kw);
    if (nk === normalizedQuery) {
      score += 70;
      reason = "keyword exact match";
    } else if (normalizedQuery && nk.includes(normalizedQuery)) {
      score += 25;
    }
  }

  for (const qt of queryTokens) {
    if (tokens.some((t) => t === qt || t.startsWith(qt) || qt.startsWith(t))) {
      score += 15;
    }
    if (normalize(field.description).includes(qt)) score += 5;
    for (const ex of field.exampleBusinesses) {
      if (normalize(ex).includes(qt)) score += 8;
    }
  }

  // Multi-token queries: reward fields matching more distinct query tokens in name/aliases
  if (queryTokens.length > 1) {
    let tokenHits = 0;
    for (const qt of queryTokens) {
      const inName = normalizedName.includes(qt);
      const inAlias = [...field.aliasesEn, ...field.aliasesAr].some((a) => normalize(a).includes(qt));
      if (inName || inAlias) tokenHits += 1;
    }
    score += tokenHits * 12;
    if (tokenHits < queryTokens.length && queryTokens.includes("law") && !normalizedName.includes("law") && !field.aliasesEn.some((a) => normalize(a).includes("law"))) {
      score -= 20;
    }
  }

  // Minor misspelling tolerance against name
  if (normalizedQuery.length >= 4) {
    const dist = levenshtein(normalizedQuery, normalizedName);
    if (dist <= 2) {
      score += 35 - dist * 10;
      reason = "fuzzy name match";
    }
    for (const ms of field.misspellings) {
      if (normalize(ms) === normalizedQuery) {
        score += 55;
        reason = "misspelling alias";
      }
    }
  }

  // Deprioritize overly broad retail when query signals specialist intent
  const specialistSignals = [
    "game",
    "gaming",
    "esport",
    "clinic",
    "dental",
    "veterinary",
    "legal",
    "law",
    "cyber",
    "security",
    "construction",
    "contractor",
    "restaurant",
    "cafe",
    "hotel",
    "travel",
    "umrah",
    "hajj",
    "laboratory",
    "lab",
    "gym",
    "salon",
    "car wash",
    "warehouse",
    "delivery",
    "content creator",
    "influencer",
  ];
  const genericKeys = new Set(["retail_store", "software_saas", "management_consulting"]);
  if (genericKeys.has(field.key) && specialistSignals.some((s) => normalizedQuery.includes(s))) {
    score -= 30;
  }

  // Boost specialist categories over parent roll-ups when tokens align
  if (field.parentFieldKey && queryTokens.length > 0) {
    score += 8;
  }

  return score > 0 ? { score, reason } : null;
}

export function searchBusinessFields(
  query: string,
  options: { categoryKey?: string; limit?: number } = {},
): BusinessFieldSearchResult[] {
  const limit = options.limit ?? 20;
  const normalizedQuery = normalize(query);
  const queryTokens = tokenize(query);
  if (!normalizedQuery && !options.categoryKey) {
    return BUSINESS_FIELD_CATALOG.slice(0, limit).map((field) => ({
      field,
      category: CATEGORY_BY_KEY.get(field.categoryKey)!,
      score: 0,
      matchReason: "browse",
    }));
  }

  const index = buildBusinessFieldSearchIndex();
  const results: BusinessFieldSearchResult[] = [];

  for (const entry of index) {
    if (options.categoryKey && entry.field.categoryKey !== options.categoryKey) continue;
    const category = CATEGORY_BY_KEY.get(entry.field.categoryKey);
    if (!category) continue;

    if (!normalizedQuery) {
      results.push({ field: entry.field, category, score: 1, matchReason: "category browse" });
      continue;
    }

    const scored = scoreField(entry, queryTokens, normalizedQuery);
    if (scored) {
      results.push({
        field: entry.field,
        category,
        score: scored.score,
        matchReason: scored.reason,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function suggestMatchesForCustomDescription(description: string, limit = 5): BusinessFieldSearchResult[] {
  return searchBusinessFields(description, { limit });
}

export function countSearchableAliases(): number {
  return BUSINESS_FIELD_CATALOG.reduce(
    (n, f) => n + f.aliasesEn.length + f.aliasesAr.length + f.misspellings.length,
    0,
  );
}

export function countArabicAliases(): number {
  return BUSINESS_FIELD_CATALOG.reduce((n, f) => n + f.aliasesAr.length + (f.displayNameAr ? 1 : 0), 0);
}
