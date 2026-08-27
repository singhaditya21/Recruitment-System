import axe from "axe-core";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";

async function expectNoAxeViolations(hash: string) {
  window.location.hash = hash;
  const { container } = render(<App />);
  const results = await axe.run(container, {
    rules: {
      "color-contrast": { enabled: false },
    },
  });
  expect(results.violations.map(({ id, nodes }) => ({ id, nodes: nodes.length }))).toEqual([]);
}

describe("automated WCAG baseline", () => {
  it("passes the candidate careers baseline", async () => {
    await expectNoAxeViolations("#/careers");
  });

  it("passes the HR action-center baseline", async () => {
    await expectNoAxeViolations("#/hr/action-center");
  });
});
