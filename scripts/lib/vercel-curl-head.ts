/**
 * Read-only Preview route probe via Vercel CLI session (no bypass secret logged).
 * Requires operator `vercel login` — uses Vercel Authentication, not x-vercel-protection-bypass.
 */
import { execSync } from "node:child_process";

export type VercelCurlHeadResult = {
  status: number;
  location: string | null;
};

export function vercelCurlHead(url: string): VercelCurlHeadResult {
  const out = execSync(`npx vercel curl -s -I "${url}"`, {
    encoding: "utf8",
    shell: process.platform === "win32",
    timeout: 120_000,
    stdio: ["pipe", "pipe", "pipe"],
  });

  const statusMatch = out.match(/HTTP\/[\d.]+\s+(\d+)/);
  const locationMatch = out.match(/^location:\s*(.+)$/im);
  if (!statusMatch?.[1]) {
    throw new Error(`Could not parse vercel curl status for ${url}`);
  }
  return {
    status: Number.parseInt(statusMatch[1], 10),
    location: locationMatch?.[1]?.trim() ?? null,
  };
}
