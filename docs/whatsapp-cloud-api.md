# Meta WhatsApp Cloud API (admin notify)

Website chat **does not open WhatsApp** for the visitor. The server sends a message to the admin via Meta Graph API.

## Env vars (server only — never `VITE_`)

Add these to **project root** `.env` (local) and **Vercel → Settings → Environment Variables** (production):

```bash
WHATSAPP_ACCESS_TOKEN=EAAxxxx...
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ADMIN_NUMBER=918003080020

# Recommended for production (business-initiated messages need a template)
WHATSAPP_TEMPLATE_NAME=website_chat_alert
WHATSAPP_TEMPLATE_LANGUAGE=en
```

| Variable | Where to get it |
|---|---|
| `WHATSAPP_ACCESS_TOKEN` | Meta Developer → App → WhatsApp → API Setup → temporary token, or System User permanent token |
| `WHATSAPP_PHONE_NUMBER_ID` | Same page → Phone number ID (not the display number) |
| `WHATSAPP_ADMIN_NUMBER` | Admin WhatsApp in digits only, country code, no `+` |
| `WHATSAPP_TEMPLATE_NAME` | Optional. Approved template name in WhatsApp Manager |

## Template (production)

Free-form text only works inside the **24-hour customer service window** (admin must have messaged your business number recently). For reliable alerts, create a template like:

**Name:** `website_chat_alert`  
**Body:** `New website chat from {{1}}. Phone: {{2}}. Message: {{3}}`

Then set `WHATSAPP_TEMPLATE_NAME=website_chat_alert`.

## Meta setup checklist

1. [Meta for Developers](https://developers.facebook.com/) → Create app → **Business** type  
2. Add product **WhatsApp**  
3. Connect a WhatsApp Business account / test number  
4. Copy **Phone number ID** + token into env  
5. Add admin number as a test recipient (during development) or go live with approved business number  
6. Deploy site to Vercel and set the same env vars there  

## API

`POST /api/whatsapp-message`

```json
{
  "name": "Rudra",
  "phone": "9876543210",
  "message": "I need a 5kW rooftop quote"
}
```
