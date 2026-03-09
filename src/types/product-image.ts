export type ProductImage = {
  id: string;

  item_id: string;

  storage_path: string;

  public_url: string | null;

  file_name: string | null;

  sort_order: number;

  is_primary: boolean;

  created_at: string;

  updated_at?: string | null;
};

export type CreateProductImageInput = {
  item_id: string;

  storage_path: string;

  public_url?: string | null;

  file_name?: string | null;

  sort_order?: number;

  is_primary?: boolean;
};

export type UpdateProductImageInput = {
  public_url?: string | null;

  file_name?: string | null;

  sort_order?: number;

  is_primary?: boolean;
};

export type ProductImageList = ProductImage[];

export function getPrimaryImage(images: ProductImage[]): ProductImage | null {
  if (!images || images.length === 0) return null;

  const primary = images.find((img) => img.is_primary);

  if (primary) return primary;

  const sorted = [...images].sort((a, b) => {
    const aOrder = typeof a.sort_order === "number" ? a.sort_order : 999999;
    const bOrder = typeof b.sort_order === "number" ? b.sort_order : 999999;

    return aOrder - bOrder;
  });

  return sorted[0] ?? null;
}

export function sortProductImages(images: ProductImage[]): ProductImage[] {
  return [...images].sort((a, b) => {
    const aPrimary = a.is_primary ? 1 : 0;
    const bPrimary = b.is_primary ? 1 : 0;

    if (aPrimary !== bPrimary) {
      return bPrimary - aPrimary;
    }

    const aOrder = typeof a.sort_order === "number" ? a.sort_order : 999999;
    const bOrder = typeof b.sort_order === "number" ? b.sort_order : 999999;

    return aOrder - bOrder;
  });
}