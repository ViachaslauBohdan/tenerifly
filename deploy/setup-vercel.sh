#!/usr/bin/env bash
# Link and deploy master-legacy to Vercel.
# Prerequisite: npx vercel login

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== Vercel deploy: tenerife-tour.com (master-legacy) ==="
echo "Branch: $(git branch --show-current)"
echo ""
echo "Required env vars (set in Vercel dashboard or via vercel env add):"
echo "  NEXT_PUBLIC_SITE_URL=https://tenerife-tour.com"
echo "  NEXT_PUBLIC_SITE_NAME=tenerife-tour.com"
echo "  NEXT_PUBLIC_STRAPI_API_URL, NEXT_PUBLIC_STRAPI_API_TOKEN"
echo "  RESEND_API_KEY, RESEND_FROM_EMAIL, NEXT_DEFAULT_EMAIL_RECIPIENT"
echo ""
echo "See deploy/VERCEL-DEPLOY.md and deploy/tenerife-tour.com.env.example"
echo ""

if ! npx vercel whoami >/dev/null 2>&1; then
  echo "Not logged in. Run: npx vercel login"
  exit 1
fi

if [[ ! -d .vercel ]]; then
  echo "Linking project..."
  npx vercel link
fi

echo "Deploying to production..."
npx vercel --prod

echo ""
echo "Add tenerife-tour.com in Vercel → Settings → Domains, then update OVH DNS."
echo "Verify: ./deploy/verify-domain.sh https://tenerife-tour.com"
