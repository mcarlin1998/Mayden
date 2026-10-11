"use client";

import styles from "../page.module.css";
import { formatPrice } from "../money";
import type { Item } from "../types";

type ItemRowProps = {
  item: Item;
  onRemove: (id: number) => void;
  onToggle: (id: number) => void;
};

export default function ItemRow({ item, onRemove, onToggle }: ItemRowProps) {
  return (
    <li className={item.isChecked ? `${styles.row} ${styles.checked}` : styles.row}>
      {/* Wrapping label means clicking the name toggles the checkbox too. */}
      <label className={styles.itemLabel}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={item.isChecked}
          onChange={() => onToggle(item.id)}
        />
        <span className={styles.name}>{item.name}</span>
      </label>

      <span className={styles.quantity}>x{item.quantity}</span>

      <span className={styles.lineTotal}>
        {formatPrice(item.quantity * item.unitPricePence)}
      </span>

      <button
        type="button"
        className={styles.removeButton}
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name}`}
      >
        &times;
      </button>
    </li>
  );
}