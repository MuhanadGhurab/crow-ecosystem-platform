"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { submitImplementationRequest } from "@/lib/actions/implementation-request";
import { CEM_MODULES, type CemModuleKey } from "@/lib/constants/modules";
import { DISCOVERY_INDUSTRY_OPTIONS } from "@/lib/constants/industry-templates";
import { SECURITY_PACKAGES, type SecurityPackageKey } from "@/lib/constants/security-packages";
import { SUBSCRIPTION_TIERS, type SubscriptionTierKey } from "@/lib/constants/subscriptions";
import type { ImplementationRequestInput } from "@/lib/types/platform";
import {
  intakeHttpErrorMessage,
  validatePublicIntakeClient,
} from "@/lib/security/public-intake-schema";
import { RequestLiveSummary } from "@/components/public/request-live-summary";
import { RequestWizardStepper } from "@/components/public/request-wizard-stepper";
import { TurnstileField } from "@/components/public/turnstile-field";

const STEPS = ["01", "02", "03", "04", "05"] as const;

const EMPLOYEE_BANDS = [
  { value: "", label: "Select band (optional)" },
  { value: "1-50", label: "1 – 50 employees" },
  { value: "51-250", label: "51 – 250 employees" },
  { value: "251-1000", label: "251 – 1,000 employees" },
  { value: "1000+", label: "1,000+ employees" },
] as const;

