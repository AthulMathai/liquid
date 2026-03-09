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
  release: {
    released_qty: number;
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

    const previousReservedQty = Number(item.reserved_qty ?? 0);

    if (qty > previousReservedQty) {
      return json(400, {
        ok: false,
        error: `Cannot release ${qty} unit(s). Only ${previousReservedQty} currently reserved.`,
      });
    }

    const newReservedQty = Math.max(previousReservedQty - qty, 0);

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
        error: updateError?.message || "Failed to release inventory.",
      });
    }

    const onHandQty = Number(updatedItem.on_hand_qty ?? 0);
    const reservedQty = Number(updatedItem.reserved_qty ?? 0);
    const availableQty = Math.max(onHandQty - reservedQty, 0);

    return json(200, {
      ok: true,
      item: {
        id: updatedItem.id,
        sku: updatedItem.sku,
        on_hand_qty: onHandQty,
        reserved_qty: reservedQty,
        available_qty: availableQty,
        status: updatedItem.status,
      },
      release: {
        released_qty: qty,
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
          : "Unexpected error while releasing inventory.",
    });
  }
};

export default handler;