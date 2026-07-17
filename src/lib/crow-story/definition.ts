/** CROW.STORY.P1A — authoritative seven-chapter story definition (single copy source). */

import type { CrowStoryDefinition } from "./types";

export const CROW_STORY_DEFINITION_VERSION = "architects-map-v1.0.0" as const;

export const CROW_STORY_DEFINITION: CrowStoryDefinition = {
  version: CROW_STORY_DEFINITION_VERSION,
  chapters: [
    {
      key: "idea",
      index: 0,
      title: "The Idea",
      headline: "Every organization begins with something it wants to achieve.",
      supporting:
        "Crow starts from your purpose and expected outcomes — not from a list of software modules.",
      detail: "Before departments, shifts, or dashboards, there is work worth organizing well.",
      scrollHeightVhDesktop: 120,
      a11ySummary:
        "Crow begins with organizational purpose and outcomes rather than software module selection.",
      prohibitedTerms: ["revolutionize", "unlock infinite", "transform everything"],
      beats: [
        { progressStart: 0, progressEnd: 0.25, visualPatch: { gridOpacity: 0 } },
        { progressStart: 0.25, progressEnd: 0.55, visualPatch: { gridOpacity: 0.04 } },
        { progressStart: 0.55, progressEnd: 0.85, visualPatch: { crowPose: "entering" } },
        { progressStart: 0.85, progressEnd: 1, visualPatch: { gridOpacity: 0.08, crowPose: "perch" } },
      ],
    },
    {
      key: "choice",
      index: 1,
      title: "New or Transform",
      headline: "Are you building something new, or improving what already exists?",
      supporting: "Both paths use the same Crow method. The starting point is different.",
      detail: "You can change this choice before you create an account.",
      helper: "Scrolling does not select a path. Choose an option to preview your journey.",
      scrollHeightVhDesktop: 140,
      a11ySummary:
        "Choose whether you are designing a new organization or transforming an existing one. Scrolling does not select a path.",
      prohibitedTerms: ["pick your destiny", "choose your adventure"],
      beats: [
        { progressStart: 0, progressEnd: 0.3, visualPatch: { crowPose: "center-choice" } },
        { progressStart: 0.3, progressEnd: 1, visualPatch: { crowPose: "center-choice" } },
      ],
    },
    {
      key: "signals",
      index: 2,
      title: "The Signals",
      headline: "Crow begins by understanding your context.",
      supporting: "Field, purpose, scale, current situation, constraints, and growth shape the first map.",
      detail: "You do not need departments or job descriptions to begin.",
      scrollHeightVhDesktop: 150,
      a11ySummary:
        "Crow collects business field, purpose, scale, situation, constraints, and growth intention as signals.",
      prohibitedTerms: ["Crow reads your mind"],
      beats: [],
    },
    {
      key: "people",
      index: 3,
      title: "People and Work Personas",
      headline: "Crow organizes work around responsibility — not only job titles.",
      supporting:
        "A job title says what you are called. An authorized role defines what you are allowed to do. A Work Persona explains what you are responsible for in this operational context.",
      detail:
        "Crow is not designed only around static job titles, departments, and office routines. It organizes work around responsibilities, workflow positions, decisions, evidence, and outcomes — while still supporting conventional employment structures when needed.",
      scrollHeightVhDesktop: 135,
      a11ySummary:
        "Work Personas describe operational responsibility. Job titles, authorized roles, and HR structures remain supported.",
      prohibitedTerms: ["job titles are dead", "no more HR", "attendance is obsolete"],
      beats: [],
    },
    {
      key: "work",
      index: 4,
      title: "Work and Foundation",
      headline: "Work moves through responsibilities, decisions, and evidence.",
      supporting:
        "Triggers start work. Outcomes close it. Capabilities and information support the flow — customers, projects, cases, documents, assets, finance, people, inventory, procurement, automation, and reporting.",
      detail: "This is one operating network — not a module grid.",
      scrollHeightVhDesktop: 155,
      a11ySummary:
        "Workflows connect triggers, responsibilities, decisions, evidence, and outcomes across a capability foundation.",
      prohibitedTerms: ["50 apps in one"],
      beats: [],
    },
    {
      key: "trust",
      index: 5,
      title: "Trust, Experience, and Blueprint",
      headline: "Trust, role experience, and Blueprint bring the model together.",
      supporting:
        "CyberCrow protects trust and evidence. SAREA adapts presentation but does not grant authority. The Blueprint becomes your reviewable operating model.",
      detail:
        "Watch points mark identity, approvals, information boundaries, segregation of duties, audit evidence, and risk. SAREA lenses show how each role sees the same foundation.",
      scrollHeightVhDesktop: 170,
      a11ySummary:
        "CyberCrow provides trust signals. SAREA adapts views. The Blueprint crystallizes the operating model.",
      prohibitedTerms: ["SAREA grants access", "CyberCrow certifies compliance"],
      beats: [],
    },
    {
      key: "runtime",
      index: 6,
      title: "Runtime",
      headline: "The Blueprint becomes work you can run.",
      supporting:
        "Your workspace answers what needs attention, what you are responsible for, which decisions wait, what is blocked, what evidence is missing, and which outcome you contribute to.",
      detail: "Crow steps back. Your organization operates.",
      scrollHeightVhDesktop: 115,
      a11ySummary:
        "Runtime is work-first and role-aware. Attention, decisions, workflows, and outcomes stay visible.",
      prohibitedTerms: ["instant provisioning"],
      beats: [],
    },
  ],
  variants: {
    NEW: {
      journey: "NEW",
      copyOverrides: {
        signals: {
          headline: "Crow begins by understanding your context.",
          supporting:
            "Field, purpose, scale, and growth shape the first map. You do not need departments yet.",
        },
        work: {
          headline: "Work moves through responsibilities, decisions, and evidence.",
          supporting: "From a sparse territory, Crow designs how work should flow as you grow.",
        },
      },
    },
    TRANSFORM: {
      journey: "TRANSFORM",
      copyOverrides: {
        signals: {
          headline: "Crow begins by reading how your organization works today.",
          supporting:
            "Field, purpose, scale, constraints, and friction shape the first map. Crow preserves what works.",
        },
        work: {
          headline: "Crow maps how work moves today — and where it should move next.",
          supporting: "Existing routes stay visible while target improvements are designed.",
        },
      },
    },
  },
};

export function getStoryChapter(key: string) {
  return CROW_STORY_DEFINITION.chapters.find((c) => c.key === key);
}

export function resolveChapterCopy(
  chapterKey: string,
  journey: import("./types").JourneyKind | null,
) {
  const chapter = CROW_STORY_DEFINITION.chapters.find((c) => c.key === chapterKey);
  if (!chapter) {
    return { title: "", headline: "", supporting: "" as string | undefined };
  }
  const overrides = journey
    ? CROW_STORY_DEFINITION.variants[journey].copyOverrides[
        chapter.key as keyof typeof CROW_STORY_DEFINITION.variants.NEW.copyOverrides
      ]
    : undefined;
  return {
    title: chapter.title,
    headline: overrides?.headline ?? chapter.headline,
    supporting: overrides?.supporting ?? chapter.supporting,
    detail: chapter.detail,
    helper: chapter.helper,
  };
}
