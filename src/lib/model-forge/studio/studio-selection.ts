export type StudioSelectionSource =
  | "GRAPH"
  | "BLUEPRINT_SECTION"
  | "PROVENANCE"
  | "DECISION"
  | "VALIDATION"
  | "SCENARIO_DIFF"
  | "COMPILATION_TIMELINE"
  | "RELATIONSHIP_RULE";

export type StudioSelectionTarget = {
  graphNodeId?: string;
  blueprintPath?: string;
  decisionKey?: string;
  validationCode?: string;
  scenarioDiffKey?: string;
  relationshipRuleKey?: string;
};

export type StudioNavigationIntent = {
  mode?: string;
  layerPreset?: string;
  scrollTo?: string;
};

export type StudioSelection = {
  source: StudioSelectionSource;
  target: StudioSelectionTarget;
  intent?: StudioNavigationIntent;
  timestamp: number;
};

export type StudioSelectionSyncResult = {
  selection: StudioSelection;
  graphNodeId: string | null;
  blueprintPath: string | null;
  blueprintMode: string | null;
  decisionKey: string | null;
  validationCode: string | null;
};

const GRAPH_TO_BLUEPRINT: Record<string, { mode: string; pathPrefix: string }> = {
  "persona:": { mode: "personas", pathPrefix: "blueprint.workPersonas." },
  "workflow:": { mode: "workflows", pathPrefix: "blueprint.workflows." },
  "entity:": { mode: "information", pathPrefix: "blueprint.entities." },
  "capability:": { mode: "information", pathPrefix: "blueprint.capabilities." },
  "dept:": { mode: "organization", pathPrefix: "blueprint.departments." },
  "authority:": { mode: "authority", pathPrefix: "blueprint.authority." },
  "sarea:": { mode: "experience", pathPrefix: "blueprint.sarea." },
  "cybercrow:": { mode: "trust", pathPrefix: "blueprint.cybercrow." },
  "integration:": { mode: "trust", pathPrefix: "blueprint.integrations." },
  "compliance:": { mode: "trust", pathPrefix: "blueprint.compliance." },
};

export function graphNodeIdToBlueprintPath(nodeId: string): { mode: string; path: string } | null {
  for (const [prefix, mapping] of Object.entries(GRAPH_TO_BLUEPRINT)) {
    if (nodeId.startsWith(prefix)) {
      const key = nodeId.slice(prefix.length);
      return { mode: mapping.mode, path: `${mapping.pathPrefix}${key}` };
    }
  }
  if (nodeId === "industry:primary") return { mode: "organization", path: "blueprint.organization.primary" };
  return null;
}

export function blueprintPathToGraphNodeId(path: string): string | null {
  const mappings: [string, string][] = [
    ["blueprint.workPersonas.", "persona:"],
    ["blueprint.workflows.", "workflow:"],
    ["blueprint.entities.", "entity:"],
    ["blueprint.capabilities.", "capability:"],
    ["blueprint.departments.", "dept:"],
    ["blueprint.authority.", "authority:"],
    ["blueprint.sarea.", "sarea:"],
    ["blueprint.cybercrow.", "cybercrow:"],
    ["blueprint.integrations.", "integration:"],
    ["blueprint.compliance.", "compliance:"],
  ];
  for (const [prefix, graphPrefix] of mappings) {
    if (path.startsWith(prefix)) return `${graphPrefix}${path.slice(prefix.length).split(".")[0]}`;
  }
  if (path.startsWith("blueprint.organization")) return "industry:primary";
  return null;
}

let lastSelectionKey = "";

export function synchronizeStudioSelection(
  selection: StudioSelection,
  current: Partial<StudioSelectionSyncResult> = {},
): StudioSelectionSyncResult {
  const key = JSON.stringify({ source: selection.source, target: selection.target });
  if (key === lastSelectionKey) {
    return {
      selection,
      graphNodeId: current.graphNodeId ?? null,
      blueprintPath: current.blueprintPath ?? null,
      blueprintMode: current.blueprintMode ?? null,
      decisionKey: current.decisionKey ?? null,
      validationCode: current.validationCode ?? null,
    };
  }
  lastSelectionKey = key;

  let graphNodeId = selection.target.graphNodeId ?? current.graphNodeId ?? null;
  let blueprintPath = selection.target.blueprintPath ?? current.blueprintPath ?? null;
  let blueprintMode = selection.intent?.mode ?? current.blueprintMode ?? null;
  const decisionKey = selection.target.decisionKey ?? null;
  const validationCode = selection.target.validationCode ?? null;

  if (selection.source === "GRAPH" && graphNodeId && !blueprintPath) {
    const mapped = graphNodeIdToBlueprintPath(graphNodeId);
    if (mapped) {
      blueprintPath = mapped.path;
      blueprintMode = mapped.mode;
    }
  }
  if (selection.source === "BLUEPRINT_SECTION" && blueprintPath && !graphNodeId) {
    graphNodeId = blueprintPathToGraphNodeId(blueprintPath);
    if (!blueprintMode && blueprintPath) {
      const mapped = graphNodeId ? graphNodeIdToBlueprintPath(graphNodeId) : null;
      blueprintMode = mapped?.mode ?? null;
    }
  }
  if (selection.source === "DECISION" && decisionKey && blueprintPath) {
    graphNodeId = graphNodeId ?? blueprintPathToGraphNodeId(blueprintPath);
  }
  if (selection.source === "VALIDATION" && validationCode && blueprintPath) {
    graphNodeId = graphNodeId ?? blueprintPathToGraphNodeId(blueprintPath);
  }

  return { selection, graphNodeId, blueprintPath, blueprintMode, decisionKey, validationCode };
}

export function resetStudioSelectionGuard(): void {
  lastSelectionKey = "";
}
