"use client";

import { useRef } from "react";
import styles from "../page.module.css";
import { removeItem, setItemChecked } from "../actions";
import { formatPrice } from "../money";
import type { Item } from "../types";

export default function ItemRow({ item }: { item: Item }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <li className={item.isChecked ? `${styles.row} ${styles.checked}` : styles.row}>
      {/* A form per control: ticking the checkbox and the remove button each
          post to a Server Action, so the page needs no client state. */}
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