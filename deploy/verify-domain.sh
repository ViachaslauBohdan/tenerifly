#!/usr/bin/env bash
# Smoke-test a deployed master-legacy site for correct domain configuration.
# Usage: ./deploy/verify-domain.sh https://tenerifejoy.com

set -euo pipefail

SITE="${1:-}"
if [[ -z "$SITE" ]]; then
  echo "Usage: $0 https://your-domain.com"
  exit 1
fi

SITE="${SITE%/}"
HOST="$(echo "$SITE" | sed -E 's#https?://##')"

echo "Checking $SITE ..."

robots="$(curl -fsSL "$SITE/robots.txt")"
if echo "$robots" | grep -q "$HOST"; then
  echo "OK  robots.txt references $HOST"
else
  echo "FAIL robots.txt missing $HOST"
  echo "$robots"
  exit 1
fi

sitemap="$(curl -fsSL "$SITE/sitemap.xml" | head -c 2000)"
if echo "$sitemap" | grep -q "$HOST"; then
  echo "OK  sitemap.xml uses $HOST"
else
  echo "FAIL sitemap.xml missing $HOST"
  exit 1
fi

legal="$(curl -fsSL "$SITE/en/aviso-legal" | head -c 8000)"
if echo "$legal" | grep -qi "intermediary\|intermediario\|Vermittler\|pośrednik"; then
  echo "OK  /en/aviso-legal loads legal content"
else
  echo "WARN /en/aviso-legal may not render intermediary text (check manually)"
fi

home="$(curl -fsSL "$SITE/en" | head -c 12000)"
if echo "$home" | grep -q "$HOST"; then
  echo "OK  homepage references $HOST"
else
  echo "WARN homepage may not include hostname in first 12KB (footer is lower — check manually)"
fi

echo "Done."
