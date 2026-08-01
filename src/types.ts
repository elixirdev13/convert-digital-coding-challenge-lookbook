// Shared types for the lookbook app.

/** Runtime configuration read from the Liquid-rendered mount element. */
export interface StorefrontConfig {
  shopDomain: string;
  storefrontToken: string;
  apiVersion: string;
  /** Market context, e.g. "AU" or "JP". Drives market-based price overrides. */
  country: string;
  language: string;
}

/** Display settings mirrored from the theme customizer (identical on both sections). */
export interface LookbookDisplaySettings {
  columns: number;
  showDescription: boolean;
  /** Product image aspect ratio. */
  imageRatio: "portrait" | "square" | "landscape";
  /** Render products in a horizontal carousel instead of a grid. */
  enableCarousel: boolean;
  /** Optional colors from theme settings; empty string means "inherit". */
  textColor: string;
  backgroundColor: string;
  /** Font sizes (px) configurable in the theme customizer. */
  headingFontSize: number;
  subheadingFontSize: number;
  productTitleFontSize: number;
  priceFontSize: number;
}

/** A single lookbook resolved from a Shopify metaobject (in Liquid). */
export interface LookbookData {
  handle: string;
  title: string;
  description: string;
  /** Product handles only — product details are fetched at runtime. */
  productHandles: string[];
}

/** Full payload embedded by Liquid into each mount point. */
export interface LookbookPayload {
  lookbooks: LookbookData[];
  settings: LookbookDisplaySettings;
  config: StorefrontConfig;
}

export interface Money {
  amount: string;
  currencyCode: string;
}

/** Product shape fetched from the Storefront API. */
export interface StorefrontProduct {
  id: string;
  handle: string;
  title: string;
  url: string | null;
  image: {
    url: string;
    altText: string | null;
    width: number | null;
    height: number | null;
  } | null;
  price: Money;
  compareAtPrice: Money | null;
}
