/**
 * Demo launcher: starts Next dev on :3000, waits for health, opens mock-req demo URL.
 * Requires AUTH_DISABLED=true and USE_MOCK_DATA=true in .env (warns if missing).
 */
import { spawn } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BASE = "http://localhost:3000";
const MEEM_DEMO =
  process.env.DEMO_CUSTOMER === "meem" || process.argv.includes("meem");
const DEMO_URL = MEEM_DEMO
  ? `${BASE}/admin/requests/mock-req-meem`
  : `${BASE}/admin/requests/mock-req-001`;

function log(msg) {
  console.log(`[demo] ${msg}`);
}

function warnEnv() {
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) {
    log("Warning: .env missing — copy .env.example to .env");
    return;
  }
  const text = readFileSync(envPath, "utf8");
  const required = { AUTH_DISABLED: "true", USE_MOCK_DATA: "true" };
  const missing = [];
  for (const [key, val] of Object.entries(required)) {
    const re = new RegExp(`^\\s*${key}\\s*=\\s*(.*)$`, "m");
    const m = text.match(re);
    const actual = m?.[1]?.trim().replace(/^["']|["']$/g, "");
    if (actual !== val) missing.push(key);
  }
  if (missing.length) {
    log(`Warning: .env should set: ${missing.join(", ")}=true`);
  } else {
    log(".env OK (AUTH_DISABLED + USE_MOCK_DATA)");
  }
}

function openBrowser(url) {
  const cmd =
    process.platform === "win32"
      ? `start "" "${url}"`
      : process.platform === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd, () => {});
}

async function waitForHealth(maxMs = 60_000) {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/api/health`);
      if (res.ok) {
        const body = await res.json();
        if (body.ok) return true;
      }
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  return false;
}

warnEnv();

const nextBin = join(ROOT, "node_modules", "next", "dist", "bin", "next");
const child = spawn(
  process.execPath,
  ["--use-system-ca", nextBin, "dev"],
  { cwd: ROOT, stdio: "inherit", env: process.env }
);

child.on("error", (err) => {
  console.error("[demo] Failed to start dev server:", err.message);
  process.exit(1);
});

(async () => {
  if (!(await waitForHealth())) {
    log("Health check failed after 60s");
    child.kill("SIGTERM");
    process.exit(1);
  }
  log(`Server ready — ${DEMO_URL}`);
  openBrowser(DEMO_URL);
})();

process.on("SIGINT", () => {
  child.kill("SIGTERM");
  process.exit(0);
});
process.on("SIGTERM", () => {
  child.kill("SIGTERM");
  process.exit(0);
});

child.on("exit", (code) => process.exit(code ?? 0));
