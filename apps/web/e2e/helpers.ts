/**
 * Browser helpers for GHV.IMPLEMENTATION.0C-CLOSURE-01.
 * Mouse/touch helpers are forbidden for user-facing activation actions.
 */
import { expect, type Page, type APIRequestContext } from "@playwright/test";

export async function bootstrapSession(page: Page) {
  await page.goto("/activation/email-pending");
  const create = page.getByRole("button", {
    name: /جلسة|Create local synthetic session/i,
  });
  if (await create.isVisible()) {
    await create.focus();
    await page.keyboard.press("Enter");
  }
  await expect(
    page.getByRole("button", { name: /طلب رسالة|Request verification/i }),
  ).toBeVisible({ timeout: 20_000 });
}

export async function keyboardActivateButton(page: Page, name: RegExp) {
  const btn = page.getByRole("button", { name });
  await expect(btn).toBeEnabled({ timeout: 15_000 });
  await btn.focus();
  await page.keyboard.press("Enter");
}

export async function keyboardCheckCheckbox(page: Page, label: RegExp) {
  const box = page.getByLabel(label);
  await box.focus();
  await page.keyboard.press("Space");
  await expect(box).toBeChecked();
}

export async function requestVerification(page: Page) {
  await keyboardActivateButton(page, /طلب رسالة|Request verification/i);
  await expect(page.getByText(/قُبلت|Delivery accepted/i)).toBeVisible({
    timeout: 15_000,
  });
}

export async function mailboxMessageCount(
  request: APIRequestContext,
): Promise<number> {
  const mailbox = await request.get("/api/local/mock-mailbox");
  expect(mailbox.ok()).toBeTruthy();
  const box = (await mailbox.json()) as { messages: unknown[] };
  return box.messages.length;
}

export async function latestMailboxToken(
  request: APIRequestContext,
): Promise<string> {
  const mailbox = await request.get("/api/local/mock-mailbox");
  expect(mailbox.ok()).toBeTruthy();
  const box = (await mailbox.json()) as {
    messages: Array<{ token?: string }>;
  };
  const withToken = box.messages.filter((m) => m.token);
  const token = withToken[withToken.length - 1]?.token;
  expect(token).toBeTruthy();
  return token!;
}

export async function confirmEmail(page: Page, token: string) {
  await page.goto("/activation/email-result");
  await page.getByLabel(/رمز التحقق|Verification token/i).fill(token);
  await keyboardActivateButton(page, /تأكيد|Confirm/i);
  await expect(page.locator('[data-major-state="verified"]')).toBeVisible({
    timeout: 15_000,
  });
}

export async function acceptTermsKeyboard(page: Page) {
  await page.goto("/activation/terms");
  await keyboardCheckCheckbox(
    page,
    /أقر|deliberately accept the displayed terms/i,
  );
  await keyboardActivateButton(page, /قبول الشروط|Accept terms/i);
  await expect(
    page.locator('li[data-done="true"]').filter({ hasText: /الشروط|Terms/i }),
  ).toBeVisible({ timeout: 15_000 });
}

export async function acceptRiskAndActivateKeyboard(page: Page) {
  await page.goto("/activation/account-risk");
  await keyboardCheckCheckbox(
    page,
    /أقبل عمداً|deliberately accept the displayed account-risk/i,
  );
  await keyboardActivateButton(page, /قبول إفصاح|Accept risk/i);
  await expect(page).toHaveURL(/activation\/complete/, { timeout: 20_000 });
}

export async function testControl(
  request: APIRequestContext,
  action: string,
  extra: Record<string, string> = {},
) {
  const res = await request.post("/api/local/test-controls", {
    data: { action, ...extra },
  });
  expect(res.ok(), await res.text()).toBeTruthy();
  return res.json();
}

