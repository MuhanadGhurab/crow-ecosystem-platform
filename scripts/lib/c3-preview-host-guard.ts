/** Assert every navigation stays on the canonical Preview hostname. */
export function assertPreviewHost(
  url: string | URL,
  previewBase: string,
  label: string
): void {
  const expected = new URL(previewBase).host;
  const actual = typeof url === "string" ? new URL(url).host : url.host;
  if (actual !== expected) {
    throw new Error(`Host drift at ${label}: expected ${expected}, got ${actual}`);
  }
}

export function previewBypassHeaders(bypass: string): Record<string, string> {
  return {
    "x-vercel-protection-bypass": bypass,
    "x-vercel-set-bypass-cookie": "true",
  };
}
