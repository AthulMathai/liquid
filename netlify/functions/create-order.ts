import type { Handler } from "@netlify/functions";
import { createSupabaseAdminClient } from "../../src/lib/supabase/admin";

type IncomingOrderItem = {
  item_id: string;
  qty: number;
  unit_price: number;
  shipped_qty?: number;
};

type IncomingBody = {
  order_number: string;
  platform?: string | null;
  buyer_name?: string | null;
  buyer_email?: string | null;
  buyer_phone?: string | null;
  buyer_address?: string | null;
  payment_method?: string | null;
  payment_received?: boolean;
  fulfillment_type?: "pickup" | "shipping" | "delivery" | string | null;
  shipping_cost?: number;
  order_status?: string;
  order_date?: string | null;
  ship_date?: string | null;
  notes?: string | null;
  items: IncomingOrderItem[];
  reserve_inventory?: boolean;
};

type SuccessResponse = {
  ok: true;
  order: {
    id: string;
    order_number: string;
    order_status: string;
    total_value: number;
    shipped_value: number;
  };
  items: Array<{
    id: string;
    item_id: string;
    qty: number;
    shipped_qty: number;
    unit_price: number;
    line_total: number;
  }>;
  inventory_updates: Array<{
    item_id: string;
    sku: string;
    previous_reserved_qty: number;
    new_reserved_qty: number;
  }>;
};

