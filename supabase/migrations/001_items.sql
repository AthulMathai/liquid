create extension if not exists pgcrypto;

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),

  sku text not null unique,
  barcode_value text,
  item_number text,

  title text,
  description text,
  category text,
  brand text,
  model text,
  condition text,

  cost numeric(12,2) not null default 0,
  listed_price numeric(12,2) not null default 0,
  min_acceptable_price numeric(12,2) not null default 0,

  on_hand_qty integer not null default 0,
  reserved_qty integer not null default 0,

  status text not null default 'draft',

  has_images boolean not null default false,
  primary_image_url text,

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint items_sku_not_blank check (length(trim(sku)) > 0),
  constraint items_on_hand_qty_non_negative check (on_hand_qty >= 0),
  constraint items_reserved_qty_non_negative check (reserved_qty >= 0),
  constraint items_reserved_qty_lte_on_hand check (reserved_qty <= on_hand_qty),
  constraint items_cost_non_negative check (cost >= 0),
  constraint items_listed_price_non_negative check (listed_price >= 0),
  constraint items_min_acceptable_price_non_negative check (min_acceptable_price >= 0),
  constraint items_status_valid check (
    status in (
      'draft',
      'ready',
      'listed',
      'partial_sold',
      'sold_out',
      'hold',
      'removed'
    )
  )
);

create index if not exists idx_items_sku
  on public.items (sku);

create index if not exists idx_items_barcode_value
  on public.items (barcode_value);

create index if not exists idx_items_status
  on public.items (status);

create index if not exists idx_items_created_at
  on public.items (created_at desc);

create index if not exists idx_items_has_images
  on public.items (has_images);

create or replace function public.set_updated_at_items()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_items_set_updated_at on public.items;

create trigger trg_items_set_updated_at
before update on public.items
for each row
execute function public.set_updated_at_items();

comment on table public.items is
'Master product table for liquidation inventory. One row per product or SKU.';

comment on column public.items.sku is
'Primary unique identifier used across inventory, scanning, images, and orders.';

comment on column public.items.barcode_value is
'Scannable value used by the scan screen. In version 1 this can match the SKU.';

comment on column public.items.item_number is
'Original imported item number or legacy product code.';

comment on column public.items.on_hand_qty is
'Physical quantity currently available in stock before reservation.';

comment on column public.items.reserved_qty is
'Quantity committed to open orders, pending pickup, or other temporary holds.';

comment on column public.items.has_images is
'Quick flag showing whether at least one image exists for this product.';

comment on column public.items.primary_image_url is
'Primary preview image for product cards and product detail display.';