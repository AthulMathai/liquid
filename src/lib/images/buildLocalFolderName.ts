import slugify from "@/lib/utils/slugify";

type BuildLocalFolderNameInput = {
  sku: string;
  title?: string | null;
};

function sanitizeSku(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
    .replace(/\s+/g, "-");
}

export function buildLocalFolderName({
  sku,
  title,
}: BuildLocalFolderNameInput) {
  const safeSku = sanitizeSku(sku);

  if (!safeSku) {
    throw new Error("SKU is required to build a local folder name.");
  }

  const safeTitle = slugify(title || "");

  return safeTitle ? `${safeSku}__${safeTitle}` : safeSku;
}

export default buildLocalFolderName;