type GenerateStoragePathInput = {
  sku: string;
  fileName?: string;
  index?: number;
};

function sanitizeSegment(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .toUpperCase();
}

function getExtension(fileName?: string) {
  if (!fileName) return "jpg";

  const parts = fileName.split(".");
  const ext = parts.length > 1 ? parts.pop() : "";

  if (!ext) return "jpg";

  const cleaned = ext.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned || "jpg";
}

export function generateStoragePath({
  sku,
  fileName,
  index,
}: GenerateStoragePathInput) {
  const safeSku = sanitizeSegment(sku);

  if (!safeSku) {
    throw new Error("SKU is required to generate an image storage path.");
  }

  const safeExtension = getExtension(fileName);
  const safeIndex = typeof index === "number" && index > 0 ? index : Date.now();

  return `product-images/${safeSku}/image-${safeIndex}.${safeExtension}`;
}

export default generateStoragePath;