/**
 * A1 — Crow product UX principles (portal IA + interaction discipline).
 */

export const CROW_UX_PRINCIPLES = [
  {
    id: "one_primary_job",
    title: "One screen, one primary job",
    summary: "Each page should answer one question and offer one dominant next action.",
  },
  {
    id: "next_action_first",
    title: "Show the next action first",
    summary: "Lead with what the user should do now — status and history follow.",
  },
  {
    id: "progressive_disclosure",
    title: "Progressive disclosure over dense panels",
    summary: "Hide secondary operator detail behind sections, tabs, or accordions.",
  },
  {
    id: "simple_portal_language",
    title: "Use simple portal language",
    summary: "Say Client Portal, Business Portal, and ProCrow — not internal codenames.",
  },
  {
    id: "separate_client_operator",
    title: "Separate client work from operator work",
    summary: "Clients configure and approve; operators prepare, govern, and validate.",
  },
  {
    id: "readiness_vs_launch",
    title: "Separate readiness from production launch",
    summary: "Runtime preparation and Go/No-Go are not the same as billing or production promotion.",
  },
  {
    id: "summary_patterns",
    title: "Cards, tables, and timelines",
    summary: "Use cards for summaries, tables for lists, and timelines for processes.",
  },
  {
    id: "status_chips",
    title: "Status chips consistently",
    summary: "Reuse chip tones for pending, ready, blocked, and accepted states.",
  },
  {
    id: "helpful_empty_states",
    title: "Empty states explain next steps",
    summary: "When there is no data, tell the user what to do next — not just “none”.",
  },
  {
    id: "visible_safety",
    title: "Safety notes stay visible but calm",
    summary: "Keep advisory and scope limits visible without dominating the layout.",
  },
] as const;

export type CrowUxPrinciple = (typeof CROW_UX_PRINCIPLES)[number];

export const CROW_UX_PRINCIPLE_IDS = CROW_UX_PRINCIPLES.map((p) => p.id);
