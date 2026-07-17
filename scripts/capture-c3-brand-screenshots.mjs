/**
 * C3 armored Crow brand screenshot capture for product-owner visual review.
 * Requires: local server at C3_SCREENSHOT_BASE (default http://localhost:3000)
 * and playwright: npm install --no-save playwright && npx playwright install chromium
 *
 * Run: node scripts/capture-c3-brand-screenshots.mjs
 */
import { existsSync, mkdirSync, readdirSync, renameSync } from "fs";
import { join } from "path";

import { chromium, devices } from "playwright";

const BASE = process.env.C3_SCREENSHOT_BASE ?? "http://localhost:3000";
const OUT = join(process.cwd(), "docs/internal/screenshots/c3-crow-brand");
const ARCHIVE = join(OUT, "archive", "blob-mark-legacy");

function archiveObsoleteCaptures() {
  if (process.env.C3_SKIP_ARCHIVE === "1") {
    console.log("Skipping archive (C3_SKIP_ARCHIVE=1)");
    return;
  }
  mkdirSync(ARCHIVE, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  for (const name of readdirSync(OUT)) {
    if (!name.endsWith(".png")) continue;
    const from = join(OUT, name);
    renameSync(from, join(ARCHIVE, `${stamp}-${name}`));
  }
  console.log(`Archived prior PNG captures to ${ARCHIVE}`);
}

async function injectSizeGrid(page) {
  await page.evaluate(() => {
    const primaryLabel = [...document.querySelectorAll("p")].find(
      (p) => p.textContent?.trim() === "Primary"
    );
    const svg = primaryLabel?.parentElement?.querySelector("svg");
    if (!svg) return;

    const wrap = document.createElement("div");
    wrap.id = "c3-size-review";
    wrap.style.cssText =
      "position:fixed;inset:0;z-index:99999;background:#04060c;display:flex;align-items:center;justify-content:center;gap:40px;padding:48px";

    for (const size of [24, 48, 72, 160]) {
      const box = document.createElement("div");
      box.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:12px";
      const clone = svg.cloneNode(true);
      clone.setAttribute("width", String(size));
      clone.setAttribute("height", String(size));
      clone.style.width = `${size}px`;
      clone.style.height = `${size}px`;
      const label = document.createElement("p");
      label.textContent = `${size}px`;
      label.style.cssText = "margin:0;font:12px system-ui;color:#94a3b8";
      box.appendChild(clone);
      box.appendChild(label);
      wrap.appendChild(box);
    }
    document.body.appendChild(wrap);
  });
}

async function injectLightDarkComparison(page) {
  await page.evaluate(() => {
    const primaryLabel = [...document.querySelectorAll("p")].find(
      (p) => p.textContent?.trim() === "Primary"
    );
    const svg = primaryLabel?.parentElement?.querySelector("svg");
    if (!svg) return;

    const wrap = document.createElement("div");
    wrap.id = "c3-light-dark-review";
    wrap.style.cssText =
      "position:fixed;inset:0;z-index:99999;display:grid;grid-template-columns:1fr 1fr";

    for (const [bg, label] of [
      ["#f8fafc", "Light background"],
      ["#04060c", "Dark background"],
    ]) {
      const panel = document.createElement("div");
      panel.style.cssText = `background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:48px`;
      const clone = svg.cloneNode(true);
      clone.setAttribute("width", "120");
      clone.setAttribute("height", "120");
      clone.style.width = "120px";
      clone.style.height = "120px";
      const cap = document.createElement("p");
      cap.textContent = label;
      cap.style.cssText = `margin:0;font:13px system-ui;color:${bg === "#f8fafc" ? "#0f172a" : "#e2e8f0"}`;
      panel.appendChild(clone);
      panel.appendChild(cap);
      wrap.appendChild(panel);
    }
    document.body.appendChild(wrap);
  });
}

async function capture() {
  archiveObsoleteCaptures();
  mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();

  try {
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await desktop.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 120_000 });

    const hero = desktop.locator("section[aria-labelledby='hero-heading']");
    await hero.screenshot({ path: join(OUT, "01-homepage-desktop-hero.png") });
    await desktop.screenshot({
      path: join(OUT, "01-homepage-desktop-full.png"),
      fullPage: true,
    });

    const mobile = await browser.newPage({ ...devices["iPhone 13"] });
    await mobile.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 120_000 });
    await mobile.screenshot({
      path: join(OUT, "02-homepage-mobile.png"),
      fullPage: true,
    });

    const loader = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await loader.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await loader.evaluate(() => sessionStorage.removeItem("crow-startup-loader-seen"));
    await loader.reload({ waitUntil: "domcontentloaded" });
    await loader.waitForSelector(".crow-loader-overlay", { timeout: 15_000 }).catch(() => null);
    await loader.waitForTimeout(400);
    await loader.screenshot({
      path: join(OUT, "03-loader-active.png"),
      fullPage: false,
    });
    await loader.waitForTimeout(1200);
    await loader.screenshot({
      path: join(OUT, "04-loader-to-home-fade.png"),
      fullPage: false,
    });

    const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await reduced.emulateMedia({ reducedMotion: "reduce" });
    await reduced.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await reduced.evaluate(() => sessionStorage.removeItem("crow-startup-loader-seen"));
    await reduced.reload({ waitUntil: "domcontentloaded" });
    await reduced.waitForTimeout(500);
    await reduced.screenshot({
      path: join(OUT, "05-reduced-motion-loader.png"),
      fullPage: false,
    });
    await reduced.waitForTimeout(800);
    await reduced.screenshot({
      path: join(OUT, "05-reduced-motion-homepage.png"),
      fullPage: true,
    });

    const lab = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
    await lab.goto(`${BASE}/admin/architecture-lab`, {
      waitUntil: "networkidle",
      timeout: 120_000,
    });

    const brandSection = lab
      .locator("section")
      .filter({ has: lab.getByRole("heading", { name: "Crow Brand Identity" }) });
    await brandSection.scrollIntoViewIfNeeded();
    const brandBox = await brandSection.boundingBox();
    if (brandBox) {
      await lab.screenshot({
        path: join(OUT, "06-architecture-lab-brand-identity.png"),
        fullPage: false,
        clip: brandBox,
      });
    }

    const variantGrid = brandSection.locator("div.grid.gap-4").first();
    const firstCell = variantGrid.locator(":scope > div").nth(0);
    const thirdCell = variantGrid.locator(":scope > div").nth(2);
    await firstCell.scrollIntoViewIfNeeded();
    const firstBox = await firstCell.boundingBox();
    const thirdBox = await thirdCell.boundingBox();
    if (firstBox && thirdBox) {
      await lab.screenshot({
        path: join(OUT, "07-architecture-lab-motion-concepts.png"),
        clip: {
          x: firstBox.x,
          y: firstBox.y,
          width: thirdBox.x + thirdBox.width - firstBox.x,
          height: Math.max(firstBox.height, thirdBox.height),
        },
      });
    }

    const loadingSection = lab
      .locator("section")
      .filter({ has: lab.getByRole("heading", { name: "Loading mark" }) });
    await loadingSection.scrollIntoViewIfNeeded();
    const loadingBox = await loadingSection.boundingBox();
    if (loadingBox) {
      await lab.screenshot({
        path: join(OUT, "08-inline-loading-mark.png"),
        clip: loadingBox,
      });
    }

    await injectSizeGrid(lab);
    await lab.locator("#c3-size-review").screenshot({
      path: join(OUT, "09-size-comparison-24-48-72-160.png"),
    });
    await lab.evaluate(() => document.getElementById("c3-size-review")?.remove());

    const monoCell = lab.getByText("Monochrome", { exact: true }).locator("..");
    await monoCell.screenshot({ path: join(OUT, "10-monochrome-silhouette.png") });

    await injectLightDarkComparison(lab);
    await lab.locator("#c3-light-dark-review").screenshot({
      path: join(OUT, "11-background-light-dark.png"),
    });

    await lab.screenshot({
      path: join(OUT, "06-architecture-lab-full-page.png"),
      fullPage: true,
    });

    console.log(`Screenshots saved to ${OUT}`);
  } finally {
    await browser.close();
  }
}

capture().catch((error) => {
  console.error(error);
  process.exit(1);
});
