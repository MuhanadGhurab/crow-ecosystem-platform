import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { PUBLIC_V2_BRIGHT_IDENTITY_MARKER } from "@/lib/public-v2/tokens";
import {
  buildSignupHandoffUrl,
  journeyKindToUrlParam,
} from "@/lib/public/journey-handoff";
import { PUBLIC_SITE_NAV, PUBLIC_SITE_FOOTER_LINKS } from "@/lib/public/navigation";
import { publicLegacyRedirects, publicRoutes } from "@/lib/public/routes";

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

console.log("public-route-architecture:test");

test("real homepage uses bright PublicHomepage", () => {
  const page = read("src/app/(public)/page.tsx");
  const home = read("src/components/public-site/public-homepage.tsx");
  assert.ok(page.includes("PublicHomepage"));
  assert.ok(!page.includes("HomepageArchitectsMapPreview"));
  assert.ok(!page.includes("HeroSection"));
  assert.ok(home.includes("PublicHeroSection"));
  assert.ok(home.includes("PublicFinalCtaSection"));
});

test("public layout uses bright site chrome", () => {
  const layout = read("src/app/(public)/layout.tsx");
  assert.ok(layout.includes("PublicSiteChrome"));
  assert.ok(!layout.includes("cc-starfield"));
  assert.ok(!layout.includes("PublicHeader"));
});

test("canonical public routes exist", () => {
  const routes = [
    "src/app/(public)/how-crow-works/page.tsx",
    "src/app/(public)/new-organization/page.tsx",
    "src/app/(public)/transform-existing/page.tsx",
    "src/app/(public)/enterprise-blueprint/page.tsx",
    "src/app/(public)/platform/page.tsx",
    "src/app/(public)/platform/cem/page.tsx",
    "src/app/(public)/platform/cybercrow/page.tsx",
    "src/app/(public)/platform/sarea/page.tsx",
    "src/app/(public)/platform/procrow/page.tsx",
    "src/app/(public)/security/page.tsx",
    "src/app/(public)/industries/page.tsx",
    "src/app/start/page.tsx",
  ];
  for (const r of routes) {
    assert.ok(existsSync(join(root, r)), `missing ${r}`);
  }
});

test("legacy redirects", () => {
  const checks: Array<{ file: string; target: string }> = [
    { file: "src/app/(public)/architecture/page.tsx", target: publicLegacyRedirects.architecture },
    { file: "src/app/(public)/modules/page.tsx", target: publicLegacyRedirects.modules },
    { file: "src/app/(public)/services/page.tsx", target: publicLegacyRedirects.services },
    { file: "src/app/(public)/clients/page.tsx", target: publicLegacyRedirects.clients },
    { file: "src/app/(public)/loyalty-programs/page.tsx", target: publicLegacyRedirects.loyaltyPrograms },
    {
      file: "src/app/experience/architects-map/page.tsx",
      target: publicLegacyRedirects.architectsMap,
    },
    {
      file: "src/app/experience/architects-map/article/page.tsx",
      target: publicLegacyRedirects.architectsMapArticle,
    },
  ];
  for (const { file, target } of checks) {
    const src = read(file);
    assert.ok(src.includes("redirect"), `${file} must redirect`);
    assert.ok(
      src.includes(target) || src.includes("publicLegacyRedirects"),
      `${file} must redirect to ${target}`,
    );
  }
});

test("case-studies and pricing are honest public pages", () => {
  const caseStudies = read("src/app/(public)/case-studies/page.tsx");
  const pricing = read("src/app/(public)/pricing/page.tsx");
  assert.ok(caseStudies.includes("CaseStudiesDeferredPageContent"));
  assert.ok(pricing.includes("PricingPageContent"));
  const pricingBody = read("src/components/public-site/public-canonical-pages-part2.tsx");
  assert.ok(pricingBody.includes("No public prices"));
  assert.ok(pricingBody.includes("CroAI"));
});

test("navigation structure — no story or modules-first nav", () => {
  const nav = read("src/components/public-site/public-site-navigation.tsx");
  assert.ok(nav.includes("How Crow Works"));
  assert.ok(nav.includes("Enterprise Blueprint"));
  assert.ok(!nav.includes("architects-map"));
  assert.ok(!nav.includes("/modules"));
  const siteNav = JSON.stringify(PUBLIC_SITE_NAV);
  assert.ok(siteNav.includes(publicRoutes.platform.cem));
  assert.ok(!siteNav.includes("/modules"));
});

