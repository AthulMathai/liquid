import { PostgrestError } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type OrderRow = {
  id: string;
  order_number: string;
  platform: string | null;
  buyer_name: string | null;
  buyer_email: string | null;
  buyer_phone: string | null;
  buyer_address: string | null;
  payment_method: string | null;
  payment_received: boolean;
  fulfillment_type: string | null;
  shipping_cost: number;
  total_value: number;
  shipped_value: number;
  order_status: string;
  order_date: string | null;
  ship_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderSummaryRow = {
  id: string;
  order_number: string;
  platform: string | null;
  buyer_name: string | null;
  payment_received: boolean;
  fulfillment_type: string | null;
  order_status: string;
  order_date: string | null;
  ship_date: string | null;
  total_value: number;
  shipped_value: number;
  total_order_qty: number;
  total_shipped_qty: number;
  line_count: number;
};

export type CreateOrderInput = {
  order_number: string;
  platform?: string | null;
  buyer_name?: string | null;
  buyer_email?: string | null;
  buyer_phone?: string | null;
  buyer_address?: string | null;
  payment_method?: string | null;
  payment_received?: boolean;
  fulfillment_type?: string | null;
  shipping_cost?: number;
  total_value?: number;
  shipped_value?: number;
  order_status?: string;
  order_date?: string | null;
  ship_date?: string | null;
  notes?: string | null;
};

export type UpdateOrderInput = Partial<CreateOrderInput>;

type DbResult<T> =
  | { data: T; error: null }
  | { data: null; error: PostgrestError | Error };

const ORDER_SELECT = `
  id,
  order_number,
  platform,
  buyer_name,
  buyer_email,
  buyer_phone,
  buyer_address,
  payment_method,
  payment_received,
  fulfillment_type,
  shipping_cost,
  total_value,
  shipped_value,
  order_status,
  order_date,
  ship_date,
  notes,
  created_at,
  updated_at
`;

function normalizeText(value?: string | null) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function normalizeRequiredOrderNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("order_number is required.");
  }
  return trimmed.toUpperCase();
}

function buildOrderPayload(input: CreateOrderInput | UpdateOrderInput) {
  const payload: Record<string, unknown> = {};

  if ("order_number" in input && typeof input.order_number === "string") {
    payload.order_number = normalizeRequiredOrderNumber(input.order_number);
  }

  if ("platform" in input) {
    payload.platform = normalizeText(input.platform);
  }

  if ("buyer_name" in input) {
    payload.buyer_name = normalizeText(input.buyer_name);
  }

  if ("buyer_email" in input) {
    payload.buyer_email = normalizeText(input.buyer_email);
  }

  if ("buyer_phone" in input) {
    payload.buyer_phone = normalizeText(input.buyer_phone);
  }

  if ("buyer_address" in input) {
    payload.buyer_address = normalizeText(input.buyer_address);
  }

  if ("payment_method" in input) {
    payload.payment_method = normalizeText(input.payment_method);
  }

  if ("payment_received" in input && input.payment_received !== undefined) {
    payload.payment_received = input.payment_received;
  }

  if ("fulfillment_type" in input) {
    payload.fulfillment_type = normalizeText(input.fulfillment_type);
  }

  if ("shipping_cost" in input && input.shipping_cost !== undefined) {
    payload.shipping_cost = input.shipping_cost;
  }

  if ("total_value" in input && input.total_value !== undefined) {
    payload.total_value = input.total_value;
  }

  if ("shipped_value" in input && input.shipped_value !== undefined) {
    payload.shipped_value = input.shipped_value;
  }

  if ("order_status" in input && input.order_status !== undefined) {
    payload.order_status = input.order_status;
  }

  if ("order_date" in input) {
    payload.order_date = normalizeText(input.order_date);
  }

  if ("ship_date" in input) {
    payload.ship_date = normalizeText(input.ship_date);
  }

  if ("notes" in input) {
    payload.notes = normalizeText(input.notes);
  }

  return payload;
}

export async function listOrders(): Promise<DbResult<OrderSummaryRow[]>> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("order_summary")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    const fallback = await supabase
      .from("orders")
      .select(ORDER_SELECT)
      .order("created_at", { ascending: false });

    if (fallback.error) return { data: null, error: fallback.error };

    const mapped: OrderSummaryRow[] = (fallback.data ?? []).map((row) => ({
      id: row.id,
      order_number: row.order_number,
      platform: row.platform,
      buyer_name: row.buyer_name,
      payment_received: row.payment_received,
      fulfillment_type: row.fulfillment_type,
      order_status: row.order_status,
      order_date: row.order_date,
      ship_date: row.ship_date,
      total_value: row.total_value,
      shipped_value: row.shipped_value,
      total_order_qty: 0,
      total_shipped_qty: 0,
      line_count: 0,
    }));

    return { data: mapped, error: null };
  }

  return {
    data: (data ?? []) as OrderSummaryRow[],
    error: null,
  };
}

export async function getOrderById(id: string): Promise<DbResult<OrderRow>> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("id", id.trim())
    .single();

  if (error) return { data: null, error };

  return {
    data: data as OrderRow,
    error: null,
  };
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<DbResult<OrderRow>> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("order_number", orderNumber.trim().toUpperCase())
    .single();

  if (error) return { data: null, error };

  return {
    data: data as OrderRow,
    error: null,
  };
}

export async function createOrder(
  input: CreateOrderInput
): Promise<DbResult<OrderRow>> {
  try {
    const supabase = createSupabaseServerClient();
    const payload = buildOrderPayload(input);

    const { data, error } = await supabase
      .from("orders")
      .insert(payload)
      .select(ORDER_SELECT)
      .single();

    if (error) return { data: null, error };

    return {
      data: data as OrderRow,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function updateOrder(
  id: string,
  input: UpdateOrderInput
): Promise<DbResult<OrderRow>> {
  try {
    const supabase = createSupabaseServerClient();
    const payload = buildOrderPayload(input);

    const { data, error } = await supabase
      .from("orders")
      .update(payload)
      .eq("id", id.trim())
      .select(ORDER_SELECT)
      .single();

    if (error) return { data: null, error };

    return {
      data: data as OrderRow,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function upsertOrderByNumber(
  input: CreateOrderInput
): Promise<DbResult<OrderRow>> {
  try {
    const supabase = createSupabaseServerClient();
    const payload = buildOrderPayload(input);

    const { data, error } = await supabase
      .from("orders")
      .upsert(payload, { onConflict: "order_number" })
      .select(ORDER_SELECT)
      .single();

    if (error) return { data: null, error };

    return {
      data: data as OrderRow,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function deleteOrder(
  id: string
): Promise<DbResult<{ id: string }>> {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from("orders").delete().eq("id", id.trim());

  if (error) return { data: null, error };

  return {
    data: { id },
    error: null,
  };
}