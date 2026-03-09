"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { supabase } from "@/lib/supabase/client";

type UseProductOptions = {
  autoLoad?: boolean;
};

type UseProductState = {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useProduct(
  productIdOrSku: string | null | undefined,
  options: UseProductOptions = {}
): UseProductState {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(options.autoLoad ?? true));
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    const value = (productIdOrSku ?? "").trim();

    if (!value) {
      setProduct(null);
      setLoading(false);
      setError("Missing product identifier.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("items_with_available_qty")
        .select("*")
        .limit(1);

      const looksLikeUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          value
        );

      if (looksLikeUuid) {
        query = query.eq("id", value);
      } else {
        query = query.eq("sku", value.toUpperCase());
      }

      const { data, error: queryError } = await query.maybeSingle();

      if (queryError) {
        throw new Error(queryError.message);
      }

      if (!data) {
        throw new Error("Product not found.");
      }

      setProduct(data as Product);
    } catch (err) {
      setProduct(null);
      setError(err instanceof Error ? err.message : "Failed to load product.");
    } finally {
      setLoading(false);
    }
  }, [productIdOrSku]);

  useEffect(() => {
    if (options.autoLoad === false) return;
    void fetchProduct();
  }, [fetchProduct, options.autoLoad]);

  return {
    product,
    loading,
    error,
    refresh: fetchProduct,
  };
}

export default useProduct;