create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),

  item_id uuid
    references public.items(id)
    on delete set null,

  platform text,
  buyer_name text,
  buyer_email text,
  buyer_phone text,

  message_summary text,
  offered_price numeric(12,2),

  inquiry_status text not null default 'new',
  follow_up_date timestamptz,
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint inquiries_offered_price_non_negative
    check (offered_price is null or offered_price >= 0),

  constraint inquiries_status_valid
    check (
      inquiry_status in (
        'new',
        'replied',
        'negotiating',
        'scheduled_pickup',
        'ghosted',
        'converted',
        'closed_lost'
      )
    )
);

create index if not exists idx_inquiries_item_id
  on public.inquiries (item_id);

create index if not exists idx_inquiries_platform
  on public.inquiries (platform);

create index if not exists idx_inquiries_status
  on public.inquiries (inquiry_status);

create index if not exists idx_inquiries_follow_up_date
  on public.inquiries (follow_up_date);

create index if not exists idx_inquiries_created_at
  on public.inquiries (created_at desc);

create or replace function public.set_updated_at_inquiries()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_inquiries_set_updated_at
on public.inquiries;

create trigger trg_inquiries_set_updated_at
before update on public.inquiries
for each row
execute function public.set_updated_at_inquiries();

comment on table public.inquiries is
'Buyer inquiry and negotiation log for marketplace leads and direct messages.';

comment on column public.inquiries.item_id is
'Optional link to the product the buyer asked about.';

comment on column public.inquiries.platform is
'Sales channel or marketplace where the inquiry came from.';

comment on column public.inquiries.message_summary is
'Short summary of the buyer message or conversation.';

comment on column public.inquiries.offered_price is
'Buyer offer amount if a price was proposed.';

comment on column public.inquiries.inquiry_status is
'Inquiry stage from new through converted or closed lost.';

comment on column public.inquiries.follow_up_date is
'Next scheduled follow-up time for the inquiry.';