import { PostgrestError } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type DashboardStatsRow = {
  total_products: number;
  total_units: number;
  total_available_units: number;
  products_missing_images: number;
  ready_products: number;
  active_listings: number;
  open_orders: number;
  open_inquiries: number;
  gross_sales: number;
  fulfilled_sales: number;
};

export type ProductReadinessRow = {
  id: string;
  sku: string;
  title: string | null;
  status: string;
  has_images: boolean;
  on_hand_qty: number;
  reserved_qty: number;
  available_qty: number;
  listed_price: number;
  min_acceptable_price: number;
  readiness_status:
    | "missing_sku"
    | "missing_description"
    | "needs_images"
    | "no_available_qty"
    | "needs_price"
    | "sell_ready";
};

export type DashboardSnapshot = {
  stats: DashboardStatsRow;
  readiness: ProductReadinessRow[];
};

type DbResult<T> =
  | { data: T; error: null }
  | { data: null; error: PostgrestError | Error };

const EMPTY_STATS: DashboardStatsRow = {
  total_products: 0,
  total_units: 0,
  total_available_units: 0,
  products_missing_images: 0,
  ready_products: 0,
  active_listings: 0,
  open_orders: 0,
  open_inquiries: 0,
  gross_sales: 0,
  fulfilled_sales: 0,
};

export async function getDashboardStats(): Promise<DbResult<DashboardStatsRow>> {
  try {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("dashboard_stats")
      .select("*")
      .single();

    if (error) {
      return { data: null, error };
    }

    return {
      data: (data ?? EMPTY_STATS) as DashboardStatsRow,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function getProductReadiness(
  limit = 50
): Promise<DbResult<ProductReadinessRow[]>> {
  try {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("product_readiness")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) {
      const fallback = await supabase
        .from("product_readiness")
        .select("*")
        .limit(limit);

      if (fallback.error) {
        return { data: null, error: fallback.error };
      }

      return {
        data: (fallback.data ?? []) as ProductReadinessRow[],
        error: null,
      };
    }

    return {
      data: (data ?? []) as ProductReadinessRow[],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function getDashboardSnapshot(
  readinessLimit = 25
): Promise<DbResult<DashboardSnapshot>> {
  try {
    const [statsResult, readinessResult] = await Promise.all([
      getDashboardStats(),
      getProductReadiness(readinessLimit),
    ]);

    if (statsResult.error) {
      return {
        data: null,
        error:
          statsResult.error instanceof Error
            ? statsResult.error
            : new Error("Failed to load dashboard stats."),
      };
    }

    if (readinessResult.error) {
      return {
        data: null,
        error:
          readinessResult.error instanceof Error
            ? readinessResult.error
            : new Error("Failed to load product readiness."),
      };
    }

    return {
      data: {
        stats: statsResult.data ?? EMPTY_STATS,
        readiness: readinessResult.data ?? [],
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Failed to build dashboard snapshot."),
    };
  }
}