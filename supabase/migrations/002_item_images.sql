create table if not exists public.item_images (
  id uuid primary key default gen_random_uuid(),

  item_id uuid not null
    references public.items(id)
    on delete cascade,

  storage_path text not null,
  public_url text,
  file_name text,

  sort_order integer not null default 0,
  is_primary boolean not null default false,

  created_at timestamptz not null default now(),

  constraint item_images_storage_path_not_blank check (length(trim(storage_path)) > 0),
  constraint item_images_sort_order_non_negative check (sort_order >= 0)
);

create index if not exists idx_item_images_item_id
  on public.item_images (item_id);

create index if not exists idx_item_images_created_at
  on public.item_images (created_at desc);

create index if not exists idx_item_images_item_sort
  on public.item_images (item_id, sort_order);

create unique index if not exists idx_item_images_item_primary_unique
  on public.item_images (item_id)
  where is_primary = true;

create or replace function public.sync_item_primary_image()
returns trigger
language plpgsql
as $$
declare
  v_item_id uuid;
  v_primary_url text;
  v_has_images boolean;
begin
  v_item_id := coalesce(new.item_id, old.item_id);

  select public_url
  into v_primary_url
  from public.item_images
  where item_id = v_item_id
  order by
    is_primary desc,
    sort_order asc,
    created_at asc
  limit 1;

  select exists (
    select 1
    from public.item_images
    where item_id = v_item_id
  )
  into v_has_images;

  update public.items
  set
    has_images = v_has_images,
    primary_image_url = v_primary_url,
    updated_at = now()
  where id = v_item_id;

  return null;
end;
$$;

drop trigger if exists trg_item_images_sync_after_insert on public.item_images;
create trigger trg_item_images_sync_after_insert
after insert on public.item_images
for each row
execute function public.sync_item_primary_image();

drop trigger if exists trg_item_images_sync_after_update on public.item_images;
create trigger trg_item_images_sync_after_update
after update on public.item_images
for each row
execute function public.sync_item_primary_image();

drop trigger if exists trg_item_images_sync_after_delete on public.item_images;
create trigger trg_item_images_sync_after_delete
after delete on public.item_images
for each row
execute function public.sync_item_primary_image();

comment on table public.item_images is
'Stores image metadata for each product. Files live in Supabase Storage and this table links them to items.';

comment on column public.item_images.item_id is
'Reference to the product record this image belongs to.';

comment on column public.item_images.storage_path is
'Path inside the storage bucket, e.g. product-images/SKU1001/image-1.jpg';

comment on column public.item_images.public_url is
'Public or signed URL used to preview the image in the UI.';

comment on column public.item_images.sort_order is
'Display order for image galleries. Lower values appear first.';

comment on column public.item_images.is_primary is
'Marks the image that should be used as the main product thumbnail.';