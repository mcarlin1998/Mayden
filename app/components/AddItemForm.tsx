"use client";

import { useState } from "react";
import styles from "../page.module.css";
import { toPence } from "../money";
import type { Item } from "../types";

type AddItemFormProps = {
  existingItems: Item[];
  nextId: number;
  onAdd: (item: Item) => void;
};

export default function AddItemForm({
  existingItems,
  nextId,
  onAdd,
}: AddItemFormProps) {
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
    if (
      existingItems.some(
        (item) => item.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
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

    onAdd({
      id: nextId,
      name: trimmedName,
      quantity: parsedQuantity,
      unitPricePence,
    });

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
