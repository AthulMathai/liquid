"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { OrderSummary } from "@/types/order";
import { supabase } from "@/lib/supabase/client";

type UseOrdersOptions = {
  search?: string;
  status?: string;
  platform?: string;
  limit?: number;
  autoLoad?: boolean;
};

type UseOrdersState = {
  orders: OrderSummary[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

function applyClientFilters(orders: OrderSummary[], options: UseOrdersOptions) {
  let filtered = [...orders];

  if (options.search?.trim()) {
    const q = options.search.trim().toLowerCase();

    filtered = filtered.filter((order) => {
      return (
        order.order_number?.toLowerCase().includes(q) ||
        order.buyer_name?.toLowerCase().includes(q) ||
        order.platform?.toLowerCase().includes(q)
      );
    });
  }

  if (options.status && options.status !== "all") {
    filtered = filtered.filter((order) => order.order_status === options.status);
  }

  if (options.platform && options.platform !== "all") {
    filtered = filtered.filter((order) => order.platform === options.platform);
  }

  if (typeof options.limit === "number" && options.limit > 0) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

export function useOrders(options: UseOrdersOptions = {}): UseOrdersState {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(options.autoLoad ?? true));
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from("order_summary")
        .select("*")
        .order("order_date", { ascending: false, nullsFirst: false });

      if (queryError) {
        throw new Error(queryError.message);
      }

      setOrders((data ?? []) as OrderSummary[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (options.autoLoad === false) return;
    void fetchOrders();
  }, [fetchOrders, options.autoLoad]);

  const filteredOrders = useMemo(() => {
    return applyClientFilters(orders, options);
  }, [orders, options]);

  return {
    orders: filteredOrders,
    loading,
    error,
    refresh: fetchOrders,
  };
}

export default useOrders;