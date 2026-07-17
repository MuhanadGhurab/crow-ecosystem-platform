export class LegalAcceptanceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LegalAcceptanceValidationError";
  }
}