export async function assertServerRedirectAwayFrom(
  page: Page,
  blockedPath: string,
  landingPattern: RegExp,
) {
  const response = await page.goto(blockedPath, {
    waitUntil: "domcontentloaded",
  });
  // Server redirect should complete before protected content is served.
  expect(response).toBeTruthy();
  await expect(page).toHaveURL(landingPattern, { timeout: 15_000 });
  expect(new URL(page.url()).pathname).not.toBe(blockedPath);

  const blockedId = blockedPath.includes("terms")
    ? "ACT-005"
    : blockedPath.includes("account-risk")
      ? "ACT-013"
      : blockedPath.includes("complete")
        ? "ACT-006"
        : blockedPath.includes("mobile-optional")
          ? "ACT-007"
          : blockedPath.includes("onboarding/entry")
            ? "ONB-001"
            : blockedPath.includes("onboarding/origin")
              ? "ONB-002"
              : blockedPath.includes("onboarding/nest-intro")
                ? "ONB-003"
                : blockedPath.includes("onboarding/crow")
                  ? "IDN-001"
                  : blockedPath.includes("onboarding/habitat")
                    ? "IDN-002"
                    : blockedPath.includes("onboarding/character")
                      ? "IDN-003"
                      : blockedPath.includes("recovery")
                        ? "ACT-012"
                        : "";
  if (blockedId) {
    await expect(page.locator(`[data-screen-id="${blockedId}"]`)).toHaveCount(
      0,
    );
  }
  const landed = new URL(page.url()).pathname;
  // Entry screens may offer synthetic bootstrap; protected landings must not.
  if (
    landed !== "/activation/email-pending" &&
    landed !== "/activation/email-result"
  ) {
    await expect(
      page.getByRole("button", {
        name: /جلسة|Create local synthetic session/i,
      }),
    ).toHaveCount(0);
  }
}

export type IdempotencyEvidence = {
  testingOnly: true;
  aggregateVersion: number;
  auditCount: number;
  outboxCount: number;
  receiptCount: number;
  mockDeliveryCount: number;
  receipts: Array<{
    commandType: string;
    responseStatus: string;
    resultRef: string | null;
    correlationId: string;
  }>;
};

export async function idempotencyEvidence(
  request: APIRequestContext,
  idempotencyKey?: string,
): Promise<IdempotencyEvidence> {
  const data = await testControl(
    request,
    "idempotency-evidence",
    idempotencyKey ? { idempotencyKey } : {},
  );
  return data as IdempotencyEvidence;
}

/** Local/test ActivationClient command hook (enabled via /api/health runtime). */
export async function e2eCommand(
  page: Page,
  name: string,
  body: Record<string, unknown> = {},
  options: {
    fingerprint?: string;
    newLogicalOp?: boolean;
    forceIdempotencyKey?: string;
  } = {},
): Promise<{
  idempotencyResult?: "applied" | "replayed";
  aggregateVersion?: number;
  correlationId?: string;
  resource?: { version: number; state: string };
}> {
  await page.waitForFunction(
    () =>
      typeof (window as Window & { __GHURAVIA_E2E_COMMAND__?: unknown })
        .__GHURAVIA_E2E_COMMAND__ === "function",
    undefined,
    { timeout: 20_000 },
  );
  const result = await page.evaluate(
    async ({ name: cmd, body: b, options: o }) => {
      const w = window as unknown as {
        __GHURAVIA_E2E_COMMAND__: (
          n: string,
          body?: Record<string, unknown>,
          options?: {
            fingerprint?: string;
            newLogicalOp?: boolean;
            forceIdempotencyKey?: string;
          },
        ) => Promise<{
          idempotencyResult?: "applied" | "replayed";
          aggregateVersion?: number;
          correlationId?: string;
          resource?: { version: number; state: string };
        }>;
      };
      return w.__GHURAVIA_E2E_COMMAND__(cmd, b, o);
    },
    { name, body, options },
  );
  return result;
}

export async function e2eCommandExpectError(
  page: Page,
  name: string,
  body: Record<string, unknown>,
  options: {
    fingerprint?: string;
    newLogicalOp?: boolean;
    forceIdempotencyKey?: string;
  },
): Promise<{ category?: string; correlationId?: string }> {
  await page.waitForFunction(
    () =>
      typeof (window as Window & { __GHURAVIA_E2E_COMMAND__?: unknown })
        .__GHURAVIA_E2E_COMMAND__ === "function",
    undefined,
    { timeout: 20_000 },
  );
  return page.evaluate(
    async ({ name: cmd, body: b, options: o }) => {
      const w = window as unknown as {
        __GHURAVIA_E2E_COMMAND__: (
          n: string,
          body?: Record<string, unknown>,
          options?: {
            fingerprint?: string;
            newLogicalOp?: boolean;
            forceIdempotencyKey?: string;
          },
        ) => Promise<unknown>;
      };
      try {
        await w.__GHURAVIA_E2E_COMMAND__(cmd, b, o);
        return { category: "UNEXPECTED_SUCCESS" };
      } catch (e) {
        const err = e as { category?: string; correlationId?: string };
        return {
          category: err.category,
          correlationId: err.correlationId,
        };
      }
    },
    { name, body, options },
  );
}

