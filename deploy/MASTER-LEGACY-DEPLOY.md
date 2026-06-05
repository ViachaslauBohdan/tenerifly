# Deploy master-legacy to tenerife-tour.com

Full Tenerife travel portal (stays, cars, tours, world-tours, transfers) on a separate domain from tenerifly.io.

## Selected domain

| Item | Value |
|------|-------|
| **Domain** | `tenerife-tour.com` |
| **Branch** | `master-legacy` |
| **DNS** | Registered (OVH nameservers) |
| **Rationale** | Tours-focused brand; clear Tenerife SEO keyword |

## 1. Domain DNS

Domain appears already registered (OVH: `dns16.ovh.net`). Point it to Railway:

1. Log in to [OVH domain panel](https://www.ovh.com/manager/) → **Domains** → `tenerife-tour.com` → **DNS zone**.
2. Add or update records after Railway gives you the CNAME target (step 3 below).

## 2. Create Railway service

1. [Railway dashboard](https://railway.app) → your project → **New** → **GitHub Repo** → `tenerifly`.
2. **Settings** → **Source** → branch: `master-legacy`.
3. **Variables** → paste from [`deploy/tenerife-tour.com.env.example`](tenerife-tour.com.env.example).
   - Copy Strapi, Resend, and Telegram values from the existing tenerifly.io service.
   - **Must set** `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_SITE_NAME` before the first deploy.
4. Trigger **Deploy**. Build runs `fetch-translations` and injects `tenerife-tour.com` into legal footer copy.

### CLI (after `npx @railway/cli login`)

```bash
railway link                    # select project
railway service                 # create or select the new legacy service
railway variables set NEXT_PUBLIC_SITE_URL=https://tenerife-tour.com
railway variables set NEXT_PUBLIC_SITE_NAME=tenerife-tour.com
# ... set remaining vars from tenerife-tour.com.env.example
railway up
```

## 3. Custom domain and DNS

1. Railway service → **Settings** → **Networking** → **Custom Domain**.
2. Add `tenerife-tour.com` (and optionally `www.tenerife-tour.com`).
3. Railway shows a CNAME target (e.g. `xxxx.up.railway.app`).
4. In OVH DNS zone:

| Type | Subdomain | Target |
|------|-----------|--------|
| CNAME | `www` | Railway CNAME target |
| A/CNAME | `@` | Railway instructions (CNAME flattening or A record) |

5. Wait for Railway SSL (usually 5–15 minutes).

## 4. Verify deployment

```bash
SITE=https://tenerife-tour.com
./deploy/verify-domain.sh "$SITE"
```

Or manually:

```bash
curl -s "$SITE/robots.txt" | grep -i host
curl -s "$SITE/sitemap.xml" | head -5
curl -s "$SITE/en/aviso-legal" | grep -i tenerife-tour
```

Checklist:

- [ ] `robots.txt` host is `https://tenerife-tour.com`
- [ ] `sitemap.xml` URLs use `tenerife-tour.com`
- [ ] Footer legal text mentions `tenerife-tour.com` (not tenerifly.io)
- [ ] `/en/aviso-legal` loads with intermediary clause
- [ ] Home, `/tours`, apartments, cars pages work

## Architecture

```
tenerifly.io          → master branch        → excursions-focused
tenerife-tour.com     → master-legacy branch → full travel portal
tenerifly-strapi...   → shared Strapi CMS
```

Site URL is configured in [`src/lib/site.ts`](../src/lib/site.ts) via `NEXT_PUBLIC_SITE_URL` (build-time).
