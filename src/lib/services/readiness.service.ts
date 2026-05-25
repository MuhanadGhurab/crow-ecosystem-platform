import type { ProposalStatus } from "@prisma/client";
import { GO_LIVE_CHECKLIST_ITEMS, type GoLiveChecklistKey } from "@/lib/constants/go-live-checklist";
import {
  READINESS_GROUP_META,
  READINESS_GROUP_ORDER,
  type ReadinessGroupKey,
} from "@/lib/constants/readiness-groups";
import { isMockBlueprintId } from "@/lib/mock/blueprint";
import { isUseMockData } from "@/lib/mock/env";
import { prisma } from "@/lib/db";

/** When true, provision is blocked until pre-go-live checks pass. */
export function isReadinessGateEnabled(): boolean {
  return process.env.GO_LIVE_READINESS_GATE === "true";
}

export function isReadinessStrictMode(): boolean {
  return process.env.GO_LIVE_READINESS_STRICT === "true";
}

export type PreProvisionReadiness = {
  canProvision: boolean;
  blockers: string[];
  warnings: string[];
};

export type ReadinessGroupItem = {
  key: string;
  label: string;
  required: boolean;
  passed: boolean;
  detail: string;
};

export type ReadinessGroup = {
  key: ReadinessGroupKey;
  title: string;
  description: string;
  entity?: "cem" | "cybercrow" | "sarea";
  items: ReadinessGroupItem[];
  requiredPassed: number;
  requiredTotal: number;
  passed: boolean;
};

export type GroupedReadinessSummary = {
  groups: ReadinessGroup[];
  canProvision: boolean;
  blockers: string[];
  warnings: string[];
  requiredPassed: number;
  requiredTotal: number;
};

const readinessBlueprintInclude = {
  modules: true,
  workflows: true,
  roles: true,
  sareaProfiles: true,
  securityBaselines: true,
  integrations: true,
  tenant: true,
  request: {
    include: {
      requestedSecurityPkgs: true,
      discoveryProfile: {
        include: {
          departments: true,
          branches: true,
          roles: true,
          workflows: true,
          securityRequirements: true,
          integrations: true,
          experienceRequirements: true,
        },
      },
    },
  },
} as const;

function mockGroupedReadiness(blueprintId: string): GroupedReadinessSummary {
  const allPass = isMockBlueprintId(blueprintId);
  const groups: ReadinessGroup[] = READINESS_GROUP_ORDER.map((key) => {
    const meta = READINESS_GROUP_META[key];
    const items: ReadinessGroupItem[] =
      key === "operations"
        ? GO_LIVE_CHECKLIST_ITEMS.filter(
            (i) =>
              i.key === "infrastructure_ready" ||
              i.key === "performance_validated" ||
              i.key === "support_ready"
          ).map((i) => ({
            key: i.key,
            label: i.label,
            required: false,
            passed: allPass,
            detail: allPass ? "Mock demo path" : "Requires live DB",
          }))
        : [
            {
              key: `${key}_ready`,
              label: meta.title,
              required: key !== "integrations" && key !== "subscription",
              passed: allPass,
              detail: allPass ? "Mock blueprint — demo ready" : "Connect Postgres for live checks",
            },
          ];
    const required = items.filter((i) => i.required);
    return {
      key,
      title: meta.title,
      description: meta.description,
      entity: meta.entity,
      items,
      requiredPassed: required.filter((i) => i.passed).length,
      requiredTotal: required.length,
      passed: required.every((i) => i.passed),
    };
  });
  const blockers = allPass
    ? []
    : ["Mock blueprint requires USE_MOCK_DATA or live Postgres for provision"];
  return {
    groups,
    canProvision: allPass && blockers.length === 0,
    blockers,
    warnings: allPass ? [] : ["UI-only mock — provision uses real Prisma when DB is connected"],
    requiredPassed: groups.reduce((n, g) => n + g.requiredPassed, 0),
    requiredTotal: groups.reduce((n, g) => n + g.requiredTotal, 0),
  };
}

