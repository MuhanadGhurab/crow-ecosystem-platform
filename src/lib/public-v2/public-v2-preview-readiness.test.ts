import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { FTGP_CERTIFICATION_MODE_ENV } from "@/lib/ftgp/ftgp-certification-host-gate";
import { PUBLIC_V2_BRIGHT_IDENTITY_MARKER } from "@/lib/public-v2/tokens";
import { PUBLIC_LIFECYCLE_STEPS } from "@/lib/public-v2/public-lifecycle";
import {
  PUBLIC_BLUEPRINT_TABS,
  PUBLIC_FOUNDATION_LAYERS,
  PUBLIC_RUNTIME_AREAS,
  PUBLIC_SAREA_ROLES,
} from "@/lib/public-v2/representative-data";
import { PUBLIC_V2_SECTION_IDS } from "@/lib/public-v2/routes";

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

function walkTsx(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walkTsx(full, out);
    else if (name.endsWith(".tsx") || name.endsWith(".ts")) out.push(full);
  }
  return out;
}

console.log("public-v2-preview-readiness:test");

test("preview page exists with certification gate", () => {
  const page = read("src/app/preview/public-home/page.tsx");
  assert.ok(page.includes("assertPublicV2PreviewEnabled"));
  assert.ok(page.includes("robots"));
  assert.ok(page.includes("index: false"));
  assert.ok(page.includes("follow: false"));
});

test("bright visual identity marker on preview shell", () => {
  const shell = read("src/components/public-v2/public-page-shell.tsx");
  const css = read("src/styles/public-v2-bright.css");
  const tokens = read("src/lib/public-v2/tokens.ts");
  assert.ok(shell.includes(PUBLIC_V2_BRIGHT_IDENTITY_MARKER));
  assert.ok(css.includes(".public-v2-bright"));
  assert.ok(tokens.includes("publicV2Background"));
  assert.ok(!shell.includes("#04060c"), "shell must not use old dark background");
});

test("certification gate uses FTGP mode env", () => {
  const gate = read("src/lib/public-v2/certification-gate.ts");
  assert.ok(gate.includes("isFtgpCertificationHostGateEnabled"));
  assert.ok(gate.includes("notFound"));
  assert.equal(FTGP_CERTIFICATION_MODE_ENV, "FTGP_CERTIFICATION_MODE");
});

test("seven homepage sections present", () => {
  const home = read("src/components/public-v2/public-homepage-preview.tsx");
  const sections = [
    "PublicHeroSection",
    "PublicBeginsDifferentlySection",
    "PublicLifecycleExplorer",
    "PublicJourneySection",
    "PublicBlueprintToWorkspaceSection",
    "PublicGovernedFoundationSection",
    "PublicFinalCtaSection",
  ];
  for (const s of sections) assert.ok(home.includes(s), `missing ${s}`);
});

test("navigation menu structure", () => {
  const nav = read("src/lib/public-v2/navigation.ts");
  assert.ok(nav.includes("Platform"));
  assert.ok(nav.includes("How Crow Works"));
  assert.ok(nav.includes("Enterprise Blueprint"));
  assert.ok(nav.includes("Solutions"));
  assert.ok(nav.includes("Security"));
  assert.ok(nav.includes("Start Designing"));
  assert.ok(nav.includes("Discuss Your Organization"));
});

test("hero four-stage operating model", () => {
  const diagram = read("src/components/public-v2/public-operating-diagram.tsx");
  assert.ok(diagram.includes("Organizational Intent"));
  assert.ok(diagram.includes("Operating Model"));
  assert.ok(diagram.includes("Enterprise Blueprint"));
  assert.ok(diagram.includes("Operational Runtime"));
  assert.ok(diagram.includes("People"));
  assert.ok(diagram.includes("Trust"));
  assert.ok(diagram.includes("aria-pressed"), "interactive stage selection");
});

