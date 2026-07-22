import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  activateAccountKeyboard,
  assertServerRedirectAwayFrom,
  e2eOnboardingCommand,
  e2eOnboardingCommandExpectError,
  keyboardActivateButton,
  keyboardCheckCheckbox,
  keyboardSelectRadio,
  testControl,
} from "./helpers";

test.describe.configure({ timeout: 180_000 });

async function axeOk(page: import("@playwright/test").Page, label: string) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  const blocking = results.violations.filter((v) =>
    ["critical", "serious"].includes(v.impact ?? ""),
  );
  expect(blocking, label).toEqual([]);
}

async function guidedThroughCharacter(page: import("@playwright/test").Page) {
  await activateAccountKeyboard(page);
  await keyboardActivateButton(
    page,
    /بدء التخصيص الموجَّه|Start guided personalization/i,
  );
  await expect(page).toHaveURL(/onboarding\/crow/, { timeout: 20_000 });

  await keyboardSelectRadio(page, /غراب كلاسيكي|Classic Crow/i);
  await keyboardSelectRadio(page, /حبر رملي|Ink sand/i);
  await keyboardSelectRadio(page, /هادئ|Calm/i);
  await keyboardCheckCheckbox(
    page,
    /أقرّ بأنني قد أعدّل التباين|I acknowledge I may adjust contrast/i,
  );
  await keyboardActivateButton(
    page,
    /المتابعة إلى الموطن|Continue to habitat/i,
  );
  await expect(page).toHaveURL(/onboarding\/habitat/, { timeout: 20_000 });

  await keyboardSelectRadio(page, /رف ساحلي|Coastal shelf/i);
  await keyboardActivateButton(
    page,
    /المتابعة إلى الشخصية|Continue to character/i,
  );
  await expect(page).toHaveURL(/onboarding\/character/, { timeout: 20_000 });

  await keyboardSelectRadio(page, /كشّاف فضولي|Curious scout/i);
  await keyboardActivateButton(
    page,
    /المتابعة إلى المراجعة|Continue to review/i,
  );
  await expect(page).toHaveURL(/onboarding\/crow/, { timeout: 20_000 });
}

async function saveReviewToOrigin(page: import("@playwright/test").Page) {
  await keyboardCheckCheckbox(
    page,
    /أفهم معاينة الخصوصية|I understand this privacy preview/i,
  );
  await keyboardActivateButton(
    page,
    /حفظ المراجعة والمتابعة إلى الأصل|Save review and continue to Origin/i,
  );
  await expect(page).toHaveURL(/onboarding\/origin/, { timeout: 20_000 });
}

test.describe("mandatory keyboard-only onboarding flow", () => {
  test("guided keyboard personalization to nest handoff", async ({ page }) => {
    await guidedThroughCharacter(page);
    await saveReviewToOrigin(page);
    await keyboardSelectRadio(page, /الخليج|Gulf/i);
    await keyboardSelectRadio(page, /أستكشف|Exploring/i);
    await keyboardCheckCheckbox(page, /تعزيز الأسس|Strengthen foundations/i);
    await keyboardActivateButton(
      page,
      /إكمال الأصل والمتابعة إلى مقدّمة العش|Complete Origin and continue to Nest intro/i,
    );
    await expect(page).toHaveURL(/onboarding\/nest-intro/, { timeout: 20_000 });
    await expect(page.locator('[data-major-state="handoff"]')).toBeVisible();
    await expect(
      page.getByRole("button", { name: /مؤجَّل|deferred/i }),
    ).toHaveCount(3);
  });

  test("quick-start keyboard path to origin and nest", async ({ page }) => {
    await activateAccountKeyboard(page);
    await keyboardActivateButton(
      page,
      /بدء سريع بالقيم الافتراضية|Quick start with defaults/i,
    );
    await expect(page).toHaveURL(/onboarding\/crow/, { timeout: 20_000 });
    await expect(
      page.locator('[data-major-state="personalization-review"]'),
    ).toBeVisible({
      timeout: 15_000,
    });
    await saveReviewToOrigin(page);
    await keyboardActivateButton(page, /المراجعة لاحقاً|Review later/i);
    await expect(page).toHaveURL(/onboarding\/nest-intro/, { timeout: 20_000 });
  });
});

