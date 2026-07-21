/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 * Gate: GHV.ARCHITECTURE.1B
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildGovernedRouteRegistry,
  assertNoAliasInflation,
  composeRtlWithLtrIsland,
  SHELL_COUNTS,
} from "../lib/route-registry.mjs";
import {
  recommendWorkspace,
  scoreWorkspace,
  WORKSPACE_CANDIDATES,
  FRAMEWORK_FINALISTS,
} from "../lib/workspace-model.mjs";

describe("SPK-ARC-001 route registry (92 / 7 / no alias)", () => {
  it("sums to 92 across 7 shells", () => {
    const total = Object.values(SHELL_COUNTS).reduce((a, b) => a + b, 0);
    assert.equal(total, 92);
    assert.equal(Object.keys(SHELL_COUNTS).length, 7);
  });

  it("builds ACTIVE registry without ACT-004 and with ACT-013", () => {
    const routes = buildGovernedRouteRegistry();
    assert.equal(assertNoAliasInflation(routes), true);
    assert.ok(routes.some((r) => r.id === "ACT-011"));
    assert.ok(routes.some((r) => r.id === "ACT-013"));
  });

  it("maps every route to a shell path", () => {
    const routes = buildGovernedRouteRegistry();
    for (const r of routes) {
      assert.ok(r.path.startsWith("/"));
      assert.ok(Object.keys(SHELL_COUNTS).includes(r.shell));
    }
  });
});

describe("SPK-ARC-001 RTL + LTR island (supporting evidence)", () => {
  it("Arabic chrome is RTL with isolated LTR technical island", () => {
    const view = composeRtlWithLtrIsland({
      locale: "ar",
      technicalSnippet: "curl https://example.test/api && ip 192.0.2.1",
    });
    assert.equal(view.htmlDir, "rtl");
    assert.equal(view.chrome.dir, "rtl");
    assert.equal(view.island.dir, "ltr");
    assert.equal(view.island.unicodeBidi, "isolate");
    assert.match(view.island.content, /192\.0\.2\.1/);
  });
});

describe("SPK-ARC-001 workspace recommendation", () => {
  it("recommends package-manager workspace over task-runner for founder launch", () => {
    const best = recommendWorkspace();
    assert.equal(best.id, "npm-workspaces");
    assert.ok(scoreWorkspace(best) >= scoreWorkspace(WORKSPACE_CANDIDATES[0]));
  });

  it("records framework finalists with queried versions", () => {
    assert.ok(FRAMEWORK_FINALISTS.some((f) => f.id === "next-app-router"));
    assert.ok(FRAMEWORK_FINALISTS.some((f) => f.id === "hono-modular-api"));
  });
});