test("footer canonical links only", () => {
  const footer = read("src/components/public-site/public-site-footer.tsx");
  assert.ok(footer.includes("PUBLIC_SITE_FOOTER_LINKS"));
  const hrefs = PUBLIC_SITE_FOOTER_LINKS.map((l) => l.href).join(" ");
  assert.ok(!hrefs.includes("architects-map"));
  assert.ok(!hrefs.includes("/modules"));
  assert.ok(!hrefs.includes("/architecture"));
});

test("journey handoff URLs", () => {
  const newUrl = buildSignupHandoffUrl("NEW");
  const transformUrl = buildSignupHandoffUrl("TRANSFORM");
  assert.ok(newUrl.includes(`journey=${journeyKindToUrlParam("NEW")}`));
  assert.ok(transformUrl.includes(`journey=${journeyKindToUrlParam("TRANSFORM")}`));
  assert.ok(newUrl.includes("next="));
  assert.ok(newUrl.includes("journey=new"));
  assert.ok(transformUrl.includes("journey=transform"));
});

test("hero uses real routes not preview anchors", () => {
  const hero = read("src/components/public-v2/public-hero-section.tsx");
  assert.ok(hero.includes("publicRoutes.newOrganization"));
  assert.ok(hero.includes("publicRoutes.howCrowWorks"));
  assert.ok(!hero.includes("PUBLIC_V2_PENDING_DESTINATIONS"));
});

test("bright identity on public layout", () => {
  const layout = read("src/components/public-site/public-site-layout.tsx");
  assert.ok(layout.includes(PUBLIC_V2_BRIGHT_IDENTITY_MARKER));
  assert.ok(layout.includes("public-v2-bright.css"));
});

test("commercial and CroAI boundaries in how-crow-works", () => {
  const content = read("src/components/public-site/public-canonical-pages-part1.tsx");
  assert.ok(content.includes("SAREA never grants permission"));
  assert.ok(content.includes("CroAI never grants authority"));
  assert.ok(content.includes("Payment does not grant authority"));
});

test("preview redirects to canonical homepage", () => {
  const preview = read("src/app/preview/public-home/page.tsx");
  assert.ok(preview.includes('redirect("/")'));
});

test("layout quality — no legacy dark shell on public routes", () => {
  const files = [
    "src/app/(public)/layout.tsx",
    "src/app/start/layout.tsx",
    "src/components/public-site/public-site-layout.tsx",
  ];
  for (const file of files) {
    const src = read(file);
    assert.ok(!src.includes("#04060c"), `${file} dark token`);
    assert.ok(!src.includes("cc-starfield"), `${file} dark starfield`);
  }
});

test("layout quality — no stagger overlap pattern in begins differently", () => {
  const begins = read("src/components/public-v2/public-begins-differently-section.tsx");
  assert.ok(!begins.includes("marginLeft"), "stagger margin removed");
});

test("bright depth tokens present", () => {
  const css = read("src/styles/public-v2-bright.css");
  assert.ok(css.includes("pv2-blueprint-grid"));
  assert.ok(css.includes("pv2-signature-hero"));
  assert.ok(css.includes("pv2-section-band"));
});

test("colorful public identity tokens present (CROW.PUBLIC.5)", () => {
  const css = read("src/styles/public-v2-bright.css");
  const tokens = read("src/lib/public-v2/tokens.ts");
  const layout = read("src/components/public-site/public-site-layout.tsx");
  assert.ok(css.includes("--pv2-teal"));
  assert.ok(css.includes("--pv2-gold"));
  assert.ok(css.includes("--pv2-navy"));
  assert.ok(css.includes("--pv2-purple"));
  assert.ok(css.includes("pv2-section-band-teal"));
  assert.ok(css.includes("pv2-section-band-gold"));
  assert.ok(tokens.includes("PUBLIC_V2_COLORFUL_IDENTITY_MARKER"));
  assert.ok(layout.includes("data-pv2-colorful"));
  assert.ok(!css.includes("#04060c"));
});

test("public access policy module exists", () => {
  assert.ok(read("src/lib/public/public-access-policy.ts").includes("PUBLIC_BROWSE_PATHS"));
});

test("foundation diagram uses grid not absolute overlap (CROW.PUBLIC.6)", () => {
  const diagram = read("src/components/public-v2/public-foundation-diagram.tsx");
  assert.ok(diagram.includes("pv2-foundation-grid"));
  assert.ok(!diagram.includes("left-0"));
  assert.ok(!diagram.includes("top-1/2"));
  assert.ok(!diagram.includes("marginLeft"));
});

