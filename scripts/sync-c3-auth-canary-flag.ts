import { spawnSync } from "node:child_process";

const BRANCH = "feat/c3-account-registration-email-verification";

type FlagSpec = { name: string; value: string };

const mode = process.argv[2] ?? "enable";

const FLAG: FlagSpec =
  mode === "disable"
    ? { name: "C3_AUTH_CANARY_ENABLED", value: "false" }
    : { name: "C3_AUTH_CANARY_ENABLED", value: "true" };

const result = spawnSync(
  "npx",
  [
    "vercel",
    "env",
    "add",
    FLAG.name,
    "preview",
    BRANCH,
    "--value",
    FLAG.value,
    "--force",
    "--yes",
    "--no-sensitive",
  ],
  { stdio: "inherit", shell: process.platform === "win32" }
);

if ((result.status ?? 1) !== 0) {
  throw new Error(`vercel env add failed for ${FLAG.name}`);
}

console.log(
  mode === "disable"
    ? "Disabled C3_AUTH_CANARY_ENABLED on branch Preview."
    : "Enabled C3_AUTH_CANARY_ENABLED on branch Preview — redeploy Preview before testing."
);
