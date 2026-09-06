-- Fix: "new row violates row-level security policy for table leads"
-- Run once in Supabase → SQL Editor → Run

alter table public.leads enable row level security;

drop policy if exists "Anyone can submit leads" on public.leads;
create policy "Anyone can submit leads"
  on public.leads for insert
  to anon, authenticated
  with check (true);

-- Keep reads/updates admin-only (authenticated)
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
