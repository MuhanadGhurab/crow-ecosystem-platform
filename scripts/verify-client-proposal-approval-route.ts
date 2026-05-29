/**
 * K2.3 — Client proposal review routes (authenticated vs public token).
 *
 *   npm run client-proposal-route:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const FORBIDDEN_PHRASES = [
  "pay now",
  "live checkout",
  "activate live payments",
  "automatic tenant provisioning",
  "auto-provision tenant",
  "production go-live approved",
  "legally binding",
  "e-signature complete",
  "auto-provision",
] as const;

function fail(msg: string) {
  console.error(`FAIL: ${msg}`);
  return false;
}

function ok(msg: string) {
  console.log(`OK: ${msg}`);
  return true;
}

function fileText(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function main() {
  let passed = true;
  const check = (cond: boolean, passMsg: string, failMsg: string) => {
    if (cond) ok(passMsg);
    else {
      fail(failMsg);
      passed = false;
    }
  };

  console.log("\n=== K2.3 Client proposal approval routes ===\n");

  const pkg = fileText("package.json");
  check(
    pkg.includes('"client-proposal-route:verify"'),
    "package.json defines client-proposal-route:verify",
    "Add client-proposal-route:verify script"
  );

  const reviewService = fileText("src/lib/services/client-review.service.ts");
  check(
    reviewService.includes("routes.client.proposal") &&
      reviewService.includes("buildRequestReviewLinksFromBlueprint"),
    "Review links use authenticated client proposal route",
    "buildClientRequestReviewLinks must prefer routes.client.proposal"
  );
  check(
    reviewService.includes("resolveClientProposalFromToken"),
    "Token can resolve to client proposal id",
    "Add resolveClientProposalFromToken"
  );

  const requestDetail = fileText("src/app/client/requests/[requestId]/page.tsx");
  check(
    requestDetail.includes("buildClientRequestReviewLinks"),
    "Client request detail uses review links service",
    "Request detail must use buildClientRequestReviewLinks"
  );
  check(
    requestDetail.includes("Open proposal") && requestDetail.includes("proposalHref"),
    "Client request detail primary CTA is Open proposal via proposalHref",
    "Client request detail must link Open proposal to proposalHref"
  );
  check(
    !requestDetail.includes("routes.public.proposal"),
    "Client request detail does not use public token as primary route",
    "Remove routes.public.proposal from client request detail"
  );

  const portalRequest = fileText("src/app/portal/requests/[requestId]/page.tsx");
  check(
    portalRequest.includes("buildClientRequestReviewLinks") &&
      !portalRequest.includes("routes.public.proposal"),
    "Legacy portal request detail uses client proposal route",
    "Portal request detail must not link Open proposal to public token"
  );

  const proposalDetail = fileText("src/app/client/proposals/[proposalId]/page.tsx");
  check(
    proposalDetail.includes("ClientProposalApprovalPanel") &&
      proposalDetail.includes("getClientApprovalEligibility"),
    "Authenticated proposal page includes approval panel",
    "Wire ClientProposalApprovalPanel + eligibility on client proposal page"
  );
  check(
    proposalDetail.includes("ClientReviewFeedbackPanel"),
    "Authenticated proposal page includes review feedback",
    "Client proposal page must include ClientReviewFeedbackPanel"
  );

  const tokenPage = fileText("src/app/proposal/[token]/page.tsx");
  check(
    !tokenPage.includes("approveClientProposalScopeAction") &&
      !tokenPage.includes("ProposalClientActions") &&
      !tokenPage.includes("approveProposalByToken"),
    "Public token page has no approval mutation controls",
    "Public proposal page must not wire approval actions"
  );
  check(
    tokenPage.includes("ProposalTokenClientPortalCta") ||
      tokenPage.includes("Open in Client Portal"),
    "Public token page offers Client Portal CTA",
    "Add ProposalTokenClientPortalCta to public proposal page"
  );

  const approvalService = fileText("src/lib/services/client-approval.service.ts");
  check(
    approvalService.includes("canApproveScope") &&
      approvalService.includes("getClientOrganizationAccessDecisionForRequest"),
    "Approval gated on canApproveScope + org access decision",
    "client-approval.service must use canApproveScope"
  );
  check(
    approvalService.includes("ownership_unverified") ||
      approvalService.includes("email_only_review"),
    "Email-only reviewers blocked from approval",
    "Approval must block ownership_unverified / email_only_review"
  );

  const blueprintPage = fileText("src/app/client/blueprints/[blueprintId]/page.tsx");
  check(
    blueprintPage.includes("routes.client.proposal") &&
      !blueprintPage.includes("routes.public.proposal"),
    "Blueprint page links to client proposal (not public token)",
    "Blueprint detail must use routes.client.proposal"
  );

  for (const rel of [
    "src/app/client/requests/[requestId]/page.tsx",
    "src/app/proposal/[token]/page.tsx",
    "src/components/client-portal/proposal-token-client-portal-cta.tsx",
  ]) {
    const lower = fileText(rel).toLowerCase();
    for (const phrase of FORBIDDEN_PHRASES) {
      check(!lower.includes(phrase), `No forbidden phrase in ${rel}`, `Forbidden "${phrase}" in ${rel}`);
    }
  }

  console.log(passed ? "\nclient-proposal-route:verify PASSED\n" : "\nclient-proposal-route:verify FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
