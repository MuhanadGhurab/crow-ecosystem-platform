import { spawnSync } from "node:child_process";

import { vercelEnvAdd } from "./lib/vercel-env-add-with-timeout";

type FlagSpec = { name: string; value: string };

/** C3.10Q — Production Google OAuth proof window. */
const ENABLE_GOOGLE_PROOF_FLAGS: FlagSpec[] = [
  { name: "GOOGLE_SSO_ENABLED", value: "true" },
  { name: "ACCOUNT_REGISTRATION_ENABLED", value: "false" },
  { name: "CROW_PHONE_VERIFICATION_REQUIRED", value: "false" },
  { name: "CROW_ONBOARDING_GENERATION_REQUIRED", value: "2" },
  { name: "C3_REGISTRATION_DIAGNOSTICS", value: "false" },
  { name: "C3_SESSION_DIAGNOSTICS", value: "false" },
  { name: "C3_AUTH_CANARY_ENABLED", value: "false" },
  { name: "C3_PROOF_DIAGNOSTICS", value: "false" },
];

async function main() {
  const shouldDeploy = process.argv.includes("--deploy");

  for (const spec of ENABLE_GOOGLE_PROOF_FLAGS) {
    console.log(`Setting Production ${spec.name}=${spec.value}…`);
    await vercelEnvAdd(spec.name, spec.value, "production");
    console.log(`  ✓ ${spec.name}`);
  }

  console.log("Enabled C3.10Q Production Google OAuth proof flags.");

  if (shouldDeploy) {
    console.log("Triggering Production deployment…");
    const { execSync } = await import("node:child_process");
    const commitSha = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
    const deploy = spawnSync(
      "npx",
      ["vercel", "deploy", "--prod", "--yes", "--meta", `githubCommitSha=${commitSha}`],
      {
        stdio: "inherit",
        shell: process.platform === "win32",
        timeout: 900_000,
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
