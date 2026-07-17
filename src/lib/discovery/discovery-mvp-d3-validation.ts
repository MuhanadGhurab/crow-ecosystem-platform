/**
 * CROW.DISCOVERY.3 — pure answer validation (no hosted writes).
 */

import type {
  DiscoveryMvpAnswerMap,
  DiscoveryMvpFieldDefinition,
} from "@/lib/discovery/discovery-mvp-d3-types";
import { isDiscoveryMvpFieldRequired } from "@/lib/discovery/discovery-mvp-d3-visibility";
import type { DiscoveryMvpAdaptiveContext } from "@/lib/discovery/discovery-mvp-d3-types";

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

export function validateDiscoveryMvpFieldAnswer(
  field: DiscoveryMvpFieldDefinition,
  value: string | number | null | undefined,
  ctx: DiscoveryMvpAdaptiveContext,
): DiscoveryMvpFieldValidationResult {
  const required = isDiscoveryMvpFieldRequired(field, ctx);
  const present = isAnswerPresent(value);

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

  if (v.refsOnly) {
    // Reject obvious upload / path cues — refs are text/URL only.
    if (/\.(pdf|docx?|xlsx?|png|jpe?g|zip)$/i.test(text) && !/^https?:\/\//i.test(text)) {
      return {
        fieldKey: field.fieldKey,
        ok: false,
        message: "Evidence must be a name or URL reference — file uploads are not allowed.",
      };
    }
  }

  return { fieldKey: field.fieldKey, ok: true, message: null };
}

export function validateVisibleDiscoveryMvpAnswers(
  fields: readonly DiscoveryMvpFieldDefinition[],
  answers: DiscoveryMvpAnswerMap,
  ctx: DiscoveryMvpAdaptiveContext,
): DiscoveryMvpFieldValidationResult[] {
  return fields.map((f) => validateDiscoveryMvpFieldAnswer(f, answers[f.fieldKey], ctx));
}
