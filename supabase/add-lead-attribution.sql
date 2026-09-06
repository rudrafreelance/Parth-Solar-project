-- Run in Supabase SQL Editor if leads table already exists.

alter table public.leads add column if not exists utm_source text not null default '';
alter table public.leads add column if not exists utm_medium text not null default '';
alter table public.leads add column if not exists utm_campaign text not null default '';
alter table public.leads add column if not exists utm_content text not null default '';
alter table public.leads add column if not exists utm_term text not null default '';
alter table public.leads add column if not exists landing_page text not null default '';
alter table public.leads add column if not exists referrer text not null default '';

create index if not exists leads_source_idx on public.leads (source);
create index if not exists leads_utm_source_idx on public.leads (utm_source);
