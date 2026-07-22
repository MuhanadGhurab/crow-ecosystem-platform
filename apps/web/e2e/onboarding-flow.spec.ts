import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  activateAccountKeyboard,
  assertServerRedirectAwayFrom,
  e2eOnboardingCommand,
  e2eOnboardingCommandExpectError,
  idempotencyEvidence,
  keyboardActivateButton,
  keyboardCheckCheckbox,
  keyboardSelectRadio,
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

async function saveCrowBasicsOnly(page: import("@playwright/test").Page) {
  await activateAccountKeyboard(page);
  await keyboardActivateButton(
    page,
    /بدء التخصيص الموجَّه|Start guided personalization/i,
  );
  await expect(page).toHaveURL(/onboarding\/crow/, { timeout: 20_000 });
  await keyboardSelectRadio(page, /غراب مستدير|Rounded Crow/i);
  await keyboardSelectRadio(page, /فيروزي الغسق|Dusk teal/i);
  await keyboardSelectRadio(page, /يقظ|Alert/i);
  await keyboardCheckCheckbox(
    page,
    /أقرّ بأنني قد أعدّل التباين|I acknowledge I may adjust contrast/i,
  );
  await keyboardActivateButton(
    page,
    /المتابعة إلى الموطن|Continue to habitat/i,
  );
  await expect(page).toHaveURL(/onboarding\/habitat/, { timeout: 20_000 });
}