test("semi-dark neon identity without legacy shell (CROW.PUBLIC.7)", () => {
  const css = read("src/styles/public-v2-bright.css");
  const tokens = read("src/lib/public-v2/tokens.ts");
  const layout = read("src/components/public-site/public-site-layout.tsx");
  assert.ok(css.includes("--pv2-bg: #131a28"));
  assert.ok(!css.includes("#04060c"));
  assert.ok(!css.includes("#f2ebe0"));
  assert.ok(!css.includes("#fffcf7"));
  assert.ok(tokens.includes("PUBLIC_V2_SEMI_DARK_IDENTITY_MARKER"));
  assert.ok(layout.includes("data-pv2-semi-dark"));
  assert.ok(css.includes("overflow-wrap: anywhere"));
});

test("auth contrast overrides for bright public frame (CROW.PUBLIC.6)", () => {
  const css = read("src/styles/public-v2-bright.css");
  const frame = read("src/components/public-site/public-auth-frame.tsx");
  assert.ok(frame.includes('data-public-auth="true"'));
  assert.ok(frame.includes("pv2-auth-form"));
  assert.ok(css.includes('[data-public-auth="true"] .pv2-auth-form .input-cc'));
  assert.ok(css.includes("::placeholder"));
  assert.ok(css.includes(".cc-btn-primary"));
});

test("page hero and journey presentation (CROW.PUBLIC.6)", () => {
  const content = read("src/components/public-site/public-content-page.tsx");
  const journey = read("src/components/public-site/public-client-journey-steps.tsx");
  const css = read("src/styles/public-v2-bright.css");
  assert.ok(content.includes("pv2-page-hero"));
  assert.ok(content.includes("PublicPageMood"));
  assert.ok(journey.includes("PUBLIC_CLIENT_JOURNEY_PHASES"));
  assert.ok(css.includes("pv2-journey-steps"));
  assert.ok(css.includes("pv2-page-mood-teal"));
});

test("signature hero avoids boxed card composition (CROW.PUBLIC.8)", () => {
  const hero = read("src/components/public-v2/public-hero-section.tsx");
  const visual = read("src/components/public-v2/public-hero-transformation-visual.tsx");
  const css = read("src/styles/public-v2-bright.css");
  assert.ok(hero.includes("pv2-signature-hero"));
  assert.ok(hero.includes("PublicHeroTransformationVisual"));
  assert.ok(!hero.includes("pv2-hero-panel"));
  assert.ok(!hero.includes("pv2-diagram-panel"));
  assert.ok(visual.includes("Organizational Intent"));
  assert.ok(visual.includes("Operating Model"));
  assert.ok(visual.includes("Enterprise Blueprint"));
  assert.ok(visual.includes("Operational Runtime"));
  assert.ok(visual.includes("People"));
  assert.ok(visual.includes("Responsibilities"));
  assert.ok(visual.includes("Workflows"));
  assert.ok(visual.includes("Trust"));
  assert.ok(css.includes("pv2-hero-stage-operating"));
  assert.ok(css.includes("pv2-hero-facet"));
});

test("journey conversion CTA uses muted amber class (CROW.PUBLIC.7)", () => {
  const css = read("src/styles/public-v2-bright.css");
  const tokens = read("src/lib/public-v2/tokens.ts");
  const hero = read("src/components/public-v2/public-hero-section.tsx");
  const journeyCard = read("src/components/public-v2/public-journey-card.tsx");
  assert.ok(css.includes(".pv2-btn-journey"));
  assert.ok(css.includes("#b45309"));
  assert.ok(tokens.includes("PUBLIC_V2_JOURNEY_CTA_CLASS"));
  assert.ok(hero.includes("PUBLIC_V2_JOURNEY_CTA_CLASS"));
  assert.ok(!hero.includes("pv2-btn-primary"));
  assert.ok(journeyCard.includes("PUBLIC_V2_JOURNEY_CTA_CLASS"));
});

test("bundle containment — no story or privileged imports in public-site/v2", () => {
  const dirs = [
    "src/components/public-site",
    "src/components/public-v2",
  ];
  const forbidden = [
    "@prisma/client",
    "crow-story/homepage-architects-map",
    "flying-crow",
    "scroll-story",
  ];
  for (const dir of dirs) {
    const walk = (p: string) => {
      const { readdirSync, statSync } = require("node:fs") as typeof import("node:fs");
      for (const name of readdirSync(p)) {
        const full = join(p, name);
        if (statSync(full).isDirectory()) walk(full);
        else if (name.endsWith(".tsx") || name.endsWith(".ts")) {
          const src = readFileSync(full, "utf8");
          for (const f of forbidden) {
            assert.ok(!src.includes(f), `${full} must not import ${f}`);
          }
        }
      }
    };
    walk(join(root, dir));
  }
});

console.log("public-route-architecture:test PASS");
