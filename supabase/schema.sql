  -- Ideal Energy — Projects gallery
  -- Run this in Supabase SQL Editor once.

  -- 1) Projects table
  create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    location text not null default '',
    output text not null default '',
    type text not null default 'Residential',
    description text not null default '',
    image_url text not null,
    image_path text,
    featured boolean not null default false,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
  );

  create index if not exists projects_featured_idx on public.projects (featured, sort_order, created_at desc);
  create index if not exists projects_created_idx on public.projects (created_at desc);

  -- 2) Row Level Security
  alter table public.projects enable row level security;

  drop policy if exists "Public can read projects" on public.projects;
  create policy "Public can read projects"
    on public.projects for select
    to anon, authenticated
    using (true);

  drop policy if exists "Authenticated can insert projects" on public.projects;
  create policy "Authenticated can insert projects"
    on public.projects for insert
    to authenticated
    with check (true);

  drop policy if exists "Authenticated can update projects" on public.projects;
  create policy "Authenticated can update projects"
    on public.projects for update
    to authenticated
    using (true)
    with check (true);

  drop policy if exists "Authenticated can delete projects" on public.projects;
  create policy "Authenticated can delete projects"
    on public.projects for delete
    to authenticated
    using (true);

  -- 3) Storage bucket for project images
  insert into storage.buckets (id, name, public)
  values ('project-images', 'project-images', true)
  on conflict (id) do update set public = true;

  drop policy if exists "Public can view project images" on storage.objects;
  create policy "Public can view project images"
    on storage.objects for select
    to anon, authenticated
    using (bucket_id = 'project-images');

  drop policy if exists "Authenticated can upload project images" on storage.objects;
  create policy "Authenticated can upload project images"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'project-images');

  drop policy if exists "Authenticated can update project images" on storage.objects;
  create policy "Authenticated can update project images"
    on storage.objects for update
    to authenticated
    using (bucket_id = 'project-images')
    with check (bucket_id = 'project-images');

  drop policy if exists "Authenticated can delete project images" on storage.objects;
  create policy "Authenticated can delete project images"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'project-images');

  -- 4) Optional seed (remove if you only want your own uploads)
  insert into public.projects (title, location, output, type, description, image_url, featured, sort_order)
  values
    (
      'Hillside family home',
      'Austin, Texas',
      '12.4 kW',
      'Residential',
      'Rooftop solar designed for a growing family home with strong afternoon sun exposure.',
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=85',
      true,
      1
    ),
    (
      'Westfield distribution hub',
      'Phoenix, Arizona',
      '286 kW',
      'Commercial',
      'Large rooftop array reducing daytime operating costs for a logistics facility.',
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1400&q=85',
      true,
      2
    ),
    (
      'Oak & Pine eco retreat',
      'Boulder, Colorado',
      '48.6 kW',
      'Hospitality',
      'Clean energy system powering guest facilities across a mountain eco retreat.',
      'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1400&q=85',
      true,
      3
    );

  -- 5) Leads from website contact form + calculator
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
