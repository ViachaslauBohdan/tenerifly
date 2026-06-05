const DEFAULT_SITE_URL = "https://tenerifly.io";

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
    return "tenerifly.io";
  }
}

/** Display brand in titles, footer, and JSON-LD (e.g. tenerifly.io or your custom domain). */
export const SITE_BRAND =
  process.env.NEXT_PUBLIC_SITE_NAME?.trim() || siteHostname();

export const SITE_HOST = siteHostname();
