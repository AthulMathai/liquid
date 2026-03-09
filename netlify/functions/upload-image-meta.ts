import type { Handler } from "@netlify/functions";
import { createSupabaseAdminClient } from "../../src/lib/supabase/admin";

type IncomingBody = {
  item_id: string;
  storage_path: string;
  public_url?: string | null;
  file_name?: string | null;
  sort_order?: number;
  is_primary?: boolean;
};

type SuccessResponse = {
  ok: true;
  image: {
    id: string;
    item_id: string;
    storage_path: string;
    public_url: string | null;
    file_name: string | null;
    sort_order: number;
    is_primary: boolean;
    created_at: string;
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

function normalizeSortOrder(value: unknown) {
  if (value === null || value === undefined || value === "") return 0;

  const parsed = Math.floor(Number(value));
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error("sort_order must be 0 or greater.");
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
    const storagePath = normalizeRequired(body.storage_path, "storage_path");
    const publicUrl = normalizeText(body.public_url);
    const fileName = normalizeText(body.file_name);
    const sortOrder = normalizeSortOrder(body.sort_order);
    const isPrimary = body.is_primary === true;

    const supabase = createSupabaseAdminClient();

    const { data: item, error: itemError } = await supabase
      .from("items")
      .select("id")
      .eq("id", itemId)
      .single();

    if (itemError || !item) {
      return json(404, {
        ok: false,
        error: itemError?.message || "Item not found.",
      });
    }

    if (isPrimary) {
      const { error: clearPrimaryError } = await supabase
        .from("item_images")
        .update({ is_primary: false })
        .eq("item_id", itemId)
        .eq("is_primary", true);

      if (clearPrimaryError) {
        return json(500, {
          ok: false,
          error: clearPrimaryError.message,
        });
      }
    }

    const { data, error } = await supabase
      .from("item_images")
      .insert({
        item_id: itemId,
        storage_path: storagePath,
        public_url: publicUrl,
        file_name: fileName,
        sort_order: sortOrder,
        is_primary: isPrimary,
      })
      .select(
        `
          id,
          item_id,
          storage_path,
          public_url,
          file_name,
          sort_order,
          is_primary,
          created_at
        `
      )
      .single();

    if (error || !data) {
      return json(500, {
        ok: false,
        error: error?.message || "Failed to save image metadata.",
      });
    }

    return json(200, {
      ok: true,
      image: {
        id: data.id,
        item_id: data.item_id,
        storage_path: data.storage_path,
        public_url: data.public_url,
        file_name: data.file_name,
        sort_order: Number(data.sort_order ?? 0),
        is_primary: Boolean(data.is_primary),
        created_at: data.created_at,
      },
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error while saving image metadata.",
    });
  }
};

export default handler;