import type { CSSProperties } from "react";
import { useLookbookProducts } from "../hooks/useLookbookProducts";
import type { LookbookData, LookbookDisplaySettings, StorefrontConfig } from "../types";
import { ProductCard } from "./ProductCard";
import styles from "./Lookbook.module.css";

interface LookbookProps {
  lookbook: LookbookData;
  settings: LookbookDisplaySettings;
  config: StorefrontConfig;
}

export function Lookbook({ lookbook, settings, config }: LookbookProps) {
  const { products, loading, error } = useLookbookProducts(
    lookbook.productHandles,
    config,
  );

  const locale = `${config.language || "en"}-${config.country || "US"}`;

  return (
    <section className={styles.lookbook} aria-label={lookbook.title}>
      <header className={styles.header}>
        <h2 className={styles.title}>{lookbook.title}</h2>
        {settings.showDescription && lookbook.description && (
          <p className={styles.description}>{lookbook.description}</p>
        )}
      </header>

      {loading && <p className={styles.status}>Loading products…</p>}
      {error && <p className={styles.status}>Unable to load products.</p>}

      {!loading && !error && (
        <div
          className={styles.grid}
          style={{ "--lookbook-columns": settings.columns } as CSSProperties}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}
    </section>
  );
}
