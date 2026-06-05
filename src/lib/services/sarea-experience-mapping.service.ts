import "server-only";

import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { RIMAL_TENANT_SLUG } from "@/lib/constants/rimal";
import { CLIENT_DISCOVERY_SECTION } from "@/lib/client-portal/client-discovery-contract";
import { PROCROW_DISCOVERY_ACCEPTED_STATUS } from "@/lib/procrow/procrow-discovery-review-contract";
import {
  SAREA_BLUEPRINT_EXPERIENCE_TEMPLATES,
  type SareaBlueprintPersonaTemplate,
} from "@/lib/constants/sarea-blueprint-experience-templates";
import { SAREA_COPY } from "@/lib/constants/sarea-ux-depth";
import {
  SAREA_CYBERCROW_DEPENDENCY_COPY,
  SAREA_EXPERIENCE_MAPPING_DISCLAIMERS,
  type SareaBlueprintExperienceInput,
  type SareaExperienceMappingSnapshot,
  type SareaExperienceMappingStatus,
  type SareaExperiencePersona,
} from "@/lib/sarea/sarea-experience-mapping-contract";
import { prisma } from "@/lib/db";
import { routes } from "@/lib/routes";
import { buildCyberCrowTenantTrustSnapshotForTenantId } from "@/lib/services/cybercrow-tenant-trust.service";
import { getTenantPersonaMaterialization } from "@/lib/services/sarea-materialization.service";
import { getTenantIdentityCounts } from "@/lib/services/tenant-identity.service";
import { getTenantById } from "@/lib/services/tenant.service";

function landingRouteForTenant(slug: string, key: SareaBlueprintPersonaTemplate["landingRouteKey"]): string {
  const r = routes.tenant(slug);
  switch (key) {
    case "reports":
      return r.reports;
    case "workflows":
      return r.workflows;
    case "tasks":
      return r.tasks;
    case "hr":
      return r.hr;
    case "finance":
      return r.finance;
    case "crm":
      return r.crm;
    case "logistics":
      return r.logistics;
    default:
      return r.dashboard;
  }
}

function filterModulesForTenant(enabled: string[], suggested: string[]): string[] {
  const set = new Set(enabled);
  return suggested.filter((m) => set.has(m) || m === "workflows" || m === "tasks" || m === "reports");
}

function templateToPersona(
  template: SareaBlueprintPersonaTemplate,
  tenantSlug: string | null,
  enabledModules: string[]
): SareaExperiencePersona {
  const modulesVisible = tenantSlug
    ? filterModulesForTenant(enabledModules, [...template.suggestedModules])
    : [...template.suggestedModules];

  return {
    key: template.key,
    label: template.label,
    department: template.department,
    roleType: template.roleType,
    responsibilities: template.responsibilities,
    recommendedLandingRoute: tenantSlug
      ? landingRouteForTenant(tenantSlug, template.landingRouteKey)
      : `/${template.landingRouteKey}`,
    modulesVisible,
    navigationKeys: [...template.navigationKeys],
    widgetsVisible: [...template.widgetsVisible],
    reportViews: [...template.reportViews],
    workflowViews: [...template.workflowViews],
    experienceDensity: template.experienceDensity,
    cyberCrowBoundaryNotes: template.cyberCrowNote,
    rbacNotes: template.rbacNote,
  };
}

function selectTemplatesForContext(
  enabledModules: string[],
  roleCount: number
): SareaBlueprintPersonaTemplate[] {
  const keys = new Set<string>(["executive", "operations_manager", "frontline", "analyst"]);
  if (enabledModules.includes("hr")) keys.add("hr_specialist");
  if (enabledModules.includes("finance")) keys.add("finance_user");
  if (enabledModules.some((m) => m === "crm" || m === "sales")) keys.add("sales_crm");
  if (
    enabledModules.some((m) => ["inventory", "warehouse", "logistics", "procurement"].includes(m))
  ) {
    keys.add("warehouse_inventory");
  }
  if (roleCount === 0) {
    return SAREA_BLUEPRINT_EXPERIENCE_TEMPLATES.filter((t) =>
      ["executive", "operations_manager", "analyst"].includes(t.key)
    );
  }
  return SAREA_BLUEPRINT_EXPERIENCE_TEMPLATES.filter((t) => keys.has(t.key));
}

