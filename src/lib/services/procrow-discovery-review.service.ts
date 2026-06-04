import "@/lib/server-only-guard";

import type { User } from "@supabase/supabase-js";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  CLIENT_DISCOVERY_SECTION,
  type ClientDiscoveryStep,
} from "@/lib/client-portal/client-discovery-contract";
import {
  canAcceptDiscoveryIntoBlueprint,
  canRequestProCrowDiscoveryChanges,
  canStartProCrowDiscoveryReview,
  PROCROW_DISCOVERY_CHANGE_SECTION_ALLOWLIST,
  PROCROW_DISCOVERY_REVIEW_EVENT_TYPES,
  type ProCrowDiscoveryBlueprintInputReadiness,
  type ProCrowDiscoveryChangeRequest,
  type ProCrowDiscoveryReviewSnapshot,
} from "@/lib/procrow/procrow-discovery-review-contract";

export {
  canAcceptDiscoveryIntoBlueprint,
  canRequestProCrowDiscoveryChanges,
  canStartProCrowDiscoveryReview,
} from "@/lib/procrow/procrow-discovery-review-contract";
import {
  buildDraftFromContext,
  computeClientDiscoveryMissingSteps,
} from "@/lib/services/client-discovery.service";
import { upsertDiscoveryAnswer } from "@/lib/services/discovery.service";
import {
  legacyStatusFromSplit,
  severityForNotification,
} from "@/lib/services/platform-notification-links";

const PLATFORM_ADVISORY_EMAIL = "platform-advisory@internal.crow";

function parseAnswerString(
  answers: { sectionKey: string; questionKey: string; valueJson: unknown }[],
  questionKey: string
): string | null {
  const row = answers.find(
    (a) => a.sectionKey === CLIENT_DISCOVERY_SECTION && a.questionKey === questionKey
  );
  if (!row) return null;
  const v = row.valueJson;
  if (typeof v === "string") return v.trim() || null;
  if (v === null || v === undefined) return null;
  return String(v);
}

function parseAnswerStringArray(
  answers: { sectionKey: string; questionKey: string; valueJson: unknown }[],
  questionKey: string
): string[] {
  const row = answers.find(
    (a) => a.sectionKey === CLIENT_DISCOVERY_SECTION && a.questionKey === questionKey
  );
  if (!row) return [];
  const v = row.valueJson;
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  return [];
}

function parseChangeRequest(
  answers: { sectionKey: string; questionKey: string; valueJson: unknown }[]
): ProCrowDiscoveryChangeRequest | null {
  const message = parseAnswerString(answers, "changeRequestMessage");
  if (!message) return null;
  const sections = parseAnswerStringArray(answers, "changeRequestSections").filter(
    (s): s is ClientDiscoveryStep =>
      (PROCROW_DISCOVERY_CHANGE_SECTION_ALLOWLIST as readonly string[]).includes(s)
  );
  const requestedAt = parseAnswerString(answers, "changeRequestedAt");
  if (!requestedAt) return null;
  return {
    message,
    requestedSections: sections,
    requestedAt,
    requestedBy: parseAnswerString(answers, "changeRequestedBy"),
  };
}

function buildBlueprintInputReadiness(
  missingSections: ClientDiscoveryStep[]
): ProCrowDiscoveryBlueprintInputReadiness {
  if (missingSections.length === 0) {
    return {
      ready: true,
      missingSections: [],
      detail: "All required discovery sections are complete.",
    };
  }
  return {
    ready: false,
    missingSections,
    detail: `Complete required sections before accept: ${missingSections.join(", ")}`,
  };
}

function recommendedOperatorActions(
  snapshot: Omit<ProCrowDiscoveryReviewSnapshot, "recommendedOperatorActions">
): string[] {
  const actions: string[] = [];
  switch (snapshot.status) {
    case "not_started":
    case "in_progress":
      actions.push("Wait for the client to submit guided discovery from the Client Portal.");
      break;
    case "submitted_for_procrow_review":
      actions.push("Start ProCrow review when ready to evaluate client selections.");
      break;
    case "procrow_reviewing":
      if (snapshot.blueprintInputReadiness.ready) {
        actions.push("Accept discovery into blueprint input, or request changes from the client.");
      } else {
        actions.push("Request changes — required discovery sections are incomplete.");
      }
      break;
    case "changes_requested":
      actions.push("Wait for the client to revise discovery and resubmit.");
      break;
    case "accepted_into_blueprint":
      if (!snapshot.hasBlueprintDraft) {
        actions.push(
          "Generate enterprise blueprint draft from discovery workspace when ready (ProCrow-controlled)."
        );
      } else {
        actions.push("Refine blueprint draft, prepare proposal/pricing, and continue operator pipeline.");
      }
      if (snapshot.blueprintId) {
        actions.push(`Open blueprint ${snapshot.blueprintId} for proposal and readiness work.`);
      }
      break;
    default:
      break;
  }
  return actions;
}

