create table if not exists public.marketplace_listings (
  id uuid primary key default gen_random_uuid(),

  item_id uuid not null
    references public.items(id)
    on delete cascade,

  platform text not null,
  external_listing_id text,

  listing_title text,
  listing_price numeric(12,2) not null default 0,
  listing_url text,

  qty_listed integer not null default 1,
  listing_status text not null default 'draft',

  listed_at timestamptz,
  updated_at timestamptz not null default now(),

  notes text,

  constraint marketplace_listings_platform_not_blank
    check (length(trim(platform)) > 0),

  constraint marketplace_listings_listing_price_non_negative
    check (listing_price >= 0),

  constraint marketplace_listings_qty_listed_positive
    check (qty_listed > 0),

  constraint marketplace_listings_status_valid
    check (
      listing_status in (
        'draft',
        'active',
        'pending_pickup',
        'sold',
        'expired',
        'deleted'
      )
    )
);

create index if not exists idx_marketplace_listings_item_id
  on public.marketplace_listings (item_id);

create index if not exists idx_marketplace_listings_platform
  on public.marketplace_listings (platform);

create index if not exists idx_marketplace_listings_status
  on public.marketplace_listings (listing_status);

create index if not exists idx_marketplace_listings_listed_at
  on public.marketplace_listings (listed_at desc);

create index if not exists idx_marketplace_listings_updated_at
  on public.marketplace_listings (updated_at desc);

create index if not exists idx_marketplace_listings_item_platform
  on public.marketplace_listings (item_id, platform);

create or replace function public.set_updated_at_marketplace_listings()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_marketplace_listings_set_updated_at
on public.marketplace_listings;

create trigger trg_marketplace_listings_set_updated_at
before update on public.marketplace_listings
for each row
execute function public.set_updated_at_marketplace_listings();

comment on table public.marketplace_listings is
'Tracks where each product is listed across marketplaces such as Facebook Marketplace, Kijiji, and Karrot.';

comment on column public.marketplace_listings.item_id is
'Reference to the product being listed.';

comment on column public.marketplace_listings.platform is
'Marketplace name such as Facebook Marketplace, Kijiji, Karrot, Craigslist, or Direct.';

comment on column public.marketplace_listings.external_listing_id is
'Optional marketplace-native listing identifier if available.';

comment on column public.marketplace_listings.listing_title is
'Title used in the marketplace listing.';

comment on column public.marketplace_listings.listing_price is
'Current asking price for the marketplace listing.';

comment on column public.marketplace_listings.listing_url is
'Direct URL to the live or draft marketplace listing when available.';

comment on column public.marketplace_listings.qty_listed is
'Quantity exposed on the marketplace listing.';

comment on column public.marketplace_listings.listing_status is
'Lifecycle state of the listing from draft through sold or deleted.';