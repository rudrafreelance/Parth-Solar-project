# Google Ads lead automation (Ideal Energy)

Paid Google Search → `/go/solar` → calculator / contact → Supabase lead → admin email + WhatsApp → thank-you conversion.

## Final URL (campaign)

```
https://YOUR_DOMAIN/go/solar?utm_source=google&utm_medium=cpc&utm_campaign=rooftop_gujarat
```

Replace `YOUR_DOMAIN` with `VITE_SITE_URL` (e.g. Vercel domain).  
Change `utm_campaign` per campaign/city (e.g. `rooftop_ahmedabad`).

Landing page is `noindex` so it does not compete with organic SEO pages.

## Before you spend

1. Supabase leads table + attribution columns (`supabase/add-lead-attribution.sql`)
2. Admin email (`RESEND_API_KEY`, `ADMIN_EMAIL`) — see `docs/admin-email.md`
3. WhatsApp Cloud API (optional but recommended) — see `docs/whatsapp-cloud-api.md`
4. Deploy site to Vercel with the same env vars
5. Test manually:
   - Open `/go/solar?utm_source=google&utm_medium=cpc&utm_campaign=test`
   - Complete calculator → thank-you
   - Confirm lead in `/admin/leads` with source **google_ads**
   - Confirm admin email / WhatsApp

## Keyword themes (start)

| Intent | Example keywords |
|---|---|
| Cost | solar panel cost, rooftop solar price |
| Local | solar installer Ahmedabad, solar panel near me |
| Subsidy | solar subsidy, PM Surya Ghar solar |
| Commercial | commercial solar rooftop |

Use **exact / phrase** match first. Add call extensions (80030 80020).

## Budget (test)

- One city / one campaign: **₹500–1,500 per day**
- Success = cost per **qualified lead** (thank-you + phone in admin), not clicks

## Conversion tracking

Add to root `.env` and Vercel:

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXX
VITE_GOOGLE_ADS_ID=AW-XXXXXXXX
VITE_GOOGLE_ADS_CONVERSION_LABEL=xxxxxxxx
```

1. Google Ads → Goals → Conversions → create **Website** conversion (lead)
2. Copy **Conversion ID** (`AW-…`) and **label**
3. Redeploy
4. Submit a test lead → thank-you fires `generate_lead` + Ads `conversion`

## Admin

- **Leads** filter by `google_ads`
- **Settings** shows the suggested final URL

## What this is not

Google does not let you scrape people who searched. Ads + this landing page is the legal automation path.
