import { PostgrestError } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type OrderItemRow = {
  id: string;
  order_id: string;
  item_id: string;
  qty: number;
  shipped_qty: number;
  unit_price: number;
  line_total: number;
  created_at: string;
};

export type CreateOrderItemInput = {
  order_id: string;
  item_id: string;
  qty: number;
  shipped_qty?: number;
  unit_price: number;
};

export type UpdateOrderItemInput = Partial<{
  qty: number;
  shipped_qty: number;
  unit_price: number;
}>;

type DbResult<T> =
  | { data: T; error: null }
  | { data: null; error: PostgrestError | Error };

const ORDER_ITEM_SELECT = `
  id,
  order_id,
  item_id,
  qty,
  shipped_qty,
  unit_price,
  line_total,
  created_at
`;

function normalizeRequired(value: string, fieldName: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${fieldName} is required.`);
  }
  return trimmed;
}

function normalizePositiveInteger(value: number, fieldName: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${fieldName} must be greater than 0.`);
  }

  return Math.floor(parsed);
}

function normalizeNonNegativeInteger(value: number, fieldName: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${fieldName} must be 0 or greater.`);
  }

  return Math.floor(parsed);
}

function normalizeNonNegativeNumber(value: number, fieldName: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${fieldName} must be 0 or greater.`);
  }

  return parsed;
}

function buildOrderItemPayload(
  input: CreateOrderItemInput | UpdateOrderItemInput
) {
  const payload: Record<string, unknown> = {};

  if ("order_id" in input && typeof input.order_id === "string") {
    payload.order_id = normalizeRequired(input.order_id, "order_id");
  }

  if ("item_id" in input && typeof input.item_id === "string") {
    payload.item_id = normalizeRequired(input.item_id, "item_id");
  }

  if ("qty" in input && input.qty !== undefined) {
    payload.qty = normalizePositiveInteger(input.qty, "qty");
  }

  if ("shipped_qty" in input && input.shipped_qty !== undefined) {
    payload.shipped_qty = normalizeNonNegativeInteger(
      input.shipped_qty,
      "shipped_qty"
    );
  }

  if ("unit_price" in input && input.unit_price !== undefined) {
    payload.unit_price = normalizeNonNegativeNumber(
      input.unit_price,
      "unit_price"
    );
  }

  return payload;
}

export async function listOrderItems(
  orderId: string
): Promise<DbResult<OrderItemRow[]>> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("order_items")
    .select(ORDER_ITEM_SELECT)
    .eq("order_id", orderId.trim())
    .order("created_at", { ascending: true });

  if (error) return { data: null, error };

  return {
    data: (data ?? []) as OrderItemRow[],
    error: null,
  };
}

export async function getOrderItemById(
  id: string
): Promise<DbResult<OrderItemRow>> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("order_items")
    .select(ORDER_ITEM_SELECT)
    .eq("id", id.trim())
    .single();

  if (error) return { data: null, error };

  return {
    data: data as OrderItemRow,
    error: null,
  };
}

export async function createOrderItem(
  input: CreateOrderItemInput
): Promise<DbResult<OrderItemRow>> {
  try {
    const qty = normalizePositiveInteger(input.qty, "qty");
    const shippedQty = normalizeNonNegativeInteger(
      input.shipped_qty ?? 0,
      "shipped_qty"
    );

    if (shippedQty > qty) {
      return {
        data: null,
        error: new Error("shipped_qty cannot be greater than qty."),
      };
    }

    const supabase = createSupabaseServerClient();
    const payload = {
      ...buildOrderItemPayload(input),
      shipped_qty: shippedQty,
    };

    const { data, error } = await supabase
      .from("order_items")
      .insert(payload)
      .select(ORDER_ITEM_SELECT)
      .single();

    if (error) return { data: null, error };

    return {
      data: data as OrderItemRow,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function updateOrderItem(
  id: string,
  input: UpdateOrderItemInput
): Promise<DbResult<OrderItemRow>> {
  try {
    const currentResult = await getOrderItemById(id);

    if (currentResult.error || !currentResult.data) {
      return {
        data: null,
        error:
          currentResult.error instanceof Error
            ? currentResult.error
            : new Error("Failed to load order item."),
      };
    }

    const current = currentResult.data;
    const nextQty =
      input.qty !== undefined
        ? normalizePositiveInteger(input.qty, "qty")
        : current.qty;

    const nextShippedQty =
      input.shipped_qty !== undefined
        ? normalizeNonNegativeInteger(input.shipped_qty, "shipped_qty")
        : current.shipped_qty;

    if (nextShippedQty > nextQty) {
      return {
        data: null,
        error: new Error("shipped_qty cannot be greater than qty."),
      };
    }

    const supabase = createSupabaseServerClient();
    const payload = buildOrderItemPayload(input);

    const { data, error } = await supabase
      .from("order_items")
      .update(payload)
      .eq("id", id.trim())
      .select(ORDER_ITEM_SELECT)
      .single();

    if (error) return { data: null, error };

    return {
      data: data as OrderItemRow,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function deleteOrderItem(
  id: string
): Promise<DbResult<{ id: string }>> {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from("order_items")
    .delete()
    .eq("id", id.trim());

  if (error) return { data: null, error };

  return {
    data: { id },
    error: null,
  };
}