function deriveMappingStatus(input: {
  discoveryAccepted: boolean;
  hasBlueprint: boolean;
  roleCount: number;
  cyberCrowStatus: string | null;
  tenantBackedCount: number;
  personaCount: number;
  fallbackUsed: boolean;
}): SareaExperienceMappingStatus {
  if (!input.hasBlueprint && !input.discoveryAccepted) return "needs_blueprint";
  if (input.roleCount === 0 && input.personaCount > 0) return "needs_roles";
  if (
    input.cyberCrowStatus === "blocked" ||
    input.cyberCrowStatus === "needs_review" ||
    input.cyberCrowStatus === "not_started"
  ) {
    return "needs_cybercrow_boundaries";
  }
  if (input.roleCount === 0) return "blocked";
  if (
    input.tenantBackedCount >= 3 &&
    input.roleCount > 0 &&
    (input.cyberCrowStatus === "advisory_ready" ||
      input.cyberCrowStatus === "ready_for_go_no_go")
  ) {
    return "ready_for_go_no_go";
  }
  if (input.personaCount > 0) return "mapping_ready";
  return "not_started";
}

function goNoGoLabel(status: SareaExperienceMappingStatus): string {
  switch (status) {
    case "ready_for_go_no_go":
      return "SAREA experience mapping: ready (advisory) — ProCrow owns Go/No-Go";
    case "mapping_ready":
      return "SAREA experience mapping: mapping ready — review role mapping and preview";
    case "needs_cybercrow_boundaries":
      return "SAREA experience mapping: CyberCrow trust/access boundaries need review";
    case "needs_roles":
      return "SAREA experience mapping: CEM roles needed for persona alignment";
    case "needs_blueprint":
      return "SAREA experience mapping: accepted blueprint/discovery required";
    case "blocked":
      return "SAREA experience mapping: blocked — resolve roles or blueprint inputs";
    default:
      return "SAREA experience mapping: not started";
  }
}

async function loadBlueprintInput(
  tenantId: string | null,
  requestId: string | null,
  blueprintId: string | null
): Promise<SareaBlueprintExperienceInput> {
  let discoveryAccepted = false;
  let industry: string | null = null;
  let departments: string[] = [];
  let roles: { name: string; slug: string }[] = [];
  let modules: string[] = [];
  let workflows: string[] = [];
  let cyberCrowTrustStatus: string | null = null;
  let identityReadiness: string | null = null;
  let accessReviewStatus: string | null = null;

  if (tenantId) {
    const tenant = await getTenantById(tenantId);
    if (tenant) {
      industry = tenant.organization.industry;
      modules = tenant.modules.filter((m) => m.enabled !== false).map((m) => m.moduleKey);
      const [identity, deptRows, roleRows, wfRows, trust] = await Promise.all([
        getTenantIdentityCounts(tenantId),
        prisma.department.findMany({
          where: { tenantId },
          select: { name: true },
          orderBy: { name: "asc" },
        }),
        prisma.role.findMany({
          where: { tenantId },
          select: { name: true, slug: true },
          orderBy: { name: "asc" },
        }),
        prisma.workflow.findMany({
          where: { tenantId },
          select: { name: true },
          take: 12,
        }),
        buildCyberCrowTenantTrustSnapshotForTenantId(tenantId),
      ]);
      departments = deptRows.map((d) => d.name);
      roles = roleRows;
      workflows = wfRows.map((w) => w.name);
      if (trust) {
        cyberCrowTrustStatus = trust.trustStatus;
        identityReadiness = trust.identity.identityModel;
        accessReviewStatus = trust.accessReview.status;
      }
      if (!requestId && tenant.blueprint?.request) {
        requestId = tenant.blueprint.request.id;
        blueprintId = tenant.blueprint.id;
      }
    }
  }

  if (requestId) {
    const profile = await prisma.discoveryProfile.findUnique({
      where: { requestId },
      select: {
        answers: {
          where: { sectionKey: CLIENT_DISCOVERY_SECTION, questionKey: "status" },
          select: { valueJson: true },
          take: 1,
        },
      },
    });
    const raw = profile?.answers[0]?.valueJson;
    const status = typeof raw === "string" ? raw : null;
    discoveryAccepted = status === PROCROW_DISCOVERY_ACCEPTED_STATUS;

    if (!industry) {
      const req = await prisma.implementationRequest.findUnique({
        where: { id: requestId },
        select: { industry: true, employeeBand: true },
      });
      industry = req?.industry ?? null;
    }
  }

  return {
    requestId,
    blueprintId,
    tenantSlug: null,
    industryTemplate: industry,
    companyStageTemplate: null,
    departments,
    roles,
    modules,
    workflows,
    cyberCrowTrustStatus,
    identityReadiness,
    accessReviewStatus,
    discoveryAccepted,
  };
}

