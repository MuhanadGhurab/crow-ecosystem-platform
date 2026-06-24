import type { ClientEnterpriseDesignDraft } from "../types";
import { CLIENT_ENTERPRISE_DESIGN_SCHEMA_VERSION } from "../types";

export function validateClientEnterpriseDesignDraft(
  draft: unknown,
): { ok: true; draft: ClientEnterpriseDesignDraft } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  if (!draft || typeof draft !== "object") return { ok: false, errors: ["draft must be an object"] };
  const d = draft as Partial<ClientEnterpriseDesignDraft>;
  if (d.designVersion !== CLIENT_ENTERPRISE_DESIGN_SCHEMA_VERSION) {
    errors.push("invalid designVersion");
  }
  if (!d.requestId || typeof d.requestId !== "string") errors.push("requestId required");
  if (!d.status || !["DRAFT", "READY_FOR_REVIEW", "SUBMITTED"].includes(d.status)) {
    errors.push("invalid status");
  }
  if (d.status === "SUBMITTED" && !d.primaryIndustry) errors.push("primaryIndustry required for submission");
  if (d.status === "SUBMITTED" && !d.primaryPurposeKey) errors.push("primaryPurposeKey required for submission");
  if (errors.length) return { ok: false, errors };
  return { ok: true, draft: d as ClientEnterpriseDesignDraft };
}

export function hasStructuralContradictions(draft: ClientEnterpriseDesignDraft): string[] {
  const issues: string[] = [];
  if (draft.selectedCapabilities.length === 0 && draft.status === "SUBMITTED") {
    issues.push("No operating capabilities selected.");
  }
  if (
    draft.customizations.some((c) => c.kind === "change_approval_depth" && Number(c.value) === 0)
  ) {
    issues.push("Approval depth cannot be zero for submitted designs.");
  }
  return issues;
}
