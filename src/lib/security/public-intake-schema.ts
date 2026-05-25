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
