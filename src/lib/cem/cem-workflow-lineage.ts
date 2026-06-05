import "server-only";

import type { Prisma } from "@prisma/client";
import { PURCHASE_TO_STOCK_CONFIG_KEY } from "@/lib/services/cem-transaction-workflow.service";

/** Canonical lineage stored in Report.configJson without schema migration (M3.4 PATH A). */
export type CemWorkflowLineageRecord = {
  workflowKey: "purchase_to_stock";
  requestId: string;
  workflowId?: string;
  primaryTaskId?: string;
  approvalId?: string;
  reportId?: string;
  workflowStepIds?: string[];
  lastAdvancedAt?: string;
  lastActionKey?: string;
};

export function parseWorkflowLineage(config: unknown): CemWorkflowLineageRecord | null {
  if (!config || typeof config !== "object") return null;
  const c = config as Record<string, unknown>;
  if (c.workflowKey !== "purchase_to_stock" || typeof c.requestId !== "string") return null;
  return {
    workflowKey: "purchase_to_stock",
    requestId: c.requestId,
    workflowId: typeof c.workflowId === "string" ? c.workflowId : undefined,
    primaryTaskId: typeof c.primaryTaskId === "string" ? c.primaryTaskId : undefined,
    approvalId: typeof c.approvalId === "string" ? c.approvalId : undefined,
    reportId: typeof c.reportId === "string" ? c.reportId : undefined,
    workflowStepIds: Array.isArray(c.workflowStepIds)
      ? c.workflowStepIds.filter((id): id is string => typeof id === "string")
      : undefined,
    lastAdvancedAt: typeof c.lastAdvancedAt === "string" ? c.lastAdvancedAt : undefined,
    lastActionKey: typeof c.lastActionKey === "string" ? c.lastActionKey : undefined,
  };
}

export function mergeWorkflowLineage(
  config: unknown,
  patch: Partial<CemWorkflowLineageRecord>
): Prisma.InputJsonValue {
  const base =
    config && typeof config === "object" ? { ...(config as Record<string, unknown>) } : {};
  return {
    ...base,
    [PURCHASE_TO_STOCK_CONFIG_KEY]: true,
    workflowKey: "purchase_to_stock",
    ...patch,
  } as Prisma.InputJsonValue;
}
