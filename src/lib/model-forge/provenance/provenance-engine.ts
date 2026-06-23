import type { ProvenanceRecord, ProvenanceChain, ProvenanceSource, RecommendationStrength } from "./provenance-types";

const records = new Map<string, ProvenanceRecord[]>();

function pathKey(path: string): string {
  return path;
}

export function clearProvenanceRegistry(): void {
  records.clear();
}

export function registerProvenance(record: ProvenanceRecord): void {
  const key = pathKey(record.target.path);
  const list = records.get(key) ?? [];
  list.push(record);
  records.set(key, list);
}

export function createProvenanceRecord(
  target: ProvenanceRecord["target"],
  recommendation: string,
  reason: string,
  opts: {
    sources?: ProvenanceSource[];
    catalogRefs?: string[];
    userInputs?: string[];
    rules?: ProvenanceRecord["rules"];
    strength?: RecommendationStrength;
    unresolved?: boolean;
  } = {},
): ProvenanceRecord {
  const id = `prov_${target.path.replace(/[^a-z0-9]+/gi, "_")}_${records.size}`;
  const record: ProvenanceRecord = {
    id,
    target,
    recommendation,
    reason,
    sources: opts.sources ?? ["CATALOG_ENTRY"],
    catalogRefs: opts.catalogRefs ?? [target.key],
    userInputs: opts.userInputs ?? [],
    rules: opts.rules ?? [],
    strength: opts.strength ?? "RECOMMENDED",
    unresolved: opts.unresolved ?? false,
    advisory: true,
  };
  registerProvenance(record);
  return record;
}

export function getProvenanceForNode(graphNodeId: string): ProvenanceRecord[] {
  return [...(records.get(graphNodeId) ?? []), ...(records.get(`graph:${graphNodeId}`) ?? [])];
}

export function getProvenanceForBlueprintPath(path: string): ProvenanceRecord[] {
  return records.get(path) ?? [];
}

export function traceRecommendationUpstream(path: string, depth = 5): string[] {
  const seen = new Set<string>();
  const queue = [path];
  const upstream: string[] = [];
  while (queue.length > 0 && upstream.length < depth * 4) {
    const p = queue.shift()!;
    if (seen.has(p)) continue;
    seen.add(p);
    for (const r of records.get(p) ?? []) {
      for (const ref of r.catalogRefs) upstream.push(ref);
      for (const ui of r.userInputs) upstream.push(`input:${ui}`);
      for (const rec of r.rules) upstream.push(`rule:${rec.ruleId}`);
    }
    for (const [k, recs] of records) {
      if (recs.some((r) => r.catalogRefs.some((c) => path.includes(c) || c === path))) {
        if (!seen.has(k)) queue.push(k);
      }
    }
  }
  return [...new Set(upstream)].sort();
}

export function traceRecommendationDownstream(path: string): string[] {
  const downstream: string[] = [];
  for (const [k, recs] of records) {
    if (recs.some((r) => r.catalogRefs.includes(path) || r.userInputs.includes(path))) {
      downstream.push(k);
    }
  }
  return [...new Set(downstream)].sort();
}

export function buildProvenanceChain(path: string): ProvenanceChain {
  return {
    targetPath: path,
    records: getProvenanceForBlueprintPath(path),
    upstreamPaths: traceRecommendationUpstream(path),
    downstreamPaths: traceRecommendationDownstream(path),
  };
}

export function listAllProvenanceRecords(): ProvenanceRecord[] {
  return [...records.values()].flat();
}

export function countUnexplainedTargets(expectedPaths: string[]): string[] {
  return expectedPaths.filter((p) => (records.get(p)?.length ?? 0) === 0);
}
