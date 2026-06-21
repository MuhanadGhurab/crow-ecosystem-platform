import "server-only";

export type C3RegistrationDiagnosticStage =
  | "LEGAL_FORM_RECEIVED"
  | "LEGAL_INPUT_VALIDATED"
  | "LEGAL_DOCUMENTS_RESOLVED"
  | "SUPABASE_USER_PROVISION_STARTED"
  | "SUPABASE_USER_PROVISION_COMPLETED"
  | "APPLICATION_TRANSACTION_STARTED"
  | "PLATFORM_ACCOUNT_CREATED"
  | "LEGAL_ACCEPTANCE_RECORDED"
  | "OTP_CHALLENGE_CREATED"
  | "OTP_DELIVERY_CONFIG"
  | "OTP_DELIVERY_ACCEPTED"
  | "REGISTRATION_REDIRECT_ISSUED"
  | "LEGAL_INPUT_REJECTED"
  | "SUPABASE_USER_PROVISION_FAILED"
  | "APPLICATION_TRANSACTION_FAILED"
  | "OTP_DELIVERY_FAILED"
  | "REGISTRATION_REDIRECT_FAILED";

export type C3RegistrationDiagnosticOutcome = "ok" | "failed";

export type C3RegistrationDiagnosticEvent = {
  correlationId: string;
  supportRef: string;
  stage: C3RegistrationDiagnosticStage;
  outcome: C3RegistrationDiagnosticOutcome;
  durationMs: number;
  errorClass?: string;
};

export function isC3RegistrationDiagnosticsEnabled(): boolean {
  return (
    process.env.VERCEL_ENV === "preview" &&
    process.env.C3_REGISTRATION_DIAGNOSTICS === "true"
  );
}

/** Safe stage marker — never include secrets or PII. */
export function emitC3RegistrationDiagnostic(event: C3RegistrationDiagnosticEvent): void {
  if (!isC3RegistrationDiagnosticsEnabled()) return;

  const payload = {
    c3_registration: true,
    correlationId: event.correlationId,
    supportRef: event.supportRef,
    stage: event.stage,
    outcome: event.outcome,
    durationMs: event.durationMs,
    ...(event.errorClass ? { errorClass: event.errorClass } : {}),
  };

  if (event.outcome === "failed") {
    console.error("[c3-registration]", JSON.stringify(payload));
  } else {
    console.info("[c3-registration]", JSON.stringify(payload));
  }
}

export function sanitizeDiagnosticErrorClass(err: unknown): string {
  if (err instanceof Error) {
    return err.name || "Error";
  }
  return "UnknownError";
}

/** Safe hosted email config marker — never logs OTP values, secrets, or recipient email. */
export function emitC3OtpDeliveryConfigDiagnostic(input: {
  keyConfigured: boolean;
  keyLength: number;
  keyDigestPrefix: string | null;
  fromDomainSuffix: string;
  outcome: C3RegistrationDiagnosticOutcome;
}): void {
  if (!isC3RegistrationDiagnosticsEnabled()) return;
  emitC3RegistrationDiagnostic({
    correlationId: "otp-delivery-config",
    supportRef: "otp-delivery-config",
    stage: "OTP_DELIVERY_CONFIG",
    outcome: input.outcome,
    durationMs: 0,
  });
}
