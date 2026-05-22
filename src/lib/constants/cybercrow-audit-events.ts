/** CyberCrow audit action keys — platform + logistics ops (E10). */

export const CYBERCROW_AUDIT_ACTIONS = {
  CYBERCROW_INITIALIZED: "CYBERCROW_INITIALIZED",
  POLICY_DENIED: "POLICY_DENIED",
  OCR_DOCUMENT_CAPTURED: "OCR_DOCUMENT_CAPTURED",
  ROUTE_ANOMALY_DETECTED: "ROUTE_ANOMALY_DETECTED",
  DISPATCH_SLA_BREACH: "DISPATCH_SLA_BREACH",
  LOGISTICS_DISPATCH_APPROVED: "LOGISTICS_DISPATCH_APPROVED",
} as const;

export type CybercrowAuditAction =
  (typeof CYBERCROW_AUDIT_ACTIONS)[keyof typeof CYBERCROW_AUDIT_ACTIONS];

/** Logistics workflow events written to tenant audit + optional security_events. */
export const LOGISTICS_AUDIT_ACTIONS: readonly CybercrowAuditAction[] = [
  CYBERCROW_AUDIT_ACTIONS.OCR_DOCUMENT_CAPTURED,
  CYBERCROW_AUDIT_ACTIONS.ROUTE_ANOMALY_DETECTED,
  CYBERCROW_AUDIT_ACTIONS.DISPATCH_SLA_BREACH,
  CYBERCROW_AUDIT_ACTIONS.LOGISTICS_DISPATCH_APPROVED,
];

export const LOGISTICS_AUDIT_ENTITY_TYPE = "logistics";
export const LOGISTICS_AUDIT_CATEGORY = "logistics_ops";

export const LOGISTICS_SECURITY_EVENT_TYPES = [
  CYBERCROW_AUDIT_ACTIONS.ROUTE_ANOMALY_DETECTED,
  CYBERCROW_AUDIT_ACTIONS.DISPATCH_SLA_BREACH,
] as const;

export type LogisticsAuditFilter = "all" | "logistics" | "platform";

export function isLogisticsIndustry(industry: string | null | undefined): boolean {
  return industry === "logistics" || industry === "logistics_fulfillment";
}

export function isLogisticsAuditAction(action: string): boolean {
  return (LOGISTICS_AUDIT_ACTIONS as readonly string[]).includes(action);
}

export function isLogisticsSecurityEventType(eventType: string): boolean {
  return (LOGISTICS_SECURITY_EVENT_TYPES as readonly string[]).includes(eventType);
}

export function logisticsAuditActionFilter(): { action: { in: string[] } } {
  return { action: { in: [...LOGISTICS_AUDIT_ACTIONS] } };
}

export function platformAuditActionFilter(): { action: { notIn: string[] } } {
  return { action: { notIn: [...LOGISTICS_AUDIT_ACTIONS] } };
}

export type LogisticsAuditMetadata = {
  category: typeof LOGISTICS_AUDIT_CATEGORY;
  workflowName?: string;
  referenceCode?: string;
  shipmentRef?: string;
  aiExtraKey?: string;
  severity?: "info" | "low" | "medium" | "high";
  seedKey?: string;
  source?: string;
};
