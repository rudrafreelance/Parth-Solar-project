# Supabase setup (Ideal Energy Projects)

## 1. Create a Supabase project
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Open **Project Settings → API**
4. Copy:
   - Project URL
   - `anon` `public` key

## 2. Add env vars locally
Create `.env` in the **project root** (not inside `supabase/`):

```bash
cp .env.example .env
```

Fill:
```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Vite only loads `/home/.../solar-energy-website/.env`.  
A file at `supabase/.env` will be ignored.

## 3. Create table + storage
1. Open Supabase → **SQL Editor**
2. Paste and run everything in `schema.sql`

## 4. Create admin user
1. Supabase → **Authentication → Users**
2. Add user with email + password
3. Open your site at `/admin/login`
4. Sign in to the **Admin Panel** (separate from the public website)
5. Use:
   - `/admin` Dashboard
   - `/admin/projects` Upload/delete project photos
   - `/admin/leads` Website contact form enquiries
   - `/admin/settings` Backend connection checklist

If you already ran the old schema, also run `leads.sql` (or just `add-lead-attribution.sql` for UTM columns).

Ads tip: send traffic with UTMs, e.g.
`/calculator?utm_source=google&utm_medium=cpc&utm_campaign=rooftop_gujarat`

## 5. Vercel deploy
In Vercel → Project → Settings → Environment Variables, add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Redeploy after saving.

## Notes
- Images are stored in the public `project-images` bucket
- Anyone can view projects; only signed-in admins can upload/delete
- Until Supabase is connected, the site shows sample projects
