/**
 * Windows: prisma generate can fail with EPERM when query_engine DLL is locked
 * by a running Node/Next dev server. Run before simulate:vercel-build if generate fails.
 */
import { spawnSync } from "node:child_process";

if (process.platform !== "win32") {
  process.exit(0);
}

const r = spawnSync(
  "powershell",
  [
    "-NoProfile",
    "-Command",
    "Get-Process node -ErrorAction SilentlyContinue | Select-Object -First 5 Id,ProcessName",
  ],
  { encoding: "utf8" }
);

const hasNode = (r.stdout ?? "").trim().length > 0;
if (hasNode) {
  console.warn(
    "\n⚠ Windows: Node processes are running. If `prisma generate` fails with EPERM, stop dev servers (Ctrl+C) or:\n" +
      "  Get-Process node | Stop-Process -Force\n" +
      "Then re-run npm run simulate:vercel-build:staging\n"
  );
}
