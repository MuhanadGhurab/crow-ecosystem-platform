/**
 * F13 / F22 — Capture public-safe demo screenshots (local mock mode).
 * Requires: dev server on :3000 with AUTH_DISABLED=true and USE_MOCK_DATA=true.
 *
 * Usage:
 *   node scripts/capture-f13-screenshots.mjs
 *   SCREENSHOT_BASE=http://localhost:3000 node scripts/capture-f13-screenshots.mjs
 */
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "docs", "public", "assets", "screenshots");
const BASE = (process.env.SCREENSHOT_BASE ?? "http://localhost:3000").replace(/\/$/, "");

/** @type {{ file: string; route: string; fullPage?: boolean; waitMs?: number }[]} */
const SHOTS = [
  { file: "homepage-hero.png", route: "/", fullPage: true },
  { file: "architecture.png", route: "/architecture", fullPage: true },
  { file: "public-request.png", route: "/request", fullPage: true },
  { file: "admin-operator-console.png", route: "/admin/overview" },
  { file: "admin-request-detail.png", route: "/admin/requests/mock-req-meem", waitMs: 2000 },
  { file: "discovery-summary.png", route: "/discovery/mock-req-meem-discovery/summary" },
  { file: "blueprint-overview.png", route: "/blueprints/mock-bp-meem/overview" },
  { file: "blueprint-readiness.png", route: "/blueprints/mock-bp-meem/readiness" },
  { file: "blueprint-go-live.png", route: "/blueprints/mock-bp-meem/go-live" },
  { file: "meem-dashboard.png", route: "/meem-global/dashboard", waitMs: 2500 },
  { file: "cybercrow-dashboard.png", route: "/meem-global/cybercrow/dashboard", waitMs: 2500 },
  { file: "sarea-preview.png", route: "/sarea/preview", waitMs: 2000 },
  { file: "admin-notifications.png", route: "/admin/notifications" },
  // F22 refresh targets (run after F15.5, F18, F19, F20, F21 UI changes)
  { file: "login-sign-in.png", route: "/login", fullPage: true },
  { file: "pricing-advisory.png", route: "/pricing", fullPage: true },
  { file: "cybercrow-evidence.png", route: "/meem-global/cybercrow/evidence", waitMs: 2500 },
  { file: "cybercrow-grc.png", route: "/meem-global/cybercrow/grc", waitMs: 2500 },
  { file: "sarea-studio-overview.png", route: "/sarea/overview", waitMs: 2000 },
];

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error(
      "playwright is not installed. Run: npm install -D playwright && npx playwright install chromium"
    );
    process.exit(1);
  }

  await mkdir(OUT, { recursive: true });

  const health = await fetch(`${BASE}/api/health`).catch(() => null);
  if (!health?.ok) {
    console.error(`Health check failed for ${BASE}/api/health — start dev server first.`);
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: "dark",
  });
  const page = await context.newPage();

  /** Hide local-only dev chrome before capture (does not change app source). */
  async function polishForPublicCapture() {
    await page.evaluate(() => {
      const hideEl = (el) => {
        if (!el || el === document.body) return;
        el.style.display = "none";
      };
      const hideText = (needle) => {
        const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let n;
        while ((n = walk.nextNode())) {
          const t = n.textContent?.trim() ?? "";
          if (t === needle || t.includes(needle)) {
            hideEl(n.parentElement);
          }
        }
      };
      const needles = [
        "Auth bypass",
        "USE_MOCK_DATA",
        "Mock blueprint",
        "Demo data",
        "npm run db:seed",
        "CROW-2026",
        "E2E Smoke",
        "mock-req-",
        "mock-bp-",
        "docs/internal",
        "F8_ORGANIC",
        "F10_TENANT",
      ];
      for (const needle of needles) hideText(needle);

      /** Hide URL bar if visible (file:// or localhost paths with mock ids). */
      if (location.hostname === "localhost") {
        document.querySelectorAll("input[type='url'], [role='textbox']").forEach(hideEl);
      }
    });
  }

  const results = [];
  for (const shot of SHOTS) {
    const url = `${BASE}${shot.route}`;
    const outPath = path.join(OUT, shot.file);
    try {
      const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90_000 });
      if (shot.waitMs) await page.waitForTimeout(shot.waitMs);
      else await page.waitForTimeout(1200);
      await polishForPublicCapture();
      await page.waitForTimeout(400);
      await page.screenshot({
        path: outPath,
        fullPage: shot.fullPage ?? false,
        animations: "disabled",
      });
      results.push({
        file: shot.file,
        route: shot.route,
        status: res?.status() ?? 0,
        ok: true,
      });
      console.log(`OK  ${shot.file}  (${res?.status()})  ${url}`);
    } catch (err) {
      results.push({ file: shot.file, route: shot.route, ok: false, error: String(err) });
      console.error(`FAIL ${shot.file}  ${url}  ${err}`);
    }
  }

  await browser.close();
  const failed = results.filter((r) => !r.ok);
  if (failed.length) process.exit(2);
}

main();
