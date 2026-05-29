/**
 * L1 — Commercial lifecycle (copy/model only). No checkout activation or payment providers.
 */

export type CommercialLifecycleStep = {
  id: string;
  label: string;
  summary: string;
  paymentNote?: string;
};

export const COMMERCIAL_LIFECYCLE_STEPS: CommercialLifecycleStep[] = [
  {
    id: "browse",
    label: "Public browsing",
    summary: "Explore modules, industries, security, and pricing — no account required.",
  },
  {
    id: "account_request",
    label: "Account + request",
    summary: "Sign in, then submit your ERP/CEM implementation request — linked to your user.",
  },
  {
    id: "discovery",
    label: "Discovery / blueprint",
    summary: "Operator-guided discovery and blueprint — staging clients; commercial terms reviewed later.",
    paymentNote: "May become a deposit in a future commercial phase — not activated here.",
  },
  {
    id: "scope_approval",
    label: "Scope approval",
    summary: "Client confirms interest and scope — not a payment event.",
  },
  {
    id: "setup_invoice",
    label: "Setup / onboarding invoice",
    summary: "Manual commercial step after scope approval.",
    paymentNote: "Setup/onboarding fee is reviewed after scope approval.",
  },
  {
    id: "setup_paid",
    label: "Setup payment confirmed",
    summary: "ProCrow records manual confirmation — no automated billing in this build.",
  },
  {
    id: "tenant_build",
    label: "Tenant build / configuration",
    summary: "ProCrow-controlled readiness — modules, org model, trust, experience.",
  },
  {
    id: "go_no_go",
    label: "Go / No-Go review",
    summary: "F23-gated deployment discipline before runtime handoff.",
  },
  {
    id: "runtime_ready",
    label: "Tenant runtime ready",
    summary: "CEM operational shell prepared for day-to-day modules.",
  },
  {
    id: "subscription",
    label: "Subscription after go-live",
    summary: "Monthly subscription begins after tenant runtime is ready.",
    paymentNote: "Payments remain manual/deferred in this staging build.",
  },
  {
    id: "onboarding_support",
    label: "First 30 days",
    summary: "Onboarding support period — guided adoption, not a waived first subscription period.",
  },
];

export const COMMERCIAL_LIFECYCLE_SAFETY_COPY =
  "No automated checkout, payment providers, or subscription activation in this staging build." as const;
