import { spawn } from "node:child_process";

const BRANCH = "feat/c3-account-registration-email-verification";

export function vercelEnvAdd(name: string, value: string, timeoutMs = 90_000): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "npx",
      [
        "vercel",
        "env",
        "add",
        name,
        "preview",
        BRANCH,
        "--value",
        value,
        "--force",
        "--yes",
        "--no-sensitive",
      ],
      { stdio: ["ignore", "pipe", "pipe"], shell: process.platform === "win32" }
    );

    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        child.kill("SIGTERM");
        reject(new Error(`vercel env add timed out for ${name}`));
      }
    }, timeoutMs);

    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    });

    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(`vercel env add failed for ${name} (exit ${code ?? "null"})`));
    });
  });
}
