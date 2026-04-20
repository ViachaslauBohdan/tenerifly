/** Canarias.com rent-a-car affiliate: URL path + banner asset per app locale. */

export const CANARIAS_AFFILIATE_ID = "VA20022026";

const BASE = "https://rentacar.canarias.com";

/** Segments that exist on rentacar.canarias.com (en/de/fr/ru); others fall back to en. */
type CanariasRentacarPath = "en" | "de" | "fr" | "ru";

const appLocaleToCanariasPath: Record<string, CanariasRentacarPath> = {
  en: "en",
  ru: "ru",
  pl: "en",
  fr: "fr",
  uk: "en",
  de: "de",
  es: "en",
};

const canariasPathToBannerSuffix: Record<CanariasRentacarPath, string> = {
  en: "EN",
  de: "DE",
  fr: "FR",
  ru: "RU",
};

const DEFAULT_PATH: CanariasRentacarPath = "en";

function resolveCanariasPath(
  appLocale: string | undefined | null
): CanariasRentacarPath {
  const key =
    typeof appLocale === "string" ? appLocale.trim().toLowerCase() : "";
  if (!key) {
    return DEFAULT_PATH;
  }
  const path = appLocaleToCanariasPath[key];
  if (path) {
    return path;
  }
  return DEFAULT_PATH;
}

export function getCanariasRentacarAffiliateUrl(
  appLocale?: string | null
): string {
  const path = resolveCanariasPath(appLocale);
  return `${BASE}/${path}?affiliateid=${CANARIAS_AFFILIATE_ID}`;
}

export function getCanariasRentacarBannerImageUrl(
  appLocale?: string | null
): string {
  const path = resolveCanariasPath(appLocale);
  const suffix = canariasPathToBannerSuffix[path] ?? "EN";
  return `${BASE}/Content/images/banner/afiliados-themes/1/dim6${suffix}.jpg`;
}
