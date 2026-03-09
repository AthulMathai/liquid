import { PostgrestError } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ItemRow = {
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
  status: string;
  has_images: boolean;
  primary_image_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ItemWithAvailableQty = ItemRow & {
  available_qty: number;
};

export type CreateItemInput = {
  sku: string;
  barcode_value?: string | null;
  item_number?: string | null;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  brand?: string | null;
  model?: string | null;
  condition?: string | null;
  cost?: number;
  listed_price?: number;
  min_acceptable_price?: number;
  on_hand_qty?: number;
  reserved_qty?: number;
  status?: string;
  notes?: string | null;
};

export type UpdateItemInput = Partial<CreateItemInput>;

type DbResult<T> =
  | { data: T; error: null }
  | { data: null; error: PostgrestError | Error };

const ITEM_BASE_SELECT = `
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
  status,
  has_images,
  primary_image_url,
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

function normalizeRequiredSku(sku: string) {
  const trimmed = sku.trim();
  if (!trimmed) {
    throw new Error("SKU is required.");
  }
  return trimmed;
}

function buildItemPayload(input: CreateItemInput | UpdateItemInput) {
  const payload: Record<string, unknown> = {};

  if ("sku" in input && typeof input.sku === "string") {
    payload.sku = normalizeRequiredSku(input.sku);
  }

  if ("barcode_value" in input) {
    payload.barcode_value = normalizeText(input.barcode_value);
  }

  if ("item_number" in input) {
    payload.item_number = normalizeText(input.item_number);
  }

  if ("title" in input) {
    payload.title = normalizeText(input.title);
  }

  if ("description" in input) {
    payload.description = normalizeText(input.description);
  }

  if ("category" in input) {
    payload.category = normalizeText(input.category);
  }

  if ("brand" in input) {
    payload.brand = normalizeText(input.brand);
  }

  if ("model" in input) {
    payload.model = normalizeText(input.model);
  }

  if ("condition" in input) {
    payload.condition = normalizeText(input.condition);
  }

  if ("notes" in input) {
    payload.notes = normalizeText(input.notes);
  }

  if ("cost" in input && input.cost !== undefined) {
    payload.cost = input.cost;
  }

  if ("listed_price" in input && input.listed_price !== undefined) {
    payload.listed_price = input.listed_price;
  }

  if (
    "min_acceptable_price" in input &&
    input.min_acceptable_price !== undefined
  ) {
    payload.min_acceptable_price = input.min_acceptable_price;
  }

  if ("on_hand_qty" in input && input.on_hand_qty !== undefined) {
    payload.on_hand_qty = input.on_hand_qty;
  }

  if ("reserved_qty" in input && input.reserved_qty !== undefined) {
    payload.reserved_qty = input.reserved_qty;
  }

  if ("status" in input && input.status !== undefined) {
    payload.status = input.status;
  }

  return payload;
}

export async function listItems(): Promise<DbResult<ItemWithAvailableQty[]>> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("items_with_available_qty")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { data: null, error };

  return {
    data: (data ?? []) as ItemWithAvailableQty[],
    error: null,
  };
}

export async function getItemById(
  id: string
): Promise<DbResult<ItemWithAvailableQty>> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("items_with_available_qty")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { data: null, error };

  return {
    data: data as ItemWithAvailableQty,
    error: null,
  };
}

export async function getItemBySku(
  sku: string
): Promise<DbResult<ItemWithAvailableQty>> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("items_with_available_qty")
    .select("*")
    .eq("sku", sku.trim())
    .single();

  if (error) return { data: null, error };

  return {
    data: data as ItemWithAvailableQty,
    error: null,
  };
}

export async function getItemByScanValue(
  scanValue: string
): Promise<DbResult<ItemWithAvailableQty>> {
  const supabase = createSupabaseServerClient();
  const normalized = scanValue.trim();

  const { data, error } = await supabase
    .from("items_with_available_qty")
    .select("*")
    .or(`sku.eq.${normalized},barcode_value.eq.${normalized}`)
    .limit(1)
    .maybeSingle();

  if (error) return { data: null, error };

  if (!data) {
    return {
      data: null,
      error: new Error(`No product found for scan value "${normalized}".`),
    };
  }

  return {
    data: data as ItemWithAvailableQty,
    error: null,
  };
}

export async function createItem(
  input: CreateItemInput
): Promise<DbResult<ItemRow>> {
  try {
    const supabase = createSupabaseServerClient();
    const payload = buildItemPayload(input);

    const { data, error } = await supabase
      .from("items")
      .insert(payload)
      .select(ITEM_BASE_SELECT)
      .single();

    if (error) return { data: null, error };

    return {
      data: data as ItemRow,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function updateItem(
  id: string,
  input: UpdateItemInput
): Promise<DbResult<ItemRow>> {
  try {
    const supabase = createSupabaseServerClient();
    const payload = buildItemPayload(input);

    const { data, error } = await supabase
      .from("items")
      .update(payload)
      .eq("id", id)
      .select(ITEM_BASE_SELECT)
      .single();

    if (error) return { data: null, error };

    return {
      data: data as ItemRow,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function upsertItemBySku(
  input: CreateItemInput
): Promise<DbResult<ItemRow>> {
  try {
    const supabase = createSupabaseServerClient();
    const payload = buildItemPayload(input);

    const { data, error } = await supabase
      .from("items")
      .upsert(payload, {
        onConflict: "sku",
      })
      .select(ITEM_BASE_SELECT)
      .single();

    if (error) return { data: null, error };

    return {
      data: data as ItemRow,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function deleteItem(id: string): Promise<DbResult<{ id: string }>> {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from("items").delete().eq("id", id);

  if (error) return { data: null, error };

  return {
    data: { id },
    error: null,
  };
}