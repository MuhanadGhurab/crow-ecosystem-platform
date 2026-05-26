import "server-only";

import {
  COHESION_CHAINS,
  type CohesionChainDefinition,
  type CohesionChainId,
} from "@/lib/constants/cross-module-cohesion";
import { ERP_MODULE_INTEGRATION_EDGES } from "@/lib/constants/erp-module-integration-map";
import type { ExecutiveRollupCategoryId } from "@/lib/constants/reports-bi-readiness-depth";
import type { ExecutiveRollupStatus } from "@/lib/constants/reports-bi-readiness-depth";
import { routes } from "@/lib/routes";
import { getReportsBiReadinessSnapshot } from "@/lib/services/reports-bi-readiness.service";

export type RuntimeCohesionStatus = ExecutiveRollupStatus;

export type RuntimeCohesionChainStatus = {
  key: CohesionChainId;
  label: string;
  status: RuntimeCohesionStatus;
  coverageRatio: number;
  coverageDetail: string;
  rollupWorst: RuntimeCohesionStatus;
  weakHints: string[];
  nextActions: string[];
};

export type RuntimeCohesionRelatedRoute = {
  label: string;
  href: string;
};

export type RuntimeCohesionSnapshot = {
  tenantSlug: string;
  overallStatus: RuntimeCohesionStatus;
  overallDetail: string;
  chains: RuntimeCohesionChainStatus[];
  moduleDependencyGaps: string[];
  handoffGaps: string[];
  evidenceReadinessGaps: string[];
  sareaCoverageGaps: string[];
  recommendedNextActions: string[];
  relatedRoutes: RuntimeCohesionRelatedRoute[];
  /** Lightweight echo of BI snapshot — avoid re-fetching in UI. */
  biReadinessLabel: string;
  cybercrowInitialized: boolean;
};

function isCemEnabled(
  enabled: Set<string>,
  key: string,
  opts: { cybercrowInitialized: boolean }
): boolean {
  if (key === "sarea") {
    return true;
  }
  if (key === "cybercrow") {
    return opts.cybercrowInitialized;
  }
  return enabled.has(key);
}

function rankStatus(s: RuntimeCohesionStatus): number {
  switch (s) {
    case "not_enabled":
      return 0;
    case "limited_data":
      return 1;
    case "needs_review":
      return 2;
    case "healthy":
      return 3;
    default:
      return 0;
  }
}

/** Pick the worse (lower rank) advisory status. */
function worstOf(a: RuntimeCohesionStatus, b: RuntimeCohesionStatus): RuntimeCohesionStatus {
  return rankStatus(a) <= rankStatus(b) ? a : b;
}

function rollupWorstForChain(
  def: CohesionChainDefinition,
  rollupById: Map<ExecutiveRollupCategoryId, ExecutiveRollupStatus>
): RuntimeCohesionStatus {
  let w: RuntimeCohesionStatus = "healthy";
  for (const id of def.relatedRollupIds) {
    const st = rollupById.get(id) ?? "not_enabled";
    w = worstOf(w, st);
  }
  return w;
}

function coverageForChain(def: CohesionChainDefinition, enabled: Set<string>): { ratio: number; detail: string } {
  const keys = def.cemKeysForCoverage.filter((k) => k !== "sarea");
  if (keys.length === 0) {
    return { ratio: 1, detail: "N/A" };
  }
  const hit = keys.filter((k) => enabled.has(k)).length;
  return { ratio: hit / keys.length, detail: `${hit}/${keys.length} companion surfaces enabled` };
}

function chainStatusRule(input: {
  coverageRatio: number;
  rollupWorst: RuntimeCohesionStatus;
  requiresCybercrow: boolean;
  cybercrowInitialized: boolean;
}): RuntimeCohesionStatus {
  if (input.coverageRatio === 0) return "not_enabled";
  let base: RuntimeCohesionStatus =
    input.coverageRatio >= 0.85 ? "healthy" : input.coverageRatio >= 0.45 ? "needs_review" : "limited_data";
  base = worstOf(base, input.rollupWorst);
  if (input.requiresCybercrow && !input.cybercrowInitialized) {
    base = worstOf(base, "limited_data");
  }
  return base;
}

function handoffGapsFor(
  enabled: Set<string>,
  def: CohesionChainDefinition,
  opts: { cybercrowInitialized: boolean }
): string[] {
  const gaps: string[] = [];
  for (const h of def.requiredHandoffs) {
    const fromOk = isCemEnabled(enabled, h.from, opts);
    const toOk = isCemEnabled(enabled, h.to, opts);
    if (fromOk && !toOk) {
      gaps.push(`${def.label}: ${h.label} — "${h.to}" not enabled while "${h.from}" is.`);
    }
  }
  return gaps;
}

function integrationEdgeCoverage(enabled: Set<string>): { satisfied: number; total: number } {
  let total = 0;
  let satisfied = 0;
  for (const edge of ERP_MODULE_INTEGRATION_EDGES) {
    if (edge.to === "cybercrow" || edge.to === "sarea" || edge.to === "platform") continue;
    const from = edge.from;
    const to = edge.to as string;
    if (from === "platform") continue;
    total += 1;
    if (enabled.has(from) && enabled.has(to)) {
      satisfied += 1;
    }
  }
  return { satisfied, total };
}

/**
 * Rule-based runtime cohesion snapshot — aggregates existing G9 / workspace signals.
 * No new persistence, no paid infra, no autonomous decisioning.
 */