export async function buildSareaExperienceMappingSnapshotForTenantId(
  tenantId: string
): Promise<SareaExperienceMappingSnapshot | null> {
  const tenant = await getTenantById(tenantId);
  if (!tenant) return null;

  const input = await loadBlueprintInput(
    tenantId,
    tenant.blueprint?.request?.id ?? null,
    tenant.blueprint?.id ?? null
  );
  input.tenantSlug = tenant.slug;

  const enabledModules = input.modules;
  const templates = selectTemplatesForContext(enabledModules, input.roles.length);
  const personas = templates.map((t) => templateToPersona(t, tenant.slug, enabledModules));

  const materialization = await getTenantPersonaMaterialization(tenantId);
  const tenantBackedPersonaCount = materialization.filter((r) => r.state === "tenant_backed").length;
  const fallbackUsed = materialization.some(
    (r) => r.state === "recommended_fallback" || r.state === "not_materialized"
  );

  const missingInputs: string[] = [];
  if (!input.discoveryAccepted) missingInputs.push("Client discovery accepted into blueprint (L6)");
  if (input.roles.length === 0) missingInputs.push("CEM tenant roles defined");
  if (input.departments.length === 0) missingInputs.push("Departments for persona mapping");
  if (tenantBackedPersonaCount < 3) missingInputs.push("Tenant-backed SAREA profiles (studio materialization)");

  const warnings: string[] = [];
  if (fallbackUsed) {
    warnings.push("Some personas use fallback/advisory mapping — confirm in studio before Go/No-Go");
  }
  if (
    input.cyberCrowTrustStatus === "blocked" ||
    input.cyberCrowTrustStatus === "needs_review"
  ) {
    warnings.push("CyberCrow trust/access boundaries need review before Go/No-Go.");
  }

  const blockers: string[] = [];
  if (input.roles.length === 0 && !input.discoveryAccepted) {
    blockers.push("No roles and discovery not accepted — cannot align experience mapping");
  }

  const status = deriveMappingStatus({
    discoveryAccepted: input.discoveryAccepted,
    hasBlueprint: Boolean(tenant.blueprint?.id),
    roleCount: input.roles.length,
    cyberCrowStatus: input.cyberCrowTrustStatus,
    tenantBackedCount: tenantBackedPersonaCount,
    personaCount: personas.length,
    fallbackUsed,
  });

  const recommendedActions = [
    "Map blueprint roles to SAREA personas in Role mapping (experience only)",
    "Review navigation and widget recommendations per persona",
    "Run preview on tenant dashboard — does not change RBAC",
    ...(status === "needs_cybercrow_boundaries"
      ? ["Resolve CyberCrow trust readiness on tenant workbench"]
      : []),
  ];

  return {
    tenantSlug: tenant.slug,
    tenantName: tenant.organization.displayName,
    status,
    personas,
    missingInputs,
    warnings,
    blockers,
    recommendedActions,
    cyberCrowDependencies: [
      SAREA_CYBERCROW_DEPENDENCY_COPY,
      input.accessReviewStatus
        ? `Access review: ${input.accessReviewStatus}`
        : "Access review status pending",
    ],
    goNoGoDependencies: [goNoGoLabel(status)],
    previewRoutes: [
      routes.sarea.preview,
      routes.sarea.roleMapping,
      routes.tenant(tenant.slug).dashboard,
    ],
    fallbackUsed,
    tenantBackedPersonaCount,
    disclaimers: SAREA_EXPERIENCE_MAPPING_DISCLAIMERS,
  };
}