test.describe("OD-BR main paths", () => {
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

test.describe("OD-BR refresh and resume", () => {
  test("refresh after Crow basics", async ({ page }) => {
    await saveCrowBasicsOnly(page);
    const before = await page.evaluate(async () => {
      const res = await fetch("/api/onboarding");
      return res.json() as Promise<{
        version: number;
        personalization: {
          crowOptionId: string;
          colorOptionId: string;
          styleOptionId: string;
        };
      }>;
    });
    expect(before.personalization.crowOptionId).toBe("crow.rounded");
    expect(before.personalization.colorOptionId).toBe("color.dusk_teal");
    expect(before.personalization.styleOptionId).toBe("style.alert");

    await page.reload();
    await expect(page).toHaveURL(/onboarding\/habitat/, { timeout: 20_000 });
    await expect(page.locator('[data-screen-id="IDN-002"]')).toBeVisible({
      timeout: 20_000,
    });

    const after = await page.evaluate(async () => {
      const res = await fetch("/api/onboarding");
      return res.json() as Promise<{
        version: number;
        personalization: {
          crowOptionId: string;
          colorOptionId: string;
          styleOptionId: string;
        };
      }>;
    });
    expect(after.version).toBe(before.version);
    expect(after.personalization.crowOptionId).toBe("crow.rounded");
    expect(after.personalization.colorOptionId).toBe("color.dusk_teal");
    expect(after.personalization.styleOptionId).toBe("style.alert");

    // Reload must not invent a second crow-basics transition
    const evidence = await idempotencyEvidence(page.request);
    const crowSaves = evidence.receipts.filter(
      (r) => r.commandType === "SAVE_CROW_BASICS",
    );
    expect(crowSaves.length).toBe(1);
  });

  test("refresh after Habitat", async ({ page }) => {
    await saveCrowBasicsOnly(page);
    await keyboardSelectRadio(page, /عش جبلي|Mountain roost/i);
    await keyboardActivateButton(
      page,
      /المتابعة إلى الشخصية|Continue to character/i,
    );
    await expect(page).toHaveURL(/onboarding\/character/, { timeout: 20_000 });

    const before = await page.evaluate(async () => {
      const res = await fetch("/api/onboarding");
      return res.json() as Promise<{
        version: number;
        personalization: { habitatOptionId: string };
      }>;
    });
    expect(before.personalization.habitatOptionId).toBe(
      "habitat.mountain_roost",
    );

    await page.reload();
    await expect(page).toHaveURL(/onboarding\/character/, { timeout: 20_000 });
    await expect(page.locator('[data-screen-id="IDN-003"]')).toBeVisible({
      timeout: 20_000,
    });

    const after = await page.evaluate(async () => {
      const res = await fetch("/api/onboarding");
      return res.json() as Promise<{
        version: number;
        personalization: { habitatOptionId: string };
      }>;
    });
    expect(after.version).toBe(before.version);
    expect(after.personalization.habitatOptionId).toBe(
      "habitat.mountain_roost",
    );
    // Revisit Habitat to confirm server-backed selection (not a client-only draft)
    await page.goto("/onboarding/habitat");
    await expect(page.locator('[data-screen-id="IDN-002"]')).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.getByLabel(/عش جبلي|Mountain roost/i).first(),
    ).toBeChecked();
  });

  test("refresh after Character", async ({ page }) => {
    await saveCrowBasicsOnly(page);
    await keyboardSelectRadio(page, /رف ساحلي|Coastal shelf/i);
    await keyboardActivateButton(
      page,
      /المتابعة إلى الشخصية|Continue to character/i,
    );
    await keyboardSelectRadio(page, /بانٍ ثابت|Steady builder/i);
    await keyboardActivateButton(
      page,
      /المتابعة إلى المراجعة|Continue to review/i,
    );
    await expect(page).toHaveURL(/onboarding\/crow/, { timeout: 20_000 });
    await expect(
      page.locator('[data-major-state="personalization-review"]'),
    ).toBeVisible();

    const before = await page.evaluate(async () => {
      const res = await fetch("/api/onboarding");
      return res.json() as Promise<{
        version: number;
        personalization: {
          characterOptionId: string;
          privacyPreviewAcknowledged: boolean;
        };
      }>;
    });
    expect(before.personalization.characterOptionId).toBe(
      "character.steady_builder",
    );
    expect(before.personalization.privacyPreviewAcknowledged).toBe(false);

    await page.reload();
    await expect(
      page.locator('[data-major-state="personalization-review"]'),
    ).toBeVisible({ timeout: 20_000 });
    await expect(
      page.getByLabel(
        /أفهم معاينة الخصوصية|I understand this privacy preview/i,
      ),
    ).not.toBeChecked();

    const after = await page.evaluate(async () => {
      const res = await fetch("/api/onboarding");
      return res.json() as Promise<{
        version: number;
        personalization: { characterOptionId: string };
      }>;
    });
    expect(after.version).toBe(before.version);
    expect(after.personalization.characterOptionId).toBe(
      "character.steady_builder",
    );
  });

  test("refresh after Origin draft", async ({ page }) => {
    await activateAccountKeyboard(page);
    await keyboardActivateButton(
      page,
      /بدء سريع بالقيم الافتراضية|Quick start with defaults/i,
    );
    await saveReviewToOrigin(page);
    await keyboardSelectRadio(page, /بلاد الشام|Levant/i);
    await keyboardSelectRadio(page, /أبني شيئاً|Building something/i);
    await keyboardCheckCheckbox(page, /تعزيز الأسس|Strengthen foundations/i);
    await keyboardActivateButton(page, /حفظ المسودة|Save draft/i);
    await expect(page.locator('[data-major-state="origin-draft"]')).toBeVisible(
      {
        timeout: 15_000,
      },
    );

    const before = await page.evaluate(async () => {
      const res = await fetch("/api/onboarding");
      return res.json() as Promise<{
        version: number;
        origin: {
          status: string;
          regionOption: string | null;
          experienceOption: string | null;
          goalsOptions: string[];
        };
        state: string;
      }>;
    });
    expect(before.origin.status).toBe("DRAFT");
    expect(before.origin.regionOption).toBe("region.levant");
    expect(before.origin.experienceOption).toBe("exp.building");
    expect(before.origin.goalsOptions).toContain("goal.foundations");
    expect(before.state).not.toBe("NEST_INTRO_HANDED_OFF");

    await page.reload();
    await expect(page).toHaveURL(/onboarding\/origin/, { timeout: 20_000 });
    await expect(page.locator('[data-major-state="origin-draft"]')).toBeVisible(
      { timeout: 20_000 },
    );
    await expect(page.getByLabel(/بلاد الشام|Levant/i).first()).toBeChecked();
    await expect(page.locator('[data-screen-id="ONB-003"]')).toHaveCount(0);

    const after = await page.evaluate(async () => {
      const res = await fetch("/api/onboarding");
      return res.json() as Promise<{
        version: number;
        origin: { status: string; regionOption: string | null };
      }>;
    });
    expect(after.version).toBe(before.version);
    expect(after.origin.status).toBe("DRAFT");
    expect(after.origin.regionOption).toBe("region.levant");
  });

  test("interrupted return resumes last incomplete governed step", async ({
    page,
  }) => {
    // Incomplete state A: Crow basics saved → furthest resume is IDN-002
    await saveCrowBasicsOnly(page);
    await page.goto("/onboarding/character");
    await expect(page).toHaveURL(/onboarding\/habitat/, { timeout: 20_000 });
    await expect(page.locator('[data-screen-id="IDN-002"]')).toBeVisible();
    await expect(page.locator('[data-screen-id="IDN-003"]')).toHaveCount(0);

    // Incomplete state B: Habitat saved → furthest resume is IDN-003
    await keyboardSelectRadio(page, /هوائي المدينة|City antenna/i);
    await keyboardActivateButton(
      page,
      /المتابعة إلى الشخصية|Continue to character/i,
    );
    await expect(page).toHaveURL(/onboarding\/character/, { timeout: 20_000 });
    await page.goto("/onboarding/origin");
    await expect(page).toHaveURL(/onboarding\/character/, { timeout: 20_000 });
    await expect(page.locator('[data-screen-id="IDN-003"]')).toBeVisible();
    await expect(page.locator('[data-screen-id="ONB-002"]')).toHaveCount(0);
  });
});

test.describe("OD-BR idempotency and concurrency", () => {
  test("Quick-start duplicate retry is idempotent", async ({ page }) => {
    await activateAccountKeyboard(page);
    const fixedKey = `e2e-od-br-008-quick-start-${Date.now()}`;
    const body = {};
    const first = await e2eOnboardingCommand(page, "begin-quick-start", body, {
      newLogicalOp: true,
      forceIdempotencyKey: fixedKey,
    });
    expect(first.idempotencyResult).toBe("applied");
    expect(first.resource?.version).toBeGreaterThan(0);

    const afterFirst = await idempotencyEvidence(page.request, fixedKey);
    expect(afterFirst.receiptCount).toBe(1);
    expect(afterFirst.onboardingAggregateVersion).toBe(first.resource?.version);
    expect(afterFirst.personalizationCatalogueVersion).toBe("0.1.0");
    expect(afterFirst.personalizationStatus).toBe("MINIMUM_COMPLETE");
    const versionAfterFirst = afterFirst.onboardingAggregateVersion;
    const auditAfterFirst = afterFirst.auditCount;
    const outboxAfterFirst = afterFirst.outboxCount;
    const beginQuickReceipts = afterFirst.receipts.filter(
      (r) => r.commandType === "BEGIN_QUICK_START",
    );
    expect(beginQuickReceipts.length).toBe(1);

    const replay = await e2eOnboardingCommand(page, "begin-quick-start", body, {
      forceIdempotencyKey: fixedKey,
      fingerprint: "same-quick-start-replay",
    });
    expect(replay.idempotencyResult).toBe("replayed");
    expect(replay.resource?.version).toBe(versionAfterFirst);

    const afterReplay = await idempotencyEvidence(page.request, fixedKey);
    expect(afterReplay.onboardingAggregateVersion).toBe(versionAfterFirst);
    expect(afterReplay.auditCount).toBe(auditAfterFirst);
    expect(afterReplay.outboxCount).toBe(outboxAfterFirst);
    expect(afterReplay.receiptCount).toBe(1);
    expect(afterReplay.personalizationCatalogueVersion).toBe("0.1.0");
    expect(
      afterReplay.receipts.filter((r) => r.commandType === "BEGIN_QUICK_START")
        .length,
    ).toBe(1);

    await page.goto("/onboarding/crow");
    await expect(
      page.locator('[data-major-state="personalization-review"]'),
    ).toBeVisible({ timeout: 20_000 });
    await expect(page.locator("#error-summary")).toHaveCount(0);
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
    const before = await idempotencyEvidence(page.request, key);
    const err = await e2eOnboardingCommandExpectError(
      page,
      "begin-quick-start",
      {},
      { forceIdempotencyKey: key, newLogicalOp: true },
    );
    expect(err.category).toBe("IDEMPOTENCY_CONFLICT");
    const after = await idempotencyEvidence(page.request, key);
    expect(after.auditCount).toBe(before.auditCount);
    expect(after.outboxCount).toBe(before.outboxCount);
    expect(after.receiptCount).toBe(before.receiptCount);
  });

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

  test("stale Origin write requires resubmission", async ({ page }) => {
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
});

test.describe("OD-BR validation and isolation", () => {
  test("cross-user isolation through session-bound aggregate", async ({
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
    await request.post("/api/local/synthetic-session", {
      data: {},
    });
    const other = await request.get("/api/onboarding");
    expect(other.status()).toBe(404);
    const mutate = await request.post("/api/onboarding/commands/begin-guided", {
      headers: { "Idempotency-Key": `cross-user-${Date.now()}` },
      data: {
        expectedVersion: 0,
        personalizationCatalogueVersion: "0.1.0",
      },
    });
    if (mutate.ok()) {
      const body = (await mutate.json()) as {
        resource: { aggregateId: string };
      };
      expect(body.resource.aggregateId).not.toBe(mine.aggregateId);
    } else {
      expect([401, 403, 404, 409]).toContain(mutate.status());
    }
  });

  test("personalization catalogue-version conflict", async ({ page }) => {
    await activateAccountKeyboard(page);
    const err = await e2eOnboardingCommandExpectError(
      page,
      "begin-guided",
      { personalizationCatalogueVersion: "9.9.9" },
      { newLogicalOp: true },
    );
    expect(err.category).toBe("CATALOGUE_VERSION_CONFLICT");
  });

  test("Origin schema-version conflict", async ({ page }) => {
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
});

test.describe("OD-BR route guards and completion", () => {
  test("ONB-002 blocked before minimum personalization", async ({ page }) => {
    await activateAccountKeyboard(page);
    await assertServerRedirectAwayFrom(
      page,
      "/onboarding/origin",
      /onboarding\/entry/,
    );
  });

  test("ONB-003 blocked before Origin completion or Review Later", async ({
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

  test("ONB-003 available after completed Origin", async ({ page }) => {
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
    await expect(page.locator('[data-screen-id="ONB-003"]')).toBeVisible();
    // Direct re-entry remains allowed; Nest handoff stays server-accessible
    await page.goto("/onboarding/nest-intro");
    await expect(page).toHaveURL(/onboarding\/nest-intro/, { timeout: 20_000 });
    await expect(page.locator('[data-screen-id="ONB-003"]')).toBeVisible();
    await expect(page.locator('[data-major-state="handoff"]')).toBeVisible();
  });

  test("Review Later reaches ONB-003", async ({ page }) => {
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

test.describe("OD-BR UX locale and accessibility", () => {
  test("locked cosmetic explanation remains preview-only", async ({ page }) => {
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

  test("contrast acknowledgement gates continuation", async ({ page }) => {
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

  test("privacy preview acknowledgement gates review completion", async ({
    page,
  }) => {
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

  test("Arabic/English parity and actual-state accessibility coverage", async ({
    page,
  }) => {
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
    await page.goto("/onboarding/origin");
    await expect(
      page.locator('[data-major-state="origin-review-later"]'),
    ).toBeVisible({ timeout: 15_000 });
    await axeOk(page, "ONB-002 origin review-later");

    await page.goto("/onboarding/nest-intro");
    await expect(page.locator('[data-major-state="handoff"]')).toBeVisible();
    await axeOk(page, "ONB-003 nest handoff");

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
