"use client";

import { useState } from "react";
import styles from "../page.module.css";

type Item = {
  id: number;
  name: string;
  quantity: number;
  unitPricePence: number;
};

// Converts a price typed in pounds ("1.75") into integer pence (175).
// A blank field is rejected: Number("") is 0, which would silently price an
// item at zero.
export function toPence(pounds: string): number | null {
  if (pounds.trim() === "") return null;

  const amount = Number(pounds);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return Math.round(amount * 100);
}

type AddItemFormProps = {
  existingItems: Item[];
  onAdd: (item: Item) => void;
  nextId: number;
};

export default function AddItemForm({ existingItems, onAdd, nextId }: AddItemFormProps) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Enter an item name.");
      return;
    }

    // Story 2: an item may only appear once on the list.
    if (existingItems.some((item) => item.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError(`${trimmedName} is already on the list.`);
      return;
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      setError("Quantity must be a whole number of 1 or more.");
      return;
    }

    const unitPricePence = toPence(price);
    if (unitPricePence === null) {
      setError("Enter a valid price.");
      return;
    }

    onAdd({ id: nextId, name: trimmedName, quantity: parsedQuantity, unitPricePence });

    setName("");
    setQuantity("1");
    setPrice("");
    setError("");
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={`${styles.input} ${styles.nameInput}`}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Item name"
          aria-label="Item name"
        />
        <input
          className={`${styles.input} ${styles.smallInput}`}
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          placeholder="Qty"
          aria-label="Quantity"
        />
        <input
          className={`${styles.input} ${styles.smallInput}`}
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="Price"
          aria-label="Price"
        />
        <button className={styles.button} type="submit">
          Add
        </button>
      </form>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </>
  );
}