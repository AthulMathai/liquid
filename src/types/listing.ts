export type ListingStatus =
  | "draft"
  | "active"
  | "pending_pickup"
  | "sold"
  | "expired"
  | "deleted";

export type MarketplacePlatform =
  | "facebook"
  | "kijiji"
  | "karrot"
  | "craigslist"
  | "shopify"
  | "direct"
  | string;

export type MarketplaceListing = {
  id: string;
  item_id: string;
  platform: MarketplacePlatform;
  external_listing_id: string | null;
  listing_title: string | null;
  listing_price: number;
  listing_url: string | null;
  qty_listed: number;
  listing_status: ListingStatus | string;
  listed_at: string | null;
  updated_at: string;
  notes: string | null;
};

export type CreateMarketplaceListingInput = {
  item_id: string;
  platform: MarketplacePlatform;
  external_listing_id?: string | null;
  listing_title?: string | null;
  listing_price?: number;
  listing_url?: string | null;
  qty_listed?: number;
  listing_status?: ListingStatus | string;
  listed_at?: string | null;
  notes?: string | null;
};

export type UpdateMarketplaceListingInput = Partial<
  Omit<CreateMarketplaceListingInput, "item_id" | "platform">
>;

export type ListingListFilters = {
  platform?: MarketplacePlatform | "all";
  status?: ListingStatus | "all";
  item_id?: string | null;
  query?: string;
};

export type ListingMetric = {
  label: string;
  value: string | number;
  helper?: string;
};