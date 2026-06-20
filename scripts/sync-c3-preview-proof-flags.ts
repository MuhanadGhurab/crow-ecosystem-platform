import { spawnSync } from "node:child_process";

import { vercelEnvAdd } from "./lib/vercel-env-add-with-timeout";

const BRANCH = "feat/c3-account-registration-email-verification";

type FlagSpec = { name: string; value: string; sensitive: boolean };

const DISABLE_FLAGS: FlagSpec[] = [
  { name: "ACCOUNT_REGISTRATION_ENABLED", value: "false", sensitive: false },
  { name: "GOOGLE_SSO_ENABLED", value: "false", sensitive: false },
  { name: "CROW_PHONE_VERIFICATION_REQUIRED", value: "false", sensitive: false },
  { name: "CROW_ONBOARDING_GENERATION_REQUIRED", value: "1", sensitive: false },
  { name: "C3_REGISTRATION_DIAGNOSTICS", value: "false", sensitive: false },
  { name: "C3_SESSION_DIAGNOSTICS", value: "false", sensitive: false },
  { name: "C3_AUTH_CANARY_ENABLED", value: "false", sensitive: false },
];

const ENABLE_PROOF_FLAGS: FlagSpec[] = [
  { name: "ACCOUNT_REGISTRATION_ENABLED", value: "true", sensitive: false },
  { name: "GOOGLE_SSO_ENABLED", value: "false", sensitive: false },
  { name: "CROW_PHONE_VERIFICATION_REQUIRED", value: "false", sensitive: false },
  { name: "CROW_ONBOARDING_GENERATION_REQUIRED", value: "2", sensitive: false },
  { name: "C3_REGISTRATION_DIAGNOSTICS", value: "false", sensitive: false },
  { name: "C3_SESSION_DIAGNOSTICS", value: "false", sensitive: false },
  { name: "C3_AUTH_CANARY_ENABLED", value: "false", sensitive: false },
];

/** C3.10O — Google OAuth proof window: Google on, public registration off. */
const ENABLE_GOOGLE_PROOF_FLAGS: FlagSpec[] = [
  { name: "GOOGLE_SSO_ENABLED", value: "true", sensitive: false },
  { name: "ACCOUNT_REGISTRATION_ENABLED", value: "false", sensitive: false },
  { name: "CROW_PHONE_VERIFICATION_REQUIRED", value: "false", sensitive: false },
  { name: "CROW_ONBOARDING_GENERATION_REQUIRED", value: "2", sensitive: false },
  { name: "C3_REGISTRATION_DIAGNOSTICS", value: "false", sensitive: false },
  { name: "C3_SESSION_DIAGNOSTICS", value: "false", sensitive: false },
  { name: "C3_AUTH_CANARY_ENABLED", value: "false", sensitive: false },
];

async function main() {
  const mode = process.argv[2] ?? "disable";
  const shouldDeploy = process.argv.includes("--deploy");
  const flags =
    mode === "enable-google-proof"
      ? ENABLE_GOOGLE_PROOF_FLAGS
      : mode === "enable-proof"
        ? ENABLE_PROOF_FLAGS
        : DISABLE_FLAGS;

  for (const spec of flags) {
    console.log(`Setting ${spec.name}=${spec.value}…`);
    await vercelEnvAdd(spec.name, spec.value);
    console.log(`  ✓ ${spec.name}`);
  }

  console.log(
    mode === "enable-google-proof"
      ? "Enabled C3.10O Google OAuth Preview proof flags on branch Preview."
      : mode === "enable-proof"
        ? "Enabled C3.10C email-only Preview proof flags on branch Preview."
        : "Closed C3 Preview proof window — Google SSO off, registration disabled, generation gate restored to 1."
  );

  if (shouldDeploy) {
    console.log("Triggering Preview deployment…");
    const { execSync } = await import("node:child_process");
    const commitSha = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
    const deploy = spawnSync(
      "npx",
      ["vercel", "deploy", "--yes", "--meta", `githubCommitSha=${commitSha}`],
      {
        stdio: "inherit",
        shell: process.platform === "win32",
        timeout: 600_000,
      }
    );
    if ((deploy.status ?? 1) !== 0) {
      process.exit(deploy.status ?? 1);
    }
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