export async function evaluateGroupedBlueprintReadiness(
  blueprintId: string
): Promise<GroupedReadinessSummary> {
  if (isUseMockData() && isMockBlueprintId(blueprintId)) {
    return mockGroupedReadiness(blueprintId);
  }

  const blueprint = await prisma.enterpriseBlueprint.findUnique({
    where: { id: blueprintId },
    include: readinessBlueprintInclude,
  });

  if (!blueprint) {
    throw new Error("Blueprint not found");
  }

  const discovery = blueprint.request.discoveryProfile;
  const tenantId = blueprint.tenant?.id;
  const blockers: string[] = [];
  const warnings: string[] = [];

  const moduleCount = blueprint.modules.filter((m) => m.enabled).length;
  const discDepts = discovery?.departments.length ?? 0;
  const discBranches = discovery?.branches.length ?? 0;
  const discRoles = discovery?.roles.length ?? 0;
  const bpRoles = blueprint.roles.length;
  const discWorkflows = discovery?.workflows.length ?? 0;
  const bpWorkflows = blueprint.workflows.length;
  const securityPkgs = blueprint.request.requestedSecurityPkgs.length;
  const discSecurity = discovery?.securityRequirements.length ?? 0;
  const bpSecurity = blueprint.securityBaselines.length;
  const discSarea = discovery?.experienceRequirements.length ?? 0;
  const bpSarea = blueprint.sareaProfiles.length;
  const discIntegrations = discovery?.integrations.length ?? 0;
  const bpIntegrations = blueprint.integrations.length;

  let tenantChecks: {
    cybercrowInit: boolean;
    sareaProfiles: number;
    workflows: number;
    memberships: number;
    profiles: number;
  } | null = null;

  if (tenantId) {
    const [auditInit, sareaCount, workflowCount, memberships, profiles] = await Promise.all([
      prisma.cybercrowAuditLog.findFirst({
        where: { tenantId, action: "CYBERCROW_INITIALIZED" },
      }),
      prisma.sareaExperienceProfile.count({ where: { tenantId } }),
      prisma.workflow.count({ where: { tenantId } }),
      prisma.tenantMembership.count({ where: { tenantId } }),
      prisma.profile.count({ where: { tenantId } }),
    ]);
    tenantChecks = {
      cybercrowInit: Boolean(auditInit),
      sareaProfiles: sareaCount,
      workflows: workflowCount,
      memberships,
      profiles,
    };
  }

  const groups: ReadinessGroup[] = [];

  const pushGroup = (key: ReadinessGroupKey, items: ReadinessGroupItem[]) => {
    const meta = READINESS_GROUP_META[key];
    const required = items.filter((i) => i.required);
    const group: ReadinessGroup = {
      key,
      title: meta.title,
      description: meta.description,
      entity: meta.entity,
      items,
      requiredPassed: required.filter((i) => i.passed).length,
      requiredTotal: required.length,
      passed: required.every((i) => i.passed),
    };
    groups.push(group);
    for (const item of required.filter((i) => !i.passed)) {
      blockers.push(`${meta.title}: ${item.label}`);
    }
    for (const item of items.filter((i) => !i.required && !i.passed)) {
      warnings.push(`${meta.title}: ${item.label} (recommended)`);
    }
  };

  pushGroup("modules", [
    {
      key: "modules_enabled",
      label: "At least one module enabled",
      required: true,
      passed: moduleCount > 0,
      detail: `${moduleCount} module(s) on blueprint`,
    },
  ]);

  pushGroup("org_structure", [
    {
      key: "departments",
      label: "Departments in discovery",
      required: true,
      passed: discDepts > 0 || Boolean(tenantChecks && tenantChecks.profiles > 0),
      detail:
        discDepts > 0
          ? `${discDepts} department(s) in discovery`
          : tenantChecks
            ? "Seeded from prior provision"
            : "Add departments in discovery",
    },
    {
      key: "branches",
      label: "Branches or sites",
      required: false,
      passed: discBranches > 0 || Boolean(tenantId),
      detail: `${discBranches} branch(es) in discovery`,
    },
  ]);

  pushGroup("rbac", [
    {
      key: "roles_defined",
      label: "Roles captured",
      required: true,
      passed: discRoles > 0 || bpRoles > 0 || (tenantChecks?.profiles ?? 0) > 0,
      detail: `${discRoles} discovery role(s), ${bpRoles} blueprint role(s)`,
    },
  ]);

  pushGroup("workflows", [
    {
      key: "workflows_defined",
      label: "Workflows in discovery or blueprint",
      required: true,
      passed:
        discWorkflows > 0 ||
        bpWorkflows > 0 ||
        (tenantChecks?.workflows ?? 0) > 0,
      detail: `${discWorkflows} discovery · ${bpWorkflows} blueprint · ${tenantChecks?.workflows ?? 0} tenant`,
    },
  ]);

  pushGroup("cybercrow", [
    {
      key: "security_package",
      label: "Security package on request",
      required: true,
      passed: securityPkgs > 0 || discSecurity > 0 || bpSecurity > 0,
      detail: `${securityPkgs} package(s) · ${discSecurity} discovery req · ${bpSecurity} baseline row(s)`,
    },
    {
      key: "cybercrow_initialized",
      label: "CyberCrow baseline initialized",
      required: Boolean(tenantId),
      passed: !tenantId || Boolean(tenantChecks?.cybercrowInit),
      detail: tenantChecks?.cybercrowInit
        ? "CYBERCROW_INITIALIZED audit present"
        : tenantId
          ? "Run provision or initializeCyberCrow"
          : "Checked after provision",
    },
  ]);

  pushGroup("sarea", [
    {
      key: "sarea_personas",
      label: "SAREA personas in discovery or blueprint",
      required: true,
      passed:
        discSarea > 0 ||
        bpSarea > 0 ||
        (tenantChecks?.sareaProfiles ?? 0) > 0,
      detail: `${discSarea} experience req · ${bpSarea} blueprint profile(s) · ${tenantChecks?.sareaProfiles ?? 0} tenant`,
    },
  ]);

  pushGroup("integrations", [
    {
      key: "integrations_recorded",
      label: "Integrations documented",
      required: false,
      passed: discIntegrations > 0 || bpIntegrations > 0,
      detail: `${discIntegrations} discovery · ${bpIntegrations} blueprint slot(s)`,
    },
  ]);

  const { getBlueprintSubscriptionReadinessItems } = await import(
    "@/lib/services/subscription-readiness.service"
  );
  const subscriptionItems = await getBlueprintSubscriptionReadinessItems(blueprintId).catch(
    () => [] as ReadinessGroupItem[]
  );
  if (subscriptionItems.length > 0) {
    pushGroup("subscription", subscriptionItems);
  } else {
    pushGroup("subscription", [
      {
        key: "subscription_context",
        label: "Plan scope reviewed",
        required: false,
        passed: true,
        detail: "No subscription advisories — plan scope aligns with blueprint footprint.",
      },
    ]);
  }

  const opsItems = await evaluateBlueprintReadiness(blueprintId).catch(() =>
    GO_LIVE_CHECKLIST_ITEMS.map((item) => ({
      key: item.key,
      label: item.label,
      required: item.required,
      passed: false,
      detail: "Could not evaluate",
    }))
  );

  pushGroup(
    "operations",
    opsItems
      .filter((i) =>
        [
          "blueprint_approved",
          "infrastructure_ready",
          "performance_validated",
          "support_ready",
          "identities_synced",
        ].includes(i.key)
      )
      .map((i) => ({
        key: i.key,
        label: i.label,
        required: i.required && !tenantId,
        passed: i.passed,
        detail: i.detail,
      }))
  );

  if (!discovery || discovery.status !== "COMPLETED") {
    blockers.push("Discovery must be completed before go-live");
  }

  if (blueprint.request.status !== "BLUEPRINT_BUILD" && !tenantId) {
    blockers.push(`Request must be in BLUEPRINT_BUILD (current: ${blueprint.request.status})`);
  }

  const proposal = blueprint.proposalStatus as ProposalStatus;
  if (proposal === "SENT") {
    blockers.push("Client must approve the commercial proposal before go-live");
  } else if (proposal === "DECLINED") {
    blockers.push("Commercial proposal was declined — resolve before go-live");
  } else if (proposal === "DRAFT") {
    warnings.push("Commercial proposal has not been sent to the client");
  }

  const requiredPassed = groups.reduce((n, g) => n + g.requiredPassed, 0);
  const requiredTotal = groups.reduce((n, g) => n + g.requiredTotal, 0);

  return {
    groups,
    canProvision: blockers.length === 0 && requiredPassed === requiredTotal,
    blockers: [...new Set(blockers)],
    warnings: [...new Set(warnings)],
    requiredPassed,
    requiredTotal,
  };
}

