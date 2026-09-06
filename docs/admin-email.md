# Admin email alerts (Resend)

When someone clicks **Get my estimate** or submits a lead, the server emails `ADMIN_EMAIL` and also tries WhatsApp.

## Setup (5 min)

1. Create a free account at [resend.com](https://resend.com)
2. API Keys → **Create API Key**
3. Add to project root `.env` and Vercel env:

```bash
RESEND_API_KEY=re_xxxxxxxx
ADMIN_EMAIL=your-inbox@gmail.com
EMAIL_FROM=Ideal Energy <onboarding@resend.dev>
```

4. Restart `npm run dev`

With `onboarding@resend.dev`, Resend only delivers to **your Resend account email** until you verify a domain. For production, add your domain in Resend and set:

```bash
EMAIL_FROM=Ideal Energy <leads@yourdomain.com>
```

## Test

1. Open `/calculator`
2. Click **Get my estimate**
3. Check admin inbox (and spam)
