import type { Handler } from "@netlify/functions";
import { createSupabaseAdminClient } from "../../src/lib/supabase/admin";

type IncomingBody = {
  item_id: string;
  qty: number;
};

type SuccessResponse = {
  ok: true;
  item: {
    id: string;
    sku: string;
    on_hand_qty: number;
    reserved_qty: number;
    available_qty: number;
    status: string;
  };
  reservation: {
    reserved_qty: number;
    previous_reserved_qty: number;
    new_reserved_qty: number;
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

function normalizeRequired(value: unknown, fieldName: string) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) {
    throw new Error(`${fieldName} is required.`);
  }
  return trimmed;
}

function positiveInteger(value: unknown, fieldName: string) {
  const parsed = Math.floor(Number(value));
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${fieldName} must be greater than 0.`);
  }
  return parsed;
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return json(405, {
        ok: false,
        error: "Method not allowed. Use POST.",
      });
    }

    if (!event.body) {
      return json(400, {
        ok: false,
        error: "Request body is required.",
      });
    }

    const body = JSON.parse(event.body) as IncomingBody;
    const itemId = normalizeRequired(body.item_id, "item_id");
    const qty = positiveInteger(body.qty, "qty");

    const supabase = createSupabaseAdminClient();

    const { data: item, error: itemError } = await supabase
      .from("items")
      .select("id, sku, on_hand_qty, reserved_qty, status")
      .eq("id", itemId)
      .single();

    if (itemError || !item) {
      return json(404, {
        ok: false,
        error: itemError?.message || "Item not found.",
      });
    }

    const onHandQty = Number(item.on_hand_qty ?? 0);
    const previousReservedQty = Number(item.reserved_qty ?? 0);
    const availableQtyBefore = Math.max(onHandQty - previousReservedQty, 0);

    if (qty > availableQtyBefore) {
      return json(400, {
        ok: false,
        error: `Cannot reserve ${qty} unit(s). Only ${availableQtyBefore} available.`,
      });
    }

    const newReservedQty = previousReservedQty + qty;

    const { data: updatedItem, error: updateError } = await supabase
      .from("items")
      .update({
        reserved_qty: newReservedQty,
      })
      .eq("id", itemId)
      .select("id, sku, on_hand_qty, reserved_qty, status")
      .single();

    if (updateError || !updatedItem) {
      return json(500, {
        ok: false,
        error: updateError?.message || "Failed to reserve inventory.",
      });
    }

    const updatedOnHandQty = Number(updatedItem.on_hand_qty ?? 0);
    const updatedReservedQty = Number(updatedItem.reserved_qty ?? 0);
    const availableQtyAfter = Math.max(updatedOnHandQty - updatedReservedQty, 0);

    return json(200, {
      ok: true,
      item: {
        id: updatedItem.id,
        sku: updatedItem.sku,
        on_hand_qty: updatedOnHandQty,
        reserved_qty: updatedReservedQty,
        available_qty: availableQtyAfter,
        status: updatedItem.status,
      },
      reservation: {
        reserved_qty: qty,
        previous_reserved_qty: previousReservedQty,
        new_reserved_qty: newReservedQty,
      },
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error while reserving inventory.",
    });
  }
};

export default handler;