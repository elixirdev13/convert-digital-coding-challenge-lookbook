import type { Money, StorefrontConfig, StorefrontProduct } from "../types";

const PRODUCTS_QUERY = /* GraphQL */ `
  query LookbookProducts($query: String!, $country: CountryCode)
  @inContext(country: $country) {
    products(first: 250, query: $query) {
      nodes {
        id
        handle
        title
        onlineStoreUrl
        featuredImage {
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

interface RawProduct {
  id: string;
  handle: string;
  title: string;
  onlineStoreUrl: string | null;
  featuredImage: {
    url: string;
    altText: string | null;
    width: number | null;
    height: number | null;
  } | null;
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money };
}

function toStorefrontProduct(raw: RawProduct): StorefrontProduct {
  const price = raw.priceRange.minVariantPrice;
  const compareAt = raw.compareAtPriceRange.minVariantPrice;
  // A compare-at only counts as a markdown when it is strictly greater than the
  // selling price. Markets without an override return 0 / equal amounts.
  const hasCompareAt =
    compareAt && Number(compareAt.amount) > Number(price.amount);

  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    url: raw.onlineStoreUrl,
    image: raw.featuredImage,
    price,
    compareAtPrice: hasCompareAt ? compareAt : null,
  };
}

/**
 * Fetch products for a list of handles in a single Storefront API request.
 * Results are re-ordered to match the requested handle order so the lookbook
 * renders products in the sequence the merchant configured.
 */
export async function fetchProductsByHandles(
  handles: string[],
  config: StorefrontConfig,
): Promise<StorefrontProduct[]> {
  const uniqueHandles = Array.from(new Set(handles.filter(Boolean)));
  if (uniqueHandles.length === 0) return [];

  const searchQuery = uniqueHandles.map((h) => `handle:${h}`).join(" OR ");
  const endpoint = `https://${config.shopDomain}/api/${config.apiVersion}/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": config.storefrontToken,
    },
    body: JSON.stringify({
      query: PRODUCTS_QUERY,
      variables: {
        query: searchQuery,
        country: config.country || null,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Storefront API request failed: ${response.status}`);
  }

  const json = (await response.json()) as {
    data?: { products?: { nodes: RawProduct[] } };
    errors?: Array<{ message: string }>;
  };

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }

  const nodes = json.data?.products?.nodes ?? [];
  const byHandle = new Map(nodes.map((n) => [n.handle, toStorefrontProduct(n)]));

  return uniqueHandles
    .map((handle) => byHandle.get(handle))
    .filter((p): p is StorefrontProduct => Boolean(p));
}
