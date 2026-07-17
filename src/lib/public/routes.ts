/** CROW.PUBLIC.2 — canonical public route paths (feature branch). */

export const publicRoutes = {
  home: "/",
  howCrowWorks: "/how-crow-works",
  newOrganization: "/new-organization",
  transformExisting: "/transform-existing",
  enterpriseBlueprint: "/enterprise-blueprint",
  platform: {
    overview: "/platform",
    cem: "/platform/cem",
    cybercrow: "/platform/cybercrow",
    sarea: "/platform/sarea",
    procrow: "/platform/procrow",
  },
  security: "/security",
  industries: "/industries",
  start: "/start",
  request: "/request",
  signup: "/signup",
  login: "/login",
  pricing: "/pricing",
  about: "/about",
  caseStudies: "/case-studies",
} as const;

export const publicLegacyRedirects = {
  architecture: "/how-crow-works",
  modules: "/platform/cem",
  services: "/how-crow-works",
  architectsMap: "/how-crow-works",
  architectsMapArticle: "/how-crow-works",
  clients: "/industries",
  loyaltyPrograms: "/how-crow-works",
} as const;
