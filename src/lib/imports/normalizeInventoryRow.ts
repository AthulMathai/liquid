import type {
  InventoryCsvField,
  InventoryCsvMapping,
} from "./validateInventoryCsv";
import type { ParsedCsvRow } from "./parseCsv";

export type NormalizedInventoryRow = {
  sku: string;
  item_number: string | null;
  title: string | null;
  description: string;
  on_hand_qty: number;
  listed_price: number;
  min_acceptable_price: number;
  barcode_value: string;
};

function getMappedValue(
  row: ParsedCsvRow,
  mapping: InventoryCsvMapping,
  field: InventoryCsvField
): string {
  const column = mapping[field];
  if (!column) return "";
  return (row[column] ?? "").trim();
}

function normalizeText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function normalizeSku(value: string) {
  return value.trim().toUpperCase();
}

function normalizeNumber(value: string, fallback = 0): number {
  const trimmed = value.trim();
  if (!trimmed) return fallback;

  const cleaned = trimmed.replace(/[$,]/g, "");
  const parsed = Number(cleaned);

  if (Number.isNaN(parsed)) return fallback;
  return parsed;
}

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function normalizeInventoryRow(
  row: ParsedCsvRow,
  mapping: InventoryCsvMapping
): NormalizedInventoryRow {
  const rawSku = getMappedValue(row, mapping, "sku");
  const rawItemNumber = getMappedValue(row, mapping, "item_number");
  const rawDescription = getMappedValue(row, mapping, "description");
  const rawOnHandQty = getMappedValue(row, mapping, "on_hand_qty");
  const rawListedPrice = getMappedValue(row, mapping, "listed_price");
  const rawMinAcceptablePrice = getMappedValue(
    row,
    mapping,
    "min_acceptable_price"
  );
  const rawBarcodeValue = getMappedValue(row, mapping, "barcode_value");

  const sku = normalizeSku(rawSku);
  const description = rawDescription.trim();
  const itemNumber = normalizeText(rawItemNumber);
  const onHandQty = normalizeNumber(rawOnHandQty, 0);
  const listedPrice = normalizeNumber(rawListedPrice, 0);
  const minAcceptablePrice = normalizeNumber(rawMinAcceptablePrice, 0);

  return {
    sku,
    item_number: itemNumber,
    title: description ? toTitleCase(description) : null,
    description,
    on_hand_qty: onHandQty,
    listed_price: listedPrice,
    min_acceptable_price: minAcceptablePrice,
    barcode_value: normalizeText(rawBarcodeValue) ?? sku,
  };
}