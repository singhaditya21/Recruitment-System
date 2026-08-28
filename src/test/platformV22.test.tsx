import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../App";
import {
  agencySubmissions,
  candidateTasks,
  eventRegistrations,
  highVolumeCampaigns,
  jobAlerts,
  lifecycleDepthSummary,
  localeVariants,
  recoveryScenarios,
  referralRewards,
  savedJobs,
  screeningCases,
} from "../data/lifecycleDepth";

function open(hash: string) {
  window.location.hash = hash;
  return render(<App />);
}

describe("v2.2 deep journey contracts", () => {
  it("reconciles every deep-journey seed family", () => {
    expect(lifecycleDepthSummary).toEqual({
      candidateTasks: 6,
      screeningCases: 32,
      savedJobs: 4,
      jobAlerts: 3,
      eventRegistrations: 36,
      referralRewards: 24,
      agencySubmissions: 32,
      highVolumeCampaigns: 8,
      localeVariants: 12,
      recoveryScenarios: 24,
    });
    expect(new Set([...candidateTasks, ...screeningCases, ...savedJobs, ...jobAlerts, ...eventRegistrations, ...referralRewards, ...agencySubmissions, ...highVolumeCampaigns, ...localeVariants, ...recoveryScenarios].map((item) => item.id)).size).toBe(181);
  });

  it("renders candidate saved jobs, alerts, events and regulated tasks", async () => {
    const user = userEvent.setup();
    const savedView = open("#/saved-jobs");
    expect(screen.getByRole("heading", { name: "Keep track without losing control." })).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "Remove" })[0]);
    expect(screen.queryByText("SVJ-001 · saved Aug 27")).not.toBeInTheDocument();
    savedView.unmount();

    const eventView = open("#/events/EVT-DEMO-002");
    expect(screen.getByRole("heading", { name: /Data platform open house/i })).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Register in demo" }));
    expect(screen.getByText("ERG-MEM-001 · memory only")).toBeInTheDocument();
    eventView.unmount();

    open("#/my-tasks");
    expect(screen.getByRole("heading", { name: "Know what is requested and how to get help." })).toBeInTheDocument();
    expect(screen.getByText(/NOTICE-ASSESS-v4 is bound to this task/)).toBeInTheDocument();
  });

  it("renders regulated internal cases with human-decision and redress controls", async () => {
    const user = userEvent.setup();
    const queue = open("#/hr/cases");
    expect(screen.getByRole("heading", { name: "Assessment, reference and background case queue" })).toBeInTheDocument();
    expect(screen.getByText("32", { selector: "strong" })).toBeInTheDocument();
    queue.unmount();

    open("#/hr/cases/SCR-DEMO-004");
    expect(screen.getByRole("heading", { name: "Consequential-decision guardrail" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Advance to human review" }));
    await user.click(screen.getByRole("button", { name: "Confirm review" }));
    expect(screen.getByText(/moved to governed review in browser memory/)).toBeInTheDocument();
  });

  it("renders the referral reward ledger independently from candidate decisions", () => {
    open("#/hr/talent/referrals");
    expect(screen.getByRole("heading", { name: "Referral eligibility, milestones and disputes" })).toBeInTheDocument();
    expect(screen.getByText("24 reward cases")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Review reward" }).length).toBe(24);
  });

  it("renders high-volume, localization and failure recovery operations", async () => {
    const user = userEvent.setup();
    const volume = open("#/hr/high-volume");
    expect(screen.getByRole("heading", { name: "Scale coordination without turning volume into automated candidate judgment." })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Preview bounded bulk action" }));
    expect(screen.getByRole("heading", { name: "Preview invitation for 48 eligible fixtures" })).toBeInTheDocument();
    volume.unmount();

    const locale = open("#/hr/locales");
    expect(screen.getByRole("heading", { name: "Country, language and worker-type variants" })).toBeInTheDocument();
    expect(screen.getByText("fr-CA", { exact: false })).toBeInTheDocument();
    locale.unmount();

    open("#/hr/recovery");
    expect(screen.getByRole("heading", { name: "Expiry, cancellation, duplicates, stale versions and provider recovery" })).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "Reconcile safely" })[0]);
    expect(screen.getByText(/reconciled in memory using idem_demo_/)).toBeInTheDocument();
  });

  it("renders separate manager, IT and agency portal shells with scoped detail", async () => {
    const user = userEvent.setup();
    const manager = open("#/manager");
    expect(screen.getByRole("heading", { name: "Make every start intentional." })).toBeInTheDocument();
    expect(screen.getByText("1 new hire in scope")).toBeInTheDocument();
    manager.unmount();

    const it = open("#/it");
    expect(screen.getByRole("heading", { name: "Ready on time. Least privilege by default." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Fulfilment queue" })).toBeInTheDocument();
    it.unmount();

    const agency = open("#/agency/submissions/new");
    expect(screen.getByRole("heading", { name: "Validate ownership before creating an application." })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Submit to validation" }));
    expect(screen.getByText("Submission AGS-MEM-001 created")).toBeInTheDocument();
    agency.unmount();

    open("#/agency/submissions/AGS-DEMO-002");
    expect(screen.getByRole("heading", { name: "Submission outside this agency scope" })).toBeInTheDocument();
  });
});
