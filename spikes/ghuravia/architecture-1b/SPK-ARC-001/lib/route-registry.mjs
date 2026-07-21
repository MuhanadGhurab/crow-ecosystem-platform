/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 * Gate: GHV.ARCHITECTURE.1B
 * Spike: SPK-ARC-001 (+ supporting routing/RTL evidence; does not complete SPK-ARC-002/004)
 */

/** Synthetic 92 ACTIVE screen IDs across 7 shells (counts match governed baseline). */
export const SHELL_COUNTS = Object.freeze({
  Public: 8,
  Activation: 12,
  Onboarding: 14,
  Core: 39,
  Commercial: 6,
  Trust: 6,
  Admin: 7,
});

const ACTIVATION_ACTIVE = [
  "ACT-001",
  "ACT-002",
  "ACT-003",
  "ACT-005",
  "ACT-006",
  "ACT-007",
  "ACT-008",
  "ACT-009",
  "ACT-010",
  "ACT-011",
  "ACT-012",
  "ACT-013",
];

function pad(n, w = 3) {
  return String(n).padStart(w, "0");
}

export function buildGovernedRouteRegistry() {
  const routes = [];
  let seq = 1;
  for (const [shell, count] of Object.entries(SHELL_COUNTS)) {
    for (let i = 0; i < count; i++) {
      let id;
      if (shell === "Activation") {
        id = ACTIVATION_ACTIVE[i];
      } else {
        const prefix = shell.slice(0, 3).toUpperCase();
        id = `${prefix}-${pad(seq++)}`;
      }
      routes.push({
        id,
        shell,
        path: `/${shell.toLowerCase()}/${id.toLowerCase()}`,
        dir: "rtl-default",
      });
    }
  }
  return routes;
}

export function assertNoAliasInflation(routes) {
  const ids = routes.map((r) => r.id);
  if (ids.includes("ACT-004")) {
    throw new Error("ACT-004 must not appear in ACTIVE route registry");
  }
  if (!ids.includes("ACT-013")) {
    throw new Error("ACT-013 must be present");
  }
  if (new Set(ids).size !== ids.length) {
    throw new Error("Duplicate route IDs");
  }
  if (ids.length !== 92) {
    throw new Error(`Expected 92 routes, got ${ids.length}`);
  }
  return true;
}

/** Minimal RTL chrome + LTR technical island model. */
export function composeRtlWithLtrIsland({ locale, technicalSnippet }) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  return {
    htmlDir: dir,
    chrome: { dir, lang: locale },
    island: {
      dir: "ltr",
      unicodeBidi: "isolate",
      content: technicalSnippet,
    },
  };
}
