create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),

  order_id uuid not null
    references public.orders(id)
    on delete cascade,

  item_id uuid not null
    references public.items(id)
    on delete restrict,

  qty integer not null default 1,
  shipped_qty integer not null default 0,
  unit_price numeric(12,2) not null default 0,

  line_total numeric(12,2)
    generated always as (qty * unit_price) stored,

  created_at timestamptz not null default now(),

  constraint order_items_qty_positive check (qty > 0),
  constraint order_items_shipped_qty_non_negative check (shipped_qty >= 0),
  constraint order_items_shipped_qty_lte_qty check (shipped_qty <= qty),
  constraint order_items_unit_price_non_negative check (unit_price >= 0)
);

create index if not exists idx_order_items_order_id
  on public.order_items (order_id);

create index if not exists idx_order_items_item_id
  on public.order_items (item_id);

create index if not exists idx_order_items_order_item
  on public.order_items (order_id, item_id);

create index if not exists idx_order_items_created_at
  on public.order_items (created_at desc);

create or replace function public.recalculate_order_total()
returns trigger
language plpgsql
as $$
declare
  v_order_id uuid;
begin
  v_order_id := coalesce(new.order_id, old.order_id);

  update public.orders
  set
    total_value = coalesce((
      select sum(line_total)
      from public.order_items
      where order_id = v_order_id
    ), 0),
    shipped_value = coalesce((
      select sum(shipped_qty * unit_price)
      from public.order_items
      where order_id = v_order_id
    ), 0),
    updated_at = now()
  where id = v_order_id;

  return null;
end;
$$;

drop trigger if exists trg_order_items_recalculate_after_insert on public.order_items;
create trigger trg_order_items_recalculate_after_insert
after insert on public.order_items
for each row
execute function public.recalculate_order_total();

drop trigger if exists trg_order_items_recalculate_after_update on public.order_items;
create trigger trg_order_items_recalculate_after_update
after update on public.order_items
for each row
execute function public.recalculate_order_total();

drop trigger if exists trg_order_items_recalculate_after_delete on public.order_items;
create trigger trg_order_items_recalculate_after_delete
after delete on public.order_items
for each row
execute function public.recalculate_order_total();

comment on table public.order_items is
'Line items for each order. One row per product included in an order.';

comment on column public.order_items.order_id is
'Reference to the parent order header.';

comment on column public.order_items.item_id is
'Reference to the product being sold or reserved.';

comment on column public.order_items.qty is
'Total quantity ordered for this product line.';

comment on column public.order_items.shipped_qty is
'Quantity already shipped, delivered, or picked up for this line.';

comment on column public.order_items.unit_price is
'Sale price per unit for this order line.';

comment on column public.order_items.line_total is
'Computed total for the line based on qty multiplied by unit price.';