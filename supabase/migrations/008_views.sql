create or replace view public.items_with_available_qty as
select
  i.id,
  i.sku,
  i.barcode_value,
  i.item_number,
  i.title,
  i.description,
  i.category,
  i.brand,
  i.model,
  i.condition,
  i.cost,
  i.listed_price,
  i.min_acceptable_price,
  i.on_hand_qty,
  i.reserved_qty,
  greatest(i.on_hand_qty - i.reserved_qty, 0) as available_qty,
  i.status,
  i.has_images,
  i.primary_image_url,
  i.notes,
  i.created_at,
  i.updated_at
from public.items i;

create or replace view public.dashboard_stats as
select
  (select count(*) from public.items) as total_products,
  (select coalesce(sum(on_hand_qty), 0) from public.items) as total_units,
  (select coalesce(sum(greatest(on_hand_qty - reserved_qty, 0)), 0) from public.items) as total_available_units,
  (select count(*) from public.items where has_images = false) as products_missing_images,
  (select count(*) from public.items where status = 'ready') as ready_products,
  (select count(*) from public.marketplace_listings where listing_status = 'active') as active_listings,
  (
    select count(*)
    from public.orders
    where order_status not in ('completed', 'cancelled', 'refunded')
  ) as open_orders,
  (
    select count(*)
    from public.inquiries
    where inquiry_status in ('new', 'replied', 'negotiating', 'scheduled_pickup')
  ) as open_inquiries,
  (
    select coalesce(sum(total_value), 0)
    from public.orders
    where order_status in ('paid', 'awaiting_pickup', 'picked_up', 'shipped', 'completed')
  ) as gross_sales,
  (
    select coalesce(sum(shipped_value), 0)
    from public.orders
    where order_status in ('picked_up', 'shipped', 'completed')
  ) as fulfilled_sales;

create or replace view public.product_readiness as
select
  i.id,
  i.sku,
  i.title,
  i.status,
  i.has_images,
  i.on_hand_qty,
  i.reserved_qty,
  greatest(i.on_hand_qty - i.reserved_qty, 0) as available_qty,
  i.listed_price,
  i.min_acceptable_price,
  case
    when trim(coalesce(i.sku, '')) = '' then 'missing_sku'
    when trim(coalesce(i.description, '')) = '' then 'missing_description'
    when i.has_images = false then 'needs_images'
    when greatest(i.on_hand_qty - i.reserved_qty, 0) <= 0 then 'no_available_qty'
    when i.listed_price <= 0 then 'needs_price'
    else 'sell_ready'
  end as readiness_status
from public.items i;

create or replace view public.order_summary as
select
  o.id,
  o.order_number,
  o.platform,
  o.buyer_name,
  o.payment_received,
  o.fulfillment_type,
  o.order_status,
  o.order_date,
  o.ship_date,
  o.total_value,
  o.shipped_value,
  coalesce(sum(oi.qty), 0) as total_order_qty,
  coalesce(sum(oi.shipped_qty), 0) as total_shipped_qty,
  count(oi.id) as line_count
from public.orders o
left join public.order_items oi
  on oi.order_id = o.id
group by
  o.id,
  o.order_number,
  o.platform,
  o.buyer_name,
  o.payment_received,
  o.fulfillment_type,
  o.order_status,
  o.order_date,
  o.ship_date,
  o.total_value,
  o.shipped_value;

comment on view public.items_with_available_qty is
'Convenience view that adds available_qty as on_hand_qty minus reserved_qty.';

comment on view public.dashboard_stats is
'Single-row dashboard summary view for key platform metrics.';

comment on view public.product_readiness is
'Derived product readiness view used to identify which products still need pricing, images, or stock before listing.';

comment on view public.order_summary is
'Order-level summary view with aggregated quantities and line counts.';