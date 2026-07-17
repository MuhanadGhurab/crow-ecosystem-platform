import "server-only";

import { prisma } from "@/lib/db";
import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import { routes } from "@/lib/routes";
import { getCemCommandCenterSnapshot } from "@/lib/services/cem-command-center.service";
import { getOperatorConsoleSnapshot } from "@/lib/services/operator-console.service";
import { getPlatformNotificationInboxSummary } from "@/lib/services/platform-notification.service";
import { CLIENT_REVIEW_NOTE_EVENT_TYPES } from "@/lib/client-portal/client-review-notes-contract";
import type {
  ProCrowOperatorQueueItem,
  ProCrowOperatorQueueSnapshot,
  ProCrowOperatorQueueSummary,
  ProCrowQueueItemSource,
  ProCrowQueueItemStatus,
  ProCrowQueueOwner,
  ProCrowQueuePriority,
  ProCrowQueueStage,
} from "@/lib/procrow/procrow-operator-queue-contract";

export type ProCrowQueueDeriveInput = {
  operatorBuckets: {
    pending_review: { requestId: string; referenceCode: string }[];
    blueprint_pending: { requestId: string; referenceCode: string }[];
    ready_go_live: { requestId: string; referenceCode: string }[];
    needs_review: { requestId: string; referenceCode: string }[];
  };
  blueprints: Awaited<ReturnType<typeof loadBlueprintProposalRows>>;
  notificationHigh: number;
  tenantsAttention: { id: string; slug: string; name: string }[];
  openIncidents: number;
  mappingGap: boolean;
  openReviewNotesCount: number;
  openRequestChangesCount: number;
  /** requestId → organization display name (advisory context) */
  requestOrgById?: Map<string, string>;
};

async function loadBlueprintProposalRows() {
  try {
    return await prisma.enterpriseBlueprint.findMany({
      orderBy: { updatedAt: "desc" },
      take: 60,
      select: {
        id: true,
        requestId: true,
        proposalStatus: true,
        clientApprovedAt: true,
        proposalSentAt: true,
      },
    });
  } catch {
    return [];
  }
}

const PRI_ORDER: Record<ProCrowQueuePriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function emptySummary(): ProCrowOperatorQueueSummary {
  return {
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    waitingOnClient: 0,
    waitingOnProCrow: 0,
    blocked: 0,
    readyForAction: 0,
  };
}

function emptyStageBuckets(): Record<ProCrowQueueStage, ProCrowOperatorQueueItem[]> {
  return {
    intake: [],
    discovery: [],
    blueprint: [],
    proposal: [],
    client_review: [],
    approval: [],
    onboarding: [],
    tenant_readiness: [],
    runtime_trust: [],
    complete: [],
  };
}

/** Safe empty snapshot for limited-data / error paths (no derived items). */
export function emptyProCrowOperatorQueueSnapshot(): ProCrowOperatorQueueSnapshot {
  return {
    generatedAt: new Date(),
    items: [],
    summary: emptySummary(),
    stageBuckets: emptyStageBuckets(),
    nextRecommendedActions: ["Review operator queue", "Confirm staging/demo posture"],
    safetyNotes: [
      "Operator queue is derived readiness — not a task system and not autonomous operations.",
      "Tenant provisioning remains ProCrow-controlled; production remains F23-gated.",
      "No payment activation or unattended tenant creation from this view — staging and advisory posture only.",
    ],
  };
}

function summarizeAndBucket(items: ProCrowOperatorQueueItem[]): {
  summary: ProCrowOperatorQueueSummary;
  stageBuckets: Record<ProCrowQueueStage, ProCrowOperatorQueueItem[]>;
} {
  const summary = emptySummary();
  summary.total = items.length;
  const stageBuckets = emptyStageBuckets();

  for (const it of items) {
    summary[it.priority]++;
    if (it.status === "waiting_on_client") summary.waitingOnClient++;
    if (it.status === "waiting_on_procrow") summary.waitingOnProCrow++;
    if (it.status === "blocked") summary.blocked++;
    if (
      it.status === "needs_review" ||
      it.status === "blocked" ||
      it.status === "waiting_on_procrow" ||
      it.status === "new" ||
      it.status === "in_progress"
    ) {
      summary.readyForAction++;
    }
    stageBuckets[it.stage].push(it);
  }

  return { summary, stageBuckets };
}

