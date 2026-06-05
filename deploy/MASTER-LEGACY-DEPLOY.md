# Deploy master-legacy to plan-tenerife.com

Full Tenerife travel portal (stays, cars, tours, world-tours, transfers) on a separate domain from tenerifly.io.

## Selected domain

| Item | Value |
|------|-------|
| **Domain** | `plan-tenerife.com` |
| **Branch** | `master-legacy` |
| **Availability** | Available (no DNS records at time of check) |
| **Rationale** | Tier 1 pick from plan — matches trip-planning hero UX and full-portal scope |

### Alternatives still available (if plan-tenerife.com is taken by registration time)

- `book-tenerife.com`
- `tenerife-trip.com`
- `all-tenerife.com`
- `tenerife-experiences.com`
- `tenerife-apartments.com`

## 1. Register the domain

1. Open a registrar (Cloudflare Registrar, Porkbun, Namecheap, etc.).
2. Search for **plan-tenerife.com** and register (~$10–15/year for .com).
3. Keep DNS management at the registrar or move nameservers to Cloudflare.

## 2. Create Railway service

1. [Railway dashboard](https://railway.app) → your project → **New** → **GitHub Repo** → `tenerifly`.
2. **Settings** → **Source** → branch: `master-legacy`.
3. **Variables** → paste from [`deploy/plan-tenerife.com.env.example`](plan-tenerife.com.env.example).
   - Copy Strapi, Resend, and Telegram values from the existing tenerifly.io service.
   - **Must set** `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_SITE_NAME` before the first deploy.
4. Trigger **Deploy**. Build runs `fetch-translations` and injects `plan-tenerife.com` into legal footer copy.

### CLI (after `npx @railway/cli login`)

```bash
railway link                    # select project
railway service                 # create or select the new legacy service
railway variables set NEXT_PUBLIC_SITE_URL=https://plan-tenerife.com
railway variables set NEXT_PUBLIC_SITE_NAME=plan-tenerife.com
# ... set remaining vars from plan-tenerife.com.env.example
railway up
```

## 3. Custom domain and DNS

1. Railway service → **Settings** → **Networking** → **Custom Domain**.
2. Add `plan-tenerife.com` (and optionally `www.plan-tenerife.com`).
3. Railway shows a CNAME target (e.g. `xxxx.up.railway.app`).
4. At your DNS provider:

| Type | Name | Value |
|------|------|-------|
| CNAME | `@` or `plan-tenerife.com` | Railway CNAME target |
| CNAME | `www` | Railway CNAME target (if using www) |

5. Wait for Railway SSL (usually 5–15 minutes).

## 4. Verify deployment

```bash
# Replace with live URL once deployed
SITE=https://plan-tenerife.com

curl -s "$SITE/robots.txt" | grep -i host
curl -s "$SITE/sitemap.xml" | head -5
curl -s "$SITE/en/aviso-legal" | grep -i plan-tenerife
```

Checklist:

- [ ] `robots.txt` host is `https://plan-tenerife.com`
- [ ] `sitemap.xml` URLs use `plan-tenerife.com`
- [ ] Footer legal text mentions `plan-tenerife.com` (not tenerifly.io)
- [ ] `/en/aviso-legal` loads with intermediary clause
- [ ] Home, `/tours`, apartments, cars pages work

## Architecture

```
tenerifly.io          → master branch        → excursions-focused
plan-tenerife.com     → master-legacy branch → full travel portal
tenerifly-strapi...   → shared Strapi CMS
```

Site URL is configured in [`src/lib/site.ts`](../src/lib/site.ts) via `NEXT_PUBLIC_SITE_URL` (build-time).
