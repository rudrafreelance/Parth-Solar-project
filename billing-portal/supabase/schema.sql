-- Ideal Energy billing portal schema
-- Run in Supabase SQL Editor once. Do not rename tables/columns without review.

create extension if not exists "pgcrypto";

-- Company profile (one row per auth user)
create table if not exists public.company_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  business_name text not null default 'IDEAL ENERGY',
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  gstin text not null default '',
  pan text not null default '',
  bank_name text not null default '',
  bank_account_name text not null default '',
  bank_account_no text not null default '',
  bank_ifsc text not null default '',
  state_name text not null default 'Gujarat',
  state_code text not null default '24',
  updated_at timestamptz not null default now()
);

-- Customers (sale) and suppliers (purchase)
create table if not exists public.parties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  party_type text not null check (party_type in ('customer', 'supplier')),
  name text not null,
  gstin text not null default '',
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  state_name text not null default 'Gujarat',
  state_code text not null default '24',
  created_at timestamptz not null default now()
);

create index if not exists parties_user_idx on public.parties (user_id, party_type, name);

-- Item catalog
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  hsn text not null default '',
  unit text not null default 'NOS',
  default_rate numeric(14,2) not null default 0,
  default_gst_rate numeric(6,2) not null default 18,
  created_at timestamptz not null default now()
);

create index if not exists items_user_idx on public.items (user_id, name);

-- Bills (sale + purchase)
create table if not exists public.bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bill_type text not null check (bill_type in ('sale', 'purchase')),
  invoice_no text not null,
  invoice_date date not null default current_date,
  party_id uuid references public.parties(id) on delete set null,
  party_name text not null default '',
  party_gstin text not null default '',
  party_address text not null default '',
  party_phone text not null default '',
  party_state_name text not null default 'Gujarat',
  party_state_code text not null default '24',
  taxable_total numeric(14,2) not null default 0,
  cgst_total numeric(14,2) not null default 0,
  sgst_total numeric(14,2) not null default 0,
  round_off numeric(14,2) not null default 0,
  grand_total numeric(14,2) not null default 0,
  amount_in_words text not null default '',
  pdf_url text not null default '',
  pdf_path text not null default '',
  irn text not null default '',
  ack_no text not null default '',
  ack_date date,
  eway_bill_no text not null default '',
  vehicle_no text not null default '',
  notes text not null default '',
  financial_year text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, bill_type, invoice_no, financial_year)
);

create index if not exists bills_user_date_idx on public.bills (user_id, invoice_date desc);
create index if not exists bills_user_type_idx on public.bills (user_id, bill_type, financial_year);

-- Line items (tax calculated per line)
create table if not exists public.bill_items (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  item_id uuid references public.items(id) on delete set null,
  description text not null,
  hsn text not null default '',
  qty numeric(14,3) not null default 0,
  unit text not null default 'NOS',
  rate numeric(14,2) not null default 0,
  amount numeric(14,2) not null default 0,
  gst_rate numeric(6,2) not null default 18,
  cgst_rate numeric(6,2) not null default 9,
  sgst_rate numeric(6,2) not null default 9,
  cgst_amount numeric(14,2) not null default 0,
  sgst_amount numeric(14,2) not null default 0,
  sort_order integer not null default 0
);

create index if not exists bill_items_bill_idx on public.bill_items (bill_id, sort_order);

-- Financial year helper (April–March). Example: 2026-04-01 → 2026-27
create or replace function public.current_financial_year(d date default current_date)
returns text
language sql
immutable
as $$
  select case
    when extract(month from d) >= 4
      then to_char(d, 'YYYY') || '-' || to_char(d + interval '1 year', 'YY')
    else to_char(d - interval '1 year', 'YYYY') || '-' || to_char(d, 'YY')
  end;
$$;

-- Next sale invoice number per user + FY (0001, 0002, …)
create or replace function public.next_sale_invoice_no(p_user_id uuid, p_date date default current_date)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  fy text := public.current_financial_year(p_date);
  last_no integer := 0;
begin
  select coalesce(max(nullif(regexp_replace(invoice_no, '[^0-9]', '', 'g'), '')::integer), 0)
    into last_no
  from public.bills
  where user_id = p_user_id
    and bill_type = 'sale'
    and financial_year = fy;

  return lpad((last_no + 1)::text, 4, '0');
end;
$$;

alter table public.company_settings enable row level security;
alter table public.parties enable row level security;
alter table public.items enable row level security;
alter table public.bills enable row level security;
alter table public.bill_items enable row level security;

drop policy if exists "company_settings_own" on public.company_settings;
create policy "company_settings_own" on public.company_settings
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "parties_own" on public.parties;
create policy "parties_own" on public.parties
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "items_own" on public.items;
create policy "items_own" on public.items
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "bills_own" on public.bills;
create policy "bills_own" on public.bills
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "bill_items_own" on public.bill_items;
create policy "bill_items_own" on public.bill_items
  for all to authenticated
  using (
    exists (
      select 1 from public.bills b
      where b.id = bill_id and b.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.bills b
      where b.id = bill_id and b.user_id = auth.uid()
    )
  );

insert into storage.buckets (id, name, public)
values ('bill-pdfs', 'bill-pdfs', true)
on conflict (id) do update set public = true;

drop policy if exists "Authenticated read bill pdfs" on storage.objects;
create policy "Authenticated read bill pdfs"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'bill-pdfs');

drop policy if exists "Authenticated upload bill pdfs" on storage.objects;
create policy "Authenticated upload bill pdfs"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'bill-pdfs' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Authenticated update bill pdfs" on storage.objects;
create policy "Authenticated update bill pdfs"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'bill-pdfs' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'bill-pdfs' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Authenticated delete bill pdfs" on storage.objects;
create policy "Authenticated delete bill pdfs"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'bill-pdfs' and (storage.foldername(name))[1] = auth.uid()::text);

grant execute on function public.next_sale_invoice_no(uuid, date) to authenticated;
grant execute on function public.current_financial_year(date) to authenticated;
