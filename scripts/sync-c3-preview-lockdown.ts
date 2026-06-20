/**
 * Restore known-safe gated Preview state for the C3 branch.
 * Usage: npm run c3-preview:lockdown
 */
import { spawnSync } from "node:child_process";

const BRANCH = "feat/c3-account-registration-email-verification";

type FlagSpec = { name: string; value: string; sensitive: boolean };

const LOCKDOWN_FLAGS: FlagSpec[] = [
  { name: "ACCOUNT_REGISTRATION_ENABLED", value: "false", sensitive: false },
  { name: "C3_REGISTRATION_DIAGNOSTICS", value: "false", sensitive: false },
  { name: "C3_SESSION_DIAGNOSTICS", value: "false", sensitive: false },
  { name: "C3_AUTH_CANARY_ENABLED", value: "false", sensitive: false },
  { name: "CROW_ONBOARDING_GENERATION_REQUIRED", value: "1", sensitive: false },
];

function runVercelEnvAdd(spec: FlagSpec) {
  const result = spawnSync(
    "npx",
    [
      "vercel",
      "env",
      "add",
      spec.name,
      "preview",
      BRANCH,
      "--value",
      spec.value,
      "--force",
      "--yes",
      spec.sensitive ? "--sensitive" : "--no-sensitive",
    ],
    { encoding: "utf8", shell: process.platform === "win32" }
  );
  if ((result.status ?? 1) !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    throw new Error(`vercel env add failed for ${spec.name}`);
  }
}

const shouldDeploy = process.argv.includes("--deploy");

for (const spec of LOCKDOWN_FLAGS) {
  runVercelEnvAdd(spec);
}

console.log(`Applied gated Preview flags on branch ${BRANCH}.`);

if (shouldDeploy) {
  console.log("Triggering Preview deployment…");
  const deploy = spawnSync(
    "npx",
    ["vercel", "deploy", "--yes"],
    { stdio: "inherit", shell: process.platform === "win32" }
  );
  if ((deploy.status ?? 1) !== 0) {
    process.exit(deploy.status ?? 1);
  }
}
