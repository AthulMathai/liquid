import type { Handler } from "@netlify/functions";
import { createSupabaseAdminClient } from "../../src/lib/supabase/admin";

type IncomingBody = {
  order_id?: string;
  order_number?: string;
  order_status: string;
  payment_received?: boolean;
  ship_date?: string | null;
  notes?: string | null;
  complete_inventory?: boolean;
};

type SuccessResponse = {
  ok: true;
  order: {
    id: string;
    order_number: string;
    order_status: string;
    payment_received: boolean;
    ship_date: string | null;
    total_value: number;
    shipped_value: number;
  };
  inventory_updates: Array<{
    item_id: string;
    sku: string;
    previous_on_hand_qty: number;
    new_on_hand_qty: number;
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

function normalizeRequired(value: unknown, fieldName: string) {
  const normalized = normalizeText(value);
  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }
  return normalized;
}

function normalizeOrderStatus(value: unknown) {
  const status = normalizeRequired(value, "order_status");
  const allowed = new Set([
    "awaiting_payment",
    "paid",
    "awaiting_pickup",
    "picked_up",
    "shipped",
    "completed",
    "cancelled",
    "refunded",
  ]);

  if (!allowed.has(status)) {
    throw new Error(`Invalid order_status: ${status}`);
  }

  return status;
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST" && event.httpMethod !== "PATCH") {
      return json(405, {
        ok: false,
        error: "Method not allowed. Use POST or PATCH.",
      });
    }

    if (!event.body) {
      return json(400, {
        ok: false,
        error: "Request body is required.",
      });
    }

    const body = JSON.parse(event.body) as IncomingBody;
    const orderStatus = normalizeOrderStatus(body.order_status);
    const orderId = normalizeText(body.order_id);
    const orderNumber = normalizeText(body.order_number)?.toUpperCase() ?? null;
    const completeInventory = body.complete_inventory === true;

    if (!orderId && !orderNumber) {
      return json(400, {
        ok: false,
        error: "Provide either order_id or order_number.",
      });
    }

    const supabase = createSupabaseAdminClient();

    let orderQuery = supabase
      .from("orders")
      .select(
        "id, order_number, order_status, payment_received, ship_date, total_value, shipped_value"
      )
      .limit(1);

    if (orderId) {
      orderQuery = orderQuery.eq("id", orderId);
    } else {
      orderQuery = orderQuery.eq("order_number", orderNumber as string);
    }

    const { data: order, error: orderError } = await orderQuery.single();

    if (orderError || !order) {
      return json(404, {
        ok: false,
        error: orderError?.message || "Order not found.",
      });
    }

    const updatePayload: Record<string, unknown> = {
      order_status: orderStatus,
    };

    if (typeof body.payment_received === "boolean") {
      updatePayload.payment_received = body.payment_received;
    }

    if ("ship_date" in body) {
      updatePayload.ship_date = normalizeText(body.ship_date);
    }

    if ("notes" in body) {
      updatePayload.notes = normalizeText(body.notes);
    }

    const { data: updatedOrder, error: updateOrderError } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", order.id)
      .select(
        "id, order_number, order_status, payment_received, ship_date, total_value, shipped_value"
      )
      .single();

    if (updateOrderError || !updatedOrder) {
      return json(500, {
        ok: false,
        error: updateOrderError?.message || "Failed to update order.",
      });
    }

    const inventoryUpdates: SuccessResponse["inventory_updates"] = [];

    if (completeInventory) {
      const shouldDeduct =
        orderStatus === "picked_up" ||
        orderStatus === "shipped" ||
        orderStatus === "completed";

      const shouldReleaseOnly =
        orderStatus === "cancelled" || orderStatus === "refunded";

      if (shouldDeduct || shouldReleaseOnly) {
        const { data: orderItems, error: orderItemsError } = await supabase
          .from("order_items")
          .select("id, item_id, qty, shipped_qty")
          .eq("order_id", order.id);

        if (orderItemsError) {
          return json(500, {
            ok: false,
            error: orderItemsError.message,
          });
        }

        const itemIds = (orderItems ?? []).map((item) => item.item_id);

        if (itemIds.length > 0) {
          const { data: items, error: itemsError } = await supabase
            .from("items")
            .select("id, sku, on_hand_qty, reserved_qty")
            .in("id", itemIds);

          if (itemsError) {
            return json(500, {
              ok: false,
              error: itemsError.message,
            });
          }

          const itemMap = new Map((items ?? []).map((item) => [item.id, item]));
          const validationErrors: string[] = [];

          for (const line of orderItems ?? []) {
            const dbItem = itemMap.get(line.item_id);

            if (!dbItem) {
              validationErrors.push(`Item not found: ${line.item_id}`);
              continue;
            }

            const qtyToProcess = Number(line.qty ?? 0);

            if (shouldDeduct && qtyToProcess > Number(dbItem.on_hand_qty ?? 0)) {
              validationErrors.push(
                `Cannot deduct ${qtyToProcess} unit(s) from ${dbItem.sku}. Only ${dbItem.on_hand_qty} on hand.`
              );
            }

            if (
              (shouldDeduct || shouldReleaseOnly) &&
              qtyToProcess > Number(dbItem.reserved_qty ?? 0)
            ) {
              validationErrors.push(
                `Cannot release ${qtyToProcess} reserved unit(s) from ${dbItem.sku}. Only ${dbItem.reserved_qty} reserved.`
              );
            }
          }

          if (validationErrors.length > 0) {
            return json(400, {
              ok: false,
              error: "Inventory update validation failed.",
              details: validationErrors,
            });
          }

          for (const line of orderItems ?? []) {
            const dbItem = itemMap.get(line.item_id)!;
            const previousOnHandQty = Number(dbItem.on_hand_qty ?? 0);
            const previousReservedQty = Number(dbItem.reserved_qty ?? 0);
            const qtyToProcess = Number(line.qty ?? 0);

            const newOnHandQty = shouldDeduct
              ? Math.max(previousOnHandQty - qtyToProcess, 0)
              : previousOnHandQty;

            const newReservedQty = Math.max(previousReservedQty - qtyToProcess, 0);

            const status =
              newOnHandQty === 0
                ? "sold_out"
                : undefined;

            const { data: updatedItem, error: updateItemError } = await supabase
              .from("items")
              .update({
                on_hand_qty: newOnHandQty,
                reserved_qty: newReservedQty,
                ...(status ? { status } : {}),
              })
              .eq("id", line.item_id)
              .select("id, sku, on_hand_qty, reserved_qty")
              .single();

            if (updateItemError || !updatedItem) {
              return json(500, {
                ok: false,
                error:
                  updateItemError?.message ||
                  `Failed to update inventory for item ${line.item_id}.`,
              });
            }

            inventoryUpdates.push({
              item_id: updatedItem.id,
              sku: updatedItem.sku,
              previous_on_hand_qty: previousOnHandQty,
              new_on_hand_qty: Number(updatedItem.on_hand_qty),
              previous_reserved_qty: previousReservedQty,
              new_reserved_qty: Number(updatedItem.reserved_qty),
            });
          }
        }
      }
    }

    const { data: refreshedOrder, error: refreshedOrderError } = await supabase
      .from("orders")
      .select(
        "id, order_number, order_status, payment_received, ship_date, total_value, shipped_value"
      )
      .eq("id", order.id)
      .single();

    if (refreshedOrderError || !refreshedOrder) {
      return json(500, {
        ok: false,
        error: refreshedOrderError?.message || "Failed to refresh order.",
      });
    }

    return json(200, {
      ok: true,
      order: {
        id: refreshedOrder.id,
        order_number: refreshedOrder.order_number,
        order_status: refreshedOrder.order_status,
        payment_received: Boolean(refreshedOrder.payment_received),
        ship_date: refreshedOrder.ship_date,
        total_value: Number(refreshedOrder.total_value ?? 0),
        shipped_value: Number(refreshedOrder.shipped_value ?? 0),
      },
      inventory_updates: inventoryUpdates,
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error while updating order status.",
    });
  }
};

export default handler;