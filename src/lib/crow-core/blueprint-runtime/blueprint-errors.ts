export class BlueprintConcurrencyError extends Error {
  readonly code = "BLUEPRINT_CONFLICT" as const;
  readonly status = 409;
  readonly expectedRevision: number;
  readonly currentRevision: number;
  readonly currentHash: string | null;

  constructor(params: {
    message: string;
    expectedRevision: number;
    currentRevision: number;
    currentHash: string | null;
  }) {
    super(params.message);
    this.name = "BlueprintConcurrencyError";
    this.expectedRevision = params.expectedRevision;
    this.currentRevision = params.currentRevision;
    this.currentHash = params.currentHash;
  }
}

export class BlueprintAuthorizationError extends Error {
  readonly code = "BLUEPRINT_UNAUTHORIZED" as const;
  readonly status = 403;

  constructor(message = "Unauthorized blueprint action") {
    super(message);
    this.name = "BlueprintAuthorizationError";
  }
}

export class BlueprintValidationError extends Error {
  readonly code = "BLUEPRINT_VALIDATION" as const;
  readonly status = 400;

  constructor(message: string) {
    super(message);
    this.name = "BlueprintValidationError";
  }
}

export class BlueprintTenantIsolationError extends Error {
  readonly code = "BLUEPRINT_TENANT_ISOLATION" as const;
  readonly status = 403;

  constructor(message = "Cross-tenant blueprint access denied") {
    super(message);
    this.name = "BlueprintTenantIsolationError";
  }
}
