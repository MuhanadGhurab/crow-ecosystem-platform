/**
 * C0 — Tenant resilience, quotas, and abuse detection (advisory degradation).
 */

import type { TenantScopeId } from "../common";

export type TenantQuotaCategory =
  | "accounts"
  | "workflows"
  | "ai_invocations"
  | "integrations"
  | "storage"
  | "api_requests";

export type TenantQuota = {
  tenantId: TenantScopeId;
  category: TenantQuotaCategory;
  limit: number;
  unit: string;
  currentUsage: number;
  softThresholdPercent: number;
  hardLimitEnforced: boolean;
};

export type AbuseSignalType =
  | "rate_spike"
  | "credential_stuffing_pattern"
  | "ai_quota_abuse"
  | "integration_flood"
  | "suspicious_admin_action";

export type AbuseSignal = {
  signalId: string;
  tenantId: TenantScopeId;
  type: AbuseSignalType;
  severity: "low" | "medium" | "high";
  detectedAtIso: string;
  recommendedResponse: string;
};

export type DegradationPolicy = {
  policyKey: string;
  trigger: AbuseSignalType | "quota_exceeded";
  response: "throttle" | "advisory_banner" | "operator_review" | "suspend_feature";
  notifyOperator: boolean;
};

export const TENANT_RESILIENCE_RULE =
  "Tenant resilience defines quotas, abuse signals, and degradation responses without silent production bypass." as const;
