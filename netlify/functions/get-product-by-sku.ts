import type { Handler } from "@netlify/functions";
import { createSupabaseAdminClient } from "../../src/lib/supabase/admin";

type SuccessResponse = {
  ok: true;
  product: {
    id: string;
    sku: string;
    barcode_value: string | null;
    item_number: string | null;
    title: string | null;
    description: string | null;
    category: string | null;
    brand: string | null;
    model: string | null;
    condition: string | null;
    cost: number;
    listed_price: number;
    min_acceptable_price: number;
    on_hand_qty: number;
    reserved_qty: number;
    available_qty: number;
    status: string;
    has_images: boolean;
    primary_image_url: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
  };
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

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "GET") {
      return json(405, {
        ok: false,
        error: "Method not allowed. Use GET.",
      });
    }

    const sku = (event.queryStringParameters?.sku ?? "").trim();

    if (!sku) {
      return json(400, {
        ok: false,
        error: "Missing required query parameter: sku",
      });
    }

    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("items_with_available_qty")
      .select(
        `
          id,
          sku,
          barcode_value,
          item_number,
          title,
          description,
          category,
          brand,
          model,
          condition,
          cost,
          listed_price,
          min_acceptable_price,
          on_hand_qty,
          reserved_qty,
          available_qty,
          status,
          has_images,
          primary_image_url,
          notes,
          created_at,
          updated_at
        `
      )
      .eq("sku", sku.toUpperCase())
      .maybeSingle();

    if (error) {
      return json(500, {
        ok: false,
        error: error.message,
      });
    }

    if (!data) {
      return json(404, {
        ok: false,
        error: `No product found for SKU "${sku}".`,
      });
    }

    return json(200, {
      ok: true,
      product: data,
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error while fetching product.",
    });
  }
};

export default handler;