async function loadRequestForReview(requestId: string) {
  return prisma.implementationRequest.findUnique({
    where: { id: requestId },
    include: {
      contacts: { where: { isPrimary: true }, take: 1 },
      requestedModules: true,
      enterpriseBlueprint: { select: { id: true, status: true, proposalStatus: true } },
      discoveryProfile: {
        include: {
          answers: true,
          departments: true,
          roles: true,
          workflows: true,
        },
      },
    },
  });
}

export async function buildProCrowDiscoveryReviewSnapshot(
  requestId: string
): Promise<ProCrowDiscoveryReviewSnapshot | null> {
  const request = await loadRequestForReview(requestId);
  if (!request) return null;

  const draft = buildDraftFromContext(requestId, request);
  const missingSections = computeClientDiscoveryMissingSteps(draft);
  const answers = request.discoveryProfile?.answers ?? [];
  const primary = request.contacts[0];

  const blueprintInputReadiness = buildBlueprintInputReadiness(missingSections);
  const partial: Omit<ProCrowDiscoveryReviewSnapshot, "recommendedOperatorActions"> = {
    requestId,
    companyName: request.organizationName,
    clientName: primary?.fullName ?? null,
    clientEmail: primary?.email ?? null,
    referenceCode: request.referenceCode,
    status: draft.status,
    submittedAt: draft.submittedAt,
    reviewedAt: parseAnswerString(answers, "reviewStartedAt"),
    reviewerName: parseAnswerString(answers, "reviewerEmail"),
    industryTemplate: draft.industryTemplate,
    companyStageTemplate: draft.companyStageTemplate,
    employeeBand: draft.employeeBand,
    selectedModules: draft.selectedModules,
    departments: draft.selectedDepartments,
    roles: draft.selectedRoles,
    workflows: draft.selectedWorkflows,
    securityPreference: draft.securityPreference,
    sareaPreference: draft.sareaPreference,
    clientNotes: draft.notes,
    missingSections,
    blueprintInputReadiness,
    changeRequest: parseChangeRequest(answers),
    acceptedAt: parseAnswerString(answers, "acceptedAt"),
    acceptedBy: parseAnswerString(answers, "acceptedBy"),
    blueprintId: request.enterpriseBlueprint?.id ?? null,
    hasBlueprintDraft: Boolean(request.enterpriseBlueprint),
  };

  return {
    ...partial,
    recommendedOperatorActions: recommendedOperatorActions(partial),
  };
}

export function isDiscoveryReviewable(
  status: ProCrowDiscoveryReviewSnapshot["status"]
): boolean {
  return (
    status === "submitted_for_procrow_review" ||
    status === "procrow_reviewing" ||
    status === "changes_requested" ||
    status === "accepted_into_blueprint"
  );
}

async function logProcrowDiscoveryNotification(input: {
  eventType: string;
  recipientEmail: string;
  subject: string;
  body: string;
  metadata: Record<string, unknown>;
}) {
  const email = input.recipientEmail.trim().toLowerCase() || PLATFORM_ADVISORY_EMAIL;
  const deliveryStatus = "logged" as const;
  const inboxStatus = "open" as const;
  const metadata = { ...input.metadata, advisory: true, procrowDiscoveryReview: true };

  await prisma.platformNotification.create({
    data: {
      eventType: input.eventType,
      recipientEmail: email,
      subject: input.subject,
      body: input.body,
      status: legacyStatusFromSplit(deliveryStatus, inboxStatus),
      deliveryStatus,
      inboxStatus,
      severity: severityForNotification(input.eventType, deliveryStatus, metadata),
      metadata,
    },
  });
}

