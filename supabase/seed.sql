-- =========================================================
-- LIQUIDATION HUB - SAMPLE SEED DATA
-- =========================================================
-- This file inserts sample products, images, orders,
-- order lines, listings, inquiries, and activity logs.
--
-- Safe to run on a fresh dev database.
-- =========================================================

-- ---------------------------------------------------------
-- Optional cleanup for repeatable local seeding
-- ---------------------------------------------------------
delete from public.activity_log;
delete from public.inquiries;
delete from public.marketplace_listings;
delete from public.order_items;
delete from public.orders;
delete from public.item_images;
delete from public.items;

-- ---------------------------------------------------------
-- Items
-- ---------------------------------------------------------
insert into public.items (
  sku,
  barcode_value,
  item_number,
  title,
  description,
  category,
  brand,
  model,
  condition,
  cost,
  listed_price,
  min_acceptable_price,
  on_hand_qty,
  reserved_qty,
  status,
  has_images,
  primary_image_url,
  notes
)
values
(
  'SKU1001',
  'SKU1001',
  'SKU1001',
  'Black Toaster Oven',
  'Compact black toaster oven with multi-function heating controls.',
  'Small Appliances',
  'Hamilton Beach',
  'HB-TO-12',
  'good',
  18.00,
  49.99,
  30.00,
  4,
  1,
  'ready',
  true,
  'https://images.unsplash.com/photo-1586208958839-06c17cacdf08?auto=format&fit=crop&w=1200&q=80',
  'Strong candidate for fast local sale.'
),
(
  'SKU1002',
  'SKU1002',
  'SKU1002',
  'Coffee Maker Stainless',
  'Stainless coffee maker ideal for quick local resale.',
  'Small Appliances',
  'Cuisinart',
  'CF-200',
  'good',
  14.00,
  39.99,
  25.00,
  2,
  0,
  'draft',
  false,
  null,
  'Needs photos before going live.'
),
(
  'SKU1003',
  'SKU1003',
  'SKU1003',
  'Portable Heater White',
  'Portable electric room heater in white finish.',
  'Home',
  'Honeywell',
  'HW-HTR-9',
  'used',
  10.00,
  29.99,
  18.00,
  1,
  0,
  'draft',
  false,
  null,
  'Seasonal item. Price aggressively.'
),
(
  'SKU1004',
  'SKU1004',
  'SKU1004',
  'Kitchen Blender Pro',
  'Countertop blender with glass jar and pulse control.',
  'Kitchen',
  'Oster',
  'BLD-700',
  'good',
  22.00,
  59.99,
  38.00,
  3,
  0,
  'ready',
  false,
  null,
  'Bundle opportunity with other kitchen items.'
),
(
  'SKU1005',
  'SKU1005',
  'SKU1005',
  'Compact Air Fryer',
  'Small countertop air fryer with removable basket.',
  'Kitchen',
  'Instant',
  'AF-4QT',
  'like_new',
  26.00,
  69.99,
  48.00,
  2,
  0,
  'ready',
  false,
  null,
  'High-interest category. Prioritize photos and listing.'
);

-- ---------------------------------------------------------
-- Item Images
-- ---------------------------------------------------------
insert into public.item_images (
  item_id,
  storage_path,
  public_url,
  file_name,
  sort_order,
  is_primary
)
select
  i.id,
  'product-images/SKU1001/image-1.jpg',
  'https://images.unsplash.com/photo-1586208958839-06c17cacdf08?auto=format&fit=crop&w=1200&q=80',
  'image-1.jpg',
  1,
  true
from public.items i
where i.sku = 'SKU1001';

insert into public.item_images (
  item_id,
  storage_path,
  public_url,
  file_name,
  sort_order,
  is_primary
)
select
  i.id,
  'product-images/SKU1001/image-2.jpg',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80',
  'image-2.jpg',
  2,
  false
from public.items i
where i.sku = 'SKU1001';

-- ---------------------------------------------------------
-- Orders
-- ---------------------------------------------------------
insert into public.orders (
  order_number,
  platform,
  buyer_name,
  buyer_email,
  buyer_phone,
  buyer_address,
  payment_method,
  payment_received,
  fulfillment_type,
  shipping_cost,
  total_value,
  shipped_value,
  order_status,
  order_date,
  ship_date,
  notes
)
values
(
  'ORD-1001',
  'facebook',
  'John Carter',
  'john.carter@example.com',
  '(555) 210-4432',
  'North York, Toronto, ON',
  'cash',
  true,
  'pickup',
  0,
  45.00,
  0,
  'awaiting_pickup',
  now(),
  null,
  'Buyer confirmed pickup for this evening.'
),
(
  'ORD-1002',
  'kijiji',
  'Maria Lopez',
  'maria.lopez@example.com',
  '(555) 333-9012',
  'Mississauga, ON',
  'etransfer',
  true,
  'shipping',
  12.00,
  39.99,
  39.99,
  'shipped',
  now() - interval '1 day',
  now(),
  'Tracking shared with buyer.'
),
(
  'ORD-1003',
  'direct',
  'David Kim',
  'david.kim@example.com',
  '(555) 882-1111',
  'Scarborough, ON',
  'cash',
  false,
  'pickup',
  0,
  59.99,
  0,
  'awaiting_payment',
  now(),
  null,
  'Buyer said they will confirm by tonight.'
);

