export type ParsedScanValue = {
  raw: string;
  normalized: string;
  normalizedUpper: string;
  type: "empty" | "sku" | "barcode" | "unknown";
};

function cleanScanValue(value: string) {
  return value
    .replace(/\uFEFF/g, "")
    .replace(/\r/g, "")
    .replace(/\n/g, "")
    .trim();
}

function detectType(normalized: string): ParsedScanValue["type"] {
  if (!normalized) return "empty";

  const upper = normalized.toUpperCase();

  if (/^[A-Z0-9\-_]+$/.test(upper)) {
    return "sku";
  }

  if (/^\d{8,14}$/.test(normalized)) {
    return "barcode";
  }

  return "unknown";
}

export function parseScanValue(value: string): ParsedScanValue {
  const cleaned = cleanScanValue(value);
  const normalizedUpper = cleaned.toUpperCase();

  return {
    raw: value,
    normalized: cleaned,
    normalizedUpper,
    type: detectType(cleaned),
  };
}