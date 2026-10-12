"use client";

import { useRef } from "react";
import styles from "../page.module.css";
import { moveUp, removeItem, setItemChecked } from "../actions";
import { formatPrice } from "../money";
import type { Item } from "../types";

export default function ItemRow({ item }: { item: Item }) {
  const formRef = useRef<HTMLFormElement>(null);

  // Each control posts its own Server Action, so the page needs no client
  // state. Every form carries the item id as a hidden field.
  return (
    <li className={item.isChecked ? `${styles.row} ${styles.checked}` : styles.row}>
      <form action={setItemChecked} ref={formRef} className={styles.itemLabel}>
        <input type="hidden" name="id" value={item.id} />
        <input
          type="checkbox"
          className={styles.checkbox}
          defaultChecked={item.isChecked}
          aria-label={item.name}
          // A checkbox does not submit on its own, so post the form for it.
          onChange={() => formRef.current?.requestSubmit()}
        />
        <button type="submit" className={styles.nameButton}>
          {item.name}
        </button>
      </form>

      <form action={moveUp}>
        <input type="hidden" name="id" value={item.id} />
        <button
          type="submit"
          className={styles.moveButton}
          aria-label={`Move ${item.name} earlier`}
        >
          <span aria-hidden="true">&uarr;</span>
        </button>
      </form>

      <span className={styles.quantity}>x{item.quantity}</span>

      <span className={styles.lineTotal}>
        {formatPrice(item.quantity * item.unitPricePence)}
      </span>

      <form action={removeItem}>
        <input type="hidden" name="id" value={item.id} />
        <button type="submit" className={styles.removeButton} aria-label={`Remove ${item.name}`}>
          &times;
        </button>
      </form>
    </li>
  );
}