export async function evaluatePreProvisionReadiness(
  blueprintId: string
): Promise<PreProvisionReadiness> {
  const grouped = await evaluateGroupedBlueprintReadiness(blueprintId);
  const blockers = [...grouped.blockers];
  const warnings = [...grouped.warnings];

  if (isReadinessStrictMode()) {
    const items = await evaluateBlueprintReadiness(blueprintId);
    for (const item of items) {
      if (
        (item.key === "performance_validated" || item.key === "support_ready") &&
        item.required === false &&
        !item.passed
      ) {
        blockers.push(`${item.label} must be signed off (strict mode)`);
      }
    }
  }

  return {
    canProvision: blockers.length === 0,
    blockers,
    warnings,
  };
}

export async function assertBlueprintReadyForProvision(blueprintId: string): Promise<void> {
  if (!isReadinessGateEnabled()) return;

  const pre = await evaluatePreProvisionReadiness(blueprintId);
  if (!pre.canProvision) {
    throw new Error(`Go-live readiness: ${pre.blockers.join("; ")}`);
  }
}

export type ReadinessItem = {
  key: GoLiveChecklistKey;
  label: string;
  required: boolean;
  passed: boolean;
  detail: string;
};

export async function evaluateBlueprintReadiness(blueprintId: string): Promise<ReadinessItem[]> {
  const blueprint = await prisma.enterpriseBlueprint.findUnique({
    where: { id: blueprintId },
    include: {
      request: {
        include: {
          discoveryProfile: { include: { integrations: true } },
        },
      },
      tenant: true,
    },
  });

  if (!blueprint) {
    throw new Error("Blueprint not found");
  }

  const tenantId = blueprint.tenant?.id;
  const checks: Record<GoLiveChecklistKey, { passed: boolean; detail: string }> = {
    blueprint_approved: {
      passed: blueprint.status === "APPROVED" || Boolean(blueprint.tenant),
      detail:
        blueprint.status === "APPROVED"
          ? "Blueprint approved"
          : blueprint.tenant
            ? "Tenant already provisioned"
            : `Status: ${blueprint.status}`,
    },
    security_initialized: { passed: false, detail: "Not initialized" },
    sarea_configured: { passed: false, detail: "No SAREA profiles" },
    identities_synced: { passed: false, detail: "No memberships or profiles" },
    integrations_healthy: {
      passed: (blueprint.request.discoveryProfile?.integrations.length ?? 0) > 0,
      detail: `${blueprint.request.discoveryProfile?.integrations.length ?? 0} integration(s) in discovery`,
    },
    workflows_validated: { passed: false, detail: "No workflows" },
    infrastructure_ready: {
      passed: Boolean(process.env.DATABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL),
      detail: "DATABASE_URL and Supabase URL configured",
    },
    performance_validated: {
      passed: false,
      detail: "Run npm run smoke:phase1 before go-live",
    },
    support_ready: {
      passed: false,
      detail: "Mark when platform support is briefed",
    },
  };

  if (tenantId) {
    const [auditInit, sareaCount, memberships, profiles, workflows, manualRows] =
      await Promise.all([
        prisma.cybercrowAuditLog.findFirst({
          where: { tenantId, action: "CYBERCROW_INITIALIZED" },
        }),
        prisma.sareaExperienceProfile.count({ where: { tenantId } }),
        prisma.tenantMembership.count({ where: { tenantId } }),
        prisma.profile.count({ where: { tenantId } }),
        prisma.workflow.count({ where: { tenantId } }),
        prisma.blueprintGoLiveChecklist.findMany({ where: { blueprintId } }),
      ]);

    checks.security_initialized = {
      passed: Boolean(auditInit),
      detail: auditInit ? "CyberCrow baseline initialized" : "Provision tenant to initialize",
    };
    checks.sarea_configured = {
      passed: sareaCount > 0,
      detail: `${sareaCount} experience profile(s)`,
    };
    checks.identities_synced = {
      passed: memberships > 0 || profiles > 0,
      detail: `${memberships} auth membership(s), ${profiles} CEM profile(s)`,
    };
    checks.workflows_validated = {
      passed: workflows > 0,
      detail: `${workflows} workflow(s)`,
    };

    const manual = new Map(manualRows.map((r) => [r.itemKey, r.completed]));
    if (manual.get("performance_validated")) {
      checks.performance_validated = { passed: true, detail: "Smoke test acknowledged" };
    }
    if (manual.get("support_ready")) {
      checks.support_ready = { passed: true, detail: "Support briefed" };
    }
  }

  await syncChecklistRows(blueprintId, checks);

  return GO_LIVE_CHECKLIST_ITEMS.map((item) => ({
    key: item.key,
    label: item.label,
    required: item.required,
    passed: checks[item.key].passed,
    detail: checks[item.key].detail,
  }));
}

