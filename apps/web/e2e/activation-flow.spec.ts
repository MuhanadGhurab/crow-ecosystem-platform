import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe.configure({ timeout: 90_000 });

async function bootstrap(page: import("@playwright/test").Page) {
  await page.goto("/activation/email-pending");
  const create = page.getByRole("button", {
    name: /جلسة|Create local synthetic session/i,
  });
  if (await create.isVisible()) {
    await create.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator('[data-screen-id="ACT-003"]')).toBeVisible({
      timeout: 15_000,
    });
  }
  await expect(
    page.getByRole("button", { name: /طلب رسالة|Request verification/i }),
  ).toBeVisible({ timeout: 15_000 });
}

test("keyboard activation flow to onboarding entry", async ({ page }) => {
  await bootstrap(page);

  await page
    .getByRole("button", { name: /طلب رسالة|Request verification/i })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText(/قُبلت|Delivery accepted/i)).toBeVisible({
    timeout: 15_000,
  });

  const mailbox = await page.request.get("/api/local/mock-mailbox");
  expect(mailbox.ok()).toBeTruthy();
  const box = (await mailbox.json()) as {
    messages: Array<{ token?: string }>;
  };
  const token = box.messages.find((m) => m.token)?.token;
  expect(token).toBeTruthy();

  await page.goto("/activation/email-result");
  await page.getByLabel(/رمز التحقق|Verification token/i).fill(token!);
  await page.getByRole("button", { name: /تأكيد|Confirm/i }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText(/تم التحقق|Verified/i)).toBeVisible({
    timeout: 15_000,
  });
  await expect(
    page.locator('li[data-done="true"]').filter({ hasText: /البريد|Email/i }),
  ).toBeVisible();

  await page.goto("/activation/terms");
  await page.getByLabel(/أقر|deliberately accept the displayed terms/i).check();
  const acceptTerms = page.getByRole("button", {
    name: /قبول الشروط|Accept terms/i,
  });
  await expect(acceptTerms).toBeEnabled();
  await acceptTerms.click();
  await expect(
    page.locator('li[data-done="true"]').filter({ hasText: /الشروط|Terms/i }),
  ).toBeVisible({ timeout: 15_000 });

  await page.goto("/activation/account-risk");
  await page
    .getByLabel(/أقبل إفصاح|deliberately accept the displayed account-risk/i)
    .check();
  const acceptRisk = page.getByRole("button", {
    name: /قبول إفصاح|Accept risk/i,
  });
  await expect(acceptRisk).toBeEnabled();
  await acceptRisk.click();
  await expect(page).toHaveURL(/activation\/complete/, { timeout: 20_000 });

  await page.goto("/activation/mobile-optional");
  await expect(
    page.getByRole("heading", { name: /اختياري|optional/i }),
  ).toBeVisible();
  await page.goto("/onboarding/entry");
  await expect(page.locator('[data-screen-id="ONB-001"]')).toBeVisible();
});

test("route guard blocks terms before email verification", async ({ page }) => {
  await bootstrap(page);
  await page.goto("/activation/terms");
  await expect(page).toHaveURL(/email-pending/, { timeout: 15_000 });
  await expect(page.locator('[data-screen-id="ACT-003"]')).toBeVisible();
});

test("axe critical/serious violations are zero on activation screens", async ({
  page,
}) => {
  await bootstrap(page);
  for (const path of [
    "/activation/email-pending",
    "/activation/email-result",
    "/activation/terms",
    "/activation/account-risk",
    "/activation/recovery",
    "/activation/complete",
    "/activation/mobile-optional",
    "/onboarding/entry",
  ]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const blocking = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );
    expect(blocking, `axe failures on ${path}`).toEqual([]);
  }
});
