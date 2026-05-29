/**
 * Company profile completeness field registry (K2.6).
 * Every completeness field must be client-editable OR have a blockedReason.
 */

export const CLIENT_PORTAL_EMPLOYEE_BAND_OPTIONS = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "500+", label: "500+ employees" },
] as const;

export const CLIENT_PORTAL_EMPLOYEE_BAND_VALUES = CLIENT_PORTAL_EMPLOYEE_BAND_OPTIONS.map(
  (o) => o.value
) as [string, ...string[]];

export type ClientCompanyCompletenessFieldKey =
  | "companyName"
  | "industry"
  | "employeeBand"
  | "region"
  | "primaryContactName"
  | "primaryContactEmail"
  | "selectedModules"
  | "securityRequirements";

export type ClientCompanyCompletenessFieldDef = {
  key: ClientCompanyCompletenessFieldKey;
  label: string;
  source: "implementation_request" | "request_contact" | "request_modules" | "request_security";
  editableByClient: boolean;
  editControl?: "employee_band_select";
  blockedReason?: string;
};

export const CLIENT_COMPANY_COMPLETENESS_REGISTRY: readonly ClientCompanyCompletenessFieldDef[] =
  [
    {
      key: "companyName",
      label: "Company name",
      source: "implementation_request",
      editableByClient: false,
      blockedReason:
        "Company name is set on your implementation request. Contact ProCrow if the legal name needs to change.",
    },
    {
      key: "industry",
      label: "Industry",
      source: "implementation_request",
      editableByClient: false,
      blockedReason:
        "Industry is confirmed during ProCrow discovery. Request an update through your account manager.",
    },
    {
      key: "employeeBand",
      label: "Employee band",
      source: "implementation_request",
      editableByClient: true,
      editControl: "employee_band_select",
    },
    {
      key: "region",
      label: "Region",
      source: "implementation_request",
      editableByClient: false,
      blockedReason:
        "Operating region is set on your request. ProCrow can update it after verification.",
    },
    {
      key: "primaryContactName",
      label: "Primary contact name",
      source: "request_contact",
      editableByClient: false,
      blockedReason:
        "Primary contact details are tied to your request intake. Update your personal profile or ask ProCrow to amend the request.",
    },
    {
      key: "primaryContactEmail",
      label: "Primary contact email",
      source: "request_contact",
      editableByClient: false,
      blockedReason:
        "Primary contact email is tied to request linkage. Sign in with that email or contact ProCrow for a contact change.",
    },
    {
      key: "selectedModules",
      label: "Selected modules",
      source: "request_modules",
      editableByClient: false,
      blockedReason:
        "Module selection is part of your implementation scope. ProCrow will adjust modules during discovery.",
    },
    {
      key: "securityRequirements",
      label: "Security requirements",
      source: "request_security",
      editableByClient: false,
      blockedReason:
        "Security packages are scoped with ProCrow advisory. Request changes through discovery.",
    },
  ] as const;

/** Completeness labels in display order (matches buildCompanyReadiness). */
export const CLIENT_COMPANY_COMPLETENESS_LABELS = CLIENT_COMPANY_COMPLETENESS_REGISTRY.map(
  (f) => f.label
);

export function assertClientCompanyCompletenessRegistry(): void {
  for (const field of CLIENT_COMPANY_COMPLETENESS_REGISTRY) {
    if (field.editableByClient) {
      if (!field.editControl && field.key === "employeeBand") {
        throw new Error(`Registry field ${field.key} is editable but has no editControl`);
      }
      continue;
    }
    if (!field.blockedReason?.trim()) {
      throw new Error(
        `Registry field "${field.label}" must define blockedReason when not client-editable`
      );
    }
  }

  const employeeBand = CLIENT_COMPANY_COMPLETENESS_REGISTRY.find((f) => f.key === "employeeBand");
  if (!employeeBand?.editableByClient) {
    throw new Error("Employee band must be listed as a client-editable safe field");
  }
}

export function registryFieldForLabel(
  label: string
): ClientCompanyCompletenessFieldDef | undefined {
  return CLIENT_COMPANY_COMPLETENESS_REGISTRY.find((f) => f.label === label);
}