async function syncChecklistRows(
  blueprintId: string,
  checks: Record<GoLiveChecklistKey, { passed: boolean }>
) {
  for (const item of GO_LIVE_CHECKLIST_ITEMS) {
    await prisma.blueprintGoLiveChecklist.upsert({
      where: {
        blueprintId_itemKey: { blueprintId, itemKey: item.key },
      },
      create: {
        blueprintId,
        itemKey: item.key,
        completed: checks[item.key].passed,
      },
      update: {
        completed: checks[item.key].passed,
      },
    });
  }
}

export async function setManualReadinessItem(
  blueprintId: string,
  itemKey: GoLiveChecklistKey,
  completed: boolean
) {
  await prisma.blueprintGoLiveChecklist.upsert({
    where: { blueprintId_itemKey: { blueprintId, itemKey } },
    create: { blueprintId, itemKey, completed },
    update: { completed },
  });
}

export function readinessSummary(items: ReadinessItem[]) {
  const required = items.filter((i) => i.required);
  const requiredPassed = required.filter((i) => i.passed).length;
  const allPassed = items.filter((i) => i.passed).length;
  return {
    requiredPassed,
    requiredTotal: required.length,
    allPassed,
    allTotal: items.length,
    canProvision: required.every((i) => i.passed),
  };
}

export function groupedReadinessSummary(groups: ReadinessGroup[]) {
  const requiredPassed = groups.reduce((n, g) => n + g.requiredPassed, 0);
  const requiredTotal = groups.reduce((n, g) => n + g.requiredTotal, 0);
  return {
    requiredPassed,
    requiredTotal,
    canProvision: groups.every((g) => g.passed),
    groupCount: groups.length,
    groupsPassed: groups.filter((g) => g.passed).length,
  };
}