-- ---------------------------------------------------------
-- Order Items
-- ---------------------------------------------------------
insert into public.order_items (
  order_id,
  item_id,
  qty,
  shipped_qty,
  unit_price
)
select
  o.id,
  i.id,
  1,
  0,
  45.00
from public.orders o
join public.items i on i.sku = 'SKU1001'
where o.order_number = 'ORD-1001';

insert into public.order_items (
  order_id,
  item_id,
  qty,
  shipped_qty,
  unit_price
)
select
  o.id,
  i.id,
  1,
  1,
  39.99
from public.orders o
join public.items i on i.sku = 'SKU1002'
where o.order_number = 'ORD-1002';

insert into public.order_items (
  order_id,
  item_id,
  qty,
  shipped_qty,
  unit_price
)
select
  o.id,
  i.id,
  1,
  0,
  59.99
from public.orders o
join public.items i on i.sku = 'SKU1004'
where o.order_number = 'ORD-1003';

-- ---------------------------------------------------------
-- Marketplace Listings
-- ---------------------------------------------------------
insert into public.marketplace_listings (
  item_id,
  platform,
  external_listing_id,
  listing_title,
  listing_price,
  listing_url,
  qty_listed,
  listing_status,
  listed_at,
  notes
)
select
  i.id,
  'facebook',
  'FB-SKU1001',
  'Black Toaster Oven',
  49.99,
  'https://www.facebook.com/marketplace/',
  1,
  'active',
  now(),
  'Starter demo listing.'
from public.items i
where i.sku = 'SKU1001';

insert into public.marketplace_listings (
  item_id,
  platform,
  external_listing_id,
  listing_title,
  listing_price,
  listing_url,
  qty_listed,
  listing_status,
  listed_at,
  notes
)
select
  i.id,
  'kijiji',
  'KJ-SKU1002',
  'Coffee Maker Stainless',
  39.99,
  'https://www.kijiji.ca/',
  1,
  'draft',
  now(),
  'Prepared but not fully posted yet.'
from public.items i
where i.sku = 'SKU1002';

insert into public.marketplace_listings (
  item_id,
  platform,
  external_listing_id,
  listing_title,
  listing_price,
  listing_url,
  qty_listed,
  listing_status,
  listed_at,
  notes
)
select
  i.id,
  'karrot',
  'KR-SKU1004',
  'Kitchen Blender Pro',
  59.99,
  null,
  1,
  'draft',
  now(),
  'Waiting for image set before publishing.'
from public.items i
where i.sku = 'SKU1004';

-- ---------------------------------------------------------
-- Inquiries
-- ---------------------------------------------------------
insert into public.inquiries (
  item_id,
  platform,
  buyer_name,
  buyer_email,
  buyer_phone,
  message_summary,
  offered_price,
  inquiry_status,
  follow_up_date,
  notes
)
select
  i.id,
  'facebook',
  'Sarah Lee',
  'sarah@example.com',
  '555-0001',
  'Is this still available? Can you do $40?',
  40.00,
  'negotiating',
  now() + interval '6 hours',
  'Interested in local pickup.'
from public.items i
where i.sku = 'SKU1001';

insert into public.inquiries (
  item_id,
  platform,
  buyer_name,
  buyer_email,
  buyer_phone,
  message_summary,
  offered_price,
  inquiry_status,
  follow_up_date,
  notes
)
select
  i.id,
  'kijiji',
  'David Kim',
  'david@example.com',
  '555-0002',
  'Can you ship this item?',
  null,
  'replied',
  now() + interval '1 day',
  'Asked about shipping cost.'
from public.items i
where i.sku = 'SKU1002';

insert into public.inquiries (
  item_id,
  platform,
  buyer_name,
  buyer_email,
  buyer_phone,
  message_summary,
  offered_price,
  inquiry_status,
  follow_up_date,
  notes
)
select
  i.id,
  'karrot',
  'Maya Patel',
  'maya@example.com',
  '555-0003',
  'I can pick it up this evening.',
  55.00,
  'scheduled_pickup',
  now() + interval '4 hours',
  'Likely to convert to order soon.'
from public.items i
where i.sku = 'SKU1004';

-- ---------------------------------------------------------
-- Activity Log
-- ---------------------------------------------------------
insert into public.activity_log (
  entity_type,
  entity_id,
  action_type,
  details
)
select
  'item',
  i.id,
  'created',
  jsonb_build_object(
    'sku', i.sku,
    'status', i.status,
    'source', 'seed.sql'
  )
from public.items i;

insert into public.activity_log (
  entity_type,
  entity_id,
  action_type,
  details
)
select
  'order',
  o.id,
  'created',
  jsonb_build_object(
    'order_number', o.order_number,
    'status', o.order_status,
    'platform', o.platform
  )
from public.orders o;

insert into public.activity_log (
  entity_type,
  entity_id,
  action_type,
  details
)
select
  'listing',
  l.id,
  'listing_created',
  jsonb_build_object(
    'platform', l.platform,
    'status', l.listing_status,
    'price', l.listing_price
  )
from public.marketplace_listings l;

insert into public.activity_log (
  entity_type,
  entity_id,
  action_type,
  details
)
select
  'inquiry',
  q.id,
  'inquiry_logged',
  jsonb_build_object(
    'platform', q.platform,
    'status', q.inquiry_status,
    'offered_price', q.offered_price
  )
from public.inquiries q;