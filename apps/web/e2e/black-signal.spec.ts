import { test, expect } from "@playwright/test";
import { bootstrapSession } from "./helpers";

test.describe.configure({ timeout: 120_000 });

test.describe("Black Signal Living Mission vertical slice", () => {
  test("Arabic RTL playable path reaches debrief", async ({ page }) => {
    await bootstrapSession(page);
    await page.goto("/missions/black-signal");
    await expect(
      page.getByRole("heading", { name: /الإشارة السوداء/ }),
    ).toBeVisible();
    await page.getByRole("button", { name: "ابدأ الرحلة" }).click();
    await expect(page.locator("[data-node]")).toBeVisible({ timeout: 20_000 });

    // Drive a short deterministic continuity-leaning path until complete
    for (let i = 0; i < 20; i++) {
      const complete = page.locator("[data-debrief]");
      if (await complete.isVisible().catch(() => false)) break;
      const firstChoice = page.locator(".choice-stack button").first();
      await expect(firstChoice).toBeVisible({ timeout: 10_000 });
      await firstChoice.click();
      await page.waitForTimeout(200);
    }

    await expect(page.locator("[data-debrief]")).toBeVisible({
      timeout: 20_000,
    });
    await page.getByRole("button", { name: /قرارات التشغيل/ }).click();
    await expect(
      page.getByRole("heading", { name: /بصمة الغراب/ }),
    ).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/اقتراح سلالة/)).toBeVisible();
    await expect(page.getByText(/سجل الرحلة/)).toBeVisible();
  });

  test("reduced-motion still exposes meaning", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await bootstrapSession(page);
    await page.goto("/missions/black-signal");
    await expect(
      page.getByRole("heading", { name: /الإشارة السوداء/ }),
    ).toBeVisible();
    await expect(page.getByText(/إشارات الأدلة/)).toBeVisible();
  });
});