test.describe("resume and guards", () => {
  test("refresh resume returns to authorized screen", async ({ page }) => {
    await activateAccountKeyboard(page);
    await keyboardActivateButton(
      page,
      /بدء التخصيص الموجَّه|Start guided personalization/i,
    );
    await expect(page).toHaveURL(/onboarding\/crow/);
    await page.reload();
    await expect(page.locator('[data-screen-id="IDN-001"]')).toBeVisible({
      timeout: 20_000,
    });
    await page.goto("/onboarding/origin");
    await expect(page).not.toHaveURL(/onboarding\/origin/);
    await expect(page.locator('[data-screen-id="ONB-002"]')).toHaveCount(0);
  });

  test("ONB-002 guard before minimum personalization", async ({ page }) => {
    await activateAccountKeyboard(page);
    await assertServerRedirectAwayFrom(
      page,
      "/onboarding/origin",
      /onboarding\/entry/,
    );
  });

  test("ONB-003 guard before origin complete or review-later", async ({
    page,
  }) => {
    await activateAccountKeyboard(page);
    await keyboardActivateButton(
      page,
      /بدء سريع بالقيم الافتراضية|Quick start with defaults/i,
    );
    await expect(page).toHaveURL(/onboarding\/crow/);
    await assertServerRedirectAwayFrom(
      page,
      "/onboarding/nest-intro",
      /onboarding\/(crow|origin|entry)/,
    );
    await expect(page.locator('[data-screen-id="ONB-003"]')).toHaveCount(0);
  });

  test("review-later path reaches nest handoff", async ({ page }) => {
    await activateAccountKeyboard(page);
    await keyboardActivateButton(
      page,
      /بدء سريع بالقيم الافتراضية|Quick start with defaults/i,
    );
    await saveReviewToOrigin(page);
    await keyboardActivateButton(page, /المراجعة لاحقاً|Review later/i);
    await expect(page.locator('[data-screen-id="ONB-003"]')).toBeVisible();
    await expect(page.locator('[data-major-state="handoff"]')).toBeVisible();
  });
});

