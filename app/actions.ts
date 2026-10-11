"use server";

import { revalidatePath } from "next/cache";

import { deleteItem, insertItem, toggleItem } from "@/lib/db";
import { toPence } from "@/app/money";

export async function addItem(
  _previous: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const name = String(formData.get("name") ?? "").trim();
  const quantity = String(formData.get("quantity") ?? "");
  const price = String(formData.get("price") ?? "");

  if (!name) return { error: "Enter an item name." };

  const parsedQuantity = Number(quantity);
  if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
    return { error: "Quantity must be a whole number of 1 or more." };
  }

  const unitPricePence = toPence(price);
  if (unitPricePence === null) return { error: "Enter a valid price." };

  try {
    insertItem({ name, quantity: parsedQuantity, unitPricePence });
  } catch {
    // The unique constraint on name is what rejects a duplicate (Story 2).
    return { error: `${name} is already on the list.` };
  }

  revalidatePath("/");
  return {};
}

export async function removeItem(formData: FormData): Promise<void> {
  deleteItem(Number(formData.get("id")));
  revalidatePath("/");
}

export async function setItemChecked(formData: FormData): Promise<void> {
  toggleItem(Number(formData.get("id")));
  revalidatePath("/");
}