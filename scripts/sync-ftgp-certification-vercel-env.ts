#!/usr/bin/env tsx
/**
 * Copy hosted operator env to crow-ftgp-certification Vercel Production.
 * Values are never logged. Run once after creating the certification project.
 *
 * Run: npm run ftgp-certification-vercel-env:sync
 */
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import {
  FTGP_CERTIFICATION_DEFAULT_ORIGIN,
  FTGP_CERTIFICATION_OPERATOR_ENV,
  FTGP_CERTIFICATION_PROJECT_NAME,
  FTGP_CERTIFICATION_BASE_URL_ENV,
  resolveLatestCertificationDeploymentUrl,
} from "./lib/ftgp-certification-environment";

const TARGET_PROJECT = FTGP_CERTIFICATION_PROJECT_NAME;

const CERTIFICATION_ENV_NAMES = [
  "AUTH_DISABLED",
  "USE_MOCK_DATA",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "DIRECT_URL",
  "EXPECTED_DATABASE_FINGERPRINT",
  "EXPECTED_DIRECT_DATABASE_FINGERPRINT",
  "BACKEND_ISOLATION",
  "DATABASE_ENVIRONMENT",
  "APP_ENVIRONMENT",
  "GOOGLE_SSO_ENABLED",
  "ACCOUNT_REGISTRATION_ENABLED",
  "CROW_ONBOARDING_GENERATION_REQUIRED",
  "CROW_PHONE_VERIFICATION_REQUIRED",
  "EMAIL_PROVIDER",
  "RESEND_API_KEY",
  "EMAIL_VERIFICATION_CODE_SECRET",
  "NOTIFICATION_FROM_EMAIL",
];

function run(cmd: string, input?: string): number {
  const result = spawnSync(cmd, {
    encoding: "utf8",
    shell: process.platform === "win32",
    stdio: input ? ["pipe", "pipe", "pipe"] : ["pipe", "pipe", "pipe"],
    input,
  });
  return result.status ?? 1;
}

function addEnv(name: string, value: string): boolean {
  const status = run(
    `npx vercel env add ${name} production --force --yes`,
    value
  );
  return status === 0;
}

function main() {
  console.log("\n=== FTGP certification Vercel env sync ===\n");
  console.log(`  target=${TARGET_PROJECT}`);

  loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [],
  });

  const linkStatus = run(`npx vercel link --project ${TARGET_PROJECT} --yes`);
  if (linkStatus !== 0) {
    console.error(`Failed to link ${TARGET_PROJECT}`);
    process.exit(1);
  }

  const overrides: Record<string, string> = {
    NEXT_PUBLIC_SITE_URL: FTGP_CERTIFICATION_DEFAULT_ORIGIN,
    GOOGLE_SSO_ENABLED: "true",
    APP_ENVIRONMENT: "certification",
    AUTH_DISABLED: "false",
    USE_MOCK_DATA: "false",
  };

  let synced = 0;
  for (const name of CERTIFICATION_ENV_NAMES) {
    const value = overrides[name] ?? process.env[name]?.trim();
    if (!value) {
      console.log(`  skip (missing locally): ${name}`);
      continue;
    }
    if (addEnv(name, value)) {
      synced += 1;
      console.log(`  synced: ${name}`);
    } else {
      console.log(`  failed: ${name} — review in Vercel dashboard`);
    }
  }

  writeFileSync(
    join(process.cwd(), FTGP_CERTIFICATION_OPERATOR_ENV),
    [
      "# FTGP.1H.2 — private certification deployment (gitignored)",
      `# stable alias: ${FTGP_CERTIFICATION_DEFAULT_ORIGIN}`,
      `${FTGP_CERTIFICATION_BASE_URL_ENV}=${resolveLatestCertificationDeploymentUrl() ?? FTGP_CERTIFICATION_DEFAULT_ORIGIN}`,
      "",
    ].join("\n"),
    "utf8"
  );

  console.log(`\n  syncedCount=${synced}`);
  console.log(`  wrote ${FTGP_CERTIFICATION_OPERATOR_ENV} (base URL only)`);
  console.log("\nPASS — FTGP CERTIFICATION VERCEL ENV SYNC\n");
}

main();
