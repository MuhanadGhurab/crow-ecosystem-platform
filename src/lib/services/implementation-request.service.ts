import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { refreshRequestPricingEstimate } from "@/lib/services/commercial.service";
import { notifyPipelineEvent } from "@/lib/services/notification.service";
import type { ImplementationRequestInput } from "@/lib/types/platform";

const activeDiscoveryRequestArgs = {
  include: {
    discoveryProfile: {
      include: {
        answers: true,
        departments: { select: { id: true } },
        branches: { select: { id: true } },
        roles: { select: { id: true } },
        workflows: { select: { id: true } },
        securityRequirements: { select: { id: true } },
      },
    },
    enterpriseBlueprint: { select: { id: true, status: true } },
  },
} satisfies Prisma.ImplementationRequestFindManyArgs;

export type ActiveDiscoveryRequestListItem = Prisma.ImplementationRequestGetPayload<
  typeof activeDiscoveryRequestArgs
>;

function generateReferenceCode(): string {
  const year = new Date().getFullYear();
  const seq = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CROW-${year}-${seq}`;
}

export async function createImplementationRequest(
  input: ImplementationRequestInput,
  options?: { submittedByUserId?: string }
) {
  const created = await prisma.implementationRequest.create({
    data: {
      referenceCode: generateReferenceCode(),
      submittedByUserId: options?.submittedByUserId,
      organizationName: input.organizationName,
      organizationNameAr: input.organizationNameAr,
      industry: input.industry,
      employeeBand: input.employeeBand,
      countryCode: input.countryCode ?? "SA",
      status: "PENDING_REVIEW",
      notes: input.notes,
      contacts: {
        create: {
          fullName: input.contact.fullName,
          email: input.contact.email,
          phone: input.contact.phone,
          jobTitle: input.contact.jobTitle,
          isPrimary: true,
        },
      },
      requestedModules: {
        create: input.moduleKeys.map((moduleKey) => ({ moduleKey })),
      },
      requestedSecurityPkgs: {
        create: input.securityPackageKeys.map((packageKey) => ({ packageKey })),
      },
      requestedPlans: {
        create: { planKey: input.planKey },
      },
    },
    include: { contacts: true, requestedModules: true },
  });

  const primary = created.contacts.find((c) => c.isPrimary) ?? created.contacts[0];
  if (primary?.email) {
    void notifyPipelineEvent("request_received", primary.email, {
      referenceCode: created.referenceCode,
      organizationName: created.organizationName,
      contactName: primary.fullName,
    });
  }

  const platformEmail = process.env.PLATFORM_NOTIFY_EMAIL;
  if (platformEmail) {
    void notifyPipelineEvent("request_received", platformEmail, {
      referenceCode: created.referenceCode,
      organizationName: created.organizationName,
      contactName: primary?.fullName ?? "Team",
    });
  }

  await refreshRequestPricingEstimate(created.id);

  return prisma.implementationRequest.findUniqueOrThrow({
    where: { id: created.id },
    include: { contacts: true, requestedModules: true },
  });
}

export async function listImplementationRequests(status?: string) {
  return prisma.implementationRequest.findMany({
    where: status ? { status: status as never } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      contacts: true,
      requestedPlans: true,
      requestedModules: true,
      requestedSecurityPkgs: true,
      discoveryProfile: { include: { answers: true } },
    },
  });
}

export async function listActiveDiscoveryRequests(): Promise<ActiveDiscoveryRequestListItem[]> {
  return prisma.implementationRequest.findMany({
    where: {
      status: { in: ["UNDER_DISCOVERY", "BLUEPRINT_BUILD"] },
    },
    orderBy: { updatedAt: "desc" },
    ...activeDiscoveryRequestArgs,
  });
}

export async function getImplementationRequest(id: string) {
  return prisma.implementationRequest.findUnique({
    where: { id },
    include: {
      contacts: true,
      requestedModules: true,
      requestedSecurityPkgs: true,
      requestedPlans: true,
      discoveryProfile: { include: { answers: true } },
      enterpriseBlueprint: { include: { tenant: true } },
    },
  });
}

export async function rejectImplementationRequest(id: string, reason?: string) {
  return prisma.implementationRequest.update({
    where: { id },
    data: {
      status: "REJECTED",
      ...(reason ? { notes: reason } : {}),
    },
  });
}
