import type { Money } from "../types";
import styles from "./Price.module.css";

interface PriceProps {
  price: Money;
  compareAtPrice: Money | null;
  locale: string;
}

function format(money: Money, locale: string): string {
  try {
    return new Intl.NumberFormat(locale || undefined, {
      style: "currency",
      currency: money.currencyCode,
      // JPY (and similar) have no minor units; Intl handles this automatically
      // based on the currency code, so we don't hardcode decimal places.
    }).format(Number(money.amount));
  } catch {
    return `${money.amount} ${money.currencyCode}`;
  }
}

export function Price({ price, compareAtPrice, locale }: PriceProps) {
  const onSale = compareAtPrice !== null;

  return (
    <div className={styles.price}>
      <span className={onSale ? styles.sale : styles.regular}>
        {format(price, locale)}
      </span>
      {onSale && (
        <s className={styles.compareAt}>{format(compareAtPrice, locale)}</s>
      )}
    </div>
  );
}
