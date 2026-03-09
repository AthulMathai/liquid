export type ProductStatus =
  | "draft"
  | "ready"
  | "listed"
  | "partial_sold"
  | "sold_out"
  | "hold"
  | "removed";

export type ProductReadinessStatus =
  | "missing_sku"
  | "missing_description"
  | "needs_images"
  | "no_available_qty"
  | "needs_price"
  | "sell_ready";

export type Product = {
  id: string;
  sku: string;
  barcode_value: string | null;
  item_number: string | null;
  title: string | null;
  description: string | null;
  category: string | null;
  brand: string | null;
  model: string | null;
  condition: string | null;
  cost: number;
  listed_price: number;
  min_acceptable_price: number;
  on_hand_qty: number;
  reserved_qty: number;
  available_qty?: number;
  status: ProductStatus | string;
  has_images: boolean;
  primary_image_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  item_id: string;
  storage_path: string;
  public_url: string | null;
  file_name: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
};

export type ProductReadiness = {
  id: string;
  sku: string;
  title: string | null;
  status: ProductStatus | string;
  has_images: boolean;
  on_hand_qty: number;
  reserved_qty: number;
  available_qty: number;
  listed_price: number;
  min_acceptable_price: number;
  readiness_status: ProductReadinessStatus;
};

export type CreateProductInput = {
  sku: string;
  barcode_value?: string | null;
  item_number?: string | null;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  brand?: string | null;
  model?: string | null;
  condition?: string | null;
  cost?: number;
  listed_price?: number;
  min_acceptable_price?: number;
  on_hand_qty?: number;
  reserved_qty?: number;
  status?: ProductStatus | string;
  notes?: string | null;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export type ProductCardStat = {
  label: string;
  value: string | number;
  helper?: string;
};

export type ProductListFilters = {
  query?: string;
  status?: ProductStatus | "all";
  hasImages?: boolean | null;
  readiness?: ProductReadinessStatus | "all";
};