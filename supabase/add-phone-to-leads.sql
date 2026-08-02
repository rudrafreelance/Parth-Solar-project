-- Run this once if your leads table was created earlier without phone.
alter table public.leads
  add column if not exists phone text not null default '';

alter table public.leads
  alter column email set default '';
