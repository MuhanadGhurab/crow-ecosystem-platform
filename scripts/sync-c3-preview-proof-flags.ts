import { spawnSync } from "node:child_process";

const BRANCH = "feat/c3-account-registration-email-verification";

type FlagSpec = { name: string; value: string; sensitive: boolean };

const DISABLE_FLAGS: FlagSpec[] = [
  { name: "ACCOUNT_REGISTRATION_ENABLED", value: "false", sensitive: false },
  { name: "C3_REGISTRATION_DIAGNOSTICS", value: "false", sensitive: false },
  { name: "C3_SESSION_DIAGNOSTICS", value: "false", sensitive: false },
];

const ENABLE_PROOF_FLAGS: FlagSpec[] = [
  { name: "ACCOUNT_REGISTRATION_ENABLED", value: "true", sensitive: false },
  { name: "C3_REGISTRATION_DIAGNOSTICS", value: "true", sensitive: false },
  { name: "C3_SESSION_DIAGNOSTICS", value: "true", sensitive: false },
];

function runVercelEnvAdd(spec: FlagSpec) {
  const args = [
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
  ];

  const result = spawnSync("npx", args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if ((result.status ?? 1) !== 0) {
    throw new Error(`vercel env add failed for ${spec.name}`);
  }
}

const mode = process.argv[2] ?? "disable";
const flags = mode === "enable-proof" ? ENABLE_PROOF_FLAGS : DISABLE_FLAGS;

for (const spec of flags) {
  runVercelEnvAdd(spec);
}

console.log(
  mode === "enable-proof"
    ? "Enabled C3 Preview proof flags on branch Preview."
    : "Disabled C3 Preview registration/diagnostics flags on branch Preview."
);
