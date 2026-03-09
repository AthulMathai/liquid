export type DashboardStats = {
  total_products: number;
  total_units: number;
  total_available_units: number;
  products_missing_images: number;
  ready_products: number;
  active_listings: number;
  open_orders: number;
  open_inquiries: number;
  gross_sales: number;
  fulfilled_sales: number;
};

export type DashboardProductReadinessStatus =
  | "missing_sku"
  | "missing_description"
  | "needs_images"
  | "no_available_qty"
  | "needs_price"
  | "sell_ready";

export type DashboardProductReadiness = {
  id: string;
  sku: string;
  title: string | null;
  status: string;
  has_images: boolean;
  on_hand_qty: number;
  reserved_qty: number;
  available_qty: number;
  listed_price: number;
  min_acceptable_price: number;
  readiness_status: DashboardProductReadinessStatus;
};

export type DashboardSnapshot = {
  stats: DashboardStats;
  readiness: DashboardProductReadiness[];
};

export type DashboardMetricCard = {
  label: string;
  value: number | string;
  helper?: string;
  icon?: string;
};

export type DashboardChartPoint = {
  label: string;
  value: number;
};

export type DashboardSalesSummary = {
  gross_sales: number;
  fulfilled_sales: number;
  open_orders: number;
};

export type DashboardInventorySummary = {
  total_products: number;
  total_units: number;
  total_available_units: number;
  products_missing_images: number;
};

export type DashboardActivity = {
  id: string;
  entity_type: string;
  entity_id: string | null;
  action_type: string;
  created_at: string;
  details?: Record<string, unknown> | null;
};