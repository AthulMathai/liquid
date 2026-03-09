create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),

  entity_type text not null,
  entity_id uuid,

  action_type text not null,
  details jsonb,

  created_at timestamptz not null default now(),

  constraint activity_log_entity_type_not_blank
    check (length(trim(entity_type)) > 0),

  constraint activity_log_action_type_not_blank
    check (length(trim(action_type)) > 0)
);

create index if not exists idx_activity_log_entity_type
  on public.activity_log (entity_type);

create index if not exists idx_activity_log_entity_id
  on public.activity_log (entity_id);

create index if not exists idx_activity_log_action_type
  on public.activity_log (action_type);

create index if not exists idx_activity_log_created_at
  on public.activity_log (created_at desc);

create index if not exists idx_activity_log_entity_lookup
  on public.activity_log (entity_type, entity_id, created_at desc);

comment on table public.activity_log is
'General audit trail for important actions across products, orders, listings, inquiries, and image activity.';

comment on column public.activity_log.entity_type is
'Type of record affected, such as item, order, listing, inquiry, or image.';

comment on column public.activity_log.entity_id is
'UUID of the affected record when available.';

comment on column public.activity_log.action_type is
'Action performed, such as created, updated, reserved, uploaded_image, or completed.';

comment on column public.activity_log.details is
'Flexible JSON payload for storing useful context about the action.';