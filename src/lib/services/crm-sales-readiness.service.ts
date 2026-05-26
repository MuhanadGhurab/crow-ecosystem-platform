import { isOpenTaskStatus } from "@/lib/cem-operations/readiness";
import {
  CRM_RECOMMENDED_WORKFLOWS,
  CRM_WORKFLOW_MATCH_KEYWORDS,
  SALES_RECOMMENDED_WORKFLOWS,
  SALES_WORKFLOW_MATCH_KEYWORDS,
  type CommercialRecommendedWorkflow,
  type CommercialWorkflowReadinessStatus,
} from "@/lib/constants/crm-sales-module-depth";
import { resolveSectorTemplateKey } from "@/lib/org-intelligence/resolve-sector";
import type { SectorTemplateKey } from "@/lib/org-intelligence/types";
import { listCrmAccounts, listCrmContacts } from "@/lib/services/crm.service";
import { getSalesSummary, listSalesOpportunities } from "@/lib/services/sales.service";
import {
  listTenantTasks,
  listTenantWorkflows,
} from "@/lib/services/tenant-identity.service";
import { getTenantWorkspaceSummary } from "@/lib/services/tenant.service";

export type CommercialMatchedWorkflow = {
  id: string;
  name: string;
  taskCount: number;
  openTaskCount: number;
};

export type CommercialReadinessLevel = "needs_structure" | "building" | "operational";

export type CrmCommercialReadinessSnapshot = {
  sectorKey: SectorTemplateKey | null;
  crmEnabled: boolean;
  salesEnabled: boolean;
  financeEnabled: boolean;
  reportsEnabled: boolean;
  accountCount: number;
  contactCount: number;
  accountsWithoutContacts: number;
  requestReferenceCode: string | null;
  requestStatus: string | null;
  openTaskCount: number;
  crmRelatedOpenTasks: number;
  matchedWorkflows: CommercialMatchedWorkflow[];
  workflowReadiness: CommercialRecommendedWorkflow[];
  cybercrowInitialized: boolean;
  readinessLevel: CommercialReadinessLevel;
  readinessLabel: string;
  readinessDetail: string;
  recommendedActions: string[];
};

export type SalesCommercialReadinessSnapshot = {
  sectorKey: SectorTemplateKey | null;
  salesEnabled: boolean;
  crmEnabled: boolean;
  financeEnabled: boolean;
  reportsEnabled: boolean;
  opportunityCount: number;
  pipelineSar: number;
  wonSar: number;
  opportunitiesWithoutAccount: number;
  requestReferenceCode: string | null;
  requestStatus: string | null;
  openTaskCount: number;
  salesRelatedOpenTasks: number;
  matchedWorkflows: CommercialMatchedWorkflow[];
  workflowReadiness: CommercialRecommendedWorkflow[];
  cybercrowInitialized: boolean;
  readinessLevel: CommercialReadinessLevel;
  readinessLabel: string;
  readinessDetail: string;
  recommendedActions: string[];
};

