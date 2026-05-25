/**
 * F9 — Advisory gate before discovery → blueprint handoff.
 * Does not block unless callers opt into hard enforcement later.
 */

import { prisma } from "@/lib/db";
import { getConfirmedModuleKeys } from "@/lib/discovery-answers";
import { resolveSectorTemplateKey } from "@/lib/org-intelligence/resolve-sector";

export type DiscoveryBlueprintGateStatus =
  | "ready"
  | "needs_review"
  | "missing_data"
  | "blueprint_exists";

export type DiscoveryBlueprintGateItem = {
  key: string;
  label: string;
  passed: boolean;
  detail: string;
};

export type DiscoveryBlueprintGateResult = {
  status: DiscoveryBlueprintGateStatus;
  statusLabel: string;
  canProceedAdvisory: boolean;
  blockers: string[];
  warnings: string[];
  items: DiscoveryBlueprintGateItem[];
  existingBlueprintId: string | null;
  sectorTemplateKey: string | null;
  planKey: string | null;
};

function statusLabel(status: DiscoveryBlueprintGateStatus): string {
  switch (status) {
    case "ready":
      return "Ready";
    case "needs_review":
      return "Needs review";
    case "missing_data":
      return "Missing data";
    case "blueprint_exists":
      return "Blueprint already exists";
  }
}

export async function evaluateDiscoveryBlueprintGate(
  requestId: string
): Promise<DiscoveryBlueprintGateResult> {
  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    include: {
      requestedModules: true,
      requestedPlans: true,
      requestedSecurityPkgs: true,
      discoveryProfile: {
        include: {
          answers: true,
          departments: true,
          roles: true,
          workflows: true,
          securityRequirements: true,
          orgIntelligence: true,
        },
      },
      enterpriseBlueprint: { select: { id: true, status: true } },
    },
  });

  if (!request) {
    throw new Error("Request not found");
  }

  const profile = request.discoveryProfile;
  const existingBlueprintId = request.enterpriseBlueprint?.id ?? null;
  const blockers: string[] = [];
  const warnings: string[] = [];
  const items: DiscoveryBlueprintGateItem[] = [];

  if (existingBlueprintId) {
    return {
      status: "blueprint_exists",
      statusLabel: statusLabel("blueprint_exists"),
      canProceedAdvisory: true,
      blockers: [],
      warnings: [
        "Blueprint already linked — re-running completion refreshes modules and org model sync only.",
      ],
      items: [
        {
          key: "blueprint_linked",
          label: "Enterprise blueprint",
          passed: true,
          detail: `Blueprint ${existingBlueprintId} (${request.enterpriseBlueprint?.status ?? "unknown"})`,
        },
      ],
      existingBlueprintId,
      sectorTemplateKey: profile?.orgIntelligence?.sectorTemplateKey ?? null,
      planKey: request.requestedPlans[0]?.planKey ?? null,
    };
  }

  if (!profile) {
    blockers.push("Discovery profile missing — start discovery from admin first");
    return {
      status: "missing_data",
      statusLabel: statusLabel("missing_data"),
      canProceedAdvisory: false,
      blockers,
      warnings,
      items,
      existingBlueprintId: null,
      sectorTemplateKey: null,
      planKey: request.requestedPlans[0]?.planKey ?? null,
    };
  }

  const sectorFromAnswer = profile.answers.find(
    (a) => a.sectionKey === "org_intelligence" && a.questionKey === "sectorTemplateKey"
  )?.valueJson;
  const sectorTemplateKey =
    (typeof sectorFromAnswer === "string" ? sectorFromAnswer : null) ??
    profile.orgIntelligence?.sectorTemplateKey ??
    resolveSectorTemplateKey({
      industry: request.industry,
      moduleKeys: request.requestedModules.map((m) => m.moduleKey),
    });

  const moduleKeys = getConfirmedModuleKeys(
    request.requestedModules.map((m) => m.moduleKey),
    profile.answers
  );
  const planKey = request.requestedPlans[0]?.planKey ?? null;

  items.push({
    key: "request_active",
    label: "Request in discovery",
    passed: request.status === "UNDER_DISCOVERY",
    detail: `Status: ${request.status}`,
  });
  if (request.status !== "UNDER_DISCOVERY") {
    warnings.push(`Request status is ${request.status} — expected UNDER_DISCOVERY for first completion`);
  }

  items.push({
    key: "sector_template",
    label: "Sector template",
    passed: Boolean(sectorTemplateKey),
    detail: sectorTemplateKey ? `Sector: ${sectorTemplateKey}` : "No sectorTemplateKey",
  });
  if (!sectorTemplateKey) {
    blockers.push("Sector template not resolved");
  }

  items.push({
    key: "modules",
    label: "CEM modules",
    passed: moduleKeys.length > 0,
    detail: moduleKeys.length ? `${moduleKeys.length} module(s)` : "No modules on request",
  });
  if (moduleKeys.length === 0) {
    blockers.push("At least one CEM module required");
  }

  items.push({
    key: "plan",
    label: "Commercial plan",
    passed: Boolean(planKey),
    detail: planKey ? `Plan: ${planKey}` : "No plan on request",
  });
  if (!planKey) {
    warnings.push("No plan tier on request — blueprint pricing may use startup default");
  }

  const orgStatus = profile.orgIntelligence?.status;
  items.push({
    key: "org_intel",
    label: "Org intelligence",
    passed: Boolean(profile.orgIntelligence),
    detail: orgStatus
      ? `Status: ${orgStatus}`
      : "Not generated — apply sector template in discovery",
  });
  if (!profile.orgIntelligence) {
    warnings.push("Org intelligence not generated — blueprint org model sync may be thin");
  } else if (orgStatus !== "ACCEPTED") {
    warnings.push(
      `Org intelligence is ${orgStatus} — accept in organization model before go-live for best CEM seed`
    );
  }

  items.push({
    key: "structure",
    label: "Departments & roles",
    passed: profile.departments.length > 0 && profile.roles.length > 0,
    detail: `${profile.departments.length} dept · ${profile.roles.length} roles · ${profile.workflows.length} workflows`,
  });
  if (profile.departments.length === 0) {
    warnings.push("No departments in discovery — apply industry template or add manually");
  }
  if (profile.roles.length === 0) {
    warnings.push("No roles captured — RBAC seed may be empty at provision");
  }

  items.push({
    key: "security",
    label: "CyberCrow package",
    passed:
      request.requestedSecurityPkgs.length > 0 || profile.securityRequirements.length > 0,
    detail: `${request.requestedSecurityPkgs.length} package(s) on request`,
  });
  if (request.requestedSecurityPkgs.length === 0) {
    warnings.push("No security package on request — CyberCrow baseline still runs at provision");
  }

  let status: DiscoveryBlueprintGateStatus;
  if (blockers.length > 0) {
    status = "missing_data";
  } else if (warnings.length > 0) {
    status = "needs_review";
  } else {
    status = "ready";
  }

  return {
    status,
    statusLabel: statusLabel(status),
    canProceedAdvisory: blockers.length === 0,
    blockers,
    warnings,
    items,
    existingBlueprintId,
    sectorTemplateKey,
    planKey,
  };
}
