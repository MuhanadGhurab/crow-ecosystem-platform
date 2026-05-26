import "@/lib/server-only-guard";

import { randomBytes } from "crypto";
import type { ProposalStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  getAiExtraKeys,
  getDiscoveryEmployeeBand,
  getSareaPackageKey,
} from "@/lib/discovery-answers";
import { getMockProposalByToken } from "@/lib/mock/blueprint";
import { planLabel, moduleLabel, securityPackageLabel } from "@/lib/catalog-labels";
import {
  calculateMonthlyEstimate,
  formatSar,
  type PricingEstimate,
} from "@/lib/services/pricing.service";

const requestPricingInclude = {
  requestedModules: true,
  requestedSecurityPkgs: true,
  requestedPlans: true,
  discoveryProfile: { include: { answers: true } },
} as const;

function pricingInputFromRequest(
  request: {
    employeeBand: string | null;
    requestedModules: { moduleKey: string }[];
    requestedSecurityPkgs: { packageKey: string }[];
    requestedPlans: { planKey: string }[];
    discoveryProfile: { answers: { sectionKey: string; questionKey: string; valueJson: unknown }[] } | null;
  }
) {
  const answers = request.discoveryProfile?.answers ?? [];
  return {
    planKey: (request.requestedPlans[0]?.planKey ?? "startup") as "startup" | "growth" | "enterprise",
    moduleKeys: request.requestedModules.map((m) => m.moduleKey),
    securityPackageKeys: request.requestedSecurityPkgs.map((p) => p.packageKey),
    employeeBand: getDiscoveryEmployeeBand(answers, request.employeeBand),
    sareaPackageKey: getSareaPackageKey(answers),
    aiExtraKeys: getAiExtraKeys(answers),
  };
}

export { formatSar } from "@/lib/services/pricing.service";

export async function refreshRequestPricingEstimate(requestId: string) {
  const request = await prisma.implementationRequest.findUniqueOrThrow({
    where: { id: requestId },
    include: requestPricingInclude,
  });

  const estimate = calculateMonthlyEstimate(pricingInputFromRequest(request));

  await prisma.implementationRequest.update({
    where: { id: requestId },
    data: { estimatedMonthlySar: estimate.totalMonthlySar },
  });

  return estimate;
}

export async function getRequestPricingEstimate(requestId: string): Promise<PricingEstimate | null> {
  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    include: requestPricingInclude,
  });
  if (!request?.requestedPlans[0]) return null;

  return calculateMonthlyEstimate(pricingInputFromRequest(request));
}

function newProposalToken(): string {
  return randomBytes(24).toString("base64url");
}

export async function sendCommercialProposal(blueprintId: string) {
  const blueprint = await prisma.enterpriseBlueprint.findUniqueOrThrow({
    where: { id: blueprintId },
    include: { request: true },
  });

  await refreshRequestPricingEstimate(blueprint.requestId);

  const token = blueprint.proposalToken ?? newProposalToken();

  return prisma.enterpriseBlueprint.update({
    where: { id: blueprintId },
    data: {
      proposalStatus: "SENT",
      proposalToken: token,
      proposalSentAt: new Date(),
    },
  });
}

export async function getProposalByToken(token: string) {
  const mock = getMockProposalByToken(token);
  if (mock) return mock;
  const blueprint = await prisma.enterpriseBlueprint.findUnique({
    where: { proposalToken: token },
    include: {
      modules: true,
      request: {
        include: {
          contacts: true,
          requestedModules: true,
          requestedSecurityPkgs: true,
          requestedPlans: true,
        },
      },
    },
  });

  if (!blueprint) return null;

  const estimate = await getRequestPricingEstimate(blueprint.requestId);

  return {
    blueprint,
    estimate,
    planKey: blueprint.request.requestedPlans[0]?.planKey,
    planLabel: blueprint.request.requestedPlans[0]
      ? planLabel(blueprint.request.requestedPlans[0].planKey)
      : "—",
    modules: blueprint.request.requestedModules.map((m) => ({
      key: m.moduleKey,
      label: moduleLabel(m.moduleKey),
    })),
    securityPackages: blueprint.request.requestedSecurityPkgs.map((p) => ({
      key: p.packageKey,
      label: securityPackageLabel(p.packageKey),
    })),
  };
}

export async function approveProposalByToken(token: string) {
  const blueprint = await prisma.enterpriseBlueprint.findUnique({
    where: { proposalToken: token },
  });

  if (!blueprint) {
    throw new Error("Proposal not found");
  }

  if (blueprint.proposalStatus === "CLIENT_APPROVED") {
    return blueprint;
  }

  if (blueprint.proposalStatus !== "SENT") {
    throw new Error("Proposal is not available for approval");
  }

  return prisma.enterpriseBlueprint.update({
    where: { id: blueprint.id },
    data: {
      proposalStatus: "CLIENT_APPROVED",
      clientApprovedAt: new Date(),
    },
  });
}

export async function declineProposalByToken(token: string) {
  const blueprint = await prisma.enterpriseBlueprint.findUnique({
    where: { proposalToken: token },
  });

  if (!blueprint) throw new Error("Proposal not found");

  return prisma.enterpriseBlueprint.update({
    where: { id: blueprint.id },
    data: { proposalStatus: "DECLINED" },
  });
}

export { proposalStatusLabel } from "@/lib/commercial-display";
