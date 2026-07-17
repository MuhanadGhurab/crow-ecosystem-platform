import type { SowDraft, SowSectionKey } from "../commercial";
import { SOW_SECTION_KEYS } from "../commercial";

export type SowValidationIssue = {
  code: "MISSING_SECTION" | "EMPTY_BODY" | "MANUAL_EDIT_UNTRACKED" | "VERSION_MISMATCH";
  sectionKey?: SowSectionKey;
  message: string;
};

export type SowValidationResult = {
  valid: boolean;
  issues: SowValidationIssue[];
};

export function validateSowDraft(
  draft: SowDraft,
  options?: { expectedVersion?: string; manuallyEditedKeys?: SowSectionKey[] }
): SowValidationResult {
  const issues: SowValidationIssue[] = [];
  const presentKeys = new Set(draft.sections.map((s) => s.key));

  for (const key of SOW_SECTION_KEYS) {
    if (!presentKeys.has(key)) {
      issues.push({
        code: "MISSING_SECTION",
        sectionKey: key,
        message: `Missing required SOW section: ${key}`,
      });
    }
  }

  for (const section of draft.sections) {
    if (!section.body.trim() || section.body.includes("[Pending discovery")) {
      issues.push({
        code: "EMPTY_BODY",
        sectionKey: section.key,
        message: `Section ${section.key} has no substantive content`,
      });
    }
  }

  if (options?.expectedVersion != null && draft.blueprintVersion !== options.expectedVersion) {
    issues.push({
      code: "VERSION_MISMATCH",
      message: `SOW blueprint version ${draft.blueprintVersion} does not match expected ${options.expectedVersion}`,
    });
  }

  for (const key of options?.manuallyEditedKeys ?? []) {
    const section = draft.sections.find((s) => s.key === key);
    if (!section) {
      issues.push({
        code: "MANUAL_EDIT_UNTRACKED",
        sectionKey: key,
        message: `Manual edit marker for missing section ${key}`,
      });
    }
  }

  return { valid: issues.length === 0, issues };
}
