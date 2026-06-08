const DEFAULT_SITE_URL = "https://tenerifejoy.com";
const DEFAULT_SITE_NAME = "Tenerife Joy";

function normalizeSiteUrl(url: string): string {
  return url.trim().replace(/\/$/, "");
}

/** Canonical public origin (no trailing slash). Override per deployment via NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
);

export function siteHostname(): string {
  try {
    return new URL(SITE_URL).hostname;
  } catch {
    return "tenerifejoy.com";
  }
}

/** Display brand in titles, footer, and JSON-LD. */
export const SITE_BRAND =
  process.env.NEXT_PUBLIC_SITE_NAME?.trim() || DEFAULT_SITE_NAME;

export const SITE_HOST = siteHostname();
