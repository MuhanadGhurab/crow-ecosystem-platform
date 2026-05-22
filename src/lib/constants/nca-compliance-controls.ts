/** NCA ECC–aligned labels for tenant compliance_control.controlKey values. */

export type NcaControlDefinition = {
  frameworkId: string;
  title: string;
  domain: string;
};

const NCA_CONTROL_CATALOG: Record<string, NcaControlDefinition> = {
  "access-control": {
    frameworkId: "NCA-ECC-2.2",
    title: "Access control",
    domain: "Identity & access",
  },
  "audit-logging": {
    frameworkId: "NCA-ECC-4.1",
    title: "Audit logging & monitoring",
    domain: "Operations security",
  },
  "data-protection": {
    frameworkId: "NCA-ECC-3.3",
    title: "Data protection",
    domain: "Data security",
  },
  "incident-response": {
    frameworkId: "NCA-ECC-5.2",
    title: "Incident response",
    domain: "Resilience",
  },
};

export function getNcaControlDefinition(controlKey: string): NcaControlDefinition {
  const known = NCA_CONTROL_CATALOG[controlKey];
  if (known) return known;
  const slug = controlKey.replace(/-/g, " ");
  return {
    frameworkId: `NCA-ECC-${controlKey.slice(0, 8).toUpperCase()}`,
    title: slug.charAt(0).toUpperCase() + slug.slice(1),
    domain: "Extended controls",
  };
}

export const NCA_BASELINE_CONTROL_KEYS = Object.keys(NCA_CONTROL_CATALOG);
