/**
 * C0 — Saudi government integration layer (scope and constraints only — no live implementation).
 */

import type { ApprovalStatus } from "../common";

export type SaudiGovCapabilityKey =
  | "nafath_identity_assurance"
  | "zatca_einvoicing_readiness"
  | "gosi_workforce_reporting_readiness"
  | "qiwa_labor_market_readiness"
  | "absher_service_eligibility_check"
  | "mci_commercial_registration_lookup";

export type IntegrationReadinessStatus =
  | "not_assessed"
  | "blueprint_noted"
  | "readiness_partial"
  | "ready_for_official_api"
  | "blocked_by_policy";

export type IntegrationCapability = {
  key: SaudiGovCapabilityKey;
  label: string;
  description: string;
  constitutionalRule: string;
  readinessStatus: IntegrationReadinessStatus;
  blueprintAssessmentField: string;
  officialApiRequired: true;
  liveImplementationInC0: false;
};

export type SaudiGovIntegrationScope = {
  capabilities: readonly IntegrationCapability[];
  /** Identity assurance ≠ Crow authorization. */
  identityAssuranceOnly: true;
  noLiveGovernmentIntegrationInC0: true;
  approvalRequiredForProduction: ApprovalStatus;
};

export const SAUDI_INTEGRATION_CONSTITUTION =
  "Government integrations are capability cards and Blueprint assessment fields in C0. No live API calls, credentials, or production wiring." as const;