export async function notifyClientDiscoverySubmitted(requestId: string): Promise<void> {
  const snapshot = await buildProCrowDiscoveryReviewSnapshot(requestId);
  if (!snapshot) return;

  const body = [
    `Client discovery submitted for ProCrow review.`,
    `Organization: ${snapshot.companyName}`,
    `Reference: ${snapshot.referenceCode}`,
    "",
    "Review in ProCrow request workspace — accept into blueprint input or request changes.",
  ].join("\n");

  await logProcrowDiscoveryNotification({
    eventType: PROCROW_DISCOVERY_REVIEW_EVENT_TYPES.clientSubmitted,
    recipientEmail: PLATFORM_ADVISORY_EMAIL,
    subject: `Client discovery submitted — ${snapshot.referenceCode}`,
    body,
    metadata: {
      requestId,
      referenceCode: snapshot.referenceCode,
      organizationName: snapshot.companyName,
      clientEmail: snapshot.clientEmail ?? undefined,
    },
  });
}

export async function startProCrowDiscoveryReview(
  user: User,
  requestId: string
): Promise<void> {
  const snapshot = await buildProCrowDiscoveryReviewSnapshot(requestId);
  if (!snapshot) throw new Error("Request not found.");
  if (!canStartProCrowDiscoveryReview(snapshot)) {
    throw new Error("Discovery is not in submitted status.");
  }

  const now = new Date().toISOString();
  const reviewerEmail = user.email?.trim() || null;

  await upsertDiscoveryAnswer(requestId, CLIENT_DISCOVERY_SECTION, "status", "procrow_reviewing");
  await upsertDiscoveryAnswer(requestId, CLIENT_DISCOVERY_SECTION, "reviewStartedAt", now);
  if (reviewerEmail) {
    await upsertDiscoveryAnswer(requestId, CLIENT_DISCOVERY_SECTION, "reviewerEmail", reviewerEmail);
  }

  const profile = await prisma.discoveryProfile.findUnique({ where: { requestId } });
  if (profile) {
    await prisma.discoveryProfile.update({
      where: { id: profile.id },
      data: { summary: "ProCrow is reviewing client-led discovery." },
    });
  }
}

export async function requestClientDiscoveryChanges(
  user: User,
  requestId: string,
  message: string,
  sections: ClientDiscoveryStep[]
): Promise<void> {
  const snapshot = await buildProCrowDiscoveryReviewSnapshot(requestId);
  if (!snapshot) throw new Error("Request not found.");
  if (!canRequestProCrowDiscoveryChanges(snapshot)) {
    throw new Error("Cannot request changes in the current discovery status.");
  }

  const trimmed = message.trim();
  if (!trimmed) throw new Error("Change request message is required.");
  if (trimmed.length > 2000) throw new Error("Change request message is too long.");

  const allowed = sections.filter((s) =>
    (PROCROW_DISCOVERY_CHANGE_SECTION_ALLOWLIST as readonly string[]).includes(s)
  );
  if (allowed.length === 0) {
    throw new Error("Select at least one section for the client to revise.");
  }

  const now = new Date().toISOString();
  const requestedBy = user.email?.trim() || null;

  await upsertDiscoveryAnswer(requestId, CLIENT_DISCOVERY_SECTION, "status", "changes_requested");
  await upsertDiscoveryAnswer(requestId, CLIENT_DISCOVERY_SECTION, "changeRequestMessage", trimmed);
  await upsertDiscoveryAnswer(requestId, CLIENT_DISCOVERY_SECTION, "changeRequestSections", allowed);
  await upsertDiscoveryAnswer(requestId, CLIENT_DISCOVERY_SECTION, "changeRequestedAt", now);
  if (requestedBy) {
    await upsertDiscoveryAnswer(requestId, CLIENT_DISCOVERY_SECTION, "changeRequestedBy", requestedBy);
  }

  const profile = await prisma.discoveryProfile.findUnique({ where: { requestId } });
  if (profile) {
    await prisma.discoveryProfile.update({
      where: { id: profile.id },
      data: { summary: "ProCrow requested discovery changes from the client." },
    });
  }

  await logProcrowDiscoveryNotification({
    eventType: PROCROW_DISCOVERY_REVIEW_EVENT_TYPES.changesRequested,
    recipientEmail: snapshot.clientEmail ?? PLATFORM_ADVISORY_EMAIL,
    subject: `Discovery changes requested — ${snapshot.referenceCode}`,
    body: [
      trimmed,
      "",
      `Sections: ${allowed.join(", ")}`,
      `Organization: ${snapshot.companyName}`,
      "",
      "Client: revise discovery in the Client Portal and resubmit for ProCrow review.",
    ].join("\n"),
    metadata: {
      requestId,
      referenceCode: snapshot.referenceCode,
      requestedSections: allowed,
      requestedBy: requestedBy ?? undefined,
    },
  });
}

