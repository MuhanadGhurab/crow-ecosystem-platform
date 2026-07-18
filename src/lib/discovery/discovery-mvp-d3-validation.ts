/**
 * CROW.DISCOVERY.3 / D7 — pure answer validation (no hosted writes).
 */

import type {
  DiscoveryMvpAnswerMap,
  DiscoveryMvpAdaptiveContext,
  DiscoveryMvpFieldDefinition,
} from "@/lib/discovery/discovery-mvp-d3-types";
import { isDiscoveryMvpFieldRequired } from "@/lib/discovery/discovery-mvp-d3-visibility";

export type DiscoveryMvpFieldValidationResult = {
  fieldKey: string;
  ok: boolean;
  message: string | null;
};

function asString(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

export function isAnswerPresent(value: string | number | null | undefined): boolean {
  if (typeof value === "number") return !Number.isNaN(value);
  return asString(value).length > 0;
}

/** Reject upload / path cues — evidence must stay references-only. */
export function looksLikeFileUploadPath(text: string): boolean {
  if (/^https?:\/\//i.test(text)) return false;
  if (/\.(pdf|docx?|xlsx?|png|jpe?g|gif|zip|csv)$/i.test(text)) return true;
  if (/^(file|content|blob):/i.test(text)) return true;
  if (/[\\/].+\.(pdf|docx?|xlsx?|png|jpe?g|zip)$/i.test(text)) return true;
  return false;
}

export function validateDiscoveryMvpFieldAnswer(
  field: DiscoveryMvpFieldDefinition,
  value: string | number | null | undefined,
  ctx: DiscoveryMvpAdaptiveContext,
  answers: DiscoveryMvpAnswerMap = {},
): DiscoveryMvpFieldValidationResult {
  const required = isDiscoveryMvpFieldRequired(field, ctx);
  const present = isAnswerPresent(value);

  // Cross-field: not-available reason required when status says so.
  if (field.fieldKey === "evidence_not_available_reason") {
    const status = asString(answers.evidence_availability_status);
    if (status === "not_available_yet" && !present) {
      return {
        fieldKey: field.fieldKey,
        ok: false,
        message: "Provide a reason when evidence is not available yet.",
      };
    }
  }

  if (!present) {
    if (required) {
      return { fieldKey: field.fieldKey, ok: false, message: "Required for this Discovery context." };
    }
    return { fieldKey: field.fieldKey, ok: true, message: null };
  }

  const v = field.validation;

  if (field.fieldType === "number") {
    const n = typeof value === "number" ? value : Number(asString(value));
    if (Number.isNaN(n)) {
      return { fieldKey: field.fieldKey, ok: false, message: "Enter a valid number." };
    }
    if (v.min !== undefined && n < v.min) {
      return { fieldKey: field.fieldKey, ok: false, message: `Minimum is ${v.min}.` };
    }
    if (v.max !== undefined && n > v.max) {
      return { fieldKey: field.fieldKey, ok: false, message: `Maximum is ${v.max}.` };
    }
    return { fieldKey: field.fieldKey, ok: true, message: null };
  }

  const text = asString(value);

  if (v.enum && !v.enum.includes(text)) {
    return { fieldKey: field.fieldKey, ok: false, message: "Select a valid option." };
  }

  if (v.minLength !== undefined && text.length < v.minLength) {
    return {
      fieldKey: field.fieldKey,
      ok: false,
      message: `At least ${v.minLength} characters required.`,
    };
  }

  if (v.maxLength !== undefined && text.length > v.maxLength) {
    return {
      fieldKey: field.fieldKey,
      ok: false,
      message: `At most ${v.maxLength} characters allowed.`,
    };
  }

  if (v.refsOnly && looksLikeFileUploadPath(text)) {
    return {
      fieldKey: field.fieldKey,
      ok: false,
      message: "Evidence must be a name or URL reference — file uploads are not allowed.",
    };
  }

  return { fieldKey: field.fieldKey, ok: true, message: null };
}

export function validateVisibleDiscoveryMvpAnswers(
  fields: readonly DiscoveryMvpFieldDefinition[],
  answers: DiscoveryMvpAnswerMap,
  ctx: DiscoveryMvpAdaptiveContext,
): DiscoveryMvpFieldValidationResult[] {
  return fields.map((f) => validateDiscoveryMvpFieldAnswer(f, answers[f.fieldKey], ctx, answers));
}

/** Explicit product invariant: Discovery MVP has no file-upload field type. */
export function discoveryMvpCatalogAllowsFileUpload(
  catalog: readonly DiscoveryMvpFieldDefinition[],
): boolean {
  return catalog.some(
    (f) =>
      (f.fieldType as string) === "file" ||
      (f.fieldType as string) === "file_upload" ||
      f.fieldKey.toLowerCase().includes("upload"),
  );
}