function matchesKeywords(text: string, keywords: readonly string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function mergeWorkflowReadiness(
  workflows: { id: string; name: string; _count: { tasks: number } }[],
  tasks: { workflowId: string | null; status: string; title: string }[],
  keywords: readonly string[],
  recommended: readonly CommercialRecommendedWorkflow[]
): {
  matched: CommercialMatchedWorkflow[];
  readiness: CommercialRecommendedWorkflow[];
} {
  const matchedById = new Map<string, CommercialMatchedWorkflow>();

  for (const w of workflows) {
    if (matchesKeywords(w.name, keywords)) {
      matchedById.set(w.id, {
        id: w.id,
        name: w.name,
        taskCount: w._count.tasks,
        openTaskCount: 0,
      });
    }
  }

  for (const t of tasks) {
    if (matchesKeywords(t.title, keywords)) {
      const wfId = t.workflowId ?? `task-${t.title.slice(0, 24)}`;
      const existing = matchedById.get(wfId);
      if (existing) {
        existing.taskCount += 1;
        if (isOpenTaskStatus(t.status)) {
          existing.openTaskCount += 1;
        }
      } else if (t.workflowId) {
        matchedById.set(t.workflowId, {
          id: t.workflowId,
          name: t.title,
          taskCount: 1,
          openTaskCount: isOpenTaskStatus(t.status) ? 1 : 0,
        });
      }
    } else if (t.workflowId && matchedById.has(t.workflowId)) {
      const row = matchedById.get(t.workflowId)!;
      row.taskCount += 1;
      if (isOpenTaskStatus(t.status)) {
        row.openTaskCount += 1;
      }
    }
  }

  const matched = [...matchedById.values()].sort((a, b) => a.name.localeCompare(b.name));

  const readiness = recommended.map((rec) => {
    const found = matched.find(
      (m) => matchesKeywords(rec.label, keywords) || matchesKeywords(rec.id, keywords)
    );
    let status: CommercialWorkflowReadinessStatus = "recommended";
    if (found && found.taskCount > 0) status = "found";
    else if (found) status = "partial";
    return { ...rec, status };
  });

  return { matched, readiness };
}

function deriveCrmReadiness(input: {
  accountCount: number;
  contactCount: number;
  accountsWithoutContacts: number;
  requestReferenceCode: string | null;
  matchedWorkflowCount: number;
  crmRelatedOpenTasks: number;
}): {
  level: CommercialReadinessLevel;
  label: string;
  detail: string;
  actions: string[];
} {
  const actions: string[] = [];
  if (input.accountCount === 0) {
    actions.push("Add at least one CRM account or document request-to-account handoff intent.");
  }
  if (input.contactCount === 0 && input.accountCount > 0) {
    actions.push("Add contacts to key accounts for escalation and communication readiness.");
  }
  if (input.accountsWithoutContacts > 0) {
    actions.push(
      `${input.accountsWithoutContacts} account(s) have no contacts — add contacts or note escalation owner.`
    );
  }
  if (!input.requestReferenceCode) {
    actions.push(
      "No blueprint request linkage on this tenant — link implementation request context when available."
    );
  }
  if (input.matchedWorkflowCount === 0) {
    actions.push("Define CRM-related workflows (account review, escalation) in Workflows.");
  }

  if (input.accountCount >= 3 && input.contactCount >= 2 && input.matchedWorkflowCount >= 1) {
    return {
      level: "operational",
      label: "Operational coordination",
      detail:
        "Accounts, contacts, and workflow signals support client readiness — operator-managed, not a full CRM product.",
      actions,
    };
  }
  if (input.accountCount >= 1 || input.requestReferenceCode) {
    return {
      level: "building",
      label: "Building readiness",
      detail:
        "Some CRM structure exists — continue account intake, request linkage, and escalation workflows.",
      actions,
    };
  }
  return {
    level: "needs_structure",
    label: "Needs structure",
    detail:
      "CRM readiness mode — use accounts, contacts, and tasks to model commercial coordination without inventing customers.",
    actions,
  };
}

function deriveSalesReadiness(input: {
  opportunityCount: number;
  pipelineSar: number;
  opportunitiesWithoutAccount: number;
  requestReferenceCode: string | null;
  matchedWorkflowCount: number;
  financeEnabled: boolean;
}): {
  level: CommercialReadinessLevel;
  label: string;
  detail: string;
  actions: string[];
} {
  const actions: string[] = [];
  if (input.opportunityCount === 0) {
    actions.push(
      "Add pipeline lines when commercial intake exists — amounts are advisory, not booked revenue."
    );
  }
  if (input.opportunitiesWithoutAccount > 0) {
    actions.push(
      `${input.opportunitiesWithoutAccount} opportunity line(s) lack CRM account linkage — link for handoff traceability.`
    );
  }
  if (!input.requestReferenceCode) {
    actions.push(
      "Surface implementation request / blueprint context when onboarding commercial records."
    );
  }
  if (!input.financeEnabled) {
    actions.push("Enable Finance module for sales-to-finance handoff readiness (coordination only).");
  }
  if (input.matchedWorkflowCount === 0) {
    actions.push("Define sales workflows (opportunity review, commercial approval) in Workflows.");
  }

  if (input.opportunityCount >= 2 && input.matchedWorkflowCount >= 1 && input.financeEnabled) {
    return {
      level: "operational",
      label: "Commercial pipeline ready",
      detail:
        "Pipeline lines and finance linkage support commercial coordination — not live revenue or invoicing.",
      actions,
    };
  }
  if (input.opportunityCount >= 1 || input.requestReferenceCode) {
    return {
      level: "building",
      label: "Building commercial readiness",
      detail:
        "Some pipeline or request context exists — strengthen CRM links and approval workflows.",
      actions,
    };
  }
  return {
    level: "needs_structure",
    label: "Needs commercial structure",
    detail:
      "Sales readiness mode — use opportunities for coordination; do not treat pipeline SAR as recognized revenue.",
    actions,
  };
}

export type CrmSalesReadinessContext = {
  requestReferenceCode?: string | null;
  requestStatus?: string | null;
};

export async function getCrmCommercialReadinessSnapshot(
  tenantId: string,
  enabledModuleKeys: string[],
  industry: string | null | undefined,
  requestContext?: CrmSalesReadinessContext
): Promise<CrmCommercialReadinessSnapshot> {
  const sectorKey = resolveSectorTemplateKey({ industry });
  const crmEnabled = enabledModuleKeys.includes("crm");
  const salesEnabled = enabledModuleKeys.includes("sales");
  const financeEnabled = enabledModuleKeys.includes("finance");
  const reportsEnabled = enabledModuleKeys.includes("reports");

  const [accounts, contacts, workflows, tasks, workspace] = await Promise.all([
    crmEnabled ? listCrmAccounts(tenantId) : Promise.resolve([]),
    crmEnabled ? listCrmContacts(tenantId) : Promise.resolve([]),
    listTenantWorkflows(tenantId),
    listTenantTasks(tenantId),
    getTenantWorkspaceSummary(tenantId),
  ]);

  const accountIdsWithContacts = new Set(
    contacts.map((c) => c.accountId).filter(Boolean) as string[]
  );
  const accountsWithoutContacts = accounts.filter((a) => !accountIdsWithContacts.has(a.id)).length;

  const crmRelatedOpenTasks = tasks.filter(
    (t) => isOpenTaskStatus(t.status) && matchesKeywords(t.title, CRM_WORKFLOW_MATCH_KEYWORDS)
  ).length;

  const { matched, readiness } = mergeWorkflowReadiness(
    workflows,
    tasks,
    CRM_WORKFLOW_MATCH_KEYWORDS,
    CRM_RECOMMENDED_WORKFLOWS
  );

  const derived = deriveCrmReadiness({
    accountCount: accounts.length,
    contactCount: contacts.length,
    accountsWithoutContacts,
    requestReferenceCode: requestContext?.requestReferenceCode ?? null,
    matchedWorkflowCount: matched.length,
    crmRelatedOpenTasks,
  });

  return {
    sectorKey,
    crmEnabled,
    salesEnabled,
    financeEnabled,
    reportsEnabled,
    accountCount: accounts.length,
    contactCount: contacts.length,
    accountsWithoutContacts,
    requestReferenceCode: requestContext?.requestReferenceCode ?? null,
    requestStatus: requestContext?.requestStatus ?? null,
    openTaskCount: workspace.openTaskCount,
    crmRelatedOpenTasks,
    matchedWorkflows: matched,
    workflowReadiness: readiness,
    cybercrowInitialized: workspace.cybercrowInitialized,
    readinessLevel: derived.level,
    readinessLabel: derived.label,
    readinessDetail: derived.detail,
    recommendedActions: derived.actions,
  };
}

export async function getSalesCommercialReadinessSnapshot(
  tenantId: string,
  enabledModuleKeys: string[],
  industry: string | null | undefined,
  requestContext?: CrmSalesReadinessContext
): Promise<SalesCommercialReadinessSnapshot> {
  const sectorKey = resolveSectorTemplateKey({ industry });
  const salesEnabled = enabledModuleKeys.includes("sales");
  const crmEnabled = enabledModuleKeys.includes("crm");
  const financeEnabled = enabledModuleKeys.includes("finance");
  const reportsEnabled = enabledModuleKeys.includes("reports");

  const [opportunities, summary, workflows, tasks, workspace] = await Promise.all([
    salesEnabled ? listSalesOpportunities(tenantId) : Promise.resolve([]),
    salesEnabled
      ? getSalesSummary(tenantId)
      : Promise.resolve({ total: 0, pipelineSar: 0, wonSar: 0 }),
    listTenantWorkflows(tenantId),
    listTenantTasks(tenantId),
    getTenantWorkspaceSummary(tenantId),
  ]);

  const opportunitiesWithoutAccount = opportunities.filter((o) => !o.crmAccountId).length;

  const salesRelatedOpenTasks = tasks.filter(
    (t) => isOpenTaskStatus(t.status) && matchesKeywords(t.title, SALES_WORKFLOW_MATCH_KEYWORDS)
  ).length;

  const { matched, readiness } = mergeWorkflowReadiness(
    workflows,
    tasks,
    SALES_WORKFLOW_MATCH_KEYWORDS,
    SALES_RECOMMENDED_WORKFLOWS
  );

  const derived = deriveSalesReadiness({
    opportunityCount: opportunities.length,
    pipelineSar: summary.pipelineSar,
    opportunitiesWithoutAccount,
    requestReferenceCode: requestContext?.requestReferenceCode ?? null,
    matchedWorkflowCount: matched.length,
    financeEnabled,
  });

  return {
    sectorKey,
    salesEnabled,
    crmEnabled,
    financeEnabled,
    reportsEnabled,
    opportunityCount: opportunities.length,
    pipelineSar: summary.pipelineSar,
    wonSar: summary.wonSar,
    opportunitiesWithoutAccount,
    requestReferenceCode: requestContext?.requestReferenceCode ?? null,
    requestStatus: requestContext?.requestStatus ?? null,
    openTaskCount: workspace.openTaskCount,
    salesRelatedOpenTasks,
    matchedWorkflows: matched,
    workflowReadiness: readiness,
    cybercrowInitialized: workspace.cybercrowInitialized,
    readinessLevel: derived.level,
    readinessLabel: derived.label,
    readinessDetail: derived.detail,
    recommendedActions: derived.actions,
  };
}
