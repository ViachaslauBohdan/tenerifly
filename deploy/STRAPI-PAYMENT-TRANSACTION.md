# Strapi: payment-transaction content type

Create this collection in Strapi Admin on Railway (`tenerifly-strapi-production`).

## Content-Type Builder

**Display name:** Payment transaction  
**API ID (singular):** `payment-transaction`  
**API ID (plural):** `payment-transactions`

### Fields

| Name | Type | Required | Notes |
|------|------|----------|-------|
| `amount` | Decimal | Yes | Payment amount in EUR |
| `currency` | Text | Yes | Default: `EUR` |
| `categories` | JSON | Yes | Array, e.g. `["tour","car"]` |
| `customerName` | Text | Yes | |
| `customerEmail` | Email | Yes | |
| `customerPhone` | Text | No | |
| `customerNote` | Text | No | |
| `locale` | Text | Yes | e.g. `en`, `de`, `ua` |
| `stripeSessionId` | Text | Yes | Unique Stripe Checkout session ID |
| `stripePaymentIntentId` | Text | No | |
| `status` | Enumeration | Yes | Values: `completed`, `refunded` |
| `paidAt` | DateTime | Yes | |

## API permissions

**Settings → Users & Permissions → Roles → Authenticated** (or the role tied to your API token):

- `payment-transaction` → **create**, **find**

The Next.js webhook uses a **server-only** `STRAPI_API_TOKEN` with create access. Do not expose this token in `NEXT_PUBLIC_*` variables.

## Verify

After creating the type, test with:

```bash
curl -X POST "$STRAPI_API_URL/api/payment-transactions" \
  -H "Authorization: Bearer $STRAPI_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data":{"amount":1,"currency":"EUR","categories":["tour"],"customerName":"Test","customerEmail":"test@example.com","locale":"en","stripeSessionId":"cs_test_123","status":"completed","paidAt":"2026-01-01T12:00:00.000Z"}}'
```
