/**
 * L3 — Public + Client Portal UX copy (no payment activation, no overclaims).
 */

export const PUBLIC_HERO_OUTCOME =
  "Crow helps you map departments, roles, workflows, modules, trust posture, and role-based experience before tenant runtime begins." as const;

export const PUBLIC_ACCOUNT_REQUEST_NOTE =
  "Browse freely. Create an account or sign in to submit your ERP/CEM request — tracked in your Client Portal." as const;

export const CLIENT_PORTAL_PURPOSE =
  "Request and configure Crow — discovery, proposals, scope approval, and onboarding. Day-to-day operations happen in the Business Portal." as const;

export const SIGNUP_CLIENT_PURPOSE =
  "Create an account to submit and track your ERP request. Client Portal covers proposals, blueprint review, scope approval, and onboarding." as const;

export const LOGIN_CLIENT_PURPOSE =
  "Sign in to submit and track your ERP request. Client Portal covers proposals, blueprint review, scope approval, and onboarding." as const;

export const LOGIN_INTERNAL_NOTE =
  "ProCrow / Platform Admin is for internal operators only — not a customer sign-in path." as const;

export const PRICING_COMMERCIAL_HONESTY = {
  advisory:
    "Catalog pricing is advisory for staging and discovery — final commercial terms follow blueprint review.",
  setupFee: "Setup/onboarding fee is reviewed after scope approval — not a checkout on this site.",
  subscription:
    "Monthly subscription is discussed after tenant runtime is ready — not activated from this portal.",
  onboardingSupport:
    "First 30 days after go-live focus on onboarding support — not a promotional waived subscription period.",
  noCheckout: "Checkout and payment providers are not enabled in this build.",
} as const;

export const CLIENT_REQUEST_JOURNEY_STEPS = [
  "Submit request (signed in)",
  "ProCrow reviews intake",
  "Discovery & blueprint",
  "Proposal & commercial alignment",
  "Scope approval (Client Portal)",
  "Onboarding & tenant readiness",
] as const;

export const PUBLIC_MODULES_INTRO = {
  title: "Operational modules",
  body: "CEM modules are business areas (HR, finance, CRM, logistics, …). ProCrow prepares them through discovery and blueprint; day-to-day use happens in Tenant Runtime / CEM after governed go-live.",
  runtime:
    "Modules connect through workflows, tasks, reports, CyberCrow trust signals, and SAREA experience — not as isolated silos.",
} as const;

export const PUBLIC_INDUSTRIES_INTRO =
  "Sector templates are operating-model readiness packs — logistics, retail, construction, aviation, and healthcare models on staging. Operators tailor them in discovery; nothing instant-provisions production from this page." as const;
