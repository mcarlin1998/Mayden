import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Home from "@/app/page";

// Story 2: "As a shopper I want to add items to my shopping list,
// so I can add new items that don't already exist on it."

async function fillIn(name: string, quantity: string, price: string) {
  const user = userEvent.setup();
  if (name) await user.type(screen.getByLabelText("Item name"), name);
  await user.clear(screen.getByLabelText("Quantity"));
  await user.type(screen.getByLabelText("Quantity"), quantity);
  await user.type(screen.getByLabelText("Price"), price);
  return user;
}

test("adds a new item to the list", async () => {
  render(<Home />);
  const user = await fillIn("Bananas", "6", "0.89");

  await user.click(screen.getByRole("button", { name: "Add" }));

  expect(screen.getByText("Bananas")).toBeDefined();
  expect(screen.getByText("5 of 5 still to find")).toBeDefined();
});

test("refuses an item that is already on the list", async () => {
  render(<Home />);
  // KALE tests that the check ignores capitalisation.
  const user = await fillIn("KALE", "1", "0.50");

  await user.click(screen.getByRole("button", { name: "Add" }));

  expect(screen.getByRole("alert").textContent).toBe("KALE is already on the list.");
  expect(screen.getByText("4 of 4 still to find")).toBeDefined();
});