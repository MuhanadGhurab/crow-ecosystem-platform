const MAX_USER_AGENT_LENGTH = 512;

/** Truncate and sanitize user-agent for acceptance evidence (no control chars). */
export function summarizeUserAgent(
  userAgent: string | null | undefined
): string | null {
  if (!userAgent) return null;
  const cleaned = userAgent
    .replace(/[\x00-\x1f\x7f]/g, " ")
    .trim()
    .slice(0, MAX_USER_AGENT_LENGTH);
  return cleaned.length > 0 ? cleaned : null;
}
