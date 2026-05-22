/**
 * Free port 3000 before dev/demo. Cross-platform (Windows netstat/taskkill, Unix lsof/kill).
 */
import { execSync } from "child_process";

const PORT = Number(process.env.PORT ?? 3000);

function log(msg) {
  console.log(`[free-port] ${msg}`);
}

function freePortWindows(port) {
  try {
    const out = execSync(`netstat -ano | findstr :${port}`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    });
    const pids = new Set();
    for (const line of out.split(/\r?\n/)) {
      if (!/LISTENING/i.test(line)) continue;
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (/^\d+$/.test(pid)) pids.add(pid);
    }
    for (const pid of pids) {
      log(`Stopping PID ${pid} on port ${port}`);
      execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
    }
  } catch {
    /* nothing listening */
  }
}

function freePortUnix(port) {
  try {
    const pids = execSync(`lsof -ti :${port}`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    })
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    for (const pid of pids) {
      log(`Stopping PID ${pid} on port ${port}`);
      execSync(`kill -9 ${pid}`, { stdio: "ignore" });
    }
  } catch {
    /* nothing listening */
  }
}

if (process.platform === "win32") {
  freePortWindows(PORT);
} else {
  freePortUnix(PORT);
}
