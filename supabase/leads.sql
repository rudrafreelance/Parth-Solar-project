-- Run this if you already ran the old schema and only need the leads table.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null default '',
  last_name text not null default '',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  message text not null default '',
  status text not null default 'new',
  source text not null default 'website_contact',
  utm_source text not null default '',
  utm_medium text not null default '',
  utm_campaign text not null default '',
  utm_content text not null default '',
  utm_term text not null default '',
  landing_page text not null default '',
  referrer text not null default '',
  created_at timestamptz not null default now()
);

-- If leads table already exists without phone / attribution:
alter table public.leads add column if not exists phone text not null default '';
alter table public.leads alter column email set default '';
alter table public.leads add column if not exists utm_source text not null default '';
alter table public.leads add column if not exists utm_medium text not null default '';
alter table public.leads add column if not exists utm_campaign text not null default '';
alter table public.leads add column if not exists utm_content text not null default '';
alter table public.leads add column if not exists utm_term text not null default '';
alter table public.leads add column if not exists landing_page text not null default '';
alter table public.leads add column if not exists referrer text not null default '';

create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_source_idx on public.leads (source);
create index if not exists leads_utm_source_idx on public.leads (utm_source);

alter table public.leads enable row level security;

drop policy if exists "Anyone can submit leads" on public.leads;
create policy "Anyone can submit leads"
  on public.leads for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated can read leads" on public.leads;
create policy "Authenticated can read leads"
  on public.leads for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can update leads" on public.leads;
create policy "Authenticated can update leads"
  on public.leads for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete leads" on public.leads;
create policy "Authenticated can delete leads"
  on public.leads for delete
  to authenticated
  using (true);