export async function buildSareaExperienceMappingPreviewForRequest(
  requestId: string
): Promise<SareaExperienceMappingSnapshot> {
  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    include: {
      requestedPlans: true,
      requestedModules: true,
      enterpriseBlueprint: {
        include: { tenant: { select: { id: true, slug: true } } },
      },
    },
  });

  const tenantId = request?.enterpriseBlueprint?.tenant?.id;
  if (tenantId) {
    const live = await buildSareaExperienceMappingSnapshotForTenantId(tenantId);
    if (live) return live;
  }

  const planKey = request?.requestedPlans[0]?.planKey ?? "growth";
  const modules = request?.requestedModules.map((m) => m.moduleKey) ?? [];
  const input = await loadBlueprintInput(tenantId ?? null, requestId, request?.enterpriseBlueprint?.id ?? null);

  const templates = selectTemplatesForContext(modules.length > 0 ? modules : ["workflows", "tasks"], 0);
  const personas = templates.map((t) => templateToPersona(t, null, modules));

  return {
    tenantSlug: request?.enterpriseBlueprint?.tenant?.slug ?? null,
    tenantName: request?.organizationName ?? "Request",
    status: input.discoveryAccepted ? "needs_roles" : "needs_blueprint",
    personas,
    missingInputs: [
      "Staging tenant for tenant-backed profiles",
      "CEM roles and departments at provision",
      "CyberCrow trust baseline after provision",
      ...(input.discoveryAccepted ? [] : ["ProCrow accept discovery into blueprint"]),
    ],
    warnings: [
      SAREA_COPY.fallback,
      "Pre-provision SAREA mapping is advisory — RBAC applies after tenant exists",
    ],
    blockers: request?.enterpriseBlueprint?.tenant
      ? []
      : ["Tenant not created — experience mapping is preparation-only"],
    recommendedActions: [
      `Confirm ${planKey} package personas against discovery modules`,
      "Document expected role → persona mapping before staging",
      "Review CyberCrow boundaries before Go/No-Go",
    ],
    cyberCrowDependencies: [SAREA_CYBERCROW_DEPENDENCY_COPY],
    goNoGoDependencies: [goNoGoLabel(input.discoveryAccepted ? "needs_roles" : "needs_blueprint")],
    previewRoutes: [routes.sarea.overview, routes.sarea.profiles, routes.sarea.roleMapping],
    fallbackUsed: true,
    tenantBackedPersonaCount: 0,
    disclaimers: SAREA_EXPERIENCE_MAPPING_DISCLAIMERS,
  };
}

/** Default studio context — primary lighthouse tenant when available. */
export async function buildSareaExperienceMappingStudioSnapshot(): Promise<SareaExperienceMappingSnapshot | null> {
  for (const slug of [MEEM_TENANT_SLUG, RIMAL_TENANT_SLUG]) {
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (tenant) {
      return buildSareaExperienceMappingSnapshotForTenantId(tenant.id);
    }
  }
  const first = await prisma.tenant.findFirst({
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });
  if (!first) return null;
  return buildSareaExperienceMappingSnapshotForTenantId(first.id);
}

export type SareaExperienceGoNoGoDependency = {
  status: "ready" | "warning" | "blocked";
  label: string;
  advisoryNote: string;
};

export function buildSareaExperienceGoNoGoDependency(): SareaExperienceGoNoGoDependency {
  return {
    status: "warning",
    label: "SAREA blueprint-to-experience mapping (M2)",
    advisoryNote:
      "Personas, navigation, and widget recommendations are advisory — RBAC controls access; SAREA does not grant permissions. Run npm run sarea-blueprint:verify after M2 changes.",
  };
}