/** Drive activation through ONB-001 readiness using keyboard-only actions. */
export async function activateAccountKeyboard(page: Page) {
  await bootstrapSession(page);
  await requestVerification(page);
  await confirmEmail(page, await latestMailboxToken(page.request));
  await acceptTermsKeyboard(page);
  await acceptRiskAndActivateKeyboard(page);
  await page.goto("/onboarding/entry");
  await expect(page.locator('[data-screen-id="ONB-001"]')).toBeVisible({
    timeout: 20_000,
  });
}

/** Local/test useOnboarding command hook. */
export async function e2eOnboardingCommand(
  page: Page,
  name: string,
  body: Record<string, unknown> = {},
  options: {
    fingerprint?: string;
    newLogicalOp?: boolean;
    forceIdempotencyKey?: string;
    forceExpectedVersion?: number;
  } = {},
): Promise<{
  idempotencyResult?: "applied" | "replayed";
  aggregateVersion?: number;
  correlationId?: string;
  resource?: { version: number; state: string; accessibleScreens?: string[] };
}> {
  await page.waitForFunction(
    () =>
      typeof (
        window as Window & { __GHURAVIA_E2E_ONBOARDING_COMMAND__?: unknown }
      ).__GHURAVIA_E2E_ONBOARDING_COMMAND__ === "function",
    undefined,
    { timeout: 20_000 },
  );
  return page.evaluate(
    async ({ name: cmd, body: b, options: o }) => {
      const w = window as unknown as {
        __GHURAVIA_E2E_ONBOARDING_COMMAND__: (
          n: string,
          body?: Record<string, unknown>,
          options?: {
            fingerprint?: string;
            newLogicalOp?: boolean;
            forceIdempotencyKey?: string;
            forceExpectedVersion?: number;
          },
        ) => Promise<{
          idempotencyResult?: "applied" | "replayed";
          aggregateVersion?: number;
          correlationId?: string;
          resource?: {
            version: number;
            state: string;
            accessibleScreens?: string[];
          };
        }>;
      };
      return w.__GHURAVIA_E2E_ONBOARDING_COMMAND__(cmd, b, o);
    },
    { name, body, options },
  );
}

export async function e2eOnboardingCommandExpectError(
  page: Page,
  name: string,
  body: Record<string, unknown>,
  options: {
    fingerprint?: string;
    newLogicalOp?: boolean;
    forceIdempotencyKey?: string;
    forceExpectedVersion?: number;
  } = {},
): Promise<{ category?: string; correlationId?: string }> {
  await page.waitForFunction(
    () =>
      typeof (
        window as Window & { __GHURAVIA_E2E_ONBOARDING_COMMAND__?: unknown }
      ).__GHURAVIA_E2E_ONBOARDING_COMMAND__ === "function",
    undefined,
    { timeout: 20_000 },
  );
  return page.evaluate(
    async ({ name: cmd, body: b, options: o }) => {
      const w = window as unknown as {
        __GHURAVIA_E2E_ONBOARDING_COMMAND__: (
          n: string,
          body?: Record<string, unknown>,
          options?: {
            fingerprint?: string;
            newLogicalOp?: boolean;
            forceIdempotencyKey?: string;
            forceExpectedVersion?: number;
          },
        ) => Promise<unknown>;
      };
      try {
        await w.__GHURAVIA_E2E_ONBOARDING_COMMAND__(cmd, b, o);
        return { category: "UNEXPECTED_SUCCESS" };
      } catch (e) {
        const err = e as { category?: string; correlationId?: string };
        return {
          category: err.category,
          correlationId: err.correlationId,
        };
      }
    },
    { name, body, options },
  );
}

export async function keyboardSelectRadio(page: Page, label: RegExp) {
  const radio = page.getByLabel(label).first();
  await radio.focus();
  await page.keyboard.press("Space");
  await expect(radio).toBeChecked();
}
