import type { CemModuleKey } from "@/lib/constants/modules";
import type { SecurityPackageKey } from "@/lib/constants/security-packages";
import type { SubscriptionTierKey } from "@/lib/constants/subscriptions";

export type ImplementationRequestStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "UNDER_DISCOVERY"
  | "BLUEPRINT_BUILD"
  | "TENANT_PROVISIONING"
  | "SECURITY_INIT"
  | "SAREA_INIT"
  | "GO_LIVE"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

/** Finer-grained product lifecycle vocabulary (UI / roadmap). Not persisted on `ImplementationRequest` yet. */
export type { PlatformLifecyclePipelineState } from "@/lib/constants/lifecycle-states";

export interface ImplementationRequestInput {
  organizationName: string;
  organizationNameAr?: string;
  industry?: string;
  employeeBand?: string;
  countryCode?: string;
  planKey: SubscriptionTierKey;
  moduleKeys: CemModuleKey[];
  securityPackageKeys: SecurityPackageKey[];
  contact: {
    fullName: string;
    email: string;
    phone?: string;
    jobTitle?: string;
  };
  notes?: string;
}

export interface DiscoveryProfileSummary {
  id: string;
  requestId: string;
  status: string;
  departmentCount: number;
  branchCount: number;
  roleCount: number;
}

export interface EnterpriseBlueprintSummary {
  id: string;
  requestId: string;
  status: string;
  version: number;
}

export interface TenantContext {
  id: string;
  slug: string;
  organizationName: string;
  planKey: SubscriptionTierKey;
  modules: CemModuleKey[];
}