test.describe("conflicts and idempotency", () => {
  test("stale personalization write requires resubmission", async ({
    page,
  }) => {
    await activateAccountKeyboard(page);
    await keyboardActivateButton(
      page,
      /بدء التخصيص الموجَّه|Start guided personalization/i,
    );
    await expect(page.locator('[data-screen-id="IDN-001"]')).toBeVisible();
    const first = await e2eOnboardingCommand(
      page,
      "save-crow-basics",
      {
        crowOptionId: "crow.classic",
        colorOptionId: "color.ink_sand",
        styleOptionId: "style.calm",
        accessoryOptionId: "accessory.none",
        contrastOverrideAcknowledged: true,
      },
      { newLogicalOp: true },
    );
    expect(first.resource?.version).toBeGreaterThan(0);
    // Force stale expectedVersion via second parallel-style write after bump
    await e2eOnboardingCommand(
      page,
      "save-crow-basics",
      {
        crowOptionId: "crow.rounded",
        colorOptionId: "color.dusk_teal",
        styleOptionId: "style.alert",
        accessoryOptionId: "accessory.none",
        contrastOverrideAcknowledged: true,
      },
      { newLogicalOp: true },
    );
    // Manually POST with stale version
    const stale = await page.evaluate(async () => {
      const res = await fetch("/api/onboarding/commands/save-crow-basics", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": `stale-pers-${Date.now()}`,
        },
        body: JSON.stringify({
          expectedVersion: 1,
          personalizationCatalogueVersion: "0.1.0",
          crowOptionId: "crow.classic",
          colorOptionId: "color.ink_sand",
          styleOptionId: "style.calm",
          accessoryOptionId: "accessory.none",
          contrastOverrideAcknowledged: true,
        }),
      });
      const body = (await res.json()) as { category?: string };
      return { status: res.status, category: body.category };
    });
    expect(stale.status).toBe(409);
    expect(stale.category).toBe("CONFLICT");
  });

  test("stale origin write requires resubmission", async ({ page }) => {
    await activateAccountKeyboard(page);
    await keyboardActivateButton(
      page,
      /بدء سريع بالقيم الافتراضية|Quick start with defaults/i,
    );
    await saveReviewToOrigin(page);
    await e2eOnboardingCommand(
      page,
      "save-origin-draft",
      {
        originRegionOption: "region.gulf",
        originExperienceOption: "exp.exploring",
        originGoalsOptions: ["goal.foundations"],
      },
      { newLogicalOp: true },
    );
    const stale = await page.evaluate(async () => {
      const current = await (await fetch("/api/onboarding")).json();
      const res = await fetch("/api/onboarding/commands/save-origin-draft", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": `stale-origin-${Date.now()}`,
        },
        body: JSON.stringify({
          expectedVersion: Math.max(0, (current.version as number) - 1),
          originCatalogueVersion: "0.1.0",
          originRegionOption: "region.levant",
          originExperienceOption: "exp.building",
          originGoalsOptions: ["goal.community"],
        }),
      });
      const body = (await res.json()) as { category?: string };
      return { status: res.status, category: body.category };
    });
    expect(stale.status).toBe(409);
    expect(stale.category).toBe("CONFLICT");
  });

  test("identical onboarding command idempotent replay", async ({ page }) => {
    await activateAccountKeyboard(page);
    const key = `idem-onb-replay-${Date.now()}`;
    const body = {};
    await e2eOnboardingCommand(page, "begin-guided", body, {
      newLogicalOp: true,
      forceIdempotencyKey: key,
    });
    const replay = await e2eOnboardingCommand(page, "begin-guided", body, {
      forceIdempotencyKey: key,
      fingerprint: "same-replay",
    });
    expect(replay.idempotencyResult).toBe("replayed");
  });

  test("same idempotency key with different onboarding payload", async ({
    page,
  }) => {
    await activateAccountKeyboard(page);
    const key = `idem-onb-conflict-${Date.now()}`;
    await e2eOnboardingCommand(
      page,
      "begin-guided",
      {},
      {
        newLogicalOp: true,
        forceIdempotencyKey: key,
      },
    );
    const err = await e2eOnboardingCommandExpectError(
      page,
      "begin-quick-start",
      {},
      { forceIdempotencyKey: key, newLogicalOp: true },
    );
    expect(err.category).toBe("IDEMPOTENCY_CONFLICT");
  });

  test("catalogue-version conflict on personalization", async ({ page }) => {
    await activateAccountKeyboard(page);
    const err = await e2eOnboardingCommandExpectError(
      page,
      "begin-guided",
      { personalizationCatalogueVersion: "9.9.9" },
      { newLogicalOp: true },
    );
    expect(err.category).toBe("CATALOGUE_VERSION_CONFLICT");
  });

  test("origin-schema conflict on invalid goal", async ({ page }) => {
    await activateAccountKeyboard(page);
    await keyboardActivateButton(
      page,
      /بدء سريع بالقيم الافتراضية|Quick start with defaults/i,
    );
    await saveReviewToOrigin(page);
    const err = await e2eOnboardingCommandExpectError(
      page,
      "save-origin-draft",
      {
        originRegionOption: "region.gulf",
        originExperienceOption: "exp.exploring",
        originGoalsOptions: ["goal.not_a_real_option"],
      },
      { newLogicalOp: true },
    );
    expect(err.category).toBe("ORIGIN_SCHEMA_CONFLICT");
  });

  test("cross-user isolation via session-bound aggregate", async ({
    page,
    request,
  }) => {
    await activateAccountKeyboard(page);
    await keyboardActivateButton(
      page,
      /بدء التخصيص الموجَّه|Start guided personalization/i,
    );
    const mine = await page.evaluate(async () => {
      const res = await fetch("/api/onboarding");
      return res.json();
    });
    // New synthetic session (different account)
    await request.post("/api/local/synthetic-session", {
      data: {},
    });
    const other = await request.get("/api/onboarding");
    // Other session has no onboarding row for its own account
    expect(other.status()).toBe(404);
    // Mutating with other session cannot target first aggregate via API —
    // aggregateId is always taken from session cookie.
    const mutate = await request.post("/api/onboarding/commands/begin-guided", {
      headers: { "Idempotency-Key": `cross-user-${Date.now()}` },
      data: {
        expectedVersion: 0,
        personalizationCatalogueVersion: "0.1.0",
      },
    });
    // Other user may begin their own onboarding if activated, or be forbidden.
    // Isolation: response resource aggregateId must not equal the first user's.
    if (mutate.ok()) {
      const body = (await mutate.json()) as {
        resource: { aggregateId: string };
      };
      expect(body.resource.aggregateId).not.toBe(mine.aggregateId);
    } else {
      expect([401, 403, 404, 409]).toContain(mutate.status());
    }
    void testControl;
  });
});

