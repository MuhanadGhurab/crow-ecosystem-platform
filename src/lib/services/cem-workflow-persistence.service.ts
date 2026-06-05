import "server-only";

import {
  CEM_WORKFLOW_PERSISTENCE_DISCLAIMERS,
  type CemWorkflowLinkType,
  type CemWorkflowPersistenceAudit,
  type CemWorkflowPersistenceLink,
  type CemWorkflowPersistenceMode,
  type CemWorkflowPersistenceSnapshot,
} from "@/lib/cem/cem-workflow-persistence-contract";
import { parseWorkflowLineage } from "@/lib/cem/cem-workflow-lineage";
import { prisma } from "@/lib/db";
import {
  PURCHASE_TO_STOCK_REPORT_PREFIX,
  PURCHASE_TO_STOCK_WORKFLOW_NAME,
} from "@/lib/services/cem-transaction-workflow.service";
import { listPurchaseRequests } from "@/lib/services/procurement.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

const EXISTING_MODELS = [
  "TenantPurchaseRequest",
  "Workflow",
  "WorkflowStep",
  "Task",
  "Approval",
  "Report",
  "CybercrowAuditLog",
] as const;

function link(
  linkType: CemWorkflowLinkType,
  sourceModel: string,
  sourceId: string | null,
  targetModel: string,
  targetId: string | null,
  status: CemWorkflowPersistenceLink["status"],
  persistenceMode: CemWorkflowPersistenceMode,
  notes: string
): CemWorkflowPersistenceLink {
  return {
    linkType,
    sourceModel,
    sourceId,
    targetModel,
    targetId,
    status,
    persistenceMode,
    notes,
  };
}

