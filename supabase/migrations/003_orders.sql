create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),

  order_number text not null unique,
  platform text,

  buyer_name text,
  buyer_email text,
  buyer_phone text,
  buyer_address text,

  payment_method text,
  payment_received boolean not null default false,

  fulfillment_type text,
  shipping_cost numeric(12,2) not null default 0,
  total_value numeric(12,2) not null default 0,
  shipped_value numeric(12,2) not null default 0,

  order_status text not null default 'awaiting_payment',

  order_date timestamptz,
  ship_date timestamptz,

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint orders_order_number_not_blank check (length(trim(order_number)) > 0),
  constraint orders_shipping_cost_non_negative check (shipping_cost >= 0),
  constraint orders_total_value_non_negative check (total_value >= 0),
  constraint orders_shipped_value_non_negative check (shipped_value >= 0),
  constraint orders_status_valid check (
    order_status in (
      'awaiting_payment',
      'paid',
      'awaiting_pickup',
      'picked_up',
      'shipped',
      'completed',
      'cancelled',
      'refunded'
    )
  ),
  constraint orders_fulfillment_type_valid check (
    fulfillment_type is null
    or fulfillment_type in (
      'pickup',
      'shipping',
      'delivery'
    )
  )
);

create index if not exists idx_orders_order_number
  on public.orders (order_number);

create index if not exists idx_orders_status
  on public.orders (order_status);

create index if not exists idx_orders_platform
  on public.orders (platform);

create index if not exists idx_orders_order_date
  on public.orders (order_date desc);

create index if not exists idx_orders_created_at
  on public.orders (created_at desc);

create or replace function public.set_updated_at_orders()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_orders_set_updated_at on public.orders;

create trigger trg_orders_set_updated_at
before update on public.orders
for each row
execute function public.set_updated_at_orders();

comment on table public.orders is
'Main order header table for all sales, pickups, and shipments across marketplaces and direct buyers.';

comment on column public.orders.order_number is
'Human-friendly order identifier such as ORD-1001.';

comment on column public.orders.platform is
'Marketplace or sales channel, e.g. Facebook Marketplace, Kijiji, Karrot, Direct.';

comment on column public.orders.payment_received is
'Quick flag indicating whether payment has been collected.';

comment on column public.orders.fulfillment_type is
'How the order will be fulfilled: pickup, shipping, or delivery.';

comment on column public.orders.total_value is
'Total order value before or including shipping based on your business logic.';

comment on column public.orders.shipped_value is
'Value of goods already shipped or handed over, useful for partial fulfillment tracking.';

comment on column public.orders.order_status is
'Lifecycle state of the order from pending payment through completion or cancellation.';