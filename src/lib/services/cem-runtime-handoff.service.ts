import "server-only";

import {
  CEM_CYBERCROW_SAREA_RELATIONSHIP_COPY,
  CEM_RUNTIME_HANDOFF_DISCLAIMERS,
  type CemOperationalAreaReadiness,
  type CemOperationalAreaStatus,
  type CemRuntimeDependencySummary,
  type CemRuntimeGoNoGoDependency,
  type CemRuntimeHandoffSnapshot,
  type CemRuntimeHandoffStatus,
} from "@/lib/cem/cem-runtime-handoff-contract";
import {
  CEM_OPERATIONAL_AREA_EXPECTATIONS,
  type CemOperationalAreaExpectation,
} from "@/lib/constants/cem-operational-readiness";
import { routes } from "@/lib/routes";
import { getCemOperationsSnapshot } from "@/lib/services/cem-operations-intelligence.service";
import { buildCyberCrowTenantTrustSnapshotForTenantId } from "@/lib/services/cybercrow-tenant-trust.service";
import { buildSareaExperienceMappingSnapshotForTenantId } from "@/lib/services/sarea-experience-mapping.service";
import { getTenantById } from "@/lib/services/tenant.service";

function routeForExpectation(slug: string, exp: CemOperationalAreaExpectation): string {
  const r = routes.tenant(slug);
  return r[exp.routeKey];
}

function classifyCoreArea(
  exp: CemOperationalAreaExpectation,
  route: string,
  counts: {
    moduleCount: number;
    departmentCount: number;
    roleCount: number;
    profileCount: number;
    taskCount: number;
    workflowCount: number;
  }
): CemOperationalAreaReadiness {
  const missing: string[] = [];
  let status: CemOperationalAreaStatus = "ready";
  let summary = exp.purpose;
  let recommendedAction = exp.nextAction;
  let demoReady = true;

  switch (exp.area) {
    case "modules":
      if (counts.moduleCount === 0) {
        status = "blocked";
        missing.push("No modules enabled");
        demoReady = false;
      } else if (counts.moduleCount < 3) {
        status = "warning";
        missing.push("Few modules enabled for a full staging walkthrough");
      }
      break;
    case "departments":
      if (counts.departmentCount === 0) {
        status = "warning";
        missing.push("No departments");
        demoReady = false;
      }
      break;
    case "roles":
      if (counts.roleCount === 0) {
        status = "warning";
        missing.push("No roles defined");
        demoReady = false;
      }
      break;
    case "users":
      if (counts.profileCount === 0) {
        status = "warning";
        missing.push("No tenant profiles");
        demoReady = false;
      }
      break;
    case "tasks":
      if (counts.taskCount === 0) {
        status = counts.workflowCount > 0 ? "warning" : "thin";
        missing.push("No tasks seeded");
        demoReady = false;
        summary = `${exp.purpose} ${exp.thinLabel}`;
      }
      break;
    case "workflows":
      if (counts.workflowCount === 0) {
        status = "thin";
        missing.push("No workflow definitions");
        demoReady = false;
        summary = `${exp.purpose} ${exp.thinLabel}`;
      }
      break;
    case "reports":
      if (counts.moduleCount === 0) {
        status = "warning";
        missing.push("Reports hub needs module signals");
      } else if (counts.taskCount === 0 && counts.workflowCount === 0) {
        status = "thin";
        summary = `${exp.purpose} ${exp.thinLabel}`;
      }
      break;
    default:
      break;
  }

  return {
    area: exp.area,
    label: exp.label,
    status,
    route,
    summary,
    missingItems: missing,
    recommendedAction,
    demoReady,
  };
}

function classifyModuleArea(
  exp: CemOperationalAreaExpectation,
  route: string,
  enabled: boolean
): CemOperationalAreaReadiness {
  if (!enabled) {
    return {
      area: exp.area,
      label: exp.label,
      status: "not_applicable",
      route,
      summary: `${exp.label} module not enabled — not required for handoff.`,
      missingItems: [],
      recommendedAction: "Enable module on blueprint if in scope for staging demo.",
      demoReady: false,
    };
  }

  return {
    area: exp.area,
    label: exp.label,
    status: "thin",
    route,
    summary: `${exp.purpose} ${exp.thinLabel}`,
    missingItems: [],
    recommendedAction: exp.nextAction,
    demoReady: true,
  };
}

function deriveOverallStatus(input: {
  areas: CemOperationalAreaReadiness[];
  moduleCount: number;
  profileCount: number;
  roleCount: number;
  workflowCount: number;
  cyberCrow: CemRuntimeDependencySummary;
  sarea: CemRuntimeDependencySummary;
}): CemRuntimeHandoffStatus {
  if (input.areas.some((a) => a.status === "blocked")) return "blocked";
  if (input.cyberCrow.blockers.length > 0 || input.sarea.blockers.length > 0) return "blocked";

  if (input.moduleCount === 0) return "needs_modules";
  if (input.profileCount === 0 || input.roleCount === 0) return "needs_users_roles";
  if (input.workflowCount === 0) return "needs_workflows";

  const cyberNeeds =
    input.cyberCrow.status === "needs_review" ||
    input.cyberCrow.status === "in_review" ||
    input.cyberCrow.status === "not_started";
  if (cyberNeeds) return "needs_cybercrow";

  const sareaNeeds =
    input.sarea.status === "needs_blueprint" ||
    input.sarea.status === "needs_roles" ||
    input.sarea.status === "needs_cybercrow_boundaries";
  if (sareaNeeds) return "needs_sarea";

  const coreWarnings = input.areas.filter(
    (a) => a.status === "warning" || a.status === "thin"
  ).length;
  if (coreWarnings > 4) return "needs_workflows";

  return "ready_for_staging_handoff";
}