type ErrorResponse = {
  ok: false;
  error: string;
  details?: string[];
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

function normalizeText(value: unknown) {
  if (value === null || value === undefined) return null;
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : null;
}

function normalizeOrderNumber(value: unknown) {
  const normalized = normalizeText(value);
  if (!normalized) {
    throw new Error("order_number is required.");
  }
  return normalized.toUpperCase();
}

function safeNumber(value: unknown, fallback = 0) {
  const parsed =
    typeof value === "number"
      ? value
      : Number(String(value ?? fallback).replace(/[$,]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function positiveInteger(value: unknown, fieldName: string) {
  const parsed = Math.floor(safeNumber(value, 0));
  if (parsed <= 0) {
    throw new Error(`${fieldName} must be greater than 0.`);
  }
  return parsed;
}

function nonNegativeInteger(value: unknown, fieldName: string) {
  const parsed = Math.floor(safeNumber(value, 0));
  if (parsed < 0) {
    throw new Error(`${fieldName} must be 0 or greater.`);
  }
  return parsed;
}

function nonNegativeNumber(value: unknown, fieldName: string) {
  const parsed = safeNumber(value, 0);
  if (parsed < 0) {
    throw new Error(`${fieldName} must be 0 or greater.`);
  }
  return parsed;
}

export const handler: Handler = async (event) => {
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

  const supabase = createSupabaseAdminClient();

  try {
    const body = JSON.parse(event.body) as IncomingBody;

    const orderNumber = normalizeOrderNumber(body.order_number);
    const incomingItems = Array.isArray(body.items) ? body.items : [];
    const reserveInventory = body.reserve_inventory !== false;

    if (incomingItems.length === 0) {
      return json(400, {
        ok: false,
        error: "At least one order item is required.",
      });
    }

    const normalizedItems = incomingItems.map((item, index) => {
      const itemId = normalizeText(item.item_id);
      if (!itemId) {
        throw new Error(`items[${index}].item_id is required.`);
      }

      const qty = positiveInteger(item.qty, `items[${index}].qty`);
      const shippedQty = nonNegativeInteger(
        item.shipped_qty ?? 0,
        `items[${index}].shipped_qty`
      );

      if (shippedQty > qty) {
        throw new Error(
          `items[${index}].shipped_qty cannot be greater than qty.`
        );
      }

      const unitPrice = nonNegativeNumber(
        item.unit_price,
        `items[${index}].unit_price`
      );

      return {
        item_id: itemId,
        qty,
        shipped_qty: shippedQty,
        unit_price: unitPrice,
      };
    });

    const itemIds = normalizedItems.map((item) => item.item_id);

    const { data: dbItems, error: itemsError } = await supabase
      .from("items")
      .select("id, sku, on_hand_qty, reserved_qty")
      .in("id", itemIds);

    if (itemsError) {
      return json(500, {
        ok: false,
        error: itemsError.message,
      });
    }

    const itemMap = new Map((dbItems ?? []).map((item) => [item.id, item]));

    const validationErrors: string[] = [];

    for (const line of normalizedItems) {
      const dbItem = itemMap.get(line.item_id);

      if (!dbItem) {
        validationErrors.push(`Item not found: ${line.item_id}`);
        continue;
      }

      const availableQty = Math.max(
        Number(dbItem.on_hand_qty) - Number(dbItem.reserved_qty),
        0
      );

      if (reserveInventory && line.qty > availableQty) {
        validationErrors.push(
          `Insufficient available qty for ${dbItem.sku}. Requested ${line.qty}, available ${availableQty}.`
        );
      }
    }

    if (validationErrors.length > 0) {
      return json(400, {
        ok: false,
        error: "Order validation failed.",
        details: validationErrors,
      });
    }

    const orderInsert = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        platform: normalizeText(body.platform),
        buyer_name: normalizeText(body.buyer_name),
        buyer_email: normalizeText(body.buyer_email),
        buyer_phone: normalizeText(body.buyer_phone),
        buyer_address: normalizeText(body.buyer_address),
        payment_method: normalizeText(body.payment_method),
        payment_received: Boolean(body.payment_received),
        fulfillment_type: normalizeText(body.fulfillment_type),
        shipping_cost: nonNegativeNumber(body.shipping_cost ?? 0, "shipping_cost"),
        order_status: normalizeText(body.order_status) ?? "awaiting_payment",
        order_date: normalizeText(body.order_date),
        ship_date: normalizeText(body.ship_date),
        notes: normalizeText(body.notes),
      })
      .select("id, order_number, order_status, total_value, shipped_value")
      .single();

    if (orderInsert.error || !orderInsert.data) {
      return json(500, {
        ok: false,
        error: orderInsert.error?.message || "Failed to create order.",
      });
    }

    const orderId = orderInsert.data.id;

    const orderItemsInsert = await supabase
      .from("order_items")
      .insert(
        normalizedItems.map((item) => ({
          order_id: orderId,
          item_id: item.item_id,
          qty: item.qty,
          shipped_qty: item.shipped_qty,
          unit_price: item.unit_price,
        }))
      )
      .select("id, item_id, qty, shipped_qty, unit_price, line_total");

    if (orderItemsInsert.error || !orderItemsInsert.data) {
      await supabase.from("orders").delete().eq("id", orderId);

      return json(500, {
        ok: false,
        error: orderItemsInsert.error?.message || "Failed to create order items.",
      });
    }

    const inventoryUpdates: SuccessResponse["inventory_updates"] = [];

    if (reserveInventory) {
      for (const line of normalizedItems) {
        const dbItem = itemMap.get(line.item_id)!;
        const previousReservedQty = Number(dbItem.reserved_qty);
        const newReservedQty = previousReservedQty + line.qty;

        const reserveResult = await supabase
          .from("items")
          .update({
            reserved_qty: newReservedQty,
          })
          .eq("id", line.item_id)
          .select("id, sku, reserved_qty")
          .single();

        if (reserveResult.error || !reserveResult.data) {
          return json(500, {
            ok: false,
            error:
              reserveResult.error?.message ||
              `Failed to reserve inventory for item ${line.item_id}.`,
          });
        }

        inventoryUpdates.push({
          item_id: reserveResult.data.id,
          sku: reserveResult.data.sku,
          previous_reserved_qty: previousReservedQty,
          new_reserved_qty: Number(reserveResult.data.reserved_qty),
        });
      }
    }

    const refreshedOrder = await supabase
      .from("orders")
      .select("id, order_number, order_status, total_value, shipped_value")
      .eq("id", orderId)
      .single();

    return json(200, {
      ok: true,
      order: {
        id: refreshedOrder.data?.id ?? orderInsert.data.id,
        order_number:
          refreshedOrder.data?.order_number ?? orderInsert.data.order_number,
        order_status:
          refreshedOrder.data?.order_status ?? orderInsert.data.order_status,
        total_value:
          Number(refreshedOrder.data?.total_value ?? orderInsert.data.total_value) ||
          0,
        shipped_value:
          Number(
            refreshedOrder.data?.shipped_value ?? orderInsert.data.shipped_value
          ) || 0,
      },
      items: orderItemsInsert.data.map((item) => ({
        id: item.id,
        item_id: item.item_id,
        qty: Number(item.qty),
        shipped_qty: Number(item.shipped_qty),
        unit_price: Number(item.unit_price),
        line_total: Number(item.line_total),
      })),
      inventory_updates: inventoryUpdates,
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error while creating order.",
    });
  }
};

export default handler;