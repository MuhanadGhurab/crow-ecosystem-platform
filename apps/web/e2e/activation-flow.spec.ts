import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  acceptRiskAndActivateKeyboard,
  acceptTermsKeyboard,
  assertServerRedirectAwayFrom,
  bootstrapSession,
  confirmEmail,
  keyboardActivateButton,
  latestMailboxToken,
  mailboxMessageCount,
  requestVerification,
  testControl,
} from "./helpers";

test.describe.configure({ timeout: 120_000 });

test.describe("mandatory keyboard-only activation flow", () => {
  test("complete flow uses keyboard for all user actions", async ({ page }) => {
    await bootstrapSession(page);
    await requestVerification(page);
    const token = await latestMailboxToken(page.request);
    await confirmEmail(page, token);
    await acceptTermsKeyboard(page);
    await acceptRiskAndActivateKeyboard(page);
    await page.goto("/activation/mobile-optional");
    await expect(page.locator('[data-screen-id="ACT-007"]')).toBeVisible();
    await page.goto("/onboarding/entry");
    await expect(page.locator('[data-screen-id="ONB-001"]')).toBeVisible();
  });
});

test.describe("server-authoritative route guards", () => {
  test("ACT-005 before email verification", async ({ page }) => {
    await bootstrapSession(page);
    await assertServerRedirectAwayFrom(
      page,
      "/activation/terms",
      /email-pending/,
    );
    await expect(page.locator('[data-screen-id="ACT-003"]')).toBeVisible();
  });

  test("ACT-013 before terms acceptance", async ({ page }) => {
    await bootstrapSession(page);
    await requestVerification(page);
    await confirmEmail(page, await latestMailboxToken(page.request));
    await assertServerRedirectAwayFrom(
      page,
      "/activation/account-risk",
      /terms/,
    );
  });

  test("ACT-006 before activation", async ({ page }) => {
    await bootstrapSession(page);
    await assertServerRedirectAwayFrom(
      page,
      "/activation/complete",
      /email-pending|terms|account-risk/,
    );
  });

  test("ACT-007 before activation", async ({ page }) => {
    await bootstrapSession(page);
    await assertServerRedirectAwayFrom(
      page,
      "/activation/mobile-optional",
      /email-pending|terms|account-risk/,
    );
  });

  test("ONB-001 before activation", async ({ page }) => {
    await bootstrapSession(page);
    await assertServerRedirectAwayFrom(
      page,
      "/onboarding/entry",
      /email-pending|terms|account-risk/,
    );
    await expect(
      page.getByRole("button", {
        name: /جلسة|Create local synthetic session/i,
      }),
    ).toHaveCount(0);
  });

  test("ACT-012 without recoverable condition", async ({ page }) => {
    await bootstrapSession(page);
    await assertServerRedirectAwayFrom(
      page,
      "/activation/recovery",
      /email-pending/,
    );
  });

  test("activated account may open ACT-006 ACT-007 ONB-001", async ({
    page,
  }) => {
    await bootstrapSession(page);
    await requestVerification(page);
    await confirmEmail(page, await latestMailboxToken(page.request));
    await acceptTermsKeyboard(page);
    await acceptRiskAndActivateKeyboard(page);
    await page.goto("/activation/complete");
    await expect(page.locator('[data-screen-id="ACT-006"]')).toBeVisible();
    await page.goto("/activation/mobile-optional");
    await expect(page.locator('[data-screen-id="ACT-007"]')).toBeVisible();
    await page.goto("/onboarding/entry");
    await expect(page.locator('[data-screen-id="ONB-001"]')).toBeVisible();
  });
});

