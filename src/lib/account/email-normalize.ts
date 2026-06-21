/** Normalize email for uniqueness and OTP delivery (lowercase, trim). */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
