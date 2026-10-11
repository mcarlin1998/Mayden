import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Home from "@/app/page";

// Story 3: "As a shopper I want to be able to remove items from my shopping
// list, so I can change my mind or fix my mistakes."

test("removes an item from the list", async () => {
  render(<Home />);
  const user = userEvent.setup();

  await user.click(screen.getByRole("button", { name: "Remove Kale" }));

  expect(screen.queryByText("Kale")).toBeNull();
});

test("the count and total update after removing an item", async () => {
  render(<Home />);
  const user = userEvent.setup();

  await user.click(screen.getByRole("button", { name: "Remove Kale" }));

  expect(screen.getByText("3 items")).toBeDefined();
  expect(screen.getByText("£10.90")).toBeDefined(); // £12.40 - £1.50
});

test("removing an item leaves the others alone", async () => {
  render(<Home />);
  const user = userEvent.setup();

  await user.click(screen.getByRole("button", { name: "Remove Kale" }));

  expect(screen.getByText("Oat milk")).toBeDefined();
  expect(screen.getByText("Soda bread")).toBeDefined();
  expect(screen.getByText("Weetabix")).toBeDefined();
});