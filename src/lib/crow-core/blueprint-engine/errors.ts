export type BlueprintEngineErrorCode =
  | "BLUEPRINT_NOT_FOUND"
  | "BLUEPRINT_ACCESS_DENIED"
  | "BLUEPRINT_VERSION_STALE"
  | "BLUEPRINT_CONTENT_HASH_MISMATCH"
  | "BLUEPRINT_INVALID_TRANSITION"
  | "BLUEPRINT_REVIEW_CYCLE_CLOSED"
  | "BLUEPRINT_REVIEW_VERSION_MISMATCH"
  | "BLUEPRINT_REQUEST_OWNER_CHANGED"
  | "BLUEPRINT_NOT_READY_FOR_REVIEW"
  | "BLUEPRINT_ALREADY_FINALIZED"
  | "BLUEPRINT_CONCURRENCY_CONFLICT"
  | "BLUEPRINT_VERSION_IMMUTABLE"
  | "BLUEPRINT_DUPLICATE_VERSION_NUMBER";

export class BlueprintEngineError extends Error {
  readonly code: BlueprintEngineErrorCode;
  readonly clientSafe: boolean;

  constructor(code: BlueprintEngineErrorCode, message: string, clientSafe = true) {
    super(message);
    this.name = "BlueprintEngineError";
    this.code = code;
    this.clientSafe = clientSafe;
  }
}

export function toClientMessage(err: BlueprintEngineError): string {
  if (!err.clientSafe) return "Blueprint action could not be completed.";
  return err.message;
}