function FormStep({
  step,
  title,
  hint,
  active,
  children,
}: {
  step: string;
  title: string;
  hint?: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`cc-form-section cc-form-step animate-cc-fade-up ${active ? "cc-form-step-active" : ""}`}
      data-step={step}
    >
      <div className="mb-5 flex items-start gap-4">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold ring-1 transition duration-300 ${
            active
              ? "bg-gradient-to-br from-cyan-500/30 to-violet-600/30 text-white ring-cyan-400/50"
              : "bg-gradient-to-br from-violet-600/20 to-cyan-500/10 text-cc-star ring-amber-400/20"
          }`}
        >
          {step}
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
          {hint && <p className="mt-1 text-sm text-slate-400">{hint}</p>}
        </div>
      </div>
      <div className="space-y-4 pl-0 sm:pl-14">{children}</div>
    </section>
  );
}

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
      {children}
    </label>
  );
}

function computeProgress(fields: {
  org: string;
  contactName: string;
  contactEmail: string;
  planKey: SubscriptionTierKey;
  modules: CemModuleKey[];
  security: SecurityPackageKey[];
}): number {
  let score = 0;
  if (fields.org.trim().length >= 2) score += 20;
  if (fields.planKey) score += 20;
  if (fields.modules.length > 0) score += 20;
  if (fields.security.length > 0) score += 20;
  if (fields.contactName.trim() && fields.contactEmail.includes("@")) score += 20;
  return score;
}

export function ImplementationRequestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<(typeof STEPS)[number]>("01");

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTierKey>("growth");
  const [selectedModules, setSelectedModules] = useState<CemModuleKey[]>([]);
  const [selectedSecurity, setSelectedSecurity] = useState<SecurityPackageKey[]>([]);
  const [orgName, setOrgName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const progressPct = useMemo(
    () =>
      computeProgress({
        org: orgName,
        contactName,
        contactEmail,
        planKey: selectedPlan,
        modules: selectedModules,
        security: selectedSecurity,
      }),
    [orgName, contactName, contactEmail, selectedPlan, selectedModules, selectedSecurity]
  );

  const toggleModule = useCallback((key: CemModuleKey, checked: boolean) => {
    setSelectedModules((prev) => (checked ? [...prev, key] : prev.filter((k) => k !== key)));
  }, []);

  const toggleSecurity = useCallback((key: SecurityPackageKey, checked: boolean) => {
    setSelectedSecurity((prev) => (checked ? [...prev, key] : prev.filter((k) => k !== key)));
  }, []);

  const focusStep = useCallback((step: (typeof STEPS)[number]) => {
    setActiveStep(step);
  }, []);

  async function handleSubmit(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    const form = formRef.current;
    if (!form) return;

    setStatus("loading");
    setErrorMessage(null);
    const fd = new FormData(form);

    const honeypot = String(fd.get("companyWebsite") || "");
    const intakeMeta = {
      companyWebsite: honeypot,
      turnstileToken,
    };

    const payload: ImplementationRequestInput = {
      organizationName: String(fd.get("organizationName")),
      organizationNameAr: String(fd.get("organizationNameAr") || "") || undefined,
      industry: String(fd.get("industry") || "") || undefined,
      planKey: selectedPlan,
      moduleKeys: selectedModules,
      securityPackageKeys: selectedSecurity,
      contact: {
        fullName: String(fd.get("contactName")),
        email: String(fd.get("contactEmail")),
        phone: String(fd.get("contactPhone") || "") || undefined,
      },
    };

    const clientCheck = validatePublicIntakeClient(payload);
    if (!clientCheck.ok) {
      setErrorMessage(clientCheck.message);
      setStatus("error");
      return;
    }

    const apiBody = { ...payload, ...intakeMeta };

    try {
      const res = await fetch("/api/implementation-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiBody),
      });
      if (res.ok) {
        const data = await res.json();
        setReference(data.referenceCode ?? data.id);
        setStatus("success");
        return;
      }
      let errBody: unknown = null;
      try {
        errBody = await res.json();
      } catch {
        /* non-json */
      }
      setErrorMessage(intakeHttpErrorMessage(res.status, errBody));
      setStatus("error");
      return;
    } catch {
      /* server action fallback */
    }

    try {
      const result = await submitImplementationRequest(payload, intakeMeta);
      setReference(result.referenceCode);
      setStatus("success");
    } catch (e) {
      setErrorMessage(
        e instanceof Error ? e.message : "We could not submit your request. Please try again."
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="cc-success-panel animate-cc-fade-up text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/15 ring-1 ring-teal-400/40">
          <span className="text-3xl text-teal-300" aria-hidden>
            ✓
          </span>
        </div>
        <h2 className="mt-6 font-display text-2xl font-bold text-white">Request received</h2>
        <p className="mt-2 text-slate-400">Your reference code — save it for follow-up with our team.</p>
        <p className="mt-4 inline-block rounded-xl border border-amber-400/30 bg-amber-400/10 px-6 py-3 font-mono text-lg text-cc-star">
          {reference}
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-200">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          PENDING_REVIEW
        </p>
        <p className="mt-6 text-sm text-slate-400">
          Sign in with Microsoft using the same work email to track this request in your client portal.
        </p>
        <Link
          href="/login?next=/portal/requests"
          className="cc-btn-primary mt-4 inline-flex"
        >
          Sign in to track
        </Link>
        <Link href="/" className="mt-4 block text-sm text-slate-500 hover:text-slate-400">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <>
      <RequestWizardStepper
        activeStep={activeStep}
        onStepClick={(step) => focusStep(step as (typeof STEPS)[number])}
      />
      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:items-start lg:gap-10">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-8 lg:space-y-10"
          onFocusCapture={(ev) => {
            const step = (ev.target as HTMLElement).closest("[data-step]")?.getAttribute("data-step");
            if (step && STEPS.includes(step as (typeof STEPS)[number])) {
              setActiveStep(step as (typeof STEPS)[number]);
            }
          }}
        >
          <FormStep
            step="01"
            title="Organization"
            hint="Tenant identity for the admin review queue."
            active={activeStep === "01"}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="organizationName">Name (English)</FieldLabel>
                <input
                  id="organizationName"
                  name="organizationName"
                  required
                  maxLength={200}
                  placeholder="Acme Holdings"
                  className="input-cc transition focus:ring-2 focus:ring-cyan-400/30"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  onFocus={() => focusStep("01")}
                />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="organizationNameAr">Name (Arabic)</FieldLabel>
                <input
                  id="organizationNameAr"
                  name="organizationNameAr"
                  maxLength={200}
                  placeholder="اسم المنشأة"
                  dir="rtl"
                  className="input-cc text-right transition focus:ring-2 focus:ring-cyan-400/30"
                  onFocus={() => focusStep("01")}
                />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="industry">Industry</FieldLabel>
                <select
                  id="industry"
                  name="industry"
                  className="input-cc transition focus:ring-2 focus:ring-cyan-400/30"
                  defaultValue=""
                  onFocus={() => focusStep("01")}
                >
                  {DISCOVERY_INDUSTRY_OPTIONS.map((o) => (
                    <option key={o.value || "general"} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="employeeBand">Employee band</FieldLabel>
                <select
                  id="employeeBand"
                  name="employeeBand"
                  className="input-cc transition focus:ring-2 focus:ring-cyan-400/30"
                  defaultValue=""
                  onFocus={() => focusStep("01")}
                >
                  {EMPLOYEE_BANDS.map((o) => (
                    <option key={o.value || "none"} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-slate-500">
                  Helps Crow size discovery templates and SAREA persona defaults.
                </p>
              </div>
            </div>
          </FormStep>

          <FormStep
            step="02"
            title="Subscription tier"
            hint="CEM base plan — modules and CyberCrow add on top."
            active={activeStep === "02"}
          >
            <p className="mb-3 text-xs text-cyan-400/90">
              <span className="cc-entity-badge cc-entity-badge--cem !inline-flex !py-0.5">CEM</span> platform fee
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {SUBSCRIPTION_TIERS.map((t) => (
                <label key={t.key} className="cc-choice-card group cursor-pointer">
                  <input
                    type="radio"
                    name="planKey"
                    value={t.key}
                    required
                    className="sr-only"
                    checked={selectedPlan === t.key}
                    onChange={() => {
                      setSelectedPlan(t.key);
                      focusStep("02");
                    }}
                  />
                  <div className="cc-choice-card-inner">
                    <span className="text-2xl transition-transform duration-200 group-hover:scale-110">
                      {t.icon}
                    </span>
                    <p className="mt-3 font-display font-semibold text-white">{t.nameEn}</p>
                    <p className="mt-1 text-xs text-slate-500">{t.nameAr}</p>
                    <p className="mt-4 font-display text-xl font-bold text-cc-star">
                      {t.baseMonthlySar.toLocaleString()}
                      <span className="text-xs font-normal text-slate-500"> SAR/mo</span>
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">{t.descriptionEn}</p>
                    {t.authMode === "entra_id" && (
                      <span className="cc-star-badge mt-3 !text-[9px]">Entra ID SSO</span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </FormStep>

          <FormStep
            step="03"
            title="Operational modules"
            hint="CEM modules seeded at provision — select what the tenant will run."
            active={activeStep === "03"}
          >
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {CEM_MODULES.map((m) => (
                <label key={m.key} className="cc-choice-chip group cursor-pointer">
                  <input
                    type="checkbox"
                    name="modules"
                    value={m.key}
                    className="sr-only"
                    checked={selectedModules.includes(m.key)}
                    onChange={(e) => {
                      toggleModule(m.key, e.target.checked);
                      focusStep("03");
                    }}
                  />
                  <span className="cc-choice-chip-inner">
                    <span className="text-lg transition-transform duration-200 group-hover:scale-110">
                      {m.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-white">{m.nameEn}</span>
                      <span className="text-xs text-cyan-400/80">+{m.monthlyAddonSar} SAR</span>
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </FormStep>

          <FormStep
            step="04"
            title="CyberCrow security"
            hint="NCA-aware packages — seeded at tenant provision."
            active={activeStep === "04"}
          >
            <p className="mb-3 text-xs text-violet-300/90">
              <span className="cc-entity-badge cc-entity-badge--cybercrow !inline-flex !py-0.5">CyberCrow</span>{" "}
              security dept deliverable
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {SECURITY_PACKAGES.map((p) => (
                <label key={p.key} className="cc-choice-card group cursor-pointer">
                  <input
                    type="checkbox"
                    name="security"
                    value={p.key}
                    className="sr-only"
                    checked={selectedSecurity.includes(p.key)}
                    onChange={(e) => {
                      toggleSecurity(p.key, e.target.checked);
                      focusStep("04");
                    }}
                  />
                  <div className="cc-choice-card-inner cc-choice-violet h-full">
                    <span className="text-2xl transition-transform duration-200 group-hover:scale-110">
                      {p.icon}
                    </span>
                    <p className="mt-2 font-semibold text-white">{p.nameEn}</p>
                    <p className="mt-2 text-sm font-medium text-violet-300">
                      +{p.monthlyAddonSar.toLocaleString()} SAR/mo
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">{p.descriptionEn}</p>
                  </div>
                </label>
              ))}
            </div>
          </FormStep>

          <FormStep
            step="05"
            title="Primary contact"
            hint="We will reach out to schedule discovery."
            active={activeStep === "05"}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="contactName">Full name</FieldLabel>
                <input
                  id="contactName"
                  name="contactName"
                  required
                  maxLength={200}
                  placeholder="Your name"
                  className="input-cc transition focus:ring-2 focus:ring-cyan-400/30"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  onFocus={() => focusStep("05")}
                />
              </div>
              <div>
                <FieldLabel htmlFor="contactEmail">Work email</FieldLabel>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  required
                  maxLength={254}
                  placeholder="you@company.com"
                  className="input-cc transition focus:ring-2 focus:ring-cyan-400/30"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  onFocus={() => focusStep("05")}
                />
              </div>
              <div>
                <FieldLabel htmlFor="contactPhone">Phone (optional)</FieldLabel>
                <input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  maxLength={40}
                  placeholder="+966 …"
                  className="input-cc transition focus:ring-2 focus:ring-cyan-400/30"
                  onFocus={() => focusStep("05")}
                />
              </div>
            </div>
            <div
              className="absolute -left-[9999px] h-px w-px overflow-hidden opacity-0"
              aria-hidden
            >
              <label htmlFor="companyWebsite">Company website</label>
              <input
                id="companyWebsite"
                name="companyWebsite"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <TurnstileField onTokenChange={setTurnstileToken} />
          </FormStep>

          <div className="cc-submit-panel hidden lg:block">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">
                Status after submit: <span className="font-mono text-cc-star">PENDING_REVIEW</span>
              </p>
              <button type="submit" disabled={status === "loading"} className="cc-btn-primary min-w-[14rem] px-8">
                {status === "loading" ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-cc-spin-slow rounded-full border-2 border-white/30 border-t-white" />
                    Submitting…
                  </span>
                ) : (
                  "Submit request →"
                )}
              </button>
            </div>
            {status === "error" && (
              <p className="cc-alert-error mt-4 animate-cc-fade-up" role="alert">
                {errorMessage ??
                  "We could not submit your request. Check required fields and try again."}
              </p>
            )}
          </div>
        </form>

        <aside className="hidden lg:block lg:sticky lg:top-24">
          <RequestLiveSummary
            planKey={selectedPlan}
            moduleKeys={selectedModules}
            securityKeys={selectedSecurity}
            progressPct={progressPct}
          />
          <button
            type="button"
            disabled={status === "loading"}
            onClick={() => formRef.current?.requestSubmit()}
            className="cc-btn-primary mt-4 w-full"
          >
            {status === "loading" ? "Submitting…" : "Submit request →"}
          </button>
        </aside>
      </div>

          <div className="cc-sticky-submit">
        <RequestLiveSummary
          compact
          planKey={selectedPlan}
          moduleKeys={selectedModules}
          securityKeys={selectedSecurity}
          progressPct={progressPct}
          showSubmit
          loading={status === "loading"}
          onSubmit={() => formRef.current?.requestSubmit()}
        />
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        Need catalog reference first?{" "}
        <Link href="/pricing" className="text-cyan-400 hover:text-cyan-300">
          View pricing tiers →
        </Link>
      </p>
    </>
  );
}
