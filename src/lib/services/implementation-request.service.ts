import type { Prisma } from "@prisma/client";
import {
  isModernServiceRequest,
  parseRequestBriefFromNotes,
  serializeRequestBriefToNotes,
} from "@/lib/client-service-request/constants";
import { prisma } from "@/lib/db";
import { refreshRequestPricingEstimate } from "@/lib/services/commercial.service";
import { notifyPipelineEvent } from "@/lib/services/notification.service";
import type { ImplementationRequestInput } from "@/lib/types/platform";
import { generateImplementationReferenceCode } from "@/lib/pipeline/reference-code";

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

export async function createImplementationRequest(
  input: ImplementationRequestInput,
  options?: { submittedByUserId?: string }
) {
  const created = await prisma.implementationRequest.create({
    data: {
      referenceCode: generateImplementationReferenceCode(),
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
      requestId: created.id,
      referenceCode: created.referenceCode,
      organizationName: created.organizationName,
      contactName: primary.fullName,
    });
  }

  const platformEmail = process.env.PLATFORM_NOTIFY_EMAIL;
  if (platformEmail) {
    void notifyPipelineEvent("request_received", platformEmail, {
      requestId: created.id,
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
  const existing = await prisma.implementationRequest.findUnique({
    where: { id },
    select: { notes: true },
  });

  const trimmed = reason?.trim();
  let notesUpdate: string | undefined;

  if (trimmed) {
    const brief = parseRequestBriefFromNotes(existing?.notes);
    if (brief) {
      // Preserve brief JSON — store rejection note inside qualification / operator note.
      const merged = {
        ...brief,
        procrowQualification: {
          outcome: "declined" as const,
          operatorNote: trimmed,
          recordedAt: new Date().toISOString(),
          recordedByPlatformAccountId:
            brief.procrowQualification?.recordedByPlatformAccountId ?? "system-reject",
        },
      };
      notesUpdate = serializeRequestBriefToNotes(merged);
    } else if (existing?.notes && isModernServiceRequest(existing.notes)) {
      notesUpdate = existing.notes;
    } else {
      // Legacy non-brief notes: append rather than replace when possible.
      notesUpdate = existing?.notes
        ? `${existing.notes}\n\n[Rejected] ${trimmed}`
        : trimmed;
    }
  }

  return prisma.implementationRequest.update({
    where: { id },
    data: {
      status: "REJECTED",
      ...(notesUpdate !== undefined ? { notes: notesUpdate } : {}),
    },
  });
}
