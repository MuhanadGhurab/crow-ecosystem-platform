/**
 * C3 Operability — capture desktop + mobile screenshots from real local-auth journey.
 * Requires dev server at C3_OPERABILITY_BASE (default http://localhost:3000).
 *
 * Run: node scripts/capture-c3-operability-screenshots.mjs
 */
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

import { chromium, devices } from "playwright";

const BASE = process.env.C3_OPERABILITY_BASE ?? "http://localhost:3000";
const OUT = join(process.cwd(), "docs/internal/screenshots/c3-operability");

const SHOTS = [
  { name: "01-homepage-desktop", path: "/", viewport: { width: 1440, height: 900 } },
  { name: "02-login-desktop", path: "/login", viewport: { width: 1440, height: 900 } },
  { name: "03-signup-desktop", path: "/signup", viewport: { width: 1440, height: 900 } },
  { name: "04-register-legal-desktop", path: "/register/legal", viewport: { width: 1440, height: 900 } },
  { name: "05-verify-email-desktop", path: "/verify-email", viewport: { width: 1440, height: 900 } },
  { name: "06-account-home-desktop", path: "/account", viewport: { width: 1440, height: 900 } },
  { name: "07-account-profile-desktop", path: "/account/profile", viewport: { width: 1440, height: 900 } },
  { name: "08-account-requests-desktop", path: "/account/requests", viewport: { width: 1440, height: 900 } },
  { name: "09-request-intake-desktop", path: "/request", viewport: { width: 1440, height: 900 } },
  { name: "10-homepage-mobile", path: "/", device: "iPhone 13" },
  { name: "11-login-mobile", path: "/login", device: "iPhone 13" },
  { name: "12-account-home-mobile", path: "/account", device: "iPhone 13" },
];

async function main() {
  mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const shot of SHOTS) {
    if (shot.device) {
      const device = devices[shot.device];
      await page.setViewportSize(device.viewport);
      await page.goto(`${BASE}${shot.path}`, { waitUntil: "networkidle", timeout: 60_000 });
    } else {
      await page.setViewportSize(shot.viewport);
      await page.goto(`${BASE}${shot.path}`, { waitUntil: "networkidle", timeout: 60_000 });
    }
    const file = join(OUT, `${shot.name}.png`);
    await page.screenshot({ path: file, fullPage: shot.path === "/" });
    console.log(`Wrote ${file}`);
  }

  await browser.close();
  console.log(`\nC3 operability screenshots saved to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
