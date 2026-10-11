import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Home from "@/app/page";

// Story 4: "As a shopper I want a way of marking off when I've picked up an
// item, so I can see what I still need to find."

const checkbox = (name: string) =>
  screen.getByRole("checkbox", { name }) as HTMLInputElement;

test("an item moves between still to find and the basket", async () => {
  render(<Home />);
  const user = userEvent.setup();

  expect(screen.queryByText("In basket")).toBeNull();

  await user.click(checkbox("Kale"));
  expect(checkbox("Kale").checked).toBe(true);
  expect(screen.getByText("In basket")).toBeDefined();
  expect(screen.getByText("3 of 4 still to find")).toBeDefined();

  await user.click(checkbox("Kale"));
  expect(checkbox("Kale").checked).toBe(false);
  expect(screen.queryByText("In basket")).toBeNull();
});

test("says so when everything has been picked up", async () => {
  render(<Home />);
  const user = userEvent.setup();

  for (const name of ["Oat milk", "Soda bread", "Kale", "Weetabix"]) {
    await user.click(checkbox(name));
  }

  expect(screen.getByText("All picked up")).toBeDefined();
  expect(screen.queryByText("Still to find")).toBeNull();
});

test("a picked up item still counts towards the total", async () => {
  render(<Home />);
  const user = userEvent.setup();

  await user.click(checkbox("Kale"));

  expect(screen.getByText("£12.40")).toBeDefined(); // total unchanged
  expect(screen.getByText("Left to spend")).toBeDefined();
  expect(screen.getByText("£10.90")).toBeDefined(); // £12.40 - £1.50
});