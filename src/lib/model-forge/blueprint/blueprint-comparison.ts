import type { BlueprintDiffChange, BlueprintDiffEntry, EnterpriseBlueprintDraft } from "./blueprint-types";

type KeyedItem = { key?: string; workflowKey?: string; states?: string[] };

function diffSection(section: string, keysA: string[], keysB: string[]): BlueprintDiffEntry[] {
  const entries: BlueprintDiffEntry[] = [];
  for (const k of keysB.filter((x) => !keysA.includes(x))) entries.push({ section, change: "ADDED", key: k });
  for (const k of keysA.filter((x) => !keysB.includes(x))) entries.push({ section, change: "REMOVED", key: k });
  for (const k of keysA.filter((x) => keysB.includes(x))) entries.push({ section, change: "UNCHANGED", key: k });
  return entries;
}

function itemKeys(items: readonly KeyedItem[]): string[] {
  return items.map((i) => i.key ?? i.workflowKey ?? "unknown").sort();
}

export function compareEnterpriseBlueprintDrafts(a: EnterpriseBlueprintDraft, b: EnterpriseBlueprintDraft): BlueprintDiffEntry[] {
  const diffs: BlueprintDiffEntry[] = [
    ...diffSection("departments", itemKeys(a.departments.items as KeyedItem[]), itemKeys(b.departments.items as KeyedItem[])),
    ...diffSection("capabilities", itemKeys(a.capabilities.items as KeyedItem[]), itemKeys(b.capabilities.items as KeyedItem[])),
    ...diffSection("entities", itemKeys(a.entities.items as KeyedItem[]), itemKeys(b.entities.items as KeyedItem[])),
    ...diffSection("workPersonas", itemKeys(a.workPersonas.items as KeyedItem[]), itemKeys(b.workPersonas.items as KeyedItem[])),
    ...diffSection("workflows", itemKeys(a.workflows.items as KeyedItem[]), itemKeys(b.workflows.items as KeyedItem[])),
    ...diffSection("kpis", itemKeys(a.kpis.items as KeyedItem[]), itemKeys(b.kpis.items as KeyedItem[])),
    ...diffSection("evidence", itemKeys(a.evidence.items as KeyedItem[]), itemKeys(b.evidence.items as KeyedItem[])),
    ...diffSection("integrations", itemKeys(a.integrations.items as KeyedItem[]), itemKeys(b.integrations.items as KeyedItem[])),
    ...diffSection("compliance", itemKeys(a.complianceOverlays.items as KeyedItem[]), itemKeys(b.complianceOverlays.items as KeyedItem[])),
  ];

  const depthA = (a.workflows.items as KeyedItem[]).reduce((s, w) => s + (w.states?.length ?? 0), 0);
  const depthB = (b.workflows.items as KeyedItem[]).reduce((s, w) => s + (w.states?.length ?? 0), 0);
  if (depthB > depthA) diffs.push({ section: "workflows", change: "EXPANDED", key: "workflow_depth", detail: `${depthA} → ${depthB}` });
  else if (depthB < depthA) diffs.push({ section: "workflows", change: "REDUCED", key: "workflow_depth", detail: `${depthA} → ${depthB}` });

  if (a.workPersonas.items.length > b.workPersonas.items.length) {
    diffs.push({ section: "workPersonas", change: "MERGED", key: "persona_count", detail: `${a.workPersonas.items.length} → ${b.workPersonas.items.length}` });
  } else if (b.workPersonas.items.length > a.workPersonas.items.length) {
    diffs.push({ section: "workPersonas", change: "SPLIT", key: "persona_count", detail: `${a.workPersonas.items.length} → ${b.workPersonas.items.length}` });
  }

  return diffs;
}

export function classifyBlueprintDiff(change: BlueprintDiffChange): string {
  return change;
}
