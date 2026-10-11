"use client";

import styles from "../page.module.css";
import { formatPrice } from "../money";
import type { Item } from "../types";

type ItemRowProps = {
  item: Item;
  onRemove: (id: number) => void;
};

export default function ItemRow({ item, onRemove }: ItemRowProps) {
  return (
    <li className={styles.row}>
      <span className={styles.name}>{item.name}</span>
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