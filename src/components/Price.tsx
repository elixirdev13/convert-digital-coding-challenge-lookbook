import type { Money } from "../types";

interface PriceProps {
  price: Money;
  compareAtPrice: Money | null;
  locale: string;
  fontSize: number;
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

export function Price({ price, compareAtPrice, locale, fontSize }: PriceProps) {
  const onSale = compareAtPrice !== null;

  return (
    <div
      className="lb-flex lb-items-baseline lb-gap-2"
      style={{ fontSize: `${fontSize}px` }}
    >
      <span
        className={
          onSale ? "lb-font-semibold lb-text-rose-600" : "lb-text-inherit"
        }
      >
        {format(price, locale)}
      </span>
      {onSale && (
        <s className="lb-text-[0.85em] lb-text-inherit lb-opacity-60">
          {format(compareAtPrice, locale)}
        </s>
      )}
    </div>
  );
}
