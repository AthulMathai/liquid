import { PostgrestError } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ItemImageRow = {
  id: string;
  item_id: string;
  storage_path: string;
  public_url: string | null;
  file_name: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
};

export type CreateItemImageInput = {
  item_id: string;
  storage_path: string;
  public_url?: string | null;
  file_name?: string | null;
  sort_order?: number;
  is_primary?: boolean;
};

export type UpdateItemImageInput = Partial<{
  public_url: string | null;
  file_name: string | null;
  sort_order: number;
  is_primary: boolean;
}>;

type DbResult<T> =
  | { data: T; error: null }
  | { data: null; error: PostgrestError | Error };

const ITEM_IMAGE_SELECT = `
  id,
  item_id,
  storage_path,
  public_url,
  file_name,
  sort_order,
  is_primary,
  created_at
`;

function normalizeText(value?: string | null) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function normalizeRequired(value: string, fieldName: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${fieldName} is required.`);
  }
  return trimmed;
}

function buildItemImagePayload(
  input: CreateItemImageInput | UpdateItemImageInput
) {
  const payload: Record<string, unknown> = {};

  if ("item_id" in input && typeof input.item_id === "string") {
    payload.item_id = normalizeRequired(input.item_id, "item_id");
  }

  if ("storage_path" in input && typeof input.storage_path === "string") {
    payload.storage_path = normalizeRequired(input.storage_path, "storage_path");
  }

  if ("public_url" in input) {
    payload.public_url = normalizeText(input.public_url);
  }

  if ("file_name" in input) {
    payload.file_name = normalizeText(input.file_name);
  }

  if ("sort_order" in input && input.sort_order !== undefined) {
    payload.sort_order = input.sort_order;
  }

  if ("is_primary" in input && input.is_primary !== undefined) {
    payload.is_primary = input.is_primary;
  }

  return payload;
}

export async function listItemImages(
  itemId: string
): Promise<DbResult<ItemImageRow[]>> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("item_images")
    .select(ITEM_IMAGE_SELECT)
    .eq("item_id", itemId.trim())
    .order("is_primary", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return { data: null, error };

  return {
    data: (data ?? []) as ItemImageRow[],
    error: null,
  };
}

export async function getItemImageById(
  id: string
): Promise<DbResult<ItemImageRow>> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("item_images")
    .select(ITEM_IMAGE_SELECT)
    .eq("id", id.trim())
    .single();

  if (error) return { data: null, error };

  return {
    data: data as ItemImageRow,
    error: null,
  };
}

export async function createItemImage(
  input: CreateItemImageInput
): Promise<DbResult<ItemImageRow>> {
  try {
    const supabase = createSupabaseServerClient();
    const payload = buildItemImagePayload(input);

    const { data, error } = await supabase
      .from("item_images")
      .insert(payload)
      .select(ITEM_IMAGE_SELECT)
      .single();

    if (error) return { data: null, error };

    return {
      data: data as ItemImageRow,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function updateItemImage(
  id: string,
  input: UpdateItemImageInput
): Promise<DbResult<ItemImageRow>> {
  try {
    const supabase = createSupabaseServerClient();
    const payload = buildItemImagePayload(input);

    const { data, error } = await supabase
      .from("item_images")
      .update(payload)
      .eq("id", id.trim())
      .select(ITEM_IMAGE_SELECT)
      .single();

    if (error) return { data: null, error };

    return {
      data: data as ItemImageRow,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function deleteItemImage(
  id: string
): Promise<DbResult<{ id: string }>> {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from("item_images")
    .delete()
    .eq("id", id.trim());

  if (error) return { data: null, error };

  return {
    data: { id },
    error: null,
  };
}

export async function clearPrimaryImageForItem(
  itemId: string
): Promise<DbResult<ItemImageRow[]>> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("item_images")
    .update({ is_primary: false })
    .eq("item_id", itemId.trim())
    .eq("is_primary", true)
    .select(ITEM_IMAGE_SELECT);

  if (error) return { data: null, error };

  return {
    data: (data ?? []) as ItemImageRow[],
    error: null,
  };
}

export async function setPrimaryImageForItem(
  itemId: string,
  imageId: string
): Promise<DbResult<ItemImageRow>> {
  const supabase = createSupabaseServerClient();

  const clearResult = await supabase
    .from("item_images")
    .update({ is_primary: false })
    .eq("item_id", itemId.trim())
    .eq("is_primary", true);

  if (clearResult.error) {
    return {
      data: null,
      error: clearResult.error,
    };
  }

  const { data, error } = await supabase
    .from("item_images")
    .update({ is_primary: true })
    .eq("item_id", itemId.trim())
    .eq("id", imageId.trim())
    .select(ITEM_IMAGE_SELECT)
    .single();

  if (error) return { data: null, error };

  return {
    data: data as ItemImageRow,
    error: null,
  };
}