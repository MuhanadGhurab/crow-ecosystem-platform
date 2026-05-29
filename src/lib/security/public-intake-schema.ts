import { z } from "zod";
import { CEM_MODULES, type CemModuleKey } from "@/lib/constants/modules";
import { SECURITY_PACKAGES, type SecurityPackageKey } from "@/lib/constants/security-packages";

/** Conservative JSON cap for public intake (RC1 SEC-004 / F1). */
export const MAX_IMPLEMENTATION_REQUEST_BYTES = 256 * 1024;

const cemModuleKeySchema = z.enum(
  CEM_MODULES.map((m) => m.key) as [CemModuleKey, ...CemModuleKey[]]
);
const securityPackageKeySchema = z.enum(
  SECURITY_PACKAGES.map((p) => p.key) as [SecurityPackageKey, ...SecurityPackageKey[]]
);

export const publicIntakeMetaSchema = z.object({
  companyWebsite: z.string().max(500).optional(),
  turnstileToken: z.string().max(2048).optional(),
});

export const createPublicIntakeSchema = z.object({
  organizationName: z.string().min(2).max(200),
  organizationNameAr: z.string().max(200).optional(),
  industry: z.string().max(120).optional(),
  employeeBand: z.string().max(50).optional(),
  countryCode: z.string().max(10).optional(),
  planKey: z.enum(["startup", "growth", "enterprise"]),
  moduleKeys: z.array(cemModuleKeySchema).max(20).default([]),
  securityPackageKeys: z.array(securityPackageKeySchema).max(10).default([]),
  contact: z.object({
    fullName: z.string().min(2).max(200),
    email: z.string().email().max(254),
    phone: z.string().max(40).optional(),
    jobTitle: z.string().max(120).optional(),
  }),
  notes: z.string().max(5000).optional(),
});

export type PublicIntakePayload = z.infer<typeof createPublicIntakeSchema>;

export function splitPublicIntakeBody(body: unknown): {
  meta: { companyWebsite?: string; turnstileToken?: string };
  payload: unknown;
} {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { meta: {}, payload: body };
  }
  const record = body as Record<string, unknown>;
  const { companyWebsite, turnstileToken, ...rest } = record;
  return {
    meta: {
      companyWebsite: typeof companyWebsite === "string" ? companyWebsite : undefined,
      turnstileToken: typeof turnstileToken === "string" ? turnstileToken : undefined,
    },
    payload: rest,
  };
}

export function isProductionApiErrors(): boolean {
  return process.env.NODE_ENV === "production";
}

export function publicIntakeValidationErrorBody(err: z.ZodError): { error: unknown } {
  if (isProductionApiErrors()) {
    return { error: "Invalid request. Check required fields and try again." };
  }
  return { error: err.flatten() };
}

export function publicIntakeServiceUnavailableBody(): { error: string } {
  return { error: "Service temporarily unavailable. Please try again later." };
}

/** Client-side mirror of server validation (wizard submit). */
export function validatePublicIntakeClient(
  payload: unknown
): { ok: true; data: PublicIntakePayload } | { ok: false; message: string } {
  const parsed = createPublicIntakeSchema.safeParse(payload);
  if (!parsed.success) {
    const body = publicIntakeValidationErrorBody(parsed.error);
    const message =
      typeof body.error === "string"
        ? body.error
        : "Check required fields: organization name, contact name, and a valid email.";
    return { ok: false, message };
  }
  return { ok: true, data: parsed.data };
}

export function intakeHttpErrorMessage(status: number, body: unknown): string {
  if (status === 429) {
    return "Too many requests. Please wait a few minutes and try again.";
  }
  if (status === 413) {
    return "Submission is too large. Shorten notes and try again.";
  }
  if (body && typeof body === "object" && "error" in body) {
    const err = (body as { error: unknown }).error;
    if (typeof err === "string") return err;
    if (err && typeof err === "object") {
      const flat = err as {
        fieldErrors?: Record<string, string[]>;
        formErrors?: string[];
      };
      const parts = [
        ...(flat.formErrors ?? []),
        ...Object.entries(flat.fieldErrors ?? {}).flatMap(([field, msgs]) =>
          msgs.map((m) => `${field}: ${m}`)
        ),
      ];
      if (parts.length > 0) return parts.slice(0, 3).join(" ");
    }
  }
  if (status === 503) {
    return publicIntakeServiceUnavailableBody().error;
  }
  if (status === 403) {
    return "Your account cannot submit requests yet. Sign out, sign in again, or contact support.";
  }
  return "We could not submit your request. Check required fields and try again.";
}
