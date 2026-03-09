import { upsertItemBySku, type ItemRow } from "@/lib/db/items";
import type { ParsedCsvRow } from "./parseCsv";
import type {
  InventoryCsvMapping,
  InventoryCsvValidationIssue,
} from "./validateInventoryCsv";
import { validateInventoryCsv } from "./validateInventoryCsv";
import { normalizeInventoryRow } from "./normalizeInventoryRow";

export type ImportInventoryRowsSuccess = {
  importedCount: number;
  skippedCount: number;
  items: ItemRow[];
  issues: InventoryCsvValidationIssue[];
};

export type ImportInventoryRowsResult =
  | { data: ImportInventoryRowsSuccess; error: null }
  | { data: null; error: Error };

export async function importInventoryRows(
  rows: ParsedCsvRow[],
  mapping: InventoryCsvMapping
): Promise<ImportInventoryRowsResult> {
  try {
    const validation = validateInventoryCsv(rows, mapping);

    if (!validation.requiredFieldsPresent) {
      return {
        data: null,
        error: new Error(
          `Missing required field mappings: ${validation.missingRequiredFields.join(
            ", "
          )}`
        ),
      };
    }

    const blockingIssues = validation.issues.filter(
      (issue) => issue.severity === "error"
    );

    if (blockingIssues.length > 0) {
      const preview = blockingIssues
        .slice(0, 5)
        .map((issue) => {
          const rowLabel =
            issue.rowIndex >= 0 ? `row ${issue.rowIndex + 1}` : "file";
          return `${rowLabel} [${issue.field}]: ${issue.message}`;
        })
        .join(" | ");

      return {
        data: null,
        error: new Error(`CSV validation failed: ${preview}`),
      };
    }

    const importedItems: ItemRow[] = [];
    let skippedCount = 0;

    for (const row of rows) {
      const normalized = normalizeInventoryRow(row, mapping);

      if (!normalized.sku || !normalized.description) {
        skippedCount += 1;
        continue;
      }

      const result = await upsertItemBySku({
        sku: normalized.sku,
        barcode_value: normalized.barcode_value,
        item_number: normalized.item_number,
        title: normalized.title,
        description: normalized.description,
        on_hand_qty: normalized.on_hand_qty,
        listed_price: normalized.listed_price,
        min_acceptable_price: normalized.min_acceptable_price,
        status: "draft",
      });

      if (result.error || !result.data) {
        return {
          data: null,
          error:
            result.error instanceof Error
              ? result.error
              : new Error("Failed to import inventory row."),
        };
      }

      importedItems.push(result.data);
    }

    return {
      data: {
        importedCount: importedItems.length,
        skippedCount,
        items: importedItems,
        issues: validation.issues,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Failed to import inventory rows."),
    };
  }
}