import styles from "./page.module.css";

type Item = {
  id: number;
  name: string;
  quantity: number;
  unitPricePence: number;
  isChecked: boolean;
};

// Temporary mock data so the UI can be reviewed before the database is wired up.
const items: Item[] = [
  {
    id: 1,
    name: "Oat milk",
    quantity: 2,
    unitPricePence: 175,
    isChecked: false,
  },
  {
    id: 2,
    name: "Soda bread",
    quantity: 1,
    unitPricePence: 210,
    isChecked: false,
  },
  {
    id: 3,
    name: "Chicken fingers",
    quantity: 6,
    unitPricePence: 299,
    isChecked: true,
  },
  { id: 4, name: "Kale", quantity: 1, unitPricePence: 150, isChecked: false },
  {
    id: 5,
    name: "Weetabix",
    quantity: 2,
    unitPricePence: 265,
    isChecked: false,
  },
];

const totalPence = items.reduce(
  (sum, item) => sum + item.quantity * item.unitPricePence,
  0,
);

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const formatPrice = (pence: number) => gbp.format(pence / 100);

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Weekly shop</h1>
        <p className={styles.subtitle}>{items.length} items</p>
      </header>

      <ul className={styles.list}>
        {items.map((item) => (
          <li
            key={item.id}
            className={
              item.isChecked ? `${styles.row} ${styles.checked}` : styles.row
            }
          >
            <label className={styles.itemLabel}>
              <input
                type="checkbox"
                checked={item.isChecked}
                readOnly
                className={styles.checkbox}
              />
              <span className={styles.name}>{item.name}</span>
            </label>

            <span className={styles.quantity}>x{item.quantity}</span>

            <span className={styles.lineTotal}>
              {formatPrice(item.quantity * item.unitPricePence)}
            </span>
          </li>
        ))}
      </ul>

      <footer className={styles.footer}>
        <span className={styles.footerLabel}>Total</span>
        <span className={styles.footerTotal}>{formatPrice(totalPence)}</span>
      </footer>
    </main>
  );
}