async function loadLineageReport(tenantId: string, requestId: string) {
  const reports = await prisma.report.findMany({
    where: {
      tenantId,
      OR: [
        { name: { startsWith: PURCHASE_TO_STOCK_REPORT_PREFIX } },
        { name: { contains: "purchase-to-stock" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  for (const rep of reports) {
    const lineage = parseWorkflowLineage(rep.configJson);
    if (lineage?.requestId === requestId) return { report: rep, lineage };
  }
  return { report: null, lineage: null };
}

export async function auditCemWorkflowPersistenceForTenantSlug(
  slug: string,
  requestId?: string
): Promise<CemWorkflowPersistenceSnapshot | null> {
  const tenant = await getTenantBySlug(slug);
  if (!tenant) return null;

  const purchaseRows = await listPurchaseRequests(tenant.id);
  const selected =
    (requestId ? purchaseRows.find((r) => r.id === requestId) : null) ??
    purchaseRows[0] ??
    null;

  const persistenceMode: CemWorkflowPersistenceMode =
    purchaseRows.length > 0 ? "existing_schema" : "advisory_only";

  const links: CemWorkflowPersistenceLink[] = [];
  const blockers: string[] = [];
  const warnings: string[] = [];
  const recommendedActions: string[] = [];

  if (!selected) {
    warnings.push("No tenant purchase requests — persistence audit is advisory-only.");
    recommendedActions.push("Create a purchase-to-stock request to exercise tenant-backed lineage.");
    const audit: CemWorkflowPersistenceAudit = {
      tenantSlug: slug,
      workflowKey: "purchase_to_stock",
      persistenceMode: "advisory_only",
      existingModels: [...EXISTING_MODELS],
      missingLinks: [
        "purchase_request_to_workflow",
        "workflow_to_stage",
        "stage_to_task",
        "stage_to_approval",
        "stage_to_receiving",
        "receiving_to_inventory_visibility",
        "workflow_to_report",
        "workflow_to_cybercrow_evidence",
        "workflow_to_sarea_experience",
      ],
      proposedLinks: [],
      blockers,
      safeToImplementWithoutMigration: true,
      migrationProposalRequired: false,
      recommendedNextAction:
        "Seed or create a purchase request, then re-run npm run cem-workflow-persistence:verify.",
    };
    return {
      tenantSlug: slug,
      tenantName: tenant.organization.displayName,
      workflowKey: "purchase_to_stock",
      persistenceMode: "advisory_only",
      links,
      blockers,
      warnings,
      recommendedActions,
      disclaimers: CEM_WORKFLOW_PERSISTENCE_DISCLAIMERS,
      audit,
    };
  }

  const workflow = await prisma.workflow.findFirst({
    where: { tenantId: tenant.id, name: PURCHASE_TO_STOCK_WORKFLOW_NAME },
    include: { steps: { orderBy: { orderIndex: "asc" } } },
  });

  const { report, lineage } = await loadLineageReport(tenant.id, selected.id);

  const workflowId = lineage?.workflowId ?? workflow?.id ?? null;
  const taskId = lineage?.primaryTaskId ?? null;

  let resolvedTaskId = taskId;
  if (!resolvedTaskId) {
    const task = await prisma.task.findFirst({
      where: {
        tenantId: tenant.id,
        workflowId: workflow?.id ?? undefined,
        title: { contains: selected.title.slice(0, 40) },
      },
      orderBy: { updatedAt: "desc" },
    });
    resolvedTaskId = task?.id ?? null;
  }

  const approvalId = lineage?.approvalId ?? selected.linkedFinanceRef ?? null;
  let resolvedApprovalId = approvalId;
  if (!resolvedApprovalId) {
    const approval = await prisma.approval.findFirst({
      where: {
        tenantId: tenant.id,
        entityType: "purchase_request",
        entityId: selected.id,
      },
      orderBy: { createdAt: "desc" },
    });
    resolvedApprovalId = approval?.id ?? null;
  }

  const auditLogs = await prisma.cybercrowAuditLog.findMany({
    where: {
      tenantId: tenant.id,
      entityType: "purchase_request",
      entityId: selected.id,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // purchase_request_to_workflow
  if (lineage?.workflowId && workflow?.id === lineage.workflowId) {
    links.push(
      link(
        "purchase_request_to_workflow",
        "TenantPurchaseRequest",
        selected.id,
        "Workflow",
        workflow.id,
        "linked",
        persistenceMode,
        "Lineage metadata stores workflowId on report config."
      )
    );
  } else if (workflow?.id) {
    links.push(
      link(
        "purchase_request_to_workflow",
        "TenantPurchaseRequest",
        selected.id,
        "Workflow",
        workflow.id,
        "inferred",
        persistenceMode,
        "Workflow resolved by tenant + name; no FK on purchase request."
      )
    );
    warnings.push("Purchase request → workflow link is inferred (name lookup), not a direct FK.");
  } else {
    links.push(
      link(
        "purchase_request_to_workflow",
        "TenantPurchaseRequest",
        selected.id,
        "Workflow",
        null,
        "missing",
        persistenceMode,
        "No purchase-to-stock workflow instance for tenant."
      )
    );
  }

  // workflow_to_stage
  if (workflow && workflow.steps.length >= 6) {
    links.push(
      link(
        "workflow_to_stage",
        "Workflow",
        workflow.id,
        "WorkflowStep",
        workflow.steps.map((s) => s.id).join(","),
        lineage?.workflowStepIds?.length ? "linked" : "inferred",
        persistenceMode,
        lineage?.workflowStepIds?.length
          ? "Stage IDs recorded in lineage metadata."
          : "Workflow steps exist; stage-to-instance binding is template-level."
      )
    );
  } else {
    links.push(
      link(
        "workflow_to_stage",
        "Workflow",
        workflow?.id ?? null,
        "WorkflowStep",
        null,
        "missing",
        persistenceMode,
        "Workflow steps not provisioned for purchase-to-stock."
      )
    );
  }

  // stage_to_task
  if (lineage?.primaryTaskId && resolvedTaskId === lineage.primaryTaskId) {
    links.push(
      link(
        "stage_to_task",
        "TenantPurchaseRequest",
        selected.id,
        "Task",
        resolvedTaskId,
        "linked",
        persistenceMode,
        "Primary task ID stored in report lineage metadata."
      )
    );
  } else if (resolvedTaskId) {
    links.push(
      link(
        "stage_to_task",
        "TenantPurchaseRequest",
        selected.id,
        "Task",
        resolvedTaskId,
        "inferred",
        persistenceMode,
        "Task matched by workflow + title — not stage-scoped FK."
      )
    );
  } else {
    links.push(
      link(
        "stage_to_task",
        "TenantPurchaseRequest",
        selected.id,
        "Task",
        null,
        "missing",
        persistenceMode,
        "No task linked to this purchase request."
      )
    );
  }

  // stage_to_approval
  if (resolvedApprovalId && selected.linkedFinanceRef === resolvedApprovalId) {
    links.push(
      link(
        "stage_to_approval",
        "TenantPurchaseRequest",
        selected.id,
        "Approval",
        resolvedApprovalId,
        "linked",
        persistenceMode,
        "linkedFinanceRef stores approval ID on purchase request."
      )
    );
  } else if (resolvedApprovalId) {
    links.push(
      link(
        "stage_to_approval",
        "TenantPurchaseRequest",
        selected.id,
        "Approval",
        resolvedApprovalId,
        "inferred",
        persistenceMode,
        "Approval found by entity lookup; linkedFinanceRef not yet set."
      )
    );
  } else {
    links.push(
      link(
        "stage_to_approval",
        "TenantPurchaseRequest",
        selected.id,
        "Approval",
        null,
        selected.status === "approved" || selected.status === "received" ? "missing" : "proposed",
        persistenceMode,
        "Finance approval not recorded yet."
      )
    );
  }

  // stage_to_receiving
  const receivingDone = selected.status === "received" || selected.status === "ordered";
  links.push(
    link(
      "stage_to_receiving",
      "TenantPurchaseRequest",
      selected.id,
      "TenantPurchaseRequest.status",
      receivingDone ? selected.id : null,
      receivingDone ? "linked" : "proposed",
      persistenceMode,
      receivingDone
        ? "Receiving marker via PR status — not warehouse stock mutation."
        : "Warehouse receiving pending finance approval chain."
    )
  );

  // receiving_to_inventory_visibility
  if (selected.linkedInventoryRef) {
    links.push(
      link(
        "receiving_to_inventory_visibility",
        "TenantPurchaseRequest",
        selected.id,
        "TenantPurchaseRequest.linkedInventoryRef",
        selected.linkedInventoryRef,
        "linked",
        persistenceMode,
        "Inventory visibility marker on purchase request — advisory, not stock mutation."
      )
    );
  } else if (selected.status === "received") {
    links.push(
      link(
        "receiving_to_inventory_visibility",
        "TenantPurchaseRequest",
        selected.id,
        "TenantPurchaseRequest.linkedInventoryRef",
        null,
        "missing",
        persistenceMode,
        "Receiving complete but inventory visibility marker not set."
      )
    );
  } else {
    links.push(
      link(
        "receiving_to_inventory_visibility",
        "TenantPurchaseRequest",
        selected.id,
        "TenantPurchaseRequest.linkedInventoryRef",
        null,
        "proposed",
        persistenceMode,
        "Inventory visibility follows warehouse receiving."
      )
    );
  }

  // workflow_to_report
  if (report && lineage?.reportId === report.id) {
    links.push(
      link(
        "workflow_to_report",
        "TenantPurchaseRequest",
        selected.id,
        "Report",
        report.id,
        "linked",
        persistenceMode,
        "Report lineage metadata includes reportId and requestId."
      )
    );
  } else if (report) {
    links.push(
      link(
        "workflow_to_report",
        "TenantPurchaseRequest",
        selected.id,
        "Report",
        report.id,
        "inferred",
        persistenceMode,
        "Report matched by configJson requestId scan."
      )
    );
  } else {
    links.push(
      link(
        "workflow_to_report",
        "TenantPurchaseRequest",
        selected.id,
        "Report",
        null,
        "missing",
        persistenceMode,
        "No purchase-to-stock report output for request."
      )
    );
  }

  // workflow_to_cybercrow_evidence
  if (auditLogs.length > 0) {
    links.push(
      link(
        "workflow_to_cybercrow_evidence",
        "TenantPurchaseRequest",
        selected.id,
        "CybercrowAuditLog",
        auditLogs[0].id,
        "linked",
        persistenceMode,
        "Audit logs reference purchase_request entity — advisory evidence, not certified compliance."
      )
    );
  } else {
    links.push(
      link(
        "workflow_to_cybercrow_evidence",
        "TenantPurchaseRequest",
        selected.id,
        "CybercrowAuditLog",
        null,
        "missing",
        persistenceMode,
        "No CyberCrow audit entries for this request yet."
      )
    );
  }

  // workflow_to_sarea_experience
  links.push(
    link(
      "workflow_to_sarea_experience",
      "TenantPurchaseRequest",
      selected.id,
      "SAREA.role_experience",
      null,
      "inferred",
      persistenceMode,
      "SAREA role views are contract/UI copy — not persisted workflow bindings."
    )
  );

  const missingLinks = links
    .filter((l) => l.status === "missing")
    .map((l) => l.linkType);
  const proposedLinks = links
    .filter((l) => l.status === "proposed")
    .map((l) => l.linkType);

  const inferredCount = links.filter((l) => l.status === "inferred").length;
  if (inferredCount > 0) {
    recommendedActions.push(
      "Run purchase-to-stock actions to refresh lineage metadata on report config."
    );
    recommendedActions.push(
      "Optional M3.4B: approve migration proposal for direct FK lineage if operators require stronger guarantees."
    );
  }
  if (missingLinks.length > 0) {
    recommendedActions.push("Complete missing workflow stages to strengthen persisted links.");
  }

  const audit: CemWorkflowPersistenceAudit = {
    tenantSlug: slug,
    workflowKey: "purchase_to_stock",
    persistenceMode,
    existingModels: [...EXISTING_MODELS],
    missingLinks,
    proposedLinks,
    blockers,
    safeToImplementWithoutMigration: true,
    migrationProposalRequired: false,
    recommendedNextAction:
      missingLinks.length > 0 || inferredCount > 2
        ? "Exercise full purchase-to-stock demo flow; consider M3.4B migration proposal for FK hardening."
        : "Persistence lineage is sufficiently stable on existing schema for staging operations.",
  };

  return {
    tenantSlug: slug,
    tenantName: tenant.organization.displayName,
    workflowKey: "purchase_to_stock",
    persistenceMode,
    links,
    blockers,
    warnings,
    recommendedActions,
    disclaimers: CEM_WORKFLOW_PERSISTENCE_DISCLAIMERS,
    audit,
  };
}

export async function buildCemWorkflowPersistenceSummaryForTenantId(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { slug: true },
  });
  if (!tenant) return null;
  return auditCemWorkflowPersistenceForTenantSlug(tenant.slug);
}
