import { PostgrestError } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type InquiryRow = {
  id: string;
  item_id: string | null;
  platform: string | null;
  buyer_name: string | null;
  buyer_email: string | null;
  buyer_phone: string | null;
  message_summary: string | null;
  offered_price: number | null;
  inquiry_status: string;
  follow_up_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateInquiryInput = {
  item_id?: string | null;
  platform?: string | null;
  buyer_name?: string | null;
  buyer_email?: string | null;
  buyer_phone?: string | null;
  message_summary?: string | null;
  offered_price?: number | null;
  inquiry_status?: string;
  follow_up_date?: string | null;
  notes?: string | null;
};

export type UpdateInquiryInput = Partial<CreateInquiryInput>;

type DbResult<T> =
  | { data: T; error: null }
  | { data: null; error: PostgrestError | Error };

const INQUIRY_SELECT = `
  id,
  item_id,
  platform,
  buyer_name,
  buyer_email,
  buyer_phone,
  message_summary,
  offered_price,
  inquiry_status,
  follow_up_date,
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

function normalizeNonNegativeNumber(value: number, fieldName: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${fieldName} must be 0 or greater.`);
  }

  return parsed;
}

function buildInquiryPayload(input: CreateInquiryInput | UpdateInquiryInput) {
  const payload: Record<string, unknown> = {};

  if ("item_id" in input) {
    payload.item_id = normalizeText(input.item_id);
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

  if ("message_summary" in input) {
    payload.message_summary = normalizeText(input.message_summary);
  }

  if ("offered_price" in input) {
    payload.offered_price =
      input.offered_price === null || input.offered_price === undefined
        ? input.offered_price
        : normalizeNonNegativeNumber(input.offered_price, "offered_price");
  }

  if ("inquiry_status" in input && input.inquiry_status !== undefined) {
    payload.inquiry_status = normalizeText(input.inquiry_status);
  }

  if ("follow_up_date" in input) {
    payload.follow_up_date = normalizeText(input.follow_up_date);
  }

  if ("notes" in input) {
    payload.notes = normalizeText(input.notes);
  }

  return payload;
}

export async function listInquiries(): Promise<DbResult<InquiryRow[]>> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("inquiries")
    .select(INQUIRY_SELECT)
    .order("created_at", { ascending: false });

  if (error) return { data: null, error };

  return {
    data: (data ?? []) as InquiryRow[],
    error: null,
  };
}

export async function listInquiriesByItemId(
  itemId: string
): Promise<DbResult<InquiryRow[]>> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("inquiries")
    .select(INQUIRY_SELECT)
    .eq("item_id", itemId.trim())
    .order("created_at", { ascending: false });

  if (error) return { data: null, error };

  return {
    data: (data ?? []) as InquiryRow[],
    error: null,
  };
}

export async function getInquiryById(
  id: string
): Promise<DbResult<InquiryRow>> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("inquiries")
    .select(INQUIRY_SELECT)
    .eq("id", id.trim())
    .single();

  if (error) return { data: null, error };

  return {
    data: data as InquiryRow,
    error: null,
  };
}

export async function createInquiry(
  input: CreateInquiryInput
): Promise<DbResult<InquiryRow>> {
  try {
    const supabase = createSupabaseServerClient();
    const payload = {
      inquiry_status: "new",
      ...buildInquiryPayload(input),
    };

    const { data, error } = await supabase
      .from("inquiries")
      .insert(payload)
      .select(INQUIRY_SELECT)
      .single();

    if (error) return { data: null, error };

    return {
      data: data as InquiryRow,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function updateInquiry(
  id: string,
  input: UpdateInquiryInput
): Promise<DbResult<InquiryRow>> {
  try {
    const supabase = createSupabaseServerClient();
    const payload = buildInquiryPayload(input);

    const { data, error } = await supabase
      .from("inquiries")
      .update(payload)
      .eq("id", id.trim())
      .select(INQUIRY_SELECT)
      .single();

    if (error) return { data: null, error };

    return {
      data: data as InquiryRow,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
}

export async function deleteInquiry(
  id: string
): Promise<DbResult<{ id: string }>> {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from("inquiries")
    .delete()
    .eq("id", id.trim());

  if (error) return { data: null, error };

  return {
    data: { id },
    error: null,
  };
}