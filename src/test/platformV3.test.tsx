import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../App";
import { fullSystemCounts } from "../data/fullSystem";

function open(hash: string) {
  window.location.hash = hash;
  return render(<App />);
}

describe("v3.0 full-system wireframe contracts", () => {
  it("reconciles every new seeded data family", () => {
    expect(fullSystemCounts).toEqual({
      candidateTaskDetails: 6,
      recruitingEvents: 12,
      highVolumeCohorts: 48,
      agencyAssignments: 12,
      referrerCases: 16,
      facilitiesRequests: 24,
      managerRecruitingItems: 20,
      interviewerItems: 12,
      buddyPlans: 12,
      mobilityOpportunities: 18,
      benefitElections: 12,
      learningEnrollments: 16,
      transitionCases: 32,
      adminUsers: 20,
      notifications: 24,
      contentTemplates: 24,
      integrations: 16,
      importRuns: 12,
    });
    expect(Object.values(fullSystemCounts).reduce((sum, count) => sum + count, 0)).toBe(336);
  });

  it("supports candidate access, alert and regulated-task continuations", async () => {
    const user = userEvent.setup();
    const access = open("#/sign-in");
    expect(screen.getByRole("heading", { name: "Sign in without a password." })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Send secure sign-in link" }));
    expect(screen.getByText("MAGIC-MEM-001 · expires in 15 minutes")).toBeInTheDocument();
    access.unmount();

    const alert = open("#/job-alerts/JAL-001");
    expect(screen.getByRole("heading", { name: "Product design · remote" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Pause alert" }));
    expect(screen.getByText("Paused", { selector: ".pill" })).toBeInTheDocument();
    alert.unmount();

    const task = open("#/my-tasks/CTK-004");
    expect(screen.getByRole("heading", { name: /Review pre-adverse-action information/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Review notice and rights" }));
    expect(screen.getByText(/hiring decision remains paused/i)).toBeInTheDocument();
    task.unmount();
  });

  it("renders recruiting operations with detail and recovery actions", async () => {
    const user = userEvent.setup();
    const event = open("#/hr/events/REV-DEMO-001");
    expect(screen.getByRole("heading", { name: /Design systems roundtable/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Run publish readiness" }));
    expect(screen.getByText(/publish-readiness preview passed/i)).toBeInTheDocument();
    event.unmount();

    const campaign = open("#/hr/high-volume/HVC-001/cohorts/COH-DEMO-001");
    expect(screen.getByRole("heading", { name: "West cohort" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Prepare bounded invitations" }));
    expect(screen.getByText(/deterministic invitations/i)).toBeInTheDocument();
    campaign.unmount();

    open("#/hr/recovery/RCV-DEMO-001");
    expect(screen.getByRole("heading", { name: /Application recovery/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Recovery evidence" })).toBeInTheDocument();
  });

  it.each([
    ["#/referrer", "Recommend with permission. Track without influence."],
    ["#/facilities", "Ready spaces. Revocable access."],
    ["#/manager/recruiting", "Own outcomes, evidence and human decisions."],
    ["#/interviewer", "Prepare clearly. Submit independently."],
    ["#/buddy", "Make connection intentional."],
    ["#/mobility", "Explore growth without silent disclosure."],
    ["#/agency/assignments", "Your active assignment contracts"],
  ])("renders the scoped portal at %s", (hash, heading) => {
    const view = open(hash);
    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    view.unmount();
  });

  it("covers benefits, learning and effective-dated transition depth", async () => {
    const user = userEvent.setup();
    const benefits = open("#/preboarding/benefits/BEN-DEMO-001");
    expect(screen.getByRole("heading", { name: "Medical" })).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Submit synthetic election" }));
    expect(screen.getByText("Election saved")).toBeInTheDocument();
    benefits.unmount();

    const learning = open("#/preboarding/learning/LRN-DEMO-001");
    await user.click(screen.getByRole("button", { name: "Start module" }));
    await user.click(screen.getByRole("button", { name: "Complete content" }));
    await user.click(screen.getByRole("button", { name: "Submit knowledge check" }));
    expect(screen.getByText("Complete", { selector: ".pill" })).toBeInTheDocument();
    learning.unmount();

    open("#/hr/transitions/TRN-DEMO-001/impact");
    expect(screen.getByRole("heading", { name: "Affected journeys and compensating work" })).toBeInTheDocument();
  });

  it("renders every administration workbench and a governed detail", async () => {
    const workbenches = [
      ["#/admin", "Administration and platform control"],
      ["#/admin/users", "Users and effective access"],
      ["#/admin/notifications", "Notification center"],
      ["#/admin/content", "Content and communication templates"],
      ["#/admin/integrations", "Integration control plane"],
      ["#/admin/imports", "Governed imports"],
      ["#/admin/identity", "Identity and session policy"],
      ["#/admin/privacy-requests", "Privacy request operations"],
    ];
    for (const [hash, heading] of workbenches) {
      const view = open(hash);
      expect(screen.getByRole("heading", { name: heading, level: 1 })).toBeInTheDocument();
      view.unmount();
    }
    const user = userEvent.setup();
    open("#/admin/integrations/ICG-DEMO-001");
    await user.selectOptions(screen.getByRole("combobox", { name: "View as demo persona" }), "USR-ADM-001");
    await user.click(screen.getByRole("button", { name: "Test configuration" }));
    expect(screen.getByRole("button", { name: "Test passed" })).toBeInTheDocument();
  });
});
