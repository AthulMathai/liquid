import { PostgrestError } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type MarketplaceListingRow = {
  id: string;
  item_id: string;
  platform: string;
  external_listing_id: string | null;
  listing_title: string | null;
  listing_price: number;
  listing_url: string | null;
  qty_listed: number;
  listing_status: string;
  listed_at: string | null;
  updated_at: string;
  notes: string | null;
};

export type CreateMarketplaceListingInput = {
  item_id: string;
  platform: string;
  external_listing_id?: string | null;
  listing_title?: string | null;
  listing_price?: number;
  listing_url?: string | null;
  qty_listed?: number;
  listing_status?: string;
  listed_at?: string | null;
  notes?: string | null;
};

export type UpdateMarketplaceListingInput = Partial<
  Omit<CreateMarketplaceListingInput, "item_id" | "platform">
>;

type DbResult<T> =
  | { data: T; error: null }
  | { data: null; error: PostgrestError | Error };

const LISTING_SELECT = `
  id,
  item_id,
  platform,
  external_listing_id,
  listing_title,
  listing_price,
  listing_url,
  qty_listed,
  listing_status,
  listed_at,
  updated_at,
  notes
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

function normalizeNonNegativeNumber(value: number, fieldName: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${fieldName} must be 0 or greater.`);
  }
  return parsed;
}

function normalizePositiveInteger(value: number, fieldName: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${fieldName} must be greater than 0.`);
  }
  return Math.floor(parsed);
}

function buildListingPayload(
  input: CreateMarketplaceListingInput | UpdateMarketplaceListingInput
) {
  const payload: Record<string, unknown> = {};

  if ("item_id" in input && typeof input.item_id === "string") {
    payload.item_id = normalizeRequired(input.item_id, "item_id");
  }

  if ("platform" in input && typeof input.platform === "string") {
    payload.platform = normalizeRequired(input.platform, "platform");
  }

  if ("external_listing_id" in input) {
    payload.external_listing_id = normalizeText(input.external_listing_id);
  }

  if ("listing_title" in input) {
    payload.listing_title = normalizeText(input.listing_title);
  }

  if ("listing_url" in input) {
    payload.listing_url = normalizeText(input.listing_url);
  }

  if ("listing_price" in input && input.listing_price !== undefined) {
    payload.listing_price = normalizeNonNegativeNumber(
      input.listing_price,
      "listing_price"
    );
  }

  if ("qty_listed" in input && input.qty_listed !== undefined) {
    payload.qty_listed = normalizePositiveInteger(input.qty_listed, "qty_listed");
  }

  if ("listing_status" in input && input.listing_status !== undefined) {
    payload.listing_status = normalizeRequired(
      input.listing_status,
      "listing_status"
    );
  }

  if ("listed_at" in input) {
    payload.listed_at = normalizeText(input.listed_at);
  }

  if ("notes" in input) {
    payload.notes = normalizeText(input.notes);
  }

  return payload;
}

export async function listMarketplaceListings(): Promise<
  DbResult<MarketplaceListingRow[]>
> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("marketplace_listings")
    .select(LISTING_SELECT)
    .order("updated_at", { ascending: false });

  if (error) return { data: null, error };

  return {
    data: (data ?? []) as MarketplaceListingRow[],
    error: null,
  };
}

export async function listListingsByItemId(
  itemId: string
): Promise<DbResult<MarketplaceListingRow[]>> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("marketplace_listings")
    .select(LISTING_SELECT)
    .eq("item_id", itemId.trim())
    .order("updated_at", { ascending: false });

  if (error) return { data: null, error };

  return {
    data: (data ?? []) as MarketplaceListingRow[],
    error: null,
  };
}

export async function getMarketplaceListingById(
  id: string
): Promise<DbResult<MarketplaceListingRow>> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("marketplace_listings")
    .select(LISTING_SELECT)
    .eq("id", id.trim())
    .single();

  if (error) return { data: null, error };

  return {
    data: data as MarketplaceListingRow,
    error: null,
  };
}

export async function createMarketplaceListing(
  input: CreateMarketplaceListingInput
): Promise<DbResult<MarketplaceListingRow>> {
  try {
    const supabase = createSupabaseServerClient();
    const payload = {
      listing_price: 0,
      qty_listed: 1,
      listing_status: "draft",
      ...buildListingPayload(input),
    };

    const { data, error } = await supabase
      .from("marketplace_listings")
      .insert(payload)
      .select(LISTING_SELECT)
      .single();

    if (error) return { data: null, error };

    return {
      data: data as MarketplaceListingRow,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function updateMarketplaceListing(
  id: string,
  input: UpdateMarketplaceListingInput
): Promise<DbResult<MarketplaceListingRow>> {
  try {
    const supabase = createSupabaseServerClient();
    const payload = buildListingPayload(input);

    const { data, error } = await supabase
      .from("marketplace_listings")
      .update(payload)
      .eq("id", id.trim())
      .select(LISTING_SELECT)
      .single();

    if (error) return { data: null, error };

    return {
      data: data as MarketplaceListingRow,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function deleteMarketplaceListing(
  id: string
): Promise<DbResult<{ id: string }>> {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from("marketplace_listings")
    .delete()
    .eq("id", id.trim());

  if (error) return { data: null, error };

  return {
    data: { id },
    error: null,
  };
}