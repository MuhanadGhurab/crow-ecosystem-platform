const FORBIDDEN_REFERENCE_PATTERNS = [
  /https?:\/\//i,
  /postgresql:\/\//i,
  /postgres:\/\//i,
  /@/,
  /password/i,
  /secret/i,
  /token/i,
  /service[_-]?role/i,
  /\bsk_[a-z0-9]/i,
  /\bre_[a-z0-9]/i,
  /[A-Za-z0-9+/]{40,}={0,2}/,
];

export type MigrationRecoveryEvidence = {
  reference: string;
  verifiedAt: string;
  method: "BACKUP" | "PITR";
};

export type MigrationRecoveryValidation = {
  valid: boolean;
  errors: string[];
  evidence: MigrationRecoveryEvidence | null;
  sanitized: {
    referencePresent: boolean;
    referenceLength: number;
    verifiedAt: string | null;
    method: string | null;
    verifiedAtAgeHours: number | null;
    predatesMigrationExecution: boolean;
  };
};

function parseIso8601(value: string): Date | null {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return null;
  return new Date(parsed);
}

export function validateMigrationRecoveryReference(reference: string): string[] {
  const errors: string[] = [];
  const trimmed = reference.trim();
  if (!trimmed) {
    errors.push("MIGRATION_BACKUP_REFERENCE is empty.");
    return errors;
  }
  if (trimmed.length < 8) {
    errors.push("MIGRATION_BACKUP_REFERENCE is too short (minimum 8 characters).");
  }
  if (trimmed.length > 256) {
    errors.push("MIGRATION_BACKUP_REFERENCE exceeds maximum length (256).");
  }
  for (const pattern of FORBIDDEN_REFERENCE_PATTERNS) {
    if (pattern.test(trimmed)) {
      errors.push(
        "MIGRATION_BACKUP_REFERENCE contains forbidden credential or URL-like content."
      );
      break;
    }
  }
  return errors;
}

export function validateMigrationRecoveryEvidence(options?: {
  maxAgeHours?: number;
  now?: Date;
}): MigrationRecoveryValidation {
  const maxAgeHours = options?.maxAgeHours ?? 24 * 14;
  const now = options?.now ?? new Date();

  const reference = process.env.MIGRATION_BACKUP_REFERENCE?.trim() ?? "";
  const checksum = process.env.MIGRATION_BACKUP_CHECKSUM?.trim() ?? "";
  const verifiedAtRaw = process.env.MIGRATION_BACKUP_VERIFIED_AT?.trim() ?? "";
  const methodRaw = process.env.MIGRATION_RECOVERY_METHOD?.trim() ?? "";

  const errors: string[] = [];
  const effectiveReference = reference || checksum;

  if (!effectiveReference) {
    errors.push("MIGRATION_BACKUP_REFERENCE (or legacy MIGRATION_BACKUP_CHECKSUM) is required.");
  } else if (reference) {
    errors.push(...validateMigrationRecoveryReference(reference));
  } else if (checksum) {
    if (!/^[a-f0-9]{64}$/i.test(checksum)) {
      errors.push("MIGRATION_BACKUP_CHECKSUM must be a 64-character SHA-256 hex string.");
    }
  }

  if (!verifiedAtRaw) {
    errors.push("MIGRATION_BACKUP_VERIFIED_AT is required.");
  }

  const verifiedAt = verifiedAtRaw ? parseIso8601(verifiedAtRaw) : null;
  if (verifiedAtRaw && !verifiedAt) {
    errors.push("MIGRATION_BACKUP_VERIFIED_AT is not valid ISO-8601.");
  }

  if (methodRaw !== "BACKUP" && methodRaw !== "PITR") {
    errors.push("MIGRATION_RECOVERY_METHOD must be exactly BACKUP or PITR.");
  }

  let verifiedAtAgeHours: number | null = null;
  let predatesMigrationExecution = false;

  if (verifiedAt) {
    if (verifiedAt.getTime() > now.getTime()) {
      errors.push("MIGRATION_BACKUP_VERIFIED_AT must not be in the future.");
    }
    verifiedAtAgeHours = (now.getTime() - verifiedAt.getTime()) / (1000 * 60 * 60);
    if (verifiedAtAgeHours > maxAgeHours) {
      errors.push(
        `MIGRATION_BACKUP_VERIFIED_AT is older than ${maxAgeHours} hours (not recent enough).`
      );
    }
    predatesMigrationExecution = verifiedAt.getTime() < now.getTime();
  }

  const evidence: MigrationRecoveryEvidence | null =
    errors.length === 0 && verifiedAt && (methodRaw === "BACKUP" || methodRaw === "PITR")
      ? {
          reference: effectiveReference,
          verifiedAt: verifiedAt.toISOString(),
          method: methodRaw,
        }
      : null;

  return {
    valid: errors.length === 0 && evidence !== null,
    errors,
    evidence,
    sanitized: {
      referencePresent: Boolean(effectiveReference),
      referenceLength: effectiveReference.length,
      verifiedAt: verifiedAt?.toISOString() ?? null,
      method: methodRaw || null,
      verifiedAtAgeHours,
      predatesMigrationExecution,
    },
  };
}
