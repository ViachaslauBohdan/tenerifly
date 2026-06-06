# Deploy master-legacy to Vercel (tenerife-tour.com)

## 1. Login and link (one-time)

```bash
npx vercel login
npx vercel link
```

When linking:
- **Scope:** your Vercel account/team
- **Project:** create new (e.g. `tenerife-tour`)
- **Directory:** `./`

## 2. Environment variables

In [Vercel dashboard](https://vercel.com) → Project → **Settings** → **Environment Variables**, add for **Production** (and Preview if needed):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://tenerife-tour.com` |
| `NEXT_PUBLIC_SITE_NAME` | `tenerife-tour.com` |
| `NEXT_PUBLIC_STRAPI_API_URL` | `https://tenerifly-strapi-production.up.railway.app` |
| `NEXT_PUBLIC_STRAPI_API_TOKEN` | *(from tenerifly.io / .env.local)* |
| `RESEND_API_KEY` | *(copy from existing deploy)* |
| `RESEND_FROM_EMAIL` | *(copy)* |
| `NEXT_DEFAULT_EMAIL_RECIPIENT` | *(copy)* |
| `TELEGRAM_BOT_TOKEN` | *(optional)* |
| `TELEGRAM_CHAT_ID` | *(optional)* |

Or via CLI:

```bash
npx vercel env add NEXT_PUBLIC_SITE_URL production
# paste https://tenerife-tour.com
```

Template: [`tenerife-tour.com.env.example`](tenerife-tour.com.env.example)

## 3. Git deploy (recommended)

1. Vercel dashboard → **Add New** → **Project** → import `tenerifly` from GitHub.
2. **Production Branch:** `master-legacy`
3. **Framework Preset:** Next.js (auto-detected)
4. Add env vars from step 2.
5. **Deploy**

Future pushes to `master-legacy` auto-deploy.

## 4. CLI deploy

```bash
git checkout master-legacy
npx vercel --prod
```

## 5. Custom domain (tenerife-tour.com)

1. Vercel project → **Settings** → **Domains** → Add `tenerife-tour.com` and `www.tenerife-tour.com`.
2. Vercel shows DNS records.
3. In OVH DNS zone, update:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` (Vercel apex) |
| CNAME | `www` | `cname.vercel-dns.com` |

4. Wait for SSL (usually minutes).

## 6. Verify

```bash
./deploy/verify-domain.sh https://tenerife-tour.com
```

## Notes

- Build runs `fetch-translations` — Strapi must be reachable from Vercel build servers.
- `engines.node` in `package.json` is `20.18.1`; Vercel uses Node 20.x automatically.
- Strapi stays on Railway; only the Next.js frontend runs on Vercel.
