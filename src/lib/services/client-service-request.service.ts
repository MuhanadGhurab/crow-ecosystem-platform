import "@/lib/server-only-guard";

import type { User } from "@supabase/supabase-js";

import { findPlatformAccountBySupabaseUserId } from "@/lib/account/platform-account.service";
import { clientCanAccessRequestAuthoritative } from "@/lib/auth/customer-access.service";
import { prisma } from "@/lib/db";
import { generateImplementationReferenceCode } from "@/lib/pipeline/reference-code";
import { notifyPipelineEvent } from "@/lib/services/notification.service";
import { refreshRequestPricingEstimate } from "@/lib/services/commercial.service";
import { ensureClientRoleForAuthenticatedIntake } from "@/lib/services/client-request-link.service";
import type { ClientServiceRequestBrief, ClientServiceRequestBriefInput } from "@/lib/client-service-request/types";
import {
  markBriefSubmitted,
  parseRequestBriefFromNotes,
  serializeRequestBriefToNotes,
} from "@/lib/client-service-request/constants";
import {
  deriveOrganizationName,
  finalizeRequestBrief,
} from "@/lib/client-service-request/preliminary-recommendation";
import { sanitizeBriefForPersistence, validateClientServiceRequestBrief } from "@/lib/client-service-request/validation";

export type CreateModernServiceRequestResult = {
  id: string;
  referenceCode: string;
  status: string;
  brief: ClientServiceRequestBrief;
  duplicate: boolean;
};

async function findDuplicateByIdempotency(
  userId: string,
  idempotencyKey: string,
): Promise<{ id: string; referenceCode: string; status: string; brief: ClientServiceRequestBrief } | null> {
  const recent = await prisma.implementationRequest.findMany({
    where: {
      submittedByUserId: userId,
      createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, referenceCode: true, status: true, notes: true },
  });

  for (const row of recent) {
    const brief = parseRequestBriefFromNotes(row.notes);
    if (brief?.idempotencyKey === idempotencyKey) {
      return { id: row.id, referenceCode: row.referenceCode, status: row.status, brief };
    }
  }
  return null;
}

export async function createModernServiceRequest(
  user: User,
  input: ClientServiceRequestBriefInput,
): Promise<CreateModernServiceRequestResult> {
  const access = await ensureClientRoleForAuthenticatedIntake(user);
  if (!access.ok) throw new Error(access.error);

  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account) {
    throw new Error("Complete account registration and legal acceptance before submitting a request.");
  }

  const profile = await prisma.platformAccountProfile.findUnique({
    where: { platformAccountId: account.id },
    select: { displayName: true },
  });

  const validated = validateClientServiceRequestBrief(input);
  if (!validated.ok) throw new Error(validated.errors.join("; "));

  const duplicate = await findDuplicateByIdempotency(user.id, validated.brief.idempotencyKey);
  if (duplicate) {
    return { ...duplicate, duplicate: true };
  }

  const brief = markBriefSubmitted(finalizeRequestBrief(validated.brief));
  const organizationName = deriveOrganizationName(validated.brief);
  const email = user.email;
  if (!email) throw new Error("Account email is required to submit a service request.");

  const created = await prisma.implementationRequest.create({
    data: {
      referenceCode: generateImplementationReferenceCode(),
      submittedByUserId: user.id,
      organizationName,
      industry: brief.primaryBusinessFieldKey ?? (brief.customFieldDescription ? "custom_unresolved" : null),
      employeeBand: brief.currentTeamRange,
      countryCode: "SA",
      status: "PENDING_REVIEW",
      notes: serializeRequestBriefToNotes(sanitizeBriefForPersistence(brief)),
      contacts: {
        create: {
          fullName: profile?.displayName?.trim() || email.split("@")[0] || "Client",
          email,
          isPrimary: true,
        },
      },
      requestedModules: { create: [] },
      requestedSecurityPkgs: { create: [] },
      requestedPlans: { create: { planKey: "startup" } },
    },
  });

  void notifyPipelineEvent("request_received", email, {
    requestId: created.id,
    referenceCode: created.referenceCode,
    organizationName: created.organizationName,
    contactName: profile?.displayName ?? "Client",
  });

  await refreshRequestPricingEstimate(created.id).catch(() => null);

  return {
    id: created.id,
    referenceCode: created.referenceCode,
    status: created.status,
    brief,
    duplicate: false,
  };
}

export async function getModernServiceRequestBrief(
  userId: string,
  requestId: string,
): Promise<ClientServiceRequestBrief | null> {
  const allowed = await clientCanAccessRequestAuthoritative(userId, requestId);
  if (!allowed) return null;

  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    select: { notes: true },
  });
  if (!request) return null;
  return parseRequestBriefFromNotes(request.notes);
}

export async function ensureDiscoveryProfileForDesignSave(requestId: string): Promise<string> {
  const existing = await prisma.discoveryProfile.findUnique({ where: { requestId } });
  if (existing) return existing.id;
  const profile = await prisma.discoveryProfile.create({
    data: { requestId, status: "IN_PROGRESS" },
  });
  return profile.id;
}
