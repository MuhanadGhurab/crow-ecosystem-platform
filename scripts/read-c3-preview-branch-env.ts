/**
 * Read branch-scoped Preview env values from Vercel (no secret values printed).
 * Usage: npx tsx scripts/read-c3-preview-branch-env.ts
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BRANCH = "feat/c3-account-registration-email-verification";

const TRACKED_FLAGS = [
  "ACCOUNT_REGISTRATION_ENABLED",
  "CROW_PHONE_VERIFICATION_REQUIRED",
  "CROW_ONBOARDING_GENERATION_REQUIRED",
  "C3_REGISTRATION_DIAGNOSTICS",
  "C3_SESSION_DIAGNOSTICS",
  "C3_AUTH_CANARY_ENABLED",
] as const;

const PROOF_EXPECTED = {
  ACCOUNT_REGISTRATION_ENABLED: "true",
  CROW_PHONE_VERIFICATION_REQUIRED: "false",
  CROW_ONBOARDING_GENERATION_REQUIRED: "2",
  C3_REGISTRATION_DIAGNOSTICS: "false",
  C3_SESSION_DIAGNOSTICS: "false",
  C3_AUTH_CANARY_ENABLED: "false",
} as const;

const REQUIRED_GATED = {
  ACCOUNT_REGISTRATION_ENABLED: "false",
  CROW_PHONE_VERIFICATION_REQUIRED: "false",
  CROW_ONBOARDING_GENERATION_REQUIRED: "1",
  C3_REGISTRATION_DIAGNOSTICS: "false",
  C3_SESSION_DIAGNOSTICS: "false",
  C3_AUTH_CANARY_ENABLED: "false",
} as const;

function parseEnvFile(content: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq);
    let value = trimmed.slice(eq + 1);
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    map.set(key, value);
  }
  return map;
}

function pullPreviewEnv(targetPath: string): void {
  const result = spawnSync(
    "npx",
    [
      "vercel",
      "env",
      "pull",
      targetPath,
      "--environment=preview",
      "--git-branch",
      BRANCH,
      "--yes",
    ],
    { encoding: "utf8", shell: process.platform === "win32" }
  );
  if ((result.status ?? 1) !== 0) {
    console.error("Failed to pull branch-scoped Preview env from Vercel.");
    if (result.stderr) process.stderr.write(result.stderr);
    process.exit(1);
  }
}

function main() {
  const mode = process.argv[2] === "proof" ? "proof" : "gated";
  const expected = mode === "proof" ? PROOF_EXPECTED : REQUIRED_GATED;

  const dir = mkdtempSync(join(tmpdir(), "crow-preview-env-"));
  const envPath = join(dir, ".env.preview.branch");
  try {
    pullPreviewEnv(envPath);
    const values = parseEnvFile(readFileSync(envPath, "utf8"));

    console.log(`\nBranch Preview env (${BRANCH}) mode=${mode}\n`);
    let allMatch = true;

    for (const flag of TRACKED_FLAGS) {
      const actual = values.get(flag) ?? "(unset)";
      const want = expected[flag as keyof typeof expected];
      const match = actual === want;
      if (!match) allMatch = false;
      console.log(`  ${flag}=${actual}${match ? "" : ` (expected ${want})`}`);
    }

    const label = mode === "proof" ? "PROOF_STATE" : "GATED_STATE";
    console.log(allMatch ? `\n${label}=OK\n` : `\n${label}=MISMATCH\n`);
    process.exit(allMatch ? 0 : 2);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

main();