function buildAcceptedBlueprintInputSummary(
  snapshot: ProCrowDiscoveryReviewSnapshot
): Record<string, unknown> {
  return {
    acceptedAt: new Date().toISOString(),
    acceptedBy: snapshot.acceptedBy,
    industryTemplate: snapshot.industryTemplate,
    companyStageTemplate: snapshot.companyStageTemplate,
    employeeBand: snapshot.employeeBand,
    selectedModules: snapshot.selectedModules,
    departments: snapshot.departments,
    roles: snapshot.roles,
    workflows: snapshot.workflows,
    securityPreference: snapshot.securityPreference,
    sareaPreference: snapshot.sareaPreference,
    clientNotes: snapshot.clientNotes,
    advisory:
      "Official blueprint input from client-led discovery. Not proposal approval, payment, or tenant provisioning.",
  };
}

export async function acceptClientDiscoveryIntoBlueprint(
  user: User,
  requestId: string
): Promise<void> {
  const snapshot = await buildProCrowDiscoveryReviewSnapshot(requestId);
  if (!snapshot) throw new Error("Request not found.");
  if (!canAcceptDiscoveryIntoBlueprint(snapshot)) {
    if (!snapshot.blueprintInputReadiness.ready) {
      throw new Error(snapshot.blueprintInputReadiness.detail);
    }
    throw new Error("Discovery cannot be accepted in the current status.");
  }

  const now = new Date().toISOString();
  const acceptedBy = user.email?.trim() || null;
  const inputSummary = buildAcceptedBlueprintInputSummary({
    ...snapshot,
    acceptedAt: now,
    acceptedBy,
  });

  await upsertDiscoveryAnswer(requestId, CLIENT_DISCOVERY_SECTION, "status", "accepted_into_blueprint");
  await upsertDiscoveryAnswer(requestId, CLIENT_DISCOVERY_SECTION, "acceptedAt", now);
  if (acceptedBy) {
    await upsertDiscoveryAnswer(requestId, CLIENT_DISCOVERY_SECTION, "acceptedBy", acceptedBy);
  }
  await upsertDiscoveryAnswer(
    requestId,
    CLIENT_DISCOVERY_SECTION,
    "acceptedBlueprintInput",
    inputSummary as Prisma.InputJsonValue
  );

  const profile = await prisma.discoveryProfile.findUnique({ where: { requestId } });
  if (profile) {
    await prisma.discoveryProfile.update({
      where: { id: profile.id },
      data: {
        summary:
          "Client discovery accepted as official blueprint input. ProCrow owns proposal, pricing, and runtime preparation.",
      },
    });
  }

  await logProcrowDiscoveryNotification({
    eventType: PROCROW_DISCOVERY_REVIEW_EVENT_TYPES.acceptedIntoBlueprint,
    recipientEmail: snapshot.clientEmail ?? PLATFORM_ADVISORY_EMAIL,
    subject: `Discovery accepted into blueprint — ${snapshot.referenceCode}`,
    body: [
      "Client discovery is now approved as blueprint input.",
      `Organization: ${snapshot.companyName}`,
      "",
      "This is not proposal approval, payment acceptance, tenant creation, or production go-live.",
      snapshot.hasBlueprintDraft
        ? "Blueprint draft exists — refine in ProCrow discovery workspace."
        : "No blueprint draft yet — generate from discovery workspace when ready (ProCrow-controlled).",
    ].join("\n"),
    metadata: {
      requestId,
      referenceCode: snapshot.referenceCode,
      blueprintId: snapshot.blueprintId ?? undefined,
      acceptedBy: acceptedBy ?? undefined,
    },
  });
}

export function parseClientProcrowFeedbackFromAnswers(
  answers: { sectionKey: string; questionKey: string; valueJson: unknown }[]
): {
  changeRequest: ProCrowDiscoveryChangeRequest | null;
  acceptedAt: string | null;
} {
  return {
    changeRequest: parseChangeRequest(answers),
    acceptedAt: parseAnswerString(answers, "acceptedAt"),
  };
}
