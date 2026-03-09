// ==============================
// App Info
// ==============================

export const APP_NAME = "Liquidation Hub";
export const APP_TAGLINE = "Fast inventory liquidation & marketplace management";

export const DEFAULT_CURRENCY = "CAD";
export const DEFAULT_LOCALE = "en-CA";

// ==============================
// Inventory / Product Status
// ==============================

export const PRODUCT_STATUSES = [
  "draft",
  "ready",
  "listed",
  "partial_sold",
  "sold_out",
  "hold",
  "removed",
] as const;

// ==============================
// Marketplace Platforms
// ==============================

export const MARKETPLACE_PLATFORMS = [
  "facebook",
  "kijiji",
  "karrot",
  "craigslist",
  "shopify",
  "direct",
];

// Display labels
export const MARKETPLACE_LABELS: Record<string, string> = {
  facebook: "Facebook Marketplace",
  kijiji: "Kijiji",
  karrot: "Karrot",
  craigslist: "Craigslist",
  shopify: "Shopify Store",
  direct: "Direct Sale",
};

// ==============================
// Listing Status
// ==============================

export const LISTING_STATUSES = [
  "draft",
  "active",
  "pending_pickup",
  "sold",
  "expired",
  "deleted",
] as const;

// ==============================
// Order Status
// ==============================

export const ORDER_STATUSES = [
  "awaiting_payment",
  "paid",
  "awaiting_pickup",
  "picked_up",
  "shipped",
  "completed",
  "cancelled",
  "refunded",
] as const;

// ==============================
// Inquiry Status
// ==============================

export const INQUIRY_STATUSES = [
  "new",
  "replied",
  "negotiating",
  "scheduled_pickup",
  "ghosted",
  "converted",
  "closed_lost",
] as const;

// ==============================
// Fulfillment Types
// ==============================

export const FULFILLMENT_TYPES = [
  "pickup",
  "shipping",
  "delivery",
] as const;

// ==============================
// Scanner Settings
// ==============================

export const SCANNER_TIMEOUT_MS = 1500;
export const SCANNER_MIN_LENGTH = 4;

// ==============================
// Image Upload Settings
// ==============================

export const MAX_IMAGE_UPLOAD = 10;
export const MAX_IMAGE_SIZE_MB = 10;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

// ==============================
// Dashboard Defaults
// ==============================

export const DASHBOARD_READINESS_LIMIT = 25;

// ==============================
// Pagination Defaults
// ==============================

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 200;

// ==============================
// Misc
// ==============================

export const EMPTY_PLACEHOLDER = "—";