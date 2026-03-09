-- =========================================================
-- LIQUIDATION HUB - STORAGE SETUP
-- =========================================================
-- Creates the product-images bucket and starter policies.
--
-- IMPORTANT:
-- - This assumes you are using Supabase Storage.
-- - Adjust policies later if you add authentication / roles.
-- =========================================================

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------
-- Optional cleanup for repeatable policy creation
-- ---------------------------------------------------------
drop policy if exists "Public can view product images" on storage.objects;
drop policy if exists "Authenticated users can upload product images" on storage.objects;
drop policy if exists "Authenticated users can update product images" on storage.objects;
drop policy if exists "Authenticated users can delete product images" on storage.objects;

-- ---------------------------------------------------------
-- Read policy
-- ---------------------------------------------------------
create policy "Public can view product images"
on storage.objects
for select
to public
using (bucket_id = 'product-images');

-- ---------------------------------------------------------
-- Insert policy
-- ---------------------------------------------------------
create policy "Authenticated users can upload product images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images');

-- ---------------------------------------------------------
-- Update policy
-- ---------------------------------------------------------
create policy "Authenticated users can update product images"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

-- ---------------------------------------------------------
-- Delete policy
-- ---------------------------------------------------------
create policy "Authenticated users can delete product images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images');

-- ---------------------------------------------------------
-- Helpful note
-- ---------------------------------------------------------
-- Expected storage path convention:
-- product-images/SKU1001/image-1.jpg
-- product-images/SKU1001/image-2.jpg
-- product-images/SKU1002/image-1.jpg