test.describe("refresh and resume", () => {
  test("after verification requested", async ({ page }) => {
    await bootstrapSession(page);
    await requestVerification(page);
    await page.reload();
    await expect(page.locator('[data-screen-id="ACT-003"]')).toBeVisible();
    await expect(
      page.getByRole("button", { name: /طلب رسالة|Request verification/i }),
    ).toBeVisible();
  });

  test("after email verified", async ({ page }) => {
    await bootstrapSession(page);
    await requestVerification(page);
    await confirmEmail(page, await latestMailboxToken(page.request));
    await page.reload();
    await expect(
      page.locator('li[data-done="true"]').filter({ hasText: /البريد|Email/i }),
    ).toBeVisible();
    await page.goto("/activation/terms");
    await expect(page.locator('[data-screen-id="ACT-005"]')).toBeVisible();
  });

  test("after terms accepted", async ({ page }) => {
    await bootstrapSession(page);
    await requestVerification(page);
    await confirmEmail(page, await latestMailboxToken(page.request));
    await acceptTermsKeyboard(page);
    await page.reload();
    await expect(
      page.locator('li[data-done="true"]').filter({ hasText: /الشروط|Terms/i }),
    ).toBeVisible();
    await assertServerRedirectAwayFrom(
      page,
      "/onboarding/entry",
      /account-risk|complete/,
    );
  });

  test("after activation complete", async ({ page }) => {
    await bootstrapSession(page);
    await requestVerification(page);
    await confirmEmail(page, await latestMailboxToken(page.request));
    await acceptTermsKeyboard(page);
    await acceptRiskAndActivateKeyboard(page);
    await page.reload();
    await expect(page.locator('[data-screen-id="ACT-006"]')).toBeVisible();
    await page.goto("/onboarding/entry");
    await expect(page.locator('[data-screen-id="ONB-001"]')).toBeVisible();
  });
});

