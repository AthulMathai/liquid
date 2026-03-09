"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { supabase } from "@/lib/supabase/client";

type UseProductsOptions = {
  search?: string;
  status?: string;
  limit?: number;
  autoLoad?: boolean;
};

type UseProductsState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

function applyClientFilters(products: Product[], options: UseProductsOptions) {
  let filtered = [...products];

  if (options.search?.trim()) {
    const q = options.search.trim().toLowerCase();

    filtered = filtered.filter((product) => {
      return (
        product.sku?.toLowerCase().includes(q) ||
        product.title?.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q) ||
        product.barcode_value?.toLowerCase().includes(q) ||
        product.item_number?.toLowerCase().includes(q)
      );
    });
  }

  if (options.status && options.status !== "all") {
    filtered = filtered.filter((product) => product.status === options.status);
  }

  if (typeof options.limit === "number" && options.limit > 0) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

export function useProducts(
  options: UseProductsOptions = {}
): UseProductsState {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(options.autoLoad ?? true));
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from("items_with_available_qty")
        .select("*")
        .order("created_at", { ascending: false });

      if (queryError) {
        throw new Error(queryError.message);
      }

      setProducts((data ?? []) as Product[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (options.autoLoad === false) return;
    void fetchProducts();
  }, [fetchProducts, options.autoLoad]);

  const filteredProducts = useMemo(() => {
    return applyClientFilters(products, options);
  }, [products, options]);

  return {
    products: filteredProducts,
    loading,
    error,
    refresh: fetchProducts,
  };
}

export default useProducts;