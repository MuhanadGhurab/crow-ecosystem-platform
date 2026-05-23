/**
 * Expose local staging host (port 3000) on a public HTTPS URL — Vercel workaround.
 *
 * Prerequisite: npm run staging:dev  OR  npm run staging:host  (in another terminal)
 *
 * Usage: npm run staging:tunnel
 */
import { spawn, spawnSync } from "node:child_process";

const PORT = Number(process.env.PORT ?? 3000);
const LOCAL = `http://localhost:${PORT}`;

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
  console.error("  Start staging first: npm run staging:dev\n");
  process.exit(1);
}

function hasCmd(name) {
  const r = spawnSync(process.platform === "win32" ? "where" : "which", [name], {
    encoding: "utf8",
    shell: true,
  });
  return r.status === 0;
}

console.log("\n=== Staging tunnel (Vercel workaround) ===\n");
console.log(`Local server OK at ${LOCAL}\n`);

if (hasCmd("cloudflared")) {
  console.log("Using cloudflared quick tunnel…\n");
  console.log("After URL appears:");
  console.log("  1. Supabase → Auth → URL config → add https://<tunnel>/auth/callback");
  console.log("  2. Set NEXT_PUBLIC_SITE_URL to tunnel URL in .env.staging (optional for email login)");
  console.log("  3. Share https://<tunnel>/login with Omar\n");
  const child = spawn("cloudflared", ["tunnel", "--url", LOCAL], { stdio: "inherit", shell: true });
  child.on("exit", (code) => process.exit(code ?? 0));
} else {
  console.log("cloudflared not found — using localtunnel (npx)…\n");
  console.log("After URL appears, add to Supabase Auth redirect allowlist:");
  console.log("  https://<subdomain>.loca.lt/auth/callback\n");
  const child = spawn(
    "npx",
    ["localtunnel", "--port", String(PORT)],
    { stdio: "inherit", shell: true }
  );
  child.on("exit", (code) => process.exit(code ?? 0));
}
