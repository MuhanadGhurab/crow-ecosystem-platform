/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 * Gate: GHV.ARCHITECTURE.1B
 * Spike: SPK-ARC-005 — relational adjacency Learning Graph
 */

const NODE_TYPES = 16;
const EDGE_TYPES = 10;

export function buildSyntheticGraph({ nodes = 166, edges = 129 } = {}) {
  /** @type {{id:string,type:number,version:number,status:string}[]} */
  const nodeRows = [];
  for (let i = 1; i <= nodes; i++) {
    nodeRows.push({
      id: `N-${String(i).padStart(3, "0")}`,
      type: (i % NODE_TYPES) + 1,
      version: 1,
      status: i === nodes ? "reserve" : "active",
    });
  }

  /** @type {{id:string,from:string,to:string,type:number}[]} */
  const edgeRows = [];
  // Build a DAG of prerequisite edges (acyclic by construction: from lower index to higher)
  let e = 0;
  for (let i = 1; i < nodes && e < edges; i++) {
    const from = nodeRows[i - 1].id;
    const to = nodeRows[i].id;
    edgeRows.push({
      id: `E-${String(++e).padStart(3, "0")}`,
      from,
      to,
      type: (e % EDGE_TYPES) + 1,
    });
  }
  // Fill remaining edges with skip-ahead DAG edges
  let span = 2;
  while (e < edges) {
    for (let i = 0; i + span < nodes && e < edges; i++) {
      edgeRows.push({
        id: `E-${String(++e).padStart(3, "0")}`,
        from: nodeRows[i].id,
        to: nodeRows[i + span].id,
        type: (e % EDGE_TYPES) + 1,
      });
    }
    span += 1;
  }

  return { nodeRows, edgeRows, NODE_TYPES, EDGE_TYPES };
}

export function hasCycle(edgeRows) {
  /** @type {Map<string, string[]>} */
  const adj = new Map();
  for (const e of edgeRows) {
    if (!adj.has(e.from)) adj.set(e.from, []);
    adj.get(e.from).push(e.to);
  }
  const visiting = new Set();
  const visited = new Set();
  function dfs(n) {
    if (visiting.has(n)) return true;
    if (visited.has(n)) return false;
    visiting.add(n);
    for (const m of adj.get(n) || []) {
      if (dfs(m)) return true;
    }
    visiting.delete(n);
    visited.add(n);
    return false;
  }
  for (const n of adj.keys()) {
    if (dfs(n)) return true;
  }
  return false;
}

export function prerequisitesOf(edgeRows, nodeId) {
  return edgeRows.filter((e) => e.to === nodeId).map((e) => e.from);
}

export function explainEligibility(edgeRows, completedSet, nodeId) {
  const prereqs = prerequisitesOf(edgeRows, nodeId);
  const missing = prereqs.filter((p) => !completedSet.has(p));
  return {
    nodeId,
    eligible: missing.length === 0,
    missing,
  };
}

/** Document / graph-DB options remain candidates; relational is exercised here. */
export const REPRESENTATION_OPTIONS = [
  "relational-adjacency",
  "document-oriented",
  "dedicated-graph",
  "hybrid-projection",
];
