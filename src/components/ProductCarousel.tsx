import { useRef } from "react";
import type { StorefrontProduct } from "../types";
import { ProductCard } from "./ProductCard";

interface ProductCarouselProps {
  products: StorefrontProduct[];
  locale: string;
  titleFontSize: number;
  priceFontSize: number;
  imageRatio: "portrait" | "square" | "landscape";
}

/**
 * Dependency-free horizontal slider built on CSS scroll-snap. Arrows scroll the
 * track by ~one viewport width; on touch devices users can also swipe. Item
 * widths are responsive so a few products peek at the edge, hinting there is
 * more to scroll.
 */
export function ProductCarousel({
  products,
  locale,
  titleFontSize,
  priceFontSize,
  imageRatio,
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByView = (direction: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="lb-relative">
      <div
        ref={trackRef}
        className="lb-flex lb-gap-5 lb-overflow-x-auto lb-scroll-smooth lb-snap-x lb-snap-mandatory lb-pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:lb-hidden"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="lb-shrink-0 lb-snap-start lb-basis-[78%] sm:lb-basis-[46%] md:lb-basis-[31%] lg:lb-basis-[23.5%]"
          >
            <ProductCard
              product={product}
              locale={locale}
              titleFontSize={titleFontSize}
              priceFontSize={priceFontSize}
              imageRatio={imageRatio}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous products"
        onClick={() => scrollByView(-1)}
        className="lb-absolute lb-left-1 lb-top-1/2 -lb-translate-y-1/2 lb-z-10 lb-flex lb-h-10 lb-w-10 lb-items-center lb-justify-center lb-rounded-full lb-border-0 lb-bg-white lb-text-2xl lb-leading-none lb-text-gray-800 lb-shadow-md lb-cursor-pointer hover:lb-bg-gray-100"
      >
        &#8249;
      </button>
      <button
        type="button"
        aria-label="Next products"
        onClick={() => scrollByView(1)}
        className="lb-absolute lb-right-1 lb-top-1/2 -lb-translate-y-1/2 lb-z-10 lb-flex lb-h-10 lb-w-10 lb-items-center lb-justify-center lb-rounded-full lb-border-0 lb-bg-white lb-text-2xl lb-leading-none lb-text-gray-800 lb-shadow-md lb-cursor-pointer hover:lb-bg-gray-100"
      >
        &#8250;
      </button>
    </div>
  );
}
