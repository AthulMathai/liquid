import type { Handler } from "@netlify/functions";
import { createSupabaseAdminClient } from "../../src/lib/supabase/admin";

type DashboardStatsRow = {
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

type ProductReadinessRow = {
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
    | "sell_ready"
    | string;
};

type SuccessResponse = {
  ok: true;
  stats: DashboardStatsRow;
  readiness: ProductReadinessRow[];
};

type ErrorResponse = {
  ok: false;
  error: string;
};

function json(statusCode: number, body: SuccessResponse | ErrorResponse) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

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

function safeLimit(value: string | undefined, fallback = 25) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(Math.floor(parsed), 200);
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "GET") {
      return json(405, {
        ok: false,
        error: "Method not allowed. Use GET.",
      });
    }

    const supabase = createSupabaseAdminClient();
    const readinessLimit = safeLimit(
      event.queryStringParameters?.readiness_limit,
      25
    );

    const [statsResult, readinessResult] = await Promise.all([
      supabase.from("dashboard_stats").select("*").single(),
      supabase
        .from("product_readiness")
        .select("*")
        .limit(readinessLimit),
    ]);

    if (statsResult.error) {
      return json(500, {
        ok: false,
        error: statsResult.error.message,
      });
    }

    if (readinessResult.error) {
      return json(500, {
        ok: false,
        error: readinessResult.error.message,
      });
    }

    return json(200, {
      ok: true,
      stats: (statsResult.data ?? EMPTY_STATS) as DashboardStatsRow,
      readiness: (readinessResult.data ?? []) as ProductReadinessRow[],
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error while loading dashboard stats.",
    });
  }
};

export default handler;