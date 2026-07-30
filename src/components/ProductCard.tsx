import type { StorefrontProduct } from "../types";
import { Price } from "./Price";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: StorefrontProduct;
  locale: string;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const href = product.url ?? `/products/${product.handle}`;

  return (
    <a className={styles.card} href={href}>
      <div className={styles.media}>
        {product.image ? (
          <img
            className={styles.image}
            src={product.image.url}
            alt={product.image.altText ?? product.title}
            loading="lazy"
            width={product.image.width ?? undefined}
            height={product.image.height ?? undefined}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true" />
        )}
      </div>
      <h3 className={styles.title}>{product.title}</h3>
      <Price
        price={product.price}
        compareAtPrice={product.compareAtPrice}
        locale={locale}
      />
    </a>
  );
}
