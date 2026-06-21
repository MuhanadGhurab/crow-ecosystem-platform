/**
 * Discovery security advisory domains — readiness labels only; not compliance verdicts.
 */

import { DISCOVERY_READINESS_LABELS } from "@/lib/legal/compliance-positioning";

export type DiscoverySecurityAdvisoryKey =
  | "identity_privileged_access"
  | "data_classification"
  | "encryption_key_ownership"
  | "logging_monitoring"
  | "incident_management"
  | "backup_resilience_recovery"
  | "third_party_cloud_risk"
  | "secure_development_change"
  | "regulatory_contractual_drivers";

export type DiscoverySecurityAdvisoryDomain = {
  key: DiscoverySecurityAdvisoryKey;
  label: string;
  prompt: string;
};

export const DISCOVERY_SECURITY_ADVISORY_DOMAINS: readonly DiscoverySecurityAdvisoryDomain[] = [
  {
    key: "identity_privileged_access",
    label: "Identity & privileged access",
    prompt: "How are admin and privileged accounts governed today?",
  },
  {
    key: "data_classification",
    label: "Data classification",
    prompt: "What data sensitivity tiers does the organization recognize?",
  },
  {
    key: "encryption_key_ownership",
    label: "Encryption & key ownership",
    prompt: "Encryption expectations and who holds keys (Crow vs customer).",
  },
  {
    key: "logging_monitoring",
    label: "Logging & monitoring",
    prompt: "Central logging, retention, and monitoring maturity.",
  },
  {
    key: "incident_management",
    label: "Incident management",
    prompt: "Incident response roles and escalation paths.",
  },
  {
    key: "backup_resilience_recovery",
    label: "Backup, resilience & recovery",
    prompt: "RTO/RPO targets and backup ownership.",
  },
  {
    key: "third_party_cloud_risk",
    label: "Third-party & cloud risk",
    prompt: "Critical vendors, cloud regions, and subcontractor expectations.",
  },
  {
    key: "secure_development_change",
    label: "Secure development & change management",
    prompt: "Change control for integrations and customizations.",
  },
  {
    key: "regulatory_contractual_drivers",
    label: "Regulatory & contractual drivers",
    prompt: "Sector regulators, customer contracts, or audit frameworks in scope.",
  },
] as const;

export const DISCOVERY_SECURITY_READINESS_OPTIONS = DISCOVERY_READINESS_LABELS;

export type DiscoverySecurityAdvisorySnapshot = Partial<
  Record<DiscoverySecurityAdvisoryKey, string>
>;

export function parseDiscoverySecurityAdvisory(
  value: unknown
): DiscoverySecurityAdvisorySnapshot {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: DiscoverySecurityAdvisorySnapshot = {};
  for (const domain of DISCOVERY_SECURITY_ADVISORY_DOMAINS) {
    const raw = (value as Record<string, unknown>)[domain.key];
    if (typeof raw === "string" && raw.trim()) {
      out[domain.key] = raw.trim();
    }
  }
  return out;
}

export function discoverySecurityStepComplete(input: {
  securityPreference: string | null;
  advisory: DiscoverySecurityAdvisorySnapshot;
}): boolean {
  if (input.securityPreference?.trim()) return true;
  return Object.values(input.advisory).some(
    (v) => v && v !== "Not assessed"
  );
}
