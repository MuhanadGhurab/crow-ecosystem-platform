/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 * Gate: GHV.ARCHITECTURE.1B
 * Spike: SPK-ARC-001
 */

/**
 * Compare workspace shapes for founder-operable modular monolith.
 * No monorepo tool required to score conceptual feasibility.
 */
export const WORKSPACE_CANDIDATES = [
  {
    id: "single-app",
    label: "Single non-workspace application repository",
    installComplexity: "LOW",
    boundaryClarity: "LOW",
    sharedContracts: "AD_HOC",
    founderOperability: "HIGH",
    futureTeamGrowth: "MEDIUM",
  },
  {
    id: "npm-workspaces",
    label: "Package-manager workspace (npm/pnpm)",
    installComplexity: "MODERATE",
    boundaryClarity: "HIGH",
    sharedContracts: "EXPLICIT_PACKAGES",
    founderOperability: "HIGH",
    futureTeamGrowth: "HIGH",
  },
  {
    id: "task-runner-monorepo",
    label: "Task-runner-assisted monorepo (e.g. Turborepo)",
    installComplexity: "HIGH",
    boundaryClarity: "HIGH",
    sharedContracts: "EXPLICIT_PACKAGES",
    founderOperability: "MODERATE",
    futureTeamGrowth: "HIGH",
  },
];

export function scoreWorkspace(c) {
  const map = {
    LOW: 1,
    MODERATE: 2,
    MEDIUM: 2,
    HIGH: 3,
    AD_HOC: 1,
    EXPLICIT_PACKAGES: 3,
  };
  // Prefer boundary clarity + explicit contracts for modular monolith; founder ops still weighted.
  return (
    map[c.boundaryClarity] * 4 +
    map[c.founderOperability] * 2 +
    map[c.sharedContracts] * 4 +
    map[c.futureTeamGrowth] * 2 -
    map[c.installComplexity]
  );
}

export function recommendWorkspace() {
  const ranked = [...WORKSPACE_CANDIDATES].sort(
    (a, b) => scoreWorkspace(b) - scoreWorkspace(a),
  );
  return ranked[0];
}

/** Framework finalists for modular monolith FE+BE in one deployable (Option B/C hybrid). */
export const FRAMEWORK_FINALISTS = [
  {
    id: "next-app-router",
    role: "frontend+bff-candidate",
    versionQueried: "16.2.10",
    seo: true,
    rtlSupport: "CSS dir + isolate",
    modularBackend: "route-handlers + separate domain modules",
  },
  {
    id: "vite-react-spa",
    role: "frontend-only",
    versionQueried: "react 19.2.8",
    seo: false,
    rtlSupport: "CSS dir + isolate",
    modularBackend: "requires separate backend deployable",
  },
  {
    id: "hono-modular-api",
    role: "backend-candidate",
    versionQueried: "4.12.31",
    seo: false,
    rtlSupport: "n/a",
    modularBackend: "explicit routers/modules",
  },
];
