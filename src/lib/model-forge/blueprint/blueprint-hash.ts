export function stableStringify(value: unknown): string {
  return JSON.stringify(value, replacer);
}

function replacer(_key: string, val: unknown): unknown {
  if (val && typeof val === "object" && !Array.isArray(val)) {
    const sorted: Record<string, unknown> = {};
    for (const k of Object.keys(val as object).sort()) {
      sorted[k] = (val as Record<string, unknown>)[k];
    }
    return sorted;
  }
  return val;
}

/** Deterministic djb2 hash for blueprint content (no timestamps). */
export function hashBlueprintContent(value: unknown): string {
  const s = stableStringify(stripNonDeterministic(value));
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(16).padStart(8, "0");
}

function stripNonDeterministic(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripNonDeterministic);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (
        k === "generatedAtDisplay" ||
        k === "generatedAt" ||
        k === "contentHash" ||
        k === "sourceModelHash" ||
        k === "validation"
      ) {
        continue;
      }
      out[k] = stripNonDeterministic(v);
    }
    return out;
  }
  return value;
}

const SECRET_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /api[_-]?key/i,
  /bearer/i,
  /authorization/i,
  /@.+\..+/,
];

export function containsSecretShapedField(obj: unknown, path = ""): string[] {
  const hits: string[] = [];
  if (obj && typeof obj === "object") {
    if (Array.isArray(obj)) {
      obj.forEach((v, i) => hits.push(...containsSecretShapedField(v, `${path}[${i}]`)));
    } else {
      for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
        const p = path ? `${path}.${k}` : k;
        if (SECRET_PATTERNS.some((re) => re.test(k)) && typeof v === "string" && v.length > 0) {
          hits.push(p);
        }
        hits.push(...containsSecretShapedField(v, p));
      }
    }
  }
  return hits;
}

const DB_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function containsDatabaseIds(obj: unknown, path = ""): string[] {
  const hits: string[] = [];
  if (typeof obj === "string" && DB_ID_PATTERN.test(obj)) hits.push(path || "root");
  if (obj && typeof obj === "object") {
    if (Array.isArray(obj)) {
      obj.forEach((v, i) => hits.push(...containsDatabaseIds(v, `${path}[${i}]`)));
    } else {
      for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
        if (k === "id" || k.endsWith("Id") || k.endsWith("_id")) {
          if (typeof v === "string" && DB_ID_PATTERN.test(v)) hits.push(path ? `${path}.${k}` : k);
        }
        hits.push(...containsDatabaseIds(v, path ? `${path}.${k}` : k));
      }
    }
  }
  return hits;
}
