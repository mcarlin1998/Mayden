"use client";

import { useActionState } from "react";
import styles from "../page.module.css";
import { addItem } from "../actions";

export default function AddItemForm() {
  const [error, formAction] = useActionState(addItem, {});

  return (
    <>
      <form className={styles.form} action={formAction}>
        <input
          className={`${styles.input} ${styles.nameInput}`}
          name="name"
          placeholder="Item name"
          aria-label="Item name"
        />
        <input
          className={`${styles.input} ${styles.smallInput}`}
          type="number"
          name="quantity"
          min="1"
          step="1"
          defaultValue="1"
          placeholder="Qty"
          aria-label="Quantity"
        />
        <input
          className={`${styles.input} ${styles.smallInput}`}
          type="number"
          name="price"
          min="0"
          step="0.01"
          placeholder="Price"
          aria-label="Price"
        />
        <button className={styles.button} type="submit">
          Add
        </button>
      </form>

      {error.error && (
        <p className={styles.error} role="alert">
          {error.error}
        </p>
      )}
    </>
  );
}