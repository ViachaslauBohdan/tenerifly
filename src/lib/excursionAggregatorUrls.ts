import type { Locale } from "@/types/locale";

const ATLANTICO_AFFILIATE_ID = "3726";
const ATLANTICO_PATH = `/index.php?afId=${ATLANTICO_AFFILIATE_ID}`;

/**
 * Atlántico language switcher URLs (site footer/nav).
 * es uses www; en/de/fr/nl/it/ru use subdomains.
 */
export const ATLANTICO_LANGUAGE_BASE_URLS = {
  es: "https://www.atlanticoexcursiones.com",
  en: "https://en.atlanticoexcursiones.com",
  de: "https://de.atlanticoexcursiones.com",
  fr: "https://fr.atlanticoexcursiones.com",
  nl: "https://nl.atlanticoexcursiones.com",
  it: "https://it.atlanticoexcursiones.com",
  ru: "https://ru.atlanticoexcursiones.com",
} as const;

const ATLANTICO_FALLBACK_BASE = ATLANTICO_LANGUAGE_BASE_URLS.en;

/** Map Tenerifly locale → Atlántico base URL (pl/ua → English). */
const ATLANTICO_BY_SITE_LOCALE: Partial<Record<Locale, string>> = {
  en: ATLANTICO_LANGUAGE_BASE_URLS.en,
  de: ATLANTICO_LANGUAGE_BASE_URLS.de,
  es: ATLANTICO_LANGUAGE_BASE_URLS.es,
  fr: ATLANTICO_LANGUAGE_BASE_URLS.fr,
  ru: ATLANTICO_LANGUAGE_BASE_URLS.ru,
};

/** Atlántico Excursiones affiliate URL for the current site locale. */
export function getAtlanticoExcursionsAffiliateUrl(
  locale: Locale | string
): string {
  const base =
    ATLANTICO_BY_SITE_LOCALE[locale as Locale] ?? ATLANTICO_FALLBACK_BASE;
  return `${base}${ATLANTICO_PATH}`;
}
