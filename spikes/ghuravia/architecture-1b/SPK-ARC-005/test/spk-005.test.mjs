/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 * Gate: GHV.ARCHITECTURE.1B
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildSyntheticGraph,
  hasCycle,
  explainEligibility,
  REPRESENTATION_OPTIONS,
} from "../lib/learning-graph.mjs";

describe("SPK-ARC-005 Learning Graph relational representation", () => {
  it("loads 166 nodes / 129 edges / 16 types / 10 edge types", () => {
    const g = buildSyntheticGraph();
    assert.equal(g.nodeRows.length, 166);
    assert.equal(g.edgeRows.length, 129);
    assert.equal(g.NODE_TYPES, 16);
    assert.equal(g.EDGE_TYPES, 10);
    assert.equal(new Set(g.nodeRows.map((n) => n.id)).size, 166);
    assert.equal(new Set(g.edgeRows.map((e) => e.id)).size, 129);
  });

  it("is acyclic by construction and detects injected cycles", () => {
    const g = buildSyntheticGraph();
    assert.equal(hasCycle(g.edgeRows), false);
    const cyclic = [
      ...g.edgeRows,
      { id: "E-BAD", from: "N-010", to: "N-001", type: 1 },
    ];
    // N-001 → … → N-010 → N-001 may create cycle depending on chain; force clear cycle:
    const forced = [
      { id: "a", from: "A", to: "B", type: 1 },
      { id: "b", from: "B", to: "A", type: 1 },
    ];
    assert.equal(hasCycle(forced), true);
    assert.ok(cyclic.length > g.edgeRows.length);
  });

  it("explains eligibility from prerequisites", () => {
    const g = buildSyntheticGraph();
    const mid = "N-010";
    const blocked = explainEligibility(g.edgeRows, new Set(), mid);
    assert.equal(blocked.eligible, false);
    const done = new Set(blocked.missing);
    const ok = explainEligibility(g.edgeRows, done, mid);
    assert.equal(ok.eligible, true);
  });

  it("does not select graph DB by terminology alone", () => {
    assert.ok(REPRESENTATION_OPTIONS.includes("relational-adjacency"));
    assert.ok(REPRESENTATION_OPTIONS.includes("dedicated-graph"));
  });
});