test.describe("cosmetics, privacy, locale", () => {
  test("locked cosmetic explanation is preview only", async ({ page }) => {
    await activateAccountKeyboard(page);
    await keyboardActivateButton(
      page,
      /بدء التخصيص الموجَّه|Start guided personalization/i,
    );
    await expect(
      page.locator('[data-locked-cosmetic="accessory"]'),
    ).toBeVisible();
    await expect(
      page.getByText(/معاينة فقط|Preview only/i).first(),
    ).toBeVisible();
  });

  test("contrast adjustment acknowledgment required", async ({ page }) => {
    await activateAccountKeyboard(page);
    await keyboardActivateButton(
      page,
      /بدء التخصيص الموجَّه|Start guided personalization/i,
    );
    const continueBtn = page.getByRole("button", {
      name: /المتابعة إلى الموطن|Continue to habitat/i,
    });
    await expect(continueBtn).toBeDisabled();
    await keyboardCheckCheckbox(
      page,
      /أقرّ بأنني قد أعدّل التباين|I acknowledge I may adjust contrast/i,
    );
    await expect(continueBtn).toBeEnabled();
  });

  test("privacy preview acknowledgment on review", async ({ page }) => {
    await activateAccountKeyboard(page);
    await keyboardActivateButton(
      page,
      /بدء سريع بالقيم الافتراضية|Quick start with defaults/i,
    );
    const saveReview = page.getByRole("button", {
      name: /حفظ المراجعة|Save review/i,
    });
    await expect(saveReview).toBeDisabled();
    await keyboardCheckCheckbox(
      page,
      /أفهم معاينة الخصوصية|I understand this privacy preview/i,
    );
    await expect(saveReview).toBeEnabled();
  });

  test("Arabic and English locale parity on entry", async ({ page }) => {
    await activateAccountKeyboard(page);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const arTitle = await page.getByRole("heading", { level: 1 }).innerText();
    await keyboardActivateButton(page, /English/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Crow presence|Create your Crow/i,
    );
    await keyboardActivateButton(page, /العربية/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      arTitle,
    );
  });
});

