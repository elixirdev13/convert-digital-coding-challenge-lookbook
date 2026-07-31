import type { CSSProperties } from "react";
import { useLookbookProducts } from "../hooks/useLookbookProducts";
import type { LookbookData, LookbookDisplaySettings, StorefrontConfig } from "../types";
import { ProductCard } from "./ProductCard";

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
    <section
      className="lb-mx-auto lb-box-border lb-max-w-[var(--page-width,1200px)] lb-px-6 lb-py-8 lg:lb-px-20 lg:lb-py-12"
      aria-label={lookbook.title}
    >
      <header className="lb-mb-6 lb-text-center">
        <h2
          className="lb-m-0 lb-mb-2 lb-text-inherit"
          style={{ fontSize: `${settings.headingFontSize}px` }}
        >
          {lookbook.title}
        </h2>
        {settings.showDescription && lookbook.description && (
          <p
            className="lb-mx-auto lb-max-w-3xl lb-text-inherit lb-opacity-80 lb-leading-relaxed"
            style={{ fontSize: `${settings.subheadingFontSize}px` }}
          >
            {lookbook.description}
          </p>
        )}
      </header>

      {loading && (
        <p className="lb-text-center lb-text-inherit lb-opacity-70">
          Loading products…
        </p>
      )}
      {error && (
        <p className="lb-text-center lb-text-inherit lb-opacity-70">
          Unable to load products.
        </p>
      )}

      {!loading && !error && (
        <div
          className="lb-grid lb-grid-cols-2 lb-gap-5 md:lb-grid-cols-[repeat(var(--lb-cols),minmax(0,1fr))]"
          style={{ "--lb-cols": settings.columns } as CSSProperties}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              titleFontSize={settings.productTitleFontSize}
              priceFontSize={settings.priceFontSize}
            />
          ))}
        </div>
      )}
    </section>
  );
}
