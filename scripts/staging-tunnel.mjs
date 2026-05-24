/**
 * Expose local staging host on a public HTTPS URL (optional — Omar remote).
 * Prerequisite: npm run staging:local (another terminal)
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PORT = Number(process.env.PORT ?? 3000);
const LOCAL = `http://localhost:${PORT}`;
const nodeWithCa = [process.execPath, "--use-system-ca"];

async function localHealthy() {
  try {
    const res = await fetch(`${LOCAL}/api/health`, { signal: AbortSignal.timeout(5000) });
    return res.ok;
  } catch {
    return false;
  }
}

if (!(await localHealthy())) {
  console.error(`\n✗ Nothing listening on ${LOCAL} with /api/health OK.`);
  console.error("  Start: npm run staging:local\n");
  process.exit(1);
}

function hasCmd(name) {
  const r = spawnSync(process.platform === "win32" ? "where" : "which", [name], {
    encoding: "utf8",
    shell: true,
  });
  return r.status === 0;
}

console.log("\n=== Staging tunnel (optional) ===\n");
console.log(`Local server OK at ${LOCAL}\n`);
console.log("For local-only Omar session, skip tunnel — use http://localhost:3000\n");

if (hasCmd("cloudflared")) {
  console.log("Using cloudflared…\n");
  const child = spawn("cloudflared", ["tunnel", "--url", LOCAL], { stdio: "inherit", shell: true });
  child.on("exit", (code) => process.exit(code ?? 0));
} else {
  const ltBin = join(ROOT, "node_modules", "localtunnel", "bin", "lt.js");
  const ltArgs = existsSync(ltBin)
    ? [...nodeWithCa, ltBin, "--port", String(PORT)]
    : [...nodeWithCa, join(ROOT, "node_modules", "npm", "bin", "npx-cli.js"), "localtunnel", "--port", String(PORT)];

  console.log("Using localtunnel (node --use-system-ca)…\n");
  console.log("Add to Supabase redirect allowlist: https://<subdomain>.loca.lt/auth/callback\n");
  const child = spawn(ltArgs[0], ltArgs.slice(1), { stdio: "inherit", cwd: ROOT });
  child.on("exit", (code) => process.exit(code ?? 0));
}
