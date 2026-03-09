import type { ParsedCsvRow } from "./parseCsv";

export type InventoryCsvField =
  | "sku"
  | "item_number"
  | "description"
  | "on_hand_qty"
  | "listed_price"
  | "min_acceptable_price"
  | "barcode_value";

export type InventoryCsvMapping = Record<InventoryCsvField, string | null>;

export type InventoryCsvValidationIssue = {
  rowIndex: number;
  field: InventoryCsvField | "row";
  severity: "error" | "warning";
  message: string;
};

export type InventoryCsvValidationResult = {
  isValid: boolean;
  requiredFieldsPresent: boolean;
  rowCount: number;
  mappedColumns: InventoryCsvMapping;
  missingRequiredFields: InventoryCsvField[];
  issues: InventoryCsvValidationIssue[];
};

export const DEFAULT_INVENTORY_MAPPING: InventoryCsvMapping = {
  sku: "sku",
  item_number: "item_number",
  description: "description",
  on_hand_qty: "on_hand_qty",
  listed_price: "listed_price",
  min_acceptable_price: "min_acceptable_price",
  barcode_value: "barcode_value",
};

const REQUIRED_FIELDS: InventoryCsvField[] = ["sku", "description"];

function normalizeHeader(value: string) {
  return value.trim().toLowerCase();
}

function getCell(
  row: ParsedCsvRow,
  mappedColumn: string | null | undefined
): string {
  if (!mappedColumn) return "";
  return (row[mappedColumn] ?? "").trim();
}

function isNumericLike(value: string) {
  if (!value.trim()) return false;
  return !Number.isNaN(Number(value));
}

function isNonNegativeNumericLike(value: string) {
  return isNumericLike(value) && Number(value) >= 0;
}

export function buildInventoryMappingFromHeaders(
  headers: string[]
): InventoryCsvMapping {
  const normalizedHeaders = new Map<string, string>();

  for (const header of headers) {
    normalizedHeaders.set(normalizeHeader(header), header);
  }

  const candidates: Record<InventoryCsvField, string[]> = {
    sku: ["sku", "product_id", "productid", "item_number", "item number"],
    item_number: ["item_number", "item number", "item", "product_id"],
    description: ["description", "title", "name", "product_description"],
    on_hand_qty: ["on_hand_qty", "on hand qty", "qty", "quantity", "onhandqty"],
    listed_price: ["listed_price", "listed price", "price", "sell_price"],
    min_acceptable_price: [
      "min_acceptable_price",
      "min acceptable price",
      "minimum_price",
      "min_price",
    ],
    barcode_value: ["barcode_value", "barcode", "upc", "ean", "scan_value"],
  };

  const mapping = { ...DEFAULT_INVENTORY_MAPPING };

  for (const field of Object.keys(candidates) as InventoryCsvField[]) {
    const matched = candidates[field]
      .map((candidate) => normalizedHeaders.get(candidate))
      .find(Boolean);

    mapping[field] = matched ?? null;
  }

  return mapping;
}

export function validateInventoryCsv(
  rows: ParsedCsvRow[],
  mapping: InventoryCsvMapping = DEFAULT_INVENTORY_MAPPING
): InventoryCsvValidationResult {
  const issues: InventoryCsvValidationIssue[] = [];

  const missingRequiredFields = REQUIRED_FIELDS.filter(
    (field) => !mapping[field]
  );

  if (rows.length === 0) {
    issues.push({
      rowIndex: -1,
      field: "row",
      severity: "error",
      message: "The CSV does not contain any data rows.",
    });
  }

  for (const field of missingRequiredFields) {
    issues.push({
      rowIndex: -1,
      field,
      severity: "error",
      message: `Required column mapping is missing for "${field}".`,
    });
  }

  rows.forEach((row, index) => {
    const sku = getCell(row, mapping.sku);
    const description = getCell(row, mapping.description);
    const onHandQty = getCell(row, mapping.on_hand_qty);
    const listedPrice = getCell(row, mapping.listed_price);
    const minAcceptablePrice = getCell(row, mapping.min_acceptable_price);
    const barcodeValue = getCell(row, mapping.barcode_value);

    if (!sku) {
      issues.push({
        rowIndex: index,
        field: "sku",
        severity: "error",
        message: "SKU is required.",
      });
    }

    if (!description) {
      issues.push({
        rowIndex: index,
        field: "description",
        severity: "error",
        message: "Description is required.",
      });
    }

    if (onHandQty && !isNonNegativeNumericLike(onHandQty)) {
      issues.push({
        rowIndex: index,
        field: "on_hand_qty",
        severity: "error",
        message: "On hand quantity must be a non-negative number.",
      });
    }

    if (listedPrice && !isNonNegativeNumericLike(listedPrice)) {
      issues.push({
        rowIndex: index,
        field: "listed_price",
        severity: "error",
        message: "Listed price must be a non-negative number.",
      });
    }

    if (minAcceptablePrice && !isNonNegativeNumericLike(minAcceptablePrice)) {
      issues.push({
        rowIndex: index,
        field: "min_acceptable_price",
        severity: "error",
        message: "Minimum acceptable price must be a non-negative number.",
      });
    }

    if (
      listedPrice &&
      minAcceptablePrice &&
      isNonNegativeNumericLike(listedPrice) &&
      isNonNegativeNumericLike(minAcceptablePrice) &&
      Number(minAcceptablePrice) > Number(listedPrice)
    ) {
      issues.push({
        rowIndex: index,
        field: "min_acceptable_price",
        severity: "warning",
        message:
          "Minimum acceptable price is greater than listed price for this row.",
      });
    }

    if (!barcodeValue && sku) {
      issues.push({
        rowIndex: index,
        field: "barcode_value",
        severity: "warning",
        message:
          "Barcode value is blank. For version 1, setting barcode_value = SKU is recommended.",
      });
    }
  });

  const hasErrors = issues.some((issue) => issue.severity === "error");

  return {
    isValid: !hasErrors,
    requiredFieldsPresent: missingRequiredFields.length === 0,
    rowCount: rows.length,
    mappedColumns: mapping,
    missingRequiredFields,
    issues,
  };
}