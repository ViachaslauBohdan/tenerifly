#!/usr/bin/env bash
# Interactive Railway setup for tenerife-tour.com (master-legacy).
# Prerequisite: npx @railway/cli login

set -euo pipefail

echo "=== Railway setup: tenerife-tour.com (master-legacy) ==="
echo "1. Run: npx @railway/cli login"
echo "2. Run: npx @railway/cli link"
echo "3. Create a new service in the dashboard linked to branch master-legacy"
echo "4. Set variables from deploy/tenerife-tour.com.env.example"
echo ""

read -r -p "Press Enter after login + link, or Ctrl-C to abort..."

npx @railway/cli variables set \
  NEXT_PUBLIC_SITE_URL=https://tenerife-tour.com \
  NEXT_PUBLIC_SITE_NAME=tenerife-tour.com

echo ""
echo "Set remaining variables (Strapi, Resend, Telegram) in the dashboard or:"
echo "  npx @railway/cli variables set KEY=value"
echo ""
echo "Then deploy:"
echo "  npx @railway/cli up"
echo ""
echo "Add custom domain in Networking → tenerife-tour.com"
echo "After DNS propagates, verify:"
echo "  ./deploy/verify-domain.sh https://tenerife-tour.com"
