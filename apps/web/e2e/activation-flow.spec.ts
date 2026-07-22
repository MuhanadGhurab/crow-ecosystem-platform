import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  acceptRiskAndActivateKeyboard,
  acceptTermsKeyboard,
  assertServerRedirectAwayFrom,
  bootstrapSession,
  confirmEmail,
  e2eCommand,
  e2eCommandExpectError,
  idempotencyEvidence,
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
    if (!(await checkbox.isChecked())) {
      await checkbox.focus();
      await page.keyboard.press("Space");
    }
    await keyboardActivateButton(page, /قبول الشروط|Accept terms/i);
    await expect(
      page.locator('li[data-done="true"]').filter({ hasText: /الشروط|Terms/i }),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("identical logical command replay", async ({ page }) => {
    const fixedKey = "e2e-er-replay-request-email-v1";
    await bootstrapSession(page);
    const first = await e2eCommand(
      page,
      "request-email",
      {},
      {
        fingerprint: "request-email:replay-fixed",
        forceIdempotencyKey: fixedKey,
      },
    );
    expect(first.idempotencyResult).toBe("applied");
    await expect(page.locator('[data-major-state="pending"]')).toContainText(
      /EMAIL_VERIFICATION_PENDING/,
    );
    const afterFirst = await idempotencyEvidence(page.request, fixedKey);
    expect(afterFirst.receiptCount).toBe(1);
    expect(afterFirst.mockDeliveryCount).toBeGreaterThanOrEqual(1);
    const versionAfterFirst = afterFirst.aggregateVersion;
    const auditAfterFirst = afterFirst.auditCount;
    const outboxAfterFirst = afterFirst.outboxCount;
    const deliveryAfterFirst = afterFirst.mockDeliveryCount;

    const replay = await e2eCommand(
      page,
      "request-email",
      {},
      {
        fingerprint: "request-email:replay-fixed",
        forceIdempotencyKey: fixedKey,
      },
    );
    expect(replay.idempotencyResult).toBe("replayed");
    expect(replay.aggregateVersion).toBe(versionAfterFirst);

    const afterReplay = await idempotencyEvidence(page.request, fixedKey);
    expect(afterReplay.aggregateVersion).toBe(versionAfterFirst);
    expect(afterReplay.auditCount).toBe(auditAfterFirst);
    expect(afterReplay.outboxCount).toBe(outboxAfterFirst);
    expect(afterReplay.mockDeliveryCount).toBe(deliveryAfterFirst);
    expect(afterReplay.receiptCount).toBe(1);

    await expect(page.locator("#error-summary")).toHaveCount(0);
    await expect(page.locator('[data-major-state="pending"]')).toContainText(
      /EMAIL_VERIFICATION_PENDING/,
    );
    await expect(page.locator("body")).not.toContainText(
      /token_hash|issuedToken/i,
    );
  });

  test("same idempotency key with different payload", async ({ page }) => {
    const fixedKey = "e2e-er-idempotency-conflict-v1";
    await bootstrapSession(page);
    const first = await e2eCommand(
      page,
      "request-email",
      {},
      {
        fingerprint: "request-email:conflict-a",
        forceIdempotencyKey: fixedKey,
      },
    );
    expect(first.idempotencyResult).toBe("applied");
    const before = await idempotencyEvidence(page.request, fixedKey);

    const err = await e2eCommandExpectError(
      page,
      "request-email",
      { reason: "different-payload-fingerprint" },
      {
        fingerprint: "request-email:conflict-b",
        forceIdempotencyKey: fixedKey,
      },
    );
    expect(err.category).toBe("IDEMPOTENCY_CONFLICT");

    await expect(page.locator("#error-summary")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator("#error-summary")).toContainText(
      /تعارض في إعادة الإرسال|Idempotency conflict/i,
    );
    await expect
      .poll(async () =>
        page
          .locator("#error-summary")
          .evaluate((el) => el === document.activeElement),
      )
      .toBe(true);
    const corr = page.locator("#error-summary .tech");
    await expect(corr).toBeVisible();
    await expect(corr).toHaveAttribute("dir", "ltr");

    const after = await idempotencyEvidence(page.request, fixedKey);
    expect(after.aggregateVersion).toBe(before.aggregateVersion);
    expect(after.auditCount).toBe(before.auditCount);
    expect(after.outboxCount).toBe(before.outboxCount);
    expect(after.mockDeliveryCount).toBe(before.mockDeliveryCount);
    expect(after.receiptCount).toBe(1);

    await expect(page.locator("#error-summary")).toBeVisible();
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
    const beforeResend = await mailboxMessageCount(page.request);
    await keyboardActivateButton(page, /إعادة إرسال|Resend/i);
    await expect
      .poll(async () => mailboxMessageCount(page.request), { timeout: 15_000 })
      .toBeGreaterThan(beforeResend);
    await expect(page.getByText(/قُبلت|Delivery accepted/i)).toBeVisible({
      timeout: 15_000,
    });
    await confirmEmail(page, await latestMailboxToken(page.request));
    await axeOk(page, "ACT-011 verified");

    await page.goto("/activation/terms");
    await expect(page.locator('[data-screen-id="ACT-005"]')).toBeVisible();
    await expect(
      page.locator('[data-major-state="terms-ready"]'),
    ).toBeVisible();
    await axeOk(page, "ACT-005 ready");

    await keyboardActivateButton(page, /قبول الشروط|Accept terms/i);
    await expect(
      page.locator('[data-major-state="terms-validation-error"]'),
    ).toBeVisible();
    await axeOk(page, "ACT-005 validation error");

    // ACT-013 locked representation — user-visible governed denial (ACT-005
    // prerequisite lock), not unauthorized ACT-013 content.
    await assertServerRedirectAwayFrom(
      page,
      "/activation/account-risk",
      /terms/,
    );
    await expect(page.locator('[data-screen-id="ACT-005"]')).toBeVisible();
    await expect(page.locator(".locks .tech")).toContainText(
      "TERMS_NOT_ACCEPTED",
    );
    await expect(page.locator('[data-screen-id="ACT-013"]')).toHaveCount(0);
    await axeOk(page, "ACT-013 locked representation");

    await acceptTermsKeyboard(page);
    await page.goto("/activation/account-risk");
    await expect(page.locator('[data-screen-id="ACT-013"]')).toBeVisible();
    await axeOk(page, "ACT-013 ready");

    await e2eCommand(page, "recover", {}, { newLogicalOp: true });
    await page.goto("/activation/recovery");
    await expect(page.locator('[data-screen-id="ACT-012"]')).toBeVisible();
    await expect(page.locator('[data-major-state="recovery"]')).toBeVisible();
    await axeOk(page, "ACT-012 recovery available");
  });

  test("completion handoff and error accessibility states", async ({
    page,
  }) => {
    await bootstrapSession(page);
    await requestVerification(page);
    await confirmEmail(page, await latestMailboxToken(page.request));
    await acceptTermsKeyboard(page);
    await acceptRiskAndActivateKeyboard(page);
    await expect(page.locator('[data-screen-id="ACT-006"]')).toBeVisible();
    await axeOk(page, "ACT-006 complete");

    await page.goto("/activation/mobile-optional");
    await axeOk(page, "ACT-007 optional");

    await page.goto("/onboarding/entry");
    await axeOk(page, "ONB-001 handoff");
  });

  test("session-expired safe state", async ({ page }) => {
    await bootstrapSession(page);
    await requestVerification(page);
    await confirmEmail(page, await latestMailboxToken(page.request));
    await testControl(page.request, "session-expire");
    await assertServerRedirectAwayFrom(
      page,
      "/activation/terms",
      /email-pending/,
    );
    await expect(page.locator('[data-screen-id="ACT-003"]')).toBeVisible();
    await expect(page.locator('[data-screen-id="ACT-005"]')).toHaveCount(0);
    await axeOk(page, "session-expired safe state");
  });

  test("provider-failure error state", async ({ page }) => {
    await bootstrapSession(page);
    await testControl(page.request, "provider-mode", { mode: "failure" });
    await keyboardActivateButton(page, /طلب رسالة|Request verification/i);
    await expect(page.locator("#error-summary")).toBeVisible({
      timeout: 15_000,
    });
    await axeOk(page, "provider-failure error state");
    await testControl(page.request, "provider-mode-reset");
  });

  test("stale-conflict error state", async ({ page }) => {
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
    await keyboardActivateButton(page, /قبول الشروط|Accept terms/i);
    await expect(page.locator("#error-summary")).toBeVisible({
      timeout: 15_000,
    });
    await axeOk(page, "stale-conflict error state");
  });
});