function dedupeQueueItems(items: ProCrowOperatorQueueItem[]): ProCrowOperatorQueueItem[] {
  const seen = new Set<string>();
  const out: ProCrowOperatorQueueItem[] = [];
  const sorted = [...items].sort((a, b) => PRI_ORDER[a.priority] - PRI_ORDER[b.priority]);
  for (const it of sorted) {
    const key = `${it.stage}:${it.source}:${it.requestId ?? it.id}:${it.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  return out;
}

/**
 * Derives read-only operator queue items and snapshot metadata from existing platform signals.
 * Does not write to the database or mutate request/blueprint state.
 */
export function deriveProCrowOperatorQueueSnapshot(input: ProCrowQueueDeriveInput): ProCrowOperatorQueueSnapshot {
  const items: ProCrowOperatorQueueItem[] = [];
  let seq = 0;
  const nextId = (prefix: string) => `${prefix}-${++seq}`;
  const org = (requestId: string | undefined) =>
    requestId && input.requestOrgById ? input.requestOrgById.get(requestId) : undefined;

  const tag = (...t: string[]) => t.filter(Boolean);

  for (const row of input.operatorBuckets.pending_review.slice(0, 6)) {
    items.push({
      id: nextId("req"),
      stage: "intake",
      priority: "high",
      status: "needs_review",
      owner: "procrow",
      title: "Submitted request — needs qualification review",
      description: `Intake ${row.referenceCode} is submitted (DB: PENDING_REVIEW). Product stage: Needs review / Qualification review. Open workspace before Discovery.`,
      reason: "Derived from implementation request status — operator-guided qualification; no tenant provisioning.",
      relatedRoute: routes.admin.request(row.requestId),
      actionLabel: "Open request",
      requestId: row.requestId,
      referenceCode: row.referenceCode,
      organizationName: org(row.requestId),
      source: "request",
      tags: tag("operator queue", "intake", "submitted", "needs review", "qualification"),
    });
  }

  for (const row of input.operatorBuckets.blueprint_pending.slice(0, 5)) {
    items.push({
      id: nextId("bp"),
      stage: "blueprint",
      priority: "high",
      status: "needs_review",
      owner: "procrow",
      title: "Blueprint needs review",
      description: `Blueprint workstream for ${row.referenceCode} needs operator-guided review.`,
      reason: "Lifecycle bucket blueprint_pending — advisory readiness, not auto-approval.",
      relatedRoute: routes.admin.request(row.requestId),
      actionLabel: "Review blueprint",
      requestId: row.requestId,
      referenceCode: row.referenceCode,
      organizationName: org(row.requestId),
      source: "blueprint",
      tags: tag("operator queue", "blueprint"),
    });
  }

  const approvedSeen = new Set<string>();
  for (const bp of input.blueprints) {
    if (bp.proposalStatus === "DRAFT" && items.filter((i) => i.title.includes("Proposal ready")).length < 4) {
      items.push({
        id: nextId("prop"),
        stage: "proposal",
        priority: "high",
        status: "ready",
        owner: "builder",
        title: "Proposal ready / waiting to send",
        description: "Commercial proposal is in draft — confirm readiness before client send.",
        reason: "proposalStatus DRAFT — ProCrow-controlled client communication.",
        relatedRoute: routes.admin.request(bp.requestId),
        actionLabel: "Open proposal workspace",
        requestId: bp.requestId,
        blueprintId: bp.id,
        organizationName: org(bp.requestId),
        source: "proposal",
        tags: tag("proposal", "needs review"),
      });
    }
    if (bp.proposalStatus === "SENT" && items.filter((i) => i.title.includes("Proposal sent")).length < 4) {
      items.push({
        id: nextId("pwait"),
        stage: "proposal",
        priority: "medium",
        status: "waiting_on_client",
        owner: "client",
        title: "Proposal sent — waiting for client",
        description: "Proposal is with the client for review; monitor for approval or change requests.",
        reason: "proposalStatus SENT — derived customer-to-tenant flow signal.",
        relatedRoute: routes.admin.request(bp.requestId),
        actionLabel: "Monitor client portal",
        requestId: bp.requestId,
        blueprintId: bp.id,
        organizationName: org(bp.requestId),
        source: "proposal",
        tags: tag("waiting on client"),
      });
    }
    if (
      bp.clientApprovedAt &&
      bp.proposalStatus === "CLIENT_APPROVED" &&
      !approvedSeen.has(bp.requestId) &&
      items.filter((i) => i.stage === "approval" && i.requestId === bp.requestId).length < 6
    ) {
      approvedSeen.add(bp.requestId);
      items.push({
        id: nextId("cappr"),
        stage: "approval",
        priority: "critical",
        status: "waiting_on_procrow",
        owner: "procrow",
        title: "Client approved scope — ProCrow next",
        description: "Scope approval is on record — continue ProCrow-controlled onboarding review.",
        reason: "clientApprovedAt set — provisioning remains operator-owned; production F23-gated.",
        relatedRoute: routes.admin.request(bp.requestId),
        actionLabel: "Continue onboarding",
        requestId: bp.requestId,
        blueprintId: bp.id,
        organizationName: org(bp.requestId),
        source: "client_approval",
        tags: tag("client approval", "onboarding"),
      });
    }
  }

  for (const row of input.operatorBuckets.ready_go_live.slice(0, 5)) {
    items.push({
      id: nextId("onb"),
      stage: "onboarding",
      priority: "high",
      status: "waiting_on_procrow",
      owner: "procrow",
      title: "Onboarding needs ProCrow action",
      description: `${row.referenceCode} is in go-live readiness — operator-guided provisioning only.`,
      reason: "ready_go_live bucket — no auto tenant provisioning in staging.",
      relatedRoute: routes.admin.request(row.requestId),
      actionLabel: "Review go-live checklist",
      requestId: row.requestId,
      referenceCode: row.referenceCode,
      organizationName: org(row.requestId),
      source: "onboarding",
      tags: tag("onboarding", "ProCrow-controlled"),
    });
  }

  for (const row of input.operatorBuckets.needs_review.slice(0, 4)) {
    items.push({
      id: nextId("blk"),
      stage: "intake",
      priority: "critical",
      status: "blocked",
      owner: "procrow",
      title: "Pipeline item needs triage",
      description: `${row.referenceCode} is outside the happy path — manual ProCrow triage required.`,
      reason: "needs_review lifecycle bucket — derived advisory blocker.",
      relatedRoute: routes.admin.request(row.requestId),
      actionLabel: "Triage request",
      requestId: row.requestId,
      referenceCode: row.referenceCode,
      organizationName: org(row.requestId),
      source: "request",
      tags: tag("blocked", "needs review"),
    });
  }

  for (const t of input.tenantsAttention) {
    items.push({
      id: nextId("tnt"),
      stage: "tenant_readiness",
      priority: "medium",
      status: "needs_review",
      owner: "procrow",
      title: "Tenant runtime readiness needs review",
      description: `${t.name} (${t.slug}) health signals suggest operator review — advisory only.`,
      reason: "CEM health score attention/watch — not autonomous remediation.",
      relatedRoute: routes.admin.tenant(t.id),
      actionLabel: "Open tenant",
      tenantId: t.id,
      tenantSlug: t.slug,
      organizationName: t.name,
      source: "tenant",
      tags: tag("tenant runtime", "advisory"),
    });
  }

  if (input.openIncidents > 0) {
    items.push({
      id: nextId("cc"),
      stage: "runtime_trust",
      priority: "high",
      status: "needs_review",
      owner: "cybercrow",
      title: "CyberCrow incidents need review",
      description: `${input.openIncidents} open incident(s) across tenants — operator review, not autonomous triage.`,
      reason: "CyberCrow signal — advisory posture; not certified compliance.",
      relatedRoute: routes.tenant(MEEM_TENANT_SLUG).cybercrow.incidents,
      actionLabel: "Review incidents",
      tenantSlug: MEEM_TENANT_SLUG,
      source: "cybercrow",
      tags: tag("CyberCrow", "trust"),
    });
  }

  if (input.mappingGap) {
    items.push({
      id: nextId("sarea"),
      stage: "runtime_trust",
      priority: "medium",
      status: "needs_review",
      owner: "sarea",
      title: "SAREA mapping needs review",
      description: "Role experience maps look thin versus profiles — verify persona coverage in SAREA studio.",
      reason: "Derived coverage heuristic — RBAC still enforces access.",
      relatedRoute: routes.sarea.roleMapping,
      actionLabel: "Open role mapping",
      source: "sarea",
      tags: tag("SAREA", "experience"),
    });
  }

  if (input.openRequestChangesCount > 0) {
    items.push({
      id: nextId("chg"),
      stage: "client_review",
      priority: "critical",
      status: "waiting_on_procrow",
      owner: "client",
      title: "Client requested changes",
      description: `${input.openRequestChangesCount} open change request(s) from the client portal — operator-guided triage.`,
      reason: "Open platform notifications for request-changes — queue-worthy client signal.",
      relatedRoute: routes.admin.notifications,
      actionLabel: "Review inbox",
      source: "review_note",
      tags: tag("request changes", "client portal"),
    });
  }

  if (input.openReviewNotesCount > 0) {
    items.push({
      id: nextId("note"),
      stage: "client_review",
      priority: "medium",
      status: "needs_review",
      owner: "client",
      title: "Client review notes",
      description: `${input.openReviewNotesCount} open review note(s) — advisory context for scope and delivery.`,
      reason: "Review notes are advisory context — triage in notifications.",
      relatedRoute: routes.admin.notifications,
      actionLabel: "Open notifications",
      source: "review_note",
      tags: tag("review notes", "advisory"),
    });
  }

  if (input.notificationHigh > 0) {
    items.push({
      id: nextId("notif"),
      stage: "intake",
      priority: "high",
      status: "needs_review",
      owner: "procrow",
      title: "High-priority notifications",
      description: `${input.notificationHigh} advisory item(s) in the operator inbox need review.`,
      reason: "Platform notification severity — no auto billing or production actions.",
      relatedRoute: routes.admin.notifications,
      actionLabel: "Open inbox",
      source: "notification",
      tags: tag("notifications", "operator inbox"),
    });
  }

  items.push({
    id: nextId("val"),
    stage: "complete",
    priority: "medium",
    status: "ready",
    owner: "procrow",
    title: "Validation / go-no-go discipline",
    description:
      "Run validation playbook and deployment checks before any production discussion — F23-gated.",
    reason: "Advisory checklist — production remains F23-gated; no paid infra in staging.",
    relatedRoute: routes.admin.tenants,
    actionLabel: "Review readiness",
    source: "notification",
    tags: tag("F23", "validation", "advisory"),
  });

  const deduped = dedupeQueueItems(items);
  deduped.sort((a, b) => PRI_ORDER[a.priority] - PRI_ORDER[b.priority]);

  const sliced = deduped.slice(0, 36);
  const { summary, stageBuckets } = summarizeAndBucket(sliced);

  const nextRecommendedActions = sliced.slice(0, 5).map((it) => `${it.actionLabel}: ${it.title}`);

  const safetyNotes = [
    "Operator queue is derived readiness — not a task system and not autonomous operations.",
    "Tenant provisioning remains ProCrow-controlled; production remains F23-gated.",
    "No payment activation or unattended tenant creation from this view — staging and advisory posture only.",
  ];

  return {
    generatedAt: new Date(),
    items: sliced,
    summary,
    stageBuckets,
    nextRecommendedActions,
    safetyNotes,
  };
}

/**
 * Standalone read-only snapshot for /admin/queue or diagnostics.
 * Reuses the same derivation inputs as the control tower without mutating platform state.
 */
export async function getProCrowOperatorQueueSnapshot(): Promise<ProCrowOperatorQueueSnapshot> {
  const empty: ProCrowOperatorQueueSnapshot = {
    ...emptyProCrowOperatorQueueSnapshot(),
    nextRecommendedActions: ["Connect staging data to populate the operator queue."],
  };

  try {
    const [
      operator,
      notificationSummary,
      blueprintRows,
      cem,
      openReviewNotesCount,
      openRequestChangesCount,
      roleMapCount,
    ] = await Promise.all([
      getOperatorConsoleSnapshot(),
      getPlatformNotificationInboxSummary(),
      loadBlueprintProposalRows(),
      getCemCommandCenterSnapshot(),
      prisma.platformNotification.count({
        where: {
          inboxStatus: "open",
          eventType: CLIENT_REVIEW_NOTE_EVENT_TYPES.reviewNote,
        },
      }),
      prisma.platformNotification.count({
        where: {
          inboxStatus: "open",
          eventType: CLIENT_REVIEW_NOTE_EVENT_TYPES.requestChanges,
        },
      }),
      prisma.roleExperienceMap.count(),
    ]);

    const { cybercrow, sarea, tenants } = cem;
    const tenantsAttention = tenants
      .filter((t) => t.health.healthScore === "attention")
      .slice(0, 5)
      .map((t) => ({
        id: t.id,
        slug: t.slug,
        name: t.organization?.displayName ?? t.slug,
      }));

    const profileTotal = sarea.profileCount;
    const mappingGap = profileTotal > 0 && roleMapCount < Math.max(1, Math.floor(profileTotal * 0.75));

    const requestOrgById = new Map<string, string>();
    for (const card of operator.lifecycleCards) {
      requestOrgById.set(card.requestId, card.organizationName);
    }

    const operatorBuckets = {
      pending_review: operator.buckets.pending_review.map((c) => ({
        requestId: c.requestId,
        referenceCode: c.referenceCode,
      })),
      blueprint_pending: operator.buckets.blueprint_pending.map((c) => ({
        requestId: c.requestId,
        referenceCode: c.referenceCode,
      })),
      ready_go_live: operator.buckets.ready_go_live.map((c) => ({
        requestId: c.requestId,
        referenceCode: c.referenceCode,
      })),
      needs_review: operator.buckets.needs_review.map((c) => ({
        requestId: c.requestId,
        referenceCode: c.referenceCode,
      })),
    };

    return deriveProCrowOperatorQueueSnapshot({
      operatorBuckets,
      blueprints: blueprintRows,
      notificationHigh: notificationSummary.highPriorityCount,
      tenantsAttention,
      openIncidents: cybercrow.openIncidentCount,
      mappingGap,
      openReviewNotesCount,
      openRequestChangesCount,
      requestOrgById,
    });
  } catch {
    return empty;
  }
}

export { loadBlueprintProposalRows };
