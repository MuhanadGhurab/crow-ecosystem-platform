import assert from "node:assert/strict";

const baseEnv = { ...process.env };

function resetEnv(overrides: Record<string, string | undefined>) {
  process.env = { ...baseEnv, ...overrides };
}

async function selection() {
  return import("./email-provider-selection");
}

async function main() {
  resetEnv({
    NODE_ENV: "test",
    VERCEL_ENV: undefined,
    APP_ENVIRONMENT: undefined,
    EMAIL_PROVIDER: undefined,
    LOCAL_EMAIL_PROVIDER: undefined,
  });
  {
    const { resolveEmailDeliveryProvider } = await selection();
    assert.equal(resolveEmailDeliveryProvider(), "in-memory");
  }

  resetEnv({
    NODE_ENV: "development",
    VERCEL_ENV: undefined,
    APP_ENVIRONMENT: "local",
    LOCAL_EMAIL_PROVIDER: "mailpit",
    EMAIL_PROVIDER: undefined,
  });
  {
    const { resolveEmailDeliveryProvider } = await selection();
    assert.equal(resolveEmailDeliveryProvider(), "mailpit");
  }

  resetEnv({
    NODE_ENV: "production",
    VERCEL_ENV: "preview",
    APP_ENVIRONMENT: "preview",
    EMAIL_PROVIDER: "resend",
    RESEND_API_KEY: "re_test_key",
    C3_VERIFICATION_FROM_EMAIL: "Crow <onboarding@resend.dev>",
  });
  {
    const { resolveEmailDeliveryProvider, assertHostedEmailProviderConfigured } =
      await selection();
    assert.equal(resolveEmailDeliveryProvider(), "resend");
    assert.doesNotThrow(() => assertHostedEmailProviderConfigured());
  }

  resetEnv({
    NODE_ENV: "production",
    VERCEL_ENV: "preview",
    APP_ENVIRONMENT: "preview",
    EMAIL_PROVIDER: undefined,
  });
  {
    const { resolveEmailDeliveryProvider } = await selection();
    assert.throws(() => resolveEmailDeliveryProvider(), /EMAIL_PROVIDER must be resend/);
  }

  resetEnv({
    NODE_ENV: "production",
    VERCEL_ENV: "preview",
    APP_ENVIRONMENT: "preview",
    EMAIL_PROVIDER: "resend",
    RESEND_API_KEY: undefined,
    C3_VERIFICATION_FROM_EMAIL: undefined,
  });
  {
    const { assertHostedEmailProviderConfigured } = await selection();
    assert.throws(() => assertHostedEmailProviderConfigured(), /RESEND_API_KEY/);
  }

  resetEnv({
    NODE_ENV: "production",
    VERCEL_ENV: "preview",
    APP_ENVIRONMENT: "preview",
    EMAIL_PROVIDER: "in-memory",
  });
  {
    const { resolveEmailDeliveryProvider } = await selection();
    assert.throws(() => resolveEmailDeliveryProvider());
  }

  process.env = baseEnv;
  console.log("email-provider-selection.test.ts PASSED");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