test.describe("actual-state accessibility states", () => {
  test("actual-state accessibility states", async ({ page }) => {
    await activateAccountKeyboard(page);
    await expect(page.locator('[data-major-state="handoff"]')).toBeVisible();
    await axeOk(page, "ONB-001 entry handoff");

    await keyboardActivateButton(
      page,
      /بدء التخصيص الموجَّه|Start guided personalization/i,
    );
    await page.goto("/onboarding/entry");
    await expect(page.locator('[data-major-state="guided"]')).toBeVisible();
    await axeOk(page, "ONB-001 guided begun");

    await page.goto("/onboarding/crow");
    await expect(
      page.locator('[data-major-state="crow-personalize"]'),
    ).toBeVisible();
    await axeOk(page, "IDN-001 crow personalize");
    await expect(
      page.locator('[data-locked-cosmetic="accessory"]'),
    ).toBeVisible();
    await axeOk(page, "IDN-001 locked accessory");

    await keyboardCheckCheckbox(
      page,
      /أقرّ بأنني قد أعدّل التباين|I acknowledge I may adjust contrast/i,
    );
    await keyboardActivateButton(
      page,
      /المتابعة إلى الموطن|Continue to habitat/i,
    );
    await expect(page.locator('[data-major-state="habitat"]')).toBeVisible();
    await axeOk(page, "IDN-002 habitat");

    await keyboardActivateButton(
      page,
      /المتابعة إلى الشخصية|Continue to character/i,
    );
    await expect(page.locator('[data-major-state="character"]')).toBeVisible();
    await axeOk(page, "IDN-003 character");

    await keyboardActivateButton(
      page,
      /المتابعة إلى المراجعة|Continue to review/i,
    );
    await expect(
      page.locator('[data-major-state="personalization-review"]'),
    ).toBeVisible();
    await axeOk(page, "IDN-001 personalization review");

    await saveReviewToOrigin(page);
    await expect(
      page.locator('[data-major-state="origin-ready"]'),
    ).toBeVisible();
    await axeOk(page, "ONB-002 origin ready");

    await keyboardActivateButton(page, /المراجعة لاحقاً|Review later/i);
    await expect(page).toHaveURL(/onboarding\/nest-intro/, { timeout: 20_000 });
    // Revisit origin for review-later major-state accessibility coverage
    await page.goto("/onboarding/origin");
    await expect(
      page.locator('[data-major-state="origin-review-later"]'),
    ).toBeVisible({ timeout: 15_000 });
    await axeOk(page, "ONB-002 origin review-later");

    await page.goto("/onboarding/nest-intro");
    await expect(page.locator('[data-major-state="handoff"]')).toBeVisible();
    await axeOk(page, "ONB-003 nest handoff");

    // Surface conflict errors for a11y (client error panel)
    await page.goto("/onboarding/crow");
    await expect(page.locator('[data-screen-id="IDN-001"]')).toBeVisible({
      timeout: 15_000,
    });

    await e2eOnboardingCommandExpectError(
      page,
      "save-crow-basics",
      {
        crowOptionId: "crow.classic",
        colorOptionId: "color.ink_sand",
        styleOptionId: "style.calm",
        accessoryOptionId: "accessory.none",
        contrastOverrideAcknowledged: true,
        personalizationCatalogueVersion: "8.0.0",
      },
      { newLogicalOp: true },
    );
    await expect(page.locator("#error-summary")).toBeVisible();
    await axeOk(page, "onboarding catalogue-conflict error state");

    await e2eOnboardingCommandExpectError(
      page,
      "save-crow-basics",
      {
        crowOptionId: "crow.rounded",
        colorOptionId: "color.dusk_teal",
        styleOptionId: "style.playful",
        accessoryOptionId: "accessory.none",
        contrastOverrideAcknowledged: true,
        personalizationCatalogueVersion: "0.1.0",
      },
      {
        newLogicalOp: true,
        forceExpectedVersion: 0,
        forceIdempotencyKey: `a11y-client-stale-panel-${Date.now()}`,
      },
    );
    await expect(page.locator("#error-summary")).toBeVisible();
    await axeOk(page, "onboarding stale-conflict error state");
  });
});
