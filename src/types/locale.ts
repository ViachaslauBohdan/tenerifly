export type Locale = "en" | "pl" | "fr" | "ru" | "ua" | "de" | "es";

export interface LocaleConfig {
  code: Locale;
  name: string;
  flag: string;
}

export const LOCALES: LocaleConfig[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ua", name: "Українська", flag: "🇺🇦" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

/** Legacy URL segment → current locale (permanent redirect in middleware). */
export const LEGACY_LOCALE_PATHS: Record<string, Locale> = {
  uk: "ua",
};

/** i18n JSON bundles and Strapi often use `uk` as the Ukrainian content key. */
export function localeContentKey(locale: Locale | string): string {
  if (locale === "ua") return "uk";
  return locale;
}

/** Strapi `locale` query value for a URL/app locale (`ua` → `uk`). */
export function cmsLocale(locale: Locale | string | undefined): string {
  return localeContentKey(locale || "en");
}

export type CmsTextFields = {
  title?: string | null;
  description?: string | null;
  short_description?: string | null;
  locale?: string | null;
};

/**
 * Prefer localized CMS title/description; keep EN (or other fallback) when
 * the localized field is missing or blank.
 */
export function mergeCmsLocalizedText<T extends CmsTextFields>(
  localized: T | null | undefined,
  fallback: T
): T {
  if (!localized) return fallback;
  const pick = (
    value: string | null | undefined,
    fromFallback: string | null | undefined
  ) => {
    const trimmed = typeof value === "string" ? value.trim() : "";
    return trimmed || fromFallback || value || null;
  };
  return {
    ...fallback,
    ...localized,
    title: pick(localized.title, fallback.title),
    description: pick(localized.description, fallback.description),
    short_description: pick(
      localized.short_description,
      fallback.short_description
    ),
    locale: localized.locale || fallback.locale,
  };
}

/** Read a per-locale map (JSON bundle or inline copy) using URL locale `ua`. */
export function pickLocaleBundle<T>(
  bundle: Record<string, T>,
  locale: Locale | string
): T {
  const key = localeContentKey(locale);
  return bundle[key] ?? bundle.en;
}

export function localeDisplayCode(localeCode: string | undefined): string {
  if (!localeCode) return "";
  return localeCode.toUpperCase();
}
