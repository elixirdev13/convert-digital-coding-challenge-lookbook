import type { StorefrontProduct } from "../types";
import { Price } from "./Price";

interface ProductCardProps {
  product: StorefrontProduct;
  locale: string;
  titleFontSize: number;
  priceFontSize: number;
}

export function ProductCard({
  product,
  locale,
  titleFontSize,
  priceFontSize,
}: ProductCardProps) {
  const href = product.url ?? `/products/${product.handle}`;

  return (
    <a
      className="lb-group lb-flex lb-flex-col lb-gap-2 lb-text-inherit lb-no-underline"
      href={href}
    >
      <div className="lb-aspect-[3/4] lb-overflow-hidden lb-rounded-md lb-bg-neutral-100">
        {product.image ? (
          <img
            className="lb-block lb-h-full lb-w-full lb-object-cover lb-transition-transform lb-duration-300 group-hover:lb-scale-105"
            src={product.image.url}
            alt={product.image.altText ?? product.title}
            loading="lazy"
            width={product.image.width ?? undefined}
            height={product.image.height ?? undefined}
          />
        ) : (
          <div className="lb-h-full lb-w-full lb-bg-neutral-100" aria-hidden="true" />
        )}
      </div>
      <h3
        className="lb-m-0 lb-font-medium lb-text-inherit"
        style={{ fontSize: `${titleFontSize}px` }}
      >
        {product.title}
      </h3>
      <Price
        price={product.price}
        compareAtPrice={product.compareAtPrice}
        locale={locale}
        fontSize={priceFontSize}
      />
    </a>
  );
}
