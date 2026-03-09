import { getItemByScanValue, type ItemWithAvailableQty } from "@/lib/db/items";
import { parseScanValue, type ParsedScanValue } from "./parseScanValue";

export type FindProductByScanSuccess = {
  scan: ParsedScanValue;
  product: ItemWithAvailableQty;
};

export type FindProductByScanResult =
  | { data: FindProductByScanSuccess; error: null }
  | { data: null; error: Error };

export async function findProductByScan(
  rawValue: string
): Promise<FindProductByScanResult> {
  try {
    const scan = parseScanValue(rawValue);

    if (scan.type === "empty") {
      return {
        data: null,
        error: new Error("Scan value is empty."),
      };
    }

    const primaryLookup = await getItemByScanValue(scan.normalizedUpper);

    if (!primaryLookup.error && primaryLookup.data) {
      return {
        data: {
          scan,
          product: primaryLookup.data,
        },
        error: null,
      };
    }

    if (scan.normalized !== scan.normalizedUpper) {
      const fallbackLookup = await getItemByScanValue(scan.normalized);

      if (!fallbackLookup.error && fallbackLookup.data) {
        return {
          data: {
            scan,
            product: fallbackLookup.data,
          },
          error: null,
        };
      }
    }

    return {
      data: null,
      error: new Error(`No product found for scan value "${scan.normalized}".`),
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Failed to find product by scan."),
    };
  }
}