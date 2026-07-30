import { useEffect, useState } from "react";
import { fetchProductsByHandles } from "../api/storefront";
import type { StorefrontConfig, StorefrontProduct } from "../types";

interface State {
  products: StorefrontProduct[];
  loading: boolean;
  error: string | null;
}

/** Fetch product data for a lookbook's handles at runtime via the Storefront API. */
export function useLookbookProducts(
  handles: string[],
  config: StorefrontConfig,
): State {
  const [state, setState] = useState<State>({
    products: [],
    loading: true,
    error: null,
  });

  // Serialize handles so the effect only re-runs when the actual list changes.
  const handlesKey = handles.join(",");

  useEffect(() => {
    let cancelled = false;
    setState({ products: [], loading: true, error: null });

    fetchProductsByHandles(handles, config)
      .then((products) => {
        if (!cancelled) setState({ products, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            products: [],
            loading: false,
            error: err instanceof Error ? err.message : "Failed to load products",
          });
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handlesKey, config.country, config.storefrontToken]);

  return state;
}
