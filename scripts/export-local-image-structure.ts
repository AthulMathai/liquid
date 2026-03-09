import fs from "fs";
import path from "path";
import { createSupabaseAdminClient } from "../src/lib/supabase/admin";

type ItemRow = {
  id: string;
  sku: string;
  title: string | null;
  description: string | null;
  primary_image_url: string | null;
  has_images: boolean;
};

type ItemImageRow = {
  id: string;
  item_id: string;
  storage_path: string;
  public_url: string | null;
  file_name: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
};

const BUCKET_NAME =
  process.env.SUPABASE_STORAGE_BUCKET?.trim() || "product-images";

const ROOT_DIR = process.cwd();
const EXPORT_ROOT = path.join(ROOT_DIR, "local-storage", "products");

function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function safeFileName(value: string) {
  return value.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim();
}

function toMetaJson(item: ItemRow, images: ItemImageRow[]) {
  return {
    item_id: item.id,
    sku: item.sku,
    title: item.title,
    description: item.description,
    has_images: item.has_images,
    primary_image_url: item.primary_image_url,
    bucket: BUCKET_NAME,
    exported_at: new Date().toISOString(),
    images: images.map((image) => ({
      id: image.id,
      storage_path: image.storage_path,
      public_url: image.public_url,
      file_name: image.file_name,
      sort_order: image.sort_order,
      is_primary: image.is_primary,
      created_at: image.created_at,
    })),
  };
}

async function main() {
  const supabase = createSupabaseAdminClient();

  ensureDir(EXPORT_ROOT);

  const { data: items, error: itemsError } = await supabase
    .from("items")
    .select("id, sku, title, description, primary_image_url, has_images")
    .order("sku", { ascending: true });

  if (itemsError) {
    throw new Error(`Failed to load items: ${itemsError.message}`);
  }

  const typedItems = (items ?? []) as ItemRow[];

  console.log(`Found ${typedItems.length} item(s). Exporting folder structure...`);

  for (const item of typedItems) {
    const safeSku = safeFileName(item.sku);
    const itemDir = path.join(EXPORT_ROOT, safeSku);

    ensureDir(itemDir);

    const { data: images, error: imagesError } = await supabase
      .from("item_images")
      .select(
        "id, item_id, storage_path, public_url, file_name, sort_order, is_primary, created_at"
      )
      .eq("item_id", item.id)
      .order("is_primary", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (imagesError) {
      throw new Error(
        `Failed to load images for SKU ${item.sku}: ${imagesError.message}`
      );
    }

    const typedImages = (images ?? []) as ItemImageRow[];

    const metaPath = path.join(itemDir, "meta.json");
    fs.writeFileSync(
      metaPath,
      JSON.stringify(toMetaJson(item, typedImages), null, 2),
      "utf8"
    );

    typedImages.forEach((image, index) => {
      const ext =
        path.extname(image.file_name || image.storage_path || "") || ".jpg";

      const placeholderName = safeFileName(
        image.file_name || `image-${index + 1}${ext}`
      );

      const placeholderPath = path.join(itemDir, placeholderName);
      const placeholderContent = [
        `This is a placeholder for ${item.sku}`,
        `storage_path: ${image.storage_path}`,
        `public_url: ${image.public_url ?? ""}`,
        `is_primary: ${String(image.is_primary)}`,
        `sort_order: ${String(image.sort_order)}`,
      ].join("\n");

      fs.writeFileSync(placeholderPath + ".txt", placeholderContent, "utf8");
    });

    console.log(
      `Exported ${item.sku} -> ${typedImages.length} image reference(s)`
    );
  }

  console.log(`Done. Local structure created at: ${EXPORT_ROOT}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});