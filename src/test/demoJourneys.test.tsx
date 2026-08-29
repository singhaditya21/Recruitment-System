import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../App";
import {
  businessUseCases,
  demoJourneySummary,
  demoPacks,
  journeyCatalog,
} from "../data/demoJourneys";

function open(hash: string) {
  window.location.hash = hash;
  return render(<App />);
}

describe("v3.1 demo journey and data-flow contracts", () => {
  it("reconciles the complete journey catalogue", () => {
    expect(demoJourneySummary).toMatchObject({
      businessUseCases: 12,
      journeyUnits: 84,
      demoPacks: 8,
      steps: 61,
    });
    expect(new Set(journeyCatalog.map((journey) => journey.id)).size).toBe(84);
    expect(journeyCatalog[0].id).toBe("JRN-001");
    expect(journeyCatalog.at(-1)?.id).toBe("JRN-084");
    expect(businessUseCases.every((useCase) => useCase.steps.length >= 5)).toBe(true);
    expect(businessUseCases.every((useCase) => useCase.objects.length >= 6)).toBe(true);
    expect(demoPacks.every((pack) => pack.useCaseIds.length >= 2)).toBe(true);
  });

  it("renders all business-use-case diagrams from the command center", () => {
    open("#/demo");
    expect(screen.getByRole("heading", { name: /Show the business journey/i })).toBeInTheDocument();
    expect(screen.getAllByText("Diagram ready")).toHaveLength(12);
    expect(screen.getByText("84", { selector: ".demo-metric-grid strong" })).toBeInTheDocument();
  });

  it("launches a deterministic journey and hands off between live routes", async () => {
    const user = userEvent.setup();
    open("#/demo/flows/candidate-attraction");
    expect(screen.getByRole("heading", { name: "Candidate attraction, events and account access" })).toBeInTheDocument();
    expect(screen.getAllByText("External entity")).toHaveLength(6);
    await user.click(screen.getByRole("button", { name: /Start happy path/i }));
    expect(window.location.hash).toBe("#/careers");
    expect(screen.getByRole("complementary", { name: "Guided demo presenter" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Record & hand off/i }));
    expect(window.location.hash).toBe("#/careers/jobs/product-designer-remote-demo");
    expect(screen.getByText(/Step 2 of 5/i)).toBeInTheDocument();
  });

  it("exposes the entire searchable journey coverage matrix", async () => {
    const user = userEvent.setup();
    open("#/demo/catalog");
    expect(screen.getByRole("heading", { name: "All 84 showcase journey units" })).toBeInTheDocument();
    expect(screen.getAllByText(/JRN-\d{3}/)).toHaveLength(84);
    await user.type(screen.getByPlaceholderText(/Search journey/i), "pre-adverse");
    expect(screen.getByText("Correct or dispute pre-adverse information")).toBeInTheDocument();
    expect(screen.queryByText("Search and filter jobs")).not.toBeInTheDocument();
  });
});