test.describe("error and recovery", () => {
  test("provider failure", async ({ page }) => {
    await bootstrapSession(page);
    await testControl(page.request, "provider-mode", { mode: "failure" });
    await keyboardActivateButton(page, /طلب رسالة|Request verification/i);
    await expect(page.locator("#error-summary")).toBeVisible({
      timeout: 15_000,
    });
    await testControl(page.request, "provider-mode-reset");
  });

  test("provider timeout", async ({ page }) => {
    await bootstrapSession(page);
    await testControl(page.request, "provider-mode", { mode: "timeout" });
    await keyboardActivateButton(page, /طلب رسالة|Request verification/i);
    await expect(page.locator("#error-summary")).toBeVisible({
      timeout: 15_000,
    });
    await testControl(page.request, "provider-mode-reset");
  });

  test("expired challenge", async ({ page }) => {
    await bootstrapSession(page);
    await requestVerification(page);
    const token = await latestMailboxToken(page.request);
    await testControl(page.request, "challenge-expire");
    await page.goto("/activation/email-result");
    await page.getByLabel(/رمز التحقق|Verification token/i).fill(token);
    await keyboardActivateButton(page, /تأكيد|Confirm/i);
    await expect(page.locator("#error-summary")).toBeVisible({
      timeout: 15_000,
    });
  });

  test("superseded challenge", async ({ page }) => {
    await bootstrapSession(page);
    await requestVerification(page);
    const oldToken = await latestMailboxToken(page.request);
    const beforeCount = await mailboxMessageCount(page.request);
    await keyboardActivateButton(page, /إعادة إرسال|Resend/i);
    await expect
      .poll(async () => mailboxMessageCount(page.request), { timeout: 15_000 })
      .toBeGreaterThan(beforeCount);
    await expect(page.getByText(/قُبلت|Delivery accepted/i)).toBeVisible({
      timeout: 15_000,
    });
    const newToken = await latestMailboxToken(page.request);
    expect(newToken).not.toEqual(oldToken);
    await page.goto("/activation/email-result");
    await page.getByLabel(/رمز التحقق|Verification token/i).fill(oldToken);
    await keyboardActivateButton(page, /تأكيد|Confirm/i);
    await expect(page.locator("#error-summary")).toBeVisible({
      timeout: 15_000,
    });
    await page.getByLabel(/رمز التحقق|Verification token/i).fill(newToken);
    await keyboardActivateButton(page, /تأكيد|Confirm/i);
    await expect(page.locator('[data-major-state="verified"]')).toBeVisible({
      timeout: 15_000,
    });
  });

  test("stale version requires explicit resubmission", async ({ page }) => {
    await bootstrapSession(page);
    await requestVerification(page);
    await confirmEmail(page, await latestMailboxToken(page.request));
    await page.goto("/activation/terms");
    await testControl(page.request, "aggregate-version-bump");
    const checkbox = page.getByLabel(
      /أقر|deliberately accept the displayed terms/i,
    );
    await checkbox.focus();
    await page.keyboard.press("Space");
    await expect(checkbox).toBeChecked();
    await keyboardActivateButton(page, /قبول الشروط|Accept terms/i);
    await expect(page.locator("#error-summary")).toBeVisible({
      timeout: 15_000,
    });
    // Explicit resubmission against refreshed version (new logical key).
    if (!(await checkbox.isChecked())) {
      await checkbox.focus();
      await page.keyboard.press("Space");
    }
    await keyboardActivateButton(page, /قبول الشروط|Accept terms/i);
    await expect(
      page.locator('li[data-done="true"]').filter({ hasText: /الشروط|Terms/i }),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("session expiry clears private route access", async ({ page }) => {
    await bootstrapSession(page);
    await requestVerification(page);
    await confirmEmail(page, await latestMailboxToken(page.request));
    await testControl(page.request, "session-expire");
    await assertServerRedirectAwayFrom(
      page,
      "/activation/terms",
      /email-pending/,
    );
  });
});

test.describe("actual-state accessibility scans", () => {
  async function axeOk(page: import("@playwright/test").Page, label: string) {
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const blocking = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );
    expect(blocking, `axe failures: ${label}`).toEqual([]);
  }

  test("authorized and major states", async ({ page }) => {
    await bootstrapSession(page);
    await expect(page.locator('[data-screen-id="ACT-003"]')).toBeVisible();
    await axeOk(page, "ACT-003 pending");

    await requestVerification(page);
    await axeOk(page, "ACT-003 delivery");

    await page.goto("/activation/email-result");
    await page.getByLabel(/رمز التحقق|Verification token/i).fill("invalid");
    await keyboardActivateButton(page, /تأكيد|Confirm/i);
    await expect(page.locator("#error-summary")).toBeVisible({
      timeout: 15_000,
    });
    await axeOk(page, "ACT-011 invalid");

    // Still EMAIL_VERIFICATION_PENDING — reuse outstanding challenge then expire it.
    const token = await latestMailboxToken(page.request);
    await testControl(page.request, "challenge-expire");
    await page.goto("/activation/email-result");
    await page.getByLabel(/رمز التحقق|Verification token/i).fill(token);
    await keyboardActivateButton(page, /تأكيد|Confirm/i);
    await expect(page.locator("#error-summary")).toBeVisible({
      timeout: 15_000,
    });
    await axeOk(page, "ACT-011 expired");

    await page.goto("/activation/email-pending");
    await keyboardActivateButton(page, /إعادة إرسال|Resend/i);
    await expect(page.getByText(/قُبلت|Delivery accepted/i)).toBeVisible({
      timeout: 15_000,
    });
    await confirmEmail(page, await latestMailboxToken(page.request));
    await axeOk(page, "ACT-011 verified");

    await page.goto("/activation/terms");
    await expect(page.locator('[data-screen-id="ACT-005"]')).toBeVisible();
    await axeOk(page, "ACT-005 ready");

    await acceptTermsKeyboard(page);
    await page.goto("/activation/account-risk");
    await axeOk(page, "ACT-013 ready");

    await acceptRiskAndActivateKeyboard(page);
    await axeOk(page, "ACT-006 complete");

    await page.goto("/activation/mobile-optional");
    await axeOk(page, "ACT-007 optional");

    await page.goto("/onboarding/entry");
    await axeOk(page, "ONB-001 handoff");
  });
});
