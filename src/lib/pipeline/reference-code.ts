/**
 * System-generated implementation request reference codes (public intake).
 * Format: CROW-{year}-{6-char alphanumeric} — logged by seeds and verify scripts.
 */

export function generateImplementationReferenceCode(now = new Date()): string {
  const year = now.getFullYear();
  const seq = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CROW-${year}-${seq}`;
}