function buildCyberCrowDependency(
  trust: Awaited<ReturnType<typeof buildCyberCrowTenantTrustSnapshotForTenantId>> | null
): CemRuntimeDependencySummary {
  if (!trust) {
    return {
      label: "CyberCrow tenant trust (M1)",
      status: "not_started",
      summary: "Trust snapshot unavailable — review CyberCrow on tenant workbench.",
      blockers: [],
      warnings: ["Run cybercrow-trust:verify after M1 changes"],
    };
  }
  return {
    label: "CyberCrow tenant trust (M1)",
    status: trust.trustStatus,
    summary: trust.cemRelationshipNote,
    blockers: [...trust.blockers],
    warnings: [...trust.warnings],
  };
}

function buildSareaDependency(
  mapping: Awaited<ReturnType<typeof buildSareaExperienceMappingSnapshotForTenantId>> | null
): CemRuntimeDependencySummary {
  if (!mapping) {
    return {
      label: "SAREA experience mapping (M2)",
      status: "not_started",
      summary: "Experience mapping snapshot unavailable.",
      blockers: [],
      warnings: ["Run sarea-blueprint:verify after M2 changes"],
    };
  }
  return {
    label: "SAREA experience mapping (M2)",
    status: mapping.status,
    summary: mapping.disclaimers[0] ?? "Advisory persona/navigation mapping.",
    blockers: [...mapping.blockers],
    warnings: mapping.missingInputs.slice(0, 3),
  };
}

export async function buildCemRuntimeHandoffSnapshotForTenantId(
  tenantId: string
): Promise<CemRuntimeHandoffSnapshot | null> {
  const tenant = await getTenantById(tenantId);
  if (!tenant) return null;

  const slug = tenant.slug;
  const enabledKeys = new Set(
    tenant.modules.filter((m) => m.enabled !== false).map((m) => m.moduleKey)
  );
  const moduleCount = tenant.modules.filter((m) => m.enabled !== false).length;

  const [cemOps, cybercrowTrust, sareaMapping] = await Promise.all([
    getCemOperationsSnapshot(tenantId),
    buildCyberCrowTenantTrustSnapshotForTenantId(tenantId).catch(() => null),
    buildSareaExperienceMappingSnapshotForTenantId(tenantId).catch(() => null),
  ]);

  const counts = {
    moduleCount,
    departmentCount: cemOps.departmentCount,
    roleCount: cemOps.roleCount,
    profileCount: cemOps.profileCount,
    taskCount: cemOps.taskCount,
    workflowCount: cemOps.workflowCount,
  };

  const operationalAreas: CemOperationalAreaReadiness[] = CEM_OPERATIONAL_AREA_EXPECTATIONS.map(
    (exp) => {
      const route = routeForExpectation(slug, exp);
      if (exp.moduleKey) {
        return classifyModuleArea(exp, route, enabledKeys.has(exp.moduleKey));
      }
      return classifyCoreArea(exp, route, counts);
    }
  );

  const cyberCrowDependency = buildCyberCrowDependency(cybercrowTrust);
  const sareaDependency = buildSareaDependency(sareaMapping);

  const blockers = [
    ...operationalAreas.filter((a) => a.status === "blocked").flatMap((a) => a.missingItems),
    ...cyberCrowDependency.blockers,
    ...sareaDependency.blockers,
  ];

  const warnings = [
    ...operationalAreas
      .filter((a) => a.status === "warning" || a.status === "thin")
      .map((a) => `${a.label}: ${a.missingItems[0] ?? a.summary}`),
    ...cyberCrowDependency.warnings,
    ...sareaDependency.warnings,
  ].slice(0, 8);

  const recommendedActions = [
    ...cemOps.recommendedActions.slice(0, 2).map((a) => a.label),
    ...(cybercrowTrust?.recommendedActions.slice(0, 1) ?? []),
    ...(sareaMapping?.recommendedActions.slice(0, 1) ?? []),
    ...operationalAreas
      .filter((a) => !a.demoReady && a.status !== "not_applicable")
      .map((a) => a.recommendedAction)
      .slice(0, 3),
  ].filter((v, i, arr) => arr.indexOf(v) === i);

  const status = deriveOverallStatus({
    areas: operationalAreas,
    moduleCount,
    profileCount: cemOps.profileCount,
    roleCount: cemOps.roleCount,
    workflowCount: cemOps.workflowCount,
    cyberCrow: cyberCrowDependency,
    sarea: sareaDependency,
  });

  const businessPortalEntryRoute = routes.tenant(slug).dashboard;

  return {
    tenantSlug: slug,
    tenantName: tenant.organization.displayName,
    status,
    operationalAreas,
    moduleCount,
    departmentCount: cemOps.departmentCount,
    roleCount: cemOps.roleCount,
    userCount: cemOps.profileCount,
    taskCount: cemOps.taskCount,
    workflowCount: cemOps.workflowCount,
    reportCount: moduleCount > 0 ? 1 : 0,
    cyberCrowDependency,
    sareaDependency,
    blockers,
    warnings,
    recommendedActions,
    businessPortalEntryRoute,
    goNoGoDependency:
      "CEM runtime handoff confirms staging Business Portal usability — ProCrow Go/No-Go still required; production remains F23-gated.",
    disclaimers: CEM_RUNTIME_HANDOFF_DISCLAIMERS,
  };
}

export type { CemRuntimeGoNoGoDependency } from "@/lib/cem/cem-runtime-handoff-contract";
export { buildCemRuntimeGoNoGoDependency } from "@/lib/cem/cem-runtime-go-no-go";
