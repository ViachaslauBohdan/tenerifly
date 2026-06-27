# Stripe card payments setup

## 1. Stripe account

1. Create a business account at [dashboard.stripe.com](https://dashboard.stripe.com) (Spain/EU entity).
2. **Settings → Payouts → Add bank account** — use your Spanish IBAN for settlements.
3. Copy API keys from **Developers → API keys** (start with test mode).

## 2. Environment variables

Add to `.env.local` (local) or your host's environment variables (Railway, Vercel):

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Secret key (`sk_test_…` or `sk_live_…`) — server only |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_…`) — server only |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Publishable key (`pk_test_…` or `pk_live_…`) |
| `STRAPI_API_URL` | Strapi base URL (no `/api` suffix) |
| `STRAPI_API_TOKEN` | Server-only token with create permission on `payment-transaction` |

### Railway (Next.js frontend)

1. Open your **frontend** service in [Railway](https://railway.app) (not the Strapi service).
2. **Variables** → add:
   - `STRIPE_SECRET_KEY` = `sk_test_…` or `sk_live_…`
   - (optional for webhook) `STRIPE_WEBHOOK_SECRET`, `STRAPI_API_TOKEN`
3. **Redeploy** the service after saving variables.

Railway does not read `.env.local` from git — variables must be set in the dashboard.

## 3. Webhook endpoint

After deploying to production:

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. URL: `https://tenerifejoy.com/api/stripe/webhook`
3. Event: `checkout.session.completed`
4. Copy the **Signing secret** into `STRIPE_WEBHOOK_SECRET`

For local testing, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 4. Strapi collection

Create the `payment-transaction` content type in Strapi — see [`STRAPI-PAYMENT-TRANSACTION.md`](./STRAPI-PAYMENT-TRANSACTION.md).

## 5. Test payment

Use test card `4242 4242 4242 4242`, any future expiry, any CVC.

Verify:

- Redirect to `/en/pay/success` (or your locale)
- New entry in Strapi **Payment transactions**
- Email/Telegram notification (if Resend/Telegram env vars are set)

## 6. Go live

1. Complete Stripe account verification.
2. Switch to live API keys and create a live webhook endpoint.
3. Enable Apple Pay / Google Pay and optional local methods in Stripe Dashboard if needed.
