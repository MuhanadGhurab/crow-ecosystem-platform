/**
 * One logical user submission → one stable idempotency key reused for retries.
 */
export function createLogicalIdempotencyKey(
  command: string,
  fingerprint: string,
): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `ux:${command}:${fingerprint}:${rand}`;
}

export type IdempotencySlot = {
  key: string;
  fingerprint: string;
};

export function resolveIdempotencyKey(
  slot: IdempotencySlot | null,
  command: string,
  fingerprint: string,
): { key: string; slot: IdempotencySlot } {
  if (slot && slot.fingerprint === fingerprint) {
    return { key: slot.key, slot };
  }
  const key = createLogicalIdempotencyKey(command, fingerprint);
  return { key, slot: { key, fingerprint } };
}
