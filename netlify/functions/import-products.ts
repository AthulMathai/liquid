import type { Handler } from "@netlify/functions";
import Papa from "papaparse";
import { createSupabaseAdminClient } from "../../src/lib/supabase/admin";

type IncomingRow = Record<string, string | number | null | undefined>;

type ImportRowPayload = {
  sku: string;
  barcode_value: string;
  item_number: string | null;
  title: string | null;
  description: string;
  on_hand_qty: number;
  listed_price: number;
  min_acceptable_price: number;
  status: string;
};

type SuccessResponse = {
  ok: true;
  summary: {
    received: number;
    imported: number;
    skipped: number;
    warnings: string[];
  };
  items: Array<{
    id: string;
    sku: string;
    description: string | null;
    on_hand_qty: number;
    listed_price: number;
    min_acceptable_price: number;
    status: string;
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

function normalizeHeader(value: string) {
  return value.trim();
}

function normalizeText(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function normalizeSku(value: unknown) {
  return normalizeText(value).toUpperCase();
}

function normalizeNullable(value: unknown) {
  const trimmed = normalizeText(value);
  return trimmed.length ? trimmed : null;
}

function normalizeNumber(value: unknown, fallback = 0) {
  const trimmed = normalizeText(value);
  if (!trimmed) return fallback;

  const cleaned = trimmed.replace(/[$,]/g, "");
  const parsed = Number(cleaned);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildRowPayload(row: IncomingRow): ImportRowPayload | null {
  const sku =
    normalizeSku(row.sku) ||
    normalizeSku(row.SKU) ||
    normalizeSku(row.product_id) ||
    normalizeSku(row.Product_ID) ||
    normalizeSku(row.item_number) ||
    normalizeSku(row.Item_number);

  const description =
    normalizeText(row.description) ||
    normalizeText(row.Description) ||
    normalizeText(row.title) ||
    normalizeText(row.Title);

  if (!sku || !description) {
    return null;
  }

  const itemNumber =
    normalizeNullable(row.item_number) ||
    normalizeNullable(row.Item_number) ||
    sku;

  const listedPrice =
    normalizeNumber(row.listed_price) ||
    normalizeNumber(row.Listed_price) ||
    normalizeNumber(row.price) ||
    normalizeNumber(row.Price);

  const minAcceptablePrice =
    normalizeNumber(row.min_acceptable_price) ||
    normalizeNumber(row.Min_acceptable_Price) ||
    normalizeNumber(row.min_price) ||
    normalizeNumber(row.Min_price);

  const onHandQty =
    normalizeNumber(row.on_hand_qty) ||
    normalizeNumber(row.On_hand_qty) ||
    normalizeNumber(row.qty) ||
    normalizeNumber(row.Quantity);

  const barcodeValue =
    normalizeNullable(row.barcode_value) ||
    normalizeNullable(row.Barcode_value) ||
    normalizeNullable(row.barcode) ||
    sku;

  return {
    sku,
    barcode_value: barcodeValue,
    item_number: itemNumber,
    title: toTitleCase(description),
    description,
    on_hand_qty: Math.max(0, Math.floor(onHandQty)),
    listed_price: Math.max(0, listedPrice),
    min_acceptable_price: Math.max(0, minAcceptablePrice),
    status: "draft",
  };
}

function parseCsvText(csvText: string): Promise<IncomingRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<IncomingRow>(csvText, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: normalizeHeader,
      complete: (results) => {
        const rows = (results.data ?? []).filter((row) =>
          Object.values(row).some((value) => normalizeText(value).length > 0)
        );

        if (results.errors?.length) {
          const fatal = results.errors.find(
            (error) => error.code !== "UndetectableDelimiter"
          );

          if (fatal) {
            reject(
              new Error(
                `CSV parse error: ${fatal.message}${
                  typeof fatal.row === "number" ? ` at row ${fatal.row + 1}` : ""
                }`
              )
            );
            return;
          }
        }

        resolve(rows);
      },
      error: (error: Error) => reject(error),
    });
  });
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

    const parsedBody = JSON.parse(event.body) as {
      rows?: IncomingRow[];
      csvText?: string;
    };

    let incomingRows: IncomingRow[] = [];

    if (Array.isArray(parsedBody.rows)) {
      incomingRows = parsedBody.rows;
    } else if (typeof parsedBody.csvText === "string" && parsedBody.csvText.trim()) {
      incomingRows = await parseCsvText(parsedBody.csvText);
    } else {
      return json(400, {
        ok: false,
        error: 'Provide either "rows" or "csvText" in the request body.',
      });
    }

    const warnings: string[] = [];
    const validPayloads: ImportRowPayload[] = [];
    let skipped = 0;

    for (let index = 0; index < incomingRows.length; index += 1) {
      const payload = buildRowPayload(incomingRows[index]);

      if (!payload) {
        skipped += 1;
        warnings.push(
          `Skipped row ${index + 1}: missing required SKU or description.`
        );
        continue;
      }

      if (!payload.barcode_value) {
        payload.barcode_value = payload.sku;
      }

      if (
        payload.min_acceptable_price > 0 &&
        payload.listed_price > 0 &&
        payload.min_acceptable_price > payload.listed_price
      ) {
        warnings.push(
          `Row ${index + 1} (${payload.sku}): min acceptable price is greater than listed price.`
        );
      }

      validPayloads.push(payload);
    }

    if (validPayloads.length === 0) {
      return json(400, {
        ok: false,
        error: "No valid rows found to import.",
        details: warnings,
      });
    }

    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("items")
      .upsert(validPayloads, { onConflict: "sku" })
      .select(
        `
          id,
          sku,
          description,
          on_hand_qty,
          listed_price,
          min_acceptable_price,
          status
        `
      );

    if (error) {
      return json(500, {
        ok: false,
        error: error.message,
      });
    }

    return json(200, {
      ok: true,
      summary: {
        received: incomingRows.length,
        imported: data?.length ?? 0,
        skipped,
        warnings,
      },
      items: (data ?? []).map((item) => ({
        id: item.id,
        sku: item.sku,
        description: item.description,
        on_hand_qty: item.on_hand_qty,
        listed_price: item.listed_price,
        min_acceptable_price: item.min_acceptable_price,
        status: item.status,
      })),
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error while importing products.",
    });
  }
};

export default handler;