test("six-step lifecycle explorer", () => {
  assert.equal(PUBLIC_LIFECYCLE_STEPS.length, 6);
  const labels = PUBLIC_LIFECYCLE_STEPS.map((s) => s.label).join(",");
  assert.ok(labels.includes("Understand"));
  assert.ok(labels.includes("Operate"));
  const explorer = read("src/components/public-v2/public-lifecycle-explorer.tsx");
  assert.ok(explorer.includes('role="tablist"'));
  assert.ok(explorer.includes("ArrowRight"));
});

test("new and transform journey cards", () => {
  const journey = read("src/components/public-v2/public-journey-section.tsx");
  const card = read("src/components/public-v2/public-journey-card.tsx");
  assert.ok(journey.includes('kind="NEW"'));
  assert.ok(journey.includes('kind="TRANSFORM"'));
  assert.ok(card.includes("public-v2-journey-new"));
  assert.ok(card.includes("public-v2-journey-transform"));
});

test("five blueprint tabs", () => {
  assert.equal(PUBLIC_BLUEPRINT_TABS.length, 5);
});

test("five SAREA roles", () => {
  assert.equal(PUBLIC_SAREA_ROLES.length, 5);
});

test("five runtime areas", () => {
  assert.equal(PUBLIC_RUNTIME_AREAS.length, 5);
});

test("foundation diagram layers", () => {
  const ids = PUBLIC_FOUNDATION_LAYERS.map((l) => l.id);
  assert.deepEqual(ids.sort(), ["cem", "cybercrow", "procrow", "sarea"].sort());
});

test("representative preview labels", () => {
  const label = read("src/components/public-v2/representative-preview-label.tsx");
  assert.ok(label.includes("Representative preview"));
  const blueprint = read("src/components/public-v2/public-blueprint-preview.tsx");
  assert.ok(blueprint.includes("RepresentativePreviewLabel"));
});

test("reduced-motion respected via globals", () => {
  const css = read("src/app/globals.css");
  assert.ok(css.includes("prefers-reduced-motion"));
});

test("mobile overflow prevention", () => {
  const shell = read("src/components/public-v2/public-page-shell.tsx");
  assert.ok(shell.includes("overflow-x-hidden"));
});

const FORBIDDEN_CONTAINMENT = [
  "@/lib/crow-story",
  "@/components/crow-story",
  "useStoryScrollEngine",
  "crow-story-interactive",
  "FlyingCrow",
  "flying-crow",
  "@prisma/client",
  "@/lib/prisma",
  "billing.service",
  "createSubscriptionCheckout",
  "persistCommittedJourney",
  "persistSoftJourney",
  "approveClientProposalScope",
  "compileBlueprint",
  "provisionTenant",
  "grantTenantAccess",
  "grant-crow-role",
] as const;

test("bundle containment — no story or privileged domain imports", () => {
  const dirs = [
    join(root, "src/components/public-v2"),
    join(root, "src/lib/public-v2"),
  ];
  const files = dirs.flatMap((dir) => walkTsx(dir)).filter((f) => !f.endsWith(".test.ts"));
  for (const file of files) {
    const rel = file.replace(root + "\\", "").replace(root + "/", "");
    const src = read(rel);
    for (const token of FORBIDDEN_CONTAINMENT) {
      assert.ok(!src.includes(token), `${rel} contains forbidden ${token}`);
    }
  }
  const page = read("src/app/preview/public-home/page.tsx");
  for (const token of FORBIDDEN_CONTAINMENT) {
    assert.ok(!page.includes(token), `preview page contains forbidden ${token}`);
  }
});

test("preview route path is certification-only", () => {
  assert.equal(read("src/lib/public-v2/routes.ts").includes('"/preview/public-home"'), true);
});

test("current homepage unchanged", () => {
  const home = read("src/app/(public)/page.tsx");
  assert.ok(!home.includes("public-v2"));
  assert.ok(!home.includes("public-home"));
});

test("final CTA uses Discuss Your Organization", () => {
  const cta = read("src/components/public-v2/public-final-cta-section.tsx");
  assert.ok(cta.includes("Discuss Your Organization"));
  assert.ok(!cta.includes("Talk to Crow"));
});

console.log("public-v2-preview-readiness:test PASS");