export async function getRuntimeCohesionSnapshot(
  tenantId: string,
  enabledModuleKeys: string[],
  industry: string | null | undefined,
  tenantSlug: string
): Promise<RuntimeCohesionSnapshot> {
  const enabled = new Set(enabledModuleKeys);
  const bi = await getReportsBiReadinessSnapshot(tenantId, enabledModuleKeys, industry ?? null);
  const rollupById = new Map(
    bi.executiveRollup.map((r) => [r.id as ExecutiveRollupCategoryId, r.status])
  );

  const chains: RuntimeCohesionChainStatus[] = COHESION_CHAINS.map((def) => {
    const { ratio, detail } = coverageForChain(def, enabled);
    const rw = rollupWorstForChain(def, rollupById);
    const status = chainStatusRule({
      coverageRatio: ratio,
      rollupWorst: rw,
      requiresCybercrow: Boolean(def.requiresCybercrowInitialized),
      cybercrowInitialized: bi.cybercrowInitialized,
    });
    const weakHints: string[] = [];
    if (ratio < 1 && ratio > 0) {
      weakHints.push(`Partial chain coverage (${detail}).`);
    }
    if (rw === "needs_review") {
      weakHints.push("Executive roll-up flags a domain in this chain for operator review.");
    }
    if (def.requiresCybercrowInitialized && !bi.cybercrowInitialized) {
      weakHints.push("CyberCrow not initialized — evidence-linked chain stays advisory.");
    }
    const nextActions = def.recommendedOperatorActions.slice(0, 2);
    return {
      key: def.key,
      label: def.label,
      status,
      coverageRatio: ratio,
      coverageDetail: detail,
      rollupWorst: rw,
      weakHints,
      nextActions,
    };
  });

  let overall: RuntimeCohesionStatus = "healthy";
  for (const c of chains) {
    overall = worstOf(overall, c.status);
  }

  const moduleDependencyGaps: string[] = [];
  const { satisfied, total } = integrationEdgeCoverage(enabled);
  if (total > 0 && satisfied < total) {
    moduleDependencyGaps.push(
      `${total - satisfied} integration handoff(s) have only one side enabled — see ERP integration map (advisory).`
    );
  }
  for (const c of chains) {
    if (c.status === "needs_review" || c.status === "limited_data") {
      moduleDependencyGaps.push(`${c.label}: ${c.coverageDetail} · roll-up worst: ${c.rollupWorst}.`);
    }
  }

  const handoffGaps: string[] = [];
  for (const def of COHESION_CHAINS) {
    handoffGaps.push(...handoffGapsFor(enabled, def, { cybercrowInitialized: bi.cybercrowInitialized }));
  }

  const evidenceReadinessGaps: string[] = [];
  if (!bi.cybercrowInitialized) {
    evidenceReadinessGaps.push("CyberCrow not initialized — evidence and GRC context in roll-ups are placeholder-only.");
  } else if (rollupById.get("cybercrow") !== "healthy") {
    evidenceReadinessGaps.push("CyberCrow roll-up is not in the healthy advisory band — review security hub.");
  }

  const sareaCoverageGaps: string[] = [];
  if (bi.sareaAdvisory === "missing_mapping" || bi.sareaAdvisory === "fallback_only") {
    sareaCoverageGaps.push(`SAREA advisory: ${bi.sareaAdvisory} — align role mapping and personas.`);
  }
  if (bi.sareaTotalPersonas === 0) {
    sareaCoverageGaps.push("No SAREA personas materialized for this tenant — experience cohesion is limited.");
  }

  const recommendedNextActions = dedupe([
    ...bi.recommendedActions.slice(0, 4),
    ...chains.flatMap((c) => c.nextActions).slice(0, 3),
  ]).slice(0, 8);

  const r = routes.tenant(tenantSlug);
  const relatedRoutes: RuntimeCohesionRelatedRoute[] = [
    { label: "Reports / BI", href: r.reports },
    { label: "Tasks", href: r.tasks },
    { label: "Workflows", href: r.workflows },
    { label: "CyberCrow", href: r.cybercrow.dashboard },
    { label: "Modules", href: r.modules },
    { label: "SAREA role mapping", href: routes.sarea.roleMapping },
  ];

  const overallDetail =
    overall === "healthy"
      ? "Runtime cohesion advisory band is healthy — still operator-reviewed, not autonomous."
      : overall === "not_enabled"
        ? "Most cross-module chains lack enabled companions — expand blueprint modules before cohesion review."
        : "One or more cohesion chains need operator review or have limited companion data.";

  return {
    tenantSlug,
    overallStatus: overall,
    overallDetail,
    chains,
    moduleDependencyGaps: moduleDependencyGaps.slice(0, 8),
    handoffGaps: handoffGaps.slice(0, 10),
    evidenceReadinessGaps,
    sareaCoverageGaps,
    recommendedNextActions,
    relatedRoutes,
    biReadinessLabel: bi.readinessLabel,
    cybercrowInitialized: bi.cybercrowInitialized,
  };
}

function dedupe(items: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const x of items) {
    if (seen.has(x)) continue;
    seen.add(x);
    out.push(x);
  }
  return out;
}

/** Admin-friendly slice — same service, no extra queries. */
export function summarizeRuntimeCohesionForAdmin(snapshot: RuntimeCohesionSnapshot): {
  headline: string;
  weakChains: string[];
  actions: string[];
} {
  const weakChains = snapshot.chains.filter((c) => c.status !== "healthy").map((c) => c.label);
  return {
    headline: `Runtime cohesion: ${snapshot.overallStatus} · ${snapshot.biReadinessLabel}`,
    weakChains,
    actions: snapshot.recommendedNextActions.slice(0, 5),
  };
}
